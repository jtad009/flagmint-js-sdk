import type { Transport } from '@/core/transports/Transport';
import { logger } from '@/core/helpers/logger';

const LOCK_TTL_MS = 4000;
const HEARTBEAT_MS = 1500;
const FOLLOWER_WAIT_MS = 5000;
const CONTEXT_WAIT_MS = 5000;

export type ShareRole = 'leader' | 'follower';

type ShareMessage<C = unknown, T = unknown> =
  | { type: 'hello'; memberId: string }
  | { type: 'alive'; memberId: string }
  | { type: 'flags'; memberId: string; flags: Record<string, T> }
  | { type: 'error'; memberId: string; message: string; code?: string; retryAfter?: number }
  | { type: 'context-request'; memberId: string; requestId: string; context: C }
  | { type: 'context-result'; requestId: string; flags?: Record<string, T>; error?: { message: string; code?: string } }
  | { type: 'bye'; memberId: string };

export interface ShareStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ShareChannel {
  postMessage(data: unknown): void;
  close(): void;
  onmessage: ((event: { data: unknown }) => void) | null;
}

export interface ConnectionShareOptions {
  channelFactory?: (name: string) => ShareChannel;
  storage?: ShareStorage;
  now?: () => number;
  setTimer?: (handler: () => void, ms: number) => ReturnType<typeof setInterval>;
  clearTimer?: (id: ReturnType<typeof setInterval>) => void;
}

interface LockRecord {
  ownerId: string;
  expiresAt: number;
}

/**
 * True in same-origin browser documents (including sibling iframes).
 * False in Node cluster workers — each process must keep its own stream.
 */
export function isConnectionSharingAvailable(): boolean {
  return typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined';
}

function randomMemberId(): string {
  return `fm_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

/**
 * Elects a single SSE/long-poll leader per API key across same-origin
 * documents (tabs and iframes). Followers receive flag snapshots over
 * BroadcastChannel and forward context updates to the leader.
 */
export class ConnectionShareHub<C = Record<string, unknown>, T = unknown> {
  readonly memberId = randomMemberId();
  private role: ShareRole = 'follower';
  private channel: ShareChannel | null = null;
  private heartbeatId: ReturnType<typeof setInterval> | null = null;
  private watchId: ReturnType<typeof setInterval> | null = null;
  private closed = false;
  private latestFlags: Record<string, T> | null = null;
  private flagsWaiters: Array<(flags: Record<string, T>) => void> = [];
  private contextWaiters = new Map<string, {
    resolve: (flags: Record<string, T>) => void;
    reject: (err: Error) => void;
  }>();
  private onPromoteCallback?: () => void | Promise<void>;
  private leaderContextHandler?: (context: C) => Promise<Record<string, T>>;
  private followerFlagsCallback?: (flags: Record<string, T>) => void;
  private followerErrorCallback?: (error: Error) => void;
  private readonly now: () => number;
  private readonly storage: ShareStorage | null;
  private readonly channelFactory?: (name: string) => ShareChannel;
  private readonly setTimer: (handler: () => void, ms: number) => ReturnType<typeof setInterval>;
  private readonly clearTimer: (id: ReturnType<typeof setInterval>) => void;
  private readonly lockKey: string;
  private readonly channelName: string;

  constructor(
    private readonly apiKey: string,
    options: ConnectionShareOptions = {}
  ) {
    this.lockKey = `flagmint_share_lock:${apiKey}`;
    this.channelName = `flagmint-share:${apiKey}`;
    this.now = options.now ?? (() => Date.now());
    this.storage = options.storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);
    this.channelFactory = options.channelFactory;
    this.setTimer = options.setTimer ?? ((handler, ms) => setInterval(handler, ms));
    this.clearTimer = options.clearTimer ?? ((id) => clearInterval(id));
  }

  get currentRole(): ShareRole {
    return this.role;
  }

  async join(): Promise<ShareRole> {
    this.channel = this.openChannel();
    if (!this.channel) {
      this.role = 'leader';
      return this.role;
    }

    this.channel.onmessage = (event) => this.handleMessage(event.data as ShareMessage<C, T>);

    if (this.tryAcquireLock()) {
      this.becomeLeader();
    } else {
      this.role = 'follower';
      this.channel.postMessage({ type: 'hello', memberId: this.memberId });
      this.watchId = this.setTimer(() => this.maybeTakeover(), HEARTBEAT_MS);
      logger.log('[ConnectionShare] Joined as follower; waiting for leader flag snapshot.');
    }

    return this.role;
  }

  onPromote(callback: () => void | Promise<void>): void {
    this.onPromoteCallback = callback;
  }

  setLeaderContextHandler(handler: (context: C) => Promise<Record<string, T>>): void {
    this.leaderContextHandler = handler;
  }

  broadcastFlags(flags: Record<string, T>): void {
    if (this.role !== 'leader' || !this.channel) return;
    this.latestFlags = flags;
    this.channel.postMessage({ type: 'flags', memberId: this.memberId, flags });
  }

  broadcastError(error: Error): void {
    if (this.role !== 'leader' || !this.channel) return;
    this.channel.postMessage({
      type: 'error',
      memberId: this.memberId,
      message: error.message,
      code: (error as { code?: string }).code,
      retryAfter: (error as { retryAfter?: number }).retryAfter,
    });
  }

  createFollowerTransport(): Transport<C, T> {
    return {
      init: async () => {
        const flags = await this.waitForFlags();
        this.followerFlagsCallback?.(flags);
      },
      fetchFlags: (context: C) => this.requestContextUpdate(context),
      destroy: () => undefined,
      onFlagsUpdated: (callback) => {
        this.followerFlagsCallback = callback;
      },
      onError: (callback) => {
        this.followerErrorCallback = callback;
      },
    };
  }

  destroy(): void {
    if (this.closed) return;
    this.closed = true;
    if (this.heartbeatId) this.clearTimer(this.heartbeatId);
    if (this.watchId) this.clearTimer(this.watchId);
    this.heartbeatId = null;
    this.watchId = null;

    if (this.role === 'leader') {
      this.releaseLock();
      this.channel?.postMessage({ type: 'bye', memberId: this.memberId });
    }

    const channel = this.channel;
    this.channel = null;
    if (channel) {
      setTimeout(() => channel.close(), 0);
    }
    this.flagsWaiters = [];
    this.contextWaiters.forEach(({ reject }) => reject(new Error('Connection share hub closed.')));
    this.contextWaiters.clear();
  }

  private openChannel(): ShareChannel | null {
    if (this.channelFactory) {
      return this.channelFactory(this.channelName);
    }
    if (typeof BroadcastChannel === 'undefined') {
      return null;
    }
    return new BroadcastChannel(this.channelName) as unknown as ShareChannel;
  }

  private becomeLeader(): void {
    this.role = 'leader';
    if (this.watchId) {
      this.clearTimer(this.watchId);
      this.watchId = null;
    }
    this.heartbeatId = this.setTimer(() => {
      this.refreshLock();
      this.channel?.postMessage({ type: 'alive', memberId: this.memberId });
    }, HEARTBEAT_MS);
    logger.log('[ConnectionShare] Elected leader for API key share group.');
  }

  private async maybeTakeover(): Promise<void> {
    if (this.closed || this.role === 'leader') return;
    if (!this.tryAcquireLock()) return;

    this.becomeLeader();
    try {
      await this.onPromoteCallback?.();
    } catch (err) {
      logger.warn('[ConnectionShare] Follower failed to promote to leader.', err);
      this.releaseLock();
      this.role = 'follower';
    }
  }

  private handleMessage(message: ShareMessage<C, T>): void {
    if (!message || typeof message !== 'object') return;

    switch (message.type) {
      case 'hello':
        if (this.role === 'leader' && this.latestFlags) {
          this.channel?.postMessage({
            type: 'flags',
            memberId: this.memberId,
            flags: this.latestFlags,
          });
        }
        break;
      case 'flags':
        if (this.role === 'leader') return;
        this.latestFlags = message.flags;
        this.flagsWaiters.splice(0).forEach((resolve) => resolve(message.flags));
        this.followerFlagsCallback?.(message.flags);
        break;
      case 'error':
        if (this.role === 'leader') return;
        {
          const err = new Error(message.message);
          Object.assign(err, { code: message.code, retryAfter: message.retryAfter });
          this.followerErrorCallback?.(err);
        }
        break;
      case 'context-request':
        if (this.role !== 'leader') return;
        void this.handleContextRequest(message);
        break;
      case 'context-result':
        {
          const waiter = this.contextWaiters.get(message.requestId);
          if (!waiter) return;
          this.contextWaiters.delete(message.requestId);
          if (message.error) {
            const err = new Error(message.error.message);
            Object.assign(err, { code: message.error.code });
            waiter.reject(err);
          } else {
            waiter.resolve((message.flags ?? {}) as Record<string, T>);
          }
        }
        break;
      case 'bye':
        if (this.role === 'follower') {
          void this.maybeTakeover();
        }
        break;
      default:
        break;
    }
  }

  private async handleContextRequest(
    message: Extract<ShareMessage<C, T>, { type: 'context-request' }>
  ): Promise<void> {
    if (!this.leaderContextHandler) {
      this.channel?.postMessage({
        type: 'context-result',
        requestId: message.requestId,
        error: { message: 'Leader has no active transport for context updates.', code: 'ERR_INTERNAL' },
      });
      return;
    }
    try {
      const flags = await this.leaderContextHandler(message.context);
      this.broadcastFlags(flags);
      this.channel?.postMessage({
        type: 'context-result',
        requestId: message.requestId,
        flags,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.channel?.postMessage({
        type: 'context-result',
        requestId: message.requestId,
        error: { message: error.message, code: (error as { code?: string }).code },
      });
    }
  }

  private waitForFlags(): Promise<Record<string, T>> {
    if (this.latestFlags) return Promise.resolve(this.latestFlags);

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.flagsWaiters = this.flagsWaiters.filter((waiter) => waiter !== onFlags);
        reject(new Error('Timed out waiting for shared flag snapshot from the leader iframe.'));
      }, FOLLOWER_WAIT_MS);

      const onFlags = (flags: Record<string, T>) => {
        clearTimeout(timeoutId);
        resolve(flags);
      };
      this.flagsWaiters.push(onFlags);
    });
  }

  private requestContextUpdate(context: C): Promise<Record<string, T>> {
    if (this.role === 'leader') {
      if (!this.leaderContextHandler) {
        return Promise.reject(new Error('Leader has no active transport for context updates.'));
      }
      return this.leaderContextHandler(context);
    }

    const requestId = randomMemberId();
    return new Promise<Record<string, T>>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.contextWaiters.delete(requestId);
        reject(new Error('Timed out waiting for shared context update.'));
      }, CONTEXT_WAIT_MS);

      this.contextWaiters.set(requestId, {
        resolve: (flags) => {
          clearTimeout(timeoutId);
          resolve(flags);
        },
        reject: (err) => {
          clearTimeout(timeoutId);
          reject(err);
        },
      });

      this.channel?.postMessage({
        type: 'context-request',
        memberId: this.memberId,
        requestId,
        context,
      });
    });
  }

  private readLock(): LockRecord | null {
    if (!this.storage) return null;
    try {
      const raw = this.storage.getItem(this.lockKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as LockRecord;
      if (!parsed?.ownerId || typeof parsed.expiresAt !== 'number') return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private tryAcquireLock(): boolean {
    if (!this.storage) return true;
    const now = this.now();
    const current = this.readLock();
    if (current && current.ownerId !== this.memberId && current.expiresAt > now) {
      return false;
    }
    const next: LockRecord = { ownerId: this.memberId, expiresAt: now + LOCK_TTL_MS };
    this.storage.setItem(this.lockKey, JSON.stringify(next));
    const confirmed = this.readLock();
    return confirmed?.ownerId === this.memberId;
  }

  private refreshLock(): void {
    if (this.role !== 'leader' || !this.storage) return;
    const current = this.readLock();
    if (current && current.ownerId !== this.memberId && current.expiresAt > this.now()) {
      return;
    }
    this.storage.setItem(
      this.lockKey,
      JSON.stringify({ ownerId: this.memberId, expiresAt: this.now() + LOCK_TTL_MS })
    );
  }

  private releaseLock(): void {
    const current = this.readLock();
    if (current?.ownerId === this.memberId) {
      this.storage?.removeItem(this.lockKey);
    }
  }
}

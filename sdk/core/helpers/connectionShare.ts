/**
 * Same-origin connection sharing for Flagmint streaming transports.
 *
 * When two or more FlagClient instances run in the same origin — typical cases
 * are a host page plus sibling iframes, or two widgets on one Python-embedded
 * page — each would otherwise open its own ASL handshake and SSE/long-poll
 * stream. That doubles evaluation quota and is almost never intended.
 *
 * This hub elects a single **leader** per API key:
 *
 * - **Leader** holds the real transport (handshake + EventSource). It broadcasts
 *   flag snapshots and errors over {@link BroadcastChannel}.
 * - **Followers** skip handshake and EventSource. They apply the leader's flags
 *   and forward `updateContext()` to the leader, which runs it on the shared
 *   stream.
 *
 * Leadership is stored in `localStorage` (`flagmint_share_lock:<apiKey>`) with a
 * short TTL and heartbeat. `destroy()` and a `pagehide` / `beforeunload` listener
 * post `bye` and release the lock so another member can take over immediately.
 * If the document is killed without those events, followers wait until the lock
 * TTL expires.
 *
 * Sharing is a **browser** feature. Node cluster workers each need their own
 * stream — {@link isConnectionSharingAvailable} is false there. Do not share
 * when two clients on one page must keep different evaluation contexts at the
 * same time; `/context` is per connection, so the last write wins.
 *
 * Trust: `BroadcastChannel` and `localStorage` are same-origin. Any document
 * on this origin (including a third-party iframe you host there) can join the
 * group, POST a context through the leader's authenticated stream, and read
 * the flags broadcast back. That is expected among trusted siblings. If the
 * origin serves untrusted content, set `shareConnection: false`.
 *
 * @module connectionShare
 */
import type { Transport } from '@/core/transports/Transport';
import { logger } from '@/core/helpers/logger';

const LOCK_TTL_MS = 4000;
const HEARTBEAT_MS = 1500;
const FOLLOWER_WAIT_MS = 5000;
const CONTEXT_WAIT_MS = 5000;
const TAKEOVER_STAGGER_MS = 250;

/** Role this document plays in the share group for a given API key. */
export type ShareRole = 'leader' | 'follower';

/**
 * Messages exchanged on `flagmint-share:<apiKey>`.
 *
 * - `hello` — follower asking the leader to replay the current flag snapshot.
 * - `alive` — leader heartbeat; followers use lock TTL, not this, to detect death.
 * - `flags` — evaluated flag map from the leader's stream.
 * - `error` — transport/quota error mirrored to followers (`onError`).
 * - `context-request` / `context-result` — follower `updateContext` RPC.
 * - `bye` — leader is leaving; followers may acquire the lock.
 */
type ShareMessage<C = unknown, T = unknown> =
  | { type: 'hello'; memberId: string }
  | { type: 'alive'; memberId: string }
  | { type: 'flags'; memberId: string; flags: Record<string, T> }
  | { type: 'error'; memberId: string; message: string; code?: string; retryAfter?: number }
  | { type: 'context-request'; memberId: string; requestId: string; context: C }
  | { type: 'context-result'; requestId: string; flags?: Record<string, T>; error?: { message: string; code?: string } }
  | { type: 'bye'; memberId: string };

/**
 * Persistence used for the leadership lock.
 * Defaults to `localStorage` so sibling iframes on the same origin can compete.
 */
export interface ShareStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Cross-document bus. Production uses {@link BroadcastChannel};
 * tests inject an in-memory implementation.
 */
export interface ShareChannel {
  postMessage(data: unknown): void;
  close(): void;
  onmessage: ((event: { data: unknown }) => void) | null;
}

/**
 * Test/runtime hooks. Omit in production — the hub uses `BroadcastChannel`,
 * `localStorage`, and `setInterval`.
 */
export interface ConnectionShareOptions {
  /** Override `new BroadcastChannel(name)` (tests). */
  channelFactory?: (name: string) => ShareChannel;
  /** Override `localStorage` for the leadership lock (tests). */
  storage?: ShareStorage;
  /** Clock used for lock expiry. */
  now?: () => number;
  setTimer?: (handler: () => void, ms: number) => ReturnType<typeof setInterval>;
  clearTimer?: (id: ReturnType<typeof setInterval>) => void;
  /** Delay used to stagger lock confirmation (tests inject a no-op). */
  delay?: (ms: number) => Promise<void>;
}

/** `localStorage` payload for `flagmint_share_lock:<apiKey>`. */
interface LockRecord {
  ownerId: string;
  expiresAt: number;
}

/**
 * Whether this runtime can share a stream across documents.
 *
 * @returns `true` in a browser with {@link BroadcastChannel} (includes same-origin
 * iframes). `false` in Node, so cluster workers each keep their own connection.
 */
export function isConnectionSharingAvailable(): boolean {
  return typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined';
}

function randomMemberId(): string {
  return `fm_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

/**
 * Elects a single streaming leader per API key across same-origin documents.
 *
 * {@link FlagClient} constructs one hub when `shareConnection` is enabled (the
 * browser default). The leader opens SSE; followers use
 * {@link ConnectionShareHub.createFollowerTransport} instead.
 *
 * @template C Evaluation context forwarded from follower `updateContext` calls.
 * @template T Flag value type in snapshots broadcast by the leader.
 */
export class ConnectionShareHub<C = Record<string, unknown>, T = unknown> {
  /** Stable id for this document in channel messages and the lock record. */
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
  private readonly delay: (ms: number) => Promise<void>;
  private unloadHandler?: () => void;
  private readonly lockKey: string;
  private readonly channelName: string;

  /**
   * @param apiKey Share groups are keyed by API key. Distinct keys never share.
   * @param options Optional test doubles for channel, storage, and timers.
   */
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
    this.delay = options.delay ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  }

  /** `leader` if this document holds the lock; otherwise `follower`. */
  get currentRole(): ShareRole {
    return this.role;
  }

  /**
   * Join the share group: compete for the lock, subscribe to the channel.
   *
   * If {@link BroadcastChannel} is missing, this member becomes leader locally
   * and never shares (same as a Node process).
   *
   * @returns The role this member should take. Only the leader should call
   * ASL handshake / `SseTransport.init()`.
   */
  async join(): Promise<ShareRole> {
    this.channel = this.openChannel();
    if (!this.channel) {
      this.role = 'leader';
      return this.role;
    }

    this.channel.onmessage = (event) => this.handleMessage(event.data as ShareMessage<C, T>);

    if (await this.tryAcquireLock()) {
      this.becomeLeader();
    } else {
      this.role = 'follower';
      this.channel.postMessage({ type: 'hello', memberId: this.memberId });
      this.watchId = this.setTimer(() => this.maybeTakeover(), HEARTBEAT_MS);
      logger.log('[ConnectionShare] Joined as follower; waiting for leader flag snapshot.');
    }

    this.bindUnloadListener();
    return this.role;
  }

  /**
   * Invoked after a follower wins the lock (leader `bye` or expired heartbeat).
   * The client should open a real transport here, then
   * {@link ConnectionShareHub.broadcastFlags}.
   */
  onPromote(callback: () => void | Promise<void>): void {
    this.onPromoteCallback = callback;
  }

  /**
   * Leader-only: run `updateContext` on the real transport when a follower
   * sends `context-request`. The context is whatever that same-origin
   * document posted; the leader does not authenticate the sender beyond origin.
   */
  setLeaderContextHandler(handler: (context: C) => Promise<Record<string, T>>): void {
    this.leaderContextHandler = handler;
  }

  /**
   * Leader-only: publish the current evaluated flags to all followers.
   * No-op on followers (avoids echo loops).
   */
  broadcastFlags(flags: Record<string, T>): void {
    if (this.role !== 'leader' || !this.channel) return;
    this.latestFlags = flags;
    this.channel.postMessage({ type: 'flags', memberId: this.memberId, flags });
  }

  /** Leader-only: mirror a transport `onError` (auth, quota) to followers. */
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

  /**
   * Transport used by follower FlagClients. `init` waits for the leader
   * snapshot; `fetchFlags` RPCs `updateContext` through the leader.
   * `destroy` is a no-op — {@link ConnectionShareHub.destroy} owns teardown.
   */
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

  /**
   * Leave the share group. Leaders release the lock and post `bye` so another
   * iframe can open the stream. Also invoked from `pagehide` / `beforeunload`.
   * Channel close is deferred one tick so `bye` can flush on native
   * {@link BroadcastChannel}.
   */
  destroy(): void {
    if (this.closed) return;
    this.closed = true;
    this.unbindUnloadListener();
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

  private bindUnloadListener(): void {
    if (typeof window === 'undefined' || this.unloadHandler) return;
    this.unloadHandler = () => this.destroy();
    window.addEventListener('pagehide', this.unloadHandler);
    window.addEventListener('beforeunload', this.unloadHandler);
  }

  private unbindUnloadListener(): void {
    if (typeof window === 'undefined' || !this.unloadHandler) return;
    window.removeEventListener('pagehide', this.unloadHandler);
    window.removeEventListener('beforeunload', this.unloadHandler);
    this.unloadHandler = undefined;
  }

  /** Open the BroadcastChannel for this API key, or a test factory channel. */
  private openChannel(): ShareChannel | null {
    if (this.channelFactory) {
      return this.channelFactory(this.channelName);
    }
    if (typeof BroadcastChannel === 'undefined') {
      return null;
    }
    return new BroadcastChannel(this.channelName) as unknown as ShareChannel;
  }

  /** Mark this member leader and start lock heartbeat + `alive` pings. */
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

  /**
   * Follower poll: if the lock is free or expired, take it and run
   * {@link ConnectionShareHub.onPromote}.
   */
  private async maybeTakeover(): Promise<void> {
    if (this.closed || this.role !== 'follower') return;
    await this.delay(Math.random() * TAKEOVER_STAGGER_MS);
    if (this.closed || this.role !== 'follower') return;
    if (!await this.tryAcquireLock()) return;
    if (this.storage && this.readLock()?.ownerId !== this.memberId) return;

    this.becomeLeader();
    try {
      await this.onPromoteCallback?.();
    } catch (err) {
      logger.warn('[ConnectionShare] Follower failed to promote to leader.', err);
      this.releaseLock();
      this.role = 'follower';
    }
  }

  /** Dispatch a {@link ShareMessage} from another document in the group. */
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
        if (!message.flags || typeof message.flags !== 'object' || Array.isArray(message.flags)) {
          return;
        }
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
          } else if (!message.flags || typeof message.flags !== 'object' || Array.isArray(message.flags)) {
            waiter.reject(new Error('Shared context update returned no flags object.'));
          } else {
            waiter.resolve(message.flags);
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

  /**
   * Leader: evaluate a follower's context on the real transport and reply.
   * Any same-origin document can trigger this; the resulting flags are
   * broadcast to the whole group.
   */
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

  /**
   * Block until the leader has sent a `flags` snapshot, or {@link FOLLOWER_WAIT_MS}.
   * Used by follower `init()`.
   */
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

  /**
   * Follower `fetchFlags`: ask the leader to POST `/context` and wait for
   * `context-result`. Leaders run the handler locally.
   *
   * The posted context is not origin-isolated beyond BroadcastChannel itself.
   * Untrusted same-origin frames must not share a connection with a trusted
   * leader — set `shareConnection: false` on those clients.
   */
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

  /** Read the leadership lock, or `null` if missing/corrupt. */
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

  /**
   * Write the lock, wait so a competing write can land, then re-read.
   * localStorage has no compare-and-set; the delay plus confirm is the
   * best we can do so two iframes do not both become leader.
   *
   * @returns `true` if this member still owns the lock after the confirm.
   */
  private async tryAcquireLock(): Promise<boolean> {
    if (!this.storage) return true;
    const now = this.now();
    const current = this.readLock();
    if (current && current.ownerId !== this.memberId && current.expiresAt > now) {
      return false;
    }
    const next: LockRecord = { ownerId: this.memberId, expiresAt: now + LOCK_TTL_MS };
    this.storage.setItem(this.lockKey, JSON.stringify(next));
    await this.delay(Math.random() * TAKEOVER_STAGGER_MS);
    if (this.closed) {
      this.releaseLock();
      return false;
    }
    return this.readLock()?.ownerId === this.memberId;
  }

  /** Extend lock expiry; no-op if another member stole the lock. */
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

  /** Drop the lock only if this member still owns it. */
  private releaseLock(): void {
    const current = this.readLock();
    if (current?.ownerId === this.memberId) {
      this.storage?.removeItem(this.lockKey);
    }
  }
}

// core/transports/LongPollingTransport.ts
import type { Transport } from './Transport';
import { ensureContextSource } from '@/core/helpers/ensureContextSource';
import { logger } from '@/core/helpers/logger';

export interface LongPollingOptions {
  pollIntervalMs?: number;
  maxBackoffMs?: number;
  backoffMultiplier?: number;
}

export class LongPollingTransport<C, T> implements Transport<C, T> {
  private isStopped = false;
  private pollIntervalMs: number;
  private maxBackoffMs: number;
  private backoffMultiplier: number;
  private pollTimeoutId: NodeJS.Timeout | number | null = null;
  private onUpdateCallback?: (flags: Record<string, T>) => void;
  private onAnalyticsUpdatedCallback?: (analytics: Record<string, boolean>) => void;
  private currentContext: C;
  private currentFlags: Record<string, T> = {};
  
  
  private consecutiveErrors = 0;
  private currentBackoffMs = 0;

  constructor(
    private endpoint: string,
    private apiKey: string,
    initialContext: C,
    options: LongPollingOptions = {}
  ) {
    this.pollIntervalMs = options.pollIntervalMs || 10000;
    this.maxBackoffMs = options.maxBackoffMs || 60000; // Max 1 minute backoff
    this.backoffMultiplier = options.backoffMultiplier || 2;
    this.currentContext = initialContext;
  }

  async init(): Promise<void> {
    try {
      this.currentFlags = await this.fetchFlags(this.currentContext);
      this.consecutiveErrors = 0; // Reset on success
      logger.log('[LongPollingTransport] Initial fetch complete');
    } catch (err) {
      logger.error('[LongPollingTransport] Initial fetch failed:', err);
      // Continue anyway - will retry in next poll
    }

    this.scheduleNextPoll();
  }

  private scheduleNextPoll() {
    if (this.isStopped) return;

    // Calculate delay: normal interval + backoff
    const delay = this.pollIntervalMs + this.currentBackoffMs;
    
    logger.log(
      `[LongPollingTransport] Next poll in ${delay}ms` +
      (this.currentBackoffMs > 0 ? ` (backoff: ${this.currentBackoffMs}ms)` : '')
    );

    this.pollTimeoutId = setTimeout(async () => {
      await this.poll();
      this.scheduleNextPoll();
    }, delay) as any;
  }

  private async poll() {
    try {
      const flags = await this.fetchFlags(this.currentContext);
      
      // ✅ SUCCESS: Reset backoff
      if (this.consecutiveErrors > 0) {
        logger.log('[LongPollingTransport] ✅ Recovered from errors');
        this.consecutiveErrors = 0;
        this.currentBackoffMs = 0;
      }
      
      // Check if flags changed
      if (this.flagsChanged(flags)) {
        logger.log('[LongPollingTransport] Flags changed, notifying...');
        this.currentFlags = flags;
        this.onUpdateCallback?.(flags);
      }
    } catch (err) {
      logger.error('[LongPollingTransport] ❌ Poll error:', err);
      
      // ⚠️ FAILURE: Apply backoff
      this.consecutiveErrors++;
      this.applyBackoff();
    }
  }

  private applyBackoff() {
    if (this.consecutiveErrors === 1) {
      // First error: No backoff yet (might be transient)
      this.currentBackoffMs = 0;
    } else {
      // Exponential backoff: 2s, 4s, 8s, 16s, 32s, 60s (max)
      const backoff = this.pollIntervalMs * Math.pow(
        this.backoffMultiplier,
        this.consecutiveErrors - 2
      );
      
      this.currentBackoffMs = Math.min(backoff, this.maxBackoffMs);
      
      logger.warn(
        `[LongPollingTransport] Backing off ${this.currentBackoffMs}ms ` +
        `(${this.consecutiveErrors} consecutive errors)`
      );
    }
  }

  private flagsChanged(newFlags: Record<string, T>): boolean {
    // Simple stringify comparison
    return JSON.stringify(newFlags) !== JSON.stringify(this.currentFlags);
  }

  async fetchFlags(context: C, options?: { persist?: boolean }): Promise<Record<string, T>> {
    const contextWithSource = ensureContextSource(context);
    if (options?.persist !== false) {
      this.currentContext = contextWithSource;
    }

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context: contextWithSource }),
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error('Unauthorized: Invalid API key');
    }

    if (res.status === 429) {
      const payload = await this.readQuotaPayload(res);
      const cachedFlags = payload.data;
      if (
        cachedFlags &&
        typeof cachedFlags === 'object' &&
        !Array.isArray(cachedFlags)
      ) {
        this.currentFlags = cachedFlags as Record<string, T>;
        this.onUpdateCallback?.(this.currentFlags);
      }

      const message =
        typeof payload.message === 'string' && payload.message.length > 0
          ? payload.message
          : 'Monthly evaluation limit exceeded.';
      const err = new Error(message);
      Object.assign(err, {
        code: 'ERR_RATE_LIMITED',
        retryAfter: typeof payload.retryAfter === 'number' ? payload.retryAfter : undefined,
        upgradeUrl: payload.upgradeUrl,
        statusCode: payload.statusCode ?? 429,
      });
      throw err;
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    if (data && typeof data === 'object' && !Array.isArray(data) && data.analytics && typeof data.analytics === 'object') {
      this.onAnalyticsUpdatedCallback?.(data.analytics as Record<string, boolean>);
    }
    return data.data as Record<string, T>;
  }

  private async readQuotaPayload(res: Response): Promise<Record<string, unknown>> {
    try {
      return (await res.json()) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  onFlagsUpdated(callback: (flags: Record<string, T>) => void): void {
    this.onUpdateCallback = callback;
  }

  onAnalyticsUpdated(callback: (analytics: Record<string, boolean>) => void): void {
    this.onAnalyticsUpdatedCallback = callback;
  }

  destroy(): void {
    logger.log('[LongPollingTransport] Destroying...');
    this.isStopped = true;
    
    if (this.pollTimeoutId !== null) {
      clearTimeout(this.pollTimeoutId as any);
      this.pollTimeoutId = null;
    }
    
    this.onUpdateCallback = undefined;
    this.onAnalyticsUpdatedCallback = undefined;
  }
}

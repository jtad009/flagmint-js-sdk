// core/transports/LongPollingTransport.ts
import type { Transport } from './Transport';

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
      console.log('[LongPollingTransport] Initial fetch complete');
    } catch (err) {
      console.error('[LongPollingTransport] Initial fetch failed:', err);
      // Continue anyway - will retry in next poll
    }

    this.scheduleNextPoll();
  }

  private scheduleNextPoll() {
    if (this.isStopped) return;

    // Calculate delay: normal interval + backoff
    const delay = this.pollIntervalMs + this.currentBackoffMs;
    
    console.log(
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
        console.log('[LongPollingTransport] ✅ Recovered from errors');
        this.consecutiveErrors = 0;
        this.currentBackoffMs = 0;
      }
      
      // Check if flags changed
      if (this.flagsChanged(flags)) {
        console.log('[LongPollingTransport] Flags changed, notifying...');
        this.currentFlags = flags;
        this.onUpdateCallback?.(flags);
      }
    } catch (err) {
      console.error('[LongPollingTransport] ❌ Poll error:', err);
      
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
      
      console.warn(
        `[LongPollingTransport] Backing off ${this.currentBackoffMs}ms ` +
        `(${this.consecutiveErrors} consecutive errors)`
      );
    }
  }

  private flagsChanged(newFlags: Record<string, T>): boolean {
    // Simple stringify comparison
    return JSON.stringify(newFlags) !== JSON.stringify(this.currentFlags);
  }

  async fetchFlags(context: C): Promise<Record<string, T>> {
    this.currentContext = context;

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context }),
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error('Unauthorized: Invalid API key');
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data as Record<string, T>;
  }

  onFlagsUpdated(callback: (flags: Record<string, T>) => void): void {
    this.onUpdateCallback = callback;
  }

  destroy(): void {
    console.log('[LongPollingTransport] Destroying...');
    this.isStopped = true;
    
    if (this.pollTimeoutId !== null) {
      clearTimeout(this.pollTimeoutId as any);
      this.pollTimeoutId = null;
    }
    
    this.onUpdateCallback = undefined;
  }
}

import { CacheAdapter, FeatureFlags } from '@/core/helpers/types';
import type { Transport } from '@/core/transports/Transport';
import { LongPollingTransport } from '@/core/transports/LongPollingTransport';
import { WebSocketTransport } from '@/core/transports/WebsocketTransport';
import { FlagValue } from '@/core/evaluation/types';
import { evaluateFlagValue } from '@/core/evaluation/evaluateFlagValue';
import * as syncCache from '@/core/helpers/cacheHelper';

type TransportMode = 'auto' | 'websocket' | 'long-polling';

export interface FlagClientOptions<C extends Record<string, any> = Record<string, any>> {
  apiKey: string;
  context?: C;
  enableOfflineCache?: boolean;
  persistContext?: boolean;
  transport?: Transport<C, any>;
  transportMode?: TransportMode;
  onError?: (error: Error) => void;
  previewMode?: boolean;
  rawFlags?: Record<string, FlagValue>;
  deferInitialization?: boolean;
  cacheAdapter?: CacheAdapter<C>;
}

const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;
const REST_ENDPOINT = 'http://localhost:3000/evaluator/evaluate';
const WS_ENDPOINT = 'ws://localhost:8080/ws';

// Type for subscription callbacks
type FlagUpdateCallback<T> = (flags: FeatureFlags<T>) => void;

export class FlagClient<T = unknown, C extends Record<string, any> = Record<string, any>> {
  private apiKey: string;
  private context: C;
  private flags: FeatureFlags<T> = {};
  private refreshIntervalId: NodeJS.Timeout | null = null;
  private enableOfflineCache: boolean;
  private persistContext: boolean;
  private cacheTTL: number;
  private transport!: Transport<C, T>;

  private readyPromise!: Promise<void>;
  private resolveReady!: () => void;
  private rejectReady!: (reason?: any) => void;
  private onError?: (error: Error) => void;
  private previewMode: boolean;
  private rawFlags: Record<string, FlagValue> = {};
  private cacheAdapter: CacheAdapter<C>;
  
  // NEW: Subscription management
  private subscribers: Set<FlagUpdateCallback<T>> = new Set();

  /**
   * Creates a new FlagClient instance.
   * @param options - Configuration options for the client.
   */
  constructor(options: FlagClientOptions<C>) {
    this.apiKey = options.apiKey;
    this.enableOfflineCache = options.enableOfflineCache ?? true;
    this.persistContext = options.persistContext ?? false;
    this.cacheTTL = DEFAULT_CACHE_TTL;
    this.onError = options.onError;
    this.cacheAdapter = options.cacheAdapter ?? {
      loadFlags: syncCache.loadCachedFlags,
      saveFlags: syncCache.saveCachedFlags,
      loadContext: syncCache.loadCachedContext,
      saveContext: syncCache.saveCachedContext
    };

    this.context = (options.context || ({} as C));
    this.rawFlags = options.rawFlags ?? {};
    this.previewMode = options.previewMode || false;

    // Local-only evaluation
    if (this.previewMode && this.rawFlags && Object.keys(this.rawFlags).length > 0) {
      this.flags = this.evaluateLocally(this.rawFlags as Record<string, FlagValue<T>>, this.context);
      this.readyPromise = Promise.resolve();
      this.resolveReady = () => { };
      this.rejectReady = () => { };
      return;
    } else if (this.previewMode && !this.rawFlags) {
      console.error('[FlagClient] No raw flags provided for preview mode. Defaulting to remote fetch.');
    }

    this.readyPromise = new Promise<void>((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });

    void this.initialize(options);
  }

  /**
   * Initializes the client by loading cached flags and context, setting up the transport layer.
   */
  private async initialize(options: FlagClientOptions<C>): Promise<void> {
    try {
      // A) Persisted context
      if (this.persistContext) {
        const stored = await Promise.resolve(
          this.cacheAdapter.loadContext(this.apiKey)
        );
        if (stored) this.context = stored;
      }

      // B) Cached flags
      if (this.enableOfflineCache) {
        const cached = await Promise.resolve(
          this.cacheAdapter.loadFlags(this.apiKey, this.cacheTTL)
        );
        if (cached) {
          this.flags = cached as FeatureFlags<T>;
          // Notify subscribers of cached flags
          this.notifySubscribers();
        }
      }

      // C) Transport setup + first fetch
      await this.setupTransport(options);

      // D) Resolve ready
      this.resolveReady();
    } catch (err) {
      this.rejectReady(err);
      this.onError?.(err as Error);
    }
  }

  /**
   * Sets up the transport layer for the client.
   */
  private async setupTransport(options: FlagClientOptions<C>): Promise<void> {
    console.log('[FlagClient] setupTransport() started');
    const mode = options.transportMode ?? 'auto';

    const useWebSocket = async (): Promise<Transport<C, T>> => {
      console.log('[FlagClient] Initializing WebSocket transport...');
      const ws = new WebSocketTransport<C, T>(WS_ENDPOINT, this.apiKey);
      await ws.init();
      console.log('[FlagClient] WebSocket transport initialized');
      return ws;
    };

    const useLongPolling = (): Transport<C, T> => {
      console.log('[FlagClient] Using long polling transport...');
      const lp = new LongPollingTransport<C, T>(REST_ENDPOINT, this.apiKey, this.context, {
        pollIntervalMs: 10000,
      });

      void lp.init((updatedFlags: Record<string, T>) => {
        console.log('[FlagClient] LongPolling update received:', updatedFlags);
        this.updateFlags(updatedFlags);
      });

      return lp;
    };

    try {
      if (mode === 'websocket') {
        this.transport = await useWebSocket();
      } else if (mode === 'long-polling') {
        this.transport = useLongPolling();
      } else {
        try {
          this.transport = await useWebSocket();
        } catch (e) {
          console.warn('[FlagClient] WebSocket failed, falling back to long polling');
          this.transport = useLongPolling();
        }
      }

      console.log('[FlagClient] Fetching flags...');
      const initialData = await this.transport.fetchFlags(this.context);
      console.log('[FlagClient] Initial flags fetched:', initialData);

      this.updateFlags(initialData);

      if (typeof this.transport.onFlagsUpdated === 'function') {
        this.transport.onFlagsUpdated((updatedFlags) => {
          this.updateFlags(updatedFlags);
        });
      }

      this.resolveReady();
    } catch (err) {
      console.error('[FlagClient] setupTransport error:', err);
      this.rejectReady(err);
      if (this.onError) {
        this.onError(err instanceof Error ? err : new Error(String(err)));
      }
      throw err;
    }
  }

  /**
   * Updates flags and notifies all subscribers.
   * This is the centralized method for any flag update.
   */
  private updateFlags(newFlags: FeatureFlags<T>): void {
    this.flags = newFlags;

    // Cache the new flags
    if (this.enableOfflineCache) {
      void Promise.resolve(
        this.cacheAdapter.saveFlags(this.apiKey, newFlags)
      );
    }

    // Notify all subscribers
    this.notifySubscribers();
  }

  /**
   * Notifies all subscribers with the current flags.
   */
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(this.flags);
      } catch (error) {
        console.error('[FlagClient] Error in subscriber callback:', error);
      }
    });
  }

  /**
   * Subscribe to flag changes.
   * @param callback - Function to call when flags update
   * @returns Unsubscribe function
   */
  subscribe(callback: FlagUpdateCallback<T>): () => void {
    this.subscribers.add(callback);
    
    // Immediately call with current flags
    callback(this.flags);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get all flags.
   */
  getFlags(): FeatureFlags<T> {
    return { ...this.flags };
  }

  /**
   * Get a single flag value.
   */
  getFlag<K extends keyof FeatureFlags<T>>(key: K, fallback?: FeatureFlags<T>[K]): FeatureFlags<T>[K] {
    return this.flags[key] ?? fallback!;
  }

  /**
   * Update the evaluation context.
   */
  async updateContext(context: C): Promise<void> {
    this.context = { ...this.context, ...context };
    
    if (this.persistContext) {
      await Promise.resolve(
        this.cacheAdapter.saveContext(this.apiKey, this.context)
      );
    }

    // Re-fetch flags with new context
    if (this.transport && typeof this.transport.fetchFlags === 'function') {
      try {
        const updatedFlags = await this.transport.fetchFlags(this.context);
        this.updateFlags(updatedFlags);
      } catch (error) {
        console.error('[FlagClient] Error updating flags after context change:', error);
        this.onError?.(error as Error);
      }
    }
  }

  /**
   * Destroy the client and clean up resources.
   */
  destroy(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
    
    // Clear all subscribers
    this.subscribers.clear();
    
    if (this.transport) {
      this.transport.destroy();
    }
  }

  /**
   * Wait for the client to be ready.
   */
  async ready(): Promise<void> {
    console.log('[FlagClient] Waiting for client to be ready...', this.readyPromise);
    return this.readyPromise;
  }

  /**
   * Evaluate flags locally (for preview mode).
   */
  private evaluateLocally(flags: Record<string, FlagValue<T>>, context: C): Record<string, T> {
    const result: Record<string, T> = {};
    for (const key in flags) {
      const evaluated = evaluateFlagValue(flags[key], context);
      if (evaluated !== null) {
        result[key] = evaluated;
      }
    }
    return result;
  }
}
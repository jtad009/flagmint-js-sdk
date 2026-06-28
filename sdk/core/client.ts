import { CacheAdapter, FeatureFlags } from '@/core/helpers/types';
import type { Transport } from '@/core/transports/Transport';
import { LongPollingTransport } from '@/core/transports/LongPollingTransport';
import { WebSocketTransport } from '@/core/transports/WebsocketTransport';
import { FlagValue } from '@/core/evaluation/types';
import { evaluateFlagValue } from '@/core/evaluation/evaluateFlagValue';
import * as syncCache from '@/core/helpers/cacheHelper';
import { logger } from '@/core/helpers/logger';

type TransportMode = 'auto' | 'websocket' | 'long-polling';

export interface FlagClientOptions<C extends Record<string, any> = Record<string, any>> {
  apiKey: string;
  context?: C;
  enableOfflineCache?: boolean;
  persistContext?: boolean;
  transport?: Transport<C, any>;
  transportMode?: TransportMode;
  /**
   * Called when a non-fatal but noteworthy error occurs during or after initialization.
   * The client always resolves ready() regardless — use this to show a degraded/fallback UI.
   *
   * Common cases:
   *  - Auth failure (err.code === 'ERR_AUTH'): API key invalid; flags will be empty; getFlag() returns fallback values.
   *  - Rate limited (err.code === 'ERR_RATE_LIMITED'): free-tier call limit exceeded; cached flags are served if available.
   *    Check (err as any).resetTime for the reset timestamp string supplied by the server, if present.
   *  - Degraded mode: transport failed but cached flags are available and being served.
   *  - Context update error: re-evaluation after updateContext() failed; previous flags retained.
   *
   * Note: ready() will never throw. All errors are surfaced exclusively through this callback.
   */
  onError?: (error: Error) => void;
  previewMode?: boolean;
  rawFlags?: Record<string, FlagValue>;
  deferInitialization?: boolean;
  cacheAdapter?: CacheAdapter<C>;
  restEndpoint?: string;
  wsEndpoint?: string;
  debugLog?: boolean; // this option should be true, if a user wants access to flagmint internal logs
  env?: string;
  enableFlagmint: boolean; // this is used to trigger connection to Flagmint service. This prevents connection when in dev and reduced billing.
}

const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Get default endpoints based on NODE_ENV
 */
function getDefaultEndpoints(env?: string): { rest: string; ws: string } {
  const environment =
    env || (typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV) : 'production');
  switch (environment?.toLowerCase()) {
    case 'production':
      return {
        rest: 'https://api.flagmint.com/evaluator/evaluate',
        ws: 'wss://api.flagmint.com/ws/sdk',
      };
    case 'staging':
      return {
        rest: 'https://staging-api.flagmint.com/evaluator/evaluate',
        ws: 'wss://staging-api.flagmint.com/ws/sdk',
      };
    case 'development':
    default:
      return {
        rest: 'https://api.flagmint.com/evaluator/evaluate',
        ws: 'wss://api.flagmint.com/ws/sdk',
      };
  }
}

const REST_ENDPOINT = getDefaultEndpoints().rest;
const WS_ENDPOINT = getDefaultEndpoints().ws;

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
  private restEndpoint: string;
  private wsEndpoint: string;

  private readyPromise!: Promise<void>;
  private resolveReady!: () => void;
  private rejectReady!: (reason?: any) => void;
  private onError?: (error: Error) => void;
  private previewMode: boolean;
  private rawFlags: Record<string, FlagValue> = {};
  private cacheAdapter: CacheAdapter<C>;

  private env?: string;
  private enableFlagmint?: boolean;

  // NEW: Track if initialization was deferred
  private deferInitialization: boolean;
  private initializationOptions?: FlagClientOptions<C>;
  private isInitialized: boolean = false;

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
    this.restEndpoint = getDefaultEndpoints(options.env).rest ?? REST_ENDPOINT;
    this.wsEndpoint = getDefaultEndpoints(options.env).ws ?? WS_ENDPOINT;
    this.cacheAdapter = options.cacheAdapter ?? {
      loadFlags: syncCache.loadCachedFlags,
      saveFlags: syncCache.saveCachedFlags,
      loadContext: syncCache.loadCachedContext,
      saveContext: syncCache.saveCachedContext
    };

    this.context = (options.context || ({} as C));
    this.rawFlags = options.rawFlags ?? {};
    this.previewMode = options.previewMode || false;
    this.deferInitialization = options.deferInitialization ?? false;
    this.env = options.env;
    this.enableFlagmint = options.enableFlagmint ?? true;

    logger.setup({ debugLog: options.debugLog });

    // Local-only evaluation
    if (this.previewMode && this.rawFlags && Object.keys(this.rawFlags).length > 0) {
      this.flags = this.evaluateLocally(this.rawFlags as Record<string, FlagValue<T>>, this.context);
      this.readyPromise = Promise.resolve();
      this.resolveReady = () => { };
      this.rejectReady = () => { };
      this.isInitialized = true;
      return;
    } else if (this.previewMode && !this.rawFlags) {
      logger.error('[FlagClient] No raw flags provided for preview mode. Defaulting to remote fetch.');
    }

    this.readyPromise = new Promise<void>((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });

    if(this.enableFlagmint) {
      if (this.deferInitialization) {
        logger.log('[FlagClient] Initialization deferred. Call ready() to initialize.');
        // Store options for later initialization
        this.initializationOptions = options;
        // Don't initialize yet!
      } else {
        // Initialize immediately (existing behavior)
        void this.initialize(options);
      }
    } else {
      logger.log('[FlagClient] Flagmint connection disabled. Skipping initialization.');
    }
  }

  /**
   * Initializes the client by loading cached flags and context, setting up the transport layer.
   */
  private async initialize(options: FlagClientOptions<C>): Promise<void> {
    logger.log('[FlagClient] Initialization started');
    if (this.isInitialized) {
      logger.log('[FlagClient] Already initialized, skipping.');
      return;
    }

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

      // D) Mark as initialized and resolve
      this.isInitialized = true;
      this.resolveReady();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('[FlagClient] Initialization failed:', error);

      // Always resolve — the app should render its fallback UI regardless of whether
      // we have cached flags or not. onError carries the reason; ready() must not throw
      // because most call sites (Vue plugin, React hooks) don't wrap it in try/catch.
      // Cached flags, if any, are already in this.flags from step B above.
      if (Object.keys(this.flags).length > 0) {
        logger.warn('[FlagClient] Transport connection failed. Serving cached flags in degraded mode.');
      } else {
        logger.warn('[FlagClient] Transport connection failed. No cached flags — getFlag() will return fallback values.');
      }

      this.onError?.(error);
      this.isInitialized = true;
      this.resolveReady();
    }
  }

  /**
   * Sets up the transport layer for the client.
   */
  private async setupTransport(options: FlagClientOptions<C>): Promise<void> {
    logger.log('[FlagClient] setupTransport() started');
    const mode = options.transportMode ?? 'auto';

    const useWebSocket = async (): Promise<Transport<C, T>> => {
      logger.log('[FlagClient] Initializing WebSocket transport...');
      const ws = new WebSocketTransport<C, T>(this.wsEndpoint, this.apiKey);
      await ws.init();
      logger.log('[FlagClient] WebSocket transport initialized');
      return ws;
    };

    const useLongPolling = (): Transport<C, T> => {
      const lp = new LongPollingTransport<C, T>(this.restEndpoint, this.apiKey, this.context, {
        pollIntervalMs: 1200000,
        maxBackoffMs: 60000,       // 1min max backoff
        backoffMultiplier: 2       // Double each time
      });

      lp.onFlagsUpdated((flags) => {
        logger.log('[FlagClient] Flags updated via long polling:', flags);
        this.updateFlags(flags);
      });
      void lp.init();

      return lp;
    };

    if (mode === 'websocket') {
      this.transport = await useWebSocket();
    } else if (mode === 'long-polling') {
      this.transport = useLongPolling();
    } else {
      try {
        this.transport = await useWebSocket();
      } catch (e) {
        const code = (e as any).code;
        if (code === 'ERR_AUTH' || code === 'ERR_RATE_LIMITED') throw e; // both terminal — long polling hits the same wall
        logger.warn('[FlagClient] WebSocket failed, falling back to long polling');
        this.transport = useLongPolling();
      }
    }

    if (typeof this.transport.onFlagsUpdated === 'function') {
      this.transport.onFlagsUpdated((updatedFlags) => {
        logger.log('[FlagClient] Flags updated via transport:', updatedFlags);
        this.updateFlags(updatedFlags);
      });
    }
    const initialData = await this.transport.fetchFlags(this.context);

    this.updateFlags(initialData);
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
        logger.error('[FlagClient] Error in subscriber callback:', error);
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
    if (this.initializationOptions) {
      this.initializationOptions.context = this.context; // Ensure context is passed if it was set after construction
    }
    if (this.persistContext) {
      await Promise.resolve(
        this.cacheAdapter.saveContext(this.apiKey, this.context)
      );
    }

    // Re-fetch flags with new context
    if (this.transport && typeof this.transport.fetchFlags === 'function') {
      try {
        const updatedFlags = await this.transport.fetchFlags(this.context);
        logger.log('[FlagClient] Flags updated after context change:', updatedFlags);
        this.updateFlags(updatedFlags);
      } catch (error) {
        logger.error('[FlagClient] Error updating flags after context change:', error);
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
   * Resolves when: flags are available AND initialization succeeded.
   * Rejects if: initialization/connection fails (even if cached flags exist).
   */
  async ready(timeoutMs: number = 3000): Promise<void> {
    logger.log('[FlagClient] 🔍 ready() START');
    
    if (this.deferInitialization && !this.isInitialized && this.initializationOptions) {
      logger.log('[FlagClient] 🔍 About to initialize...');
      await this.initialize(this.initializationOptions);
      logger.log('[FlagClient] 🔍 Initialize complete');
    }
    
    // Wait for flags to be available (cached or fetched)
    if (Object.keys(this.flags).length === 0) {
      await this.waitForFlags(timeoutMs);
    }
    
    // Always wait for initialization to complete
    // This catches connection/transport errors even if cached flags exist
    await this.readyPromise;
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

  private waitForFlags(timeoutMs: number): Promise<void> {
    return new Promise<void>((resolve) => {
      let resolved = false;
      let unsubscribe: (() => void) | undefined;

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          if (unsubscribe) {
            unsubscribe();
          }
          resolve();
        }
      }, timeoutMs);

      unsubscribe = this.subscribe((flags) => {
        if (!resolved && Object.keys(flags).length > 0) {
          resolved = true;
          clearTimeout(timeout);
          if (unsubscribe) {
            unsubscribe();
          }
          resolve();
        } else {
          logger.log('[FlagClient] 📥 Not resolving:', {
            resolved,
            flagsLength: Object.keys(flags).length
          });
        }
      });

      logger.log('[FlagClient] 🔍 Subscribe callback registered');
    });
  }
}

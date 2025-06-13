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
  deferInitialization?: boolean; // If true, initialization is deferred until the user calls the init function
  cacheAdapter?: CacheAdapter<C>;
}

const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;
const REST_ENDPOINT = 'http://localhost:3000/evaluator/evaluate';
const WS_ENDPOINT = 'wss://api.flagmint.io/flags/ws';

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

   // Default context placeholder (will be overwritten in initialize)
    this.context = (options.context || ({} as C));
    
    this.rawFlags = options.rawFlags ?? {};

    this.previewMode = options.previewMode || false;
    // ✅ Local-only evaluation
    if (this.previewMode && this.rawFlags && Object.keys(this.rawFlags).length > 0) {
      this.flags = this.evaluateLocally(this.rawFlags as Record<string, FlagValue<T>>, this.context);

      this.readyPromise = Promise.resolve(); // immediately ready
      this.resolveReady = () => { }; // no-op
      this.rejectReady = () => { }; // no-op
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
 * Initializes the client by loading cached flags and context, setting up the transport layer, and starting the auto-refresh timer if enabled.
 * @param options - The options for initializing the client.
 * 
 * @throws Will throw an error if initialization fails.
 * @returns {Promise<void>} A promise that resolves when the client is ready.
 * @private
 */
  private async initialize(options: FlagClientOptions<C>): Promise<void> {
    try {
      // ——————————————
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
        if (cached) this.flags = cached as FeatureFlags<T>;
      }

  

      // c) Transport setup + first fetch
      await this.setupTransport(options);

      // E) Resolve ready
      this.resolveReady();
    } catch (err) {
      this.rejectReady(err);
      this.onError?.(err as Error);
    }
  }
  /**
   * Sets up the transport layer for the client.
   * @param options - The options for the transport setup.
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
      pollIntervalMs: 10000, // Default polling interval
    });

    void lp.init((updatedFlags: Record<string, T>) => {
      console.log('[FlagClient] LongPolling update received:', updatedFlags);
      this.flags = updatedFlags;
      if (this.enableOfflineCache) {
        void Promise.resolve(
          this.cacheAdapter.saveFlags(this.apiKey, updatedFlags)
        );
      }
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
    const intialData = await this.transport.fetchFlags(this.context);
    console.log('[FlagClient] Initial flags fetched:', intialData);

   
    this.flags = intialData;
    if (this.enableOfflineCache) {
      await Promise.resolve(
        this.cacheAdapter.saveFlags(this.apiKey, intialData)
      );
    }

    if (typeof this.transport.onFlagsUpdated === 'function') {
      this.transport.onFlagsUpdated((updatedFlags) => {
        this.flags = updatedFlags;

        if (this.enableOfflineCache) {
          this.cacheAdapter.saveFlags(this.apiKey, updatedFlags);
        }
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


  getFlag<K extends keyof FeatureFlags<T>>(key: K, fallback?: FeatureFlags<T>[K]): FeatureFlags<T>[K] {
    return this.flags[key] ?? fallback!;
  }

  updateContext(context: C) {
    this.context = { ...this.context, ...context };
    if (this.persistContext) {
      this.cacheAdapter.saveContext(this.apiKey, this.context);
    }
  }

  destroy() {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
    this.transport.destroy();
  }

  async ready(): Promise<void> {
    console.log('[FlagClient] Waiting for client to be ready...', this.readyPromise);
    return this.readyPromise;
  }

  private evaluateLocally(flags: Record<string, FlagValue<T>>, context: C): Record<string, T> {
    const result: Record<string, T> = {};
    for (const key in flags) {
      const evaluated = evaluateFlagValue(flags[key], context);
      if (evaluated !== null) {
        result[key] = evaluated;
      }
      // Optionally, handle the case where evaluated is null (e.g., set a default value)
    }
    return result;
  }

}
import { CacheAdapter, FeatureFlags } from '@/core/helpers/types';
import type { Transport } from '@/core/transports/Transport';
import { LongPollingTransport } from '@/core/transports/LongPollingTransport';
import { FlagValue } from '@/core/evaluation/types';
import { evaluateFlagValue } from '@/core/evaluation/evaluateFlagValue';
import * as syncCache from '@/core/helpers/cacheHelper';
import { logger } from '@/core/helpers/logger';
import { SseTransport } from './transports/SSETransport';

type TransportMode = 'auto' | 'long-polling' | 'sse';

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
  sseEndpoint?: string;
  debugLog?: boolean; // this option should be true, if a user wants access to flagmint internal logs
  env?: string;
  enableFlagmint: boolean; // this is used to trigger connection to Flagmint service. This prevents connection when in dev and reduced billing.
  wrapperInfo?: {
    name: string;
    version: string;
  }
  EventSourceImpl?: any
}

const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Get default endpoints based on NODE_ENV
 */
function getDefaultEndpoints(env?: string): { rest: string; handshakeURL: string, sse: string } {
  const environment =
    env || (typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV) : 'production');
  switch (environment?.toLowerCase()) {
    case 'staging':
      return {
        sse: 'https://staging-api.flagmint.com/evaluator/v2/flags',
        rest: 'https://staging-api.flagmint.com/evaluator/evaluate',
        handshakeURL: 'https://staging-api.flagmint.com/auth/asl-handshake'
      };
    case 'development':
      return {
        sse: 'http://localhost:3000/evaluator/v2/flags',
        rest: 'https://localhost:3000/evaluator/evaluate',
        handshakeURL: 'http://localhost:3000/auth/asl-handshake'
      };
    case 'production':
    default:
      return {
        sse: 'https://staging-api.flagmint.com/evaluator/v2/flags',
        rest: 'https://api.flagmint.com/evaluator/evaluate',
        handshakeURL: 'https://api.flagmint.com/auth/asl-handshake'
      };
  }
}

const REST_ENDPOINT = getDefaultEndpoints().rest;
const SSE_ENDPOINT = getDefaultEndpoints().sse

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
  private aslHandshakeUrl: string;
  private sseEndpoint: string;

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
    this.restEndpoint = options.restEndpoint ?? getDefaultEndpoints(options.env).rest ?? REST_ENDPOINT;
    this.sseEndpoint = options.sseEndpoint ?? getDefaultEndpoints(options.env).sse ?? SSE_ENDPOINT;
    this.aslHandshakeUrl = getDefaultEndpoints(options.env).handshakeURL ?? 'http://localhost:3000/auth/asl-handshake'; // Default to local dev server
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

    if (this.enableFlagmint) {
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
 * Creates and initializes the transport layer used to receive feature flag
 * updates from the Flagmint platform.
 *
 * This method performs the authentication handshake to obtain a fresh session
 * identifier, selects the appropriate transport based on the configured
 * transport mode, and initializes it before attaching the internal flag update
 * listener.
 *
 * When operating in `auto` mode, the client attempts to establish a
 * Server-Sent Events (SSE) connection first. If SSE initialization fails,
 * it automatically falls back to the long-polling transport to maintain
 * feature flag delivery.
 *
 * Once the transport is ready, any available initial flags are immediately
 * synchronized into the client state before future updates are received
 * through the transport's notification callbacks.
 *
 * @param {FlagClientOptions<C>} options - The client configuration used to
 * authenticate the handshake request and determine which transport strategy
 * to initialize.
 *
 * @returns {Promise<void>} A promise that resolves once the selected transport
 * has been initialized and wired into the FlagClient.
 *
 * @throws {Error} If the authentication handshake fails, the session identifier
 * cannot be obtained, or the configured transport fails to initialize.
 */
  private async setupTransport(options: FlagClientOptions<C>): Promise<void> {
    logger.log('[FlagClient] setupTransport() started');
    const mode = options.transportMode ?? 'auto';

    const sessionId = await this.fetchFreshSessionId(options.apiKey)
    if (!sessionId) {
      throw new Error('Handshake parsing error: Remote platform returned empty identity session token strings.');
    }

    // --- Transport Factory Instantiators (Clean, listener-free instantiation wrappers) ---

    const useSSE = async (): Promise<Transport<C, T>> => {
      logger.log('[FlagClient] Initializing Server-Sent Events (SSE) streaming transport...', this.context);
      // Standardizes pass matching endpoint schemas explicitly using handshake credentials
      const sse = new SseTransport<C, T>(
        this.sseEndpoint,
        sessionId,
        this.context,
        () => this.fetchFreshSessionId(options.apiKey),
        {
          wrapper: options.wrapperInfo,
          EventSourceImpl: options.EventSourceImpl
        }
      );
      await sse.init();
      logger.log('[FlagClient] SSE streaming transport initialized successfully.');
      return sse;
    };

    const useLongPolling = (): Transport<C, T> => {
      logger.log('[FlagClient] Initializing long-polling fallback loop transport...');
      const lp = new LongPollingTransport<C, T>(this.restEndpoint, options.apiKey, this.context, {
        pollIntervalMs: 1200000,
        maxBackoffMs: 60000,
        backoffMultiplier: 2
      });
      void lp.init();
      return lp;
    };

    if (mode === 'sse') {
      this.transport = await useSSE();
    } else if (mode === 'long-polling') {
      this.transport = useLongPolling();
    } else {
      // Auto Mode Execution Layout (SSE -> Long Polling Fallback Routing)
      try {
        this.transport = await useSSE();
      } catch (e) {
        logger.warn('[FlagClient] Streaming transport failure. Deploying long-polling backup channels.', (e as Error).message);
        this.transport = useLongPolling();
      }
    }

    // 2. FIXED: Standardized Callback Attachment Pattern
    // Attaches exactly one single state listener block down the chosen execution line
    if (typeof this.transport.onFlagsUpdated === 'function') {
      this.transport.onFlagsUpdated((updatedFlags) => {
        logger.log('[FlagClient] Flags updated via transport line stream notification:', updatedFlags);
        this.updateFlags(updatedFlags);
      });
    }

    // 3. FIXED: Deduplicated Performance Optimization 
    // SseTransport.init() already populates this.flags natively. If present, load local variables instantly.
    const initialData = (this.transport as any).flags ?? {};
    this.updateFlags(initialData);
    logger.log('[FlagClient] Flag Client bootstrapping routines successfully finalized.');
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
 * Waits until the FlagClient is fully initialized and ready for feature flag
 * evaluation.
 *
 * If deferred initialization is enabled, this method will first perform the
 * initial client setup. It then waits for the first feature flag payload to
 * become available (or until the specified timeout expires) before awaiting
 * completion of the underlying transport initialization.
 *
 * This method guarantees that transport or connection failures are surfaced,
 * even when feature flags have already been restored from cache.
 *
 * @param {number} [timeoutMs=3000] - The maximum amount of time, in
 * milliseconds, to wait for the initial feature flag payload before
 * continuing initialization.
 *
 * @returns {Promise<void>} A promise that resolves when the client is fully
 * initialized and ready to evaluate feature flags.
 *
 * @throws {Error} If client initialization or the underlying transport fails,
 * such as authentication, rate limiting, or connection errors.
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

  /**
 * Waits until the client receives its first non-empty feature flag payload,
 * or until the specified timeout elapses.
 *
 * This method subscribes to flag updates and resolves as soon as at least one
 * feature flag is available. If no flags are received within the allotted
 * timeout, the promise still resolves, allowing the SDK to continue
 * initialization using default or cached values instead of blocking
 * indefinitely.
 *
 * The internal subscription is automatically removed when either condition
 * is met to prevent memory leaks.
 *
 * @param {number} timeoutMs - The maximum amount of time, in milliseconds,
 * to wait for the initial feature flag payload before resolving.
 *
 * @returns {Promise<void>} A promise that resolves when the first non-empty
 * flag payload is received or when the timeout expires, whichever occurs first.
 */
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

  /**
   * Performs the initial authentication handshake with the Flagmint server
   * to obtain a fresh, single-use session identifier.
   *
   * The returned session ID is used by streaming transports (SSE/WebSocket)
   * to establish an authenticated real-time connection. Session identifiers
   * are intentionally short-lived and should not be reused across new
   * streaming connections.
   *
   * @param {string} apiKey - The Flagmint API key used to authenticate the
   * handshake request.
   *
   * @returns {Promise<string>} A promise that resolves with a newly issued
   * session identifier.
   *
   * @throws {Error} If the API credentials are invalid (`ERR_AUTH`).
   * @throws {Error} If the client has exceeded its rate limit (`ERR_RATE_LIMITED`).
   * @throws {Error} If the handshake endpoint returns an unexpected HTTP error.
   * @throws {Error} If the handshake response does not contain a valid session ID.
   */
  private async fetchFreshSessionId(apiKey: string): Promise<string> {
    try {
      const authenticationHandShake = await fetch(this.aslHandshakeUrl, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey },
      });

      if (authenticationHandShake.status === 401) {
        throw new Error('ERR_AUTH: Invalid API credentials configuration.');
      }
      if (authenticationHandShake.status === 429) {
        throw new Error('ERR_RATE_LIMITED: Client ingestion limits exceeded.');
      }
      if (!authenticationHandShake.ok) {
        throw new Error(`Handshake server infrastructure exception (${authenticationHandShake.status})`);
      }

      const handshakeData = await authenticationHandShake.json();
      const sessionId = handshakeData?.data?.sessionId;

      if (!sessionId) {
        throw new Error('Handshake parsing error: Remote platform returned empty session token.');
      }

      return sessionId;
    } catch (err) {
      logger.error('[FlagClient] Core Handshake failure encountered:', (err as Error).message);
      throw err;
    }
  }
}

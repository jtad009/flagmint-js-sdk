import { CacheAdapter, FeatureFlags } from '@/core/helpers/types';
import type { Transport } from '@/core/transports/Transport';
import { LongPollingTransport } from '@/core/transports/LongPollingTransport';
import { FlagValue } from '@/core/evaluation/types';
import { evaluateFlagValue } from '@/core/evaluation/evaluateFlagValue';
import * as syncCache from '@/core/helpers/cacheHelper';
import { logger } from '@/core/helpers/logger';
import { SseTransport } from './transports/SSETransport';
import {
  ConnectionShareHub,
  isConnectionSharingAvailable,
  type ConnectionShareOptions,
} from '@/core/helpers/connectionShare';
import {
  EVENT_FLUSH_MS,
  MAX_EVENT_BATCH,
  eventsUrlFromRestEndpoint,
  extraFromError,
  shouldReportApplicationEvent,
  userKeyFromContext,
  type ApplicationEvent,
} from '@/core/helpers/applicationEvents';

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
  /** Override the ASL handshake URL. Use with `sseEndpoint` for self-hosted gateways. */
  handshakeEndpoint?: string;
  debugLog?: boolean; // this option should be true, if a user wants access to flagmint internal logs
  env?: string;
  enableFlagmint: boolean; // this is used to trigger connection to Flagmint service. This prevents connection when in dev and reduced billing.
  wrapperInfo?: {
    name: string;
    version: string;
  }
  EventSourceImpl?: any
  /**
   * Share one streaming connection across same-origin documents (tabs / iframes)
   * that use the same API key. Defaults to true in browsers with BroadcastChannel,
   * false in Node (cluster workers each keep their own stream).
   *
   * Followers do not handshake or open EventSource. They receive flags from the
   * leader and forward updateContext() to it. Do not enable this when two clients
   * must evaluate different contexts at the same time on one page, or when the
   * origin hosts untrusted documents that should not steer or read this stream.
   */
  shareConnection?: boolean;
  /**
   * Test/runtime hooks for the share hub (channel, storage, timers).
   * Omit in production.
   */
  share?: ConnectionShareOptions;
}

const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;
const HANDSHAKE_TIMEOUT_MS = 10000;

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
        rest: 'http://localhost:3000/evaluator/evaluate',
        handshakeURL: 'http://localhost:3000/auth/asl-handshake'
      };
    case 'production':
    default:
      return {
        sse: 'https://api.flagmint.com/evaluator/v2/flags',
        rest: 'https://api.flagmint.com/evaluator/evaluate',
        handshakeURL: 'https://api.flagmint.com/auth/asl-handshake'
      };
  }
}

function sdkError(message: string, code: string, extra?: Record<string, unknown>): Error {
  return Object.assign(new Error(message), { code, ...extra });
}

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
  private eventsEndpoint: string;
  private aslHandshakeUrl: string;
  private sseEndpoint: string;
  private eventQueue: ApplicationEvent[] = [];
  private eventFlushTimer: ReturnType<typeof setTimeout> | null = null;
  /** null = server has not sent a map yet; send and let ingest drop. */
  private analyticsByFlag: Record<string, boolean> | null = null;

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
  private shareHub: ConnectionShareHub<C, T> | null = null;
  private shareConnection: boolean;

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
    const defaultEndpoints = getDefaultEndpoints(options.env);
    this.restEndpoint = options.restEndpoint ?? defaultEndpoints.rest;
    this.eventsEndpoint = eventsUrlFromRestEndpoint(this.restEndpoint);
    this.sseEndpoint = options.sseEndpoint ?? defaultEndpoints.sse;
    this.aslHandshakeUrl = options.handshakeEndpoint ?? defaultEndpoints.handshakeURL;
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
    this.shareConnection =
      options.shareConnection ?? isConnectionSharingAvailable();

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

      // C) Same-origin iframe/tab share, then transport setup
      if (await this.joinConnectionShare(options)) {
        this.isInitialized = true;
        this.resolveReady();
        return;
      }

      await this.setupTransport(options);
      this.shareHub?.broadcastFlags(this.flags as Record<string, T>);

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

  private bindTransport(transport: Transport<C, T>): void {
    if (typeof transport.onFlagsUpdated === 'function') {
      transport.onFlagsUpdated((updatedFlags) => {
        logger.log('[FlagClient] Flags updated via transport line stream notification:', updatedFlags);
        this.updateFlags(updatedFlags);
      });
    }
    if (typeof transport.onAnalyticsUpdated === 'function') {
      transport.onAnalyticsUpdated((analytics) => {
        this.updateAnalytics(analytics);
      });
    }
    if (typeof transport.onError === 'function') {
      transport.onError((error) => {
        logger.error('[FlagClient] Transport error:', error);
        this.shareHub?.broadcastError(error);
        this.onError?.(error);
      });
    }
  }

  /**
   * @returns true when this document is a follower and should skip opening a stream.
   */
  private async joinConnectionShare(options: FlagClientOptions<C>): Promise<boolean> {
    if (!this.shareConnection || options.transport) {
      return false;
    }
    if (!options.share && !isConnectionSharingAvailable()) {
      return false;
    }

    this.shareHub = new ConnectionShareHub<C, T>(this.apiKey, options.share);
    this.shareHub.onPromote(async () => {
      logger.log('[FlagClient] Share leader departed. Promoting this document to hold the stream.');
      await this.setupTransport(options);
      this.attachShareLeader();
      this.shareHub?.broadcastFlags(this.flags as Record<string, T>);
    });

    const role = await this.shareHub.join();

    if (role === 'follower') {
      logger.log('[FlagClient] Following an existing Flagmint stream in another same-origin document.');
      this.transport = this.shareHub.createFollowerTransport();
      this.bindTransport(this.transport);
      await this.transport.init();
      return true;
    }

    this.attachShareLeader();
    return false;
  }

  private attachShareLeader(): void {
    this.shareHub?.setLeaderContextHandler(async (context, options) => {
      const mergedContext = { ...this.context, ...context } as C;
      if (!this.transport || typeof this.transport.fetchFlags !== 'function') {
        return this.flags as Record<string, T>;
      }
      return this.transport.fetchFlags(mergedContext, {
        persist: options?.persist === true,
      });
    });
  }

  /**
 * Creates and initializes the transport layer used to receive feature flags
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

    if (options.transport) {
      this.transport = options.transport;
      this.bindTransport(this.transport);
      await this.transport.init();
      const initialData = (this.transport as { flags?: FeatureFlags<T> }).flags;
      if (initialData && Object.keys(initialData).length > 0) {
        this.updateFlags(initialData);
      }
      return;
    }

    const mode = options.transportMode ?? 'auto';

    const sessionId = await this.fetchFreshSessionId(options.apiKey)
    if (!sessionId) {
      throw new Error('Handshake parsing error: Remote platform returned empty identity session token strings.');
    }

    // --- Transport factory ---

    const bindTransport = (transport: Transport<C, T>) => this.bindTransport(transport);

    const useSSE = async (): Promise<Transport<C, T>> => {
      logger.log('[FlagClient] Initializing Server-Sent Events (SSE) streaming transport...', this.context);
      const sse = new SseTransport<C, T>(
        this.sseEndpoint,
        sessionId,
        this.context,
        () => this.fetchFreshSessionId(options.apiKey),
        {
          apiKey: options.apiKey,
          wrapper: options.wrapperInfo,
          EventSourceImpl: options.EventSourceImpl
        }
      );
      bindTransport(sse);
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
      bindTransport(lp);
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

    // SseTransport.init() already populates its flags. Apply them only when present,
    // so the long-polling path does not overwrite cached flags with an empty map.
    const initialData = (this.transport as { flags?: FeatureFlags<T> }).flags;
    if (initialData && Object.keys(initialData).length > 0) {
      this.updateFlags(initialData);
    }
    logger.log('[FlagClient] Flag Client bootstrapping routines successfully finalized.');
  }

  /**
   * Updates flags and notifies all subscribers.
   * This is the centralized method for any flag update.
   */
  private updateFlags(newFlags: FeatureFlags<T>, fromShare = false): void {
    this.flags = newFlags;

    // Cache the new flags
    if (this.enableOfflineCache) {
      void Promise.resolve(
        this.cacheAdapter.saveFlags(this.apiKey, newFlags)
      );
    }

    // Notify all subscribers
    this.notifySubscribers();

    if (!fromShare) {
      this.shareHub?.broadcastFlags(newFlags as Record<string, T>);
    }
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
   * Report an application error that happened after this flag was served.
   * Fire-and-forget: events are batched and never throw.
   * No-ops when Analytics Tracking is off for that flag.
   */
  trackError(flagKey: string, error?: unknown, extra?: Record<string, unknown>): void {
    this.queueApplicationEvent({
      flagKey,
      kind: 'error',
      variationValue: this.flags[flagKey as keyof FeatureFlags<T>],
      userKey: userKeyFromContext(this.context as Record<string, unknown>),
      timestamp: new Date().toISOString(),
      extra: extraFromError(error, extra),
    });
  }

  /**
   * Report a custom metric event attributed to the currently served variation.
   * Fire-and-forget: events are batched and never throw.
   * No-ops when Analytics Tracking is off for that flag.
   */
  track(flagKey: string, eventName: string, extra?: Record<string, unknown>): void {
    this.queueApplicationEvent({
      flagKey,
      kind: 'custom',
      eventName,
      variationValue: this.flags[flagKey as keyof FeatureFlags<T>],
      userKey: userKeyFromContext(this.context as Record<string, unknown>),
      timestamp: new Date().toISOString(),
      extra,
    });
  }

  /**
   * Whether Analytics Tracking is on for this flag in the last streamed payload.
   * `undefined` means the server has not sent a map yet (older API / long-polling).
   */
  isAnalyticsEnabled(flagKey: string): boolean | undefined {
    if (this.analyticsByFlag === null) return undefined;
    return this.analyticsByFlag[flagKey] === true;
  }

  /**
   * Update the evaluation context.
   */
  async updateContext(context: C): Promise<void> {
    const pendingContext = { ...this.context, ...context };
    this.context = pendingContext;
    if (this.initializationOptions) {
      this.initializationOptions.context = pendingContext;
    }
    if (this.persistContext) {
      await Promise.resolve(
        this.cacheAdapter.saveContext(this.apiKey, pendingContext)
      );
    }

    if (this.transport && typeof this.transport.fetchFlags === 'function') {
      try {
        const updatedFlags = await this.transport.fetchFlags(pendingContext, {
          persist:
            this.shareHub?.currentRole === 'follower' ? this.persistContext : true,
        });
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
    if (this.eventFlushTimer) {
      clearTimeout(this.eventFlushTimer);
      this.eventFlushTimer = null;
    }
    void this.flushApplicationEvents();
    // Clear all subscribers
    this.subscribers.clear();
    if (this.transport) {
      this.transport.destroy();
    }
    this.shareHub?.destroy();
    this.shareHub = null;
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

  private updateAnalytics(analytics: Record<string, boolean>): void {
    this.analyticsByFlag = { ...analytics };
  }

  private queueApplicationEvent(event: ApplicationEvent): void {
    if (this.previewMode || this.enableFlagmint === false) return;
    if (!shouldReportApplicationEvent(this.analyticsByFlag, event.flagKey)) return;

    this.eventQueue.push(event);
    if (this.eventQueue.length >= MAX_EVENT_BATCH) {
      void this.flushApplicationEvents();
      return;
    }
    if (!this.eventFlushTimer) {
      this.eventFlushTimer = setTimeout(() => {
        this.eventFlushTimer = null;
        void this.flushApplicationEvents();
      }, EVENT_FLUSH_MS);
    }
  }

  private async flushApplicationEvents(): Promise<void> {
    if (this.eventFlushTimer) {
      clearTimeout(this.eventFlushTimer);
      this.eventFlushTimer = null;
    }
    if (this.eventQueue.length === 0) return;

    const batch = this.eventQueue.splice(0, MAX_EVENT_BATCH);
    try {
      await fetch(this.eventsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({ events: batch }),
        keepalive: true,
      });
    } catch (err) {
      logger.error('[FlagClient] Failed to send application events:', err);
    }

    if (this.eventQueue.length > 0) {
      void this.flushApplicationEvents();
    }
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
    const abortController = new AbortController();
    const abortId = setTimeout(() => abortController.abort(), HANDSHAKE_TIMEOUT_MS);
    try {
      const authenticationHandShake = await fetch(this.aslHandshakeUrl, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey },
        signal: abortController.signal,
      });

      if (authenticationHandShake.status === 401) {
        throw sdkError('Invalid API credentials configuration.', 'ERR_AUTH');
      }
      if (authenticationHandShake.status === 429) {
        throw sdkError('Client ingestion limits exceeded.', 'ERR_RATE_LIMITED');
      }
      if (!authenticationHandShake.ok) {
        throw sdkError(
          `Handshake server infrastructure exception (${authenticationHandShake.status})`,
          'ERR_INTERNAL',
          { statusCode: authenticationHandShake.status }
        );
      }

      const handshakeData = await authenticationHandShake.json();
      const sessionId = handshakeData?.data?.sessionId;

      if (typeof sessionId !== 'string' || !sessionId) {
        throw sdkError(
          'Handshake parsing error: Remote platform returned empty session token.',
          'ERR_INTERNAL'
        );
      }

      return sessionId;
    } catch (err) {
      logger.error('[FlagClient] Core Handshake failure encountered:', (err as Error).message);
      throw err;
    } finally {
      clearTimeout(abortId);
    }
  }
}

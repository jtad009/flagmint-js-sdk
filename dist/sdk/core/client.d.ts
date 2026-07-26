import { CacheAdapter, FeatureFlags } from '../core/helpers/types';
import type { Transport } from '../core/transports/Transport';
import { FlagValue } from '../core/evaluation/types';
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
    debugLog?: boolean;
    env?: string;
    enableFlagmint: boolean;
    wrapperInfo?: {
        name: string;
        version: string;
    };
    EventSourceImpl?: any;
}
type FlagUpdateCallback<T> = (flags: FeatureFlags<T>) => void;
export declare class FlagClient<T = unknown, C extends Record<string, any> = Record<string, any>> {
    private apiKey;
    private context;
    private flags;
    private refreshIntervalId;
    private enableOfflineCache;
    private persistContext;
    private cacheTTL;
    private transport;
    private restEndpoint;
    private aslHandshakeUrl;
    private sseEndpoint;
    private readyPromise;
    private resolveReady;
    private rejectReady;
    private onError?;
    private previewMode;
    private rawFlags;
    private cacheAdapter;
    private env?;
    private enableFlagmint?;
    private deferInitialization;
    private initializationOptions?;
    private isInitialized;
    private subscribers;
    /**
     * Creates a new FlagClient instance.
     * @param options - Configuration options for the client.
     */
    constructor(options: FlagClientOptions<C>);
    /**
     * Initializes the client by loading cached flags and context, setting up the transport layer.
     */
    private initialize;
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
    private setupTransport;
    /**
     * Updates flags and notifies all subscribers.
     * This is the centralized method for any flag update.
     */
    private updateFlags;
    /**
     * Notifies all subscribers with the current flags.
     */
    private notifySubscribers;
    /**
     * Subscribe to flag changes.
     * @param callback - Function to call when flags update
     * @returns Unsubscribe function
     */
    subscribe(callback: FlagUpdateCallback<T>): () => void;
    /**
     * Get all flags.
     */
    getFlags(): FeatureFlags<T>;
    /**
     * Get a single flag value.
     */
    getFlag<K extends keyof FeatureFlags<T>>(key: K, fallback?: FeatureFlags<T>[K]): FeatureFlags<T>[K];
    /**
     * Update the evaluation context.
     */
    updateContext(context: C): Promise<void>;
    /**
     * Destroy the client and clean up resources.
     */
    destroy(): void;
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
    ready(timeoutMs?: number): Promise<void>;
    /**
     * Evaluate flags locally (for preview mode).
     */
    private evaluateLocally;
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
    private waitForFlags;
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
    private fetchFreshSessionId;
}
export {};

import { CacheAdapter, FeatureFlags } from '../core/helpers/types';
import type { Transport } from '../core/transports/Transport';
import { FlagValue } from '../core/evaluation/types';
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
    debugLog?: boolean;
    env?: string;
    enableFlagmint: boolean;
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
    private wsEndpoint;
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
     * Sets up the transport layer for the client.
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
     * Wait for the client to be ready.
     * Resolves when: flags are available AND initialization succeeded.
     * Rejects if: initialization/connection fails (even if cached flags exist).
     */
    ready(timeoutMs?: number): Promise<void>;
    /**
     * Evaluate flags locally (for preview mode).
     */
    private evaluateLocally;
    private waitForFlags;
}
export {};

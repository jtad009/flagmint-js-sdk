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
    onError?: (error: Error) => void;
    previewMode?: boolean;
    rawFlags?: Record<string, FlagValue>;
    deferInitialization?: boolean;
    cacheAdapter?: CacheAdapter<C>;
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
    private readyPromise;
    private resolveReady;
    private rejectReady;
    private onError?;
    private previewMode;
    private rawFlags;
    private cacheAdapter;
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
     */
    ready(): Promise<void>;
    /**
     * Evaluate flags locally (for preview mode).
     */
    private evaluateLocally;
}
export {};

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
    /**
     * Creates a new FlagClient instance.
     * @param options - Configuration options for the client.
     */
    constructor(options: FlagClientOptions<C>);
    /**
     * Initializes the client by loading cached flags and context, setting up the transport layer, and starting the auto-refresh timer if enabled.
     * @param options - The options for initializing the client.
     *
     * @throws Will throw an error if initialization fails.
     * @returns {Promise<void>} A promise that resolves when the client is ready.
     * @private
     */
    private initialize;
    /**
     * Sets up the transport layer for the client.
     * @param options - The options for the transport setup.
     */
    private setupTransport;
    getFlag<K extends keyof FeatureFlags<T>>(key: K, fallback?: FeatureFlags<T>[K]): FeatureFlags<T>[K];
    updateContext(context: C): void;
    destroy(): void;
    ready(): Promise<void>;
    private evaluateLocally;
}
export {};

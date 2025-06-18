import type { Transport } from './Transport';
export interface LongPollingOptions {
    /** Minimum delay (ms) between each poll iteration */
    pollIntervalMs?: number;
}
export declare class LongPollingTransport<C, T> implements Transport<C, T> {
    private endpoint;
    private apiKey;
    private context;
    private isStopped;
    private pollIntervalMs;
    constructor(endpoint: string, apiKey: string, context: C, options?: LongPollingOptions);
    init(onUpdate: (flags: Record<string, T>) => void): Promise<void>;
    fetchFlags(context: C): Promise<Record<string, T>>;
    destroy(): void;
}

import type { Transport } from './Transport';
export declare class LongPollingTransport<C, T> implements Transport<C, T> {
    private endpoint;
    private apiKey;
    private context;
    private isStopped;
    constructor(endpoint: string, apiKey: string, context: C);
    init(onUpdate: (flags: Record<string, T>) => void): Promise<void>;
    fetchFlags(context: C): Promise<Record<string, T>>;
    destroy(): void;
}

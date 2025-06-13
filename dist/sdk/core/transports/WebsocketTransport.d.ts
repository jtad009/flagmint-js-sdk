import type { Transport } from './Transport';
export declare class WebSocketTransport<C, T> implements Transport<C, T> {
    private wsUrl;
    private apiKey;
    private maxRetries;
    private initialBackoffMs;
    private socket;
    private flags;
    private context;
    private isReady;
    private onFlagsUpdatedCallback?;
    private retries;
    constructor(wsUrl: string, apiKey: string, maxRetries?: number, initialBackoffMs?: number);
    init(): Promise<void>;
    /**
     * Attempts to connect to the WebSocket server with retry logic.
     * If the connection fails, it will retry with exponential backoff.
     */
    private connectWithRetry;
    fetchFlags(context: C): Promise<Record<string, T>>;
    onFlagsUpdated(callback: (flags: Record<string, T>) => void): void;
    destroy(): void;
    private sendContext;
}

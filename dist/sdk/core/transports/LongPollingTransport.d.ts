import type { Transport } from './Transport';
export interface LongPollingOptions {
    pollIntervalMs?: number;
    maxBackoffMs?: number;
    backoffMultiplier?: number;
}
export declare class LongPollingTransport<C, T> implements Transport<C, T> {
    private endpoint;
    private apiKey;
    private isStopped;
    private pollIntervalMs;
    private maxBackoffMs;
    private backoffMultiplier;
    private pollTimeoutId;
    private onUpdateCallback?;
    private onAnalyticsUpdatedCallback?;
    private currentContext;
    private currentFlags;
    private consecutiveErrors;
    private currentBackoffMs;
    constructor(endpoint: string, apiKey: string, initialContext: C, options?: LongPollingOptions);
    init(): Promise<void>;
    private scheduleNextPoll;
    private poll;
    private applyBackoff;
    private flagsChanged;
    fetchFlags(context: C, options?: {
        persist?: boolean;
    }): Promise<Record<string, T>>;
    private readQuotaPayload;
    onFlagsUpdated(callback: (flags: Record<string, T>) => void): void;
    onAnalyticsUpdated(callback: (analytics: Record<string, boolean>) => void): void;
    destroy(): void;
}

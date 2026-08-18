// core/transports/Transport.ts
export interface Transport<C, T> {
  init(onUpdate?: (flags: Record<string, T>) => void): Promise<void>;
  fetchFlags(context: C, options?: { persist?: boolean }): Promise<Record<string, T>>;
  destroy(): void;
  onFlagsUpdated?: (callback: (flags: Record<string, T>) => void) => void;
  onAnalyticsUpdated?: (callback: (analytics: Record<string, boolean>) => void) => void;
  onContextUpdated?: (callback: (context: C) => void) => void;
  onError?: (callback: (error: Error) => void) => void;
}
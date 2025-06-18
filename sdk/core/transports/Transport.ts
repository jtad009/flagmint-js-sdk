// core/transports/Transport.ts
export interface Transport<C, T> {
  init(onUpdate?: (flags: Record<string, T>) => void): Promise<void>;
  fetchFlags(context: C): Promise<Record<string, T>>;
  destroy(): void;
  onFlagsUpdated?: (callback: (flags: Record<string, T>) => void) => void;
  onContextUpdated?: (callback: (context: C) => void) => void;
}
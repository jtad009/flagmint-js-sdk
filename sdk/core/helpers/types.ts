export type FeatureFlags<T = unknown> = Record<string, T>;

// A cache adapter that may be sync or async
export interface CacheAdapter<C extends Record<string, any> = any> {
  loadFlags(
    apiKey: string,
    ttl: number
  ): Promise<FeatureFlags> | FeatureFlags | null;
  saveFlags(
    apiKey: string,
    data: FeatureFlags
  ): Promise<void> | void;
  loadContext(apiKey: string): Promise<C | null> | C | null;
  saveContext(apiKey: string, ctx: C): Promise<void> | void;
}

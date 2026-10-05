import type { RulesCacheSnapshot } from '@/core/config-sync/types';

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
  /**
   * Config-sync localCache (optional). When omitted, rules are not persisted
   * across reloads — every boot is a cold start (`fullConfig=true`).
   */
  loadRulesSnapshot?(
    apiKey: string
  ): Promise<RulesCacheSnapshot | null> | RulesCacheSnapshot | null;
  saveRulesSnapshot?(
    apiKey: string,
    snapshot: RulesCacheSnapshot
  ): Promise<void> | void;
}

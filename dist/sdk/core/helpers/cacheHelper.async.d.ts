import { FeatureFlags } from '../../core/helpers/types';
export interface AsyncStorageAdapter {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem?(key: string): Promise<void>;
}
export declare function setAsyncCacheStorage(adapter: AsyncStorageAdapter): void;
export declare function loadCachedFlags<T>(apiKey: string, ttl: number): Promise<FeatureFlags<T> | null>;
export declare function saveCachedFlags<T>(apiKey: string, data: FeatureFlags<T>): Promise<void>;
export declare function loadCachedContext<C>(apiKey: string): Promise<C | null>;
export declare function saveCachedContext<C>(apiKey: string, context: C): Promise<void>;

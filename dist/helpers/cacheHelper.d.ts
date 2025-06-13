import { FeatureFlags } from '../../core/helpers/types';
export interface StorageAdapter {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem?(key: string): void;
}
export declare function setCacheStorage(customStorage: StorageAdapter): void;
export declare function loadCachedFlags<T>(apiKey: string, ttl: number): FeatureFlags<T> | null;
export declare function saveCachedFlags<T>(apiKey: string, data: FeatureFlags<T>): void;
export declare function loadCachedContext<C>(apiKey: string): C | null;
export declare function saveCachedContext<C>(apiKey: string, context: C): void;

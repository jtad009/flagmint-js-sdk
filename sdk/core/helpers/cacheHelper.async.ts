// asyncCacheHelper.ts
import { FeatureFlags } from '@/core/helpers/types';
export interface AsyncStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem?(key: string): Promise<void>;
}

function getFlagsKey(apiKey: string): string {
  return `flagmint_${apiKey}_flags`;
}

function getContextKey(apiKey: string): string {
  return `flagmint_${apiKey}_context`;
}

let storage: AsyncStorageAdapter | null = null;

export function setAsyncCacheStorage(adapter: AsyncStorageAdapter) {
  storage = adapter;
}

export async function loadCachedFlags<T>(apiKey: string, ttl: number): Promise<FeatureFlags<T> | null> {
  if (!storage) throw new Error('Async storage not set');
  try {
    const raw = await storage.getItem(getFlagsKey(apiKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > ttl) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export async function saveCachedFlags<T>(apiKey: string, data: FeatureFlags<T>): Promise<void> {
  if (!storage) throw new Error('Async storage not set');
  try {
    await storage.setItem(getFlagsKey(apiKey), JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // silent fail
  }
}

export async function loadCachedContext<C>(apiKey: string): Promise<C | null> {
  if (!storage) throw new Error('Async storage not set');
  try {
    const raw = await storage.getItem(getContextKey(apiKey));
    return raw ? (JSON.parse(raw) as C) : null;
  } catch {
    return null;
  }
}

export async function saveCachedContext<C>(apiKey: string, context: C): Promise<void> {
  if (!storage) throw new Error('Async storage not set');
  try {
    await storage.setItem(getContextKey(apiKey), JSON.stringify(context));
  } catch {
    // silent fail
  }
}
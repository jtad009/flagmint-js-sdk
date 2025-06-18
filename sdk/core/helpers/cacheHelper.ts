import { FeatureFlags } from '@/core/helpers/types';
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

let storage: StorageAdapter = {
  getItem: (key) => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
};

export function setCacheStorage(customStorage: StorageAdapter) {
  storage = customStorage;
}

function getFlagsKey(apiKey: string): string {
  return `flagmint_${apiKey}_flags`;
}

function getContextKey(apiKey: string): string {
  return `flagmint_${apiKey}_context`;
}

export function loadCachedFlags<T>(apiKey: string, ttl: number): FeatureFlags<T> | null {
  try {
    const raw = storage.getItem(getFlagsKey(apiKey));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > ttl) return null;

    return parsed.data;
  } catch {
    return null;
  }
}

export function saveCachedFlags<T>(apiKey: string, data: FeatureFlags<T>) {
  try {
    storage.setItem(getFlagsKey(apiKey), JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // silent fail
  }
}

export function loadCachedContext<C>(apiKey: string): C | null {
  try {
    const raw = storage.getItem(getContextKey(apiKey));
    return raw ? (JSON.parse(raw) as C) : null;
  } catch {
    return null;
  }
}

export function saveCachedContext<C>(apiKey: string, context: C) {
  try {
    storage.setItem(getContextKey(apiKey), JSON.stringify(context));
  } catch {
    // silent fail
  }
}

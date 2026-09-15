import { FeatureFlags } from '@/core/helpers/types';
import type { RulesCacheSnapshot } from '@/core/config-sync/types';

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
  removeItem: (key) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
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

function getRulesKey(apiKey: string): string {
  return `flagmint_${apiKey}_rules`;
}

function parseRulesSnapshot(raw: string): RulesCacheSnapshot | null {
  try {
    const parsed = JSON.parse(raw) as RulesCacheSnapshot;
    if (
      !parsed ||
      typeof parsed.version !== 'number' ||
      typeof parsed.expiresAt !== 'number' ||
      !Array.isArray(parsed.flags) ||
      typeof parsed.segments !== 'object' ||
      parsed.segments === null
    ) {
      return null;
    }
    return {
      version: parsed.version,
      expiresAt: parsed.expiresAt,
      flags: parsed.flags,
      segments: parsed.segments || {},
    };
  } catch {
    return null;
  }
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

/** Config-sync rules localCache — no wall-clock TTL; lease `expiresAt` gates reuse. */
export function loadCachedRulesSnapshot(apiKey: string): RulesCacheSnapshot | null {
  try {
    const raw = storage.getItem(getRulesKey(apiKey));
    if (!raw) return null;
    return parseRulesSnapshot(raw);
  } catch {
    return null;
  }
}

export function saveCachedRulesSnapshot(apiKey: string, snapshot: RulesCacheSnapshot) {
  try {
    storage.setItem(getRulesKey(apiKey), JSON.stringify(snapshot));
  } catch {
    // silent fail
  }
}

export function clearCachedRulesSnapshot(apiKey: string) {
  try {
    storage.removeItem?.(getRulesKey(apiKey));
  } catch {
    // silent fail
  }
}

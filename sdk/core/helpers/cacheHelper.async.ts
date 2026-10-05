// asyncCacheHelper.ts
import { FeatureFlags } from '@/core/helpers/types';
import type { RulesCacheSnapshot } from '@/core/config-sync/types';

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

export async function loadCachedRulesSnapshot(
  apiKey: string,
): Promise<RulesCacheSnapshot | null> {
  if (!storage) throw new Error('Async storage not set');
  try {
    const raw = await storage.getItem(getRulesKey(apiKey));
    if (!raw) return null;
    return parseRulesSnapshot(raw);
  } catch {
    return null;
  }
}

export async function saveCachedRulesSnapshot(
  apiKey: string,
  snapshot: RulesCacheSnapshot,
): Promise<void> {
  if (!storage) throw new Error('Async storage not set');
  try {
    await storage.setItem(getRulesKey(apiKey), JSON.stringify(snapshot));
  } catch {
    // silent fail
  }
}

export async function clearCachedRulesSnapshot(apiKey: string): Promise<void> {
  if (!storage) throw new Error('Async storage not set');
  try {
    await storage.removeItem?.(getRulesKey(apiKey));
  } catch {
    // silent fail
  }
}

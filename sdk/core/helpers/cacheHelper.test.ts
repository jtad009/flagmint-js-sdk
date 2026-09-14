import {
  clearCachedRulesSnapshot,
  loadCachedRulesSnapshot,
  saveCachedRulesSnapshot,
  setCacheStorage,
} from './cacheHelper';
import type { RulesCacheSnapshot } from '@/core/config-sync/types';

describe('rules localCache helpers', () => {
  const mem = new Map<string, string>();

  beforeEach(() => {
    mem.clear();
    setCacheStorage({
      getItem: (key) => mem.get(key) ?? null,
      setItem: (key, value) => {
        mem.set(key, value);
      },
      removeItem: (key) => {
        mem.delete(key);
      },
    });
  });

  it('round-trips a rules snapshot', () => {
    const snapshot: RulesCacheSnapshot = {
      version: 7,
      expiresAt: Date.now() + 60_000,
      flags: [
        {
          key: 'demo',
          type: 'boolean',
          is_active: true,
          default_value: false,
          targeting_rules: [],
          variations: [{ id: 'on', value: true }],
          rollouts: {},
          analytics_enabled: true,
        },
      ],
      segments: { s1: { id: 's1', rules: [] } },
    };
    saveCachedRulesSnapshot('ff_test', snapshot);
    expect(loadCachedRulesSnapshot('ff_test')).toEqual(snapshot);
  });

  it('rejects malformed snapshots', () => {
    mem.set('flagmint_ff_test_rules', JSON.stringify({ version: 1 }));
    expect(loadCachedRulesSnapshot('ff_test')).toBeNull();
  });

  it('clears the rules snapshot', () => {
    saveCachedRulesSnapshot('ff_test', {
      version: 1,
      expiresAt: Date.now() + 1,
      flags: [
        {
          key: 'a',
          type: 'boolean',
          is_active: true,
          default_value: true,
          targeting_rules: [],
          variations: [],
          rollouts: {},
          analytics_enabled: false,
        },
      ],
      segments: {},
    });
    clearCachedRulesSnapshot('ff_test');
    expect(loadCachedRulesSnapshot('ff_test')).toBeNull();
  });
});

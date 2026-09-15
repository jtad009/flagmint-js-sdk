import { signConfigPayload } from './signPayload';
import { RulesStore, createEmptyRulesState, reduceRules } from './rulesStore';
import type {
  DeltaConfigPayload,
  FullConfigPayload,
  LeasePayload,
  SdkFlagConfig,
} from './types';

const NOW = 1_700_000_000_000;
const TTL = 86_400_000;

function flag(key: string, value: unknown = false): SdkFlagConfig {
  return {
    key,
    type: 'boolean',
    is_active: true,
    default_value: value,
    targeting_rules: [],
    variations: [{ id: 'v1', value }],
    rollouts: {},
    analytics_enabled: true,
  };
}

function fullConfig(
  version: number,
  flags: SdkFlagConfig[],
  mac?: Uint8Array,
): FullConfigPayload {
  const body = {
    type: 'fullConfig' as const,
    version,
    compiledAt: NOW,
    expiresAt: NOW + TTL,
    flags,
    segments: {},
  };
  if (!mac) return { ...body, signature: 'unsigned' };
  return { ...body, signature: signConfigPayload(body, mac) };
}

function lease(version: number, mac?: Uint8Array): LeasePayload {
  const body = {
    type: 'lease' as const,
    version,
    serverNow: NOW,
    expiresAt: NOW + TTL,
  };
  if (!mac) return { ...body, signature: 'unsigned' };
  return { ...body, signature: signConfigPayload(body, mac) };
}

function delta(
  fromVersion: number,
  toVersion: number,
  upserts: SdkFlagConfig[],
  deletes: string[] = [],
  mac?: Uint8Array,
): DeltaConfigPayload {
  const body = {
    type: 'delta' as const,
    fromVersion,
    toVersion,
    compiledAt: NOW,
    expiresAt: NOW + TTL,
    upserts,
    deletes,
    segments: {},
  };
  if (!mac) return { ...body, signature: 'unsigned' };
  return { ...body, signature: signConfigPayload(body, mac) };
}

describe('RulesStore reducer', () => {
  it('replaceAll from fullConfig', () => {
    const result = reduceRules(
      createEmptyRulesState(),
      fullConfig(3, [flag('a', true), flag('b', false)]),
      NOW,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.version).toBe(3);
    expect(result.state.flags.get('a')?.default_value).toBe(true);
    expect(result.state.ready).toBe(true);
    expect(result.state.needsFullConfig).toBe(false);
  });

  it('applyPatch upsert and delete', () => {
    let state = createEmptyRulesState();
    state = reduceRules(state, fullConfig(1, [flag('keep'), flag('gone')]), NOW).state;
    const patched = reduceRules(
      state,
      delta(1, 2, [flag('keep', true), flag('new')], ['gone']),
      NOW,
    );
    expect(patched.ok).toBe(true);
    if (!patched.ok) return;
    expect(patched.state.version).toBe(2);
    expect(patched.state.flags.has('gone')).toBe(false);
    expect(patched.state.flags.get('new')?.key).toBe('new');
    expect(patched.state.flags.get('keep')?.default_value).toBe(true);
  });

  it('version gap sets needsFullConfig', () => {
    let state = createEmptyRulesState();
    state = reduceRules(state, fullConfig(1, [flag('a')]), NOW).state;
    const gap = reduceRules(state, delta(5, 6, [flag('a', true)]), NOW);
    expect(gap.ok).toBe(false);
    if (gap.ok) return;
    expect(gap.reason).toBe('version_gap');
    expect(gap.state.needsFullConfig).toBe(true);
  });

  it('ordered deltas catch-up', () => {
    let state = createEmptyRulesState();
    state = reduceRules(state, fullConfig(1, [flag('a')]), NOW).state;
    const catchUp = reduceRules(
      state,
      {
        type: 'deltas',
        fromVersion: 1,
        toVersion: 3,
        expiresAt: NOW + TTL,
        items: [
          delta(1, 2, [flag('a', true)]),
          delta(2, 3, [flag('b')], []),
        ],
        signature: 'unsigned',
      },
      NOW,
    );
    expect(catchUp.ok).toBe(true);
    if (!catchUp.ok) return;
    expect(catchUp.state.version).toBe(3);
    expect(catchUp.state.flags.get('a')?.default_value).toBe(true);
    expect(catchUp.state.flags.has('b')).toBe(true);
  });

  it('deltas catch-up accepts historical item TTLs when envelope is fresh', () => {
    let state = createEmptyRulesState();
    state = reduceRules(state, fullConfig(1, [flag('a')]), NOW).state;

    const staleItem = {
      ...delta(1, 2, [flag('a', true)]),
      expiresAt: NOW - 1,
    };
    const catchUp = reduceRules(
      state,
      {
        type: 'deltas',
        fromVersion: 1,
        toVersion: 2,
        expiresAt: NOW + TTL,
        items: [staleItem],
        signature: 'unsigned',
      },
      NOW,
    );

    expect(catchUp.ok).toBe(true);
    if (!catchUp.ok) return;
    expect(catchUp.state.version).toBe(2);
    expect(catchUp.state.ready).toBe(true);
    expect(catchUp.state.expiresAt).toBe(NOW + TTL);
    expect(catchUp.state.flags.get('a')?.default_value).toBe(true);
  });

  it('lease renew updates expiry without clearing flags', () => {
    let state = createEmptyRulesState();
    state = reduceRules(state, fullConfig(2, [flag('a')]), NOW).state;
    const renewed = reduceRules(state, lease(2), NOW);
    expect(renewed.ok).toBe(true);
    if (!renewed.ok) return;
    expect(renewed.state.flags.size).toBe(1);
    expect(renewed.state.version).toBe(2);
    expect(renewed.state.needsFullConfig).toBe(false);
    expect(renewed.state.expiresAt).toBe(NOW + TTL);
  });

  it('lease ahead of stored flags keeps version bookmark and asks for fullConfig', () => {
    let state = createEmptyRulesState();
    state = reduceRules(state, fullConfig(5, [flag('a')]), NOW).state;

    const ahead = reduceRules(state, lease(9), NOW);
    expect(ahead.ok).toBe(true);
    if (!ahead.ok) return;

    // Still on 5 so a following deltas catch-up from 5 can apply.
    expect(ahead.state.version).toBe(5);
    expect(ahead.state.flags.get('a')?.default_value).toBe(false);
    expect(ahead.state.needsFullConfig).toBe(true);
    expect(ahead.state.expiresAt).toBe(NOW + TTL);
    expect(ahead.state.ready).toBe(true);

    // Same connection: catch-up from the kept bookmark still works.
    const catchUp = reduceRules(
      ahead.state,
      {
        type: 'deltas',
        fromVersion: 5,
        toVersion: 9,
        expiresAt: NOW + TTL,
        items: [
          delta(5, 6, [flag('a', true)]),
          delta(6, 7, [flag('a', true)]),
          delta(7, 8, [flag('a', true)]),
          delta(8, 9, [flag('a', true)]),
        ],
        signature: 'unsigned',
      },
      NOW,
    );
    expect(catchUp.ok).toBe(true);
    if (!catchUp.ok) return;
    expect(catchUp.state.version).toBe(9);
    expect(catchUp.state.needsFullConfig).toBe(false);
  });

  it('deltas envelope that does not reach toVersion is a version gap', () => {
    let state = createEmptyRulesState();
    state = reduceRules(state, fullConfig(1, [flag('a')]), NOW).state;

    const emptyItems = reduceRules(
      state,
      {
        type: 'deltas',
        fromVersion: 1,
        toVersion: 3,
        expiresAt: NOW + TTL,
        items: [],
        signature: 'unsigned',
      },
      NOW,
    );
    expect(emptyItems.ok).toBe(false);
    if (emptyItems.ok) return;
    expect(emptyItems.reason).toBe('version_gap');
    expect(emptyItems.state.version).toBe(1);
    expect(emptyItems.state.needsFullConfig).toBe(true);

    const shortChain = reduceRules(
      state,
      {
        type: 'deltas',
        fromVersion: 1,
        toVersion: 3,
        expiresAt: NOW + TTL,
        items: [delta(1, 2, [flag('a', true)])],
        signature: 'unsigned',
      },
      NOW,
    );
    expect(shortChain.ok).toBe(false);
    if (shortChain.ok) return;
    expect(shortChain.reason).toBe('version_gap');
    expect(shortChain.state.version).toBe(1);
    expect(shortChain.state.needsFullConfig).toBe(true);
  });

  it('expired payload marks not ready', () => {
    const result = reduceRules(
      createEmptyRulesState(),
      {
        ...fullConfig(1, [flag('a')]),
        expiresAt: NOW - 1,
      },
      NOW,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('expired');
    expect(result.state.ready).toBe(false);
  });
});

describe('RulesStore MAC gate', () => {
  it('rejects unsigned / wrong-key payloads and accepts verified ones', () => {
    const mac = new Uint8Array(32).fill(3);
    const store = new RulesStore(mac);

    const bad = store.applySigned(fullConfig(1, [flag('a')]), NOW);
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.reason).toBe('bad_signature');

    const good = store.applySigned(fullConfig(1, [flag('a', true)], mac), NOW);
    expect(good.ok).toBe(true);
    expect(store.getFlag('a')?.default_value).toBe(true);

    const wrongKey = new Uint8Array(32).fill(4);
    const tampered = store.applySigned(delta(1, 2, [flag('a', false)], [], wrongKey), NOW);
    expect(tampered.ok).toBe(false);
    if (!tampered.ok) expect(tampered.reason).toBe('bad_signature');
    expect(store.getFlag('a')?.default_value).toBe(true);
  });

  it('hydrateFromSnapshot respects expiry for reconnect mode', () => {
    const store = new RulesStore();
    store.hydrateFromSnapshot(
      {
        version: 9,
        expiresAt: NOW + TTL,
        flags: [flag('cached', true)],
        segments: {},
      },
      NOW,
    );
    expect(store.wantsFullConfig(NOW)).toBe(false);
    expect(store.sinceVersion(NOW)).toBe(9);

    store.hydrateFromSnapshot(
      {
        version: 9,
        expiresAt: NOW - 1,
        flags: [flag('cached', true)],
        segments: {},
      },
      NOW,
    );
    expect(store.wantsFullConfig(NOW)).toBe(true);
    expect(store.getFailClosedDefault('cached')).toBe(true);
  });
});

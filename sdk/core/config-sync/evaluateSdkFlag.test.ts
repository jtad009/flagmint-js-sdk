/**
 * Thin SdkFlagConfig / fail-closed wrappers around the FF-EU-ported evaluator.
 */
import {
  evaluateSdkFlag,
  evaluateAllSdkFlags,
  prepareContextForEvaluator,
  prepareContextForLocalEval,
  mapToRecord,
} from './evaluateSdkFlag';
import { hashPiiValue, PII_VALUE_ENCODING } from './piiHash';
import type { SdkFlagConfig } from './types';

function boolFlag(overrides: Partial<SdkFlagConfig> = {}): SdkFlagConfig {
  return {
    key: 'demo',
    type: 'boolean',
    is_active: true,
    default_value: false,
    targeting_rules: [],
    variations: [
      { id: 'on', value: true },
      { id: 'off', value: false },
    ],
    rollouts: {},
    analytics_enabled: true,
    ...overrides,
  };
}

describe('evaluateSdkFlag (RuleEngine wrapper)', () => {
  it('returns off variation when inactive', () => {
    const flag = boolFlag({
      is_active: false,
      off_variation_id: 'off',
      default_value: true,
    });
    expect(evaluateSdkFlag(flag, { kind: 'user', key: 'u1' }, {})).toBe(false);
  });

  it('matches custom targeting via flag-evaluator rules', () => {
    const flag = boolFlag({
      default_value: false,
      targeting_rules: [
        {
          id: 'r1',
          kind: 'custom',
          order_index: 0,
          logical_op: 'AND',
          conditions: [{ attribute: 'plan', operator: 'eq', value: 'pro' }],
          variation_id: 'on',
        },
      ],
    });
    expect(
      evaluateSdkFlag(flag, { kind: 'user', key: 'u1', plan: 'pro' }, {}),
    ).toBe(true);
    expect(
      evaluateSdkFlag(flag, { kind: 'user', key: 'u1', plan: 'free' }, {}),
    ).toBe(false);
  });

  it('keeps organization attrs for nested multi context via flattenEvaluationContext', () => {
    const flag = boolFlag({
      default_value: false,
      targeting_rules: [
        {
          id: 'r1',
          kind: 'custom',
          order_index: 0,
          conditions: [
            { attribute: 'organization.tier', operator: 'eq', value: 'enterprise' },
          ],
          variation_id: 'on',
        },
      ],
    });
    expect(
      evaluateSdkFlag(
        flag,
        {
          user: { key: 'u1', plan: 'free' },
          organization: { key: 'org1', tier: 'enterprise' },
        },
        {},
      ),
    ).toBe(true);
  });

  it('matches nested user.plan without kind', () => {
    const flag = boolFlag({
      default_value: false,
      targeting_rules: [
        {
          id: 'r1',
          kind: 'custom',
          order_index: 0,
          conditions: [{ attribute: 'user.plan', operator: 'eq', value: 'pro' }],
          variation_id: 'on',
        },
      ],
    });
    expect(
      evaluateSdkFlag(flag, { user: { key: 'u1', plan: 'pro' } }, {}),
    ).toBe(true);
  });

  it('failClosedDefaultsOnly skips targeting', () => {
    const flag = boolFlag({
      default_value: false,
      targeting_rules: [
        {
          id: 'r1',
          kind: 'custom',
          order_index: 0,
          conditions: [{ attribute: 'plan', operator: 'eq', value: 'pro' }],
          variation_id: 'on',
        },
      ],
    });
    const map = evaluateAllSdkFlags(
      [flag],
      { kind: 'user', key: 'u1', plan: 'pro' },
      {},
      { failClosedDefaultsOnly: true },
    );
    expect(map.demo).toBe(false);
  });

  it('flattens WeSeeDo-style kind:multi with kind prefixes', () => {
    const flag = boolFlag({
      default_value: false,
      targeting_rules: [
        {
          id: 'r1',
          kind: 'custom',
          order_index: 0,
          conditions: [
            { attribute: 'organization.plan', operator: 'eq', value: 'growth' },
          ],
          variation_id: 'on',
        },
      ],
    });
    // MultiContext = kind + user + organization only (FF-EU schema;
    // additionalProperties: false — no top-level custom on multi).
    const weseedoContext = {
      kind: 'multi',
      user: {
        kind: 'user',
        key: '71a6f60c-93ec-4aa3-a666-99e2c2a3c013',
        email: 'development@weseedo.nl',
        user_id: '71a6f60c-93ec-4aa3-a666-99e2c2a3c013',
        anonymous: false,
      },
      organization: {
        kind: 'organization',
        key: 'b8cdb1b2-ff7f-4ccd-becc-994e9ffa841c',
        plan: 'growth',
        organization_name: 'Weseedo B.V',
        custom: { source: 'SDK' },
      },
    };
    expect(evaluateSdkFlag(flag, weseedoContext, {})).toBe(true);

    // user.key must remain the user id (not overwritten by org key)
    const byUserKey = boolFlag({
      default_value: false,
      targeting_rules: [
        {
          id: 'r1',
          kind: 'custom',
          order_index: 0,
          conditions: [
            {
              attribute: 'user.key',
              operator: 'eq',
              value: '71a6f60c-93ec-4aa3-a666-99e2c2a3c013',
            },
          ],
          variation_id: 'on',
        },
      ],
    });
    expect(evaluateSdkFlag(byUserKey, weseedoContext, {})).toBe(true);
  });

  it('uses flag-level rollout when there are no targeting rules', () => {
    const flag = boolFlag({
      targeting_rules: [],
      rollouts: {
        'roll-1': { strategy: 'percentage', percentage: 100, salt: 's' },
      },
    });
    expect(evaluateSdkFlag(flag, { kind: 'user', key: 'u1' }, {})).toBe(true);
  });

  it('hashes plaintext email before compare when pii wire options are set', () => {
    const salt = 'test-pii-salt';
    const hashed = hashPiiValue('israel@weseedo.nl', salt);
    const flag = boolFlag({
      default_value: false,
      targeting_rules: [
        {
          id: 'r1',
          kind: 'custom',
          order_index: 0,
          conditions: [{ attribute: 'email', operator: 'in', value: [hashed] }],
          variation_id: 'on',
        },
      ],
    });
    const pii = {
      piiAttributes: ['email'],
      piiSalt: salt,
      piiValueEncoding: PII_VALUE_ENCODING,
    };
    expect(
      evaluateSdkFlag(
        flag,
        { kind: 'user', key: 'u1', email: 'Israel@WeSeeDo.nl' },
        {},
        pii,
      ),
    ).toBe(true);
    expect(
      evaluateSdkFlag(
        flag,
        { kind: 'user', key: 'u1', email: 'other@example.com' },
        {},
        pii,
      ),
    ).toBe(false);
  });
});

describe('prepareContextForEvaluator / mapToRecord', () => {
  it('does not drop organization when flattening nested multi', () => {
    const prepared = prepareContextForEvaluator({
      user: { key: 'u1', plan: 'free' },
      organization: { key: 'org1', tier: 'enterprise' },
    });
    expect(prepared['user.key']).toBe('u1');
    expect(prepared['organization.tier']).toBe('enterprise');
  });

  it('prepareContextForLocalEval hashes user.email', () => {
    const salt = 's';
    const flat = prepareContextForLocalEval(
      { kind: 'user', key: 'u1', email: 'A@B.com' },
      {
        piiAttributes: ['email'],
        piiSalt: salt,
        piiValueEncoding: PII_VALUE_ENCODING,
      },
    );
    expect(flat['user.email']).toBe(hashPiiValue('A@B.com', salt));
    expect(flat['user.key']).toBe('u1');
  });

  it('mapToRecord is ES2018-safe', () => {
    const map = new Map<string, number>([
      ['a', 1],
      ['b', 2],
    ]);
    expect(mapToRecord(map)).toEqual({ a: 1, b: 2 });
  });
});

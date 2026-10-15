import { createHmac } from 'crypto';
import {
  PII_VALUE_ENCODING,
  applyPiiHashToFlatContext,
  hashPiiValue,
  isPiiAttribute,
  isPiiWireBroken,
  normalizePiiString,
  payloadHasExplicitPiiFields,
  payloadRequiresUsablePiiWire,
  piiWireOptionsFromPayload,
  resolvePiiWireForDelta,
} from './piiHash';

describe('piiHash (hmac-v1)', () => {
  describe('normalizePiiString', () => {
    it('trims and lowercases', () => {
      expect(normalizePiiString('  Ada@Example.com ')).toBe('ada@example.com');
    });
  });

  describe('hashPiiValue', () => {
    it('matches Node HMAC-SHA256 hex of the normalized string', () => {
      const salt = 'salt-1';
      const value = 'User@Example.COM';
      const expected = createHmac('sha256', salt)
        .update('user@example.com')
        .digest('hex');
      expect(hashPiiValue(value, salt)).toBe(expected);
      expect(hashPiiValue(value, salt)).toMatch(/^[a-f0-9]{64}$/);
    });

    it('is stable for equivalent casing / whitespace', () => {
      const salt = 'abc';
      expect(hashPiiValue('Ada@Example.com', salt)).toBe(
        hashPiiValue('ada@example.com', salt),
      );
      expect(hashPiiValue('Ada@Example.com', salt)).toBe(
        hashPiiValue('  ADA@EXAMPLE.COM  ', salt),
      );
    });
  });

  describe('isPiiAttribute', () => {
    it('matches bare and kind-prefixed keys', () => {
      expect(isPiiAttribute('email', ['email'])).toBe(true);
      expect(isPiiAttribute('user.email', ['email'])).toBe(true);
      expect(isPiiAttribute('plan', ['email'])).toBe(false);
    });
  });

  describe('payloadRequiresUsablePiiWire / isPiiWireBroken', () => {
    it('requires usable wire when PII attrs are listed', () => {
      expect(payloadRequiresUsablePiiWire({ piiAttributes: ['email'] })).toBe(
        true,
      );
      expect(payloadRequiresUsablePiiWire({ piiAttributes: [] })).toBe(false);
      expect(
        payloadRequiresUsablePiiWire({ piiValueEncoding: 'hmac-v2' }),
      ).toBe(true);
    });

    it('marks broken when required but unresolved', () => {
      expect(
        isPiiWireBroken({ piiAttributes: ['email'] }, null, false),
      ).toBe(true);
      expect(
        isPiiWireBroken(
          {
            piiSalt: 's',
            piiAttributes: ['email'],
            piiValueEncoding: PII_VALUE_ENCODING,
          },
          {
            piiSalt: 's',
            piiAttributes: ['email'],
            piiValueEncoding: PII_VALUE_ENCODING,
          },
          false,
        ),
      ).toBe(false);
    });
  });

  describe('piiWireOptionsFromPayload', () => {
    it('returns null without salt or wrong encoding', () => {
      expect(piiWireOptionsFromPayload({ piiAttributes: ['email'] })).toBeNull();
      expect(
        piiWireOptionsFromPayload({
          piiSalt: 's',
          piiValueEncoding: 'other',
          piiAttributes: ['email'],
        }),
      ).toBeNull();
    });

    it('parses hmac-v1 options', () => {
      expect(
        piiWireOptionsFromPayload({
          piiSalt: 's',
          piiValueEncoding: PII_VALUE_ENCODING,
          piiAttributes: ['email', 1, 'phone'],
        }),
      ).toEqual({
        piiAttributes: ['email', 'phone'],
        piiSalt: 's',
        piiValueEncoding: PII_VALUE_ENCODING,
      });
    });
  });

  describe('payloadHasExplicitPiiFields / resolvePiiWireForDelta', () => {
    const prior = {
      piiAttributes: ['email'],
      piiSalt: 'old',
      piiValueEncoding: PII_VALUE_ENCODING,
    };

    it('detects omitted vs explicit fields', () => {
      expect(payloadHasExplicitPiiFields({})).toBe(false);
      expect(payloadHasExplicitPiiFields({ piiSalt: '' })).toBe(true);
      expect(payloadHasExplicitPiiFields({ piiAttributes: [] })).toBe(true);
      expect(payloadHasExplicitPiiFields({ piiValueEncoding: 'hmac-v2' })).toBe(
        true,
      );
    });

    it('keeps prior when delta omits PII fields', () => {
      expect(resolvePiiWireForDelta(prior, {})).toEqual(prior);
    });

    it('clears when explicit fields are unusable', () => {
      expect(resolvePiiWireForDelta(prior, { piiSalt: '' })).toBeNull();
      expect(
        resolvePiiWireForDelta(prior, {
          piiSalt: 'x',
          piiValueEncoding: 'hmac-v2',
        }),
      ).toBeNull();
    });

    it('merges salt-only delta with prior attributes', () => {
      expect(resolvePiiWireForDelta(prior, { piiSalt: 'new' })).toEqual({
        piiAttributes: ['email'],
        piiSalt: 'new',
        piiValueEncoding: PII_VALUE_ENCODING,
      });
    });

    it('merges attrs-only delta with prior salt', () => {
      expect(
        resolvePiiWireForDelta(prior, { piiAttributes: ['phone'] }),
      ).toEqual({
        piiAttributes: ['phone'],
        piiSalt: 'old',
        piiValueEncoding: PII_VALUE_ENCODING,
      });
    });

    it('replaces when explicit fields are usable', () => {
      expect(
        resolvePiiWireForDelta(prior, {
          piiSalt: 'new',
          piiAttributes: ['phone'],
          piiValueEncoding: PII_VALUE_ENCODING,
        }),
      ).toEqual({
        piiAttributes: ['phone'],
        piiSalt: 'new',
        piiValueEncoding: PII_VALUE_ENCODING,
      });
    });
  });

  describe('applyPiiHashToFlatContext', () => {
    const opts = {
      piiAttributes: ['email'],
      piiSalt: 'salt-1',
      piiValueEncoding: PII_VALUE_ENCODING,
    };

    it('hashes PII strings and leaves other keys alone', () => {
      const hashed = hashPiiValue('a@b.com', opts.piiSalt);
      const out = applyPiiHashToFlatContext(
        { 'user.email': 'A@B.com', plan: 'pro' },
        opts,
      );
      expect(out['user.email']).toBe(hashed);
      expect(out.plan).toBe('pro');
    });

    it('hashes values that look like 64-char hex (no shape heuristic)', () => {
      const plaintextHex = 'a'.repeat(64);
      const out = applyPiiHashToFlatContext({ email: plaintextHex }, opts);
      expect(out.email).toBe(hashPiiValue(plaintextHex, opts.piiSalt));
      expect(out.email).not.toBe(plaintextHex);
    });

    it('hashes hex-looking strings inside arrays', () => {
      const plaintextHex = 'b'.repeat(64);
      const out = applyPiiHashToFlatContext({ email: [plaintextHex, 'x'] }, opts);
      expect(out.email).toEqual([
        hashPiiValue(plaintextHex, opts.piiSalt),
        hashPiiValue('x', opts.piiSalt),
      ]);
    });

    it('leaves context unchanged when alreadyHashed is set', () => {
      const hashed = hashPiiValue('a@b.com', opts.piiSalt);
      const ctx = { email: hashed };
      expect(applyPiiHashToFlatContext(ctx, opts, { alreadyHashed: true })).toBe(
        ctx,
      );
    });

    it('is a no-op without options', () => {
      const ctx = { email: 'a@b.com' };
      expect(applyPiiHashToFlatContext(ctx, null)).toBe(ctx);
    });
  });
});

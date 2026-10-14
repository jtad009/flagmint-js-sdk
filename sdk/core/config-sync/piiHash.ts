import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';

/** Must match FF-EU `PII_VALUE_ENCODING`. */
export const PII_VALUE_ENCODING = 'hmac-v1' as const;

const textEncoder = new TextEncoder();

/** 64-char lowercase hex — already-hashed values are left alone. */
const HASH_HEX_PATTERN = /^[0-9a-f]{64}$/;

/**
 * Client PII wire options from signed `fullConfig` / `delta`.
 */
export type PiiWireOptions = {
  piiAttributes: string[];
  piiSalt: string;
  piiValueEncoding?: typeof PII_VALUE_ENCODING | string;
};

/**
 * Normalize a string before PII hashing (trim + lowercase).
 * Must match FF-EU `normalizePiiString`.
 *
 * @param value Raw attribute value
 */
export function normalizePiiString(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * HMAC-SHA256 hex digest of a normalized PII string.
 * Must match FF-EU `hashPiiValue`.
 *
 * @param value Plaintext value
 * @param salt Client-visible salt from the signed config
 */
export function hashPiiValue(value: string, salt: string): string {
  const mac = hmac(
    sha256,
    textEncoder.encode(salt),
    textEncoder.encode(normalizePiiString(value)),
  );
  return bytesToHex(mac);
}

/**
 * Whether a context / rule attribute key is PII.
 * Matches bare keys (`email`) and kind-prefixed forms (`user.email`).
 *
 * @param attribute Attribute key from context or rule
 * @param piiAttributes Keys from signed config
 */
export function isPiiAttribute(
  attribute: string | undefined | null,
  piiAttributes: readonly string[],
): boolean {
  if (!attribute || piiAttributes.length === 0) return false;
  const attr = attribute.trim();
  if (!attr) return false;
  for (const key of piiAttributes) {
    if (!key) continue;
    if (attr === key) return true;
    if (attr.endsWith(`.${key}`)) return true;
  }
  return false;
}

/**
 * Parse PII wire options from a config-sync payload body.
 *
 * @param payload Signed fullConfig / delta fields
 * @returns Options when salt + encoding are usable; otherwise null
 */
export function piiWireOptionsFromPayload(
  payload: {
    piiAttributes?: unknown;
    piiSalt?: unknown;
    piiValueEncoding?: unknown;
  } | null | undefined,
): PiiWireOptions | null {
  if (!payload) return null;
  const salt = typeof payload.piiSalt === 'string' ? payload.piiSalt : '';
  if (!salt) return null;
  const encoding =
    typeof payload.piiValueEncoding === 'string'
      ? payload.piiValueEncoding
      : PII_VALUE_ENCODING;
  if (encoding !== PII_VALUE_ENCODING) return null;
  const attrs = Array.isArray(payload.piiAttributes)
    ? payload.piiAttributes.filter((k): k is string => typeof k === 'string')
    : [];
  return {
    piiAttributes: attrs,
    piiSalt: salt,
    piiValueEncoding: PII_VALUE_ENCODING,
  };
}

/**
 * Hash PII string fields on a flat evaluation context so they match hashed
 * rule values on the wire.
 *
 * @param context Flat context map (after prepare / flatten)
 * @param options PII options from the rules store
 * @returns New context object with PII strings hashed (or the input if no-op)
 */
export function applyPiiHashToFlatContext(
  context: Record<string, unknown>,
  options: PiiWireOptions | null | undefined,
): Record<string, unknown> {
  if (
    !options ||
    !options.piiSalt ||
    !options.piiAttributes.length ||
    options.piiValueEncoding !== PII_VALUE_ENCODING
  ) {
    return context;
  }

  let changed = false;
  const out: Record<string, unknown> = { ...context };

  for (const [key, value] of Object.entries(context)) {
    if (!isPiiAttribute(key, options.piiAttributes)) continue;
    if (typeof value === 'string') {
      if (HASH_HEX_PATTERN.test(value)) continue;
      out[key] = hashPiiValue(value, options.piiSalt);
      changed = true;
      continue;
    }
    if (Array.isArray(value)) {
      let arrayChanged = false;
      const next = value.map((entry) => {
        if (typeof entry !== 'string') return entry;
        if (HASH_HEX_PATTERN.test(entry)) return entry;
        arrayChanged = true;
        return hashPiiValue(entry, options.piiSalt);
      });
      if (arrayChanged) {
        out[key] = next;
        changed = true;
      }
    }
  }

  return changed ? out : context;
}

// rolloutUtils.ts
import type { VariantRollout } from './types';
import crypto from 'crypto';

export function hashToPercentage(value: string): number {
  const hash = crypto.createHash('sha256').update(value).digest('hex');
  const intValue = parseInt(hash.slice(0, 8), 16);
  return (intValue % 10000) / 100;
}

export function pickVariant(
  value: string,
  rollout: VariantRollout
): string | number | boolean | null {
  const percent = hashToPercentage(value);
  let cumulative = 0;

  for (const v of rollout.variants) {
    cumulative += v.weight;
    if (percent < cumulative) return v.value;
  }

  return null;
}

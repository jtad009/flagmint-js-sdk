// rolloutUtils.ts
import type { VariantOption } from './types';
import crypto from 'crypto';

export function hashToPercentage(value: string): number {
  const hash = crypto.createHash('sha256').update(value).digest('hex');
  const intValue = parseInt(hash.slice(0, 8), 16);
  return (intValue % 10000) / 100;
}

export function pickVariant(
  value: string,
  variants: VariantOption[]
): string | number | boolean | null {
  if (!variants || variants.length === 0) return null;
  
  const percent = hashToPercentage(value);
  let cumulative = 0;
  let totalWeight = 0;
  
  // Calculate total weight
  for (const v of variants) {
    totalWeight += v.weight;
  }
  
  // If weights don't sum to 100, normalize them
  const normalizedPercent = totalWeight > 0 ? (percent * totalWeight) / 100 : percent;
  
  for (const v of variants) {
    cumulative += v.weight;
    if (normalizedPercent < cumulative) return v.value;
  }
  
  // Fallback: return last variant (handles rounding errors)
  return variants[variants.length - 1].value;
}

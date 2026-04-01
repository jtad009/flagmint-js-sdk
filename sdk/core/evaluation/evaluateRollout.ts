import type { Rollout, EvaluationContext } from '@/core/evaluation/types';
import { hashToPercentage, pickVariant } from '@/core/evaluation/rolloutUtils';

export function evaluateRollout<T>(
  rollout: Rollout,
  context: EvaluationContext
): T | null {
  // Extract identifier from nested context structure
  const contextAny = context as any;
  const identifier = 
    contextAny.user?.key ||           // Standard nested structure
    contextAny.organization?.key ||   // Organization key
    contextAny.user_id ||              // Legacy flat structure
    contextAny.id ||                   // Legacy flat structure
    contextAny.user?.email ||          // User email as fallback
    contextAny.email;                  // Legacy flat email

  if (!rollout || typeof rollout !== 'object' || !identifier) return null;

  // Type guard: ensure we have a valid strategy
  if (!('strategy' in rollout)) return null;

  switch (rollout.strategy) {
    case 'percentage': {
      if (!('percentage' in rollout) || !('salt' in rollout)) return null;
      const { percentage, salt } = rollout;
      
      // Validate percentage range
      if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
        return null;
      }
      
      const userPercent = hashToPercentage(`${identifier}.${salt}`);
      // Return true for included users, null for excluded users
      return userPercent < percentage ? true as T : null;
    }

    case 'variant': {
      if (!('variants' in rollout) || !('salt' in rollout)) return null;
      const { salt, variants } = rollout;
      
      // Validate variants array
      if (!Array.isArray(variants) || variants.length === 0) {
        return null;
      }
      
      const selected = pickVariant(`${identifier}.${salt}`, variants);
      return selected as T;
    }

    default:
      return null;
  }
}

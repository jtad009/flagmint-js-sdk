import type { Rollout, EvaluationContext } from '@/core/evaluation/types';
import { hashToPercentage, pickVariant } from '@/core/evaluation/rolloutUtils';

export function evaluateRollout<T>(
  rollout: Rollout,
  context: EvaluationContext
): T | null {
  const identifier = context.user_id || context.id || context.email;

  if (!rollout || typeof rollout !== 'object' || !identifier) return null;

  switch (rollout.strategy) {
    case 'percentage': {
        if (!('percentage' in rollout) || !('salt' in rollout)) return null;
      const { percentage, salt } = rollout;
      const userPercent = hashToPercentage(`${identifier}.${salt}`);
      return userPercent < percentage ? true as T : null;
    }

    case 'variant': {
      if (!('variants' in rollout)) return null;
      const { salt, variants } = rollout;
      const selected = pickVariant(`${identifier}.${salt}`, variants);
      return selected as T;
    }

    default:
      return null;
  }
}

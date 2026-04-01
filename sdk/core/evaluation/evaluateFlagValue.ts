import { FlagValue, EvaluationContext, Segment } from '@/core/evaluation/types';
import { isInSegment, evaluateRule } from '@/core/evaluation/isInSegment';
import { evaluateRollout } from '@/core/evaluation/evaluateRollout';

export function evaluateFlagValue<T>(
  flag: FlagValue<T> & { segmentsById?: Record<string, Segment> },
  context: EvaluationContext
): T | null {
  const rules = flag.targeting_rules || [];

  const matchesAll = rules.every(rule => {
    if (rule.type === 'segment') {
      const segment = flag.segmentsById?.[rule.segment_id];
      return segment ? isInSegment(segment, context) : false;
    } else {
      return evaluateRule(rule, context);
    }
  });
if (!matchesAll) return null;

  // Handle rollouts
  if (flag.rollout) {
    if (flag.rollout.strategy === 'percentage') {
      // For percentage rollouts: check inclusion, return flag.value if included
      const isIncluded = evaluateRollout<boolean>(flag.rollout, context);
      return isIncluded ? (flag.value ?? null) : null;
    } else {
      // For variant rollouts: return the variant value directly
      const rolloutResult = evaluateRollout<T>(flag.rollout, context);
      return rolloutResult ?? flag.value ?? null;
    }
  }

  return flag.value ?? null;
}

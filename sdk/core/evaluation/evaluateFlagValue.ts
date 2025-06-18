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
 const rolloutResult = flag.rollout
    ? evaluateRollout<T>(flag.rollout, context)
    : null;

  return rolloutResult ?? flag.value ?? null;
}

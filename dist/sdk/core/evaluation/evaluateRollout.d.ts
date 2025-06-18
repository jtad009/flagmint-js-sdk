import type { Rollout, EvaluationContext } from '../../core/evaluation/types';
export declare function evaluateRollout<T>(rollout: Rollout, context: EvaluationContext): T | null;

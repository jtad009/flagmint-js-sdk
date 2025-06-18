import { FlagValue, EvaluationContext, Segment } from '../../core/evaluation/types';
export declare function evaluateFlagValue<T>(flag: FlagValue<T> & {
    segmentsById?: Record<string, Segment>;
}, context: EvaluationContext): T | null;

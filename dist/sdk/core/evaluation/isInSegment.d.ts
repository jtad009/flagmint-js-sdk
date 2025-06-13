import { Segment, EvaluationContext, TargetingRule } from './types';
export declare function evaluateRule(rule: TargetingRule, context: EvaluationContext): boolean;
export declare function isInSegment(segment: Segment, context: EvaluationContext): boolean;

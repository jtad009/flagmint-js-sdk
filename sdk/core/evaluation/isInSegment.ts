import { Segment, EvaluationContext, TargetingRule } from './types';

export function evaluateRule(rule: TargetingRule, context: EvaluationContext): boolean {
    if( rule.type !== 'rule') return false;
  const value = rule.attribute.split('.').reduce((obj: any, key) => obj?.[key], context);

  switch (rule.operator) {
    case 'eq': return value === rule.value;
    case 'neq': return value !== rule.value;
    case 'in': return Array.isArray(rule.value) && rule.value.includes(value);
    case 'nin': return Array.isArray(rule.value) && !rule.value.includes(value);
    case 'gt': return typeof value === 'number' && typeof rule.value === 'number' && value > rule.value;
    case 'lt': return typeof value === 'number' && typeof rule.value === 'number' && value < rule.value;
    case 'exists': return value !== undefined && value !== null;
    case 'not_exists': return value === undefined || value === null;
    default: return false;
  }
}



export function isInSegment(segment: Segment, context: EvaluationContext): boolean {
    return segment.rules.every(rule => evaluateRule(rule, context));
}

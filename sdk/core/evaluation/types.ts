export type Operator =
  | 'eq'
  | 'neq'
  | 'in'
  | 'nin'
  | 'gt'
  | 'lt'
  | 'exists'
  | 'not_exists';

// Targeting Rules
export interface Rule {
  type: 'rule';
  attribute: string;
  operator: Operator;
  value: string | string[];
}

export interface SegmentReference {
  type: 'segment';
  segment_id: string;
}

export type TargetingRule = Rule | SegmentReference;

// Rollouts
export interface PercentageRollout {
  strategy: 'percentage';
  percentage: number; // 0–100
  salt: string;
}

export interface VariantOption {
  value: string | number | boolean;
  weight: number;
}

export interface VariantRollout {
  strategy: 'variant';
  salt: string;
  variants: VariantOption[];
}

// Empty fallback
export type EmptyRollout = Record<string, any>; // fallback, could be {}

export type Rollout = PercentageRollout | VariantRollout | EmptyRollout;

// FlagValue
export interface FlagValue<T = unknown> {
  key?: string;
  value: T;
  type: 'boolean' | 'string' | 'number' | 'object';
  targeting_rules?: TargetingRule[];
  rollout?: Rollout;
}

export type EvaluationContext = Record<string, unknown>;

export interface Segment {
  id: string;
  name: string;
  description?: string;
  rules: TargetingRule[];
}
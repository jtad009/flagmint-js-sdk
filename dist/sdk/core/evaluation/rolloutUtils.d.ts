import type { VariantRollout } from './types';
export declare function hashToPercentage(value: string): number;
export declare function pickVariant(value: string, rollout: VariantRollout): string | number | boolean | null;

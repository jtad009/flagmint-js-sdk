// src/index.ts
import { Buffer } from 'buffer';
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}
// Core client
export { FlagClient } from './sdk/core/client';
export type { FlagClientOptions } from './sdk/core/client';

// // Cache adapter types (sync + async)
export type { CacheAdapter, FeatureFlags } from './sdk/core/helpers/types';
export type { ApplicationEvent, ApplicationEventKind } from './sdk/core/helpers/applicationEvents';
export * as syncCache from './sdk/core/helpers/cacheHelper';           // sync: loadCachedFlags, saveCachedFlags, etc.
export * as asyncCache from './sdk/core/helpers/cacheHelper.async';     // async: loadCachedFlags, saveCachedFlags, etc.


// // Transports
export type { Transport } from './sdk/core/transports/Transport';
export { LongPollingTransport } from './sdk/core/transports/LongPollingTransport';
export { SseTransport }   from './sdk/core/transports/SSETransport';

// // Evaluation
export type { FlagValue, EvaluationContext, Segment, Rollout, VariantRollout, VariantOption } from './sdk/core/evaluation/types';
export { evaluateFlagValue } from './sdk/core/evaluation/evaluateFlagValue';
export { evaluateRollout }    from './sdk/core/evaluation/evaluateRollout';
export { isInSegment }        from './sdk/core/evaluation/isInSegment';
export * from './sdk/core/evaluation/rolloutUtils';

// Config sync (local evaluation)
export {
  RulesStore,
  createEmptyRulesState,
  reduceRules,
  performAslHandshake,
  generateAslClientKeyPair,
  deriveAslMacKey,
  signConfigPayload,
  verifyConfigPayloadSignature,
  canonicalizeForSigning,
  isConfigPayloadExpired,
  evaluateSdkFlag,
  evaluateAllSdkFlags,
  coerceType,
  evaluateRule,
  evaluateFlagWithTargetingRules,
  applyRolloutStrategy,
  computeCurrentPercentage,
  defaultHash,
  flattenEvaluationContext,
  stringHash,
  hashPercent,
} from './sdk/core/config-sync';
export type {
  SdkFlagConfig,
  SdkSegment,
  RulesState,
  RulesCacheSnapshot,
  ConfigSyncPayload,
  LeasePayload,
  FullConfigPayload,
  DeltaConfigPayload,
  DeltasCatchUpPayload,
  ApplyResult,
  AslHandshakeSuccess,
} from './sdk/core/config-sync';

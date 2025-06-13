// src/index.ts

// Core client
export { FlagClient } from './sdk/core/client';
export type { FlagClientOptions } from './sdk/core/client';

// // Cache adapter types (sync + async)
export type { CacheAdapter, FeatureFlags } from './sdk/core/helpers/types';
export * as syncCache from './sdk/core/helpers/cacheHelper';           // sync: loadCachedFlags, saveCachedFlags, etc.
export * as asyncCache from './sdk/core/helpers/cacheHelper.async';     // async: loadCachedFlags, saveCachedFlags, etc.

// // Transports
export type { Transport } from './sdk/core/transports/Transport';
export { LongPollingTransport } from './sdk/core/transports/LongPollingTransport';
export { WebSocketTransport }   from './sdk/core/transports/WebsocketTransport';

// // Evaluation
export type { FlagValue, EvaluationContext, Segment, Rollout, VariantRollout } from './sdk/core/evaluation/types';
export { evaluateFlagValue } from './sdk/core/evaluation/evaluateFlagValue';
export { evaluateRollout }    from './sdk/core/evaluation/evaluateRollout';
export * from './sdk/core/evaluation/rolloutUtils';

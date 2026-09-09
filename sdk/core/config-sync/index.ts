export {
  ASL_CLIENT_PUBLIC_KEY_HEX_LENGTH,
  ASL_HKDF_INFO,
  ASL_KEY_AGREEMENT,
  deriveAslMacKey,
  generateAslClientKeyPair,
  parsePeerPublicKeyHex,
  wipeKeyMaterial,
} from './aslEcdh';
export type { AslClientKeyPair, AslDerivedMac } from './aslEcdh';

export {
  canonicalizeForSigning,
  isConfigPayloadExpired,
  signConfigPayload,
  verifyConfigPayloadSignature,
} from './signPayload';

export {
  RulesStore,
  createEmptyRulesState,
  reduceRules,
} from './rulesStore';
export type { ApplyResult, RulesState } from './rulesStore';

export type {
  ConfigSyncPayload,
  DeltaConfigPayload,
  DeltasCatchUpPayload,
  FullConfigPayload,
  LeasePayload,
  RulesCacheSnapshot,
  SdkFlagConfig,
  SdkSegment,
  SignableConfigBody,
} from './types';

export { performAslHandshake } from './handshake';
export type { AslHandshakeSuccess } from './handshake';
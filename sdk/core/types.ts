import type { Transport } from "@/core/transports/Transport";
import type { FlagValue } from "@/core/evaluation/types";

type TransportMode = 'auto' | 'websocket' | 'long-polling';

export interface FlagClientOptions<C extends Record<string, any> = Record<string, any>> {
  apiKey: string;
  context?: C;
  autoRefresh?: boolean;
  refreshIntervalMs?: number;
  enableOfflineCache?: boolean;
  persistContext?: boolean;
  cacheTTL?: number; // ms, optional. Default: 24h
  transport?: Transport<C, any>;
  transportMode?: TransportMode;
  onError?: (error: Error) => void;
  previewMode?: boolean;
  rawFlags?: Record<string, FlagValue>;
  deferInitialization?: boolean; // If true, initialization is deferred until the user calls the init function
}
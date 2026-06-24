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
// we want when a user calls updateContext, they might want to persist the new update in a sub-context, used just for that component and deleted after a certain time. so we would want to have an option to pass a sub-context that will be merged with the main context and then removed after a certain time. This is useful for example when a user wants to test a new feature in a specific component without affecting the rest of the application. The sub-context would be used just for that component and then removed after a certain time.
export interface UpdateContextOptionsProps {
  key: string | null; // the key of the sub-context, used to identify it
  subFlagTTL?: number; // ms, optional. Default: 5min
}

// logger.ts - Environment-aware logging utility

type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';
type Environment = 'production' | 'staging' | 'sandbox' | 'acceptance' | 'local' | 'testing' | 'development' | string;

// Messages that are always allowed, even in production
const PRODUCTION_ALLOWED_MESSAGES = [
  'Connected',
  'Disconnected',
  'Connection closed',
  'connected',
  'disconnected',
  'Flagmint SDK is connected',
  'Flagmint SDK is disconnected',
];

/**
 * Get the current environment from NODE_ENV or NEXT_PUBLIC_NODE_ENV
 */
function getEnvironment(): Environment {
  if (typeof process !== 'undefined') {
    return (process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || 'development').toLowerCase();
  }
  return 'development';
}

/**
 * Check if logging is allowed based on environment and message
 */
function shouldLog(message: string, level: LogLevel, canDebug: boolean): boolean {
  const env = getEnvironment();

  // Allow all logging in non-production environments
  const allowedEnvs = ['staging', 'sandbox', 'acceptance', 'local', 'testing', 'development'];
  if (allowedEnvs.includes(env) && canDebug) {
    return true;
  }

  // In production, only allow specific connection messages
  if (env === 'production') {
    // Always allow connection-related messages
    const isConnectionMessage = PRODUCTION_ALLOWED_MESSAGES.some(allowed => 
      message.toLowerCase().includes(allowed.toLowerCase())
    );
    return isConnectionMessage;
  }

  // Default: allow logging
  return canDebug ?  true : false;
}

/**
 * Environment-aware logger that respects production restrictions
 */
export const logger = {
  canDebugLog : false,
  setup: (options: { debugLog?: boolean }) => {
    if (options.debugLog) {
      logger.canDebugLog = options.debugLog
    } else {
      logger.canDebugLog = false;
    }
  },
  log: (message: string, ...args: any[]) => {
    if (shouldLog(message, 'log', logger.canDebugLog)) {
      console.log(message, ...args);
    }
  },

  error: (message: string, ...args: any[]) => {
    if (shouldLog(message, 'error', logger.canDebugLog)) {
      console.error(message, ...args);
    }
  },

  warn: (message: string, ...args: any[]) => {
    if (shouldLog(message, 'warn', logger.canDebugLog)) {
      console.warn(message, ...args);
    }
  },

  info: (message: string, ...args: any[]) => {
    if (shouldLog(message, 'info', logger.canDebugLog)) {
      console.info(message, ...args);
    }
  },

  debug: (message: string, ...args: any[]) => {
    if (shouldLog(message, 'debug', logger.canDebugLog)) {
      console.debug(message, ...args);
    }
  },
};

export default logger;

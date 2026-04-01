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
function shouldLog(message: string, level: LogLevel): boolean {
  const env = getEnvironment();

  // Allow all logging in non-production environments
  const allowedEnvs = ['staging', 'sandbox', 'acceptance', 'local', 'testing', 'development'];
  if (allowedEnvs.includes(env)) {
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
  return true;
}

/**
 * Environment-aware logger that respects production restrictions
 */
export const logger = {
  log: (message: string, ...args: any[]) => {
    if (shouldLog(message, 'log')) {
      console.log(message, ...args);
    }
  },

  error: (message: string, ...args: any[]) => {
    if (shouldLog(message, 'error')) {
      console.error(message, ...args);
    }
  },

  warn: (message: string, ...args: any[]) => {
    if (shouldLog(message, 'warn')) {
      console.warn(message, ...args);
    }
  },

  info: (message: string, ...args: any[]) => {
    if (shouldLog(message, 'info')) {
      console.info(message, ...args);
    }
  },

  debug: (message: string, ...args: any[]) => {
    if (shouldLog(message, 'debug')) {
      console.debug(message, ...args);
    }
  },
};

export default logger;

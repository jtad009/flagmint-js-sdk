# Environment-Aware Logger

## Overview

The logger utility provides environment-aware logging that automatically restricts log output in production environments while allowing full logging in development, staging, sandbox, acceptance, local, and testing environments.

## Usage

Import and use the logger instead of `console` methods:

```typescript
import { logger } from '@/core/helpers/logger';

// Instead of console.log()
logger.log('[MyComponent] Initialization started');

// Instead of console.error()
logger.error('[MyComponent] Error occurred:', error);

// Instead of console.warn()
logger.warn('[MyComponent] Warning message');
```

## Logging Behavior by Environment

### Development Environments
**Environments:** `development`, `staging`, `sandbox`, `acceptance`, `local`, `testing`

✅ **All logging is allowed** - Full visibility for debugging

### Production Environment
**Environment:** `production`

⛔ **Most logging is blocked** - Only connection-related messages are shown:
- `Connected`
- `Disconnected`
- `Connection closed`
- `Flagmint SDK is connected`
- `Flagmint SDK is disconnected`

All other log messages are suppressed to reduce noise and improve performance.

## Examples

### Example 1: Connection Message (Always Logged)
```typescript
logger.log('[WebSocketTransport] Connected');
// ✅ Logged in ALL environments (including production)
```

### Example 2: Debug Message (Blocked in Production)
```typescript
logger.log('[FlagClient] Fetching flags with context:', context);
// ✅ Logged in development, staging, etc.
// ⛔ Blocked in production
```

### Example 3: Error Message (Blocked in Production)
```typescript
logger.error('[FlagClient] Failed to fetch flags:', error);
// ✅ Logged in development, staging, etc.
// ⛔ Blocked in production (unless it contains connection keywords)
```

## Environment Detection

The logger automatically detects the environment from:
1. `process.env.NEXT_PUBLIC_NODE_ENV` (Next.js apps)
2. `process.env.NODE_ENV` (Node.js apps)
3. Defaults to `development` if neither is set

## Implementation Details

All `console.log()`, `console.error()`, `console.warn()`, `console.info()`, and `console.debug()` calls throughout the SDK have been replaced with the corresponding `logger` methods to ensure consistent behavior.

## Configuration

To modify which messages are allowed in production, update the `PRODUCTION_ALLOWED_MESSAGES` array in [logger.ts](./logger.ts):

```typescript
const PRODUCTION_ALLOWED_MESSAGES = [
  'Connected',
  'Disconnected',
  // Add more keywords here
];
```

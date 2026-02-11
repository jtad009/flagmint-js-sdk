# Flagmint JavaScript SDK

**Version: 1.2.5**

This SDK provides a framework-agnostic client for evaluating feature flags, with pluggable caching (sync or async) and transport strategies (WebSocket or long-polling). It's designed for both browser and server-side Node.js environments.

## ✨ Key Features

- 🎯 **Framework-Agnostic**: Works with React, Vue, vanilla JS, Node.js, and more
- 🔄 **Flexible Transport**: WebSocket for real-time updates or long-polling fallback
- 💾 **Pluggable Caching**: Use built-in sync cache, async cache (Redis/filesystem), or custom implementations
- 🚀 **Server & Browser Support**: Compatible with browser environments, Node.js, React Native
- 🔒 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- ⚡ **Zero-Config Defaults**: Works out of the box with sensible defaults

## 📦 Installation

```bash
npm install flagmint-sdk
# or
yarn add flagmint-sdk
```

## � Quick Start

```ts
import { FlagClient } from 'flagmint-sdk';

// Create a client instance
const client = new FlagClient({
  apiKey: 'ff_your_api_key_here',
  context: { 
    user_id: 'user123', 
    country: 'US',
    isPremium: true
  }
});

// Wait for initial connection
await client.ready();

// Get flag values
const showBanner = client.getFlag('show_banner', false);
const featureVersion = client.getFlag('feature_version', 'v1');

// Update context and re-evaluate
client.updateContext({ user_id: 'user456' });
```

## �🛠️ FlagClientOptions

| Option                | Type                                      | Default            | Description                                                           |
| --------------------- | ----------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| `apiKey`              | `string`                                  | **Required**       | Your environment API key.                                             |
| `context`             | `Record<string, any>`                     | `{}`               | Initial evaluation context (e.g. user attributes).                    |
| `enableOfflineCache`  | `boolean`                                 | `false`             | Enable caching of flags locally.                                      |
| `persistContext`      | `boolean`                                 | `false`            | Persist evaluation context across sessions.                           |                                        |
| `cacheAdapter`        | `CacheAdapter<C>`                         | Sync `cacheHelper` | Custom cache implementation (see examples).                           |
| `transportMode`       | `'auto' \| 'websocket' \| 'long-polling'` | `'auto'`           | How to fetch flags: prefer WebSocket, or use long-polling transport.  |
| `onError`             | `(error: Error) => void`                  | —                  | Callback for transport or initialization errors.                      |
| `previewMode`         | `boolean`                                 | `false`            | Evaluate using `rawFlags` only, bypassing remote fetch.               |
| `rawFlags`            | `Record<string, FlagValue>`               | —                  | Local-only flag definitions used when `previewMode: true`.            |
| `deferInitialization` | `boolean`                                 | `false`            | If `true`, client initialization is deferred until you call `init()`. |

## 🔧 Cache Adapters

### Sync (Browser / In-Memory)

By default, the SDK uses a **sync** `localStorage`-based helper in browsers or a `Map` in Node.js:

```ts
import { FlagClient } from 'flagmint-sdk';
// No setup needed for browser; for Node you can override:
import { setCacheStorage } from 'flagmint-sdk/core/cacheHelper';
setCacheStorage({
  getItem:   key => myMap.get(key) ?? null,
  setItem:   (key, val) => myMap.set(key, val),
});
```

### Async (Redis / File System)

Use the **async** helper for server-side or React Native:

```ts
import { FlagClient } from 'flagmint-sdk';
import * as asyncCache from 'flagmint-sdk/core/cacheHelper.async';

const client = new FlagClient({
  apiKey: '...',
  cacheAdapter: {
    loadFlags:   asyncCache.loadCachedFlags,
    saveFlags:   asyncCache.saveCachedFlags,
    loadContext: asyncCache.loadCachedContext,
    saveContext: asyncCache.saveCachedContext
  }
});
```

## 🌐 Transport Modes

* **`'websocket'`**: Persistent WebSocket connection for live updates.
* **`'long-polling'`**: HTTP requests held open by server until flags change.
* **`'auto'`** (default): Try WebSocket, fallback to long-polling.

```ts
const client = new FlagClient({
  apiKey: '...',
  transportMode: 'long-polling'
});
```

### Transport Performance

| Mode | Latency | Bandwidth | Best For |
|------|---------|-----------|----------|
| WebSocket | Lowest (real-time) | Efficient | Real-time dashboards, live updates |
| Long-Polling | Medium | Higher | Simpler setup, less overhead on server |
| Auto | Lowest to Medium | Varies | Most applications (recommended) |

## ⚙️ Evaluation Helpers

The SDK includes utilities to evaluate flag targeting rules and rollouts:

### `evaluateFlagValue(flag, context)`

```ts
import { evaluateFlagValue } from 'flagmint-sdk/core/evaluation';

const result = evaluateFlagValue(flagValue, userContext);
```

* Applies targeting rules (`segment` or attribute rules).
* If matched, applies rollout (percentage or variant).
* Returns flag’s value or `null` if not enabled.

### `evaluateRollout(rollout, context)`

```ts
import { evaluateRollout } from 'flagmint-sdk/core/evaluation';

const rolloutValue = evaluateRollout(rolloutConfig, userContext);
```

* Supports **percentage** rollouts using consistent hashing.
* Supports **variant** distributions (A/B tests).

### `rolloutUtils`

* `hashToPercentage(value: string): number`
* `pickVariant(value: string, variants: VariantRollout): T | null`

These helpers underpin reliable, deterministic assignment of users to flag variants.

### `isInSegment(context, segment)`

```ts
import { isInSegment } from 'flagmint-sdk/core/evaluation';

const inBetaSegment = isInSegment(userContext, betaSegment);
```

Evaluates whether a user context matches a segment's criteria.

## 📖 Framework Integration Examples

### React

```tsx
import { useEffect, useState } from 'react';
import { FlagClient } from 'flagmint-sdk';

const client = new FlagClient({
  apiKey: 'ff_...',
  context: { userId: 'user123' }
});

export function App() {
  const [flags, setFlags] = useState({});

  useEffect(() => {
    client.ready().then(() => {
      setFlags({
        showBeta: client.getFlag('show_beta', false),
        theme: client.getFlag('theme', 'light')
      });
    });
  }, []);

  return (
    <div className={`theme-${flags.theme}`}>
      {flags.showBeta && <BetaFeature />}
    </div>
  );
}
```

### Node.js / Express

```ts
import { FlagClient } from 'flagmint-sdk';
import * as asyncCache from 'flagmint-sdk/core/cacheHelper.async';

const client = new FlagClient({
  apiKey: 'ff_...',
  cacheAdapter: {
    loadFlags: asyncCache.loadCachedFlags,
    saveFlags: asyncCache.saveCachedFlags,
    loadContext: asyncCache.loadCachedContext,
    saveContext: asyncCache.saveCachedContext
  }
});

app.get('/api/feature', async (req, res) => {
  const userContext = { userId: req.user.id, plan: req.user.plan };
  const isEnabled = client.getFlag('new_api', false, userContext);
  
  res.json({ enabled: isEnabled });
});
```

## 🔄 Context Management

### Updating Context

```ts
// Initial context
const client = new FlagClient({
  apiKey: '...',
  context: { user_id: 'user123' }
});

// Update context later
client.updateContext({ 
  user_id: 'user123',
  plan: 'premium',
  country: 'CA'
});
```

### Persisting Context

```ts
const client = new FlagClient({
  apiKey: '...',
  persistContext: true, // Saves to localStorage/AsyncStorage
  context: { user_id: 'user123' }
});
```

## 🔌 Deferred Initialization

For scenarios where you need to set up the client before context is available:

```ts
const client = new FlagClient({
  apiKey: '...',
  deferInitialization: true
});

// Later, when context is ready:
client.updateContext({ user_id: 'user123' });
await client.init();
```

## 🌍 Advanced Usage

### Error Handling

```ts
const client = new FlagClient({
  apiKey: '...',
  onError: (error) => {
    console.error('Flag client error:', error);
    // Report to monitoring service
    sentry.captureException(error);
  }
});
```

### Preview Mode

For testing or preview environments where you want to bypass remote flag fetching:

```ts
const client = new FlagClient({
  apiKey: '...',
  previewMode: true,
  rawFlags: {
    new_checkout: true,
    discount_percent: 20,
    ui_variant: 'experimental'
  }
});

// All getFlag calls will use rawFlags
const checkout = client.getFlag('new_checkout', false); // true
```

### Custom Cache Implementations

```ts
import { FlagClient } from 'flagmint-sdk';
import redis from 'redis';

const redisClient = redis.createClient();

const client = new FlagClient({
  apiKey: '...',
  cacheAdapter: {
    loadFlags: async (apiKey) => {
      const cached = await redisClient.get(`flags:${apiKey}`);
      return cached ? JSON.parse(cached) : null;
    },
    saveFlags: async (apiKey, flags) => {
      await redisClient.setex(
        `flags:${apiKey}`, 
        600, // 10 min TTL
        JSON.stringify(flags)
      );
    },
    loadContext: async (apiKey) => {
      const cached = await redisClient.get(`context:${apiKey}`);
      return cached ? JSON.parse(cached) : null;
    },
    saveContext: async (apiKey, context) => {
      await redisClient.setex(
        `context:${apiKey}`, 
        3600, // 1 hour TTL
        JSON.stringify(context)
      );
    }
  }
});
```

## 📋 API Reference

### `FlagClient`

**Methods:**
- `ready(): Promise<void>` - Wait for initial connection
- `getFlag<T>(key: string, defaultValue: T, context?: Record<string, any>): T` - Get flag value
- `updateContext(context: Record<string, any>): void` - Update evaluation context
- `init(): Promise<void>` - Initialize client (if deferred)
- `disconnect(): void` - Close transport connection

**Events:**
- `flagsUpdated` - Fired when flags change
- `contextUpdated` - Fired when context changes
- `connected` - Fired when transport connects
- `disconnected` - Fired when transport disconnects

### Cache Adapter Interface

```ts
interface CacheAdapter {
  loadFlags(apiKey: string): Promise<Record<string, any>> | Record<string, any>;
  saveFlags(apiKey: string, flags: Record<string, any>): Promise<void> | void;
  loadContext(apiKey: string): Promise<Record<string, any> | null> | Record<string, any> | null;
  saveContext(apiKey: string, context: Record<string, any>): Promise<void> | void;
}
```

## 🛠️ Development & Contributing

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Project Structure

```
sdk/
├── core/
│   ├── client.ts           # Main FlagClient
│   ├── types.ts            # Type definitions
│   ├── evaluation/         # Flag evaluation logic
│   ├── helpers/            # Cache helpers (sync & async)
│   └── transports/         # Transport implementations
```

## 🐛 Troubleshooting

### Client not connecting

- Verify your API key is correct
- Check network connectivity
- Review browser console for errors
- Ensure CORS is properly configured if using from browser

### Flags not updating

- Confirm `enableOfflineCache: false` or cache is working correctly
- Check transport mode (WebSocket vs long-polling)
- Verify context is properly set with `updateContext()`

### Performance issues

- Consider using long-polling instead of WebSocket for high-traffic scenarios
- Implement proper cache TTLs
- Monitor transport connection status

## 📞 Support & Resources

- **Documentation**: See [Flagmint Docs](https://docs.flagmint.io)
- **Issues**: Report on [GitHub](https://github.com/flagmint/js-sdk/issues)
- **Email**: support@flagmint.io

## 🚀 Changelog

### v1.2.5
- Enhanced async cache helper for better server-side support
- Improved WebSocket connection stability
- Better error reporting and handling
- Added support for context persistence
- Performance optimizations for large flag sets

## 📖 References

* Core client: [sdk/core/client.ts](sdk/core/client.ts)
* Type definitions: [sdk/core/types.ts](sdk/core/types.ts)
* Cache helpers: [sdk/core/helpers/cacheHelper.ts](sdk/core/helpers/cacheHelper.ts), [cacheHelper.async.ts](sdk/core/helpers/cacheHelper.async.ts)
* Transports: [WebsocketTransport](sdk/core/transports/WebsocketTransport.ts), [LongPollingTransport](sdk/core/transports/LongPollingTransport.ts)
* Evaluation: [evaluateFlagValue](sdk/core/evaluation/evaluateFlagValue.ts), [evaluateRollout](sdk/core/evaluation/evaluateRollout.ts), [rolloutUtils](sdk/core/evaluation/rolloutUtils.ts)

---

**License**: MIT © Flagmint Team

**Maintained with ❤️ by the Flagmint Team**

# Flagmint JavaScript SDK

**Version: 1.2.21**

This SDK provides a javascript framework-agnostic client for evaluating feature flags, with pluggable caching (sync or async) and transport strategies (WebSocket or long-polling). It's designed for both browser and server-side Node.js environments.

## ✨ Key Features

- 🎯 **Framework-Agnostic**: Works with React, Vue, vanilla JS, Node.js, and more
- 🔄 **Flexible Transport**: WebSocket for real-time updates or long-polling fallback
- 💾 **Pluggable Caching**: Use built-in sync cache, async cache (Redis/filesystem), or custom implementations
- 🚀 **Server & Browser Support**: Compatible with browser environments, Node.js, React Native
- 🔒 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- ⚡ **Zero-Config Defaults**: Works out of the box with sensible defaults

## 📦 Installation

```bash
npm install flagmint-js-sdk
# or
yarn add flagmint-js-sdk
```

## Quick Start

```ts
import { FlagClient } from 'flagmint-js-sdk';

// Create a client instance
const client = new FlagClient({
  apiKey: 'ff_your_api_key_here',
  context: {
    kind: "multi | user | organisation",
    user: { kind: "user", key: '', email: '' },
    organization: { kind: "organization", key: '', plan: '' }
  }
});

// Wait for initial connection and flag synchronization
await client.ready();

// Get flag values
const showBanner = client.getFlag('show_banner', false);
const featureVersion = client.getFlag('feature_version', 'v1');

// Update context and re-evaluate
await client.updateContext({
  kind: "user",
  user: { kind: "user", key: 'user456', email: 'user456@example.com' }
});
```

## FlagClientOptions

| Option                | Type                                      | Default            | Description                                                           |
| --------------------- | ----------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| `apiKey`              | `string`                                  | **Required**       | Your environment API key.                                             |
| `context`             | `Record<string, any>`                     | `{}`               | Initial evaluation context (e.g. user attributes).                    |
| `enableOfflineCache`  | `boolean`                                 | `true`              | Enable caching of flags locally.                                      |
| `persistContext`      | `boolean`                                 | `false`            | Persist evaluation context across sessions.                           |                                        |
| `cacheAdapter`        | `CacheAdapter<C>`                         | Sync `cacheHelper` | Custom cache implementation (see examples).                           |
| `transportMode`       | `'auto' \| 'websocket' \| 'long-polling'` | `'auto'`           | How to fetch flags: prefer WebSocket, or use long-polling transport.  |
| `onError`             | `(error: Error) => void`                  | —                  | Callback for transport or initialization errors. Called when operating in degraded mode with cached flags. |
| `previewMode`         | `boolean`                                 | `false`            | Evaluate using `rawFlags` only, bypassing remote fetch.               |
| `rawFlags`            | `Record<string, FlagValue>`               | —                  | Local-only flag definitions used when `previewMode: true`.            |
| `deferInitialization` | `boolean`                                 | `false`            | If `true`, client initialization is deferred until you call `ready()`. |

## 🔧 Cache Adapters

### Sync (Browser / In-Memory)

By default, the SDK uses a **sync** `localStorage`-based helper in browsers or a `Map` in Node.js:

```ts
import { FlagClient, syncCache } from 'flagmint-js-sdk';
// No setup needed for browser; for Node you can override:
syncCache.setCacheStorage({
  getItem:   key => myMap.get(key) ?? null,
  setItem:   (key, val) => myMap.set(key, val),
});
```

### Async (Redis / File System)

Use the **async** helper for server-side or React Native:

```ts
import { FlagClient, asyncCache } from 'flagmint-js-sdk';

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
import { evaluateFlagValue } from 'flagmint-js-sdk';

const result = evaluateFlagValue(flagValue, userContext);
```

* Applies targeting rules (`segment` or attribute rules).
* If matched, applies rollout (percentage or variant).
* Returns flag’s value or `null` if not enabled.

### `evaluateRollout(rollout, context)`

```ts
import { evaluateRollout } from 'flagmint-js-sdk';

const rolloutValue = evaluateRollout(rolloutConfig, userContext);
```

* Supports **percentage** rollouts using consistent hashing.
* Supports **variant** distributions (A/B tests).

### `rolloutUtils`

* `hashToPercentage(value: string): number`
* `pickVariant(value: string, variants: VariantOption[]): string | number | boolean | null`

These helpers underpin reliable, deterministic assignment of users to flag variants.

### `isInSegment(segment, context)`

```ts
import { isInSegment } from 'flagmint-js-sdk';

const inBetaSegment = isInSegment(betaSegment, userContext);
```

Evaluates whether a user context matches a segment's criteria.

## 📖 Framework Integration Examples

### React

```tsx
import { useEffect, useState } from 'react';
import { FlagClient } from 'flagmint-js-sdk';

const client = new FlagClient({
  apiKey: 'ff_...',
  context: {
    kind: "multi | user | organisation",
    user: { kind: "user", key: '', email: '' },
    organization: { kind: "organization", key: '', plan: '' }
  }
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

    // Subscribe to flag updates
    const unsubscribe = client.subscribe((updatedFlags) => {
      setFlags({
        showBeta: client.getFlag('show_beta', false),
        theme: client.getFlag('theme', 'light')
      });
    });
    
    return () => unsubscribe();
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
import { FlagClient, asyncCache } from 'flagmint-js-sdk';

const client = new FlagClient({
  apiKey: 'ff_...',
  cacheAdapter: {
    loadFlags: asyncCache.loadCachedFlags,
    saveFlags: asyncCache.saveCachedFlags,
    loadContext: asyncCache.loadCachedContext,
    saveContext: asyncCache.saveCachedContext
  }
});

// Wait for initialization
await client.ready();

app.get('/api/feature', async (req, res) => {
  // Update context with proper structure
  await client.updateContext({ 
    kind: "multi",
    user: {
      kind: "user",
      key: req.user.id,
      email: req.user.email
    },
    organization: {
      kind: "organization",
      key: req.user.orgId,
      plan: req.user.plan
    }
  });
  
  const isEnabled = client.getFlag('new_api', false);
  
  res.json({ enabled: isEnabled });
});
```

## 🔄 Context Management

### Updating Context

```ts
// Initial context
const client = new FlagClient({
  apiKey: '...',
  context: {
    kind: "user",
    user: { kind: "user", key: 'user123' }
  }
});

// Update context later (e.g., after user upgrades)
await client.updateContext({ 
  kind: "multi",
  user: {
    kind: "user",
    key: 'user123',
    email: 'user@example.com'
  },
  organization: {
    kind: "organization",
    key: 'org456',
    plan: 'premium',
    country: 'CA'
  }
});
```

### Persisting Context

```ts
const client = new FlagClient({
  apiKey: '...',
  persistContext: true, // Saves to localStorage/AsyncStorage
  context: {
    kind: "user",
    user: { kind: "user", key: 'user123', email: 'user@example.com' }
  }
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
await client.updateContext({
  kind: "user",
  user: { kind: "user", key: 'user123', email: 'user@example.com' }
});
await client.ready(); // Initializes and connects
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

**Important: Offline Fallback & Cache Behavior**

The SDK gracefully handles connection failures using cached flags as a fallback:

**When the server is unreachable:**

| Scenario | `ready()` Promise | Behavior |
|----------|-------------------|----------|
| ✅ Cached flags available | Resolves | Operates in degraded mode with cached flags |
| ❌ No cached flags | Rejects | Initialization fails |
| ✅ Connected successfully | Resolves | Normal operation with live updates |

**Degraded Mode:** When `ready()` resolves but the connection failed, the `onError` callback is triggered to notify you:

```ts
const client = new FlagClient({
  apiKey: '...',
  enableOfflineCache: true,
  onError: (error) => {
    // Called when operating in degraded mode with cached flags
    console.warn('⚠️ Degraded mode - using cached flags:', error.message);
    // Optionally report to monitoring service
  }
});

try {
  await client.ready();
  // ✅ Resolves successfully even if server is down (when cached flags exist)
  console.log('Client ready');
  const feature = client.getFlag('my_feature', false); // Always works
} catch (error) {
  // ❌ Only throws if NO cached flags AND server is unreachable
  console.error('Completely offline:', error);
}
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
import { FlagClient } from 'flagmint-js-sdk';
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
- `ready(timeoutMs?: number): Promise<void>` - Wait for initial connection (default timeout: 3000ms)
- `getFlag<K>(key: K, fallback?: T): T` - Get flag value with optional fallback
- `getFlags(): FeatureFlags<T>` - Get all flags as an object
- `updateContext(context: Record<string, any>): Promise<void>` - Update evaluation context (async)
- `subscribe(callback: (flags) => void): () => void` - Subscribe to flag updates, returns unsubscribe function
- `destroy(): void` - Close transport connection and cleanup resources

### Subscribing to Flag Updates

Instead of event listeners, use the `subscribe()` method:

```ts
const unsubscribe = client.subscribe((flags) => {
  console.log('Flags updated:', flags);
  // Handle flag updates
});

// Later, to unsubscribe:
unsubscribe();
```

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

- Confirm `enableOfflineCache` setting matches your needs
- Check transport mode (WebSocket vs long-polling)
- Verify context is properly set with `await updateContext()`
- Use `subscribe()` to listen for flag changes instead of polling

### Cache behavior when server is down

**Important**: When `enableOfflineCache: true` (default):
- Cached flags are loaded even if the server is unreachable
- `ready()` will still throw an error on connection failure
- You can still access cached flags via `getFlag()` after catching the error
- Consider wrapping `ready()` in try/catch and continuing with cached data

See the "Error Handling with Cache" section above for examples.

### Performance issues

- Consider using long-polling instead of WebSocket for high-traffic scenarios
- Implement proper cache TTLs
- Monitor transport connection status

## 📞 Support & Resources

- **Documentation**: See [Flagmint Docs](https://docs.flagmint.io)
- **Issues**: Report on [GitHub](https://github.com/flagmint/js-sdk/issues)
- **Email**: support@flagmint.io

## 🚀 Releases & Changelog

See [GitHub Releases](https://github.com/flagmint/js-sdk/releases) for the complete version history, changelog, and upgrade guides.

## 📖 References

* Core client: [sdk/core/client.ts](sdk/core/client.ts)
* Type definitions: [sdk/core/types.ts](sdk/core/types.ts)
* Cache helpers: [sdk/core/helpers/cacheHelper.ts](sdk/core/helpers/cacheHelper.ts), [cacheHelper.async.ts](sdk/core/helpers/cacheHelper.async.ts)
* Transports: [WebsocketTransport](sdk/core/transports/WebsocketTransport.ts), [LongPollingTransport](sdk/core/transports/LongPollingTransport.ts)
* Evaluation: [evaluateFlagValue](sdk/core/evaluation/evaluateFlagValue.ts), [evaluateRollout](sdk/core/evaluation/evaluateRollout.ts), [rolloutUtils](sdk/core/evaluation/rolloutUtils.ts)

---

**License**: MIT © Flagmint Team

**Maintained with ❤️ by the Flagmint Team**

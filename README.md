# Flagmint JavaScript SDK

This SDK provides a framework-agnostic client for evaluating feature flags, with pluggable caching (sync or async) and transport strategies (WebSocket or long-polling).

## 📦 Installation

```bash
npm install flagmint-sdk
# or
yarn add flagmint-sdk
```

## 🛠️ FlagClientOptions

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

## 🚀 Quick Start

```ts
import { FlagClient } from 'flagmint-sdk';

const client = new FlagClient({
  apiKey: 'ff_XXXX',
  context: { user_id: 'user123', country: 'US' }
});

// wait until connected
await client.ready();

// get flag
const showBanner = client.getFlag('show_banner', false);
```

## 📖 References

* Core client: `@/core/client.ts`
* Cache helpers: `@/core/helpers/cacheHelper.ts`, `asyncCacheHelper.ts`
* Transports: `WebsocketTransport`, `LongPollingTransport`
* Evaluation: `evaluateFlagValue`, `evaluateRollout`, `rolloutUtils`

---

*MIT © Flagmint Team*

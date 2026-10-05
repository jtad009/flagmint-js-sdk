# Cache Helpers for Flagmint

Platform-agnostic helpers for caching **evaluated flags**, **user context**, and (with `configSync`) **rules snapshots**. Sync (`cacheHelper`) and async (`cacheHelper.async` / `asyncCacheHelper`) share the same key layout.

| Kind | Storage key | Notes |
|------|-------------|--------|
| Flags | `flagmint_<apiKey>_flags` | Wall-clock TTL on load |
| Context | `flagmint_<apiKey>_context` | No TTL |
| Rules (config-sync) | `flagmint_<apiKey>_rules` | Lease `expiresAt` gates reuse — not a wall-clock TTL |

`FlagClient` wires these by default when `enableOfflineCache` is on (`loadRulesSnapshot` / `saveRulesSnapshot` for config-sync).

---

## What runs where

| Environment | Out of the box | Persist across restarts |
|-------------|----------------|-------------------------|
| Browser | `localStorage` | Yes |
| Node / serverless | **In-memory only** (see below) | Only if you plug in a store |
| React Native | Prefer async helper + AsyncStorage | Yes, once adapter is set |

### Node with no adapter (config-sync)

If you do nothing special:

- Rules still work for the **lifetime of that process** — `RulesStore` keeps them in memory after the SSE stream delivers `fullConfig` / deltas.
- The cache helpers do **not** write to disk. Restart or a new worker → cold start (`fullConfig` again).

To keep a snapshot across restarts (or share across workers), call `setCacheStorage` / `setAsyncCacheStorage`, or pass a custom `cacheAdapter` on `FlagClient`.

---

## Feature Flag Cache Helper (Cross-Platform)

The sync `cacheHelper` module supports:

* Browser (`localStorage`)
* Node.js (custom adapter — e.g. `Map`, or wire Redis via async)
* React Native (prefer async + AsyncStorage)
* Async helper (Redis, filesystem, AsyncStorage)

---

## Default Sync Usage (Browser)

`localStorage` is used automatically — no setup required:

```ts
import {
  loadCachedFlags,
  saveCachedFlags,
  loadCachedContext,
  saveCachedContext,
  loadCachedRulesSnapshot,
  saveCachedRulesSnapshot,
} from './cacheHelper';

const flags = loadCachedFlags('your-api-key', 10_000); // 10 sec TTL
saveCachedFlags('your-api-key', { featureA: true });

const context = loadCachedContext('your-api-key');
saveCachedContext('your-api-key', { user_id: 'abc123' });

// configSync localCache (FlagClient does this for you when offline cache is on)
const rules = loadCachedRulesSnapshot('your-api-key');
if (rules) {
  // hydrate RulesStore, or let FlagClient do it on boot
}
saveCachedRulesSnapshot('your-api-key', rules!);
```

---

## Sync Usage in Node.js (In-Memory Persist Example)

Without `setCacheStorage`, helper **reads return null** and **writes are no-ops** (no `localStorage`). Process-local rules still live in `RulesStore` while the client is running.

To also persist snapshots in-process (or share one Map across clients in the same process):

```ts
import {
  setCacheStorage,
  loadCachedFlags,
  saveCachedFlags,
  loadCachedRulesSnapshot,
  saveCachedRulesSnapshot,
} from './cacheHelper';

const memoryStore = new Map<string, string>();

setCacheStorage({
  getItem: (key) => memoryStore.get(key) ?? null,
  setItem: (key, val) => {
    memoryStore.set(key, val);
  },
  removeItem: (key) => {
    memoryStore.delete(key);
  },
});

saveCachedFlags('your-api-key', { dark_mode: true });
const flags = loadCachedFlags('your-api-key', 5000);

// Same Map also stores rules under flagmint_<apiKey>_rules
const snap = loadCachedRulesSnapshot('your-api-key');
```

For Redis / files that survive process exit, use the async helper below.

---

## Sync Usage in React Native (Prefer Async Helper)

React Native should use an async adapter (`@react-native-async-storage/async-storage`). Prefer `asyncCacheHelper` instead of faking sync APIs over promises.

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCacheStorage } from './cacheHelper';

// Fragile — prefer setAsyncCacheStorage + FlagClient cacheAdapter
setCacheStorage({
  getItem: (key) => {
    let val: string | null = null;
    AsyncStorage.getItem(key).then((v) => (val = v));
    return val;
  },
  setItem: (key, value) => {
    AsyncStorage.setItem(key, value);
  },
});
```

---

## Async Cache Helper

For async storage (Node.js, React Native, SSR), use `cacheHelper.async` (`asyncCacheHelper`).

### Interface

```ts
interface AsyncCacheStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem?(key: string): Promise<void>;
}
```

You must call `setAsyncCacheStorage` before load/save — there is no silent default.

### Browser LocalStorage (wrapped)

```ts
import { setAsyncCacheStorage } from './asyncCacheHelper';

setAsyncCacheStorage({
  getItem: async (key) => localStorage.getItem(key),
  setItem: async (key, value) => {
    localStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    localStorage.removeItem(key);
  },
});
```

---

## Custom Async Adapter Examples

### Redis (Node.js)

```ts
import { createClient } from 'redis';
import { setAsyncCacheStorage } from './asyncCacheHelper';

const redis = createClient();
await redis.connect();

setAsyncCacheStorage({
  async getItem(key) {
    return await redis.get(key);
  },
  async setItem(key, value) {
    await redis.set(key, value);
  },
  async removeItem(key) {
    await redis.del(key);
  },
});
```

### Filesystem (Node.js)

```ts
import { promises as fs } from 'fs';
import path from 'path';
import { setAsyncCacheStorage } from './asyncCacheHelper';

const cacheDir = './flagmint_cache';

setAsyncCacheStorage({
  async getItem(key) {
    try {
      return await fs.readFile(path.join(cacheDir, key), 'utf-8');
    } catch {
      return null;
    }
  },
  async setItem(key, value) {
    const filePath = path.join(cacheDir, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, value, 'utf-8');
  },
  async removeItem(key) {
    await fs.unlink(path.join(cacheDir, key));
  },
});
```

Wire the async helpers into the client (or use `cacheAdapter`):

```ts
import * as asyncCache from './asyncCacheHelper';
import { FlagClient } from '../client';

setAsyncCacheStorage(/* redis or fs adapter */);

const client = new FlagClient({
  apiKey: '…',
  configSync: true,
  cacheAdapter: {
    loadFlags: asyncCache.loadCachedFlags,
    saveFlags: asyncCache.saveCachedFlags,
    loadContext: asyncCache.loadCachedContext,
    saveContext: asyncCache.saveCachedContext,
    loadRulesSnapshot: asyncCache.loadCachedRulesSnapshot,
    saveRulesSnapshot: asyncCache.saveCachedRulesSnapshot,
  },
});
```

---

## Async Usage Example

```ts
import {
  loadCachedFlags,
  saveCachedFlags,
  loadCachedContext,
  saveCachedContext,
  loadCachedRulesSnapshot,
  saveCachedRulesSnapshot,
} from './asyncCacheHelper';

const flags = await loadCachedFlags('my-api-key', 30000);
await saveCachedFlags('my-api-key', { myFlag: true });

const context = await loadCachedContext('my-api-key');
await saveCachedContext('my-api-key', { userId: '123' });

const rules = await loadCachedRulesSnapshot('my-api-key');
if (rules) {
  await saveCachedRulesSnapshot('my-api-key', rules);
}
```

---

## Test Async Storage Adapter

```ts
const mockStore: Record<string, string> = {};

setAsyncCacheStorage({
  getItem: async (key) => mockStore[key] ?? null,
  setItem: async (key, val) => {
    mockStore[key] = val;
  },
  removeItem: async (key) => {
    delete mockStore[key];
  },
});
```

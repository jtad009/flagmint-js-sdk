# Async Cache Helper for Flagmint

This module provides a platform-agnostic caching utility for feature flags and user context data, with support for both sync (browser/local) and async (server-side) environments.

---

## 🧠 Feature Flag Cache Helper (Cross-Platform)

The `cacheHelper` module allows you to cache flags and user context locally, with support for:

* ✅ Browser (via `localStorage`)
* ✅ Node.js (via custom adapter like `Map`)
* ✅ React Native (via `AsyncStorage` or similar)
* ✅ Async Cache Helper (via Redis or filesystem)

---

## 🛠 Default Sync Usage (Browser)

In browser environments, `localStorage` is used automatically — no setup required:

```ts
import {
  loadCachedFlags,
  saveCachedFlags,
  loadCachedContext,
  saveCachedContext,
} from './cacheHelper';

const flags = loadCachedFlags('your-api-key', 10_000); // 10 sec TTL
saveCachedFlags('your-api-key', { featureA: true });

const context = loadCachedContext('your-api-key');
saveCachedContext('your-api-key', { user_id: 'abc123' });
```

---

## ⚙️ Sync Usage in Node.js (In-Memory Example)

In Node.js or serverless environments, you must plug in your own storage adapter:

```ts
import {
  setCacheStorage,
  loadCachedFlags,
  saveCachedFlags,
} from './cacheHelper';

const memoryStore = new Map<string, string>();

setCacheStorage({
  getItem: (key) => memoryStore.get(key) ?? null,
  setItem: (key, val) => memoryStore.set(key, val),
});

saveCachedFlags('your-api-key', { dark_mode: true });
const flags = loadCachedFlags('your-api-key', 5000);
```

---

## 📱 Sync Usage in React Native (⚠️ Prefer Async Helper)

React Native environments should use an async adapter like `@react-native-async-storage/async-storage`. Prefer using `asyncCacheHelper` instead of adapting sync APIs.

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCacheStorage } from './cacheHelper';

setCacheStorage({
  getItem: (key) => {
    let val: string | null = null;
    AsyncStorage.getItem(key).then(v => (val = v));
    return val;
  },
  setItem: (key, value) => {
    AsyncStorage.setItem(key, value);
  },
});
```

---

## 🌐 Async Cache Helper

For environments requiring async storage (Node.js, React Native, SSR), use the `asyncCacheHelper` module.

### 🧩 Interface

```ts
interface AsyncCacheStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
```

---

### 🔧 Built-in (default) Adapter: Browser LocalStorage

```ts
import { setAsyncCacheStorage } from './asyncCacheHelper';

setAsyncCacheStorage({
  getItem: async (key) => localStorage.getItem(key),
  setItem: async (key, value) => localStorage.setItem(key, value),
  removeItem: async (key) => localStorage.removeItem(key)
});
```

---

## 🪛 Custom Async Adapter Examples

### ✅ Redis Adapter (for Node.js)

```ts
import { createClient } from 'redis';
import { setAsyncCacheStorage } from './asyncCacheHelper';

const redis = createClient();
await redis.connect();

const redisAdapter = {
  async getItem(key: string) {
    return await redis.get(key);
  },
  async setItem(key: string, value: string) {
    await redis.set(key, value);
  },
  async removeItem(key: string) {
    await redis.del(key);
  }
};

setAsyncCacheStorage(redisAdapter);
```

### ✅ Filesystem Adapter (for Node.js)

```ts
import { promises as fs } from 'fs';
import path from 'path';
import { setAsyncCacheStorage } from './asyncCacheHelper';

const cacheDir = './flagmint_cache';

const fileAdapter = {
  async getItem(key: string) {
    try {
      const filePath = path.join(cacheDir, key);
      return await fs.readFile(filePath, 'utf-8');
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string) {
    const filePath = path.join(cacheDir, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, value, 'utf-8');
  },
  async removeItem(key: string) {
    const filePath = path.join(cacheDir, key);
    await fs.unlink(filePath);
  }
};

setAsyncCacheStorage(fileAdapter);
```

---

## 📦 Async Usage Example

```ts
import {
  loadCachedFlags,
  saveCachedFlags,
  loadCachedContext,
  saveCachedContext
} from './asyncCacheHelper';

const flags = await loadCachedFlags('my-api-key', 30000);
saveCachedFlags('my-api-key', { myFlag: true });

const context = await loadCachedContext('my-api-key');
saveCachedContext('my-api-key', { userId: '123' });
```

---

## 🧪 Test Async Storage Adapter

To mock or test storage behavior:

```ts
const mockStore: Record<string, string> = {};

setAsyncCacheStorage({
  getItem: async (key) => mockStore[key] ?? null,
  setItem: async (key, val) => { mockStore[key] = val; },
  removeItem: async (key) => { delete mockStore[key]; }
});
```

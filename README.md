# Flagmint JavaScript SDK

> A framework-agnostic JavaScript SDK for evaluating and streaming feature flags in browsers and Node.js.

![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/license-BSD--3--Clause-lightgrey)

## Features

- Framework agnostic (React, Vue, Angular, vanilla JS, Node.js)
- Real-time flag updates over Server-Sent Events (SSE)
- Automatic reconnection with a fresh single-use session token
- Same-origin iframe/tab connection sharing (one stream per API key)
- Built-in localStorage cache, with pluggable adapters for Node
- `getFlag()` is always local — no network on the read path

## Release notes

### v2.0.0

- **SSE instead of WebSockets.** Handshake at `POST /auth/asl-handshake`, stream at `GET /evaluator/v2/flags/stream`, context at `POST /evaluator/v2/flags/context`.
- **Context updates match the API.** The SDK sends `x-api-key`, treats `202` as queued, and waits for the next `flags` event on the open stream (400ms server debounce). Browser and Node use the same path.
- **Quota and stream errors.** Listens for `quota_exceeded` and named `error` events. Quota surfaces as `ERR_RATE_LIMITED` (`retryAfter`, `resetTime`) through `onError`. Cached flags keep serving.
- **Connection sharing.** Same-origin documents (tabs, sibling iframes) with the same API key elect one leader that holds EventSource. Followers skip handshake and the stream. Off in Node so cluster workers each keep their own connection.
- **Node `EventSourceImpl`.** Node has no native EventSource; pass one (for example `eventsource`).
- **Session refresh on reconnect.** The stream consumes a single-use `sessionId`; reconnect fetches a new one before opening EventSource again.
- **`ready()` never throws.** Failures go to `onError`. Cached flags, if any, are used in degraded mode.

### v1.2.25 / v1.2.24

Historical WebSocket-era releases. See git tags for the full notes. v2.0.0 replaces that transport.

---

# Installation

```bash
npm install flagmint-js-sdk
```

```bash
yarn add flagmint-js-sdk
```

---

# Quick start

## Browser

```ts
import { FlagClient } from 'flagmint-js-sdk';

const client = new FlagClient({
  apiKey: 'ff_your_api_key',
  enableFlagmint: true,
  context: {
    kind: 'user',
    user: {
      kind: 'user',
      key: 'user-123',
      email: 'user@example.com'
    }
  },
  onError: (error) => {
    console.error(error.message, (error as { code?: string }).code);
  }
});

await client.ready();

const enabled = client.getFlag('new_dashboard', false);
```

Same-origin iframes that use this API key share one SSE connection by default. Set `shareConnection: false` if two clients on the page must keep different evaluation contexts at the same time, or if the origin hosts untrusted documents that should not share that stream.

## Node.js

Node does not provide `EventSource`. Install a polyfill and inject it. Each cluster worker should construct its own `FlagClient` (sharing is disabled without `window`).

```bash
npm install eventsource
```

```ts
import { FlagClient } from 'flagmint-js-sdk';
import EventSource from 'eventsource';

const client = new FlagClient({
  apiKey: process.env.FLAGMINT_API_KEY,
  enableFlagmint: true,
  EventSourceImpl: EventSource,
  env: process.env.FLAGMINT_ENVIRONMENT || 'production',
  onError: (error) => {
    console.error('Flagmint error:', error);
  }
});

await client.ready();
```

---

# How it works

After `ready()`:

1. Optionally joins a same-origin share group (browser). Followers stop here and receive flags from the leader.
2. `POST /auth/asl-handshake` with `X-API-Key` → single-use `sessionId`.
3. Opens `GET /evaluator/v2/flags/stream?sessionId&context&sdkVersion&platform&wrapper*`.
4. Server sends `connected` (connection id) then `flags` (evaluated map). Heartbeats are SSE comments (`: heartbeat`) and are not exposed by EventSource.
5. Flags are stored in the cache adapter (localStorage in the browser by default).
6. Later admin publishes are pushed as `flags` events on the same stream.

`getFlag()` / `getFlags()` never hit the network. They read the last evaluated snapshot.

`updateContext()` `POST`s `/evaluator/v2/flags/context` with `x-api-key` and `{ connectionId, context }`. The HTTP response is `202`; new values arrive as a `flags` event after the server’s 400ms debounce.

---

# Configuration

| Option | Type | Default | Description |
|---|---|---|---|
| `apiKey` | string | required | Environment API key |
| `enableFlagmint` | boolean | `true` | Set `false` in local/dev to skip connecting (no handshake, no stream) |
| `context` | object | `{}` | Initial evaluation context |
| `transportMode` | `'auto' \| 'sse' \| 'long-polling'` | `'auto'` | `auto` tries SSE, then long-polling |
| `EventSourceImpl` | EventSource | browser global | Required in Node |
| `shareConnection` | boolean | `true` in browsers with `BroadcastChannel`, `false` in Node | One stream per API key across same-origin documents |
| `enableOfflineCache` | boolean | `true` | Load/save flags via the cache adapter |
| `persistContext` | boolean | `false` | Persist context in the cache adapter |
| `cacheAdapter` | CacheAdapter | localStorage helpers | Custom cache (Redis, files, …) |
| `restEndpoint` | string | env default | Override the long-polling / evaluate URL |
| `sseEndpoint` | string | env default | Override the SSE base URL (`/stream` and `/context`) |
| `handshakeEndpoint` | string | env default | Override the ASL handshake URL. Use with `sseEndpoint` for self-hosted gateways |
| `env` | string | `NODE_ENV` | `development` \| `staging` \| `production` |
| `wrapperInfo` | `{ name, version }` | native-js | Framework wrapper telemetry on the stream URL |
| `previewMode` / `rawFlags` | | | Local-only evaluation, no network |
| `deferInitialization` | boolean | `false` | Wait for `ready()` before connecting |
| `debugLog` | boolean | `false` | Verbose SDK logs |
| `onError` | `(error) => void` | | Auth, quota, transport, and context errors. `ready()` still resolves. |

---

# Transport modes

```ts
transportMode: 'auto'           // SSE, then long-polling
transportMode: 'sse'            // stream only (throws into onError / fallback cache if it fails)
transportMode: 'long-polling'   // POST evaluate on an interval
```

---

# Connection sharing

Used when the same app is embedded twice on one origin (for example two WeSeeDo iframes in a host page).

- **Leader** performs handshake and holds EventSource.
- **Followers** receive flag snapshots over `BroadcastChannel` (`flagmint-share:<apiKey>`). Leadership is a `localStorage` lock (`flagmint_share_lock:<apiKey>`).
- Follower `updateContext()` is forwarded to the leader, which runs it on the shared stream. Last write wins. Any same-origin document can send that RPC and see the flags that come back — turn sharing off if you host untrusted content on this origin.
- If the leader iframe unloads, it posts `bye` so another member can take over immediately. If the tab is killed without `pagehide`, followers wait for the lock TTL.

```ts
// Default in the browser — one stream for this API key
shareConnection: true

// Two clients, two contexts, two streams
shareConnection: false
```

Node cluster workers do not share. Each worker process opens its own stream.

---

# Updating context

```ts
await client.updateContext({
  kind: 'multi',
  user: { kind: 'user', key: '123' },
  organization: { kind: 'organization', key: 'acme' }
});
```

Await this call. The promise settles when the stream delivers the next `flags` packet (or times out and keeps the previous snapshot). Overlapping calls are serialized.

SSE `/context` changes **that connection’s** context. It is the right tool for a browser user logging in. It is the wrong tool for many concurrent Node HTTP requests with different targeting on one singleton client — wait for client-side rule evaluation, or use a dedicated client per distinct context.

---

# Errors and quota

`ready()` always resolves. Use `onError`:

| `error.code` | Meaning |
|---|---|
| `ERR_AUTH` | Invalid API key, missing session, inactive subscription |
| `ERR_RATE_LIMITED` | Evaluation quota exceeded. Check `retryAfter` (seconds) and `resetTime`. Free-tier payloads may include a last snapshot in `data`; the SDK applies it and keeps serving cache. |
| `ERR_INVALID_CONTEXT` | Stream rejected the context payload |
| `ERR_INTERNAL` | Named SSE `error` from the server |

```ts
onError: (error) => {
  const { code, retryAfter, resetTime, message } = error as {
    code?: string;
    retryAfter?: number;
    resetTime?: string;
    message: string;
  };
  console.error(code, message, retryAfter, resetTime);
}
```

---

# Subscribing

```ts
const unsubscribe = client.subscribe((flags) => {
  const theme = client.getFlag('theme', 'light');
  console.log(theme, flags);
});

unsubscribe();
```

The callback runs immediately with the current snapshot, then on every push. `destroy()` clears subscribers.

---

# Offline cache

Enabled by default. On boot the SDK loads `flagmint_<apiKey>_flags` from localStorage (24h TTL). If the stream fails, those values stay in memory and `onError` fires.

```ts
cacheAdapter: {
  loadFlags(apiKey, ttl) { /* ... */ },
  saveFlags(apiKey, data) { /* ... */ },
  loadContext(apiKey) { /* ... */ },
  saveContext(apiKey, ctx) { /* ... */ }
}
```

Use `syncCache` in the browser and `asyncCache` (or your own) in Node / React Native.

---

# Debug logging

```ts
const client = new FlagClient({
  apiKey: 'ff_your_api_key',
  enableFlagmint: true,
  debugLog: true
});
```

In production, only connection lifecycle messages are emitted.

---

# API

```ts
await client.ready()
client.getFlag(key, fallback)
client.getFlags()
await client.updateContext(context)
client.subscribe(callback) // returns unsubscribe
client.destroy()
```

---

# Framework support

React, Vue, Angular, Next.js, Nuxt, Express, Fastify, Node.js, vanilla JavaScript.

Wrappers (`flagmint-vuejs-feature-flags`, `flagmint-react-sdk`) construct `FlagClient` for you. Connection sharing lives in this core SDK, not in the wrappers.

---

# License

BSD 3-Clause License © Flagmint Team

---

- **Documentation**: See [Flagmint Docs](https://docs.flagmint.com/sdks/nodejs)
<!-- - **Issues**: Report on [GitHub](https://github.com/flagmint/js-sdk/issues) -->
- **Email**: support@flagmint.com

**Maintained with ❤️ by the Flagmint Team**


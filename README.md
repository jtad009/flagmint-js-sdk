# Flagmint JavaScript SDK

> A framework-agnostic JavaScript SDK for evaluating and streaming feature flags in browsers and Node.js.

![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/license-BSD--3--Clause-lightgrey)

## Features

- 🚀 Framework agnostic (React, Vue, Angular, Vanilla JS, Node.js)
- 📡 Real-time flag updates using Server-Sent Events (SSE)
- 🔄 Automatic reconnection with exponential backoff
- 💾 Built-in synchronous and asynchronous cache adapters
- 🌍 Works in both browsers and Node.js
- 🔒 Fully typed with TypeScript
- ⚡ Local flag evaluation (no network requests during `getFlag()`)

## 📋 Release Notes

## v2.0.0 (Breaking Architectural Upgrade)

- Protocol Shift from WebSockets to SSE — Replaced full-duplex WebSockets with unidirectional, lightweight Server-Sent Events (SSE) [INDEX], drastically reducing server-side thread allocation and memory overhead.
-  Isomorphic Thread-Safety — Automatic runtime context switching. Operating in the browser uses standard client stream identifiers [INDEX]. Operating in a Node.js server bypasses process locks to support thousands of parallel API controller evaluations concurrently.
-  Node.js Polyfill Injection — Introduced EventSourceImpl configuration option [INDEX]. Since Node.js lacks a native EventSource API [INDEX], backend servers can pass third-party modules (like the eventsource npm library) [INDEX].

- 🔁 Automatic Token Rotation — Implemented an exponential backoff client-side reconnection loop [INDEX]. It refreshes single-use sessionId tokens before retrying [INDEX], surviving server hot-reloads and rolling production pod deployments without authorization errors.
-  Restored WebSocket Timing Semantics — Modified initialization promises so client.ready() unblocks the framework lifecycle immediately upon a successful HTTP connection handshake, ensuring total drop-in compatibility with legacy Vue and React wrapper SDK configurations.
### v1.2.25
- 🔇 **Controllable debug logging** — SDK logs are now silent by default; opt in with `logger.setup({ debugLog: true })`. In production, only connection/disconnection messages are ever emitted regardless of the setting.
- 🔌 **Configurable endpoints** — `restEndpoint` and `wsEndpoint` can now be passed directly in `FlagClientOptions`, overriding the environment-derived defaults. Useful for proxies, staging overrides, or self-hosted deployments.
- 📡 **`subscribe()` delivers current flags immediately** — the callback is now called synchronously with the current flag state at subscription time, so you never miss the initial value.
- 🧹 **`destroy()` clears all subscribers** — calling `destroy()` now also clears the subscriber set, preventing stale callbacks from holding references after teardown.
- 🛡️ **WebSocket auth vs rate-limit error discrimination** — close code `1008`/`4001` now inspects the close reason to distinguish `ERR_AUTH` (invalid API key) from `ERR_RATE_LIMITED` errors. Rate-limit errors include a `resetTime` field parsed from the close reason.
- 🔗 **`initialFlagsReject` on WebSocket transport** — a post-`onopen` close with a terminal code now correctly rejects the `waitForInitialFlags()` promise (and therefore `init()`), so the error surfaces reliably through `client.ready()` even when the connection opened before the server sent the close frame.
- 🔔 **`onConnectionStateChanged()` exposed** — consumers can now register a callback to observe WebSocket connection state transitions (`connecting`, `connected`, `disconnected`, `reconnecting`, `failed`).

### v1.2.24
- ✨ Add `env` parameter to SDK configuration for explicit environment specification
- Allows users to pass environment as a variable when NODE_ENV or NEXT_PUBLIC_NODE_ENV cannot be reliably detected
- Improved environment resolution with fallback to auto-detection

## ✨ Key Features

- 🎯 **Framework-Agnostic**: Works with React, Vue, vanilla JS, Node.js, and more
- 🔄 **Flexible Transport**: WebSocket for real-time updates or long-polling fallback
- 💾 **Pluggable Caching**: Use built-in sync cache, async cache (Redis/filesystem), or custom implementations
- 🚀 **Server & Browser Support**: Compatible with browser environments, Node.js, React Native
- 🔒 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- ⚡ **Zero-Config Defaults**: Works out of the box with sensible defaults

---

# Installation

```bash
npm install flagmint-js-sdk
```

or

```bash
yarn add flagmint-js-sdk
```

---

# Quick Start

## Browser

```ts
import { FlagClient } from 'flagmint-js-sdk';

const client = new FlagClient({
  apiKey: 'ff_your_api_key',
  context: {
    kind: 'user',
    user: {
      kind: 'user',
      key: 'user-123',
      email: 'user@example.com'
    }
  }
});

await client.ready();

const enabled = client.getFlag('new_dashboard', false);

console.log(enabled);
```

---

## Node.js

For SSE Transport option, Node.js does not currently provide a native `EventSource` implementation.

Install the EventSource polyfill:

```bash
npm install eventsource
```

Then inject it when creating the client.

```ts
import { FlagClient } from 'flagmint-js-sdk';
import EventSource from 'eventsource';

const client = new FlagClient({
    apiKey: process.env.FLAGMINT_API_KEY,
    EventSourceImpl: EventSource
});

await client.ready();
```

---

# How it Works

After calling `ready()` the SDK:

1. Connects to the Flagmint streaming endpoint.
2. Downloads the current feature flags.
3. Stores them in the configured cache.
4. Evaluates flags locally.
5. Receives live updates over SSE.
6. Notifies subscribers whenever flags change.

`getFlag()` never performs a network request.

---

# Configuration

| Option | Type | Description |
|---------|------|-------------|
| apiKey | string | Your environment API key |
| context | object | Initial evaluation context |
| transportMode | `'auto' \| 'sse' \| 'long-polling'` | Transport strategy |
| EventSourceImpl | EventSource | Required in Node.js |
| enableOfflineCache | boolean | Enable local cache |
| persistContext | boolean | Persist context |
| cacheAdapter | CacheAdapter | Custom cache implementation |
| restEndpoint | string | Override REST endpoint |
| sseEndpoint | string | Override SSE endpoint |
| previewMode | boolean | Local evaluation only |
| rawFlags | object | Local flag definitions |
| onError | function | Error callback |

---

# Transport Modes

## Auto (default)

Attempts to establish an SSE connection and automatically falls back to long-polling if required.

```ts
transportMode: 'auto'
```

## Server-Sent Events

Persistent HTTP stream providing real-time flag updates.

```ts
transportMode: 'sse'
```

## Long Polling

Useful where streaming connections are unavailable.

```ts
transportMode: 'long-polling'
```

---

# Working with Flags

```ts
await client.ready();

const enabled = client.getFlag('new_feature', false);

const allFlags = client.getFlags();
```

---

# Updating Context

```ts
await client.updateContext({
    kind: 'multi',
    user: {
        kind: 'user',
        key: '123'
    },
    organization: {
        kind: 'organization',
        key: 'acme'
    }
});
```

Updating the context automatically re-evaluates feature flags.

---

# Subscribing to Updates

```ts
const unsubscribe = client.subscribe(() => {

    const theme = client.getFlag('theme', 'light');

    console.log(theme);

});

// Later

unsubscribe();
```

The callback is invoked immediately after subscribing and again whenever flags change.

---

# Offline Mode

If offline caching is enabled (default):

- cached flags are loaded automatically
- `ready()` still resolves when cached flags exist
- `onError()` is invoked when operating in degraded mode
- `ready()` only rejects if no cache exists

---

# Debug Logging

Enable verbose SDK logging during development.

```ts
import { logger } from 'flagmint-js-sdk';

logger.setup({
    debugLog: true
});
```

Production builds only emit connection lifecycle messages.

---

# Cache Adapters

## Built-in synchronous cache

Suitable for browsers using localStorage.

## Built-in asynchronous cache

Suitable for:

- Redis
- File storage
- React Native
- Custom persistence

You may also provide your own implementation.

```ts
cacheAdapter: {

    loadFlags(){},

    saveFlags(){},

    loadContext(){},

    saveContext(){}

}
```

---

# API

## FlagClient

```ts
await ready()

getFlag()

getFlags()

updateContext()

subscribe()

destroy()
```

---

# Framework Support

- ✅ React
- ✅ Vue
- ✅ Angular
- ✅ Next.js
- ✅ Nuxt
- ✅ Express
- ✅ Fastify
- ✅ Node.js
- ✅ Vanilla JavaScript

---

# License

BSD 3-Clause License © Flagmint Team

---
# 📞 Support & Resources

- **Documentation**: See [Flagmint Docs](https://docs.flagmint.com/sdks/nodejs)
- **Issues**: Report on [GitHub](https://github.com/flagmint/js-sdk/issues)
- **Email**: support@flagmint.io

**Maintained with ❤️ by the Flagmint Team**


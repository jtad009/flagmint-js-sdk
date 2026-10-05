# Changelog

All notable changes to the Flagmint JS SDK are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.1] — 2026-10-05

### Fixed

- **Publish the config-sync runtime.** `2.2.0` shipped TypeScript types for `configSync` / `RulesCacheSnapshot` / `loadRulesSnapshot`, but the JS bundle was an older build without that code — Node apps with Redis localCache could not hydrate rules.
- **Node CJS + ECDH.** Raise Vite `build.target` to `es2020` so `@noble/curves` BigInt math is not rewritten to `Math.pow` (which crashed `require('flagmint-js-sdk')` after a fresh config-sync build).

## [2.2.0] — 2026-09-15

### Added

- **Config sync (opt-in).** Set `configSync: true` so the SDK receives signed flag **rules** (`lease`, `fullConfig`, `delta` / `deltas`) and evaluates **locally** instead of relying only on server-evaluated values on the stream.
- **ECDH handshake.** When config sync is on, the ASL handshake exchanges public keys and derives a per-session MAC key (secret never sent on the wire). Tampered payloads are rejected.
- **Rules store + local `getFlag`.** In-memory rules with optional **localCache** across reloads; expired lease fails closed (defaults only, no targeting).
- **SSE lifecycle debug logs.** With `debugLog: true`, logs connected / disconnected lines including `connectionId`, `upMs`, and reason (including `initial_connect_failed` when the stream dies before `connected`).
- **Call-site evaluation reports.** `getFlag()` queues debounced `kind: "evaluation"` events (coalesced `count`) to `POST /evaluator/events` when analytics is on for that flag. Feeds dashboard Evaluations / unique users; does **not** consume billing quota.

### Changed

- Default behavior (`configSync` off / omitted) stays the classic server-eval stream path.
- **Default SSE hosts** use `stream.flagmint.com` / `staging-stream.flagmint.com` (handshake + REST + context stay on `api` / `staging-api`). `POST /context` is derived from `restEndpoint` so stream-only hostnames do not break context updates.
- Plan-limit note: API `feat/billing-meters` enforces connection / observed_context / track caps when configured.

### Notes

- Requires a Flagmint API that supports config-sync + ECDH (FF-EU **1.5.0+** recommended).
- Plan limits on new billing meters ship with the paired API build (`feat/billing-meters`); local `getFlag` remains free for quota.

## [2.0.1] — 2026-09-09

### Fixed

- Patch release after 2.0.0 (see git history / prior notes).

## [2.0.0] — 2026-07-26

### Changed

- Major line bump from the 1.2.x series (SSE and related transport work).

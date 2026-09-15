# Changelog

All notable changes to the Flagmint JS SDK are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] — 2026-09-15

### Added

- **Config sync (opt-in).** Set `configSync: true` so the SDK receives signed flag **rules** (`lease`, `fullConfig`, `delta` / `deltas`) and evaluates **locally** instead of relying only on server-evaluated values on the stream.
- **ECDH handshake.** When config sync is on, the ASL handshake exchanges public keys and derives a per-session MAC key (secret never sent on the wire). Tampered payloads are rejected.
- **Rules store + local `getFlag`.** In-memory rules with optional **localCache** across reloads; expired lease fails closed (defaults only, no targeting).
- **SSE lifecycle debug logs.** With `debugLog: true`, logs connected / disconnected lines including `connectionId`, `upMs`, and reason (including `initial_connect_failed` when the stream dies before `connected`).

### Changed

- Default behavior (`configSync` off / omitted) stays the classic server-eval stream path.

### Notes

- Requires a Flagmint API that supports config-sync + ECDH (FF-EU **1.5.0+** recommended).
- Plan limits on new billing meters are **not** part of this release.

## [2.0.1] — 2026-09-09

### Fixed

- Patch release after 2.0.0 (see git history / prior notes).

## [2.0.0] — 2026-07-26

### Changed

- Major line bump from the 1.2.x series (SSE and related transport work).

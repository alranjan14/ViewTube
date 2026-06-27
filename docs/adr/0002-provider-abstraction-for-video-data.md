# 2. Abstract video data behind a provider interface

Date: 2026-06-27

## Status

Accepted

## Context

The app consumes the YouTube Data API v3. Coupling components directly to YouTube's
request/response shapes would make the UI brittle to API changes, hard to test without the
network, and expensive (quota) during development.

## Decision

All video data flows through an `IVideoProvider` interface (`src/shared/api/videoProvider.ts`),
whose methods take a single options object. Two implementations exist: `youtubeProvider` (real
API) and `mockProvider` (in-memory fixtures); the active one is selected at startup from
`config.useMockApi`. The UI depends only on the interface and on domain types
(`VideoSummary`, `VideoDetails`, …) — never on raw YouTube payloads.

## Consequences

- Components are decoupled from the data source; mocking and swapping are trivial.
- Mock mode enables development and deterministic tests without consuming quota.
- The interface is a stable seam where response validation (Zod) and mapping live (see ADR 0004).
- A second source (e.g. a backend-for-frontend proxy to hide the API key) can be added without
  touching the UI.

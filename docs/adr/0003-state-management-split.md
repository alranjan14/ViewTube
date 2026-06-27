# 3. RTK for UI state, TanStack Query for server state

Date: 2026-06-27

## Status

Accepted

## Context

ViewTube has two distinct kinds of state: ephemeral UI/client state (menu open, auth profile,
live-chat buffer) and server state (videos, channels, comments) that is asynchronous, cached,
and shared across the tree.

## Decision

Use **Redux Toolkit** for UI/client state (`app`, `auth`, `chat` slices) and **TanStack Query**
for all server state (`src/shared/hooks/queries.ts`). Server data is never copied into Redux.

## Consequences

- Each tool does what it is best at; no hand-rolled caching or invalidation.
- Query provides caching, request dedup, retries, background refetch, and cancellation
  (via `AbortSignal`).
- Simple rule for contributors: _from the network → Query; otherwise → Redux._

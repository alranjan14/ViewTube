# 4. Validate API responses with Zod at the boundary

Date: 2026-06-27

## Status

Accepted

## Context

TypeScript types are erased at runtime. Trusting the YouTube payload shape (`item.snippet.title`,
…) means a changed, partial, or error response crashes deep in render with an opaque
`undefined is not an object` — far from the actual cause.

## Decision

Define Zod schemas for the raw YouTube payloads (`src/shared/api/youtube.schemas.ts`) and parse
every response at the provider boundary before mapping to domain types via pure functions
(`youtube.mappers.ts`). Schema drift throws a typed, catchable error that TanStack Query surfaces
and the `ErrorBoundary` contains.

## Consequences

- Runtime safety matches the compile-time types; no `any` survives in the data layer.
- Failures are explicit and localized to the boundary, not the render tree.
- Schemas are the single source of truth — raw types are derived via `z.infer`.
- A small bundle/parse cost, negligible next to a network round trip.

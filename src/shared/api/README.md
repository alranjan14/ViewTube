# `shared/api` — the data seam

The UI never talks to YouTube (or any backend) directly. It depends only on the
**`IVideoProvider`** interface ([`videoProvider.ts`](./videoProvider.ts)). This is
the dependency-inversion boundary of the app: swap the implementation and nothing
in `pages/`, `widgets/`, `entities/`, or `features/` changes.

## Layout

| File                 | Responsibility                                                                                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `videoProvider.ts`   | The `IVideoProvider` interface + request param types (`PageParams`, `RequestContext`, …). The contract everything else depends on.                                               |
| `youtubeProvider.ts` | Real implementation. Calls the **same-origin BFF proxy** (`/api/youtube/*`, `/api/suggest`), validates each response with Zod, then maps to domain types. No API key lives here. |
| `mockProvider.ts`    | In-memory implementation for `VITE_USE_MOCK_API=true` (demos, offline dev, deterministic E2E).                                                                                   |
| `index.ts`           | Picks the active provider from config and exports it as `apiProvider`.                                                                                                           |
| `httpClient.ts`      | `fetch` wrapper: timeout, abort, typed `ApiError` / `QuotaExceededError`.                                                                                                        |
| `youtube.schemas.ts` | Zod schemas for the **raw** YouTube payloads (the runtime boundary).                                                                                                             |
| `youtube.mappers.ts` | Pure `raw → domain` functions (`mapVideoSummary`, …), unit-tested in isolation.                                                                                                  |

## Request flow (real provider)

```
UI → TanStack Query hook (shared/hooks/queries.ts)
   → apiProvider.getX({ ...params, signal })
   → httpClient(`/api/youtube/...`)        // same-origin; proxy injects the key
   → Schema.parse(raw)                      // throws a typed error on drift
   → mapX(item)                             // raw → domain type
   → PaginatedResponse<DomainType>
```

The YouTube API key is **never** in the browser. The proxy
(`api/youtube/[...path].ts` on Vercel, or the Vite dev proxy locally) holds it
server-side. See the repo README's _Security_ section.

## Adding a new provider (e.g. a self-hosted backend)

1. Create `myProvider.ts` implementing **`IVideoProvider`**. Every method takes a
   single options object and returns a domain type — never a raw API shape.
2. Validate at the boundary: add Zod schemas for your raw responses and `.parse()`
   before mapping. Reuse / extend `youtube.mappers.ts` where the domain shape matches.
3. Throw typed errors (`ApiError`, `QuotaExceededError`) so the UI's `QueryError`
   can render the right state.
4. Wire it up in `index.ts` (e.g. behind a new config flag in `shared/config/env.ts`).
5. Test it against MSW fixtures of **real** upstream payloads (see
   `youtubeProvider.test.ts`) so the schema + mappers are exercised end-to-end.

## Why this shape

- **Testability** — pure mappers and a parsed boundary are trivial to unit-test.
- **Resilience** — a payload change fails as a typed, catchable error at the edge,
  not as `undefined is not an object` deep in render.
- **Swappability** — mock vs. real vs. future backends are interchangeable.

Decision records: [`docs/adr/`](../../../docs/adr).

# API Strategy

This document explains how VideoTube interacts with the YouTube Data API v3 and manages associated constraints.

## The API Abstraction Layer

To ensure the application remains flexible and resilient to API changes or limits, all data fetching is routed through a central API Provider abstraction defined in `src/shared/api/index.ts`.

Components and hooks do not call `fetch` or `axios` directly. Instead, they call methods on the exported `apiProvider`.

### `youtubeProvider`
The default provider that executes real HTTP requests against `https://youtube.googleapis.com/youtube/v3`. It automatically appends the `VITE_YOUTUBE_API_KEY` to requests.

### `mockProvider`
A fallback provider that implements the exact same interface as `youtubeProvider` but returns hardcoded, static mock data. It resolves promises with fake data (simulating network latency).

**Toggle Mechanism:**
The provider is determined at build/runtime via the environment variable `VITE_USE_MOCK_API`. If set to `true`, the `mockProvider` is injected.

## Quota Management

The YouTube Data API imposes a strict daily quota (typically 10,000 units per day for unverified projects). Video calls cost 1 unit, but Search calls cost 100 units.

**Mitigation Strategies:**
1. **Aggressive Caching:** TanStack Query is configured with long `staleTime` and `cacheTime` to prevent duplicate network requests during a single user session.
2. **Mocking in Development:** Developers should run the application using the mock provider (`npm run dev:mock` or setting `VITE_USE_MOCK_API=true` in `.env.local`) when building UI features that do not require live data.
3. **Mocking in CI/E2E:** Playwright E2E tests are configured to use the mock provider to ensure tests are deterministic and do not drain the live quota.

## Mock Service Worker (MSW)

While `mockProvider` is great for simple development, our Component Integration tests utilize MSW (`src/test/mocks/handlers.ts`). 

MSW intercepts actual `fetch` calls made by `youtubeProvider` at the network level and returns mock responses. This allows us to test the entire data fetching layer (including TanStack Query's cache and error handling) without hitting the real API.

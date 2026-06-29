# ViewTube

[![Live Demo](https://img.shields.io/badge/Live%20Demo-view--tube--chi.vercel.app-brightgreen)](https://view-tube-chi.vercel.app/)
[![CI](https://github.com/alranjan14/ViewTube/actions/workflows/ci.yml/badge.svg)](https://github.com/alranjan14/ViewTube/actions/workflows/ci.yml)

A premium, React-based video discovery application inspired by YouTube. It features a modern glassmorphism aesthetic, robust testing architecture, real Google authentication, and native voice search capabilities.

## Demo

**Live app:** [view-tube-chi.vercel.app](https://view-tube-chi.vercel.app/) · **[▶ Full screen recording (MP4)](./public/demo.mp4)**

![ViewTube Demo](./public/demo.webp)

## Tech Stack

- **Framework:** React 18 & Vite
- **Styling:** Tailwind CSS & Lucide Icons
- **Authentication:** Google OAuth 2.0 (`@react-oauth/google`)
- **State Management:** Redux Toolkit (UI & Auth state) & TanStack Query (Server state)
- **Routing:** React Router v6
- **Testing:** Vitest, Playwright, React Testing Library, Mock Service Worker (MSW)
- **Validation:** Zod — runtime validation of API responses
- **Deployment:** Vercel (static SPA + Edge-function BFF proxy)
- **Monitoring:** Sentry (optional, lazy-loaded behind `VITE_SENTRY_DSN`)
- **Quality:** ESLint, Prettier, Husky + lint-staged, commitlint, GitHub Actions CI

## Architecture

The UI never talks to the YouTube API directly — it depends on an `IVideoProvider` interface, and every response is validated with Zod before being mapped to domain types. The code is organized along [Feature-Sliced Design](https://feature-sliced.design/) layers. Decisions behind the structure are recorded in [`docs/adr/`](./docs/adr).

```
api/                  Vercel serverless functions — the BFF proxy that holds the YouTube key
src/
  app/                Composition root: Redux store + slices (app, auth, chat), App (router)
  pages/              Route-level views
  widgets/            Layout composition: Head, Sidebar, Body, ButtonList
  entities/           Domain UI + queries: video (VideoCard, SearchVideoCard, containers)
  features/           User-facing features: live-chat, comments
  shared/             Cross-cutting, feature-agnostic code:
    api/              IVideoProvider + youtube/mock providers, Zod schemas, mappers, httpClient
    config/           Validated env (env.ts), storage keys + limits (storage.ts)
    hooks/            TanStack Query hooks (queries.ts) + reusable hooks (useLocalStorage, useClickOutside, …)
    lib/              Cross-cutting utilities (logger, helpers, constants)
    routes/           Route constants
    types/            Domain types
    ui/               Design-system primitives (Button, Modal, Toast, ErrorBoundary, …)
  index.tsx           Bootstrap (mounts <App/> with global providers)
```

Cross-layer imports use the `@/` path alias (e.g. `@/shared/ui/Button`), so files stay movable.

- **Data layer:** `youtubeProvider` (real API, via the proxy) and `mockProvider` implement `IVideoProvider`; the active one is chosen from `VITE_USE_MOCK_API`. Raw responses are parsed by Zod schemas, then mapped to domain types by pure functions. See [`src/shared/api/README.md`](./src/shared/api/README.md).
- **API proxy (BFF):** the browser only calls the same-origin `/api/youtube/*` and `/api/suggest`; the proxy injects the API key server-side. The key is never in the client bundle.
- **State:** Redux Toolkit for UI/auth/chat state; TanStack Query for all server state (caching, retries, request cancellation).
- **Resilience:** a typed `httpClient` (incl. `QuotaExceededError`), a mounted `ErrorBoundary`, and a `logger` facade.

## Features

- **Google Login:** Secure authentication using official Google Identity Services. Persists sessions and fetches real high-res profile pictures.
- **Voice Search:** Native Web Speech API integration in the header allows you to search for videos hands-free.
- **Dynamic Avatars:** Automatically fetches real YouTube channel profile pictures. For instant loading, it uses `ui-avatars` to generate beautiful colored initials as a fallback until the high-res image loads.
- **"You" Library Page:** A polished library section replicating the modern YouTube "You" tab, cleanly separating History, Watch Later, and Playlists.
- **Glassmorphism UI:** A premium, modern interface with translucent backgrounds, smooth micro-animations, and vibrant accents.
- **Fast SPA Navigation:** Instant client-side routing using React Router, avoiding full page reloads.
- **Data Fetching & Caching:** Robust server-state management using TanStack Query to optimize YouTube Data API usage and caching.
- **Mock API Mode:** A built-in mock provider that simulates YouTube API responses for development and testing without burning API quota.
- **Comprehensive Testing:** E2E tests powered by Playwright and unit tests with Vitest + RTL.

## Setup

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Create a local environment file:

   ```sh
   cp .env.example .env
   ```

3. Configure your access in `.env`:

   ```txt
   # Server-side only — read by the BFF proxy, NEVER inlined into the bundle.
   YOUTUBE_API_KEY=your_youtube_api_key_here

   # Client-side (VITE_-prefixed) — safe to ship.
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here

   # Set to 'true' to use mocked local data and prevent consuming API quota.
   VITE_USE_MOCK_API=false

   # Optional: error reporting. When empty, Sentry is never loaded.
   VITE_SENTRY_DSN=
   ```

4. Start the development server:

   ```sh
   npm run dev
   ```

   The Vite dev server proxies `/api/youtube/*` and `/api/suggest` to YouTube,
   injecting `YOUTUBE_API_KEY` server-side (see `vite.config.ts`) — so live mode
   works locally without exposing the key. Or run `VITE_USE_MOCK_API=true` to skip
   the API entirely.

## Scripts

- `npm run dev`: Start the local development server with Vite.
- `npm run build`: Type-check and build the production bundle.
- `npm run preview`: Preview the production build locally.
- `npm run typecheck`: Run the TypeScript compiler with no emit.
- `npm run lint`: Run ESLint over the source.
- `npm run format`: Format the source with Prettier.
- `npm run test`: Run the Vitest unit and integration suite (`test:coverage` for coverage).
- `npm run test:e2e`: Run the Playwright E2E suite (runs the app in mock mode).

## Deployment (Vercel)

The app deploys as a static SPA plus a small backend-for-frontend (BFF) proxy:

- `api/youtube/[...path].ts` and `api/suggest.ts` are Vercel **Edge functions** (free on the Hobby tier) that forward to the YouTube Data API and inject the key.
- [`vercel.json`](./vercel.json) configures the SPA fallback and serves security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

To deploy:

1. Import the repo into Vercel.
2. Set environment variables in the Vercel dashboard:
   - `YOUTUBE_API_KEY` — **server-side** (read by the Edge functions). **Do not** set `VITE_YOUTUBE_API_KEY`; the key must stay server-side.
   - `VITE_GOOGLE_CLIENT_ID` — **build-time** (inlined). If added after the first deploy, **redeploy** for it to take effect.
   - `VITE_SENTRY_DSN` — optional error reporting.
3. **Authorize the domain for Google login:** in Google Cloud Console → the OAuth 2.0 Client → **Authorized JavaScript origins**, add your deployed origin (e.g. `https://your-app.vercel.app`). Without this, sign-in fails with `Error 400: origin_mismatch`. Note: Google doesn't allow wildcard origins, so per-deploy Vercel **preview URLs won't have working login** — only the stable production domain (and any origins you add explicitly).
4. Deploy. Locally, `vercel dev` runs the functions alongside the app; plain `npm run dev` uses the equivalent Vite dev proxy.

## Security

- **The YouTube API key never reaches the browser.** It is held server-side by the BFF proxy (the Vercel functions in `api/`, or the Vite dev proxy locally); the client only ever calls the same-origin `/api/youtube/*` and `/api/suggest`. Only `VITE_`-prefixed variables are inlined into the bundle, and the key is no longer one of them.
- **Search suggestions use JSON over the proxy**, not the old `<script>`-injection JSONP (which executed remote code by design).
- **The watch player** embeds `youtube-nocookie.com`, validates the `videoId` against `^[A-Za-z0-9_-]{11}$`, and sets a strict `referrerPolicy`.
- **CSP and security headers** are served from `vercel.json` in production.
- Do not commit API keys or local `.env` files (`.env*` is gitignored except `.env.example`).
- Public YouTube API usage must follow the YouTube API Services Terms and Developer Policies.

## Notes

- Set `VITE_USE_MOCK_API=true` to use the built-in mock provider and avoid consuming quota during development and testing.
- Contribution conventions and the architecture rationale live in [CONTRIBUTING.md](./CONTRIBUTING.md) and [`docs/adr/`](./docs/adr).

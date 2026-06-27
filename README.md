# ViewTube

A premium, React-based video discovery application inspired by YouTube. It features a modern glassmorphism aesthetic, robust testing architecture, real Google authentication, and native voice search capabilities.

## Demo

![ViewTube Demo](./public/demo.webp)

## Tech Stack

- **Framework:** React 18 & Vite
- **Styling:** Tailwind CSS & Lucide Icons
- **Authentication:** Google OAuth 2.0 (`@react-oauth/google`)
- **State Management:** Redux Toolkit (UI & Auth state) & TanStack Query (Server state)
- **Routing:** React Router v6
- **Testing:** Vitest, Playwright, React Testing Library, Mock Service Worker (MSW)
- **Validation:** Zod — runtime validation of API responses
- **Quality:** ESLint, Prettier, Husky + lint-staged, commitlint, GitHub Actions CI

## Architecture

The UI never talks to the YouTube API directly — it depends on an `IVideoProvider` interface, and every response is validated with Zod before being mapped to domain types. Decisions behind the structure are recorded in [`docs/adr/`](./docs/adr).

```
src/
  components/   Layout & shared components (Head, Sidebar, Body, cards, …)
  pages/        Route-level views
  shared/
    api/        IVideoProvider + youtube/mock providers, Zod schemas, mappers, httpClient
    config/     Validated env (env.ts) and centralized storage keys (storage.ts)
    hooks/      TanStack Query hooks (queries.ts) + reusable hooks
    lib/        Cross-cutting utilities (logger)
    routes/     Route constants
    types/      Domain types
    ui/         Design-system primitives (Button, Modal, Toast, ErrorBoundary, …)
  utils/        Redux store + slices (app, auth, chat)
```

- **Data layer:** `youtubeProvider` (real API) and `mockProvider` implement `IVideoProvider`; the active one is chosen from `VITE_USE_MOCK_API`. Raw responses are parsed by Zod schemas, then mapped to domain types by pure functions.
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

3. Configure your API access in `.env`:

   ```txt
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here

   # Set to 'true' to use mocked local data and prevent consuming API quota
   VITE_USE_MOCK_API=false
   ```

4. Start the development server:

   ```sh
   npm run dev
   ```

## Scripts

- `npm run dev`: Start the local development server with Vite.
- `npm run build`: Type-check and build the production bundle.
- `npm run preview`: Preview the production build locally.
- `npm run typecheck`: Run the TypeScript compiler with no emit.
- `npm run lint`: Run ESLint over the source.
- `npm run format`: Format the source with Prettier.
- `npm run test`: Run the Vitest unit and integration suite (`test:coverage` for coverage).
- `npm run test:e2e`: Run the Playwright E2E suite (runs the app in mock mode).

## Security

- **The YouTube API key is currently exposed client-side.** Vite inlines any `VITE_`-prefixed variable into the browser bundle, so the key is extractable from the deployed JS. For anything beyond a demo, route requests through a small backend-for-frontend (BFF) proxy that holds the key server-side. As an interim measure, restrict the key by HTTP referrer in the Google Cloud Console and prefer `VITE_USE_MOCK_API=true` for public demos.
- Do not commit API keys or local `.env` files (`.env*` is gitignored except `.env.example`).
- Public YouTube API usage must follow the YouTube API Services Terms and Developer Policies.

## Notes

- The app talks to the YouTube Data API v3 from the browser; set `VITE_USE_MOCK_API=true` to use the built-in mock provider and avoid consuming quota during development and testing.
- Contribution conventions and the architecture rationale live in [CONTRIBUTING.md](./CONTRIBUTING.md) and [`docs/adr/`](./docs/adr).

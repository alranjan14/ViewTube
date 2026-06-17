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
- `npm run build`: Compile TypeScript and build the production bundle.
- `npm run preview`: Preview the production build locally.
- `npm run test`: Run the Vitest unit and integration test suite.
- `npm run test:e2e`: Run the Playwright End-to-End test suite against the local development server.

## Notes

- Do not commit API keys or local `.env` files.
- The application interfaces directly with the YouTube Data API v3 from the browser. To manage quotas during development and testing, utilize `VITE_USE_MOCK_API=true`.
- Public YouTube API usage must follow the YouTube API Services Terms and Developer Policies.

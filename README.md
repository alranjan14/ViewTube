# VideoTube

A premium, React-based video discovery application inspired by YouTube, featuring a modern glassmorphism aesthetic and robust testing architecture.

## Tech Stack

- **Framework:** React 18 & Vite
- **Styling:** Tailwind CSS & Lucide Icons
- **State Management:** Redux Toolkit (UI state) & TanStack Query (Server state)
- **Routing:** React Router v6
- **Testing:** Vitest, Playwright, React Testing Library, Mock Service Worker (MSW)

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

## Documentation

For a deeper dive into the technical decisions, codebase, and API strategy, please refer to the following documents:

- **[Architecture](ARCHITECTURE.md)**: Details on the SPA approach, state management, and directory structure.
- **[API Strategy](API_STRATEGY.md)**: Information about the `youtubeProvider`, `mockProvider`, quota management, and MSW setup.
- **[Design System](DESIGN_SYSTEM.md)**: Aesthetic guidelines covering Tailwind usage, glassmorphism, and shared UI primitives.

## Notes

- Do not commit API keys or local `.env` files.
- The application interfaces directly with the YouTube Data API v3 from the browser. To manage quotas during development and testing, utilize `VITE_USE_MOCK_API=true`.
- Public YouTube API usage must follow the YouTube API Services Terms and Developer Policies.

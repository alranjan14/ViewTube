# Architecture Overview

This document outlines the architectural decisions and patterns used in the VideoTube application.

## High-Level Architecture

VideoTube is a pure client-side Single Page Application (SPA) built with React 18 and Vite. It directly interfaces with the YouTube Data API v3 without an intermediary Backend-For-Frontend (BFF). 

### BFF vs Direct API Calls
We explicitly chose to forgo a BFF to minimize hosting costs and complexity. 
- **Pros:** Zero server maintenance, lower latency by skipping an intermediate hop, and simplified deployment (static hosting).
- **Cons:** The YouTube API key must be exposed to the client. To mitigate abuse, the API key must be restricted via the Google Cloud Console to specific domains.

## State Management Strategy

We use a hybrid approach to state management, recognizing that UI state and Server state have fundamentally different requirements.

### Server State (TanStack Query)
All asynchronous data fetching from the YouTube API is handled by TanStack Query (`react-query`).
- **Why:** YouTube API data is inherently asynchronous, needs caching to preserve quota, requires background fetching, and benefits from built-in loading/error states.
- **Implementation:** Custom hooks in `src/shared/hooks/queries.ts` encapsulate the query logic, keys, and stale times.

### Client UI State (Redux Toolkit)
Global, synchronous UI state is managed by Redux Toolkit.
- **Why:** The sidebar toggle state, theme preferences, and localized user interactions (like a custom "Watch Later" list that doesn't sync to Google) require predictable, synchronous updates across disjointed component subtrees.
- **Implementation:** Slices (like `appSlice.ts`) manage these atomic UI flags.

## Directory Structure

We follow a feature-centric, modular folder structure rather than grouping files strictly by type (e.g., all components together, all hooks together).

```
src/
├── assets/          # Static assets like images and global CSS
├── components/      # Reusable UI components (VideoCard, Sidebar, Head)
├── pages/           # Route-level components (HomePage, WatchPage)
├── shared/          # Shared utilities and core logic
│   ├── api/         # API abstraction layer (youtube vs mock providers)
│   ├── hooks/       # Custom React hooks and TanStack queries
│   ├── routes/      # Application routing definitions
│   ├── types/       # Global TypeScript interfaces
│   ├── ui/          # Generic UI primitives (Skeleton, IconButton)
│   └── utils/       # Helper functions (formatting, parsing)
└── test/            # Testing setup, MSW handlers, and custom renderers
```

## Testing Architecture

We utilize a robust testing pyramid:
1. **Unit Tests (Vitest):** Core utilities, formatting functions, and Redux reducers.
2. **Component/Integration Tests (React Testing Library + MSW):** Verifies component rendering and data fetching by intercepting network requests using Mock Service Worker (MSW).
3. **End-to-End Tests (Playwright):** Smoke tests verifying critical user journeys against a mocked local server to ensure system integrity without consuming API quota.

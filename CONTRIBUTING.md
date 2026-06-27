# Contributing to ViewTube

Thanks for contributing! This guide covers local setup, conventions, and the checks your change must pass.

## Prerequisites

- **Node `>=20.19`** (see `.node-version`; with nvm, run `nvm use`)
- **npm `>=10`**

## Setup

```sh
npm ci
cp .env.example .env     # fill in values, or set VITE_USE_MOCK_API=true to skip the API
npm run dev
```

## Branching

Branch off `master` with a conventional prefix: `feat/…`, `fix/…`, `chore/…`, `docs/…`. Keep PRs focused.

## Commits — Conventional Commits (enforced)

commitlint runs on the `commit-msg` hook. Format: `type(scope): subject`.

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Examples:

- `feat(search): add native voice search`
- `fix(watch): validate video id before embedding`
- `test(api): cover the comment-thread mapper`

## Pre-commit

Husky runs `lint-staged` (ESLint `--fix` + Prettier on staged files). A commit that still has lint errors is blocked.

## Local checks (run before pushing)

```sh
npm run typecheck
npm run lint
npm run test          # or: npm run test:coverage
npm run build
```

CI runs the same on every PR, plus Playwright E2E (in mock mode) and `npm audit --audit-level=high`.

## Testing

- **Unit/integration:** Vitest + Testing Library; the network is mocked with MSW (`src/test/mocks/`).
- Render components that need app context with **`renderWithProviders`** (`src/test/utils.tsx`) — it supplies Redux, TanStack Query, Router, Google OAuth, and Toast providers.
- Coverage has a floor (`vitest.config.ts`); please don't regress it, and add tests for new logic.
- **E2E:** `npm run test:e2e` (Playwright) runs the app in mock mode for determinism.

## Architecture

See [README.md](./README.md#architecture) for the overview and [`docs/adr/`](./docs/adr) for the decisions behind the structure.

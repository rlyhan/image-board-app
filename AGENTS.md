# AGENTS.md

## Project Overview
Next.js 15 image board app using the App Router. Images sourced from the Pexels API. Auth via Auth0, data persistence via MongoDB.

## Stack
- **Framework**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS v4
- **Auth**: @auth0/nextjs-auth0
- **Database**: MongoDB
- **Package manager**: npm

## Key Directories
- `app/` — Next.js routes and API handlers
- `components/` — React components (cart, common, dashboard, forms, gallery, icons, navigation)
- `lib/` — Shared utilities (auth0, mongodb, types, validations, helpers, config)
- `tests/` — Vitest unit and integration tests
- `cypress/` — Cypress E2E tests

## Dev Commands
```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript type check (tsc --noEmit)
npm run test         # All Vitest tests
npm run test:unit    # Unit tests only
npm run test:integration  # Integration tests only
npm run test:e2e     # Cypress E2E (headless)
npm run test:e2e:open     # Cypress E2E (interactive)

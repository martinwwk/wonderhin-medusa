# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Wonderhin E-commerce Storefront

> Part of the Wonderhin Medusa monorepo. See root `AGENTS.md` for comprehensive guidance on the full project.

## Project Aim & Objectives

**Goal:** Build a custom e-commerce platform by leveraging Medusa v2 as the backend engine while enhancing both the storefront and admin dashboard.

**Key Objectives:**
1. **Backend** (`/backend`) - Extend Medusa v2 with custom API routes, modules, and workflows for domain-specific business logic
2. **Storefront** (`/storefront`) - Customize a Themeforest template to consume Medusa data via SDK, providing a premium shopping experience
3. **Admin Dashboard** (`/admin`) - Fork and customize Medusa admin to manage store operations with tailored features

## Monorepo Structure
```
wonderhin-medusa/
├── backend/    # Medusa v2 API server
├── admin/      # Customized Medusa admin (forked, React/Vite)
└── storefront/ # Next.js storefront (this project)
```

## Project Overview
Wonderhin is a Next.js storefront based on a premium Themeforest template, customized to integrate with a Medusa v2 backend. It uses the App Router, TanStack Query for data fetching, and i18next for localization.

## Environment & Scripts
- **Manager:** npm / yarn
- **Dev:** `npm run dev` (uses Turbopack)
- **Build:** `npm run build`
- **Start (production):** `npm run start`
- **Lint:** `npm run lint`
- **Next.js:** v16 (App Router)
- **React:** v19
- **Medusa SDK:** `@medusajs/js-sdk` v2

## Environment Variables
- `NEXT_PUBLIC_API_BASE_URL` - Medusa backend API URL (required)
- See root `AGENTS.md` for database (Docker) and backend env vars.

## Coding Standards & Patterns
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0+, `classnames` (cn) for conditional classes.
- **UI Components:** Framer Motion for animations, Headless UI / Radix UI for accessible primitives.
- **Routing:** Localized App Router under `src/app/[countryCode]`.
- **Data Fetching:**
  - **Server:** Use `@/lib/data/*` for server-side fetching with Next.js cache.
  - **Client:** Use TanStack Query with Medusa SDK scripts in `@/lib/data/*-client.ts`.
  - **Transformation:** Always transform Medusa API responses to template-compatible formats using `@/lib/util/transform-*.ts`.
- **Hooks:** Custom hooks in `src/hooks/` for state management and data fetching.
- **State Management:** Zustand and Jotai for global UI state; TanStack Query for server state.

## Localization (i18n)
- **Patterns:** SSR-ready i18next integration.
- **Server Components:** Use `getServerTranslations(locale, namespaces)` from `@/lib/i18n-server.ts`.
- **Client Components:** Use `useTranslation` from `react-i18next` within paths wrapped by `TransProvider`.
- **Locale Helper:** Always normalize `countryCode` parameter using `normalizeLocale(countryCode)`.

## Medusa Integration Rules
- Never call Medusa API directly in components; use functions from `src/lib/data/`.
- Maintain template UI consistency while mapping Medusa data fields.
- Use `LocalizedClientLink` for any internal navigation to preserve `countryCode` in URLs.
- HTTP client uses Axios with custom auth interceptor (`wiki` token prefix) in `src/lib/data/http.ts`.

## Middleware
- Localization middleware handles `countryCode` routing via `src/middleware.ts`.

## File Organization
- `src/app/`: App router pages and layouts under `[countryCode]` for localization.
- `src/components/`: Reusable UI components (grouped by feature).
- `src/modules/`: High-level business logic modules (Cart, Account, Checkout).
- `src/lib/data/`: Data access layer for Medusa API. Server functions in `*.ts`, client SDK wrappers in `*-client.ts`.
- `src/lib/util/`: Utility functions and data transformers (`transform-*.ts`).
- `src/hooks/`: React hooks for UI and data logic.
- `public/locales/`: Localization JSON files.

## Testing
No test framework is currently configured.

## Deployment
See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for complete deployment instructions to Railway, including:
- Railway project setup with PostgreSQL and Redis
- Environment variable configuration
- Database backup and restore procedures
- Code change workflow after deployment

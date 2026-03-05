# CLAUDE.md - Wonderhin E-commerce Storefront

## Project Overview
Wonderhin is a Next.js storefront based on a premium Themeforest template, customized to integrate with a Medusa v2 backend. It uses the App Router, TanStack Query for data fetching, and i18next for localization.

## Environment & Scripts
- **Manager:** npm / yarn
- **Dev:** `npm run dev` (uses Turbopack)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Next.js:** v15+ (App Router)
- **React:** v19
- **Medusa SDK:** `@medusajs/js-sdk` v2

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

## File Organization
- `src/app/`: App router pages and layouts.
- `src/components/`: Reusable UI components.
- `src/modules/`: High-level business logic modules (Cart, Account, Checkout).
- `src/lib/data/`: Data access layer for Medusa API.
- `src/lib/util/`: Utility functions and data transformers.
- `src/hooks/`: React hooks for UI and data logic.
- `public/locales/`: Localization JSON files.

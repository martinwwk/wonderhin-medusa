# AGENTS.md - Wonderhin Medusa Project

This document provides guidance for AI agents working in this repository.

## Project Overview

Wonderhin Medusa is a monorepo e-commerce project with two main applications:
- **Backend**: Medusa v2 (Node.js/TypeScript commerce engine)
- **Storefront**: Next.js 16 with React 19 (App Router)

## Project Structure

```
wonderhin-medusa/
├── package.json          # Root monorepo config (yarn workspaces)
├── backend/              # Medusa v2 backend
│   ├── src/
│   │   ├── api/         # Custom API routes
│   │   ├── modules/     # Custom Medusa modules
│   │   ├── workflows/   # Medusa workflows
│   │   ├── links/       # Entity links
│   │   ├── subscribers/ # Event subscribers
│   │   └── jobs/        # Scheduled jobs
│   └── medusa-config.ts
└── storefront/          # Next.js storefront
    └── src/
        ├── app/         # App Router pages (localized under [countryCode])
        ├── components/  # Reusable UI components
        ├── modules/    # Business logic modules (Cart, Account, etc.)
        ├── lib/        # Utilities, data layer, hooks
        └── hooks/      # Custom React hooks
```

---

## Commands

### Backend (Medusa)

| Command | Description |
|---------|-------------|
| `yarn install:all` | Install all dependencies |
| `yarn dev` | Start Medusa development server |
| `yarn build` | Build Medusa application |
| `yarn start` | Start production server |
| `yarn seed` | Seed database with sample data |

**Testing (Backend):**

| Command | Description |
|---------|-------------|
| `yarn test:unit` | Run unit tests |
| `yarn test:integration:http` | Run HTTP integration tests |
| `yarn test:integration:modules` | Run module integration tests |

**Single Test (Backend):**
```bash
# Run a single test file
cd backend
NODE_OPTIONS=--experimental-vm-modules jest path/to/test.spec.ts --runInBand

# Run a specific test
NODE_OPTIONS=--experimental-vm-modules jest path/to/test.spec.ts -t "test name" --runInBand
```

**Docker (Backend):**
| Command | Description |
|---------|-------------|
| `yarn docker:up` | Start PostgreSQL, Redis, and Medusa containers |
| `yarn docker:down` | Stop all containers |

### Storefront (Next.js)

| Command | Description |
|---------|-------------|
| `yarn dev` | Start Next.js dev server (Turbopack) |
| `yarn build` | Build Next.js application |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgres://postgres:postgres@localhost:5433/medusa-store?sslmode=disable
REDIS_URL=redis://localhost:6380
MEDUSA_ADMIN_NEXT_AUTH_SECRET=...
```

### Storefront
Create `.env.local` with Next.js and Medusa SDK configuration.

---

## Code Style Guidelines

### TypeScript
- **Always use TypeScript** - No plain JavaScript files
- **Enable strict mode** - All projects have `"strict": true`
- **Avoid `any`** - Use proper types or `unknown` with type guards

### Backend (Medusa)

**Import Patterns:**
```typescript
// Medusa framework imports
import { MedusaService, Module } from "@medusajs/framework/utils"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Module imports
import Brand from "./models/brand"
import BrandModuleService from "./service"
```

**Naming Conventions:**
- Models: `PascalCase` (e.g., `Brand`, `CategoryImage`)
- Services: `PascalCase` with `Service` suffix (e.g., `BrandModuleService`)
- Routes/Workflows: `kebab-case` for files, `PascalCase` for exports

**Models (Medusa):**
```typescript
import { model } from "@medusajs/framework/utils"

const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text().translatable(),
})

export default Brand
```

**Services:**
```typescript
import { MedusaService } from "@medusajs/framework/utils"
import Brand from "./models/brand"

class BrandModuleService extends MedusaService({
  Brand,
}) {
  // Custom methods here
}

export default BrandModuleService
```

### Storefront (Next.js)

**Path Aliases:**
```typescript
// Use these instead of relative paths
import { formatPrice } from "@/lib/util/use-price"
import Input from "@modules/common/components/input"
import { useCart } from "@/hooks/use-cart"
```

**Components:**
- Use `PascalCase` for component files and exports
- Use `index.tsx` as barrel file for component folders
- Use `classnames` (imported as `cn`) for conditional classes

**Data Fetching:**
- **Server Components**: Use functions from `@/lib/data/*` with Next.js caching
- **Client Components**: Use TanStack Query with Medusa SDK scripts in `@/lib/data/*-client.ts`
- **Never call Medusa API directly in components** - Always use the data layer

**State Management:**
- **Server State**: TanStack Query
- **UI State**: Zustand (global), Jotai (atomic)

**Localization:**
- Server: `getServerTranslations(locale, namespaces)` from `@/lib/i18n-server.ts`
- Client: `useTranslation` from `react-i18next`
- Use `LocalizedClientLink` for internal navigation (preserves `countryCode`)

**Styling:**
- Tailwind CSS 4.0+
- Use `@apply` sparingly - prefer utility classes
- Use `cn()` helper for conditional class logic

---

## Testing Patterns

### Backend Tests
- Location: `src/**/__tests__/**/*.spec.ts` or `integration-tests/`
- Naming: `*.spec.ts` or `*.unit.spec.ts`
- Framework: Jest with @swc/jest

### Storefront Tests
- Use Playwright for E2E testing (see project for details)
- Follow existing component test patterns

---

## Medusa Integration Rules

1. **Never call Medusa API directly in storefront components** - Use `src/lib/data/*` functions
2. **Use validators for API route input** - Define with `@medusajs/framework/zod`
3. **Use workflows for complex operations** - Encapsulate business logic
4. **Create custom modules** for domain-specific functionality
5. **Use links** for entity relationships across modules

---

## Error Handling

- **Backend**: Use Medusa's error handling patterns with `MedusaError`
- **Storefront**: Handle errors gracefully with error boundaries and user feedback
- **Always log errors** with appropriate context for debugging

---

## Database (Docker)

PostgreSQL runs on port **5433** (to avoid conflicts)
Redis runs on port **6380** (to avoid conflicts)

Backup/Restore:
```bash
# Backup
docker exec medusa_postgres pg_dump -U postgres -d medusa-store > backup.sql

# Restore
docker exec -it medusa_postgres psql -U postgres -c "DROP DATABASE IF EXISTS \"medusa-store\";"
docker exec -it medusa_postgres psql -U postgres -c "CREATE DATABASE \"medusa-store\";"
docker exec -i medusa_postgres psql -U postgres -d medusa-store < backup.sql
```

---

## Key Dependencies

### Backend
- `@medusajs/medusa`: 2.13.1
- `@medusajs/framework`: 2.13.1
- `@medusajs/cli`: 2.13.1
- TypeScript: 5.6.2

### Storefront
- `next`: 16.1.6
- `react`: 19.1.0
- `@medusajs/js-sdk`: 2.13.1
- `@tanstack/react-query`: 5.79.2
- `tailwindcss`: 4.1.8
- `zustand`: 5.0.5

---

## Development Notes

1. Start Docker containers before running backend: `yarn docker:up`
2. Run migrations after schema changes: `npx medusa db:migrate`
3. Generate migrations: `npx medusa db:generate <module-name>`
4. The storefront uses the Medusa SDK to communicate with the backend
5. Both backend and storefront must be running for full functionality

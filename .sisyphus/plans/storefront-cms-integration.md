# Storefront Refactoring & CMS Integration Plan

## TL;DR

> **Quick Summary**: Refactor the storefront to cleanly separate theme components from Medusa commerce modules, extend the existing CMS module to manage blog posts and static pages, and create the About Us, Contact Us, and Blog pages using the Themeforest template components.

> **Deliverables**:
> - Clean folder structure with `src/components/` (theme UI) and `src/modules/` (commerce)
> - Extended CMS module in backend with blog posts and pages content types
> - Frontend data layer connecting to CMS
> - New pages: Blog listing, Blog post, About Us, Contact Us
> - Admin UI extensions for CMS content management

> **Estimated Effort**: Medium-Large
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Backend CMS Model → Frontend Data Layer → Pages

---

## Context

### Original Request
User has a hybrid storefront:
- **Themeforest template**: UI components in `src/components/` (blog, contact, brand, etc.)
- **Medusa official template**: Commerce modules in `src/modules/` (cart, account, checkout)
- **Backend**: Medusa v2 with custom cms module already exists

User wants to:
1. Clean up and organize the hybrid structure
2. Add CMS features (Blog, About, Contact) using Medusa Admin
3. NOT use `@medusajs/ui` (not installed in frontend)
4. Keep existing theme components

### Interview Summary
**Key Decisions**:
- Content managed via Medusa Admin (extend existing cms module)
- Theme components stay in `src/components/`
- Medusa commerce modules stay in `src/modules/`
- No external CMS (Strapi/Contentful)

### Metis Review
**Identified Gaps** (addressed):
- Need clear boundary between theme components and custom components
- CMS module needs proper data model defined
- Admin extensions needed for content management
- Data fetching pattern must match existing Medusa integration patterns

---

## Work Objectives

### Core Objective
Create a well-organized storefront with CMS capabilities for blog and static pages, managed entirely through Medusa Admin.

### Concrete Deliverables
1. **Backend CMS Module Extension** - Add BlogPost and Page content types
2. **Backend API Routes** - CRUD endpoints for CMS content
3. **Frontend Data Layer** - `lib/data/cms.ts` and `lib/data/cms-client.ts`
4. **Frontend Transform Utilities** - Transform Medusa response to theme format
5. **Page Templates** - Blog listing, blog post, about, contact pages
6. **Admin Extensions** - UI for managing CMS content in Medusa Admin

### Definition of Done
- [ ] Blog listing page shows posts from CMS
- [ ] Blog post page renders with theme component
- [ ] About Us page renders static content
- [ ] Contact page has working form component
- [ ] All content manageable via Medusa Admin
- [ ] No `@medusajs/ui` imports in frontend

### Must Have
- Clean separation between theme components and custom code
- All CMS content managed via Medusa Admin
- Mobile-responsive pages
- Proper TypeScript types

### Must NOT Have
- `@medusajs/ui` imports in frontend
- Direct database access from frontend
- Hardcoded content in pages

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO (frontend has no test framework)
- **Automated tests**: NONE
- **QA Method**: Agent-Executed manual verification

### QA Policy
Every task includes agent-executed verification steps.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation - 3 tasks):
├── Task 1: Define CMS data models in backend
├── Task 2: Create CMS API routes in backend
└── Task 3: Create frontend data layer (lib/data/cms.ts)

Wave 2 (Integration - 4 tasks):
├── Task 4: Add transform utilities for CMS content
├── Task 5: Create Blog listing page
├── Task 6: Create Blog post page ([slug])
└── Task 7: Create About Us page

Wave 3 (Pages + Admin - 3 tasks):
├── Task 8: Create Contact Us page
├── Task 9: Create Medusa Admin extensions for CMS
└── Task 10: Final integration and verification
```

### Dependency Matrix
- **1**: — — 2
- **2**: 1 — 3
- **3**: 2 — 4, 5, 6, 7
- **4**: 3 — 5, 6
- **5**: 3, 4 — 10
- **6**: 3, 4 — 10
- **7**: 3 — 10
- **8**: 7 — 10
- **9**: 1 — 10
- **10**: 5, 6, 7, 8, 9 — (complete)

---

## TODOs

- [ ] 1. Define CMS Data Models in Backend

  **What to do**:
  - Extend existing `backend/src/modules/cms` module
  - Add `BlogPost` model: title, slug, content (markdown/HTML), excerpt, featuredImage, author, publishedAt, status
  - Add `Page` model: title, slug, content, status
  - Run migration: `npx medusa db:generate cms`
  - Run migration: `npx medusa db:migrate`

  **Must NOT do**:
  - Don't remove existing cms module functionality
  - Don't change existing product/category models

  **Recommended Agent Profile**:
  > - **Category**: `deep` - Requires understanding Medusa module architecture
  >   - Reason: Creating Medusa data models requires proper module structure
  > - **Skills**: []
  > - **Skills Evaluated but Omitted**:
  >   - `playwright`: Not needed for backend model work

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 2, 3
  - **Blocked By**: None

  **References**:
  - `backend/src/modules/brand/models/brand.ts` - Example model definition
  - `backend/src/modules/category-image/models/category-image.ts` - Another model example
  - Official docs: `https://docs.medusajs.com/modules/entities/models`

  **Acceptance Criteria**:
  - [ ] BlogPost model defined in `backend/src/modules/cms/models/blog-post.ts`
  - [ ] Page model defined in `backend/src/modules/cms/models/page.ts`
  - [ ] Migration files generated
  - [ ] Migration applied to database

  **Commit**: YES (Wave 1)
  - Message: `feat(backend): add CMS data models for blog and pages`
  - Files: `backend/src/modules/cms/models/`

- [ ] 2. Create CMS API Routes in Backend

  **What to do**:
  - Create API routes for CMS content:
    - `GET /store/cms/blog-posts` - List published blog posts
    - `GET /store/cms/blog-posts/[slug]` - Get single blog post
    - `GET /store/cms/pages/[slug]` - Get static page
    - `POST /admin/cms/blog-posts` - Create blog post (admin only)
    - `PUT /admin/cms/blog-posts/[id]` - Update blog post (admin only)
    - `DELETE /admin/cms/blog-posts/[id]` - Delete blog post (admin only)
    - Same for Pages
  - Use Zod validators for input validation
  - Follow existing API route patterns from `backend/src/api/`

  **Must NOT do**:
  - Don't expose internal fields (draft status to public)
  - Don't add authentication to public routes

  **Recommended Agent Profile**:
  > - **Category**: `deep` - API route creation with Medusa patterns
  >   - Reason: Need to follow Medusa API route conventions and validators

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:
  - `backend/src/api/admin/brands/route.ts` - Example admin route
  - `backend/src/api/admin/brands/validators.ts` - Example validator
  - `backend/src/api/store/custom/route.ts` - Example store route

  **Acceptance Criteria**:
  - [ ] Store API routes return only published content
  - [ ] Admin API routes have full CRUD
  - [ ] Zod validators defined
  - [ ] Routes follow Medusa conventions

  **Commit**: YES (Wave 1)
  - Message: `feat(backend): add CMS API routes`
  - Files: `backend/src/api/admin/cms/`, `backend/src/api/store/cms/`

- [ ] 3. Create Frontend Data Layer

  **What to do**:
  - Create `storefront/src/lib/data/cms.ts` (server-side fetching)
  - Create `storefront/src/lib/data/cms-client.ts` (client-side with SDK)
  - Define TypeScript types matching backend models
  - Follow existing patterns from `lib/data/products.ts`, `lib/data/collections.ts`

  **Must NOT do**:
  - Don't call Medusa API directly in components (use this data layer)
  - Don't duplicate types - share via `@/types/cms`

  **Recommended Agent Profile**:
  > - **Category**: `unspecified-high` - TypeScript + data fetching
  >   - Reason: Need to match existing patterns and types

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 4, 5, 6, 7
  - **Blocked By**: Task 2

  **References**:
  - `storefront/src/lib/data/products.ts` - Server fetching pattern
  - `storefront/src/lib/data/products-client.ts` - Client SDK pattern
  - `storefront/src/types/index.ts` - Type definitions

  **Acceptance Criteria**:
  - [ ] `lib/data/cms.ts` has functions: getBlogPosts, getBlogPost, getPage
  - [ ] `lib/data/cms-client.ts` has corresponding client functions
  - [ ] TypeScript types defined in `@/types/cms`
  - [ ] Functions return data in theme-compatible format

  **Commit**: YES (Wave 1)
  - Message: `feat(storefront): add CMS data layer`
  - Files: `storefront/src/lib/data/cms.ts`, `storefront/src/lib/data/cms-client.ts`, `storefront/src/types/cms.ts`

- [ ] 4. Add Transform Utilities for CMS Content

  **What to do**:
  - Create `storefront/src/lib/util/transform-cms.ts`
  - Transform Medusa API response to theme component format
  - Handle markdown/HTML content, image URLs, dates
  - Similar to existing transform utilities

  **Must NOT do**:
  - Don't add new dependencies (use existing libs)

  **Recommended Agent Profile**:
  > - **Category**: `quick` - Simple utility transformation
  > - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 5, 6
  - **Blocked By**: Task 3

  **References**:
  - `storefront/src/lib/util/transform-products.ts` - Example transform
  - `storefront/src/lib/util/use-price.tsx` - Price formatting utility

  **Acceptance Criteria**:
  - [ ] Transform utility handles blog post data
  - [ ] Transform utility handles page data
  - [ ] Date formatting consistent with storefront
  - [ ] Image URLs properly resolved

  **Commit**: YES (Wave 2)
  - Message: `feat(storefront): add CMS transform utilities`
  - Files: `storefront/src/lib/util/transform-cms.ts`

- [ ] 5. Create Blog Listing Page

  **What to do**:
  - Create `storefront/src/app/[countryCode]/blog/page.tsx`
  - Use existing theme component from `src/components/blog/` if available
  - Fetch blog posts via `lib/data/cms.ts`
  - Implement pagination if needed
  - Follow existing page patterns from `app/[countryCode]/collections/`

  **Must NOT do**:
  - Don't use `@medusajs/ui` components
  - Don't hardcode blog posts

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering` - UI page creation
  >   - Reason: Creating new page with theme components

  **Parallelization**:
  - **Can Run In Parallel**: YES (with 6, 7)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 10
  - **Blocked By**: Task 3, 4

  **References**:
  - `storefront/src/app/[countryCode]/collections/page.tsx` - Page pattern
  - `storefront/src/components/blog/` - Theme blog components
  - `storefront/src/modules/store/templates/paginated-products.tsx` - Listing pattern

  **QA Scenarios**:

  Scenario: Blog listing page loads successfully
    Tool: Bash
    Preconditions: Backend running, CMS has blog posts
    Steps:
      1. curl "http://localhost:3000/us/blog"
      2. Assert: 200 status code
      3. Assert: HTML contains blog post titles
    Expected Result: Page renders with blog posts
    Failure Indicators: 404, 500, empty content
    Evidence: `.sisyphus/evidence/task-5-blog-listing.html`

  **Acceptance Criteria**:
  - [ ] Page renders at `/[countryCode]/blog`
  - [ ] Shows list of published blog posts
  - [ ] Uses theme component styling
  - [ ] Mobile responsive
  - [ ] SEO meta tags added

  **Commit**: YES (Wave 2)
  - Message: `feat(storefront): add blog listing page`
  - Files: `storefront/src/app/[countryCode]/blog/page.tsx`

- [ ] 6. Create Blog Post Page

  **What to do**:
  - Create `storefront/src/app/[countryCode]/blog/[slug]/page.tsx`
  - Fetch single blog post by slug
  - Render content using theme component
  - Add related posts section if time permits
  - Handle 404 for non-existent slugs

  **Must NOT do**:
  - Don't expose draft posts to public

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering` - UI page with dynamic route
  > - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with 5, 7)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 10
  - **Blocked By**: Task 3, 4

  **References**:
  - `storefront/src/app/[countryCode]/collections/[handle]/page.tsx` - Dynamic route pattern
  - `storefront/src/components/blog/post/` - Theme post component

  **QA Scenarios**:

  Scenario: Blog post page loads with content
    Tool: Bash
    Preconditions: Backend running, CMS has blog post with slug "test-post"
    Steps:
      1. curl "http://localhost:3000/us/blog/test-post"
      2. Assert: 200 status code
      3. Assert: HTML contains post title and content
    Expected Result: Full blog post renders
    Failure Indicators: 404 for existing post
    Evidence: `.sisyphus/evidence/task-6-blog-post.html`

  Scenario: Non-existent slug returns 404
    Tool: Bash
    Preconditions: None
    Steps:
      1. curl "http://localhost:3000/us/blog/non-existent"
      2. Assert: 404 status code
    Expected Result: Proper 404 page
    Evidence: `.sisyphus/evidence/task-6-blog-404.html`

  **Acceptance Criteria**:
  - [ ] Page renders at `/[countryCode]/blog/[slug]`
  - [ ] Shows full blog post content
  - [ ] Featured image displays
  - [ ] Author and date shown
  - [ ] 404 for non-existent slugs

  **Commit**: YES (Wave 2)
  - Message: `feat(storefront): add blog post page`
  - Files: `storefront/src/app/[countryCode]/blog/[slug]/page.tsx`

- [ ] 7. Create About Us Page

  **What to do**:
  - Create `storefront/src/app/[countryCode]/about/page.tsx`
  - Fetch "about" page content from CMS
  - Use existing theme about component if available
  - Add hero section, team section, values section
  - Allow mixing static and CMS content

  **Must NOT do**:
  - Don't hardcode all content

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering` - Static content page
  > - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with 5, 6, 8)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:
  - `storefront/src/app/[countryCode]/page.tsx` - Homepage pattern
  - `storefront/src/components/about/` - Theme about components

  **QA Scenarios**:

  Scenario: About page loads with content
    Tool: Bash
    Preconditions: Backend running, CMS has "about" page
    Steps:
      1. curl "http://localhost:3000/us/about"
      2. Assert: 200 status code
      3. Assert: HTML contains about content
    Expected Result: About page renders
    Evidence: `.sisyphus/evidence/task-7-about.html`

  **Acceptance Criteria**:
  - [ ] Page renders at `/[countryCode]/about`
  - [ ] Content from CMS displays
  - [ ] Theme styling applied
  - [ ] Mobile responsive

  **Commit**: YES (Wave 2)
  - Message: `feat(storefront): add about us page`
  - Files: `storefront/src/app/[countryCode]/about/page.tsx`

- [ ] 8. Create Contact Us Page

  **What to do**:
  - Create `storefront/src/app/[countryCode]/contact/page.tsx`
  - Use existing theme contact component
  - Add contact form with validation
  - Form submission can email admin or save to CMS
  - Include map, address, phone, email info

  **Must NOT do**:
  - Don't use `@medusajs/ui` components

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering` - Form and content page
  > - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with 5, 6, 7)
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 10
  - **Blocked By**: Task 7

  **References**:
  - `storefront/src/components/contact/` - Theme contact components
  - `storefront/src/modules/account/components/login/` - Form pattern

  **QA Scenarios**:

  Scenario: Contact page renders with form
    Tool: Bash
    Preconditions: Backend running
    Steps:
      1. curl "http://localhost:3000/us/contact"
      2. Assert: 200 status code
      3. Assert: HTML contains contact form
    Expected Result: Contact page with form renders
    Evidence: `.sisyphus/evidence/task-8-contact.html`

  Scenario: Contact form validates input
    Tool: Playwright (via skill)
    Preconditions: Page loaded
    Steps:
      1. Navigate to /us/contact
      2. Click submit without filling
      3. Assert: Validation errors show
    Expected Result: Client-side validation works
    Evidence: `.sisyphus/evidence/task-8-contact-validation.png`

  **Acceptance Criteria**:
  - [ ] Page renders at `/[countryCode]/contact`
  - [ ] Contact form with name, email, message fields
  - [ ] Client-side validation
  - [ ] Form submission handler
  - [ ] Contact info (address, phone, email)

  **Commit**: YES (Wave 3)
  - Message: `feat(storefront): add contact us page`
  - Files: `storefront/src/app/[countryCode]/contact/page.tsx`, `storefront/src/app/api/contact/route.ts`

- [ ] 9. Create Medusa Admin Extensions for CMS

  **What to do**:
  - Create admin UI extensions for managing CMS content
  - Add sidebar links: Blog Posts, Pages
  - Create list views for blog posts and pages
  - Create detail/edit views
  - Follow existing admin extension patterns in `backend/src/admin/`

  **Must NOT do**:
  - Don't modify core Medusa admin files
  - Don't break existing admin functionality

  **Recommended Agent Profile**:
  > - **Category**: `visual-engineering` - Admin UI extension
  >   - Reason: Creating admin UI with React

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 10
  - **Blocked By**: Task 1

  **References**:
  - `backend/src/admin/` - Existing admin extensions
  - Official docs: `https://docs.medusajs.com/admin/extensions`

  **QA Scenarios**:

  Scenario: Admin can create blog post
    Tool: Playwright (via skill)
    Preconditions: Admin logged in
    Steps:
      1. Navigate to Medusa Admin
      2. Click "Blog Posts" in sidebar
      3. Click "Create" button
      4. Fill form: title, slug, content
      5. Click "Save"
      6. Assert: Post appears in list
    Expected Result: Blog post created successfully
    Evidence: `.sisyphus/evidence/task-9-admin-create.png`

  **Acceptance Criteria**:
  - [ ] "Blog Posts" menu item in admin sidebar
  - [ ] "Pages" menu item in admin sidebar
  - [ ] List view shows all blog posts/pages
  - [ ] Create/Edit form works
  - [ ] Delete functionality works

  **Commit**: YES (Wave 3)
  - Message: `feat(backend): add CMS admin extensions`
  - Files: `backend/src/admin/` (cms extensions)

- [ ] 10. Final Integration and Verification

  **What to do**:
  - Test all pages work together
  - Verify mobile responsiveness
  - Check SEO meta tags
  - Verify all links work
  - Test admin content appears on frontend

  **Must NOT do**:
  - Don't leave any TODO comments

  **Recommended Agent Profile**:
  > - **Category**: `unspecified-high` - Integration testing
  > - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocked By**: Tasks 5, 6, 7, 8, 9

  **QA Scenarios**:

  Scenario: Full navigation flow
    Tool: Playwright (via skill)
    Preconditions: All content created in admin
    Steps:
      1. Visit homepage
      2. Navigate to Blog
      3. Click a blog post
      4. Navigate to About
      5. Navigate to Contact
      6. Assert: All pages load without errors
    Expected Result: Complete navigation works
    Evidence: `.sisyphus/evidence/task-10-navigation.png`

  Scenario: Mobile responsive
    Tool: Playwright (via skill)
    Preconditions: None
    Steps:
      1. Set viewport to 375x667 (mobile)
      2. Visit each new page
      3. Assert: No horizontal scroll
      4. Assert: All elements visible
    Expected Result: Mobile-friendly
    Evidence: `.sisyphus/evidence/task-10-mobile.png`

  **Acceptance Criteria**:
  - [ ] All pages accessible and rendering
  - [ ] Mobile responsive
  - [ ] Admin-created content shows on frontend
  - [ ] No console errors
  - [ ] All links work correctly

  **Commit**: YES
  - Message: `chore: complete CMS integration`
  - Files: (all changes)

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Verify all deliverables from plan exist. Check each "Must Have" was implemented.

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `yarn build` for both frontend and backend. Check for TypeScript errors.

- [ ] F3. **Real Manual QA** — `unspecified-high`
  Test all new pages in browser. Verify content from admin appears correctly.

- [ ] F4. **Scope Fidelity Check** — `deep`
 extra features beyond scope. Check no  Verify no `@medusajs/ui` imports.

---

## Commit Strategy

- **Wave 1**: `feat(backend): add CMS data models for blog and pages`
- **Wave 1**: `feat(backend): add CMS API routes`
- **Wave 1**: `feat(storefront): add CMS data layer`
- **Wave 2**: `feat(storefront): add CMS transform utilities`
- **Wave 2**: `feat(storefront): add blog listing page`
- **Wave 2**: `feat(storefront): add blog post page`
- **Wave 2**: `feat(storefront): add about us page`
- **Wave 3**: `feat(storefront): add contact us page`
- **Wave 3**: `feat(backend): add CMS admin extensions`
- **Final**: `chore: complete CMS integration`

---

## Success Criteria

### Verification Commands
```bash
# Backend
cd backend && yarn build

# Frontend
cd storefront && yarn build

# API test
curl http://localhost:9000/store/cms/blog-posts
curl http://localhost:9000/store/cms/pages/about
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] No `@medusajs/ui` imports in frontend
- [ ] All pages accessible
- [ ] Admin can manage CMS content

# Category Filter Integration

## Overview

Integrated Medusa product categories into the storefront's filter sidebar with hierarchical parent/child selection, slug-aware sub-category filtering, and i18n support. The filter sidebar now shows real category data from Medusa instead of hardcoded placeholder data.

## Architecture

### Data Flow

```
Medusa API (/store/product-categories)
    ↓  parent_category_id=null & include_descendants_tree=true
listTopLevelCategories() / listTopLevelCategoriesClient()
    ↓
useCategories() hook (React Query, key: ["categories", "top-level"])
    ↓
categoriesToFilterOptions() — transforms Category[] → CategoryOption[]
    ↓
<Filters categories={...} onCategoryChange={...} />
    ↓
<CategoriesFilter> — renders parent/child checkboxes
    ↓
collectSelectedIds() — extracts leaf-node IDs for API filtering
    ↓
useProductsQuery({ categoryIds: [...] }) or useMoreProductsQuery({ categoryIds: [...] })
    ↓
Medusa API (/store/products?category_id[]=id1&category_id[]=id2)
```

### Key Concept: Leaf-Node Filtering

Medusa's `category_id` filter accepts an array and uses OR logic. When filtering products:
- Only **leaf-node** (sub-category) IDs are sent to the API
- If a parent has children, its own ID is never sent — only its selected children's IDs
- If a category has no children (is itself a leaf), its ID is sent directly

This is implemented in `collectSelectedIds()` in `src/components/filter/filters.tsx`.

## Files Modified / Created

### Server-Side Data Fetching

| File | Change |
|------|--------|
| `src/lib/data/categories.ts` | Added `listTopLevelCategories()` using `parent_category_id: "null"` + `include_descendants_tree: true` |
| `src/lib/data/categories-client.ts` | Added `listTopLevelCategoriesClient()` (client-safe mirror) |

### Hooks

| File | Change |
|------|--------|
| `src/hooks/use-categories.ts` | Uses `listTopLevelCategoriesClient` with queryKey `["categories", "top-level"]` |
| `src/hooks/use-all-products.ts` | Added `categoryIds?: string[]` option — passes as `queryParams.category_id` |
| `src/hooks/use-all-more-products.ts` | Same `categoryIds` support for infinite scroll |
| `src/hooks/use-filter-hooks.ts` | Added `handleBatchFilterChange(section, updates)` for toggling parent + all children at once |

### Filter Components

| File | Change |
|------|--------|
| `src/components/filter/filters.tsx` | Accepts `categories` and `onCategoryChange` props. Contains `collectSelectedIds()` for leaf-node extraction and `handleParentToggle()` for batch parent+children updates |
| `src/components/filter/facets/categories-filter.tsx` | Hierarchical checkbox UI with `getParentState()` for indeterminate logic and `onParentToggle` callback |
| `src/components/filter/filter-sidebar.tsx` | Passes through `categories` and `onCategoryChange` props |
| `src/components/filter/drawer-filter.tsx` | Same prop passthrough for mobile drawer |
| `src/components/filter/horizontal-filter.tsx` | Accepts dynamic categories instead of hardcoded data |
| `src/components/shared/form/checkbox.tsx` | Added `indeterminate?: boolean` prop — shows `Minus` icon (Gmail-style) |

### Page Components

| File | Change |
|------|--------|
| `src/app/[countryCode]/(default)/category/category-content.tsx` | Fetches categories via `useCategories()`, transforms to `CategoryOption[]`, manages `selectedCategoryIds` state, passes to `useMoreProductsQuery` |
| `src/app/[countryCode]/(default)/category/[slug]/page-content.tsx` | **Slug-aware**: finds matching parent by slug, shows only its sub-categories as filters, pre-selects all sub-categories on load |
| `src/app/[countryCode]/(default)/categories/page.tsx` | Uses `listTopLevelCategories` |
| `src/app/[countryCode]/(default)/categories/[slug]/page.tsx` | Uses `listTopLevelCategories` |

### i18n

| File | Change |
|------|--------|
| `public/locales/category-names.json` | Translation map: `{ "en": { "Bags": "Bags", ... }, "zh-TW": { "Bags": "包包", ... } }` |
| `src/lib/util/translate-category.ts` | `translateCategoryName(name, locale)` — looks up translation, falls back to original name |
| `src/components/category/category-sub.tsx` | Uses `translateCategoryName` for carousel display |
| `src/components/category/category-listing.tsx` | Uses `translateCategoryName` for grid display |

## Parent/Child Checkbox Behavior

### Indeterminate State (Gmail-style)

The `Checkbox` component (`src/components/shared/form/checkbox.tsx`) supports three visual states:

| State | Icon | Condition |
|-------|------|-----------|
| Unchecked | Empty | Not selected |
| Checked | ✓ (Check) | Selected |
| Indeterminate | — (Minus) | Some but not all children selected |

### Selection Logic

Implemented in `CategoriesFilter` (`src/components/filter/facets/categories-filter.tsx`):

```typescript
function getParentState(parent: CategoryOption, selected: Record<string, boolean>) {
  const children = parent.subCategories || [];
  if (children.length === 0) {
    return { checked: !!selected[parent.id], indeterminate: false };
  }
  const selectedCount = children.filter((c) => selected[c.id]).length;
  return {
    checked: selectedCount === children.length,          // all selected
    indeterminate: selectedCount > 0 && selectedCount < children.length, // partial
  };
}
```

### Parent Toggle Behavior

When clicking a parent checkbox:
- **If not all children are selected** → select all children (and the parent)
- **If all children are already selected** → deselect all children (and the parent)

This is handled by `handleParentToggle()` in `filters.tsx`, which uses `handleBatchFilterChange()` from the `useFilters` hook to update all checkboxes atomically.

## Slug-Aware Sub-Category Filtering

When navigating to `/category/[slug]` (e.g., `/category/bags`):

1. `useCategories()` fetches all top-level categories with their children
2. `getSubCategoryFilterForSlug()` finds the parent matching the slug
3. If the parent has children, only those children are shown as filter options
4. All sub-categories are **pre-selected on initial load** (since browsing a parent means viewing all its products)
5. Users can then uncheck specific sub-categories to narrow results
6. Product queries use only the selected sub-category IDs

**Fallback**: If the slug matches a leaf category (no children), all root categories are shown as filters instead.

## Medusa API Patterns

### Fetching Top-Level Categories with Children

```typescript
const { product_categories } = await sdk.client.fetch<{
  product_categories: StoreProductCategory[];
}>(`/store/product-categories`, {
  query: {
    parent_category_id: "null",           // only root categories
    include_descendants_tree: true,       // include nested children
    fields: "+category_children,+products",
  },
});
```

### Filtering Products by Multiple Categories

```typescript
const { products } = await sdk.client.fetch<{
  products: StoreProduct[];
}>(`/store/products`, {
  query: {
    category_id: ["pcid_1", "pcid_2", "pcid_3"],  // OR logic
    limit: 12,
    region_id: regionId,
  },
});
```

The `category_id` parameter accepts an array. Medusa returns products belonging to **any** of the specified categories (OR logic).

## Adding New Category Translations

To add translations for a new category:

1. Open `public/locales/category-names.json`
2. Add the English name as the key under each locale:

```json
{
  "en": {
    "New Category": "New Category"
  },
  "zh-TW": {
    "New Category": "新分類"
  }
}
```

The `translateCategoryName()` function matches by exact category name. If no translation is found, the original Medusa category name is used as-is.

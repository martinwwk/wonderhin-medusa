# Fix for Infinite Redirect Loop (zh-TW Issue)

## Problem

The application was experiencing an infinite loop when accessing routes with locale codes like `/zh-TW`:

```
GET /zh-TW 200 in 77ms
GET /zh-TW 200 in 70ms
GET /zh-TW 200 in 80ms
... (continues infinitely)
```

This also caused Turbopack crashes.

## Root Cause

**Locale codes vs Region IDs mismatch:**

- **Locale codes** (`zh-TW`, `en`) are used for **translations/i18n**
- **Region IDs** (`hk`, `us`) are used for **Medusa API** (pricing, inventory)
- The product/category hooks were incorrectly using locale codes as region IDs

When the hooks tried to fetch from Medusa using `zh-TW` as a region, the API failed, React Query kept retrying, and this triggered continuous page reloads.

## Solution

### 1. Created Locale-to-Region Mapping

**File:** `src/lib/util/locale-to-region.ts`

Maps locale codes to proper Medusa region IDs:

```typescript
'en' → 'hk'       // English uses HK region
'zh-TW' → 'hk'    // Traditional Chinese uses HK region  
'zh-tw' → 'hk'    // Case-insensitive
'zh' → 'hk'       // Simplified Chinese uses HK region
'hk' → 'hk'       // Direct mapping
// Add more as needed
```

### 2. Updated Product Hooks

**File:** `src/hooks/use-products.ts`

- Now uses `getRegionFromContext()` to convert locale → region
- Added aggressive retry controls:
  - `retry: 1` - Only retry once
  - `retryDelay: 2000` - Wait 2 seconds before retry
  - `refetchOnWindowFocus: false` - Don't refetch on focus
  - `refetchOnMount: false` - Don't refetch if data exists

### 3. Updated Category Hooks  

**File:** `src/hooks/use-categories.ts`

- Added same retry controls
- Prevents infinite refetching

### 4. Added Error Handling

**Files:** `src/lib/data/products-client.ts`, `src/lib/data/categories-client.ts`

- Added `.catch()` handlers that return empty arrays
- Prevents crashes on API failures
- Logs errors to console for debugging

## How It Works Now

```
URL: /zh-TW/
   ↓
Locale: 'zh-TW' (for i18n translations)
   ↓
Region Mapping: 'zh-TW' → 'hk'
   ↓
Medusa API: Uses region_id='hk'
   ↓
Products/Categories fetched successfully
```

## Configuration

To add more locales/regions, edit `src/lib/util/locale-to-region.ts`:

```typescript
const LOCALE_TO_REGION_MAP: Record<string, string> = {
  'en': 'hk',
  'zh-TW': 'hk',
  'ja': 'jp',      // Japanese → Japan region
  'ko': 'kr',      // Korean → Korea region
  'fr': 'eu',      // French → EU region
  // Add more mappings...
}
```

## Testing

1. Clear browser cache and cookies
2. Visit `http://localhost:8000/zh-TW`
3. Should load without infinite loops
4. Check console for any API errors
5. Products and categories should display

## What Changed

✅ Locale codes properly mapped to region IDs  
✅ Aggressive retry limits on React Query  
✅ Error boundaries on API calls  
✅ Window focus refetch disabled  
✅ Component remount refetch disabled  
✅ Console logging for debugging  

## Prevention

The system now clearly separates:

- **Locale codes** - Used by middleware, i18n, translations
- **Region IDs** - Used by Medusa API for commerce operations

This prevents mixing the two concepts and causing API failures.

## If Issues Persist

1. **Check Medusa backend is running**
   ```bash
   curl http://localhost:9000/store/regions
   ```

2. **Verify region exists**
   - Region ID `hk` must exist in your Medusa backend
   - Create it in Medusa admin if missing

3. **Check browser Dev Tools**
   - Network tab for failed API calls
   - Console for error messages
   - Look for red Medusa API errors

4. **Clear all caches**
   ```bash
   rm -rf .next
   pnpm dev
   ```

5. **Check your .env**
   ```env
   MEDUSA_BACKEND_URL=http://localhost:9000
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
   NEXT_PUBLIC_DEFAULT_LOCALE=en
   ```

## Related Files Modified

- `src/lib/util/locale-to-region.ts` (new)
- `src/hooks/use-products.ts`
- `src/hooks/use-categories.ts`
- `src/lib/data/products-client.ts`
- `src/lib/data/categories-client.ts`

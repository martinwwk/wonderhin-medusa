# i18n SSR Integration - Migration Checklist

## ✅ Completed Steps

### 1. Core Infrastructure
- ✅ Created `[countryCode]/layout.tsx` - Initializes SSR i18n for all localized routes
- ✅ Updated `Nav` component to use `useTranslation` instead of `useClientTranslation`
- ✅ Created example components showing server and client patterns
- ✅ Created comprehensive documentation in `INTEGRATION_GUIDE.md`

### 2. Key Files Created/Updated

| File | Status | Purpose |
|------|--------|---------|
| `src/app/[countryCode]/layout.tsx` | ✅ Created | SSR i18n initialization with TransProvider |
| `src/modules/layout/templates/nav/index.tsx` | ✅ Updated | Example client component migration |
| `src/components/examples/ExampleServerComponent.tsx` | ✅ Created | Server component i18n pattern |
| `src/components/examples/ExampleClientComponent.tsx` | ✅ Created | Client component i18n pattern |
| `INTEGRATION_GUIDE.md` | ✅ Created | Full documentation |

## 🔄 Components to Migrate

Search and replace these patterns across your codebase:

### Replace Pattern 1: `useClientTranslation` → `useTranslation`

**Find:**
```typescript
import { useClientTranslation } from '@/lib/i18n';

const { t, ready } = useClientTranslation();
```

**Replace with:**
```typescript
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { normalizeLocale } from '@/lib/i18n-server';

const params = useParams();
const locale = normalizeLocale((params?.countryCode as string) || 'en');
const { t } = useTranslation('common', { lng: locale });
```

### Replace Pattern 2: `getServerTranslation` → `getServerTranslations`

**Find:**
```typescript
import { getServerTranslation } from '@/lib/server-i18n';

const text = getServerTranslation(locale, 'key');
```

**Replace with:**
```typescript
import { getServerTranslations } from '@/lib/i18n-server';

const { t } = await getServerTranslations(locale, ['common']);
const text = t('key');
```

## 📋 Files Needing Migration

Run these commands to find files using old patterns:

```bash
# Find components using old useClientTranslation
grep -r "useClientTranslation" src/ --include="*.tsx" --include="*.ts"

# Find components using old getServerTranslation
grep -r "getServerTranslation" src/ --include="*.tsx" --include="*.ts" | grep -v "getServerTranslations"

# Find direct i18n imports
grep -r "from '@/lib/i18n'" src/ --include="*.tsx" --include="*.ts"
grep -r "from '@lib/i18n'" src/ --include="*.tsx" --include="*.ts"
```

### Known Files to Update:

Based on code search, these files likely need updates:

1. **Client Components** (use `useTranslation` pattern):
   - Any component importing from `@/lib/i18n`
   - Components with `useClientTranslation` calls
   - Check: `src/modules/**/*.tsx`
   - Check: `src/components/**/*.tsx`
   - Check: `src/layouts/**/*.tsx`

2. **Server Components** (use `getServerTranslations` pattern):
   - `src/modules/common/components/cart-totals/index.tsx` (visible in search results)
   - Any page.tsx files that need translations
   - Any server components with `getServerTranslation` (singular)

## 🧪 Testing Steps

### 1. Verify Layout Integration
```bash
# Start dev server
pnpm dev

# Check these routes load without errors:
# - http://localhost:8000/en
# - http://localhost:8000/zh-TW
```

**Expected**: No React hydration errors, translations appear immediately

### 2. Check Browser Console
Open DevTools → Console, should see:
- ✅ No "useTranslation" errors
- ✅ No hydration mismatch warnings
- ✅ No i18next initialization errors

### 3. Test Locale Switching
1. Visit `/en` route
2. Change language to 中文 using locale selector
3. Should redirect to `/zh-TW`
4. Translations should update immediately
5. No page flickering or "loading" states

### 4. Test SSR (View Page Source)
```bash
# Right-click → View Page Source
# Search for translated text
```

**Expected**: Translated text visible in HTML source (not just in browser after JS loads)

## ⚠️ Critical Checks

### Check 1: Locale vs Region Separation
Verify all Medusa API calls use region IDs, not locale codes:

```bash
# Find potential issues
grep -r "listProducts.*params.*countryCode" src/ --include="*.ts"
grep -r "listCategories.*params.*countryCode" src/ --include="*.ts"
```

**Should use:**
```typescript
import { localeToRegion } from '@/lib/util/locale-to-region';

const regionId = localeToRegion(params?.countryCode);
const products = await listProducts(regionId);
```

### Check 2: TransProvider Wrapping
Ensure `[countryCode]/layout.tsx` wraps ALL content:

```tsx
// ✅ CORRECT: Everything wrapped
<TransProvider locale={locale} resources={resources} namespaces={['common']}>
  {children}  {/* All route content */}
</TransProvider>

// ❌ WRONG: Partial wrapping
<div>
  <Header />
  <TransProvider>{children}</TransProvider>
</div>
```

### Check 3: Async Params Handling
Next.js 15 requires awaiting params:

```typescript
// ✅ CORRECT
export default async function Page({ params }: PageProps) {
  const { countryCode } = await params;
  // ...
}

// ❌ WRONG (Next.js 14 style)
export default async function Page({ params }: PageProps) {
  const { countryCode } = params; // Missing await
  // ...
}
```

## 🚀 Next Steps After Migration

1. **Remove old i18n files** (after confirming everything works):
   - Consider deprecating `src/lib/i18n.ts` (old client-only approach)
   - Consider deprecating `src/lib/server-i18n.ts` (simple JSON imports)
   - Keep `i18n-server.ts`, `i18n-client-ssr.ts`, `i18n-provider.tsx`

2. **Add more namespaces** if needed:
   - Create `public/locales/en/products.json`
   - Create `public/locales/zh-TW/products.json`
   - Update layout to load multiple namespaces
   - Use in components: `useTranslation('products')`

3. **Consider adding translation keys type safety**:
   ```typescript
   // Generate types from JSON
   type TranslationKeys = keyof typeof import('../../public/locales/en/common.json');
   ```

4. **Performance optimization**:
   - Only load needed namespaces per route group
   - Consider code-splitting large translation files
   - Use dynamic imports for rarely-used translations

## 📊 Migration Progress Tracking

Create a checklist as you migrate:

- [ ] All client components use `useTranslation` with locale parameter
- [ ] All server components use `getServerTranslations`
- [ ] No files import from `@/lib/i18n` (old)
- [ ] No direct usage of `getServerTranslation` (singular)
- [ ] All routes under `/[countryCode]` work correctly
- [ ] Locale switching works without errors
- [ ] SSR shows translated content in HTML source
- [ ] No hydration mismatch warnings in console
- [ ] Medusa API calls use region IDs (not locale codes)
- [ ] Tests updated to handle new i18n pattern

## 🐛 Common Migration Issues

### Issue: "useTranslation hook not found"
**Solution**: Ensure component is client component with `'use client'` directive

### Issue: "t is not a function"
**Solution**: Check TransProvider wraps the route in [countryCode]/layout.tsx

### Issue: Translations not loading
**Solution**: Verify `resources` extraction in layout matches namespace usage

### Issue: Wrong locale displayed
**Solution**: Check `lng: locale` parameter in useTranslation hook

### Issue: Hydration errors
**Solution**: Ensure server and client use same locale normalization

## 💡 Tips

1. **Migrate incrementally**: Start with one route group, verify it works, then continue
2. **Test both locales**: Always test both `/en` and `/zh-TW` after changes
3. **Check console**: Keep browser DevTools open during testing
4. **Use TypeScript**: Let the compiler catch missing translations
5. **Document custom keys**: Keep README of all translation keys and their purposes

## ✅ Done!

Once all checklist items are complete, your i18n SSR integration is finished. Your app will have:
- ⚡ Instant translations (no loading state)
- 🔍 SEO-friendly translated content
- 💾 Smaller client bundles
- 🎯 Type-safe translations
- 🌐 Proper locale/region separation

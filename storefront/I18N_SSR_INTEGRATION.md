# i18n SSR Integration Summary

## ✅ What Was Done

Successfully integrated server-side i18n with client-side SSR hydration for your Next.js 15 + Medusa storefront.

## 🎯 Key Changes

### 1. Created Layout for SSR i18n Initialization
**File**: `src/app/[countryCode]/layout.tsx`

This layout:
- Wraps all `/[countryCode]/*` routes
- Loads translations on the server
- Hydrates translations to client via TransProvider
- Ensures no flash of untranslated content

### 2. Updated Navigation Component
**File**: `src/modules/layout/templates/nav/index.tsx`

Changed from:
```typescript
const { t, ready } = useClientTranslation();
```

To:
```typescript
const params = useParams();
const locale = normalizeLocale((params?.countryCode as string) || 'en');
const { t } = useTranslation('common', { lng: locale });
```

### 3. Created Example Components
- `ExampleServerComponent.tsx` - Shows server component pattern
- `ExampleClientComponent.tsx` - Shows client component pattern

### 4. Created Documentation
- `INTEGRATION_GUIDE.md` - Complete usage guide with examples
- `MIGRATION_CHECKLIST.md` - Step-by-step migration tasks

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│ Middleware (middleware.ts)                      │
│ • Detects locale from URL/cookie               │
│ • Redirects to correct /[countryCode] route    │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Root Layout (app/layout.tsx)                    │
│ • Base HTML structure                           │
│ • Providers, Modal, Drawer                      │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ CountryCode Layout (app/[countryCode]/layout)   │
│ ✨ NEW: SSR i18n initialization                │
│ • createI18nInstance(locale)                    │
│ • Extract resources                             │
│ • <TransProvider> wrapper                       │
└─────────────────┬───────────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
┌─────────┐              ┌──────────┐
│ (home)  │              │ (default)│
│ layout  │              │  layout  │
└────┬────┘              └────┬─────┘
     │                        │
     ▼                        ▼
   Pages                    Pages
```

## 📝 Usage Patterns

### Server Component
```typescript
import { getServerTranslations, normalizeLocale } from '@/lib/i18n-server';

export default async function MyPage({ params }) {
  const { countryCode } = await params;
  const locale = normalizeLocale(countryCode);
  const { t } = await getServerTranslations(locale, ['common']);
  
  return <h1>{t('welcome')}</h1>;
}
```

### Client Component
```typescript
'use client';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { normalizeLocale } from '@/lib/i18n-server';

export default function MyComponent() {
  const params = useParams();
  const locale = normalizeLocale((params?.countryCode as string) || 'en');
  const { t } = useTranslation('common', { lng: locale });
  
  return <h1>{t('welcome')}</h1>;
}
```

## 🔄 What You Need to Do

1. **Test the new layout**:
   ```bash
   pnpm dev
   # Visit http://localhost:8000/en
   # Visit http://localhost:8000/zh-TW
   ```

2. **Migrate remaining components**:
   - Find files using old patterns (see MIGRATION_CHECKLIST.md)
   - Update to new patterns (see examples above)
   - Test each component after migration

3. **Verify no errors**:
   - Check browser console for hydration warnings
   - View page source to confirm SSR translations
   - Test locale switching

## 🎁 Benefits You Get

✅ **No loading states** - Translations ready on first render
✅ **SEO-friendly** - Search engines see translated content  
✅ **Smaller bundles** - Only active locale sent to client
✅ **Type-safe** - Full TypeScript support
✅ **No hydration errors** - Server/client in sync
✅ **Better UX** - Instant language switching

## 🚨 Important Reminders

### Locale vs Region
Don't confuse these two concepts:
- **Locale** (`en`, `zh-TW`) = Translation language
- **Region** (`hk`, `us`) = Medusa commerce region

Always use `locale-to-region.ts` utility for Medusa API calls.

### Async Params (Next.js 15)
Always await params:
```typescript
const { countryCode } = await params; // ✅ Correct
const { countryCode } = params;       // ❌ Wrong
```

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `i18n-server.ts` | Server-side i18n utilities |
| `i18n-client-ssr.ts` | Client-side hooks (for reference) |
| `i18n-provider.tsx` | TransProvider component |
| `[countryCode]/layout.tsx` | SSR initialization |
| `locale-to-region.ts` | Locale→Region mapping |
| `INTEGRATION_GUIDE.md` | Full documentation |
| `MIGRATION_CHECKLIST.md` | Migration tasks |

## ✅ Status

- [x] Core infrastructure created
- [x] Layout with TransProvider setup
- [x] Example components created
- [x] Documentation written
- [x] Navigation component migrated
- [ ] Migrate remaining components (your task)
- [ ] Test all routes
- [ ] Verify SSR in HTML source

## 🤝 Need Help?

Refer to:
1. `INTEGRATION_GUIDE.md` - Complete usage documentation
2. `MIGRATION_CHECKLIST.md` - Step-by-step migration guide
3. Example components in `src/components/examples/`
4. Updated Nav component for real-world example

---

**Next Step**: Restart your dev server and test `/en` and `/zh-TW` routes to see SSR i18n in action!

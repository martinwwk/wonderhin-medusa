# i18n SSR Integration Guide

## Overview

This project uses **i18next** with proper SSR support for Next.js 15 App Router. Translations are initialized on the server and hydrated to the client for optimal performance.

## Architecture

### 1. Server-Side (`i18n-server.ts`)

For server components and initial SSR:

```typescript
import { getServerTranslations, normalizeLocale } from '@/lib/i18n-server';

// In a server component
export default async function MyServerComponent({ params }) {
  const { countryCode } = await params;
  const locale = normalizeLocale(countryCode);
  const { t } = await getServerTranslations(locale, ['common']);
  
  return <div>{t('welcome')}</div>;
}
```

### 2. Client-Side (`i18n-client-ssr.ts`)

For client components wrapped by TransProvider:

```typescript
'use client';

import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { normalizeLocale } from '@/lib/i18n-server';

export function MyClientComponent() {
  const params = useParams();
  const locale = normalizeLocale(params?.countryCode as string);
  const { t } = useTranslation('common', { lng: locale });
  
  return <div>{t('welcome')}</div>;
}
```

**Important**: Use standard `useTranslation` from `react-i18next`, NOT `useClientTranslationSSR`. The TransProvider in the layout already provides the i18n context.

### 3. Layout Setup (`[countryCode]/layout.tsx`)

The layout initializes i18n for all localized routes:

```typescript
export default async function CountryCodeLayout({ children, params }: LayoutProps) {
  const { countryCode } = await params;
  const locale = normalizeLocale(countryCode);
  
  // Server generates i18n instance
  const i18nInstance = await createI18nInstance(locale, ['common']);
  
  // Extract resources for client
  const resources = {
    [locale]: {
      common: i18nInstance.getResourceBundle(locale, 'common'),
    },
  };

  // Wrap children with TransProvider for SSR hydration
  return (
    <TransProvider locale={locale} resources={resources} namespaces={['common']}>
      {children}
    </TransProvider>
  );
}
```

## How It Works

1. **Middleware** (`middleware.ts`) detects locale from URL and sets cookie
2. **Layout** (`[countryCode]/layout.tsx`) loads translations on server
3. **TransProvider** hydrates translations to client
4. **Server components** use `getServerTranslations()`
5. **Client components** use `useTranslation()` hook

## Locale vs Region

**CRITICAL**: Don't confuse locale codes with region IDs:

- **Locale codes** (`en`, `zh-TW`): For translations (i18n)
- **Region IDs** (`hk`, `us`): For Medusa commerce (pricing/inventory)

```typescript
// ❌ WRONG: Using locale as region
const products = await listProducts('zh-TW'); // Fails!

// ✅ CORRECT: Map locale to region
import { localeToRegion } from '@/lib/util/locale-to-region';
const regionId = localeToRegion('zh-TW'); // Returns 'hk'
const products = await listProducts(regionId);
```

## Migration Guide

### From `useClientTranslation` (old)

**Before:**
```typescript
import { useClientTranslation } from '@/lib/i18n';

export function MyComponent() {
  const { t, ready } = useClientTranslation();
  if (!ready) return <div>Loading...</div>;
  return <div>{t('welcome')}</div>;
}
```

**After:**
```typescript
'use client';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { normalizeLocale } from '@/lib/i18n-server';

export function MyComponent() {
  const params = useParams();
  const locale = normalizeLocale(params?.countryCode as string);
  const { t } = useTranslation('common', { lng: locale });
  
  return <div>{t('welcome')}</div>;
}
```

### From `getServerTranslation` (old)

**Before:**
```typescript
import { getServerTranslation } from '@/lib/server-i18n';

const label = getServerTranslation(countryCode, 'shipping');
```

**After:**
```typescript
import { getServerTranslations } from '@/lib/i18n-server';

const { t } = await getServerTranslations(countryCode, ['common']);
const label = t('shipping');
```

## Benefits of SSR Approach

1. **No flash of untranslated content** - Translations ready on first render
2. **Better SEO** - Search engines see translated content
3. **Smaller JS bundles** - Only active locale is sent to client
4. **Proper hydration** - No mismatch warnings between server/client
5. **Type safety** - Full TypeScript support with namespaces

## Adding New Namespaces

To add translations beyond 'common':

1. Create JSON file: `public/locales/{locale}/{namespace}.json`
2. Update layout:
```typescript
const i18nInstance = await createI18nInstance(locale, ['common', 'products', 'checkout']);

const resources = {
  [locale]: {
    common: i18nInstance.getResourceBundle(locale, 'common'),
    products: i18nInstance.getResourceBundle(locale, 'products'),
    checkout: i18nInstance.getResourceBundle(locale, 'checkout'),
  },
};
```
3. Use in components:
```typescript
const { t } = useTranslation('products', { lng: locale });
```

## Debugging

Enable debug mode in server i18n:

```typescript
// In i18n-server.ts
.init({
  lng: locale,
  debug: process.env.NODE_ENV === 'development', // Add this
  // ... other options
});
```

Check console for:
- `i18next:` logs showing locale loading
- Resource loading messages
- Missing translation warnings

## Common Issues

### Issue: "t is not a function"
**Cause**: Component not wrapped by TransProvider or wrong import
**Fix**: Ensure [countryCode]/layout.tsx exists and wraps with TransProvider

### Issue: Translations show keys instead of values
**Cause**: Locale not properly passed or resource not loaded
**Fix**: Check `lng: locale` is passed to useTranslation

### Issue: Server/client mismatch warnings
**Cause**: Different i18n initialization on server vs client
**Fix**: Use TransProvider pattern - server generates, client hydrates

### Issue: Infinite loops with locale detection
**Cause**: Confusing locale codes with region IDs
**Fix**: Use `locale-to-region.ts` utility for Medusa API calls

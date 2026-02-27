# i18n SSR - Quick Reference Card

## 🚀 Most Common Usage

### Client Component (Recommended)
```typescript
'use client';
import { useI18n } from '@/lib/hooks/use-i18n';

export function MyComponent() {
  const { t } = useI18n(); // Auto-detects locale
  return <h1>{t('welcome')}</h1>;
}
```

### Server Component
```typescript
import { getServerTranslations } from '@/lib/i18n-server';

export default async function MyPage({ params }) {
  const { countryCode } = await params;
  const { t } = await getServerTranslations(countryCode, ['common']);
  return <h1>{t('welcome')}</h1>;
}
```

## 📚 Available Hooks

| Hook | Use Case | Example |
|------|----------|---------|
| `useI18n()` | Get translations in client component | `const { t } = useI18n()` |
| `useI18n('products')` | Specific namespace | `const { t } = useI18n('products')` |
| `useLocale()` | Get current locale | `const locale = useLocale()` |
| `useLocaleInfo()` | Locale with helpers | `const { isZhTW } = useLocaleInfo()` |

## 🎯 Import Statements

### Client Components
```typescript
import { useI18n, useLocale, useLocaleInfo } from '@/lib/hooks/use-i18n';
```

### Server Components
```typescript
import { getServerTranslations, normalizeLocale } from '@/lib/i18n-server';
```

## 🔄 Common Patterns

### Conditional Content by Locale
```typescript
const { isZhTW, isEn } = useLocaleInfo();

return (
  <div>
    {isZhTW && <ChineseSpecificComponent />}
    {isEn && <EnglishSpecificComponent />}
  </div>
);
```

### Multiple Namespaces
```typescript
const { t: tCommon } = useI18n('common');
const { t: tProducts } = useI18n('products');

return (
  <div>
    <h1>{tCommon('welcome')}</h1>
    <button>{tProducts('addToCart')}</button>
  </div>
);
```

### Dynamic Translations
```typescript
const { t } = useI18n();

const message = t('greeting', { name: 'John' });
// Translation: "Hello, {{name}}!" → "Hello, John!"
```

## ⚠️ Dos and Don'ts

### ✅ DO
```typescript
// Use useI18n hook
const { t } = useI18n();

// Await params in server components
const { countryCode } = await params;

// Use normalizeLocale for consistency
const locale = normalizeLocale(countryCode);

// Separate locale from region
const locale = params.countryCode; // For translations
const regionId = localeToRegion(locale); // For Medusa API
```

### ❌ DON'T
```typescript
// Don't use old hooks
const { t } = useClientTranslation(); // Old way

// Don't forget 'use client' directive
export function MyComponent() { // Missing directive
  const { t } = useI18n(); // Will error

// Don't use locale as region
const products = await listProducts(locale); // Wrong!

// Don't forget to await params (Next.js 15)
const { countryCode } = params; // Missing await
```

## 🔧 Translation File Structure

```
public/locales/
├── en/
│   ├── common.json      ← General translations
│   ├── products.json    ← Product-specific
│   └── checkout.json    ← Checkout flow
└── zh-TW/
    ├── common.json
    ├── products.json
    └── checkout.json
```

### Example Translation File
```json
{
  "welcome": "Welcome to our store",
  "greeting": "Hello, {{name}}!",
  "products": {
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock"
  }
}
```

### Nested Keys
```typescript
const { t } = useI18n();

// Access nested keys with dot notation
t('products.addToCart')
t('products.outOfStock')

// Or use namespace
const { t } = useI18n('products');
t('addToCart')
```

## 🌐 Locale Mapping

| URL | Locale Code | Medusa Region |
|-----|-------------|---------------|
| `/en` | `en` | `hk` (default) |
| `/zh-TW` | `zh-TW` | `hk` |
| `/zh-tw` | `zh-TW` (normalized) | `hk` |

```typescript
import { localeToRegion } from '@/lib/util/locale-to-region';

localeToRegion('en')    // → 'hk'
localeToRegion('zh-TW') // → 'hk'
localeToRegion('zh-tw') // → 'hk'
```

## 📖 More Resources

- **Full Guide**: `INTEGRATION_GUIDE.md`
- **Migration**: `MIGRATION_CHECKLIST.md`
- **Examples**: `src/components/examples/`
- **Summary**: `I18N_SSR_INTEGRATION.md`

## 💡 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "t is not a function" | Add `'use client'` directive |
| Keys shown instead of text | Check locale parameter |
| Hydration errors | Ensure server/client use same locale |
| Missing translations | Check JSON file exists |
| Wrong language | Verify `lng` parameter in useTranslation |

## 🎓 Learning Path

1. **Start Here**: Read `I18N_SSR_INTEGRATION.md`
2. **Study Examples**: Check `src/components/examples/`
3. **Practice**: Use `useI18n()` in a component
4. **Advanced**: Read `INTEGRATION_GUIDE.md`
5. **Migrate**: Follow `MIGRATION_CHECKLIST.md`

---

**Remember**: `useI18n()` for client, `getServerTranslations()` for server!

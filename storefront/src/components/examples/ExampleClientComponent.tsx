// Example: Client Component with i18n SSR (Simplified)
'use client';

import { useI18n } from '@/lib/hooks/use-i18n';

/**
 * Example client component using the simplified useI18n hook
 * This is the recommended approach - it handles locale detection automatically
 */
export default function ExampleClientComponent() {
  // Simplified: useI18n handles locale detection automatically
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
      <button onClick={() => alert(t('clickMessage'))}>
        {t('clickMe')}
      </button>
    </div>
  );
}

/**
 * Alternative: Manual approach with more control
 */
export function ExampleClientComponentManual() {
  const params = useParams();
  const locale = normalizeLocale((params?.countryCode as string) || 'en');
  const { t } = useTranslation('common', { lng: locale });
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}

// Required imports for manual approach
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { normalizeLocale } from '@/lib/i18n-server';

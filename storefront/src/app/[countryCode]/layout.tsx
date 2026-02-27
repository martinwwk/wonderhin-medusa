import { ReactNode } from 'react';
import { createI18nInstance, normalizeLocale } from '@/lib/i18n-server';
import TransProvider from '@/lib/i18n-provider';

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ countryCode: string }>;
};

/**
 * Layout for all localized routes
 * Initializes SSR translations and provides them to client components
 */
export default async function CountryCodeLayout({ children, params }: LayoutProps) {
  const { countryCode } = await params;
  
  // Normalize locale (en, zh-tw, zh-TW → en or zh-TW)
  const locale = normalizeLocale(countryCode);
  
  // Create server-side i18n instance with all needed namespaces
  const i18nInstance = await createI18nInstance(locale, ['common']);
  
  // Extract resources for client hydration
  const resources = {
    [locale]: {
      common: i18nInstance.getResourceBundle(locale, 'common'),
    },
  };

  return (
    <TransProvider locale={locale} resources={resources} namespaces={['common']}>
      {children}
    </TransProvider>
  );
}

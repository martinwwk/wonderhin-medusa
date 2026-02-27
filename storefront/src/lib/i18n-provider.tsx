// I18n Provider with SSR support for Next.js App Router
'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ReactNode, useMemo } from 'react';

type TransProviderProps = {
  children: ReactNode;
  locale: string;
  resources: Resource;
  namespaces: string[];
};

/**
 * Translation Provider Component
 * Wraps your app to provide SSR-hydrated translations to client components
 * 
 * Use this in your root layout to enable SSR translations:
 * 
 * @example
 * ```tsx
 * // In your layout.tsx (Server Component)
 * import { createI18nInstance, normalizeLocale } from '@lib/i18n-server';
 * import TransProvider from '@lib/i18n-provider';
 * 
 * export default async function RootLayout({ children, params }) {
 *   const { countryCode } = await params;
 *   const locale = normalizeLocale(countryCode);
 *   
 *   // Create server-side i18n instance
 *   const i18nInstance = await createI18nInstance(locale, ['common']);
 *   
 *   // Extract resources for client hydration
 *   const resources = {
 *     [locale]: {
 *       common: i18nInstance.getResourceBundle(locale, 'common'),
 *     },
 *   };
 * 
 *   return (
 *     <TransProvider locale={locale} resources={resources} namespaces={['common']}>
 *       <html lang={locale}>
 *         <body>{children}</body>
 *       </html>
 *     </TransProvider>
 *   );
 * }
 * ```
 */
export default function TransProvider({
  children,
  locale,
  resources,
  namespaces,
}: TransProviderProps) {
  const i18n = useMemo(() => {
    const instance = createInstance();
    
    instance
      .use(initReactI18next)
      .init({
        lng: locale,
        fallbackLng: 'en',
        supportedLngs: ['en', 'zh-TW'],
        defaultNS: 'common',
        ns: namespaces,
        resources,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });

    return instance;
  }, [locale, resources, namespaces]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

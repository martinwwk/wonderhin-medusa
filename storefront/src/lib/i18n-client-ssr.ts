// Client-side i18n hook with SSR support for Next.js App Router
'use client';

import { useEffect } from 'react';
import i18next from 'i18next';
import { initReactI18next, useTranslation, UseTranslationOptions } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

/**
 * Initialize i18n for client-side (will be hydrated with server data)
 * This is called automatically when needed
 */
const initClientI18n = () => {
  if (!i18next.isInitialized) {
    i18next
      .use(initReactI18next)
      .use(
        resourcesToBackend(
          (language: string, namespace: string) =>
            import(`../../public/locales/${language}/${namespace}.json`)
        )
      )
      .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'zh-TW'],
        ns: ['common'],
        defaultNS: 'common',
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
  }
};

/**
 * Client-side translation hook with SSR support
 * Use this in client components when wrapping your app with TransProvider
 * 
 * @param ns - Namespace to use (default: 'common')
 * @param options - Translation options including lng (locale)
 * @returns Translation function and i18n instance
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * export function MyComponent() {
 *   const { t } = useClientTranslationSSR('common', { lng: 'zh-TW' });
 *   return <div>{t('welcome')}</div>;
 * }
 * ```
 */
export function useClientTranslationSSR(
  ns: string = 'common',
  options: UseTranslationOptions<string> = {}
) {
  const { lng } = options;
  
  useEffect(() => {
    initClientI18n();
    if (lng && i18next.resolvedLanguage !== lng) {
      i18next.changeLanguage(lng);
    }
  }, [lng]);

  const ret = useTranslation(ns, options);
  
  return ret;
}

export default i18next;

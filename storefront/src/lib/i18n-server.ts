// Server-side i18n configuration for Next.js App Router
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

/**
 * Creates a server-side i18n instance with the specified locale
 * This ensures translations are available during SSR
 */
export async function createI18nInstance(locale: string, namespaces: string[] = ['common']) {
  const i18nInstance = createInstance();
  
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: 'en',
      supportedLngs: ['en', 'zh-TW'],
      defaultNS: 'common',
      ns: namespaces,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  return i18nInstance;
}

/**
 * Normalize Medusa locale codes to i18n locale codes
 * @param medusaLocale - The locale code from Medusa (e.g., 'en', 'zh-tw', 'zh-TW')
 * @returns Normalized locale code ('en' or 'zh-TW')
 */
export function normalizeLocale(medusaLocale: string): string {
  const locale = medusaLocale?.toLowerCase() || 'en';
  if (locale.startsWith('zh')) return 'zh-TW';
  return 'en';
}

/**
 * Get translations for a specific locale and namespaces on the server
 * Useful for server components that need translations
 */
export async function getServerTranslations(locale: string, namespaces: string[] = ['common']) {
  const i18n = await createI18nInstance(locale, namespaces);
  
  return {
    t: i18n.t.bind(i18n),
    i18n,
  };
}

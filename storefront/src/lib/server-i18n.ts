// Server-side i18n helper for Next.js Server Components
import enCommon from '../../public/locales/en/common.json';
import zhTWCommon from '../../public/locales/zh-TW/common.json';

type Translations = typeof enCommon;
type TranslationKey = keyof Translations;

const translations: Record<string, Translations> = {
  'en': enCommon,
  'zh-TW': zhTWCommon,
  'zh-tw': zhTWCommon,
  'zh': zhTWCommon,
};

/**
 * Get translation for server components
 * @param locale - The locale code (e.g., 'en', 'zh-TW')
 * @param key - The translation key
 * @returns The translated string
 */
export function getServerTranslation(locale: string, key: TranslationKey): string {
  const normalizedLocale = locale.toLowerCase();
  const localeTranslations = translations[normalizedLocale] || translations['en'];
  return localeTranslations[key] || key;
}

/**
 * Create a translation function for a specific locale
 * @param locale - The locale code
 * @returns A translation function
 */
export function createServerTranslator(locale: string) {
  return (key: TranslationKey) => getServerTranslation(locale, key);
}

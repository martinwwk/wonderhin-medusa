import { getLocale } from "@lib/data/locale-actions"

/**
 * Maps app locale codes to API locale codes
 * - 'en' -> 'en-US'
 * - 'zh-TW' or 'zh-tw' -> 'zh-TW'
 * - Other locales are passed through
 */
function mapLocaleToApiLocale(locale: string | null): string {
  if (!locale || locale === 'en') {
    return 'en-US'
  }
  
  const lowerLocale = locale.toLowerCase();
  if (lowerLocale === 'zh-tw' || lowerLocale.startsWith('zh')) {
    return 'zh-TW'
  }
  
  return locale
}

export async function getLocaleHeader() {
  const locale = await getLocale()
  const apiLocale = mapLocaleToApiLocale(locale)
  
  return {
    "x-medusa-locale": apiLocale,
  } as const
}

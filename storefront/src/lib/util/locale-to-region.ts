/**
 * Maps locale codes to Medusa region IDs
 * Locale codes are used for translations (en, zh-TW, etc.)
 * Region IDs are used for Medusa API (hk, us, etc.)
 */

const LOCALE_TO_REGION_MAP: Record<string, string> = {
  'en': 'hk',       // English -> Hong Kong region
  'zh-tw': 'hk',    // Traditional Chinese -> Hong Kong region
  'zh-TW': 'hk',    // Traditional Chinese -> Hong Kong region
  'zh': 'hk',       // Chinese -> Hong Kong region
  'hk': 'hk',       // Hong Kong -> Hong Kong region
  'us': 'us',       // United States -> US region
  'uk': 'uk',       // United Kingdom -> UK region
  'eu': 'eu',       // European Union -> EU region
}

/**
 * Converts a locale code (from URL or context) to a Medusa region ID
 * @param localeCode - The locale code from URL (e.g., 'zh-TW', 'en')
 * @returns Medusa region ID (e.g., 'hk', 'us')
 */
export function localeToRegion(localeCode: string | undefined): string {
  const DEFAULT_REGION = 'hk'
  
  if (!localeCode) {
    return DEFAULT_REGION
  }

  const normalizedLocale = localeCode.toLowerCase()
  
  return LOCALE_TO_REGION_MAP[normalizedLocale] || DEFAULT_REGION
}

/**
 * Get region ID from various sources with fallback
 */
export function getRegionFromContext(params: any): string {
  const countryCode = params?.countryCode as string | undefined
  return localeToRegion(countryCode)
}

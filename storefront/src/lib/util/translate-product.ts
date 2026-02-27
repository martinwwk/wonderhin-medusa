// Product name translations
import productNames from '../../../public/locales/product-names.json'

type ProductTranslations = typeof productNames

/**
 * Translate product name based on locale
 * @param productName - The original product name (usually in English)
 * @param locale - The target locale (e.g., 'en', 'zh-TW')
 * @returns The translated product name or original if no translation exists
 */
export function translateProductName(productName: string, locale: string): string {
  const normalizedLocale = locale.toLowerCase()
  const translations = productNames as ProductTranslations
  
  // Get translations for the locale
  const localeTranslations = translations[normalizedLocale as keyof ProductTranslations] || translations['en']
  
  // Return translated name or original if not found
  return localeTranslations[productName as keyof typeof localeTranslations] || productName
}

/**
 * Translate variant title based on locale
 * @param variantTitle - The original variant title
 * @param locale - The target locale
 * @returns The translated variant title or original if no translation exists
 */
export function translateVariantTitle(variantTitle: string | undefined, locale: string): string {
  if (!variantTitle) return ''
  return translateProductName(variantTitle, locale)
}

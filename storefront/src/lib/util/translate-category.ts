// Category name translations
import categoryNames from '../../../public/locales/category-names.json'

type CategoryTranslations = typeof categoryNames

/**
 * Translate category name based on locale.
 * Falls back to the original name if no translation exists.
 * 
 * @param categoryName - The original category name (usually in English)
 * @param locale - The target locale (e.g., 'en', 'zh-TW')
 * @returns The translated category name or original if no translation exists
 */
export function translateCategoryName(categoryName: string, locale: string): string {
  const normalizedLocale = locale.toLowerCase()
  const translations = categoryNames as CategoryTranslations
  
  // Try exact locale match first, then fall back to 'en'
  const localeTranslations = translations[normalizedLocale as keyof CategoryTranslations] || translations['en']
  
  if (!localeTranslations) return categoryName
  
  // Return translated name or original if not found
  return localeTranslations[categoryName as keyof typeof localeTranslations] || categoryName
}

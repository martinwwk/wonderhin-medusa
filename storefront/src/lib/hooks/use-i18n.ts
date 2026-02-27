/**
 * i18n Helper Utilities
 * Provides convenient hooks and utilities for using translations in components
 */

'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { normalizeLocale } from '@/lib/i18n-server';

/**
 * Get the current locale from URL params
 * Works with Next.js [countryCode] dynamic route
 * 
 * @returns Normalized locale code ('en' or 'zh-TW')
 * 
 * @example
 * ```tsx
 * const locale = useLocale();
 * console.log(locale); // 'en' or 'zh-TW'
 * ```
 */
export function useLocale(): string {
  const params = useParams();
  return normalizeLocale((params?.countryCode as string) || 'en');
}

/**
 * Convenient hook for getting translation function with automatic locale detection
 * 
 * @param namespace - Translation namespace (default: 'common')
 * @returns Translation function and i18n instance
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * export function MyComponent() {
 *   const { t } = useI18n();
 *   return <div>{t('welcome')}</div>;
 * }
 * 
 * // With specific namespace
 * export function ProductComponent() {
 *   const { t } = useI18n('products');
 *   return <div>{t('addToCart')}</div>;
 * }
 * ```
 */
export function useI18n(namespace: string = 'common') {
  const locale = useLocale();
  return useTranslation(namespace, { lng: locale });
}

/**
 * Get current locale information
 * 
 * @returns Object with locale code and helper functions
 * 
 * @example
 * ```tsx
 * const { locale, isZhTW, isEn } = useLocaleInfo();
 * 
 * if (isZhTW) {
 *   // Show traditional Chinese specific UI
 * }
 * ```
 */
export function useLocaleInfo() {
  const locale = useLocale();
  
  return {
    locale,
    isZhTW: locale === 'zh-TW',
    isEn: locale === 'en',
    isChinese: locale.startsWith('zh'),
  };
}

// Client-side i18n hook for Next.js App Router
'use client';

import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

// Import translations directly
import enCommon from '../../public/locales/en/common.json';
import zhTWCommon from '../../public/locales/zh-TW/common.json';

// Initialize once
let initialized = false;
let initialLanguage: string | null = null;

// Get initial locale before initialization
if (typeof window !== 'undefined' && !initialLanguage) {
  const pathSegments = window.location.pathname.split('/').filter(s => s);
  const urlLocale = pathSegments[0]?.toLowerCase();
  if (urlLocale === 'zh-tw' || urlLocale === 'zh') {
    initialLanguage = 'zh-TW';
  } else {
    initialLanguage = 'en';
  }
}

const initI18n = () => {
  if (initialized) return;
  
  const startLang = initialLanguage || 'en';
  
  i18next
    .use(initReactI18next)
    .init({
      lng: startLang,
      fallbackLng: 'en',
      supportedLngs: ['en', 'zh-TW', 'zh-tw'],
      ns: ['common'],
      defaultNS: 'common',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: {
          common: enCommon,
        },
        'zh-TW': {
          common: zhTWCommon,
        },
        'zh-tw': {
          common: zhTWCommon,
        },
      },
      react: {
        useSuspense: false,
      },
    });
  
  initialized = true;
};

// Map Medusa locale codes to i18n locale codes
const mapLocaleCode = (medusaLocale: string): string => {
  const locale = medusaLocale?.toLowerCase() || 'en';
  if (locale.startsWith('zh')) return 'zh-TW';
  return 'en';
};

// Get locale from URL path only
const getLocaleFromUrl = (): string => {
  if (typeof window === 'undefined') return 'en';
  
  // Check URL path
  const pathSegments = window.location.pathname.split('/').filter(s => s);
  const urlLocale = pathSegments[0]?.toLowerCase();
  
  // Check if URL has a valid locale
  if (urlLocale === 'zh-tw' || urlLocale === 'zh') {
    return 'zh-TW';
  }
  
  if (urlLocale === 'en') {
    return 'en';
  }
  
  // Default to English if no locale in URL
  return 'en';
};

// Custom hook to use translations in client components
export const useClientTranslation = (ns: string = 'common') => {
  const [currentLocale, setCurrentLocale] = useState<string>('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize i18n
    initI18n();
    
    // Immediately get locale from URL after mount
    const urlLocale = getLocaleFromUrl();
    
    // Set the language immediately
    i18next.changeLanguage(urlLocale);
    setCurrentLocale(urlLocale);
    setIsReady(true);

    // Watch for URL changes (when user navigates)
    const checkLocale = () => {
      const newLocale = getLocaleFromUrl();
      if (newLocale !== currentLocale) {
        i18next.changeLanguage(newLocale);
        setCurrentLocale(newLocale);
      }
    };
    
    const interval = setInterval(checkLocale, 500);

    return () => clearInterval(interval);
  }, []); // Empty dependency array - run once on mount

  const { t, i18n } = useTranslation(ns);

  return {
    t,
    i18n,
    ready: isReady,
  };
};

export default i18next;

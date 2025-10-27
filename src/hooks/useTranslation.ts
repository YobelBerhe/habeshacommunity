/**
 * Translation Hook
 * Manages language state and translations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getUITranslations, 
  getUserLanguagePreference,
  setUserLanguagePreference,
  detectBrowserLanguage
} from '@/lib/api/translations';
import type { LanguageCode, TranslationDictionary } from '@/types/translations';

const STORAGE_KEY = 'habesha-spiritual-language';

export function useTranslation() {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    // Try localStorage first
    const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode;
    if (stored && ['ti', 'am', 'en'].includes(stored)) return stored;
    return detectBrowserLanguage();
  });
  
  const [translations, setTranslations] = useState<TranslationDictionary>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations when language changes
  useEffect(() => {
    let mounted = true;

    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        // Try to get user preference first
        const userLang = await getUserLanguagePreference();
        if (mounted && userLang !== language) {
          setLanguageState(userLang);
          localStorage.setItem(STORAGE_KEY, userLang);
        }

        const dict = await getUITranslations(userLang || language);
        if (mounted) {
          setTranslations(dict);
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadTranslations();

    return () => {
      mounted = false;
    };
  }, [language]);

  const setLanguage = useCallback(async (newLang: LanguageCode) => {
    setLanguageState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    
    // Save to user preferences if logged in
    try {
      await setUserLanguagePreference(newLang);
    } catch (error) {
      // User might not be logged in, that's okay
      console.log('Language preference not saved (user not logged in)');
    }

    // Load new translations
    try {
      const dict = await getUITranslations(newLang);
      setTranslations(dict);
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  }, [translations]);

  return {
    language,
    setLanguage,
    t,
    translations,
    isLoading,
  };
}

/**
 * Translation API
 * Functions for multilingual support
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  LanguageCode,
  SupportedLanguage,
  TranslationDictionary,
  UserLanguagePreference,
} from '@/types/translations';

// =====================================================
// LANGUAGE MANAGEMENT
// =====================================================

export async function getSupportedLanguages(): Promise<SupportedLanguage[]> {
  const { data, error } = await supabase
    .from('supported_languages')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return (data || []) as SupportedLanguage[];
}

export async function getLanguageByCode(code: LanguageCode): Promise<SupportedLanguage | null> {
  const { data, error } = await supabase
    .from('supported_languages')
    .select('*')
    .eq('code', code)
    .single();

  if (error) return null;
  return data as SupportedLanguage;
}

// =====================================================
// UI TRANSLATIONS
// =====================================================

export async function getUITranslations(
  languageCode: LanguageCode
): Promise<TranslationDictionary> {
  const { data, error } = await supabase
    .from('ui_translations')
    .select('translation_key, translation_text')
    .eq('language_code', languageCode);

  if (error) throw error;

  const dictionary: TranslationDictionary = {};
  data?.forEach((item) => {
    dictionary[item.translation_key] = item.translation_text;
  });

  return dictionary;
}

export async function getTranslation(
  key: string,
  languageCode: LanguageCode,
  fallback?: string
): Promise<string> {
  const { data, error } = await supabase
    .from('ui_translations')
    .select('translation_text')
    .eq('translation_key', key)
    .eq('language_code', languageCode)
    .single();

  if (error || !data) {
    // Try English fallback
    const { data: englishData } = await supabase
      .from('ui_translations')
      .select('translation_text')
      .eq('translation_key', key)
      .eq('language_code', 'en')
      .single();

    return englishData?.translation_text || fallback || key;
  }

  return data.translation_text;
}

// =====================================================
// USER PREFERENCES
// =====================================================

export async function getUserLanguagePreference(): Promise<LanguageCode> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return detectBrowserLanguage();

  const { data, error } = await supabase
    .from('user_language_preferences')
    .select('preferred_language')
    .eq('user_id', user.id)
    .single();

  if (error || !data) return detectBrowserLanguage();
  return data.preferred_language as LanguageCode;
}

export async function setUserLanguagePreference(
  languageCode: LanguageCode,
  bibleVersionId?: number
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('user_language_preferences')
    .upsert({
      user_id: user.id,
      preferred_language: languageCode,
      preferred_bible_version_id: bibleVersionId,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
}

// =====================================================
// LANGUAGE DETECTION
// =====================================================

export function detectBrowserLanguage(): LanguageCode {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('ti')) return 'ti';
  if (browserLang.startsWith('am')) return 'am';
  
  // Check for Ethiopian/Eritrean region codes
  if (browserLang.includes('-er') || browserLang.includes('-et')) {
    return 'ti'; // Default to Tigrinya for Eritrea/Ethiopia
  }
  
  return 'en'; // Default to English
}

// =====================================================
// LOCALIZED READING PLANS
// =====================================================

export async function getLocalizedReadingPlans(languageCode: LanguageCode) {
  const { data: plans, error: plansError } = await supabase
    .from('reading_plans')
    .select('*')
    .order('popularity_rank', { ascending: false });

  if (plansError) throw plansError;

  const { data: translations, error: translationsError } = await supabase
    .from('reading_plan_translations')
    .select('*')
    .eq('language_code', languageCode);

  if (translationsError) throw translationsError;

  // Merge translations with plans
  return plans?.map(plan => {
    const translation = translations?.find(t => t.plan_id === plan.id);
    return {
      ...plan,
      title: translation?.title || plan.title,
      description: translation?.description || plan.description,
    };
  }) || [];
}

export async function getLocalizedReadingPlan(
  planId: number,
  languageCode: LanguageCode
) {
  const { data: plan, error: planError } = await supabase
    .from('reading_plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (planError) throw planError;

  const { data: translation } = await supabase
    .from('reading_plan_translations')
    .select('*')
    .eq('plan_id', planId)
    .eq('language_code', languageCode)
    .single();

  return {
    ...plan,
    title: translation?.title || plan.title,
    description: translation?.description || plan.description,
  };
}

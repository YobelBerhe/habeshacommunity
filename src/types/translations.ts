/**
 * Translation System Types
 * Tigrinya (ti), Amharic (am), English (en)
 */

export type LanguageCode = 'ti' | 'am' | 'en';
export type TextDirection = 'ltr' | 'rtl';

export interface SupportedLanguage {
  id: number;
  code: LanguageCode;
  name: string;
  native_name: string;
  direction: TextDirection;
  is_active: boolean;
  display_order: number;
  flag_emoji: string;
  created_at: string;
}

export interface UITranslation {
  id: number;
  translation_key: string;
  language_code: LanguageCode;
  translation_text: string;
  context?: string;
  created_at: string;
  updated_at: string;
}

export interface TranslationDictionary {
  [key: string]: string;
}

export interface UserLanguagePreference {
  id: string;
  user_id: string;
  preferred_language: LanguageCode;
  preferred_bible_version_id?: number;
  created_at: string;
  updated_at: string;
}

export interface ReadingPlanTranslation {
  id: number;
  plan_id: number;
  language_code: LanguageCode;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ReadingPlanDayTranslation {
  id: number;
  day_id: number;
  language_code: LanguageCode;
  title?: string;
  devotional_content?: string;
  reflection_questions?: string[];
  prayer_prompt?: string;
  created_at: string;
  updated_at: string;
}

import { create } from 'zustand';
import type { Lang } from '@/lib/i18n';

type LanguageState = {
  language: Lang;
  setLanguage: (lang: Lang) => void;
};

export const useLanguage = create<LanguageState>((set, get) => ({
  language: (localStorage.getItem('habesha-language') as Lang) || 'EN',
  setLanguage: (language: Lang) => {
    localStorage.setItem('habesha-language', language);
    set({ language });
  },
}));
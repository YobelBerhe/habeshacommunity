/**
 * Language Switcher for Spiritual Section
 * Tigrinya 🇪🇷 | Amharic 🇪🇹 | English 🇺🇸
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { LanguageCode, SupportedLanguage } from '@/types/translations';

interface LanguageSwitcherProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  variant?: 'dropdown' | 'buttons' | 'compact';
  showNativeNames?: boolean;
}

const LANGUAGES: SupportedLanguage[] = [
  {
    id: 1,
    code: 'ti',
    name: 'Tigrinya',
    native_name: 'ትግርኛ',
    direction: 'ltr',
    is_active: true,
    display_order: 1,
    flag_emoji: '🇪🇷',
    created_at: '',
  },
  {
    id: 2,
    code: 'am',
    name: 'Amharic',
    native_name: 'አማርኛ',
    direction: 'ltr',
    is_active: true,
    display_order: 2,
    flag_emoji: '🇪🇹',
    created_at: '',
  },
  {
    id: 3,
    code: 'en',
    name: 'English',
    native_name: 'English',
    direction: 'ltr',
    is_active: true,
    display_order: 3,
    flag_emoji: '🇺🇸',
    created_at: '',
  },
];

export function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  variant = 'dropdown',
  showNativeNames = true,
}: LanguageSwitcherProps) {
  const currentLang = LANGUAGES.find((l) => l.code === currentLanguage);

  if (variant === 'compact') {
    const nextLanguage = () => {
      const currentIndex = LANGUAGES.findIndex((l) => l.code === currentLanguage);
      const nextIndex = (currentIndex + 1) % LANGUAGES.length;
      onLanguageChange(LANGUAGES[nextIndex].code);
    };

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={nextLanguage}
        className="text-2xl"
        title="Switch Language"
      >
        {currentLang?.flag_emoji}
      </Button>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            variant={lang.code === currentLanguage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onLanguageChange(lang.code)}
            className="gap-2"
          >
            <span>{lang.flag_emoji}</span>
            <span>{showNativeNames ? lang.native_name : lang.name}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span className="text-xl">{currentLang?.flag_emoji}</span>
          <span>{showNativeNames ? currentLang?.native_name : currentLang?.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className="gap-3 cursor-pointer"
          >
            <span className="text-xl">{lang.flag_emoji}</span>
            <div className="flex-1">
              <div className="font-medium">
                {showNativeNames ? lang.native_name : lang.name}
              </div>
              {showNativeNames && (
                <div className="text-xs text-muted-foreground">{lang.name}</div>
              )}
            </div>
            {lang.code === currentLanguage && (
              <span className="text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

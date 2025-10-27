/**
 * Bible Reader Component
 * Interactive Bible chapter reader with highlighting, bookmarking, and sharing
 */

import { useState } from 'react';
import type { BibleVerse, BibleVersion, UserVerseHighlight, HighlightColor } from '@/types/spiritual';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BibleReaderProps {
  verses: BibleVerse[];
  version: BibleVersion;
  highlights?: UserVerseHighlight[];
  onHighlight?: (verseId: number, color: HighlightColor) => void;
  onBookmark?: (verseId: number) => void;
  onShare?: (verseId: number) => void;
  fontSize?: 'small' | 'medium' | 'large' | 'x-large';
  showVerseNumbers?: boolean;
}

export function BibleReader({
  verses,
  version,
  highlights = [],
  onHighlight,
  onBookmark,
  onShare,
  fontSize = 'medium',
  showVerseNumbers = true,
}: BibleReaderProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);

  const fontSizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
    'x-large': 'text-2xl',
  };

  const highlightColors: Record<HighlightColor, string> = {
    yellow: 'bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-900 dark:hover:bg-yellow-800',
    blue: 'bg-blue-200 hover:bg-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800',
    green: 'bg-green-200 hover:bg-green-300 dark:bg-green-900 dark:hover:bg-green-800',
    pink: 'bg-pink-200 hover:bg-pink-300 dark:bg-pink-900 dark:hover:bg-pink-800',
    orange: 'bg-orange-200 hover:bg-orange-300 dark:bg-orange-900 dark:hover:bg-orange-800',
  };

  const getHighlight = (verseId: number) => {
    return highlights.find((h) => h.verse_id === verseId);
  };

  const handleVerseClick = (verseId: number) => {
    setSelectedVerse(verseId);
    setShowHighlightMenu(true);
  };

  const handleHighlight = (color: HighlightColor) => {
    if (selectedVerse && onHighlight) {
      onHighlight(selectedVerse, color);
      setShowHighlightMenu(false);
      setSelectedVerse(null);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <div className="mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold mb-2">
          {verses[0]?.usfm.split('.').slice(0, 2).join(' ')}
        </h1>
        <p className="text-sm text-muted-foreground">{version.name}</p>
      </div>

      <div className={`${fontSizeClasses[fontSize]} leading-relaxed space-y-2`}>
        {verses.map((verse) => {
          const highlight = getHighlight(verse.id);
          const isSelected = selectedVerse === verse.id;

          return (
            <div
              key={verse.id}
              className={`inline ${highlight ? highlightColors[highlight.color] : ''} ${
                isSelected ? 'ring-2 ring-primary' : ''
              } rounded px-1 cursor-pointer transition-colors`}
              onClick={() => handleVerseClick(verse.id)}
            >
              {showVerseNumbers && (
                <sup className="text-primary font-semibold mr-1">{verse.verse_number}</sup>
              )}
              <span>{verse.text}</span>
            </div>
          );
        })}
      </div>

      {showHighlightMenu && selectedVerse && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 flex gap-2 z-50">
          {(Object.keys(highlightColors) as HighlightColor[]).map((color) => (
            <Button
              key={color}
              variant="outline"
              size="sm"
              className={highlightColors[color]}
              onClick={() => handleHighlight(color)}
            >
              {color}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowHighlightMenu(false);
              setSelectedVerse(null);
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}

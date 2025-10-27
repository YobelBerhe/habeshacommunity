/**
 * Verse of the Day Component
 * Beautiful display of daily featured Bible verse with background image
 */

import { useState } from 'react';
import type { VerseOfTheDay } from '@/types/spiritual';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share2, Bookmark } from 'lucide-react';

interface VOTDProps {
  votd: VerseOfTheDay;
  variant?: 'hero' | 'card' | 'widget';
}

export function VOTDHero({ votd }: { votd: VerseOfTheDay }) {
  const [imageIndex, setImageIndex] = useState(0);
  const currentImage = votd.images[imageIndex];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verse of the Day',
          text: `${votd.verse?.text} - ${votd.usfm}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(`${votd.verse?.text} - ${votd.usfm}`);
      alert('Verse copied to clipboard!');
    }
  };

  return (
    <Card className="h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl relative group border-0">
      {currentImage && (
        <div className="absolute inset-0">
          <img
            src={currentImage.url}
            alt="Verse of the Day"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      )}

      <div className="relative h-full flex flex-col justify-between p-6 md:p-10 text-white">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-2">
              Verse of the Day
            </span>
            <p className="text-sm text-white/80">
              {new Date(votd.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div>
          <blockquote className="text-2xl md:text-4xl font-serif leading-relaxed mb-6">
            "{votd.verse?.text}"
          </blockquote>
          
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">{votd.usfm} ({votd.version?.abbreviation})</p>
            
            {votd.images.length > 1 && (
              <div className="flex gap-2">
                {votd.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === imageIndex ? 'bg-white w-6' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function VOTDCard({ votd }: { votd: VerseOfTheDay }) {
  return (
    <Card className="p-6">
      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
        Verse of the Day
      </span>
      
      <blockquote className="text-xl font-serif leading-relaxed mb-4 text-foreground">
        "{votd.verse?.text}"
      </blockquote>
      
      <p className="text-sm font-semibold text-muted-foreground">
        {votd.usfm} ({votd.version?.abbreviation})
      </p>
    </Card>
  );
}

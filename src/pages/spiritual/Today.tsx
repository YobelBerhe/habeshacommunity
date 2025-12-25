import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Play, ChevronRight, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface VerseOfDay {
  text: string;
  reference: string;
  imageUrl?: string;
}

export default function Today() {
  const navigate = useNavigate();
  const [verse, setVerse] = useState<VerseOfDay | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1234);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerseOfDay();
  }, []);

  const fetchVerseOfDay = async () => {
    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');

      // Try to fetch from database first
      const { data: votdData, error } = await supabase
        .from('verse_of_the_day')
        .select(`
          id,
          date,
          usfm,
          images,
          verse_id,
          bible_verses (
            text,
            usfm
          )
        `)
        .eq('date', today)
        .single();

      if (!error && votdData) {
        const verseText = (votdData.bible_verses as any)?.text || '';
        const reference = votdData.usfm?.replace(/\./g, ' ').replace(':', ':') || 'John 3:16';
        const images = votdData.images as string[] | null;
        
        setVerse({
          text: verseText || "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
          reference: reference,
          imageUrl: images?.[0] || 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=400&fit=crop'
        });
        setLoading(false);
        return;
      }

      // Fallback to Bible API
      const response = await fetch('https://bible-api.com/john 3:16?translation=kjv');
      const data = await response.json();
      
      setVerse({
        text: data.text?.trim() || "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
        reference: data.reference || "John 3:16",
        imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=400&fit=crop'
      });
    } catch (error) {
      console.error('Error fetching verse:', error);
      // Use fallback verse
      setVerse({
        text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
        reference: "John 3:16",
        imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=400&fit=crop'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    toast.success(liked ? 'Unliked verse' : 'Liked verse');
  };

  const handleShare = async () => {
    if (navigator.share && verse) {
      try {
        await navigator.share({
          title: 'Verse of the Day',
          text: `${verse.text}\n\n— ${verse.reference}`,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Today</h1>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/spiritual/verse-of-the-day')}
            >
              <BookOpen className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Verse of the Day */}
        {verse && (
          <Card className="overflow-hidden">
            {/* Verse Image */}
            <div className="relative h-48">
              <img 
                src={verse.imageUrl} 
                alt="Verse background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-xs uppercase tracking-wide mb-2 opacity-80">
                  Verse of the Day
                </p>
                <p className="text-sm italic leading-relaxed mb-2">
                  "{verse.text}"
                </p>
                <p className="text-sm font-semibold">{verse.reference}</p>
              </div>
            </div>

            {/* Engagement Bar */}
            <div className="flex items-center justify-between p-3 border-t border-border">
              <Button variant="ghost" size="sm" onClick={handleLike} className="gap-1">
                <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                {likeCount.toLocaleString()}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1"
                onClick={() => navigate('/spiritual/verse-of-the-day')}
              >
                <MessageCircle className="h-4 w-4" />
                234
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </Card>
        )}

        {/* Daily Devotional */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">Guided Scripture</h2>
          <Card 
            className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate('/spiritual/bible')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-spiritual/10 flex items-center justify-center">
                <Play className="h-5 w-5 text-spiritual" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Daily Reflection</h3>
                <p className="text-sm text-muted-foreground">
                  Start your day with God's word
                </p>
                <p className="text-xs text-muted-foreground mt-1">⏱ 5 min</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Guided Prayer */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">Guided Prayer</h2>
          <Card 
            className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate('/spiritual/daily-prayers')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Morning Prayer</h3>
                <p className="text-sm text-muted-foreground">
                  Make time for God today
                </p>
                <p className="text-xs text-muted-foreground mt-1">⏱ 3 min</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Continue Reading */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">Continue Reading</h2>
          <Card 
            className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate('/spiritual/bible')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Gospel of John</h3>
                  <p className="text-sm text-muted-foreground">Chapter 3:16-21</p>
                  <p className="text-xs text-green-500 mt-1">• 5 min left</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        </section>

        {/* Reading Plans */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Your Reading Plans</h2>
            <Button 
              variant="link" 
              size="sm" 
              className="text-spiritual"
              onClick={() => navigate('/spiritual/plans')}
            >
              See All
            </Button>
          </div>
          <Card 
            className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate('/spiritual/plans')}
          >
            <div className="mb-3">
              <h3 className="font-medium text-foreground">The Gospel Project</h3>
              <p className="text-sm text-muted-foreground">30-Day Reading Plan</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">Day 7 of 30</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-spiritual rounded-full transition-all"
                  style={{ width: '23%' }}
                />
              </div>
            </div>
            <Button className="w-full mt-4 bg-spiritual hover:bg-spiritual/90">
              Continue Plan
            </Button>
          </Card>
        </section>
      </main>
    </div>
  );
}

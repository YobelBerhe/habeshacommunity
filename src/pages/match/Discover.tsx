import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  X, 
  SlidersHorizontal,
  MapPin,
  User,
  Home,
  Book,
  Search,
  Users,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  age: number;
  location: string;
  photos: string[];
  prompts: Array<{
    question: string;
    answer: string;
    style?: 'white' | 'gradient';
  }>;
  basics: {
    height?: string;
    gender?: string;
    orientation?: string;
    education?: string;
    religion?: string;
    location?: string;
    ethnicity?: string;
    relationship_goal?: string;
    relationship_type?: string;
  };
  isVerified?: boolean;
  isNew?: boolean;
}

export default function Discover() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  const fetchProfiles = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: interactions } = await supabase
        .from('match_interactions')
        .select('target_user_id')
        .eq('user_id', user.id);

      const interactedIds = new Set(
        interactions?.map(i => i.target_user_id) || []
      );

      const { data: matchProfiles, error } = await supabase
        .from('match_profiles')
        .select('*')
        .eq('active', true)
        .neq('user_id', user.id)
        .limit(20);

      if (error) throw error;

      const availableProfiles = matchProfiles?.filter(
        p => !interactedIds.has(p.user_id)
      ) || [];

      const formatted: Profile[] = availableProfiles.map(p => ({
        id: p.id,
        user_id: p.user_id,
        display_name: p.display_name || p.name || 'Someone Special',
        age: p.age || 25,
        location: `${p.city || 'Bay Area'}, ${p.country || 'USA'}`,
        photos: Array.isArray(p.photos) && p.photos.length > 0 
          ? p.photos 
          : ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600'],
        prompts: [
          {
            question: "My simple pleasures",
            answer: p.bio || "Coffee, good conversations, and quality time with loved ones.",
            style: 'white'
          },
          {
            question: "I'm looking for",
            answer: "Someone who values family, faith, and building a future together.",
            style: 'gradient'
          }
        ],
        basics: {
          height: '5\'6"',
          gender: 'Woman',
          orientation: 'Straight',
          religion: 'Orthodox Christian',
          location: p.city || 'San Francisco',
          ethnicity: 'Ethiopian',
          relationship_goal: 'Long-term relationship',
          relationship_type: 'Monogamy'
        },
        isVerified: true,
        isNew: true
      }));

      setProfiles(formatted);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const currentProfile = profiles[currentIndex];

  const handleLike = async () => {
    if (!currentProfile || actionLoading || !user) return;
    
    setActionLoading(true);
    try {
      const { data, error } = await supabase
        .from('match_interactions')
        .insert({
          user_id: user.id,
          target_user_id: currentProfile.user_id,
          action: 'like'
        })
        .select()
        .single();

      if (error) throw error;

      if (data?.is_mutual) {
        toast.success(`It's a match! 💕`, {
          duration: 5000
        });
        setTimeout(() => navigate('/match/matches'), 2000);
      } else {
        toast.success('Like sent!');
      }
      
      moveToNext();
    } catch (error) {
      console.error('Error liking profile:', error);
      toast.error('Something went wrong');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePass = async () => {
    if (actionLoading || !user || !currentProfile) return;
    
    setActionLoading(true);
    try {
      await supabase
        .from('match_interactions')
        .insert({
          user_id: user.id,
          target_user_id: currentProfile.user_id,
          action: 'pass'
        });
      
      moveToNext();
    } catch (error) {
      console.error('Error passing profile:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const moveToNext = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setProfiles([]);
      toast.info('No more profiles for now. Check back later!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-match mx-auto mb-4" />
          <p className="text-muted-foreground">Finding great matches...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-6">💕</p>
          <h2 className="text-2xl font-bold mb-4 text-foreground">You're all caught up!</h2>
          <p className="text-muted-foreground mb-6">Check back later for new profiles</p>
          <Button onClick={() => navigate('/hub')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top Filters - Hinge Style */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <Button variant="outline" size="sm" className="gap-1 shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <Badge variant="secondary" className="py-1.5 px-3 shrink-0 cursor-pointer hover:bg-secondary/80">
              Age
            </Badge>
            <Badge variant="secondary" className="py-1.5 px-3 shrink-0 cursor-pointer hover:bg-secondary/80">
              Height
            </Badge>
            <Badge variant="secondary" className="py-1.5 px-3 shrink-0 cursor-pointer hover:bg-secondary/80">
              Dating Intentions
            </Badge>
          </div>
        </div>
      </div>

      {/* Notification Banner - Hinge Style */}
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center gap-3 bg-pink-50 dark:bg-pink-950/30 rounded-lg p-3">
          <div className="w-10 h-10 rounded-full bg-match/20 flex items-center justify-center">
            <Heart className="h-5 w-5 text-match" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Start sending likes!</p>
            <p className="text-sm text-muted-foreground">They help us learn your type.</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4">
        {/* Name Header */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">{currentProfile.display_name}</h1>
          {currentProfile.isNew && (
            <Badge className="bg-emerald-500 text-white">New here</Badge>
          )}
        </div>

        {/* Verified Badge */}
        {currentProfile.isVerified && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm font-medium">Verified</span>
          </div>
        )}

        {/* Main Photo - Clean, No Heavy Overlay */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={currentProfile.photos[0]}
            alt={currentProfile.display_name}
            className="w-full aspect-[3/4] object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-lg font-medium drop-shadow-lg">
              {currentProfile.location}
            </p>
          </div>
          {/* Heart Button - Floating */}
          <button 
            onClick={handleLike}
            className="absolute bottom-4 right-4 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <Heart className="h-7 w-7 text-match" />
          </button>
        </div>

        {/* Prompts - Mix of White and Gradient Backgrounds */}
        {currentProfile.prompts.map((prompt, i) => (
          <div 
            key={i}
            className={`rounded-2xl p-5 relative ${
              prompt.style === 'gradient' 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                : 'bg-card border border-border'
            }`}
          >
            {/* Question - Small Text */}
            <p className={`text-sm font-medium mb-2 ${
              prompt.style === 'gradient' ? 'text-white/80' : 'text-muted-foreground'
            }`}>
              {prompt.question}
            </p>
            
            {/* Answer - Large Serif Font (Hinge's signature) */}
            <p className={`text-xl font-serif leading-relaxed ${
              prompt.style === 'gradient' ? 'text-white' : 'text-foreground'
            }`}>
              {prompt.answer}
            </p>

            {/* Heart Button Inside Card */}
            {prompt.style !== 'gradient' && (
              <button 
                onClick={handleLike}
                className="absolute bottom-4 right-4 w-10 h-10 bg-white dark:bg-secondary rounded-full flex items-center justify-center shadow-md border border-border hover:scale-105 transition-transform"
              >
                <Heart className="h-5 w-5 text-match" />
              </button>
            )}
          </div>
        ))}

        {/* Additional Photos */}
        {currentProfile.photos.length > 1 && (
          <div className="space-y-4">
            {currentProfile.photos.slice(1, 5).map((photo, index) => (
              <div key={index} className="relative rounded-2xl overflow-hidden">
                <img
                  src={photo}
                  alt={`${currentProfile.display_name} photo ${index + 2}`}
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* The Basics - Icon-based List (Hinge Style) */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">
              {currentProfile.basics.height}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">
              {currentProfile.basics.gender}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Book className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">
              {currentProfile.basics.religion}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">
              {currentProfile.basics.location}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-foreground font-medium">{currentProfile.basics.relationship_goal}</p>
              <p className="text-sm text-muted-foreground">Looking for my person</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-foreground font-medium">{currentProfile.basics.relationship_type}</p>
              <p className="text-sm text-muted-foreground">I need honesty.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons - Hinge Style (White Circles) */}
      <div className="fixed bottom-24 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto px-4 flex justify-center gap-8">
          <button 
            onClick={handlePass}
            disabled={actionLoading}
            className="w-16 h-16 bg-white dark:bg-secondary rounded-full flex items-center justify-center shadow-xl border border-border hover:scale-105 transition-transform disabled:opacity-50"
          >
            <X className="h-8 w-8 text-muted-foreground" />
          </button>
          
          <button 
            onClick={handleLike}
            disabled={actionLoading}
            className="w-16 h-16 bg-match rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform disabled:opacity-50"
          >
            {actionLoading ? (
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            ) : (
              <Heart className="h-8 w-8 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

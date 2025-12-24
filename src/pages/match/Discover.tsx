import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MessageCircle, MapPin, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { likeUser, passUser } from '@/utils/matchActions';

interface Profile {
  id: string;
  display_name: string;
  age: number;
  location: string;
  distance: string;
  photos: string[];
  prompts: Array<{
    question: string;
    answer: string;
  }>;
  basics: {
    height?: string;
    education?: string;
    religion?: string;
    languages?: string[];
  };
}

export default function Discover() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    // Mock data for now - later connect to real match_profiles table
    setProfiles([
      {
        id: '1',
        display_name: 'Sarah',
        age: 28,
        location: 'San Francisco, CA',
        distance: '5 miles away',
        photos: [
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
        ],
        prompts: [
          {
            question: 'A perfect day involves',
            answer: 'Morning coffee, church service, and quality time with family over Ethiopian food'
          },
          {
            question: "I'm looking for",
            answer: 'A God-fearing partner who values family and shares my Orthodox faith'
          },
        ],
        basics: {
          height: '5\'6"',
          education: "Bachelor's Degree",
          religion: 'Orthodox Christian',
          languages: ['Tigrinya', 'English'],
        }
      },
      {
        id: '2',
        display_name: 'Meron',
        age: 26,
        location: 'Oakland, CA',
        distance: '12 miles away',
        photos: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        ],
        prompts: [
          {
            question: 'The key to my heart is',
            answer: 'Good Ethiopian food, genuine conversations, and someone who makes me laugh'
          },
        ],
        basics: {
          height: '5\'4"',
          education: "Master's Degree",
          religion: 'Orthodox Christian',
        }
      },
    ]);
    setLoading(false);
  };

  const currentProfile = profiles[currentIndex];

  const handleLike = async () => {
    if (!currentProfile || actionLoading) return;
    
    setActionLoading(true);
    try {
      const result = await likeUser(currentProfile.id);
      
      if (result.isMatch) {
        toast.success(`It's a match with ${currentProfile.display_name}! 💕`);
      } else {
        toast.success(`You liked ${currentProfile.display_name}!`);
      }
      
      // Move to next profile
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        toast.info('No more profiles for now. Check back later!');
      }
    } catch (error) {
      console.error('Error liking profile:', error);
      toast.error('Something went wrong');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePass = async () => {
    if (actionLoading) return;
    
    setActionLoading(true);
    try {
      if (currentProfile) {
        await passUser(currentProfile.id);
      }
      
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        toast.info('No more profiles for now. Check back later!');
      }
    } catch (error) {
      console.error('Error passing profile:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComment = (prompt: string) => {
    toast.info('Comments coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-match" />
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">You're all caught up!</h2>
          <p className="text-muted-foreground mb-6">
            Check back later for new profiles
          </p>
          <Button onClick={() => navigate('/hub')}>
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Discover</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/match/settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Profile Card */}
        <Card className="overflow-hidden">
          {/* Photo */}
          <div className="relative aspect-[4/5]">
            <img
              src={currentProfile.photos[0]}
              alt={currentProfile.display_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h2 className="text-2xl font-bold text-white">
                {currentProfile.display_name}, {currentProfile.age}
              </h2>
              <p className="text-white/80 flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4" />
                {currentProfile.location}
                <span className="mx-1">•</span>
                {currentProfile.distance}
              </p>
            </div>
          </div>

          {/* Prompts */}
          {currentProfile.prompts.map((prompt, index) => (
            <div key={index} className="p-4 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">
                {prompt.question}
              </p>
              <p className="text-lg">"{prompt.answer}"</p>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleComment(prompt.question)}
                >
                  <MessageCircle className="h-4 w-4" />
                  Comment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-match border-match hover:bg-match/10"
                  onClick={handleLike}
                  disabled={actionLoading}
                >
                  <Heart className="h-4 w-4" />
                  Like
                </Button>
              </div>
            </div>
          ))}

          {/* Additional Photos */}
          {currentProfile.photos.length > 1 && (
            <div className="p-4 border-b border-border">
              {currentProfile.photos.slice(1).map((photo, index) => (
                <div key={index} className="rounded-xl overflow-hidden">
                  <img
                    src={photo}
                    alt={`${currentProfile.display_name} photo ${index + 2}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Basics */}
          <div className="p-4">
            <h3 className="font-semibold mb-3">The basics</h3>
            <div className="flex flex-wrap gap-2">
              {currentProfile.basics.height && (
                <Badge variant="secondary" className="py-1 px-3">
                  <span className="text-muted-foreground mr-1">Height:</span>
                  {currentProfile.basics.height}
                </Badge>
              )}
              {currentProfile.basics.education && (
                <Badge variant="secondary" className="py-1 px-3">
                  <span className="text-muted-foreground mr-1">Education:</span>
                  {currentProfile.basics.education}
                </Badge>
              )}
              {currentProfile.basics.religion && (
                <Badge variant="secondary" className="py-1 px-3">
                  <span className="text-muted-foreground mr-1">Religion:</span>
                  {currentProfile.basics.religion}
                </Badge>
              )}
              {currentProfile.basics.languages && (
                <Badge variant="secondary" className="py-1 px-3">
                  <span className="text-muted-foreground mr-1">Languages:</span>
                  {currentProfile.basics.languages.join(', ')}
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 flex gap-4">
            <Button
              variant="outline"
              className="flex-1 h-14 gap-2 text-lg"
              onClick={handlePass}
              disabled={actionLoading}
            >
              <X className="h-6 w-6" />
              Pass
            </Button>
            <Button
              className="flex-1 h-14 gap-2 text-lg bg-match hover:bg-match/90"
              onClick={handleLike}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Heart className="h-6 w-6" />
              )}
              Like
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

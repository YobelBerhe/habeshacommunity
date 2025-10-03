import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, MessageCircle, ArrowLeft } from 'lucide-react';
import MobileHeader from '@/components/layout/MobileHeader';
import Header from '@/components/Header';
import { getAppState } from '@/utils/storage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MatchProfile {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  age: number | null;
  city: string;
  photos: string[];
  interests: string[];
}

export default function MatchDiscover() {
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();
  const appState = getAppState();
  const { toast } = useToast();

  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      openAuth();
      return;
    }
    checkProfile();
  }, [user]);

  useEffect(() => {
    if (hasProfile) {
      loadProfiles();
    }
  }, [hasProfile]);

  const checkProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('match_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setHasProfile(true);
      } else {
        navigate('/match/onboarding');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const loadProfiles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get profiles that user hasn't liked yet
      const { data: alreadyLiked, error: likesError } = await supabase
        .from('likes')
        .select('liked_id')
        .eq('liker_id', user.id);

      if (likesError) throw likesError;

      const likedIds = alreadyLiked?.map(l => l.liked_id) || [];

      let query = supabase
        .from('match_profiles')
        .select('*')
        .eq('active', true)
        .neq('user_id', user.id);

      if (likedIds.length > 0) {
        query = query.not('user_id', 'in', `(${likedIds.join(',')})`);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profiles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];
    
    try {
      const { error } = await supabase
        .from('likes')
        .insert({
          liker_id: user.id,
          liked_id: profile.user_id,
        });

      if (error) throw error;

      // Check if it's a match
      const { data: matchData } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${profile.user_id},user2_id.eq.${profile.user_id}`)
        .single();

      if (matchData) {
        toast({
          title: "It's a Match! 🎉",
          description: `You matched with ${profile.name}!`,
        });
      }

      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  const handlePass = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const currentProfile = profiles[currentIndex];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header 
        currentCity={appState.city}
        onCityChange={() => {}}
        onAccountClick={() => {}}
        onLogoClick={() => navigate('/')}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/match/matches')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Your Matches
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading profiles...</p>
            </CardContent>
          </Card>
        ) : !currentProfile ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No More Profiles</h3>
              <p className="text-muted-foreground mb-4">
                Check back later for new matches!
              </p>
              <Button onClick={loadProfiles}>Refresh</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                {currentProfile.photos[0] && (
                  <img
                    src={currentProfile.photos[0]}
                    alt={currentProfile.name}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                )}
                
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
                    {currentProfile.age && (
                      <p className="text-lg text-muted-foreground">{currentProfile.age} years old</p>
                    )}
                    <p className="text-sm text-muted-foreground">{currentProfile.city}</p>
                  </div>

                  <p className="text-foreground">{currentProfile.bio}</p>

                  {currentProfile.interests && currentProfile.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePass}
                className="w-20 h-20 rounded-full border-2"
              >
                <X className="w-8 h-8 text-red-500" />
              </Button>

              <Button
                size="lg"
                onClick={handleLike}
                className="w-20 h-20 rounded-full bg-primary"
              >
                <Heart className="w-8 h-8 fill-current" />
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {profiles.length - currentIndex - 1} profiles remaining
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

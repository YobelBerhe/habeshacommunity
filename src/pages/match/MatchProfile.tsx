import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, ArrowLeft, MessageCircle } from 'lucide-react';
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

interface MatchScore {
  match_percent: number;
  total_questions: number;
  matched_questions: number;
}

export default function MatchProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, openAuth } = useAuth();
  const appState = getAppState();
  const { toast } = useToast();

  const [profile, setProfile] = useState<MatchProfile | null>(null);
  const [matchScore, setMatchScore] = useState<MatchScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      openAuth();
      return;
    }
    if (id) {
      loadProfile();
    }
  }, [user, id]);

  const loadProfile = async () => {
    if (!user || !id) return;

    try {
      setLoading(true);

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('match_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Calculate match score
      const { data: scoreData, error: scoreError } = await supabase
        .rpc('calculate_match_score', {
          viewer_id: user.id,
          profile_user_id: profileData.user_id,
        });

      if (scoreError) throw scoreError;
      setMatchScore(scoreData?.[0] || null);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('likes')
        .insert({
          liker_id: user.id,
          liked_id: profile.user_id,
        });

      if (error) throw error;

      toast({
        title: 'Liked!',
        description: `You liked ${profile.name}'s profile`,
      });

      navigate('/match/discover');
    } catch (error) {
      console.error('Error liking profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to like profile',
        variant: 'destructive',
      });
    }
  };

  if (!user) return null;

  if (loading) {
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
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading profile...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
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
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Profile not found</p>
              <Button onClick={() => navigate('/match/discover')} className="mt-4">
                Back to Discover
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
        <Button 
          variant="ghost" 
          onClick={() => navigate('/match/discover')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Discover
        </Button>

        <div className="space-y-4">
          {/* Match Score Card */}
          {matchScore && matchScore.match_percent > 0 && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Compatibility Score</span>
                  <Badge variant="default" className="text-2xl px-4 py-2">
                    {matchScore.match_percent}% Match
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You matched on {matchScore.matched_questions} out of {matchScore.total_questions} shared questions
                </p>
              </CardContent>
            </Card>
          )}

          {/* Profile Card */}
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                {profile.photos[0] && (
                  <img
                    src={profile.photos[0]}
                    alt={profile.name}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                )}
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  {profile.age && (
                    <p className="text-xl text-muted-foreground">{profile.age} years old</p>
                  )}
                  <p className="text-sm text-muted-foreground">{profile.city}</p>
                </div>

                <p className="text-foreground text-lg">{profile.bio}</p>

                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, idx) => (
                        <Badge key={idx} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/match/discover')}
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

            <Button
              variant="outline"
              size="lg"
              className="w-20 h-20 rounded-full border-2"
            >
              <MessageCircle className="w-8 h-8 text-primary" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

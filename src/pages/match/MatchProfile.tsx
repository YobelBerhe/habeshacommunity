import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MessageCircle } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateConversation } from '@/utils/conversations';

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
  const { toast } = useToast();

  const [profile, setProfile] = useState<MatchProfile | null>(null);
  const [matchScore, setMatchScore] = useState<MatchScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!user) {
      openAuth();
      return;
    }
    if (id) {
      loadProfile();
      checkFavoriteStatus();
    }
  }, [user, id]);

  const checkFavoriteStatus = async () => {
    if (!id || !user) return;
    
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('liker_id', user.id)
      .eq('liked_id', id)
      .maybeSingle();
    
    setIsFavorite(!!data);
  };

  const handleToggleFavorite = async () => {
    if (!user || !profile) return;

    try {
      if (isFavorite) {
        await supabase
          .from('likes')
          .delete()
          .eq('liker_id', user.id)
          .eq('liked_id', profile.user_id);
        
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Profile removed from your favorites",
        });
      } else {
        await supabase
          .from('likes')
          .insert({
            liker_id: user.id,
            liked_id: profile.user_id,
          });
        
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Profile saved to your favorites",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        variant: 'destructive',
      });
    }
  };

  const loadProfile = async () => {
    if (!user || !id) return;

    try {
      setLoading(true);

      // Load profile by user_id (passed from Browse page)
      const { data: profileData, error: profileError } = await supabase
        .from('match_profiles')
        .select('*')
        .eq('user_id', id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) {
        setProfile(null);
        setLoading(false);
        return;
      }
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
    await handleToggleFavorite();
    if (!isFavorite) {
      // Check if it's a match
      const { data: matchData } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user!.id},user2_id.eq.${user!.id}`)
        .or(`user1_id.eq.${profile!.user_id},user2_id.eq.${profile!.user_id}`)
        .maybeSingle();

      if (matchData) {
        toast({
          title: "It's a Match! 🎉",
          description: `You matched with ${profile!.name}!`,
        });
      }
    }
  };

  const handleMessage = async () => {
    if (!user || !profile) return;

    try {
      const { conversationId } = await getOrCreateConversation(profile.user_id);
      navigate('/inbox', { 
        state: { 
          openConversationId: conversationId, 
          mentorName: profile.name 
        } 
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MentorHeader title="Profile" backPath="/match/discover" />
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
        <MentorHeader title="Profile" backPath="/match/discover" />
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
      <MentorHeader title="Profile" backPath="/match/discover" />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">

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
              className={`w-20 h-20 rounded-full ${isFavorite ? 'bg-primary' : 'bg-primary/50'}`}
            >
              <Heart className={`w-8 h-8 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleMessage}
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

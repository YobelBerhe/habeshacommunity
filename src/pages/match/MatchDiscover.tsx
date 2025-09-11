import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, MessageCircle, MapPin, X } from 'lucide-react';
import MobileHeader from '@/components/layout/MobileHeader';
import Header from '@/components/Header';
import { getAppState } from '@/utils/storage';

interface MatchProfile {
  user_id: string;
  display_name: string;
  city: string;
  country: string;
  gender: string;
  seeking: string;
  age: number;
  bio: string;
  photos: string[];
  compatibility?: number;
  shared_answers?: number;
}

export default function MatchDiscover() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const appState = getAppState();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    fetchMatches();
  }, [user, navigate]);

  const fetchMatches = async () => {
    if (!user) return;

    try {
      // First check if user has a profile
      const { data: userProfile } = await supabase
        .from('match_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!userProfile) {
        navigate('/match');
        return;
      }

      // Get user's answers
      const { data: userAnswers } = await supabase
        .from('match_answers')
        .select('*')
        .eq('user_id', user.id);

      // Use secure function to get potential matches
      const { data: profiles, error } = await supabase
        .rpc('get_potential_matches', { p_limit: 50 });

      if (error) throw error;

      // Get answers for each profile to calculate compatibility
      const profilesWithAnswers = await Promise.all(
        (profiles || []).map(async (profile: any) => {
          const { data: answers } = await supabase
            .from('match_answers')
            .select('question_id, choice_index, importance')
            .eq('user_id', profile.user_id);
          
          return {
            ...profile,
            match_answers: answers || []
          };
        })
      );

      // Calculate compatibility scores
      const matchesWithScores = profilesWithAnswers.map((profile: any) => {
        const compatibility = calculateCompatibility(userAnswers || [], profile.match_answers || []);
        return {
          ...profile,
          compatibility: compatibility.score,
          shared_answers: compatibility.shared
        };
      }).sort((a, b) => b.compatibility - a.compatibility);

      setMatches(matchesWithScores);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompatibility = (userAnswers: any[], profileAnswers: any[]) => {
    if (!userAnswers.length || !profileAnswers.length) {
      return { score: 0, shared: 0 };
    }

    let totalWeight = 0;
    let matchWeight = 0;
    let sharedQuestions = 0;

    userAnswers.forEach(userAnswer => {
      const profileAnswer = profileAnswers.find(
        pa => pa.question_id === userAnswer.question_id
      );

      if (profileAnswer) {
        sharedQuestions++;
        const weight = userAnswer.importance + profileAnswer.importance;
        totalWeight += weight;

        if (userAnswer.choice_index === profileAnswer.choice_index) {
          matchWeight += weight;
        }
      }
    });

    const score = totalWeight > 0 ? Math.round((matchWeight / totalWeight) * 100) : 0;
    return { score, shared: sharedQuestions };
  };

  const handlePass = async () => {
    if (!currentMatch) return;
    
    try {
      const { passUser } = await import('@/utils/matchActions');
      await passUser(currentMatch.user_id);
      
      if (currentIndex < matches.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // No more matches
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Failed to pass user:', error);
    }
  };

  const handleLike = async () => {
    if (!currentMatch) return;
    
    try {
      const { likeUser } = await import('@/utils/matchActions');
      await likeUser(currentMatch.user_id);
      
      if (currentIndex < matches.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Failed to like user:', error);
    }
  };

  const currentMatch = matches[currentIndex];

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
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading matches...</div>
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
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/match')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-sm text-muted-foreground">
            {matches.length > 0 ? `${currentIndex + 1} of ${matches.length}` : 'No matches'}
          </div>
        </div>

        {matches.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Matches Yet</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any matches for you right now. Try expanding your preferences or check back later.
              </p>
              <Button onClick={() => navigate('/match')}>
                Update Profile
              </Button>
            </CardContent>
          </Card>
        ) : currentMatch && (
          <div className="space-y-4">
            <Card className="overflow-hidden">
              {currentMatch.photos?.[0] && (
                <div className="h-64 bg-gradient-to-b from-primary/20 to-primary/40 flex items-center justify-center">
                  <div className="text-4xl font-bold text-white opacity-50">
                    {currentMatch.display_name?.[0]?.toUpperCase()}
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {currentMatch.display_name}, {currentMatch.age}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{currentMatch.city}{currentMatch.country && `, ${currentMatch.country}`}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-lg font-semibold">
                      {currentMatch.compatibility}% match
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {currentMatch.shared_answers} shared answers
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{currentMatch.bio}</p>
                
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline">{currentMatch.gender}</Badge>
                  <Badge variant="outline">Looking for {currentMatch.seeking}</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePass}
                className="w-20 h-20 rounded-full"
              >
                <X className="w-8 h-8" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={async () => {
                  if (!user) {
                    navigate('/auth/login');
                    return;
                  }
                  try {
                    const { sendMessage } = await import('@/utils/matchActions');
                    const res = await sendMessage(currentMatch.user_id, 'Hi! I found your profile interesting.');
                    navigate(`/inbox?thread=${res.chatId}`);
                  } catch (error) {
                    console.error('Failed to send message:', error);
                  }
                }}
                className="w-20 h-20 rounded-full"
              >
                <MessageCircle className="w-8 h-8" />
              </Button>
              
              <Button
                size="lg"
                onClick={handleLike}
                className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90"
              >
                <Heart className="w-8 h-8" />
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => navigate(`/match/profile/${currentMatch.user_id}`)}
                className="text-sm"
              >
                View Full Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
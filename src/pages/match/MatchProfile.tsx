import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, MessageCircle, MapPin } from 'lucide-react';
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
}

interface Answer {
  question: string;
  choice: string;
  importance: number;
}

export default function MatchProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<MatchProfile | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [compatibility, setCompatibility] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const appState = getAppState();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (id) {
      fetchProfile();
    }
  }, [id, user, navigate]);

  const fetchProfile = async () => {
    if (!user || !id) return;

    try {
      // Get the profile through secure function (only returns profiles available for matching)
      const { data: potentialMatches, error: profileError } = await supabase
        .rpc('get_potential_matches', { p_limit: 100 });

      if (profileError) throw profileError;
      
      const profileData = potentialMatches?.find((p: any) => p.user_id === id);
      if (!profileData) {
        throw new Error('Profile not found or not available for viewing');
      }
      
      setProfile(profileData);

      // Get their answers with questions
      const { data: answersData, error: answersError } = await supabase
        .from('match_answers')
        .select(`
          choice_index,
          importance,
          match_questions (text, choices)
        `)
        .eq('user_id', id);

      if (answersError) throw answersError;

      const formattedAnswers = (answersData || []).map((answer: any) => ({
        question: answer.match_questions.text,
        choice: answer.match_questions.choices[answer.choice_index],
        importance: answer.importance
      }));

      setAnswers(formattedAnswers);

      // Calculate compatibility with current user
      const { data: userAnswers } = await supabase
        .from('match_answers')
        .select('*')
        .eq('user_id', user.id);

      if (userAnswers && answersData) {
        const comp = calculateCompatibility(userAnswers, answersData);
        setCompatibility(comp);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompatibility = (userAnswers: any[], profileAnswers: any[]) => {
    if (!userAnswers.length || !profileAnswers.length) {
      return 0;
    }

    let totalWeight = 0;
    let matchWeight = 0;

    userAnswers.forEach(userAnswer => {
      const profileAnswer = profileAnswers.find(
        pa => pa.question_id === userAnswer.question_id
      );

      if (profileAnswer) {
        const weight = userAnswer.importance + profileAnswer.importance;
        totalWeight += weight;

        if (userAnswer.choice_index === profileAnswer.choice_index) {
          matchWeight += weight;
        }
      }
    });

    return totalWeight > 0 ? Math.round((matchWeight / totalWeight) * 100) : 0;
  };

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
          <div className="text-center">Loading profile...</div>
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
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Profile not found</div>
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
          Back to Discovery
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {profile.display_name}, {profile.age}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.city}{profile.country && `, ${profile.country}`}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg font-semibold">
                  {compatibility}% match
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{profile.bio}</p>
              
              <div className="flex gap-2">
                <Badge variant="outline">{profile.gender}</Badge>
                <Badge variant="outline">Looking for {profile.seeking}</Badge>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/inbox?match=${profile.user_id}`)}
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
              </div>
            </CardContent>
          </Card>

          {answers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Their Answers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {answers.slice(0, 5).map((answer, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <h4 className="font-medium text-sm mb-1">{answer.question}</h4>
                    <p className="text-muted-foreground mb-1">{answer.choice}</p>
                    <Badge variant="outline" className="text-xs">
                      {answer.importance === 1 && 'Not important'}
                      {answer.importance === 2 && 'Somewhat important'}
                      {answer.importance === 3 && 'Very important'}
                    </Badge>
                  </div>
                ))}
                
                {answers.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    And {answers.length - 5} more answers...
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
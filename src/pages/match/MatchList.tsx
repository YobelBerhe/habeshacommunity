import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Heart } from 'lucide-react';
import MobileHeader from '@/components/layout/MobileHeader';
import Header from '@/components/Header';
import { getAppState } from '@/utils/storage';
import { supabase } from '@/integrations/supabase/client';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  profile: {
    name: string;
    photos: string[];
    city: string;
  };
}

export default function MatchList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const appState = getAppState();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    loadMatches();
  }, [user]);

  const loadMatches = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          match_profiles!inner(name, photos, city)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to get the other user's profile
      const transformedMatches = data?.map((match: any) => ({
        ...match,
        profile: match.match_profiles,
      })) || [];

      setMatches(transformedMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (matchId: string) => {
    navigate(`/inbox`);
  };

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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/match/discover')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Discovery
        </Button>

        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary" />
          Your Matches
        </h1>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading matches...</p>
            </CardContent>
          </Card>
        ) : matches.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No Matches Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start swiping to find your matches!
              </p>
              <Button onClick={() => navigate('/match/discover')}>
                Start Matching
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {match.profile?.photos?.[0] && (
                      <img
                        src={match.profile.photos[0]}
                        alt={match.profile.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{match.profile?.name || 'Unknown'}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {match.profile?.city || 'Unknown city'}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Matched {new Date(match.created_at).toLocaleDateString()}
                      </p>
                      
                      <Button 
                        size="sm"
                        onClick={() => handleChat(match.id)}
                        className="w-full"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

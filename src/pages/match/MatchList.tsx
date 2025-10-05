import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, User, MapPin, Sparkles, Shield, ArrowUpDown } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateConversation } from '@/utils/conversations';
import { useToast } from '@/hooks/use-toast';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  profile: {
    user_id: string;
    name: string;
    display_name?: string | null;
    photos: string[];
    city: string;
    country?: string | null;
  };
  match_percent?: number;
}

export default function MatchList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'compatibility' | 'recent' | 'location'>('compatibility');

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
          match_profiles!inner(user_id, name, display_name, photos, city, country)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate match scores and transform data
      const matchesWithScores = await Promise.all(
        (data || []).map(async (match: any) => {
          const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
          
          const { data: scoreData } = await supabase
            .rpc('calculate_match_score', {
              viewer_id: user.id,
              profile_user_id: otherUserId,
            });

          return {
            ...match,
            profile: match.match_profiles,
            match_percent: scoreData?.[0]?.match_percent || 0,
          };
        })
      );

      setMatches(matchesWithScores);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (match: Match) => {
    if (!user) return;
    try {
      const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
      const { conversationId } = await getOrCreateConversation(otherUserId);
      navigate('/inbox', { state: { openConversationId: conversationId, mentorName: match.profile?.display_name || match.profile?.name || 'Conversation' } });
    } catch (e) {
      console.error('Failed to open chat from match:', e);
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };

  const handleViewProfile = (match: Match) => {
    const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
    navigate(`/match/profile/${otherUserId}`);
  };

  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === 'compatibility') {
      return (b.match_percent || 0) - (a.match_percent || 0);
    } else if (sortBy === 'recent') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return (a.profile?.city || '').localeCompare(b.profile?.city || '');
    }
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Your Matches" backPath="/match/discover" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 border border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-1">Your Matches</h2>
              <p className="text-muted-foreground">
                You have {matches.length} compatible connection{matches.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border-2 border-border rounded-xl focus:border-primary focus:outline-none bg-background"
              >
                <option value="compatibility">Sort by Compatibility</option>
                <option value="recent">Sort by Recent</option>
                <option value="location">Sort by Location</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-card rounded-2xl shadow-lg p-12 text-center border border-border">
            <p className="text-muted-foreground">Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg p-12 text-center border border-border">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No Matches Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start swiping to find your matches!
            </p>
            <Button onClick={() => navigate('/match/discover')}>
              Start Matching
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {sortedMatches.map((match) => {
              const displayName = match.profile?.display_name || match.profile?.name || 'Unknown';
              const isMutual = true; // All items in matches table are mutual
              
              return (
                <div 
                  key={match.id} 
                  className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-border"
                >
                  <div className="relative h-64 bg-muted/30 flex items-center justify-center">
                    {isMutual && (
                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Heart className="w-4 h-4 fill-current" />
                        <span>Mutual</span>
                      </div>
                    )}
                    {match.match_percent !== undefined && match.match_percent > 0 && (
                      <div className="absolute top-3 right-3 bg-card px-3 py-1 rounded-full text-sm font-bold border border-border flex items-center space-x-1">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span>{match.match_percent}%</span>
                      </div>
                    )}
                    
                    {match.profile?.photos?.[0] ? (
                      <img
                        src={match.profile.photos[0]}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
                        <User className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{displayName}</h3>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {match.profile?.city}{match.profile?.country ? `, ${match.profile.country}` : ''}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => handleViewProfile(match)}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleChat(match)}
                      >
                        <MessageCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

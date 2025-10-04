import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, MessageCircle } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MatchFilters, { FilterState } from '@/components/match/MatchFilters';

interface MatchProfile {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  age: number | null;
  city: string;
  photos: string[];
  interests: string[];
  match_percent?: number;
}

export default function MatchDiscover() {
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();
  const { toast } = useToast();

  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<MatchProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    minScore: 50,
    ageRange: [18, 60],
    location: "",
    interest: ""
  });

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

  useEffect(() => {
    applyFilters();
  }, [profiles, filters]);

  const applyFilters = () => {
    let filtered = profiles.filter(p => {
      const matchesScore = (p.match_percent || 0) >= filters.minScore;
      const matchesAge = !p.age || (p.age >= filters.ageRange[0] && p.age <= filters.ageRange[1]);
      const matchesLocation = !filters.location || 
        p.city?.toLowerCase().includes(filters.location.toLowerCase());
      const matchesInterest = !filters.interest || 
        p.interests?.some(i => i.toLowerCase().includes(filters.interest.toLowerCase()));
      
      return matchesScore && matchesAge && matchesLocation && matchesInterest;
    });
    
    setFilteredProfiles(filtered);
    setCurrentIndex(0);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

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
      
      // Calculate match percentages for each profile
      const profilesWithScores = await Promise.all(
        (data || []).map(async (profile) => {
          const { data: scoreData } = await supabase
            .rpc('calculate_match_score', {
              viewer_id: user.id,
              profile_user_id: profile.user_id,
            });
          
          return {
            ...profile,
            match_percent: scoreData?.[0]?.match_percent || 0,
          };
        })
      );
      
      setProfiles(profilesWithScores);
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

  const currentProfile = filteredProfiles[currentIndex];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Discover" backPath="/" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <MatchFilters onFilterChange={handleFilterChange} />
          
          {/* Main Content */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="flex justify-end mb-6">
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
                <div className="relative">
                  {currentProfile.photos[0] && (
                    <img
                      src={currentProfile.photos[0]}
                      alt={currentProfile.name}
                      className="w-full h-96 object-cover rounded-t-lg"
                    />
                  )}
                  
                  {/* Match Percentage Badge */}
                  {currentProfile.match_percent !== undefined && currentProfile.match_percent > 0 && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      {currentProfile.match_percent}% Match
                    </div>
                  )}
                </div>
                
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
              {filteredProfiles.length - currentIndex - 1} profiles remaining
            </p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}

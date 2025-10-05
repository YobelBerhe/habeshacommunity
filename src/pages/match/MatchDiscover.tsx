import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Heart, X, Star, MapPin, Briefcase, GraduationCap, Globe, MessageCircle, Shield, ChevronLeft, ChevronRight, Sparkles, Info, SlidersHorizontal, Users } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MatchFilters, { FilterState } from '@/components/match/MatchFilters';

interface MatchProfile {
  id: string;
  user_id: string;
  name: string;
  display_name?: string | null;
  bio: string | null;
  age: number | null;
  city: string;
  country?: string | null;
  gender?: string | null;
  seeking?: string | null;
  looking_for?: string | null;
  photos: string[];
  interests: string[];
  match_percent?: number;
  match_reasons?: string[];
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
  const [showFilters, setShowFilters] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
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

  const generateMatchReasons = (profile: MatchProfile, matchPercent: number): string[] => {
    const reasons: string[] = [];
    
    if (matchPercent >= 85) {
      reasons.push('Excellent compatibility score');
    }
    if (profile.city) {
      reasons.push(`Both from ${profile.city} area`);
    }
    if (profile.interests && profile.interests.length > 2) {
      reasons.push('Shared interests and hobbies');
    }
    if (profile.looking_for) {
      reasons.push('Compatible relationship goals');
    }
    
    return reasons.length > 0 ? reasons : ['Strong compatibility potential'];
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
          
          const matchPercent = scoreData?.[0]?.match_percent || 0;
          
          return {
            ...profile,
            match_percent: matchPercent,
            match_reasons: generateMatchReasons(profile, matchPercent),
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
    if (!user || currentIndex >= filteredProfiles.length) return;

    const profile = filteredProfiles[currentIndex];
    
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
        setMatches([...matches, profile.name]);
        setShowMatchNotification(true);
        setTimeout(() => setShowMatchNotification(false), 5000);
        
        toast({
          title: "It's a Match! 🎉",
          description: `You matched with ${profile.name}!`,
        });
      }

      nextCard();
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  const handlePass = () => {
    nextCard();
  };

  const handleSuperLike = async () => {
    // Same as like for now, but could add special handling
    await handleLike();
  };

  const handleMessage = async () => {
    if (!user || currentIndex >= filteredProfiles.length) return;
    const profile = filteredProfiles[currentIndex];
    
    // First like them, then navigate to messages
    await handleLike();
    toast({
      title: 'Match requested',
      description: 'Like them first to start a conversation',
    });
  };

  const nextCard = () => {
    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentProfile = filteredProfiles[currentIndex];

  if (!user) return null;

  const getMatchQuality = (percent: number) => {
    if (percent >= 90) return { label: 'Excellent Match', color: 'from-accent to-green-500' };
    if (percent >= 75) return { label: 'Great Match', color: 'from-primary to-blue-500' };
    return { label: 'Good Match', color: 'from-purple-400 to-purple-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <MentorHeader title="Find Your Match" backPath="/" />
      
      {/* Header */}
      <div className="container mx-auto px-4 pt-4">
        <div className="bg-card shadow-lg rounded-2xl mb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-primary-foreground fill-current" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Find Your Match
                </h1>
                <p className="text-xs text-muted-foreground">Culturally-aligned connections</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </Button>

              <Button
                onClick={() => navigate('/match/matches')}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                {matches.length} Matches
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6">
            <MatchFilters onFilterChange={handleFilterChange} />
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="bg-card rounded-3xl shadow-2xl p-12 text-center">
              <p className="text-muted-foreground">Loading profiles...</p>
            </div>
          ) : !currentProfile ? (
            <div className="bg-card rounded-3xl shadow-2xl p-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No More Profiles</h3>
              <p className="text-muted-foreground mb-4">
                Check back later for new matches!
              </p>
              <Button onClick={loadProfiles}>Refresh</Button>
            </div>
          ) : (
            <div className="bg-card rounded-3xl shadow-2xl overflow-hidden">
              {/* Profile Image Area */}
              <div className="relative h-96 bg-gradient-to-br from-muted via-muted/50 to-background flex items-center justify-center">
                {/* Compatibility Badge */}
                {currentProfile.match_percent !== undefined && currentProfile.match_percent > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className={`bg-gradient-to-r ${getMatchQuality(currentProfile.match_percent).color} text-white px-5 py-2 rounded-full shadow-lg flex items-center space-x-2`}>
                      <Sparkles className="w-5 h-5" />
                      <span className="font-bold text-lg">{currentProfile.match_percent}% Match</span>
                    </div>
                    <div className="mt-2 bg-card px-4 py-1 rounded-full shadow-md">
                      <span className="text-sm font-semibold">{getMatchQuality(currentProfile.match_percent).label}</span>
                    </div>
                  </div>
                )}
                
                {/* Verified Badge */}
                <div className="absolute top-4 right-4 bg-card rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg z-10">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-primary">Verified</span>
                </div>
                
                {/* Profile Image Placeholder */}
                {currentProfile.photos && currentProfile.photos[0] ? (
                  <img
                    src={currentProfile.photos[0]}
                    alt={currentProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-56 h-56 bg-muted rounded-full shadow-2xl flex items-center justify-center">
                    <Users className="w-32 h-32 text-muted-foreground/30" />
                  </div>
                )}

                {/* Navigation */}
                <button 
                  onClick={prevCard}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextCard}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="p-8">
                {/* Name */}
                <div className="mb-6">
                  <h2 className="text-4xl font-bold mb-2">
                    {currentProfile.display_name || currentProfile.name}
                    {currentProfile.age ? `, ${currentProfile.age}` : ''}
                  </h2>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{currentProfile.city}{currentProfile.country ? `, ${currentProfile.country}` : ''}</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentProfile.gender && (
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold">Gender</span>
                      </div>
                      <p className="font-medium">{currentProfile.gender}</p>
                    </div>
                  )}
                  
                  {currentProfile.seeking && (
                    <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="w-5 h-5 text-accent" />
                        <span className="text-sm font-semibold">Seeking</span>
                      </div>
                      <p className="font-medium">{currentProfile.seeking}</p>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-br from-muted to-muted/50 rounded-2xl p-4 col-span-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="w-5 h-5 text-foreground" />
                      <span className="text-sm font-semibold">Location</span>
                    </div>
                    <p className="font-medium">{currentProfile.city}</p>
                  </div>
                </div>

                {/* Bio */}
                {currentProfile.bio && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-3 flex items-center text-lg">
                      <Info className="w-5 h-5 mr-2 text-muted-foreground" />
                      About Me
                    </h3>
                    <p className="text-muted-foreground leading-relaxed bg-muted rounded-2xl p-5">
                      {currentProfile.bio}
                    </p>
                  </div>
                )}

                {/* Interests */}
                {currentProfile.interests && currentProfile.interests.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.interests.map((interest, idx) => (
                        <span key={idx} className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Match Reasons */}
                {currentProfile.match_reasons && currentProfile.match_reasons.length > 0 && (
                  <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-6 mb-6">
                    <h3 className="font-bold mb-4 flex items-center text-lg">
                      <Sparkles className="w-5 h-5 mr-2 text-accent" />
                      Why You Match
                    </h3>
                    <ul className="space-y-3">
                      {currentProfile.match_reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-muted-foreground">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Looking For */}
                {currentProfile.looking_for && (
                  <div className="bg-primary/5 rounded-2xl p-4 mb-8">
                    <p>
                      <span className="font-bold text-primary">Looking for: </span>
                      <span className="text-muted-foreground">{currentProfile.looking_for}</span>
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-6">
                  <button 
                    onClick={handlePass}
                    className="w-20 h-20 bg-card border-4 border-border rounded-full flex items-center justify-center hover:border-destructive hover:bg-destructive/5 transition-all shadow-xl group"
                  >
                    <X className="w-10 h-10 text-muted-foreground group-hover:text-destructive transition-colors" />
                  </button>

                  <button 
                    onClick={handleSuperLike}
                    className="w-20 h-20 bg-card border-4 border-border rounded-full flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all shadow-xl group"
                  >
                    <Star className="w-9 h-9 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>

                  <button 
                    onClick={handleLike}
                    className="w-24 h-24 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center hover:shadow-2xl transition-all shadow-xl transform hover:scale-110"
                  >
                    <Heart className="w-12 h-12 text-primary-foreground fill-current" />
                  </button>

                  <button 
                    onClick={handleMessage}
                    className="w-20 h-20 bg-card border-4 border-border rounded-full flex items-center justify-center hover:border-accent hover:bg-accent/5 transition-all shadow-xl group"
                  >
                    <MessageCircle className="w-9 h-9 text-muted-foreground group-hover:text-accent transition-colors" />
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Profile <span className="font-bold">{currentIndex + 1}</span> of {filteredProfiles.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Match Notification */}
      {showMatchNotification && matches.length > 0 && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-accent to-green-500 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center space-x-4 z-50 animate-in slide-in-from-bottom-5">
          <Heart className="w-8 h-8 fill-current" />
          <div>
            <p className="font-bold text-lg">It's a Match! 🎉</p>
            <p className="text-sm opacity-90">{matches.length} new connection(s)</p>
          </div>
        </div>
      )}
    </div>
  );
}

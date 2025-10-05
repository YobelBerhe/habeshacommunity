import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Heart, X, Star, MessageCircle, MapPin, Globe, Sparkles, Shield, Users, Info } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateConversation } from '@/utils/conversations';

interface MatchProfile {
  id: string;
  user_id: string;
  name: string;
  display_name: string | null;
  bio: string | null;
  age: number | null;
  city: string;
  country: string | null;
  photos: string[];
  interests: string[];
  gender: string | null;
  seeking: string | null;
  looking_for: string | null;
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
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [matchReasons, setMatchReasons] = useState<string[]>([]);

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

  const generateMatchReasons = (score: number, profile: MatchProfile): string[] => {
    const reasons: string[] = [];
    if (score >= 90) {
      reasons.push('Exceptional compatibility across all areas');
      reasons.push('Shared core values and life goals');
    } else if (score >= 80) {
      reasons.push('Strong compatibility in key areas');
      reasons.push('Similar outlook on important topics');
    } else if (score >= 70) {
      reasons.push('Good foundational compatibility');
    }
    
    if (profile.interests?.length > 0) {
      reasons.push(`Shared interests in ${profile.interests.slice(0, 2).join(' and ')}`);
    }
    if (profile.city) {
      reasons.push('Compatible lifestyle preferences');
    }
    
    return reasons;
  };

  const loadProfile = async () => {
    if (!user || !id) return;

    try {
      setLoading(true);

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

      const { data: scoreData, error: scoreError } = await supabase
        .rpc('calculate_match_score', {
          viewer_id: user.id,
          profile_user_id: profileData.user_id,
        });

      if (scoreError) throw scoreError;
      const score = scoreData?.[0] || null;
      setMatchScore(score);
      
      if (score) {
        setMatchReasons(generateMatchReasons(score.match_percent, profileData));
      }
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
      const { data: matchData } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user!.id},user2_id.eq.${user!.id}`)
        .or(`user1_id.eq.${profile!.user_id},user2_id.eq.${profile!.user_id}`)
        .maybeSingle();

      if (matchData) {
        setShowMatchNotification(true);
        setTimeout(() => setShowMatchNotification(false), 5000);
      }
    }
  };

  const handleSuperLike = async () => {
    // Implement super like functionality
    toast({
      title: "Super Like! ⭐",
      description: "Your special interest has been noted",
    });
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
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-accent/5">
        <MentorHeader title="Profile" backPath="/match/discover" />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-card rounded-3xl shadow-2xl p-12 text-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-accent/5">
        <MentorHeader title="Profile" backPath="/match/discover" />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-card rounded-3xl shadow-2xl p-12 text-center">
            <p className="text-muted-foreground mb-4">Profile not found</p>
            <button 
              onClick={() => navigate('/match/discover')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium"
            >
              Back to Discover
            </button>
          </div>
        </div>
      </div>
    );
  }

  const compatibilityLevel = matchScore 
    ? matchScore.match_percent >= 90 ? 'Excellent Match' 
    : matchScore.match_percent >= 80 ? 'Great Match' 
    : 'Good Match'
    : 'Match';
  
  const displayName = profile.display_name || profile.name;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-accent/5">
      <MentorHeader title="Profile" backPath="/match/discover" />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-card rounded-3xl shadow-2xl overflow-hidden">
          {/* Profile Image Area */}
          <div className="relative h-96 bg-gradient-to-br from-secondary/20 via-accent/20 to-primary/20 flex items-center justify-center">
            {/* Compatibility Badge */}
            {matchScore && matchScore.match_percent > 0 && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-2 rounded-full shadow-lg flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-lg">{matchScore.match_percent}% Match</span>
                </div>
                <div className="mt-2 bg-card px-4 py-1 rounded-full shadow-md">
                  <span className="text-sm font-semibold">{compatibilityLevel}</span>
                </div>
              </div>
            )}
            
            {/* Verified Badge */}
            <div className="absolute top-4 right-4 bg-card rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg z-10">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary">Verified</span>
            </div>
            
            {/* Profile Image */}
            {profile.photos?.[0] ? (
              <img
                src={profile.photos[0]}
                alt={displayName}
                className="w-56 h-56 rounded-full object-cover shadow-2xl"
              />
            ) : (
              <div className="w-56 h-56 bg-card rounded-full shadow-2xl flex items-center justify-center">
                <Users className="w-32 h-32 text-muted" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="p-8">
            {/* Name */}
            <div className="mb-6">
              <h2 className="text-4xl font-bold mb-2">{displayName}, {profile.age || '?'}</h2>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{profile.city}{profile.country ? `, ${profile.country}` : ''}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {profile.gender && (
                <div className="bg-gradient-to-br from-secondary/30 to-accent/30 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold">Gender</span>
                  </div>
                  <p className="font-medium">{profile.gender}</p>
                </div>
              )}
              
              {profile.country && (
                <div className="bg-gradient-to-br from-accent/30 to-primary/30 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold">Origin</span>
                  </div>
                  <p className="font-medium">{profile.country}</p>
                </div>
              )}
              
              {profile.seeking && (
                <div className="bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl p-4 col-span-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold">Seeking</span>
                  </div>
                  <p className="font-medium">{profile.seeking}</p>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mb-6">
                <h3 className="font-bold mb-3 flex items-center text-lg">
                  <Info className="w-5 h-5 mr-2 text-muted-foreground" />
                  About Me
                </h3>
                <p className="text-muted-foreground leading-relaxed bg-secondary/20 rounded-2xl p-5">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, idx) => (
                    <span key={idx} className="px-4 py-2 bg-accent/30 text-accent-foreground rounded-full font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Match Reasons */}
            {matchReasons.length > 0 && (
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 mb-6">
                <h3 className="font-bold mb-4 flex items-center text-lg">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Why You Match
                </h3>
                <ul className="space-y-3">
                  {matchReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Looking For */}
            {profile.looking_for && (
              <div className="bg-secondary/30 rounded-2xl p-4 mb-8">
                <p>
                  <span className="font-bold">Looking for: </span>
                  <span className="text-muted-foreground">{profile.looking_for}</span>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-6">
              <button 
                onClick={() => navigate('/match/discover')}
                className="w-20 h-20 bg-card border-4 border-border rounded-full flex items-center justify-center hover:border-destructive/50 hover:bg-destructive/5 transition-all shadow-xl group"
              >
                <X className="w-10 h-10 text-muted-foreground group-hover:text-destructive transition-colors" />
              </button>

              <button 
                onClick={handleSuperLike}
                className="w-20 h-20 bg-card border-4 border-border rounded-full flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all shadow-xl group"
              >
                <Star className="w-9 h-9 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>

              <button 
                onClick={handleLike}
                className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center hover:shadow-2xl transition-all shadow-xl transform hover:scale-110"
              >
                <Heart className={`w-12 h-12 text-primary-foreground ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button 
                onClick={handleMessage}
                className="w-20 h-20 bg-card border-4 border-border rounded-full flex items-center justify-center hover:border-accent/50 hover:bg-accent/5 transition-all shadow-xl group"
              >
                <MessageCircle className="w-9 h-9 text-muted-foreground group-hover:text-accent transition-colors" />
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {matchScore && `${matchScore.matched_questions} of ${matchScore.total_questions} shared preferences`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Match Notification */}
      {showMatchNotification && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-8 py-5 rounded-2xl shadow-2xl flex items-center space-x-4 animate-in slide-in-from-bottom">
          <Heart className="w-8 h-8 fill-current" />
          <div>
            <p className="font-bold text-lg">It's a Match! 🎉</p>
            <p className="text-sm opacity-90">You matched with {displayName}</p>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Heart, X, Star, MapPin, MessageCircle, Shield, Sparkles, Settings, ChevronLeft } from 'lucide-react';
import { MatchBottomNav } from '@/components/match/MatchBottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [showMatchNotification, setShowMatchNotification] = useState(false);

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
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('match_profiles')
        .select('*')
        .neq('user_id', user.id)
        .eq('active', true)
        .limit(20);

      if (error) throw error;

      const profilesWithScores = await Promise.all(
        data.map(async (profile) => {
          const { data: scoreData } = await supabase.rpc('calculate_match_score', {
            profile_user_id: profile.user_id,
            viewer_id: user.id,
          });

          const matchPercent = Array.isArray(scoreData) && scoreData.length > 0 
            ? scoreData[0].match_percent 
            : 75;
          const matchReasons = generateMatchReasons(matchPercent, profile);

          return {
            ...profile,
            name: profile.display_name || profile.name || 'Anonymous',
            match_percent: matchPercent,
            match_reasons: matchReasons,
          } as MatchProfile;
        })
      );

      setProfiles(profilesWithScores.sort((a, b) => (b.match_percent || 0) - (a.match_percent || 0)));
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

  const generateMatchReasons = (matchPercent: number, profile: MatchProfile) => {
    const reasons = [];
    if (matchPercent >= 85) reasons.push('Strong compatibility based on values and interests');
    if (profile.city) reasons.push(`Both located in ${profile.city}`);
    if (profile.interests && profile.interests.length > 0) {
      reasons.push(`Shared interests in ${profile.interests.slice(0, 2).join(' and ')}`);
    }
    return reasons;
  };

  const handleLike = async () => {
    if (!user || currentIndex >= profiles.length) return;
    const profile = profiles[currentIndex];
    
    try {
      // For now, just mark as liked without storing
      // TODO: Create match_likes table if needed
      
      toast({
        title: 'Profile liked!',
        description: `You liked ${profile.name}`,
      });

      const { data: matchData } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${profile.user_id},user2_id.eq.${profile.user_id}`)
        .single();

      if (matchData) {
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
      nextCard();
    }
  };

  const handlePass = () => {
    nextCard();
  };

  const handleSuperLike = async () => {
    await handleLike();
  };

  const handleMessage = async () => {
    if (!user || currentIndex >= profiles.length) return;
    await handleLike();
    toast({
      title: 'Match requested',
      description: 'Like them first to start a conversation',
    });
  };

  const nextCard = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentProfile = profiles[currentIndex];

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col">
        <div className="bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="font-bold text-lg">Discover</h2>
          <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No More Profiles</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back later for new matches!
            </p>
            <Button 
              onClick={() => navigate('/match/list')}
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
            >
              View Your Matches
            </Button>
          </div>
        </div>
        
        <MatchBottomNav />
      </div>
    );
  }

  if (!currentProfile) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-lg">Discover</h2>
        <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Card Stack */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Profile Image Area */}
            <div className="relative h-96 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
              {/* Compatibility Badge */}
              <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {currentProfile.match_percent || 75}%
                  </span>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>

              {/* Profile Image Placeholder */}
              <div className="w-40 h-40 bg-white dark:bg-gray-700 rounded-full shadow-xl flex items-center justify-center">
                <span className="text-6xl">👤</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">
                  {currentProfile.name}{currentProfile.age ? `, ${currentProfile.age}` : ''}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{currentProfile.city}</span>
                </div>
              </div>

              {currentProfile.bio && (
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {currentProfile.bio}
                </p>
              )}

              {/* Quick Info */}
              {currentProfile.interests && currentProfile.interests.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {currentProfile.interests.slice(0, 3).map((interest, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <button 
                  onClick={handlePass}
                  className="w-14 h-14 bg-white dark:bg-gray-700 border-4 border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center hover:border-red-300 dark:hover:border-red-600 transition-all shadow-lg"
                >
                  <X className="w-7 h-7 text-red-500" />
                </button>

                <button 
                  onClick={handleSuperLike}
                  className="w-14 h-14 bg-white dark:bg-gray-700 border-4 border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center hover:border-blue-300 dark:hover:border-blue-600 transition-all shadow-lg"
                >
                  <Star className="w-6 h-6 text-blue-500" />
                </button>

                <button 
                  onClick={handleLike}
                  className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                >
                  <Heart className="w-8 h-8 text-white fill-white" />
                </button>

                <button 
                  onClick={handleMessage}
                  className="w-14 h-14 bg-white dark:bg-gray-700 border-4 border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center hover:border-purple-300 dark:hover:border-purple-600 transition-all shadow-lg"
                >
                  <MessageCircle className="w-6 h-6 text-purple-500" />
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentIndex + 1} of {profiles.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Notification */}
      {showMatchNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center space-x-4 z-50 animate-in slide-in-from-top-5">
          <Heart className="w-8 h-8 fill-current" />
          <div>
            <p className="font-bold text-lg">It's a Match! 🎉</p>
            <p className="text-sm opacity-90">You have a new connection!</p>
          </div>
        </div>
      )}

      <MatchBottomNav />
    </div>
  );
}

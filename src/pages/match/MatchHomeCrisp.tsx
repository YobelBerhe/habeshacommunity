import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, Users, Sparkles, MessageCircle, ChevronRight,
  Shield, Star, Clock, Bell, Settings, Search,
  Zap, Crown, Check
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface MatchStats {
  newLikes: number;
  matches: number;
  unreadMessages: number;
}

interface LikePreview {
  id: string;
  name: string;
  age: number;
  photo: string;
  blurred: boolean;
}

// ============================================
// ACTION CARD COMPONENT
// ============================================

const ActionCard = ({
  icon: Icon,
  title,
  subtitle,
  badge,
  onClick,
  variant = 'default'
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  badge?: number;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'premium';
}) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all",
      variant === 'primary' && "bg-gray-900 text-white",
      variant === 'premium' && "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200",
      variant === 'default' && "bg-white border border-gray-100"
    )}
  >
    <div className={cn(
      "w-12 h-12 rounded-xl flex items-center justify-center",
      variant === 'primary' && "bg-white/20",
      variant === 'premium' && "bg-gradient-to-br from-amber-400 to-orange-500",
      variant === 'default' && "bg-gray-100"
    )}>
      <Icon className={cn(
        "w-6 h-6",
        variant === 'primary' && "text-white",
        variant === 'premium' && "text-white",
        variant === 'default' && "text-gray-600"
      )} />
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h3 className={cn(
          "font-semibold",
          variant === 'primary' ? "text-white" : "text-gray-900"
        )}>
          {title}
        </h3>
        {badge !== undefined && badge > 0 && (
          <span className="min-w-[20px] h-5 px-1.5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>
      <p className={cn(
        "text-sm",
        variant === 'primary' ? "text-white/70" : "text-gray-500"
      )}>
        {subtitle}
      </p>
    </div>
    
    <ChevronRight className={cn(
      "w-5 h-5 flex-shrink-0",
      variant === 'primary' ? "text-white/50" : "text-gray-300"
    )} />
  </motion.button>
);

// ============================================
// LIKE PREVIEW CARD
// ============================================

const LikePreviewCard = ({ like, onClick }: { like: LikePreview; onClick: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="relative flex-shrink-0 w-32 h-44 rounded-2xl overflow-hidden bg-gray-100"
  >
    <img 
      src={like.photo} 
      alt={like.name}
      className={cn(
        "w-full h-full object-cover",
        like.blurred && "blur-lg"
      )}
    />
    
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    
    {/* Name */}
    <div className="absolute bottom-0 left-0 right-0 p-3">
      <p className="text-white font-semibold text-sm">
        {like.blurred ? '???' : like.name}, {like.age}
      </p>
    </div>
    
    {/* Lock icon for blurred */}
    {like.blurred && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">
          <Crown className="w-5 h-5 text-amber-400" />
        </div>
      </div>
    )}
  </motion.button>
);

// ============================================
// FEATURE BADGE
// ============================================

const FeatureBadge = ({ text, icon: Icon }: { text: string; icon: React.ComponentType<{ className?: string }> }) => (
  <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
    <Icon className="w-4 h-4 text-gray-500" />
    <span className="text-sm text-gray-600">{text}</span>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function MatchHomeCrisp() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<MatchStats>({
    newLikes: 0,
    matches: 0,
    unreadMessages: 0
  });
  const [likePreviews, setLikePreviews] = useState<LikePreview[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Check if user has a match profile
      const { data: profile } = await supabase
        .from('match_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      setHasProfile(!!profile);

      // Get stats (simplified)
      const { count: likesCount } = await supabase
        .from('match_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('target_user_id', user.id)
        .eq('action', 'like');

      const { count: matchesCount } = await supabase
        .from('match_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_mutual', true);

      setStats({
        newLikes: likesCount || 3, // Demo fallback
        matches: matchesCount || 2,
        unreadMessages: 1
      });

      // Demo like previews
      setLikePreviews([
        { id: '1', name: 'Sara', age: 27, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300', blurred: true },
        { id: '2', name: 'Meron', age: 29, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300', blurred: true },
        { id: '3', name: 'Helen', age: 26, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300', blurred: true }
      ]);

    } catch (error) {
      console.error('Error loading match data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMatching = async () => {
    if (!user) {
      navigate('/auth/login?redirect=/match/onboarding');
      return;
    }

    if (hasProfile) {
      navigate('/match/discover');
    } else {
      navigate('/match/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-xl font-bold text-gray-900">Match</h1>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/match/preferences')}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6 pb-24">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Find Your Person
          </h2>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto">
            Connect with Habesha singles who share your values, faith, and culture
          </p>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleStartMatching}
            className="w-full py-4 bg-gray-900 text-white font-semibold rounded-2xl mb-4"
          >
            {hasProfile ? 'Start Matching' : 'Create Profile'}
          </motion.button>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <FeatureBadge icon={Shield} text="Verified profiles" />
            <FeatureBadge icon={Users} text="12,847 active" />
          </div>
        </div>

        {/* Likes Section */}
        {stats.newLikes > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-bold text-gray-900">People who like you</h3>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/match/likes')}
                className="text-sm font-medium text-rose-500"
              >
                See all ({stats.newLikes})
              </motion.button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {likePreviews.map(like => (
                <LikePreviewCard 
                  key={like.id} 
                  like={like}
                  onClick={() => navigate('/match/likes')}
                />
              ))}
              
              {/* See more card */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/match/likes')}
                className="flex-shrink-0 w-32 h-44 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200 flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <Heart className="w-6 h-6 text-rose-500" />
                </div>
                <span className="text-sm font-semibold text-rose-600">
                  +{stats.newLikes} more
                </span>
              </motion.button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <ActionCard
            icon={Sparkles}
            title="Discover"
            subtitle="Browse profiles and find your match"
            onClick={() => navigate('/match/discover')}
            variant="primary"
          />
          
          <ActionCard
            icon={Heart}
            title="Likes"
            subtitle="See who's interested in you"
            badge={stats.newLikes}
            onClick={() => navigate('/match/likes')}
          />
          
          <ActionCard
            icon={MessageCircle}
            title="Messages"
            subtitle="Chat with your matches"
            badge={stats.unreadMessages}
            onClick={() => navigate('/inbox')}
          />
          
          <ActionCard
            icon={Users}
            title="Matches"
            subtitle={`${stats.matches} mutual connections`}
            onClick={() => navigate('/match/matches')}
          />
        </div>

        {/* Premium CTA */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/match/premium')}
          className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Upgrade to Premium</h3>
              <p className="text-sm text-gray-500">
                See who likes you, unlimited likes, and more
              </p>
            </div>
            
            <ChevronRight className="w-5 h-5 text-amber-500" />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
              <Check className="w-3 h-3" /> Unlimited likes
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
              <Check className="w-3 h-3" /> See who likes you
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
              <Check className="w-3 h-3" /> Priority matching
            </span>
          </div>
        </motion.button>

        {/* Family Mode CTA */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/match/family-mode')}
          className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900">Family Mode</h3>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                  UNIQUE
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Let your family help find your perfect match
              </p>
            </div>
            
            <ChevronRight className="w-5 h-5 text-purple-500" />
          </div>
        </motion.button>

        {/* Culture-Focused Features */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Made for Habesha</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Verified Profiles</h4>
                <p className="text-sm text-gray-500">Real people, verified identities</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Compatibility Quiz</h4>
                <p className="text-sm text-gray-500">Cultural values and faith-based matching</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Designed to be Deleted</h4>
                <p className="text-sm text-gray-500">Focused on real relationships, not endless swiping</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories Teaser */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/match/success-stories')}
          className="w-full bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-5 text-left"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💍</span>
            <div>
              <h3 className="font-bold text-gray-900">892 Success Stories</h3>
              <p className="text-sm text-gray-500">Real couples who met here</p>
            </div>
          </div>
          
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 border-2 border-white"
              />
            ))}
            <div className="w-10 h-10 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center">
              <span className="text-xs font-semibold text-rose-600">+887</span>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Bottom Navigation will be added by layout */}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

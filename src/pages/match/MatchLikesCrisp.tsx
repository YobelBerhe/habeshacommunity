import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, Crown, ChevronLeft, Filter, Sparkles,
  Check, X
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================
// TYPES
// ============================================

interface LikeProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  city: string;
  photo: string;
  prompt?: { question: string; answer: string };
  likedAt: Date;
  isNew?: boolean;
}

// ============================================
// LIKE CARD COMPONENT
// ============================================

const LikeCard = ({ 
  profile, 
  isPremium,
  onLike,
  onPass,
  onView
}: { 
  profile: LikeProfile;
  isPremium: boolean;
  onLike: () => void;
  onPass: () => void;
  onView: () => void;
}) => {
  const isBlurred = !isPremium;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
    >
      {/* Photo */}
      <div 
        onClick={isPremium ? onView : undefined}
        className={cn(
          "relative aspect-[4/5] bg-gray-100",
          isPremium && "cursor-pointer"
        )}
      >
        <img 
          src={profile.photo} 
          alt={profile.name}
          className={cn(
            "w-full h-full object-cover",
            isBlurred && "blur-xl"
          )}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Name & Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white">
            {isBlurred ? '???' : profile.name}, {profile.age}
          </h3>
          <p className="text-white/80 text-sm">
            {isBlurred ? '???' : profile.city}
          </p>
        </div>
        
        {/* Locked overlay */}
        {isBlurred && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-black/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-white font-semibold">Upgrade to see</p>
            </div>
          </div>
        )}
        
        {/* New badge */}
        {profile.isNew && (
          <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NEW
          </div>
        )}
      </div>
      
      {/* Prompt preview (if available) */}
      {profile.prompt && isPremium && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">{profile.prompt.question}</p>
          <p className="text-sm text-gray-900 line-clamp-2">{profile.prompt.answer}</p>
        </div>
      )}
      
      {/* Action buttons */}
      {isPremium && (
        <div className="flex border-t border-gray-100">
          <button
            onClick={onPass}
            className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="text-sm font-medium">Pass</span>
          </button>
          <div className="w-px bg-gray-100" />
          <button
            onClick={onLike}
            className="flex-1 py-3 flex items-center justify-center gap-2 text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">Like Back</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ============================================
// PREMIUM UPGRADE CARD
// ============================================

const PremiumUpgradeCard = ({ onUpgrade }: { onUpgrade: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 text-center"
  >
    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
      <Crown className="w-8 h-8 text-white" />
    </div>
    
    <h3 className="text-xl font-bold text-gray-900 mb-2">
      See Who Likes You
    </h3>
    <p className="text-gray-600 mb-6">
      Upgrade to Premium to see everyone who's interested in you
    </p>
    
    <div className="space-y-2 mb-6">
      <div className="flex items-center gap-2 text-left">
        <Check className="w-5 h-5 text-amber-500" />
        <span className="text-sm text-gray-700">See all your likes instantly</span>
      </div>
      <div className="flex items-center gap-2 text-left">
        <Check className="w-5 h-5 text-amber-500" />
        <span className="text-sm text-gray-700">Unlimited likes per day</span>
      </div>
      <div className="flex items-center gap-2 text-left">
        <Check className="w-5 h-5 text-amber-500" />
        <span className="text-sm text-gray-700">Priority in discover feed</span>
      </div>
    </div>
    
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onUpgrade}
      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-md"
    >
      Upgrade to Premium
    </motion.button>
  </motion.div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function MatchLikesCrisp() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likes, setLikes] = useState<LikeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadLikes();
    checkPremium();
  }, [user]);

  const loadLikes = async () => {
    setLoading(true);
    
    // Demo data - in production, fetch from Supabase
    const demoLikes: LikeProfile[] = [
      {
        id: '1',
        user_id: 'user1',
        name: 'Sara',
        age: 27,
        city: 'Washington DC',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
        prompt: { question: "I'm looking for", answer: "Someone who values family and can make me laugh" },
        likedAt: new Date(),
        isNew: true
      },
      {
        id: '2',
        user_id: 'user2',
        name: 'Meron',
        age: 29,
        city: 'Silver Spring, MD',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
        prompt: { question: "My simple pleasures", answer: "Sunday brunch and a good book" },
        likedAt: new Date(Date.now() - 86400000),
        isNew: false
      },
      {
        id: '3',
        user_id: 'user3',
        name: 'Helen',
        age: 26,
        city: 'Alexandria, VA',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
        likedAt: new Date(Date.now() - 172800000),
        isNew: false
      }
    ];
    
    setLikes(demoLikes);
    setLoading(false);
  };

  const checkPremium = async () => {
    // In production, check user's subscription status
    setIsPremium(false); // Default to non-premium for demo
  };

  const handleLikeBack = (profile: LikeProfile) => {
    toast.success(`It's a match with ${profile.name}! 🎉`);
    setLikes(prev => prev.filter(l => l.id !== profile.id));
  };

  const handlePass = (profile: LikeProfile) => {
    setLikes(prev => prev.filter(l => l.id !== profile.id));
    toast('Passed', { icon: '👋' });
  };

  const handleViewProfile = (profile: LikeProfile) => {
    navigate(`/match/profile/${profile.user_id}`);
  };

  const handleUpgrade = () => {
    navigate('/match/premium');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => navigate('/match')}
            className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-gray-900">Likes</h1>
            <span className="text-xs text-white bg-rose-500 px-2 py-0.5 rounded-full font-medium">
              {likes.length}
            </span>
          </div>
          
          <button className="p-2 -mr-2 hover:bg-gray-50 rounded-full transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Premium prompt (if not premium) */}
        {!isPremium && likes.length > 0 && (
          <PremiumUpgradeCard onUpgrade={handleUpgrade} />
        )}

        {/* Stats bar */}
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{likes.length}</p>
              <p className="text-sm text-gray-500">people like you</p>
            </div>
          </div>
          
          {!isPremium && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleUpgrade}
              className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-full flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4" />
              Unlock
            </motion.button>
          )}
        </div>

        {/* Likes grid */}
        {likes.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {likes.map(profile => (
              <LikeCard
                key={profile.id}
                profile={profile}
                isPremium={isPremium}
                onLike={() => handleLikeBack(profile)}
                onPass={() => handlePass(profile)}
                onView={() => handleViewProfile(profile)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No likes yet</h3>
            <p className="text-gray-500 mb-6">
              Complete your profile to get more likes
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/match/profile')}
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-full"
            >
              Edit Profile
            </motion.button>
          </div>
        )}

        {/* Tip card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Get more likes</h3>
              <p className="text-sm text-gray-600">
                Profiles with 3+ photos and thoughtful prompts get 40% more likes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

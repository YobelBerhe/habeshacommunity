import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, X, MessageCircle, MapPin, Briefcase, GraduationCap,
  Church, Ruler, Sparkles, Star, Filter,
  ChevronLeft, Shield
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================
// TYPES
// ============================================

interface MatchProfile {
  id: string;
  user_id: string;
  name: string;
  display_name?: string;
  age: number;
  city: string;
  country?: string;
  bio?: string;
  photos: string[];
  interests: string[];
  occupation?: string;
  education?: string;
  religion?: string;
  height?: string;
  looking_for?: string;
  prompts?: { question: string; answer: string }[];
  verified?: boolean;
  distance?: number;
  compatibility?: number;
}

interface LikeAction {
  type: 'like' | 'super_like' | 'comment';
  targetSection?: string;
  comment?: string;
}

// ============================================
// PROMPT CARD COMPONENT
// ============================================

const PromptCard = ({ 
  question, 
  answer, 
  onLike,
  isLiked 
}: { 
  question: string; 
  answer: string; 
  onLike: () => void;
  isLiked?: boolean;
}) => (
  <div className="bg-gray-50 rounded-2xl p-5 relative">
    <p className="text-sm text-gray-500 font-medium mb-2">{question}</p>
    <p className="text-lg text-gray-900 font-medium leading-relaxed">{answer}</p>
    
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={(e) => { e.stopPropagation(); onLike(); }}
      className={cn(
        "absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all",
        isLiked 
          ? "bg-rose-500 text-white" 
          : "bg-white border border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-500"
      )}
    >
      <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
    </motion.button>
  </div>
);

// ============================================
// PHOTO CARD COMPONENT
// ============================================

const PhotoCard = ({ 
  src, 
  alt,
  onLike,
  isLiked,
  showLikeButton = true
}: { 
  src: string; 
  alt: string;
  onLike: () => void;
  isLiked?: boolean;
  showLikeButton?: boolean;
}) => (
  <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4]">
    <img 
      src={src} 
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
    />
    
    {showLikeButton && (
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => { e.stopPropagation(); onLike(); }}
        className={cn(
          "absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg",
          isLiked 
            ? "bg-rose-500 text-white" 
            : "bg-white text-gray-600 hover:text-rose-500"
        )}
      >
        <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
      </motion.button>
    )}
  </div>
);

// ============================================
// INFO ROW COMPONENT
// ============================================

const InfoRow = ({ 
  icon: Icon, 
  text 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  text: string;
}) => (
  <div className="flex items-center gap-2 text-gray-600">
    <Icon className="w-4 h-4 text-gray-400" />
    <span className="text-sm">{text}</span>
  </div>
);

// ============================================
// INTEREST BADGE COMPONENT
// ============================================

const InterestBadge = ({ text }: { text: string }) => (
  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
    {text}
  </span>
);

// ============================================
// EMPTY STATE COMPONENT
// ============================================

const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <Heart className="w-10 h-10 text-gray-300" />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">You've seen everyone</h2>
    <p className="text-gray-500 mb-8 max-w-xs">
      Check back later or adjust your preferences to see more profiles
    </p>
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onReset}
      className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-full"
    >
      Adjust Preferences
    </motion.button>
  </div>
);

// ============================================
// MATCH CELEBRATION COMPONENT
// ============================================

const MatchCelebration = ({ 
  profile, 
  onClose, 
  onMessage 
}: { 
  profile: MatchProfile; 
  onClose: () => void; 
  onMessage: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-24 h-24 mx-auto mb-6 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full animate-pulse" />
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10 text-rose-500 fill-current" />
        </div>
      </motion.div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">It's a Match!</h2>
      <p className="text-gray-500 mb-6">
        You and {profile.name} liked each other
      </p>
      
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-full"
        >
          Keep Swiping
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onMessage}
          className="flex-1 py-3 bg-gray-900 text-white font-semibold rounded-full"
        >
          Say Hello
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

// ============================================
// HEADER COMPONENT
// ============================================

const Header = ({ 
  onBack, 
  onFilter,
  profileCount 
}: { 
  onBack: () => void; 
  onFilter: () => void;
  profileCount?: string;
}) => (
  <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
    <div className="flex items-center justify-between h-14 px-4">
      <button
        onClick={onBack}
        className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>
      
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold text-gray-900">Discover</h1>
        {profileCount && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {profileCount}
          </span>
        )}
      </div>
      
      <button
        onClick={onFilter}
        className="p-2 -mr-2 hover:bg-gray-50 rounded-full transition-colors"
      >
        <Filter className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function MatchDiscoverCrisp() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedSections, setLikedSections] = useState<Set<string>>(new Set());
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<MatchProfile | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Default prompts for profiles without prompts
  const defaultPrompts = [
    { question: "I'm looking for", answer: "Someone who values family, faith, and building a future together." },
    { question: "A life goal of mine", answer: "To make a positive impact in my community while growing professionally." },
    { question: "I geek out on", answer: "Ethiopian history, good coffee, and trying new restaurants." }
  ];

  useEffect(() => {
    loadProfiles();
  }, [user]);

  const loadProfiles = async () => {
    if (!user) {
      // Demo profiles for non-authenticated users
      setProfiles(getDemoProfiles());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch profiles from Supabase
      const { data, error } = await supabase
        .from('match_profiles')
        .select('*')
        .eq('active', true)
        .neq('user_id', user.id)
        .limit(20);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedProfiles: MatchProfile[] = data.map(p => ({
          id: p.id,
          user_id: p.user_id,
          name: p.display_name || p.name,
          age: p.age || 25,
          city: p.city,
          country: p.country || 'USA',
          bio: p.bio,
          photos: p.photos || ['/placeholder.svg'],
          interests: p.interests || [],
          looking_for: p.looking_for,
          prompts: defaultPrompts
        }));
        setProfiles(formattedProfiles);
      } else {
        setProfiles(getDemoProfiles());
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      setProfiles(getDemoProfiles());
    } finally {
      setLoading(false);
    }
  };

  const getDemoProfiles = (): MatchProfile[] => [
    {
      id: '1',
      user_id: 'demo1',
      name: 'Sara',
      age: 27,
      city: 'Washington DC',
      bio: 'Love hiking, coffee, and meaningful conversations. Looking for someone who values family and has ambition.',
      photos: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600'
      ],
      interests: ['Hiking', 'Coffee', 'Travel', 'Music', 'Reading'],
      occupation: 'Software Engineer',
      education: 'Masters Degree',
      religion: 'Orthodox Christian',
      height: '5\'6"',
      looking_for: 'Relationship',
      prompts: [
        { question: "I'm looking for", answer: "Someone who can make me laugh and isn't afraid to be vulnerable." },
        { question: "A life goal of mine", answer: "To visit all 7 continents and start my own tech company." },
        { question: "The way to win me over", answer: "Good coffee, deep conversations, and a genuine smile." }
      ],
      verified: true,
      distance: 5,
      compatibility: 94
    },
    {
      id: '2',
      user_id: 'demo2',
      name: 'Meron',
      age: 29,
      city: 'Silver Spring, MD',
      bio: 'Passionate about fitness, food, and family. Seeking genuine connection.',
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600'
      ],
      interests: ['Fitness', 'Cooking', 'Reading', 'Yoga', 'Photography'],
      occupation: 'Marketing Manager',
      education: 'Bachelors Degree',
      religion: 'Orthodox Christian',
      height: '5\'5"',
      looking_for: 'Relationship',
      prompts: [
        { question: "My simple pleasures", answer: "Sunday brunch with friends, a good book, and sunset walks." },
        { question: "I want someone who", answer: "Values honesty, has ambition, and loves their family." },
        { question: "Together, we could", answer: "Build something beautiful and travel the world." }
      ],
      verified: true,
      distance: 12,
      compatibility: 89
    },
    {
      id: '3',
      user_id: 'demo3',
      name: 'Helen',
      age: 26,
      city: 'Alexandria, VA',
      bio: 'Creative soul with a love for art and culture.',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600'
      ],
      interests: ['Art', 'Music', 'Culture', 'Dance', 'Film'],
      occupation: 'Graphic Designer',
      education: 'Bachelors Degree',
      religion: 'Orthodox Christian',
      height: '5\'4"',
      looking_for: 'Relationship',
      prompts: [
        { question: "I'm convinced that", answer: "The best memories are made spontaneously." },
        { question: "My love language is", answer: "Quality time and words of affirmation." },
        { question: "Dating me is like", answer: "Having your best friend who also challenges you to grow." }
      ],
      verified: false,
      distance: 8,
      compatibility: 85
    }
  ];

  const currentProfile = profiles[currentIndex];

  const handleLike = async (action: LikeAction = { type: 'like' }) => {
    if (!currentProfile) return;

    // Record the interaction
    if (user) {
      try {
        const { error } = await supabase
          .from('match_interactions')
          .insert({
            user_id: user.id,
            target_user_id: currentProfile.user_id,
            action: action.type,
            comment: action.comment
          });

        if (error) throw error;

        // Check if it's a mutual match (simplified - in real app, check database)
        const isMutual = Math.random() > 0.7; // 30% chance for demo
        
        if (isMutual) {
          setMatchedProfile(currentProfile);
          setShowMatch(true);
          return;
        }
      } catch (error) {
        console.error('Error recording interaction:', error);
      }
    }

    // Move to next profile
    setSwipeDirection('right');
    toast.success(`You liked ${currentProfile.name}`, {
      icon: '❤️'
    });
    
    setTimeout(() => {
      setSwipeDirection(null);
      goToNext();
    }, 300);
  };

  const handlePass = () => {
    if (!currentProfile) return;

    setSwipeDirection('left');
    
    setTimeout(() => {
      setSwipeDirection(null);
      goToNext();
    }, 300);
  };

  const goToNext = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setLikedSections(new Set());
    }
  };

  const handleSectionLike = (sectionId: string) => {
    setLikedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleMatchClose = () => {
    setShowMatch(false);
    setMatchedProfile(null);
    goToNext();
  };

  const handleMatchMessage = () => {
    setShowMatch(false);
    if (matchedProfile) {
      navigate(`/inbox?match=${matchedProfile.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-white">
        <Header onBack={() => navigate('/match')} onFilter={() => navigate('/match/preferences')} />
        <EmptyState onReset={() => navigate('/match/preferences')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header 
        onBack={() => navigate('/match')} 
        onFilter={() => navigate('/match/preferences')}
        profileCount={`${currentIndex + 1}/${profiles.length}`}
      />

      {/* Profile Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProfile.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ 
            opacity: 1, 
            x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0 
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 pb-32"
        >
          {/* Main Photo */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
            <img 
              src={currentProfile.photos[0]} 
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Profile info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold">{currentProfile.name}, {currentProfile.age}</h1>
                {currentProfile.verified && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span>{currentProfile.city}</span>
                {currentProfile.distance && (
                  <span className="text-white/70">• {currentProfile.distance} mi away</span>
                )}
              </div>
            </div>

            {/* Compatibility badge */}
            {currentProfile.compatibility && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-gray-900">{currentProfile.compatibility}% Match</span>
              </div>
            )}
          </div>

          {/* Profile Sections */}
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                {currentProfile.occupation && (
                  <InfoRow icon={Briefcase} text={currentProfile.occupation} />
                )}
                {currentProfile.education && (
                  <InfoRow icon={GraduationCap} text={currentProfile.education} />
                )}
                {currentProfile.religion && (
                  <InfoRow icon={Church} text={currentProfile.religion} />
                )}
                {currentProfile.height && (
                  <InfoRow icon={Ruler} text={currentProfile.height} />
                )}
              </div>
            </div>

            {/* Bio */}
            {currentProfile.bio && (
              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-gray-700 leading-relaxed">{currentProfile.bio}</p>
              </div>
            )}

            {/* Second Photo */}
            {currentProfile.photos[1] && (
              <PhotoCard 
                src={currentProfile.photos[1]} 
                alt={`${currentProfile.name} photo 2`}
                onLike={() => handleSectionLike('photo2')}
                isLiked={likedSections.has('photo2')}
              />
            )}

            {/* Prompts */}
            {currentProfile.prompts?.map((prompt, index) => (
              <PromptCard
                key={index}
                question={prompt.question}
                answer={prompt.answer}
                onLike={() => handleSectionLike(`prompt${index}`)}
                isLiked={likedSections.has(`prompt${index}`)}
              />
            ))}

            {/* Third Photo */}
            {currentProfile.photos[2] && (
              <PhotoCard 
                src={currentProfile.photos[2]} 
                alt={`${currentProfile.name} photo 3`}
                onLike={() => handleSectionLike('photo3')}
                isLiked={likedSections.has('photo3')}
              />
            )}

            {/* Interests */}
            {currentProfile.interests && currentProfile.interests.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="text-sm text-gray-500 font-medium mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, index) => (
                    <InterestBadge key={index} text={interest} />
                  ))}
                </div>
              </div>
            )}

            {/* Looking For */}
            {currentProfile.looking_for && (
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-100">
                <h3 className="text-sm text-rose-600 font-medium mb-1">Looking for</h3>
                <p className="text-gray-900 font-medium">{currentProfile.looking_for}</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 safe-area-bottom">
        <div className="flex items-center justify-center gap-6 max-w-md mx-auto">
          {/* Pass Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePass}
            className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm"
          >
            <X className="w-8 h-8 text-gray-400" />
          </motion.button>

          {/* Super Like Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleLike({ type: 'super_like' })}
            className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Star className="w-7 h-7 text-white" />
          </motion.button>

          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleLike({ type: 'like' })}
            className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl"
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.button>

          {/* Comment Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toast.info('Comment on a photo or prompt first!')}
            className="w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm"
          >
            <MessageCircle className="w-7 h-7 text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Match Celebration */}
      <AnimatePresence>
        {showMatch && matchedProfile && (
          <MatchCelebration
            profile={matchedProfile}
            onClose={handleMatchClose}
            onMessage={handleMatchMessage}
          />
        )}
      </AnimatePresence>

      <style>{`
        .safe-area-bottom {
          padding-bottom: max(env(safe-area-inset-bottom), 16px);
        }
      `}</style>
    </div>
  );
}

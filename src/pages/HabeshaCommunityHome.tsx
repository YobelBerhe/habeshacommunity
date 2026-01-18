import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, User, ChevronRight, MapPin, 
  Heart, Users, ShoppingBag, GraduationCap, 
  Activity, Church, Calendar, Flame, Star,
  MessageCircle, Home as HomeIcon, Wallet,
  Grid3X3, X, ArrowRight, Sparkles, TrendingUp,
  BookOpen, Dumbbell, UtensilsCrossed, Moon,
  Menu, Compass, History
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LocationScopeProvider } from '@/contexts/LocationScopeContext';
import LocationScopeBanner from '@/components/LocationScopeBanner';

// ============================================
// CUSTOM SVG SERVICE ICONS (Grab-style)
// ============================================

const HealthIcon = () => (
  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 38L12 26C8 22 8 16 12 12C16 8 22 8 24 14C26 8 32 8 36 12C40 16 40 22 36 26L24 38Z" fill="#10B981" />
      <path d="M20 22H28M24 18V26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
);

const MatchIcon = () => (
  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="7" fill="#EC4899" />
      <circle cx="30" cy="18" r="7" fill="#F472B6" />
      <path d="M24 38L14 28C11 25 11 20 14 17L24 27L34 17C37 20 37 25 34 28L24 38Z" fill="#EC4899" />
    </svg>
  </div>
);

const MarketIcon = () => (
  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="18" width="24" height="20" fill="#10B981" rx="2" />
      <path d="M16 16V12C16 9.79 17.79 8 20 8H28C30.21 8 32 9.79 32 12V16" stroke="#F97316" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="12" r="2" fill="#F97316" />
      <rect x="15" y="22" width="5" height="5" fill="#6EE7B7" rx="1" />
      <rect x="21.5" y="22" width="5" height="5" fill="#6EE7B7" rx="1" />
      <rect x="28" y="22" width="5" height="5" fill="#6EE7B7" rx="1" />
      <rect x="15" y="29" width="5" height="5" fill="#6EE7B7" rx="1" />
      <rect x="21.5" y="29" width="5" height="5" fill="#6EE7B7" rx="1" />
      <rect x="28" y="29" width="5" height="5" fill="#6EE7B7" rx="1" />
    </svg>
  </div>
);

const MentorIcon = () => (
  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="16" r="8" fill="#8B5CF6" />
      <path d="M12 40C12 30 17 26 24 26C31 26 36 30 36 40" fill="#A78BFA" />
      <path d="M20 14L24 10L28 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="16" r="3" fill="white" />
    </svg>
  </div>
);

const CommunityIcon = () => (
  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="16" r="6" fill="#3B82F6" />
      <circle cx="14" cy="22" r="5" fill="#60A5FA" />
      <circle cx="34" cy="22" r="5" fill="#60A5FA" />
      <path d="M8 42C8 34 12 30 18 30" fill="#93C5FD" />
      <path d="M40 42C40 34 36 30 30 30" fill="#93C5FD" />
      <path d="M14 42C14 32 18 28 24 28C30 28 34 32 34 42" fill="#3B82F6" />
    </svg>
  </div>
);

const SpiritualIcon = () => (
  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="8" width="24" height="32" rx="2" fill="#F59E0B" />
      <rect x="14" y="10" width="20" height="28" rx="1" fill="#FEF3C7" />
      <path d="M24 14V26M20 20H28" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 32H30" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 35H26" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
);

const ChurchIcon = () => (
  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6V12" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 9H28" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 40V24L24 16L32 24V40H16Z" fill="#FEE2E2" />
      <path d="M12 40V28L24 18L36 28V40H12Z" fill="#DC2626" />
      <rect x="21" y="32" width="6" height="8" fill="#7F1D1D" />
      <circle cx="24" cy="26" r="3" fill="#FEE2E2" />
    </svg>
  </div>
);

const AllServicesIcon = () => (
  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
    <div className="grid grid-cols-2 gap-0.5 sm:gap-1">
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-emerald-600 rounded-sm sm:rounded-md"></div>
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-emerald-500 rounded-sm sm:rounded-md"></div>
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-emerald-500 rounded-sm sm:rounded-md"></div>
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-emerald-600 rounded-sm sm:rounded-md"></div>
    </div>
  </div>
);

// Quick action icons
const WalletIconSmall = () => (
  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
    <Wallet className="w-4 h-4 text-white" />
  </div>
);

const HeartIconSmall = () => (
  <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
    <Heart className="w-4 h-4 text-white" fill="white" />
  </div>
);

const PointsIconSmall = () => (
  <div className="w-8 h-8 flex items-center justify-center">
    <span className="text-xl">✨</span>
  </div>
);

// ============================================
// TYPES & CONSTANTS
// ============================================

interface ServiceTile {
  id: string;
  name: string;
  icon: React.FC;
  href: string;
  bgColor: string;
}

const MAIN_SERVICES: ServiceTile[] = [
  { id: 'health', name: 'Health', icon: HealthIcon, href: '/health', bgColor: 'bg-emerald-50' },
  { id: 'match', name: 'Match', icon: MatchIcon, href: '/match', bgColor: 'bg-pink-50' },
  { id: 'marketplace', name: 'Market', icon: MarketIcon, href: '/marketplace', bgColor: 'bg-orange-50' },
  { id: 'mentor', name: 'Mentor', icon: MentorIcon, href: '/mentor', bgColor: 'bg-purple-50' },
  { id: 'community', name: 'Community', icon: CommunityIcon, href: '/community', bgColor: 'bg-blue-50' },
  { id: 'spiritual', name: 'Spiritual', icon: SpiritualIcon, href: '/spiritual', bgColor: 'bg-amber-50' },
  { id: 'churches', name: 'Churches', icon: ChurchIcon, href: '/church', bgColor: 'bg-red-50' },
  { id: 'all', name: 'All', icon: AllServicesIcon, href: '#all', bgColor: 'bg-white shadow-sm' }
];

// Extended services for drawer
const EXTENDED_SERVICES: ServiceTile[] = [
  { id: 'events', name: 'Events', icon: () => <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />, href: '/community/events', bgColor: 'bg-rose-50' },
  { id: 'forums', name: 'Forums', icon: () => <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />, href: '/community/forums', bgColor: 'bg-cyan-50' },
  { id: 'nutrition', name: 'Nutrition', icon: () => <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />, href: '/health/nutrition', bgColor: 'bg-green-50' },
  { id: 'fitness', name: 'Fitness', icon: () => <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />, href: '/health/fitness', bgColor: 'bg-red-50' },
  { id: 'fasting', name: 'Fasting', icon: () => <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />, href: '/health/fasting', bgColor: 'bg-violet-50' }
];

// Featured promos/restaurants data
const PROMO_CARDS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    title: 'Ethiopian Cuisine Festival',
    subtitle: 'Enjoy 15% off traditional dishes',
    tag: 'Featured',
    tagColor: 'bg-emerald-500'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    title: 'Habesha Food Week',
    subtitle: 'Special discounts on injera platters',
    tag: 'New',
    tagColor: 'bg-orange-500'
  }
];

const FEATURED_PLACES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
    name: 'Addis Kitchen',
    discount: '33% OFF',
    rating: 4.8
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
    name: 'Habesha Grill',
    discount: 'Up to 15% OFF',
    rating: 4.6
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop',
    name: 'Eritrean Cafe',
    discount: '10% OFF',
    rating: 4.5
  }
];

const RECOMMENDED_PLACES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
    name: 'Mesob Restaurant',
    cuisine: 'Ethiopian'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop',
    name: 'Axum Coffee House',
    cuisine: 'Coffee & Pastries'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop',
    name: 'Selam Bistro',
    cuisine: 'Fusion'
  }
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function HabeshaCommunityHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAllServices, setShowAllServices] = useState(false);
  const [points, setPoints] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUnreadCounts();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    const { data: pointsData } = await supabase
      .from('user_points')
      .select('total_points')
      .eq('user_id', user.id)
      .single();
    
    if (pointsData) setPoints(pointsData.total_points || 0);
  };

  const fetchUnreadCounts = async () => {
    if (!user) return;

    const { count: messagesCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .neq('sender_id', user.id)
      .eq('read', false);

    setUnreadMessages(messagesCount || 0);

    const { count: notificationsCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    setUnreadNotifications(notificationsCount || 0);
  };

  const handleServiceClick = (service: ServiceTile) => {
    if (service.id === 'all') {
      setShowAllServices(true);
    } else {
      navigate(service.href);
    }
  };

  return (
    <LocationScopeProvider>
    <div className="min-h-screen w-full bg-gray-50 flex flex-col font-sans">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-b from-emerald-500 to-emerald-400 pb-4 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-3 lg:pt-4 pb-4 flex items-center gap-3 lg:gap-4">
          {/* Menu icon - hidden on desktop */}
          <button className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center lg:hidden">
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
          </button>
          
          {/* Logo for desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-emerald-600 font-bold text-xl">H</span>
            </div>
            <span className="text-white font-bold text-xl">Habesha Community</span>
          </div>
          
          {/* Search bar */}
          <div className="flex-1 max-w-2xl bg-white rounded-xl h-10 sm:h-12 flex items-center px-4 gap-3 shadow-sm">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Habesha Community"
              className="flex-1 bg-transparent border-none outline-none text-gray-600 placeholder-gray-400 text-sm sm:text-base"
            />
          </div>
          
          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            <button 
              onClick={() => navigate('/browse')}
              className="text-white/90 hover:text-white font-medium text-sm"
            >
              Discover
            </button>
            <button 
              onClick={() => navigate('/inbox')}
              className="relative text-white/90 hover:text-white font-medium text-sm"
            >
              Messages
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </button>
            <button 
              onClick={() => navigate('/notifications')}
              className="relative text-white/90 hover:text-white font-medium text-sm"
            >
              Activity
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
          </div>
          
          {/* Profile icon */}
          <button 
            onClick={() => navigate('/account/dashboard')}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Main scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Services Grid - 4 columns on mobile, 8 on desktop */}
          <div className="bg-white px-3 sm:px-4 lg:px-8 pt-6 pb-6">
            <div className="services-grid">
              {MAIN_SERVICES.map((service) => {
                const IconComponent = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service)}
                    className="flex flex-col items-center gap-1 sm:gap-1.5 lg:gap-2 group min-w-0"
                  >
                    <div className={cn(
                      "w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0",
                      service.bgColor
                    )}>
                      <IconComponent />
                    </div>
                    <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-gray-900 text-center truncate w-full">{service.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop: Two column layout */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:px-8">
            {/* Main content area */}
            <div className="lg:col-span-2">
              {/* Quick Action Cards - horizontal scroll on mobile, grid on desktop */}
              <div className="py-4 px-4 lg:px-0 overflow-hidden">
                <div className="flex flex-nowrap gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 lg:mx-0 lg:overflow-visible lg:grid lg:grid-cols-3 scrollbar-hide">
                  {/* Points Card */}
                  <div className="flex-shrink-0 min-w-[140px] w-[140px] lg:w-auto lg:min-w-0 snap-start bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">{points}</span>
                      <PointsIconSmall />
                    </div>
                  </div>

                  {/* Find Match Card */}
                  <button
                    onClick={() => navigate('/match')}
                    className="flex-shrink-0 min-w-[160px] w-[160px] lg:w-auto lg:min-w-0 snap-start bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Discover</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-bold text-gray-900">Find Match</span>
                      <HeartIconSmall />
                    </div>
                  </button>

                  {/* Donate Card */}
                  <button className="flex-shrink-0 min-w-[160px] w-[160px] lg:w-auto lg:min-w-0 snap-start bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Support</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-bold text-gray-900">Donate</span>
                      <WalletIconSmall />
                    </div>
                  </button>
                </div>
              </div>

              {/* Hero Banner Section */}
              <div className="relative mt-2 lg:mt-4 overflow-hidden bg-gradient-to-b from-emerald-100 via-emerald-50 to-amber-50 min-h-[280px] sm:min-h-[340px] lg:rounded-2xl">
                {/* Ethiopian Pattern Decoration */}
                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 opacity-20">
                  <svg viewBox="0 0 200 200" fill="none">
                    <pattern id="ethiopian" patternUnits="userSpaceOnUse" width="40" height="40">
                      <path d="M20 0L40 20L20 40L0 20Z" fill="#10B981" />
                      <circle cx="20" cy="20" r="5" fill="#059669" />
                    </pattern>
                    <rect width="200" height="200" fill="url(#ethiopian)" />
                  </svg>
                </div>

                {/* Content */}
                <div className="relative z-10 px-4 sm:px-6 pt-6 sm:pt-8">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Connect with your roots</h2>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">Find mentors, matches & community events</p>

                  {/* Promo Cards - horizontal scroll */}
                  <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 scrollbar-hide">
                    {/* Card 1 - Match */}
                    <button 
                      onClick={() => navigate('/match')}
                      className="flex-shrink-0 w-40 sm:w-48 lg:w-52 h-28 sm:h-32 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm text-left hover:scale-[1.02] transition-transform"
                    >
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Find Your</h3>
                        <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Perfect Match</h3>
                      </div>
                      <div className="flex justify-end">
                        <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" fill="currentColor" />
                      </div>
                    </button>

                    {/* Card 2 - Mentor */}
                    <button 
                      onClick={() => navigate('/mentor')}
                      className="flex-shrink-0 w-40 sm:w-48 lg:w-52 h-28 sm:h-32 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm text-left hover:scale-[1.02] transition-transform"
                    >
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Book a</h3>
                        <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Mentor Session</h3>
                      </div>
                      <div className="flex justify-end">
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" />
                      </div>
                    </button>

                    {/* Card 3 - Community */}
                    <button 
                      onClick={() => navigate('/community/events')}
                      className="flex-shrink-0 w-40 sm:w-48 lg:w-52 h-28 sm:h-32 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm text-left hover:scale-[1.02] transition-transform"
                    >
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Upcoming</h3>
                        <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Events Near You</h3>
                      </div>
                      <div className="flex justify-end">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Location banner moved to fixed position above bottom nav */}

              {/* ============================================ */}
              {/* SECONDARY CONTENT SECTIONS - Below the fold */}
              {/* ============================================ */}

              {/* Featured Promos Section - Horizontal Scroll */}
              <div className="px-4 lg:px-0 py-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Learn More</h3>
                  <button className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
                    <span>Star</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-row flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-2 lg:mx-0 lg:px-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {PROMO_CARDS.map((promo) => (
                    <div key={promo.id} className="flex-shrink-0 w-72 sm:w-80 lg:w-[calc(50%-0.5rem)] snap-start">
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                        <img 
                          src={promo.image} 
                          alt={promo.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <span className={cn("px-2 py-0.5 rounded text-xs font-semibold text-white mb-2 inline-block", promo.tagColor)}>
                            {promo.tag}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{promo.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">Ad · {promo.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eating Out / Featured Places Section */}
              <div className="px-4 lg:px-0 py-6 bg-white lg:bg-transparent lg:rounded-2xl">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  Eating out? Explore Community Spots
                </h3>
                
                <div className="flex flex-row flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-2 lg:mx-0 lg:px-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {FEATURED_PLACES.map((place) => (
                    <div key={place.id} className="flex-shrink-0 w-40 sm:w-48 snap-start">
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                        <img 
                          src={place.image} 
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white font-semibold text-sm truncate">{place.name}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-orange-500 font-bold text-sm">{place.discount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restaurants You May Like Section */}
              <div className="px-4 lg:px-0 py-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Places you may like</h3>
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <ArrowRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <div className="flex flex-row flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-2 lg:mx-0 lg:px-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {RECOMMENDED_PLACES.map((place) => (
                    <div key={place.id} className="flex-shrink-0 w-40 sm:w-48 snap-start">
                      <div className="rounded-2xl overflow-hidden aspect-square">
                        <img 
                          src={place.image} 
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{place.name}</h4>
                        <p className="text-xs text-gray-500">{place.cuisine}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Desktop only */}
            <div className="hidden lg:block lg:col-span-1 space-y-4">
            {/* Desktop only Location Scope */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <LocationScopeBanner className="lg:rounded-2xl" />
            </div>
            
            {/* Quick Links */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/match')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Find Match</p>
                      <p className="text-xs text-gray-500">Connect with someone special</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigate('/mentor')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Book Mentor</p>
                      <p className="text-xs text-gray-500">Get career guidance</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigate('/community/events')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Events</p>
                      <p className="text-xs text-gray-500">Join community gatherings</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-4">Your Activity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-bold">{points}</p>
                    <p className="text-emerald-100 text-sm">Points</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-emerald-100 text-sm">Connections</p>
                  </div>
                </div>
              </div>

              {/* Community Banner */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Join the Community</p>
                    <p className="text-xs text-gray-500">50K+ members</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/community')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition-colors"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>

          {/* Bottom spacing for nav + location banner - mobile only */}
          <div className="h-36 lg:h-8" />
        </div>
      </div>

      {/* Fixed Location Scope Banner - Above bottom nav on mobile */}
      <div className="fixed bottom-[72px] left-0 right-0 z-30 lg:hidden safe-area-bottom-banner">
        <LocationScopeBanner />
      </div>

      {/* Bottom Navigation - Mobile only with 5 items inline */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden safe-area-bottom">
        <div className="max-w-md mx-auto flex items-center justify-around px-1 pt-2 pb-2">
          {/* Home */}
          <button className="flex flex-col items-center gap-0.5 px-2 min-w-0">
            <div className="relative">
              <HomeIcon className="w-5 h-5 text-emerald-600" fill="currentColor" />
            </div>
            <span className="text-[10px] font-medium text-emerald-600">Home</span>
          </button>

          {/* Discover */}
          <button 
            onClick={() => navigate('/browse')}
            className="flex flex-col items-center gap-0.5 px-2 min-w-0"
          >
            <Compass className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Discover</span>
          </button>

          {/* Messages - inline with others */}
          <button 
            onClick={() => navigate('/inbox')}
            className="flex flex-col items-center gap-0.5 px-2 min-w-0"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5 text-gray-400" />
              {unreadMessages > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </div>
            <span className="text-[10px] font-medium text-gray-500">Messages</span>
          </button>

          {/* Activity */}
          <button 
            onClick={() => navigate('/notifications')}
            className="flex flex-col items-center gap-0.5 px-2 min-w-0"
          >
            <div className="relative">
              <History className="w-5 h-5 text-gray-400" />
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </div>
            <span className="text-[10px] font-medium text-gray-500">Activity</span>
          </button>

          {/* Account */}
          <button 
            onClick={() => navigate('/account/dashboard')}
            className="flex flex-col items-center gap-0.5 px-2 min-w-0"
          >
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Account</span>
          </button>
        </div>
      </div>

      {/* All Services Bottom Sheet */}
      <AnimatePresence>
        {showAllServices && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAllServices(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-w-2xl mx-auto max-h-[85vh] overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
                
                {/* Close button */}
                <button
                  onClick={() => setShowAllServices(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">All Services</h2>
                
                {/* Main Services */}
                <div className="grid grid-cols-4 gap-3 sm:gap-4 pb-6">
                  {MAIN_SERVICES.filter(s => s.id !== 'all').map((service) => {
                    const IconComponent = service.icon;
                    return (
                      <button
                        key={service.id}
                        onClick={() => {
                          setShowAllServices(false);
                          navigate(service.href);
                        }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className={cn(
                          "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center",
                          service.bgColor
                        )}>
                          <IconComponent />
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700">{service.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Extended Services */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-4">More Services</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4 pb-8">
                    {EXTENDED_SERVICES.map((service) => {
                      const IconComponent = service.icon;
                      return (
                        <button
                          key={service.id}
                          onClick={() => {
                            setShowAllServices(false);
                            navigate(service.href);
                          }}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className={cn(
                            "w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center",
                            service.bgColor
                          )}>
                            <IconComponent />
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-medium text-gray-700">{service.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem 0.25rem;
        }
        @media (min-width: 640px) {
          .services-grid {
            gap: 1rem 0.5rem;
          }
        }
        @media (min-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(8, minmax(0, 1fr));
            gap: 1.5rem;
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .safe-area-bottom {
          padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
        }
        .safe-area-bottom-banner {
          /* Position above the bottom nav which is ~72px */
        }
      `}</style>
    </div>
    </LocationScopeProvider>
  );
}

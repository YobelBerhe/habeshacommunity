import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, User, ChevronRight, MapPin, 
  Heart, Users, ShoppingBag, GraduationCap, 
  Activity, Church, Calendar, Flame, Star,
  MessageCircle, Home as HomeIcon, Wallet,
  Grid3X3, X, ArrowRight, Sparkles, TrendingUp,
  BookOpen, Dumbbell, UtensilsCrossed, Moon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ============================================
// TYPES & CONSTANTS
// ============================================

interface ServiceTile {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgColor: string;
  description?: string;
}

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

interface ActivityItem {
  id: string;
  type: 'match' | 'event' | 'mentor' | 'health' | 'spiritual' | 'marketplace';
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
}

// Main 6 Pillars - Primary Services
const MAIN_SERVICES: ServiceTile[] = [
  {
    id: 'health',
    name: 'Health',
    icon: <Activity className="w-8 h-8" />,
    href: '/health',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Track nutrition, fitness & fasting'
  },
  {
    id: 'match',
    name: 'Match',
    icon: <Heart className="w-8 h-8" />,
    href: '/match',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Find your soulmate'
  },
  {
    id: 'marketplace',
    name: 'Market',
    icon: <ShoppingBag className="w-8 h-8" />,
    href: '/marketplace',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    description: 'Buy, sell & find jobs'
  },
  {
    id: 'mentor',
    name: 'Mentor',
    icon: <GraduationCap className="w-8 h-8" />,
    href: '/mentor',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Learn from experts'
  },
  {
    id: 'community',
    name: 'Community',
    icon: <Users className="w-8 h-8" />,
    href: '/community',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Events, forums & groups'
  },
  {
    id: 'spiritual',
    name: 'Spiritual',
    icon: <BookOpen className="w-8 h-8" />,
    href: '/spiritual',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Bible, prayers & plans'
  },
  {
    id: 'churches',
    name: 'Churches',
    icon: <Church className="w-8 h-8" />,
    href: '/churches',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Find Habesha churches'
  },
  {
    id: 'all',
    name: 'All',
    icon: <Grid3X3 className="w-8 h-8" />,
    href: '#all',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    description: 'View all services'
  }
];

// Extended services for "All" drawer
const ALL_SERVICES: ServiceTile[] = [
  ...MAIN_SERVICES.filter(s => s.id !== 'all'),
  {
    id: 'events',
    name: 'Events',
    icon: <Calendar className="w-7 h-7" />,
    href: '/community/events',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50'
  },
  {
    id: 'forums',
    name: 'Forums',
    icon: <MessageCircle className="w-7 h-7" />,
    href: '/community/forums',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50'
  },
  {
    id: 'nutrition',
    name: 'Nutrition',
    icon: <UtensilsCrossed className="w-7 h-7" />,
    href: '/health/nutrition',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: <Dumbbell className="w-7 h-7" />,
    href: '/health/fitness',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'fasting',
    name: 'Fasting',
    icon: <Moon className="w-7 h-7" />,
    href: '/health/fasting',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50'
  },
  {
    id: 'jobs',
    name: 'Jobs',
    icon: <TrendingUp className="w-7 h-7" />,
    href: '/marketplace/jobs',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50'
  }
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Service Tile Component
const ServiceTileCard = ({ 
  service, 
  onClick 
}: { 
  service: ServiceTile; 
  onClick?: () => void;
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (service.href !== '#all') {
      navigate(service.href);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="flex flex-col items-center justify-center cursor-pointer"
    >
      <div className={cn(
        "w-[72px] h-[72px] rounded-2xl flex items-center justify-center",
        "shadow-sm border border-black/5 transition-all",
        service.bgColor, service.color
      )}>
        {service.icon}
      </div>
      <span className="text-[13px] font-semibold text-gray-800 text-center mt-2 leading-tight">
        {service.name}
      </span>
    </motion.div>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ action }: { action: QuickAction }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(action.href)}
      className="flex-none min-w-[140px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white">
          {action.icon}
        </div>
        {action.badge && (
          <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700">
            {action.badge}
          </Badge>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-0.5">{action.subtitle}</p>
      <h4 className="text-sm font-bold text-gray-900 leading-tight">{action.title}</h4>
    </motion.div>
  );
};

// Activity Item Component
const ActivityItemCard = ({ item }: { item: ActivityItem }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(item.href)}
      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 cursor-pointer"
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        item.color === 'pink' && "bg-pink-100 text-pink-600",
        item.color === 'blue' && "bg-blue-100 text-blue-600",
        item.color === 'green' && "bg-emerald-100 text-emerald-600",
        item.color === 'orange' && "bg-orange-100 text-orange-600",
        item.color === 'purple' && "bg-purple-100 text-purple-600",
        item.color === 'amber' && "bg-amber-100 text-amber-600"
      )}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
        <p className="text-xs text-gray-500 truncate">{item.description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </motion.div>
  );
};

// All Services Drawer (Bottom Sheet)
const AllServicesDrawer = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-50 max-h-[85vh] overflow-hidden"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Content */}
            <div className="px-6 pb-8 pt-2 overflow-y-auto max-h-[calc(85vh-60px)]">
              <h2 className="text-xl font-bold text-gray-900 mb-6">All Services</h2>
              
              {/* Services Grid */}
              <div className="grid grid-cols-4 gap-4 gap-y-6">
                {ALL_SERVICES.map(service => (
                  <motion.div
                    key={service.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigate(service.href);
                      onClose();
                    }}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center",
                      "shadow-sm border border-black/5",
                      service.bgColor, service.color
                    )}>
                      {service.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-gray-700 text-center mt-2 leading-tight">
                      {service.name}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Quick Links Section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link to="/account/settings" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Settings</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link to="/gamification" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      <span className="font-medium text-gray-700">Points & Badges</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Bottom Navigation Component
const BottomNav = ({ activeTab }: { activeTab: string }) => {
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(0);

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, href: '/home' },
    { id: 'discover', label: 'Discover', icon: Search, href: '/browse' },
    { id: 'inbox', label: 'Messages', icon: MessageCircle, href: '/inbox' },
    { id: 'activity', label: 'Activity', icon: Bell, href: '/notifications' },
    { id: 'account', label: 'Account', icon: User, href: '/account/dashboard' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-30 safe-area-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.href)}
              className="flex flex-col items-center gap-1 px-3 py-1 relative"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-colors",
                isActive ? "bg-emerald-100" : "bg-transparent"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-emerald-600" : "text-gray-400"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-semibold transition-colors",
                isActive ? "text-emerald-600" : "text-gray-400"
              )}>
                {item.label}
              </span>
              {item.id === 'inbox' && unreadMessages > 0 && (
                <div className="absolute top-0 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold">{unreadMessages}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function HabeshaCommunityHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [showAllServices, setShowAllServices] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);

  // Fetch user data
  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchNotifications();
      fetchGamificationData();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('display_name, city')
      .eq('id', user?.id)
      .single();
    
    if (data) {
      setUserName(data.display_name?.split(' ')[0] || 'Friend');
      setUserCity(data.city || 'Your City');
    }
  };

  const fetchNotifications = async () => {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id)
      .eq('read', false);
    
    setUnreadNotifications(count || 0);
  };

  const fetchGamificationData = async () => {
    // Fetch user points
    const { data: pointsData } = await supabase
      .from('user_points')
      .select('total_points')
      .eq('user_id', user?.id)
      .single();
    
    if (pointsData) setPoints(pointsData.total_points || 0);

    // Fetch streak (simplified)
    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('current_streak')
      .eq('user_id', user?.id)
      .order('current_streak', { ascending: false })
      .limit(1)
      .single();
    
    if (streakData) setStreak(streakData.current_streak || 0);
  };

  // Quick Actions Data
  const quickActions: QuickAction[] = [
    {
      id: 'profile',
      title: 'Complete Profile',
      subtitle: 'Get better matches',
      icon: <User className="w-5 h-5" />,
      href: '/dashboard/profile',
      badge: 'Priority'
    },
    {
      id: 'streak',
      title: `${streak} Day Streak`,
      subtitle: 'Keep it going!',
      icon: <Flame className="w-5 h-5" />,
      href: '/health',
      badge: streak > 0 ? '🔥' : undefined
    },
    {
      id: 'points',
      title: `${points} Points`,
      subtitle: 'View rewards',
      icon: <Star className="w-5 h-5" />,
      href: '/gamification'
    }
  ];

  // Activity Feed Data (would be dynamic in production)
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'match',
      title: '3 New Likes',
      description: 'People interested in you',
      href: '/match/liked',
      icon: <Heart className="w-5 h-5" />,
      color: 'pink',
      count: 3
    },
    {
      id: '2',
      type: 'event',
      title: 'Event This Weekend',
      description: 'Ethiopian New Year Celebration',
      href: '/community/events',
      icon: <Calendar className="w-5 h-5" />,
      color: 'orange'
    },
    {
      id: '3',
      type: 'mentor',
      title: '5 Mentors Available',
      description: 'Book a session today',
      href: '/mentor',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: '4',
      type: 'marketplace',
      title: '12 New Listings',
      description: 'Near you in ' + userCity,
      href: '/marketplace',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'amber'
    },
    {
      id: '5',
      type: 'spiritual',
      title: "Today's Reading",
      description: 'Continue your plan',
      href: '/spiritual/today',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        {/* Top Bar */}
        <div className="px-4 pt-12 pb-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo & Location */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-xl font-bold">H</span>
              </div>
              <div>
                <p className="text-xs opacity-80 font-medium">Welcome back</p>
                <h1 className="text-lg font-bold">{userName} 👋</h1>
              </div>
            </div>

            {/* Notification Bell */}
            <button 
              onClick={() => navigate('/notifications')}
              className="relative p-2.5 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-emerald-500">
                  <span className="text-[10px] font-bold">{unreadNotifications}</span>
                </div>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, mentors, events..."
              onClick={() => navigate('/browse')}
              readOnly
              className="w-full h-12 pl-12 pr-4 bg-white rounded-xl text-gray-800 text-sm font-medium placeholder:text-gray-400 shadow-lg cursor-pointer"
            />
          </div>

          {/* Location Bar */}
          <div className="flex items-center gap-2 text-sm opacity-90">
            <MapPin className="w-4 h-4" />
            <span>Viewing services in <strong>{userCity}</strong></span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-2">
        {/* Services Grid */}
        <div className="bg-white rounded-3xl shadow-lg p-4 pt-6 mb-4">
          <div className="grid grid-cols-4 gap-4 gap-y-5">
            {MAIN_SERVICES.map(service => (
              <ServiceTileCard
                key={service.id}
                service={service}
                onClick={service.id === 'all' ? () => setShowAllServices(true) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
            {quickActions.map(action => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>

        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <Badge className="bg-white/20 text-white border-0 mb-2">Featured</Badge>
            <h3 className="text-white text-lg font-bold mb-1">Find Your Perfect Match</h3>
            <p className="text-white/80 text-sm mb-3">
              Join thousands of Habesha singles
            </p>
            <button 
              onClick={() => navigate('/match')}
              className="bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"
            >
              Start Matching <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20">
            <Heart className="w-32 h-32" />
          </div>
        </div>

        {/* Activity Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Your Activity</h2>
            <button 
              onClick={() => navigate('/notifications')}
              className="text-emerald-600 text-sm font-semibold flex items-center gap-1"
            >
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {activities.map(item => (
              <ActivityItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Near You Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Near You in {userCity}</h2>
            <button 
              onClick={() => navigate('/browse')}
              className="text-emerald-600 text-sm font-semibold flex items-center gap-1"
            >
              Explore <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
            {/* Event Card */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/community/events')}
              className="flex-none w-64 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-white/80" />
              </div>
              <div className="p-3">
                <Badge variant="secondary" className="text-[10px] mb-2">This Weekend</Badge>
                <h4 className="font-bold text-gray-900 text-sm">Community Events</h4>
                <p className="text-xs text-gray-500">3 events near you</p>
              </div>
            </motion.div>

            {/* Marketplace Card */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/marketplace')}
              className="flex-none w-64 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-white/80" />
              </div>
              <div className="p-3">
                <Badge variant="secondary" className="text-[10px] mb-2">New</Badge>
                <h4 className="font-bold text-gray-900 text-sm">Marketplace</h4>
                <p className="text-xs text-gray-500">12 new listings</p>
              </div>
            </motion.div>

            {/* Churches Card */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/churches')}
              className="flex-none w-64 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                <Church className="w-12 h-12 text-white/80" />
              </div>
              <div className="p-3">
                <Badge variant="secondary" className="text-[10px] mb-2">Find</Badge>
                <h4 className="font-bold text-gray-900 text-sm">Habesha Churches</h4>
                <p className="text-xs text-gray-500">Orthodox & more</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* All Services Drawer */}
      <AllServicesDrawer 
        isOpen={showAllServices} 
        onClose={() => setShowAllServices(false)} 
      />

      {/* Bottom Navigation */}
      <BottomNav activeTab="home" />

      {/* Custom Scrollbar Hide */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .safe-area-bottom {
          padding-bottom: max(env(safe-area-inset-bottom), 8px);
        }
      `}</style>
    </div>
  );
}

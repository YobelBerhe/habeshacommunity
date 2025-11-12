// src/pages/Home.tsx - Facebook-style Home Page
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { 
  Search, Bell, Menu, Plus,
  Briefcase, ShoppingBag, Heart, Church, 
  Users, Book, Calendar, TrendingUp,
  MessageCircle, Home as HomeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState('Friend');

  useEffect(() => {
    if (user) {
      // Fetch user name
      fetchUserProfile();
      // Fetch unread notifications
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user?.id)
      .single();
    
    if (data?.display_name) {
      setUserName(data.display_name.split(' ')[0]);
    }
  };

  const fetchUnreadCount = async () => {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id)
      .eq('read', false);
    
    setUnreadCount(count || 0);
  };

  // Quick action cards - like Facebook's shortcuts
  const quickActions = [
    { icon: Briefcase, label: 'Jobs', href: '/jobs', color: 'bg-blue-500', desc: 'Find work' },
    { icon: ShoppingBag, label: 'Shop', href: '/marketplace', color: 'bg-green-500', desc: 'Buy & sell' },
    { icon: Heart, label: 'Match', href: '/match', color: 'bg-pink-500', desc: 'Meet people' },
    { icon: Church, label: 'Churches', href: '/churches', color: 'bg-purple-500', desc: 'Find community' },
    { icon: Users, label: 'Events', href: '/community/events', color: 'bg-orange-500', desc: 'Attend events' },
    { icon: Book, label: 'Bible', href: '/spiritual', color: 'bg-indigo-500', desc: 'Daily reading' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Like Facebook's top bar */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-primary">
                Habesha<span className="text-red-600">Community</span>
              </h1>
            </div>

            {/* Search Bar - Center like Facebook */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search for jobs, people, churches, items..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-100 border-none"
                  onClick={() => navigate('/search')}
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate('/notifications')}
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/profile')}
              >
                <Avatar className="h-8 w-8" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full bg-gray-100 border-none"
                onClick={() => navigate('/search')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">
            Selam, {userName}! 👋
          </h2>
          <p className="text-gray-600">Welcome back to your community</p>
        </div>

        {/* Stories Section - Like Facebook/Instagram */}
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            {/* Add Your Story */}
            <div className="flex-shrink-0 text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center cursor-pointer">
                  <Plus className="text-white" size={24} />
                </div>
              </div>
              <p className="text-xs mt-1 font-medium">Add Story</p>
            </div>

            {/* Story Placeholders */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <Avatar className="w-14 h-14" />
                  </div>
                </div>
                <p className="text-xs mt-1 text-gray-600">User {i}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* What's on your mind? - Like Facebook */}
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10" />
            <div 
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/feed/create')}
            >
              <p className="text-gray-500">What's on your mind, {userName}?</p>
            </div>
          </div>
          <div className="flex items-center justify-around mt-3 pt-3 border-t">
            <Button variant="ghost" className="flex items-center gap-2">
              <MessageCircle size={20} className="text-blue-500" />
              <span className="text-sm">Post</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-green-500" />
              <span className="text-sm">Sell</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <Calendar size={20} className="text-orange-500" />
              <span className="text-sm">Event</span>
            </Button>
          </div>
        </Card>

        {/* Quick Actions Grid - Like Facebook Shortcuts */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={20} />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href}>
                <Card className="p-4 hover:shadow-lg transition-all cursor-pointer group">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <action.icon className="text-white" size={24} />
                  </div>
                  <h4 className="font-semibold text-sm">{action.label}</h4>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* For You Section - Personalized */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Activity */}
          <div>
            <h3 className="text-lg font-semibold mb-3">What's Happening</h3>
            
            {/* Activity Cards */}
            <Card className="mb-3 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">5 New Jobs</h4>
                  <p className="text-sm text-gray-600">Posted today in your area</p>
                </div>
                <Button size="sm">View</Button>
              </div>
            </Card>

            <Card className="mb-3 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">3 New Matches</h4>
                  <p className="text-sm text-gray-600">People you might connect with</p>
                </div>
                <Button size="sm">See</Button>
              </div>
            </Card>

            <Card className="mb-3 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Event This Weekend</h4>
                  <p className="text-sm text-gray-600">Ethiopian New Year Celebration</p>
                </div>
                <Button size="sm">RSVP</Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Nearby */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Nearby You</h3>
            
            <Card className="mb-3 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Church className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">3 Churches</h4>
                  <p className="text-sm text-gray-600">Within 5 miles of you</p>
                </div>
                <Button size="sm">Find</Button>
              </div>
            </Card>

            <Card className="mb-3 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">New in Marketplace</h4>
                  <p className="text-sm text-gray-600">12 items posted near you</p>
                </div>
                <Button size="sm">Browse</Button>
              </div>
            </Card>

            <Card className="mb-3 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Active Groups</h4>
                  <p className="text-sm text-gray-600">4 groups in your area</p>
                </div>
                <Button size="sm">Join</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Daily Habit Section */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🙏 Daily Prayer</h3>
              <p className="opacity-90">Keep your 3-day streak going!</p>
            </div>
            <Button variant="secondary" size="lg">
              Pray Now
            </Button>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <p className="opacity-75">Streak</p>
              <p className="font-bold text-lg">3 days 🔥</p>
            </div>
            <div>
              <p className="opacity-75">Level</p>
              <p className="font-bold text-lg">5 ⭐</p>
            </div>
            <div>
              <p className="opacity-75">Points</p>
              <p className="font-bold text-lg">250 XP</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation - Facebook Style (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => navigate('/')}
          >
            <HomeIcon size={24} className="text-primary" />
            <span className="text-xs font-medium text-primary">Home</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => navigate('/feed')}
          >
            <TrendingUp size={24} className="text-gray-600" />
            <span className="text-xs text-gray-600">Feed</span>
          </Button>
          
          <Button 
            variant="default"
            size="icon"
            className="rounded-full w-12 h-12 -mt-6 shadow-lg"
            onClick={() => navigate('/create')}
          >
            <Plus size={28} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="flex flex-col items-center gap-1 h-auto py-2 relative"
            onClick={() => navigate('/messages')}
          >
            <MessageCircle size={24} className="text-gray-600" />
            <span className="text-xs text-gray-600">Messages</span>
            {unreadCount > 0 && (
              <Badge className="absolute top-0 right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-red-500">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => navigate('/profile')}
          >
            <Avatar className="h-6 w-6" />
            <span className="text-xs text-gray-600">Me</span>
          </Button>
        </div>
      </div>

      {/* Spacing for bottom nav on mobile */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
}

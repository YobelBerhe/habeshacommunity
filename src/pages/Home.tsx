// src/pages/Home.tsx - Clean LinkedIn-style Home Page
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { 
  Search, Bell, Plus,
  Briefcase, ShoppingBag, Heart, Church, 
  Users, Book, Calendar, TrendingUp,
  MessageCircle, Home as HomeIcon, ChevronRight,
  Settings, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState('Friend');
  const [userInitials, setUserInitials] = useState('U');

  useEffect(() => {
    if (user) {
      fetchUserProfile();
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
      setUserInitials(data.display_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase());
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Quick access shortcuts
  const quickAccess = [
    { icon: Briefcase, label: 'Jobs', href: '/jobs', color: 'bg-blue-500' },
    { icon: ShoppingBag, label: 'Shop', href: '/marketplace', color: 'bg-green-500' },
    { icon: Heart, label: 'Match', href: '/match', color: 'bg-pink-500' },
    { icon: Church, label: 'Churches', href: '/churches', color: 'bg-purple-500' },
    { icon: Calendar, label: 'Events', href: '/community/events', color: 'bg-orange-500' },
    { icon: Book, label: 'Spiritual', href: '/spiritual', color: 'bg-indigo-500' },
  ];

  // Activity items
  const activities = [
    { icon: Briefcase, label: '5 New Jobs', desc: 'Posted in your area', href: '/jobs', color: 'bg-blue-500' },
    { icon: Heart, label: '3 New Matches', desc: 'People you might like', href: '/match', color: 'bg-pink-500' },
    { icon: Calendar, label: 'Event This Weekend', desc: 'Ethiopian New Year', href: '/community/events', color: 'bg-orange-500' },
    { icon: ShoppingBag, label: '12 New Listings', desc: 'In marketplace near you', href: '/marketplace', color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                Habesha<span className="text-primary">Community</span>
              </span>
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-muted border-0"
                  onClick={() => navigate('/search')}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/notifications')}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/account/dashboard')}>
                    <Users size={16} className="mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/account/settings')}>
                    <Settings size={16} className="mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search..."
                className="pl-10 bg-muted border-0"
                onClick={() => navigate('/search')}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Selam, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">Welcome back to your community</p>
        </div>

        {/* Create Post Card */}
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div
              className="flex-1 bg-muted rounded-full px-4 py-2.5 cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => navigate('/feed/create')}
            >
              <span className="text-muted-foreground">What's on your mind?</span>
            </div>
          </div>
          <div className="flex items-center justify-around mt-4 pt-4 border-t">
            <Button variant="ghost" size="sm" onClick={() => navigate('/feed/create')}>
              <MessageCircle size={18} className="mr-2 text-blue-500" />
              Post
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/marketplace/create')}>
              <ShoppingBag size={18} className="mr-2 text-green-500" />
              Sell
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/community/create-event')}>
              <Calendar size={18} className="mr-2 text-orange-500" />
              Event
            </Button>
          </div>
        </Card>

        {/* Quick Access */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp size={18} />
            Quick Access
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickAccess.map((item) => (
              <Link key={item.label} to={item.href}>
                <Card className="p-4 text-center hover:shadow-md transition-all group">
                  <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                    <item.icon className="text-white" size={20} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">What's Happening</h2>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center shrink-0`}>
                      <activity.icon className="text-white" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{activity.label}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.desc}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate(activity.href)}>
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Streak */}
            <Card className="p-6 bg-primary text-primary-foreground">
              <h3 className="text-lg font-bold mb-2">🙏 Daily Prayer</h3>
              <p className="text-primary-foreground/80 mb-4">Keep your 3-day streak going!</p>
              <Button variant="secondary" onClick={() => navigate('/spiritual/prayers')}>
                Pray Now
              </Button>
              <div className="flex gap-6 mt-4 pt-4 border-t border-primary-foreground/20 text-sm">
                <div>
                  <p className="text-primary-foreground/70">Streak</p>
                  <p className="font-bold">3 days 🔥</p>
                </div>
                <div>
                  <p className="text-primary-foreground/70">Level</p>
                  <p className="font-bold">5 ⭐</p>
                </div>
              </div>
            </Card>

            {/* Suggested */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Explore More</h3>
              <div className="space-y-3">
                <Link to="/mentor" className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                  <span className="text-sm text-foreground">Find a mentor</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </Link>
                <Link to="/churches" className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                  <span className="text-sm text-foreground">Discover churches</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </Link>
                <Link to="/community/groups" className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                  <span className="text-sm text-foreground">Join groups</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => navigate('/home')}
          >
            <HomeIcon size={20} className="text-primary" />
            <span className="text-xs font-medium text-primary">Home</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => navigate('/search')}
          >
            <Search size={20} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Search</span>
          </Button>
          
          <Button
            size="icon"
            className="rounded-full w-12 h-12 -mt-6 shadow-lg"
            onClick={() => navigate('/feed/create')}
          >
            <Plus size={24} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 relative"
            onClick={() => navigate('/inbox')}
          >
            <MessageCircle size={20} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Messages</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => navigate('/account/dashboard')}
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">Me</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}

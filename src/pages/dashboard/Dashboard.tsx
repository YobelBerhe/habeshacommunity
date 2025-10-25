import { useState } from 'react';
import { 
  Heart, Award, ShoppingBag, Users, MessageCircle,
  TrendingUp, Calendar, Star, CheckCircle, ArrowRight,
  Settings, User, Bell, Clock, Target, Zap, Crown,
  BookOpen, MapPin, Gift, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import AnimatedCounter from '@/components/AnimatedCounter';

const Dashboard = () => {
  const navigate = useNavigate();

  // User data (would come from database/state)
  const user = {
    firstName: 'Michael',
    lastName: 'Tesfay',
    avatar: 'MT',
    profileCompletion: 85,
    isPremium: false,
    memberSince: 'January 2024',
    stats: {
      matches: 12,
      messages: 45,
      sessions: 3,
      listings: 2
    }
  };

  // Recent activity data
  const recentActivity = [
    {
      id: '1',
      type: 'match',
      icon: Heart,
      title: 'New Match!',
      description: 'You matched with Sara Mehretab',
      time: '2 hours ago',
      color: 'from-pink-500 to-rose-500',
      action: () => navigate('/match/matches')
    },
    {
      id: '2',
      type: 'session',
      icon: Award,
      title: 'Session Reminder',
      description: 'Career guidance with Daniel Kidane tomorrow at 2 PM',
      time: '5 hours ago',
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/mentor/sessions')
    },
    {
      id: '3',
      type: 'message',
      icon: MessageCircle,
      title: 'New Message',
      description: 'Rahel sent you a message about your listing',
      time: '1 day ago',
      color: 'from-green-500 to-emerald-500',
      action: () => navigate('/inbox?conversation=3')
    },
    {
      id: '4',
      type: 'event',
      icon: Calendar,
      title: 'Event Tomorrow',
      description: 'Coffee Ceremony & Cultural Night at 7:00 PM',
      time: '1 day ago',
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/community/events')
    }
  ];

  // Quick actions
  const quickActions = [
    {
      icon: Heart,
      label: 'Find Matches',
      description: 'Discover compatible singles',
      color: 'from-pink-500 to-rose-500',
      action: () => navigate('/match/discover')
    },
    {
      icon: Award,
      label: 'Book Mentor',
      description: 'Get expert guidance',
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/mentor')
    },
    {
      icon: ShoppingBag,
      label: 'Browse Market',
      description: 'Shop community items',
      color: 'from-green-500 to-emerald-500',
      action: () => navigate('/marketplace')
    },
    {
      icon: Users,
      label: 'Join Community',
      description: 'Connect with others',
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/community')
    }
  ];

  // Achievements
  const achievements = [
    { icon: Star, label: 'Early Adopter', unlocked: true, color: 'text-amber-500' },
    { icon: Heart, label: '10 Matches', unlocked: true, color: 'text-pink-500' },
    { icon: MessageCircle, label: 'Conversationalist', unlocked: true, color: 'text-blue-500' },
    { icon: Award, label: 'Mentor Mentee', unlocked: true, color: 'text-purple-500' },
    { icon: Users, label: 'Community Member', unlocked: false, color: 'text-gray-400' },
    { icon: Crown, label: 'Premium Member', unlocked: false, color: 'text-gray-400' }
  ];

  // Saved items
  const savedItems = [
    {
      id: '1',
      type: 'profile',
      title: 'Sara Mehretab',
      subtitle: '94% Match',
      icon: Heart,
      action: () => navigate('/match/profile/1')
    },
    {
      id: '2',
      type: 'mentor',
      title: 'Daniel Kidane',
      subtitle: 'Career Development',
      icon: Award,
      action: () => navigate('/mentor/1')
    },
    {
      id: '3',
      type: 'listing',
      title: 'Traditional Coffee Set',
      subtitle: '$45 • Products',
      icon: ShoppingBag,
      action: () => navigate('/marketplace/products')
    },
    {
      id: '4',
      type: 'event',
      title: 'Coffee Ceremony Night',
      subtitle: 'Tomorrow at 7 PM',
      icon: Calendar,
      action: () => navigate('/community/events')
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-white">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl font-bold">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">
                  Welcome back, {user.firstName}! 👋
                </h1>
                <p className="text-base md:text-lg opacity-90">
                  Here's what's happening with your account
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard/settings')}
              className="hidden md:flex"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter end={user.stats.matches} />
                  </div>
                  <div className="text-sm opacity-90">Matches</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter end={user.stats.messages} />
                  </div>
                  <div className="text-sm opacity-90">Messages</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter end={user.stats.sessions} />
                  </div>
                  <div className="text-sm opacity-90">Sessions</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter end={user.stats.listings} />
                  </div>
                  <div className="text-sm opacity-90">Listings</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 md:px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Completion */}
            {user.profileCompletion < 100 && (
              <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Complete Your Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Get {100 - user.profileCompletion}% more matches by completing your profile
                    </p>
                  </div>
                  <Badge className="bg-amber-500 text-white">
                    {user.profileCompletion}%
                  </Badge>
                </div>
                <Progress value={user.profileCompletion} className="mb-4" />
                <Button 
                  onClick={() => navigate('/dashboard/profile')}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Complete Profile
                </Button>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Card
                      key={index}
                      className="p-4 hover:shadow-lg transition-all cursor-pointer border-2"
                      onClick={action.action}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{action.label}</h4>
                          <p className="text-xs text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Recent Activity</h3>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <Card
                      key={activity.id}
                      className="p-4 hover:shadow-md transition-all cursor-pointer"
                      onClick={activity.action}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-1">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground flex-shrink-0">
                          {activity.time}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Premium Upgrade */}
            {!user.isPremium && (
              <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <div className="text-center">
                  <Crown className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2">Upgrade to Premium</h3>
                  <p className="text-sm mb-4 opacity-90">
                    Get unlimited matches, priority support, and exclusive features
                  </p>
                  <Button 
                    onClick={() => navigate('/payment/checkout')}
                    className="w-full bg-white text-purple-600 hover:bg-gray-100"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </Card>
            )}

            {/* Achievements */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`text-center p-3 rounded-lg ${
                        achievement.unlocked
                          ? 'bg-muted'
                          : 'bg-muted/50 opacity-50'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${achievement.color}`} />
                      <p className="text-xs font-medium leading-tight">
                        {achievement.label}
                      </p>
                      {achievement.unlocked && (
                        <CheckCircle className="w-3 h-3 text-green-600 mx-auto mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Saved Items */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Saved Items</h3>
              <div className="space-y-2">
                {savedItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                      onClick={item.action}
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-3"
                onClick={() => navigate('/dashboard/saved')}
              >
                View All Saved
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

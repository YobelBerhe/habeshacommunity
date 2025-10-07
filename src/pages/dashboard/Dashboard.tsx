import { useState } from 'react';
import { 
  User, Heart, Award, ShoppingBag, Users, MessageCircle,
  Calendar, TrendingUp, Clock, Star, Bell, Settings,
  ArrowRight, Eye, ThumbsUp, Bookmark, MapPin, Mail,
  CheckCircle, AlertCircle, Target, Zap, Crown, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Demo user data
  const user = {
    name: 'Michael Tesfay',
    avatar: 'MT',
    email: 'michael@example.com',
    location: 'Washington DC',
    memberSince: 'January 2024',
    verified: true,
    premium: false,
    profileCompletion: 85
  };

  // Activity stats
  const stats = {
    matches: { count: 12, label: 'Matches', icon: Heart, color: 'text-pink-600', change: '+3 this week' },
    sessions: { count: 5, label: 'Mentor Sessions', icon: Award, color: 'text-blue-600', change: '2 upcoming' },
    listings: { count: 8, label: 'Active Listings', icon: ShoppingBag, color: 'text-green-600', change: '23 views' },
    posts: { count: 34, label: 'Forum Posts', icon: MessageCircle, color: 'text-purple-600', change: '+7 this month' }
  };

  // Recent activity
  const recentActivity = [
    {
      id: '1',
      type: 'match',
      title: 'New match with Sara M.',
      description: 'You have a new match! Start a conversation',
      time: '2 hours ago',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      action: 'View Match',
      path: '/match/matches'
    },
    {
      id: '2',
      type: 'mentor',
      title: 'Upcoming session tomorrow',
      description: 'Career guidance session with Daniel K. at 2:00 PM',
      time: '1 day',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      action: 'View Details',
      path: '/mentor/sessions'
    },
    {
      id: '3',
      type: 'marketplace',
      title: 'Someone interested in your listing',
      description: '3 new messages about "Traditional Coffee Set"',
      time: '2 days ago',
      icon: MessageCircle,
      color: 'from-green-500 to-emerald-500',
      action: 'View Messages',
      path: '/marketplace/my-listings'
    },
    {
      id: '4',
      type: 'community',
      title: 'Your post got 15 replies',
      description: 'Discussion: "Best cities for Habesha community"',
      time: '3 days ago',
      icon: MessageCircle,
      color: 'from-purple-500 to-pink-500',
      action: 'View Thread',
      path: '/community/forums'
    },
    {
      id: '5',
      type: 'event',
      title: 'Event reminder: Coffee Ceremony',
      description: 'Starting in 3 days at Seattle Community Center',
      time: '3 days',
      icon: Calendar,
      color: 'from-amber-500 to-orange-500',
      action: 'View Event',
      path: '/community/events'
    }
  ];

  // Quick actions
  const quickActions = [
    { label: 'Find Matches', icon: Heart, path: '/match/discover', color: 'from-pink-500 to-rose-500' },
    { label: 'Book Session', icon: Calendar, path: '/mentor', color: 'from-blue-500 to-cyan-500' },
    { label: 'Create Listing', icon: ShoppingBag, path: '/marketplace/create', color: 'from-green-500 to-emerald-500' },
    { label: 'Join Event', icon: Users, path: '/community/events', color: 'from-purple-500 to-pink-500' }
  ];

  // Achievements
  const achievements = [
    { 
      id: '1', 
      title: 'Early Adopter', 
      description: 'Joined in the first month', 
      icon: Crown,
      unlocked: true,
      rarity: 'Rare'
    },
    { 
      id: '2', 
      title: 'Social Butterfly', 
      description: 'Made 10+ matches', 
      icon: Heart,
      unlocked: true,
      rarity: 'Common'
    },
    { 
      id: '3', 
      title: 'Community Leader', 
      description: 'Created 50+ forum posts', 
      icon: Star,
      unlocked: false,
      rarity: 'Epic'
    },
    { 
      id: '4', 
      title: 'Marketplace Pro', 
      description: 'Sold 20+ items', 
      icon: ShoppingBag,
      unlocked: false,
      rarity: 'Rare'
    }
  ];

  // Saved items
  const savedItems = [
    { id: '1', type: 'match', title: 'Sara M. - 92% Match', image: 'profile' },
    { id: '2', type: 'mentor', title: 'Daniel K. - Career Coach', image: 'mentor' },
    { id: '3', type: 'listing', title: 'Traditional Coffee Set', image: 'product' },
    { id: '4', type: 'event', title: 'Networking Mixer', image: 'event' }
  ];

  // Notifications
  const notifications = [
    { id: '1', text: 'New match available!', read: false, time: '1h ago' },
    { id: '2', text: 'Your session starts in 24 hours', read: false, time: '2h ago' },
    { id: '3', text: 'Someone favorited your listing', read: true, time: '1d ago' },
    { id: '4', text: 'New reply to your forum post', read: true, time: '2d ago' }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-white/20">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                  {user.verified && (
                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {user.premium && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm opacity-90">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </span>
                  <span>•</span>
                  <span>Member since {user.memberSince}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                className="flex-1 md:flex-none bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate('/dashboard/profile')}
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                size="icon"
                onClick={() => navigate('/account/settings')}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 relative"
                size="icon"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Profile Completion */}
          {user.profileCompletion < 100 && (
            <Card className="mt-6 p-4 bg-white/10 border-white/20 backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Profile Completion</div>
                <div className="text-sm font-bold">{user.profileCompletion}%</div>
              </div>
              <Progress value={user.profileCompletion} className="h-2 mb-2" />
              <div className="text-xs opacity-90">
                Complete your profile to increase your visibility and match quality
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(stats).map(([key, stat]) => {
            const Icon = stat.icon;
            return (
              <Card key={key} className="p-4 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.count}</div>
                <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                <div className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.label}
                      variant="outline"
                      className="h-auto flex-col gap-2 p-4 hover:shadow-md"
                      onClick={() => navigate(action.path)}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-center">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <Card key={activity.id} className="p-4 hover:shadow-md transition-all">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold mb-1">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {activity.time}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(activity.path)}
                            >
                              {activity.action}
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Star className="w-6 h-6 mr-2 text-amber-500" />
                  Achievements
                </h2>
                <Badge variant="secondary">
                  {achievements.filter(a => a.unlocked).length} / {achievements.length}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <Card 
                      key={achievement.id} 
                      className={`p-4 ${achievement.unlocked ? 'border-amber-500/50' : 'opacity-50 grayscale'}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg ${achievement.unlocked ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gray-300'} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{achievement.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Saved Items */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center">
                  <Bookmark className="w-5 h-5 mr-2" />
                  Saved
                </h3>
                <Badge variant="secondary">{savedItems.length}</Badge>
              </div>

              <div className="space-y-3">
                {savedItems.map((item) => (
                  <Card key={item.id} className="p-3 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Saved
              </Button>
            </Card>

            {/* Upgrade to Premium */}
            {!user.premium && (
              <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Upgrade to Premium</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Unlock exclusive features and get priority support
                  </p>
                  <ul className="text-sm space-y-2 mb-6 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                      Unlimited matches
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                      Priority mentor booking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                      Featured listings
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                      No ads
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </Card>
            )}

            {/* Community Stats */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Profile Views</span>
                    <span className="font-bold">1,234</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Connections Made</span>
                    <span className="font-bold">45</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Helpfulness Score</span>
                    <span className="font-bold">4.8 ⭐</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

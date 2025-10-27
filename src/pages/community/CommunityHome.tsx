import { useState } from 'react';
import { 
  MessageCircle, Calendar, Users, TrendingUp, Clock,
  MapPin, Heart, MessageSquare, User, ArrowRight,
  Sparkles, Globe, Coffee, Film, Music, Book,
  Utensils, Dumbbell, Plus, Search, Filter, CheckCircle, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const CommunityHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Featured forums
  const forums = [
    {
      id: '1',
      name: 'General Discussion',
      name_ti: 'ሓፈሻዊ ምዝትያ',
      description: 'Chat about anything and everything',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      threads: 1234,
      posts: 8967,
      members: 3421,
      lastActivity: '5 min ago',
      trending: true
    },
    {
      id: '2',
      name: 'Culture & Traditions',
      name_ti: 'ባህልን ወጋሕታን',
      description: 'Discuss Habesha culture, traditions, and heritage',
      icon: Globe,
      color: 'from-green-500 to-emerald-500',
      threads: 567,
      posts: 4321,
      members: 2134,
      lastActivity: '12 min ago',
      trending: true
    },
    {
      id: '3',
      name: 'Food & Recipes',
      name_ti: 'መግቢን መግቢ ምድላውን',
      description: 'Share recipes and culinary experiences',
      icon: Utensils,
      color: 'from-orange-500 to-red-500',
      threads: 432,
      posts: 2987,
      members: 1876,
      lastActivity: '23 min ago',
      trending: false
    },
    {
      id: '4',
      name: 'Music & Entertainment',
      name_ti: 'ሙዚቃን መዘናግዒን',
      description: 'Discuss music, movies, and entertainment',
      icon: Music,
      color: 'from-purple-500 to-pink-500',
      threads: 298,
      posts: 1654,
      members: 1432,
      lastActivity: '1 hour ago',
      trending: false
    }
  ];

  // Upcoming events
  const events = [
    {
      id: '1',
      title: 'Ethiopian New Year Celebration 2025',
      date: '2025-09-11',
      time: '6:00 PM',
      location: 'Washington DC',
      attendees: 234,
      image: 'event1',
      organizer: 'Habesha Events DC',
      featured: true
    },
    {
      id: '2',
      title: 'Tigrinya Language Workshop',
      date: '2025-01-15',
      time: '10:00 AM',
      location: 'Oakland, CA',
      attendees: 45,
      image: 'event2',
      organizer: 'Language Learning Group',
      featured: false
    },
    {
      id: '3',
      title: 'Coffee Ceremony & Cultural Night',
      date: '2025-01-20',
      time: '7:00 PM',
      location: 'Seattle, WA',
      attendees: 89,
      image: 'event3',
      organizer: 'Seattle Habesha Community',
      featured: true
    },
    {
      id: '4',
      title: 'Networking Mixer for Professionals',
      date: '2025-01-25',
      time: '6:30 PM',
      location: 'Toronto, Canada',
      attendees: 67,
      image: 'event4',
      organizer: 'Habesha Professionals Network',
      featured: false
    }
  ];

  // Active groups
  const groups = [
    {
      id: '1',
      name: 'Young Professionals Network',
      name_ti: 'መርበብ መንእሰያት ፕሮፌሽናላት',
      description: 'Connect with Habesha professionals in tech, business, and more',
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      members: 1234,
      posts: 567,
      privacy: 'public',
      trending: true
    },
    {
      id: '2',
      name: 'Parents & Families',
      name_ti: 'ወለዲን ስድራቤታትን',
      description: 'Support and advice for Habesha parents',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      members: 892,
      posts: 423,
      privacy: 'public',
      trending: true
    },
    {
      id: '3',
      name: 'Book Club',
      name_ti: 'ክለብ መጽሓፍቲ',
      description: 'Monthly book discussions and reading recommendations',
      icon: Book,
      color: 'from-amber-500 to-orange-500',
      members: 456,
      posts: 234,
      privacy: 'public',
      trending: false
    },
    {
      id: '4',
      name: 'Fitness & Wellness',
      name_ti: 'ብሩህነትን ጥዕናን',
      description: 'Health, fitness, and wellness community',
      icon: Dumbbell,
      color: 'from-green-500 to-teal-500',
      members: 678,
      posts: 345,
      privacy: 'public',
      trending: false
    }
  ];

  // Recent discussions
  const recentDiscussions = [
    {
      id: '1',
      forum: 'General Discussion',
      title: 'Best cities for Habesha community in North America?',
      author: 'Michael T.',
      replies: 45,
      views: 892,
      lastReply: '5 min ago',
      trending: true
    },
    {
      id: '2',
      forum: 'Culture & Traditions',
      title: 'How to maintain cultural identity while raising kids abroad?',
      author: 'Sara M.',
      replies: 67,
      views: 1234,
      lastReply: '12 min ago',
      trending: true
    },
    {
      id: '3',
      forum: 'Food & Recipes',
      title: 'Where to find authentic berbere spice in Europe?',
      author: 'Daniel K.',
      replies: 23,
      views: 456,
      lastReply: '34 min ago',
      trending: false
    },
    {
      id: '4',
      forum: 'Music & Entertainment',
      title: 'New Ethiopian music releases - January 2025',
      author: 'Rahel W.',
      replies: 34,
      views: 678,
      lastReply: '1 hour ago',
      trending: false
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Connect with your community
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Community Hub
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Join discussions, attend events, and connect with Habesha people worldwide
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search forums, events, groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 md:h-16 pl-12 md:pl-16 pr-4 md:pr-6 text-base md:text-lg rounded-full bg-background text-foreground border-0 shadow-xl"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-8 max-w-2xl mx-auto">
              <div>
                <div className="text-2xl md:text-4xl font-bold">12.5K+</div>
                <div className="text-sm md:text-base opacity-90">Members</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold">450+</div>
                <div className="text-sm md:text-base opacity-90">Active Groups</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold">850+</div>
                <div className="text-sm md:text-base opacity-90">Events</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-6 border-b bg-background/95 backdrop-blur sticky top-14 md:top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              onClick={() => navigate('/community/forums-new')}
              className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Community Forums
            </Button>
            <Button
              onClick={() => navigate('/community/bible-groups')}
              className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Bible Groups
            </Button>
            <Button
              onClick={() => navigate('/community/events')}
              className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Find Events
            </Button>
            <Button
              onClick={() => navigate('/community/groups')}
              className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Groups
            </Button>
            <Button
              variant="outline"
              className="flex-shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Forums */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                  Trending Forums
                </h2>
                <Button variant="ghost" onClick={() => navigate('/community/forums')}>
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {forums.slice(0, 4).map((forum) => {
                  const Icon = forum.icon;
                  return (
                    <Card
                      key={forum.id}
                      className="p-4 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => navigate(`/community/forums/${forum.id}`)}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${forum.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold mb-1 truncate">{forum.name}</h3>
                          <p className="text-xs text-muted-foreground">{forum.name_ti}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {forum.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span>{forum.threads} threads</span>
                          <span>{forum.members} members</span>
                        </div>
                        {forum.trending && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Hot
                          </Badge>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>

            {/* Recent Discussions */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Recent Discussions</h2>
              
              <div className="space-y-4">
                {recentDiscussions.map((discussion) => (
                  <Card
                    key={discussion.id}
                    className="p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/community/thread/${discussion.id}`)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {discussion.forum}
                        </Badge>
                        <h3 className="font-bold hover:text-primary transition-colors mb-1">
                          {discussion.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          by {discussion.author}
                        </p>
                      </div>
                      {discussion.trending && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex-shrink-0">
                          <TrendingUp className="w-3 h-3" />
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {discussion.replies} replies
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {discussion.views} views
                      </div>
                      <div className="flex items-center ml-auto">
                        <Clock className="w-4 h-4 mr-1" />
                        {discussion.lastReply}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-primary" />
                  Upcoming Events
                </h2>
                <Button variant="ghost" onClick={() => navigate('/community/events')}>
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <Card
                    key={event.id}
                    className="p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/community/events/${event.id}`)}
                  >
                    <div className="flex gap-4">
                      {/* Date Badge */}
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                        <div className="text-xs font-semibold">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-2xl font-bold">
                          {new Date(event.date).getDate()}
                        </div>
                      </div>

                      {/* Event Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold mb-2 hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {event.attendees} attending
                          </div>
                        </div>
                      </div>

                      {event.featured && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white h-fit">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Active Groups */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Popular Groups</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/community/groups')}>
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {groups.slice(0, 4).map((group) => {
                  const Icon = group.icon;
                  return (
                    <Card
                      key={group.id}
                      className="p-3 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/community/groups/${group.id}`)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${group.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{group.name}</h4>
                          <p className="text-xs text-muted-foreground">{group.members} members</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Button
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => navigate('/community/groups/create')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </Card>

            {/* Community Stats */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Community Activity</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Active Today</span>
                    <span className="font-bold">2,341</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-3/4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">New Posts</span>
                    <span className="font-bold">456</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-2/3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Events This Month</span>
                    <span className="font-bold">67</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-1/2" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Community Guidelines */}
            <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <h3 className="font-bold mb-3">Community Guidelines</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Be respectful and kind to all members</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>No hate speech or discrimination</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Stay on topic in forums</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Report inappropriate content</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CommunityHome;

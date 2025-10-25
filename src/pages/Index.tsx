import { useState } from 'react';
import { 
  Heart, Users, ShoppingBag, Search, MapPin, TrendingUp, 
  Sparkles, ArrowRight, Star, Calendar, Briefcase, Award, 
  CheckCircle, Home as HomeIcon, MessageCircle, BookOpen, 
  Stethoscope, Lightbulb, Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import AnimatedCounter from '@/components/AnimatedCounter';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/community/forums?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Main platform features with sub-categories
  const mainApps = [
    {
      id: 'matchmaking',
      title: 'Find Your Match',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      path: '/match',
      subcategories: [
        { name: 'Discover', path: '/match/discover', icon: Sparkles },
        { name: 'My Matches', path: '/match/matches', icon: Heart },
        { name: 'My Profile', path: '/match/profile', icon: Users },
        { name: 'Take Quiz', path: '/match/quiz', icon: CheckCircle },
        { name: 'Go Live', path: 'https://habeshalive.com', icon: Video, external: true }
      ]
    },
    {
      id: 'mentorship',
      title: 'Get Mentored',
      icon: Award,
      color: 'from-blue-500 to-cyan-500',
      path: '/mentor',
      subcategories: [
        { name: 'Find Mentors', path: '/mentor', icon: Award },
        { name: 'My Sessions', path: '/mentor/sessions', icon: Calendar },
        { name: 'Become a Mentor', path: '/mentor/onboarding', icon: Star }
      ]
    },
    {
      id: 'marketplace',
      title: 'Buy & Sell',
      icon: ShoppingBag,
      color: 'from-green-500 to-emerald-500',
      path: '/marketplace',
      subcategories: [
        { name: 'Products', path: '/marketplace?category=products', icon: ShoppingBag },
        { name: 'Housing', path: '/marketplace?category=housing', icon: HomeIcon },
        { name: 'Jobs & Gigs', path: '/marketplace?category=jobs', icon: Briefcase },
        { name: 'Services', path: '/marketplace?category=services', icon: Star }
      ]
    },
    {
      id: 'community',
      title: 'Join Community',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      path: '/community',
      subcategories: [
        { name: 'Forums', path: '/community/forums', icon: MessageCircle },
        { name: 'Events', path: '/community/events', icon: Calendar },
        { name: 'Groups', path: '/community/groups', icon: Users }
      ]
    }
  ];

  // Quick stats
  const platformStats = [
    { label: 'Active Members', value: 25000, suffix: 'K+', icon: Users },
    { label: 'Success Stories', value: 3500, suffix: 'K+', icon: Heart },
    { label: 'Events Hosted', value: 850, suffix: '+', icon: Calendar },
    { label: 'Active Listings', value: 5200, suffix: 'K+', icon: ShoppingBag }
  ];

  // Featured success stories
  const successStories = [
    {
      id: '1',
      title: 'Sara & Michael Found Perfect Match!',
      story: 'Met through Habesha Connect and now planning our wedding. Forever grateful!',
      author: 'Sara & Michael',
      location: 'Washington DC',
      avatar: 'SM'
    },
    {
      id: '2',
      title: 'Daniel T. Landed My Dream Job',
      story: 'My mentor helped me prepare for FAANG interviews. Now at Google!',
      author: 'Daniel T.',
      location: 'San Francisco',
      avatar: 'DT'
    },
    {
      id: '3',
      title: 'Rahel W. Found Perfect Apartment',
      story: 'Found an amazing apartment near the Habesha community through the marketplace.',
      author: 'Rahel W.',
      location: 'Seattle',
      avatar: 'RW'
    },
    {
      id: '4',
      title: 'Michael Started His Business',
      story: 'Connected with investors and partners through the community forums.',
      author: 'Michael G.',
      location: 'Toronto',
      avatar: 'MG'
    }
  ];

  // Trending locations
  const trendingLocations = [
    { city: 'Washington DC', members: 2341, growth: '+12%' },
    { city: 'Oakland, CA', members: 1876, growth: '+8%' },
    { city: 'Seattle, WA', members: 1654, growth: '+15%' },
    { city: 'Toronto, Canada', members: 1432, growth: '+10%' },
    { city: 'London, UK', members: 987, growth: '+18%' },
    { city: 'Atlanta, GA', members: 876, growth: '+7%' },
    { city: 'Minneapolis, MN', members: 734, growth: '+9%' },
    { city: 'Dallas, TX', members: 621, growth: '+11%' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Headway Style */}
      <section className="bg-gradient-to-b from-muted/50 to-background pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Welcome to Habesha Community
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Connect, Learn, Trade & Grow Together
            </p>

            {/* Search Bar - Headway Style */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for matches, mentors, items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-16 pr-6 text-lg rounded-2xl border-2 shadow-lg"
                />
              </div>
            </form>

            <p className="text-sm text-muted-foreground mb-6">I want to</p>

            {/* Quick Actions - Headway Style 2-Column Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto mb-4 overflow-x-auto">
              <Button 
                variant="outline" 
                className="h-auto py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/10"
                onClick={() => navigate('/personal')}
              >
                <Lightbulb className="w-5 h-5" />
                <span className="font-medium">Personal</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/10"
                onClick={() => navigate('/health')}
              >
                <Stethoscope className="w-5 h-5" />
                <span className="font-medium">Get Healthy</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/10"
                onClick={() => navigate('/match')}
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">Find Match</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/10"
                onClick={() => navigate('/mentor')}
              >
                <Award className="w-5 h-5" />
                <span className="font-medium">Get Mentored</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/10"
                onClick={() => navigate('/marketplace')}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">Browse Market</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/10"
                onClick={() => navigate('/community')}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Join Community</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Apps with Subcategories - Headway Style */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Everything You Need in One Place
            </h2>
          </div>

          <div className="space-y-8 max-w-6xl mx-auto">
            {mainApps.map((app) => {
              const Icon = app.icon;
              
              return (
                <Card key={app.id} className="p-6 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">{app.title}</h3>
                  </div>

                  {/* Subcategory Buttons - Horizontal Scroll */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {app.subcategories.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Button
                          key={sub.name}
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0 rounded-full"
                          onClick={() => {
                            if (sub.external) {
                              window.open(sub.path, '_blank');
                            } else {
                              navigate(sub.path);
                            }
                          }}
                        >
                          <SubIcon className="w-4 h-4 mr-2" />
                          {sub.name}
                        </Button>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories - Horizontal Scroll */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Real Stories from Our Community
            </h2>
            <p className="text-muted-foreground">
              See how Habesha Connect is making a difference
            </p>
          </div>

          {/* Horizontal Scroll with Half-Visible Next Item */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {successStories.map((story) => (
              <Card 
                key={story.id} 
                className="flex-shrink-0 w-[85%] md:w-[45%] lg:w-[30%] p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                      {story.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{story.author}</h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {story.location}
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2">{story.title}</h3>
                <p className="text-muted-foreground text-sm">{story.story}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Locations - 2 Rows Horizontal Scroll */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Habesha Communities Worldwide
            </h2>
            <p className="text-muted-foreground">
              Connect with Habesha people in major cities around the world
            </p>
          </div>

          {/* First Row */}
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide mb-3">
            {trendingLocations.slice(0, 4).map((location, index) => (
              <Card key={index} className="flex-shrink-0 w-64 p-4 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{location.city}</h4>
                      <p className="text-xs text-muted-foreground">
                        {location.members.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">
                    {location.growth}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          {/* Second Row */}
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {trendingLocations.slice(4).map((location, index) => (
              <Card key={index} className="flex-shrink-0 w-64 p-4 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{location.city}</h4>
                      <p className="text-xs text-muted-foreground">
                        {location.members.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">
                    {location.growth}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => navigate('/community')}>
              <MapPin className="w-4 h-4 mr-2" />
              Explore All Locations
            </Button>
          </div>
        </div>
      </section>

      {/* Live Activity - Map & Stats */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Live Activity - What's Happening Now
            </h2>
          </div>

          {/* Placeholder for Interactive Map */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="w-full h-64 md:h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border-2 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
                <p className="text-muted-foreground">Interactive Global Map Coming Soon</p>
                <p className="text-sm text-muted-foreground">Live activity across the globe</p>
              </div>
            </div>
          </div>

          {/* Compact Stats Below Map */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {platformStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-4 text-center hover:shadow-lg transition-all">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold mb-1">
                    <AnimatedCounter end={stat.value} />
                    <span className="text-sm">{stat.suffix}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Connect with thousands of Habesha people worldwide. Find love, get mentored, trade, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth/register')}
              className="text-lg px-8"
            >
              Sign Up Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth/login')}
              className="text-lg px-8 bg-white/10 hover:bg-white/20 border-white text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Custom CSS for Horizontal Scrollbar */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Index;

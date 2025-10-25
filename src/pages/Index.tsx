import { useState } from 'react';
import { 
  Heart, Users, ShoppingBag, MessageCircle, Search,
  MapPin, TrendingUp, Sparkles, ArrowRight, Star,
  Calendar, Briefcase, Home, Award, Globe, Clock,
  CheckCircle, Zap
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
      // Route to appropriate section based on search context
      navigate(`/community/forums?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Main platform features
  const mainApps = [
    {
      id: 'matchmaking',
      title: 'Find Your Match',
      title_ti: 'ርኸብ መጻምድኻ',
      description: 'Connect with compatible Habesha singles for meaningful relationships',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      gradient: 'from-pink-500/10 to-rose-500/10',
      stats: { active: '5.2K+', success: '1.2K+' },
      path: '/match',
      features: ['Personality Quiz', 'Smart Matching', 'Family Mode', 'Video Dates']
    },
    {
      id: 'mentorship',
      title: 'Get Mentored',
      title_ti: 'ርከብ መምህር',
      description: 'Learn from experienced Habesha professionals and experts',
      icon: Award,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-500/10 to-cyan-500/10',
      stats: { mentors: '350+', sessions: '2.1K+' },
      path: '/mentor',
      features: ['Expert Mentors', 'Career Guidance', 'Tech Interviews', '1-on-1 Sessions']
    },
    {
      id: 'marketplace',
      title: 'Buy & Sell',
      title_ti: 'ግዛእን ሽመትን',
      description: 'Trade products, find housing, jobs, and services in the community',
      icon: ShoppingBag,
      color: 'from-green-500 to-emerald-500',
      gradient: 'from-green-500/10 to-emerald-500/10',
      stats: { listings: '5.2K+', deals: '8.5K+' },
      path: '/marketplace',
      features: ['Products', 'Housing', 'Jobs', 'Services']
    },
    {
      id: 'community',
      title: 'Join Community',
      title_ti: 'ተሳተፍ',
      description: 'Connect through forums, events, and groups with Habesha worldwide',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-500/10 to-pink-500/10',
      stats: { members: '12.5K+', events: '850+' },
      path: '/community',
      features: ['Forums', 'Events', 'Groups', 'Discussions']
    }
  ];

  // Quick stats
  const platformStats = [
    { label: 'Active Members', value: 25000, suffix: 'K+', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Success Stories', value: 3500, suffix: 'K+', icon: Heart, color: 'text-pink-600 dark:text-pink-400' },
    { label: 'Events Hosted', value: 850, suffix: '+', icon: Calendar, color: 'text-green-600 dark:text-green-400' },
    { label: 'Active Listings', value: 5200, suffix: 'K+', icon: ShoppingBag, color: 'text-purple-600 dark:text-purple-400' }
  ];

  // Featured success stories
  const successStories = [
    {
      id: '1',
      type: 'match',
      title: 'Found My Perfect Match!',
      story: 'Met through Habesha Connect and now planning our wedding. Forever grateful!',
      author: 'Sara & Michael',
      location: 'Washington DC',
      avatar: 'SM'
    },
    {
      id: '2',
      type: 'mentor',
      title: 'Landed My Dream Job',
      story: 'My mentor helped me prepare for FAANG interviews. Now at Google!',
      author: 'Daniel T.',
      location: 'San Francisco',
      avatar: 'DT'
    },
    {
      id: '3',
      type: 'marketplace',
      title: 'Found Perfect Apartment',
      story: 'Found an amazing apartment near the Habesha community through the marketplace.',
      author: 'Rahel W.',
      location: 'Seattle',
      avatar: 'RW'
    }
  ];

  // Trending locations
  const trendingLocations = [
    { city: 'Washington DC', members: 2341, growth: '+12%' },
    { city: 'Oakland, CA', members: 1876, growth: '+8%' },
    { city: 'Seattle, WA', members: 1654, growth: '+15%' },
    { city: 'Toronto, Canada', members: 1432, growth: '+10%' },
    { city: 'London, UK', members: 987, growth: '+18%' },
    { city: 'Atlanta, GA', members: 876, growth: '+7%' }
  ];

  // Recent activity feed
  const recentActivity = [
    { type: 'match', text: 'New match made in Oakland, CA', time: '2 min ago', icon: Heart },
    { type: 'event', text: 'Coffee Ceremony event starting soon', time: '5 min ago', icon: Calendar },
    { type: 'marketplace', text: 'New job posting: Tigrinya Translator', time: '12 min ago', icon: Briefcase },
    { type: 'mentor', text: 'Sarah booked a mentorship session', time: '18 min ago', icon: Award },
    { type: 'community', text: 'New discussion in Culture & Traditions', time: '23 min ago', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, hsl(var(--primary) / 0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Welcome to Habesha Connect
            </Badge>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Habesha Community Hub
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground mb-4">
              Connect, Learn, Trade & Grow Together
            </p>
            
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              ማሕበረሰብና ኣብ ሓደ ቦታ • ንርኽበልና • ንምሃረልና • ንሕግዝልና
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for matches, mentors, items, events, groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 md:h-16 pl-12 md:pl-16 pr-32 md:pr-36 text-base md:text-lg rounded-full border-2 shadow-xl"
              />
              <Button 
                type="submit"
                size="lg" 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Search
              </Button>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/match')}
                className="rounded-full"
              >
                <Heart className="w-4 h-4 mr-2" />
                Find Match
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/mentor')}
                className="rounded-full"
              >
                <Award className="w-4 h-4 mr-2" />
                Get Mentored
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/marketplace')}
                className="rounded-full"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Browse Market
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/community')}
                className="rounded-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-8 md:py-12 border-y bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {platformStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className={`w-8 h-8 md:w-10 md:h-10 ${stat.color} mx-auto mb-3`} />
                  <div className="text-2xl md:text-4xl font-bold mb-1">
                    <AnimatedCounter end={stat.value} />
                    <span className="text-lg">{stat.suffix}</span>
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Apps Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four powerful platforms designed to help the Habesha community thrive
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {mainApps.map((app) => {
              const Icon = app.icon;
              
              return (
                <Card
                  key={app.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary"
                  onClick={() => navigate(app.path)}
                >
                  <div className={`p-6 md:p-8 bg-gradient-to-br ${app.gradient}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                      <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {app.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{app.title_ti}</p>
                    <p className="text-muted-foreground mb-4">{app.description}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      {Object.entries(app.stats).map(([key, value]) => (
                        <div key={key}>
                          <div className="font-bold text-lg">{value}</div>
                          <div className="text-muted-foreground capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button 
                      className={`w-full bg-gradient-to-r ${app.color} hover:opacity-90 transition-opacity`}
                      size="lg"
                    >
                      Explore {app.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Star className="w-4 h-4 mr-2" />
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Stories from Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how Habesha Connect is making a difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {successStories.map((story) => (
              <Card key={story.id} className="p-6 hover:shadow-xl transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                      {story.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-bold">{story.author}</h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {story.location}
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2">{story.title}</h3>
                <p className="text-muted-foreground text-sm">{story.story}</p>

                <div className="mt-4 pt-4 border-t">
                  <Badge variant="secondary">
                    {story.type === 'match' && <Heart className="w-3 h-3 mr-1" />}
                    {story.type === 'mentor' && <Award className="w-3 h-3 mr-1" />}
                    {story.type === 'marketplace' && <Home className="w-3 h-3 mr-1" />}
                    {story.type.charAt(0).toUpperCase() + story.type.slice(1)}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Locations */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-green-500 to-teal-500 text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Growing Communities
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Habesha Communities Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with Habesha people in major cities around the world
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {trendingLocations.map((location, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold">{location.city}</h4>
                      <p className="text-sm text-muted-foreground">
                        {location.members.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {location.growth}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={() => navigate('/community')}>
              <Globe className="w-4 h-4 mr-2" />
              Explore All Locations
            </Button>
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <Zap className="w-4 h-4 mr-2" />
                Live Activity
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What's Happening Now
              </h2>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.text}</p>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of Habesha people connecting, learning, and growing together
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth/register')}
              className="bg-white text-blue-600 hover:bg-gray-100 min-w-[200px]"
            >
              Create Free Account
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth/login')}
              className="border-white text-white hover:bg-white/10 min-w-[200px]"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

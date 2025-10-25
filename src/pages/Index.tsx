import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import {
  Search, Heart, Users, Award, ShoppingBag, MessageSquare,
  Briefcase, Home, Stethoscope, Video, MapPin, TrendingUp,
  Calendar, ChevronRight, ArrowRight, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Main action categories
  const mainActions = [
    { 
      id: 'personal', 
      icon: Home, 
      label: 'Personal', 
      color: 'from-purple-500 to-pink-500',
      path: '/personal'
    },
    { 
      id: 'health', 
      icon: Stethoscope, 
      label: 'Get Healthy', 
      color: 'from-green-500 to-teal-500',
      path: '/health'
    },
    { 
      id: 'match', 
      icon: Heart, 
      label: 'Find Match', 
      color: 'from-pink-500 to-rose-500',
      path: '/match'
    },
    { 
      id: 'mentor', 
      icon: Award, 
      label: 'Get Mentored', 
      color: 'from-blue-500 to-cyan-500',
      path: '/mentor'
    },
    { 
      id: 'market', 
      icon: ShoppingBag, 
      label: 'Browse Market', 
      color: 'from-orange-500 to-amber-500',
      path: '/marketplace'
    },
    { 
      id: 'community', 
      icon: Users, 
      label: 'Join Community', 
      color: 'from-indigo-500 to-purple-500',
      path: '/community'
    }
  ];

  // Platform features with sub-categories
  const platforms = [
    {
      title: 'Find Your Match',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      description: 'Connect with compatible Habesha singles',
      subcategories: [
        { label: 'Discover', path: '/match/discover' },
        { label: 'My Matches', path: '/match/matches' },
        { label: 'My Profile', path: '/match/profile' },
        { label: 'Take Quiz', path: '/match/quiz' },
        { label: 'Go Live', path: 'https://habeshalive.com', external: true }
      ]
    },
    {
      title: 'Get Mentored',
      icon: Award,
      color: 'from-blue-500 to-cyan-500',
      description: 'Learn from experienced professionals',
      subcategories: [
        { label: 'Find Mentors', path: '/mentor/list' },
        { label: 'My Sessions', path: '/mentor/sessions' },
        { label: 'Become a Mentor', path: '/mentor/onboarding' }
      ]
    },
    {
      title: 'Buy & Sell',
      icon: ShoppingBag,
      color: 'from-orange-500 to-amber-500',
      description: 'Marketplace for the community',
      subcategories: [
        { label: 'Products', path: '/marketplace/products' },
        { label: 'Housing', path: '/marketplace/housing' },
        { label: 'Jobs & Gigs', path: '/marketplace/jobs' },
        { label: 'Services', path: '/marketplace/services' }
      ]
    },
    {
      title: 'Join Community',
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
      description: 'Connect with Habesha worldwide',
      subcategories: [
        { label: 'Forums', path: '/community/forums' },
        { label: 'Events', path: '/community/events' },
        { label: 'Groups', path: '/community/groups' }
      ]
    }
  ];

  // Success stories
  const stories = [
    {
      id: 1,
      title: 'Sara & Michael Found Perfect Match!',
      description: 'Met through our matchmaking platform',
      image: '/stories/story1.jpg',
      category: 'Match'
    },
    {
      id: 2,
      title: 'Daniel T. Landed Dream Job',
      description: 'Through our mentorship program',
      image: '/stories/story2.jpg',
      category: 'Career'
    },
    {
      id: 3,
      title: 'Meron Started Successful Business',
      description: 'Using marketplace connections',
      image: '/stories/story3.jpg',
      category: 'Business'
    },
    {
      id: 4,
      title: 'Community Event: 500+ Attendees',
      description: 'Annual Habesha gathering',
      image: '/stories/story4.jpg',
      category: 'Community'
    }
  ];

  // Countries
  const countries = [
    { name: 'USA', flag: '🇺🇸', members: '12.5K' },
    { name: 'UK', flag: '🇬🇧', members: '3.2K' },
    { name: 'Canada', flag: '🇨🇦', members: '4.1K' },
    { name: 'Germany', flag: '🇩🇪', members: '2.8K' },
    { name: 'UAE', flag: '🇦🇪', members: '1.9K' },
    { name: 'Sweden', flag: '🇸🇪', members: '1.5K' },
    { name: 'Norway', flag: '🇳🇴', members: '1.2K' },
    { name: 'Australia', flag: '🇦🇺', members: '890' },
    { name: 'Netherlands', flag: '🇳🇱', members: '750' },
    { name: 'Italy', flag: '🇮🇹', members: '620' }
  ];

  const stats = [
    { icon: Users, value: '25K+', label: 'Active Members' },
    { icon: Heart, value: '3.5K+', label: 'Success Stories' },
    { icon: Calendar, value: '850+', label: 'Events Hosted' },
    { icon: ShoppingBag, value: '5.2K+', label: 'Active Listings' }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSubcategoryClick = (path: string, external?: boolean) => {
    if (external) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header - Will be in Header component */}
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-2">
            Welcome to Habesha Community
          </h1>
          <p className="text-base md:text-xl text-center mb-8 opacity-90">
            Connect, Learn, Trade & Grow Together
          </p>

          {/* Search Bar - Headway Style */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for matches, mentors, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-14 pl-12 pr-4 text-base rounded-2xl bg-white/95 backdrop-blur border-0 shadow-lg"
              />
            </div>
          </div>

          {/* I want to */}
          <p className="text-sm font-semibold mb-3 px-1">I want to</p>

          {/* Action Buttons - Headway Style - 2 Columns, Horizontal Scroll */}
          <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
            <div className="grid grid-cols-2 gap-3 min-w-max pb-2">
              {mainActions.map((action) => (
                <Button
                  key={action.id}
                  onClick={() => action.path.startsWith('http') ? window.open(action.path) : navigate(action.path)}
                  className={`h-20 w-40 bg-gradient-to-r ${action.color} hover:opacity-90 text-white border-0 shadow-lg flex-col gap-2`}
                >
                  <action.icon className="w-6 h-6" />
                  <span className="text-sm font-semibold">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Everything You Need Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Everything You Need in One Place
          </h2>

          <div className="space-y-6">
            {platforms.map((platform) => (
              <Card key={platform.title} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center flex-shrink-0`}>
                    <platform.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{platform.title}</h3>
                    <p className="text-sm text-muted-foreground">{platform.description}</p>
                  </div>
                </div>

                {/* Horizontal Scrolling Subcategories */}
                <div className="overflow-x-auto hide-scrollbar -mx-2 px-2">
                  <div className="flex gap-2 pb-2">
                    {platform.subcategories.map((sub) => (
                      <Button
                        key={sub.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSubcategoryClick(sub.path, sub.external)}
                        className="whitespace-nowrap flex-shrink-0"
                      >
                        {sub.label}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Real Stories - Horizontal Scroll with Half Visible */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Real Stories from Our Community</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/stories')}>
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
            <div className="flex gap-4 pb-2">
              {stories.map((story, index) => (
                <Card
                  key={story.id}
                  className={`flex-shrink-0 cursor-pointer hover:shadow-lg transition-all ${
                    index === stories.length - 1 ? 'w-[280px]' : 'w-[260px]'
                  }`}
                  onClick={() => navigate(`/stories/${story.id}`)}
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-t-lg flex items-center justify-center">
                    <Heart className="w-12 h-12 text-pink-500" />
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2" variant="secondary">
                      {story.category}
                    </Badge>
                    <h3 className="font-bold mb-1">{story.title}</h3>
                    <p className="text-sm text-muted-foreground">{story.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Habesha Communities Worldwide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Habesha Communities Worldwide
          </h2>

          {/* 2 Rows, Horizontal Scroll */}
          <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 mb-4">
            <div className="grid grid-rows-2 gap-3 pb-2" style={{ gridAutoFlow: 'column', gridAutoColumns: 'minmax(140px, 1fr)' }}>
              {countries.map((country) => (
                <Button
                  key={country.name}
                  variant="outline"
                  className="h-20 flex-col gap-1 whitespace-nowrap"
                  onClick={() => navigate(`/community/country/${country.name.toLowerCase()}`)}
                >
                  <span className="text-3xl">{country.flag}</span>
                  <span className="font-semibold text-sm">{country.name}</span>
                  <span className="text-xs text-muted-foreground">{country.members}</span>
                </Button>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/community/locations')}
          >
            <Globe className="w-4 h-4 mr-2" />
            Explore All Locations
          </Button>
        </div>

        {/* Live Activity Map */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Live Activity - What's Happening Now
          </h2>

          {/* Map Placeholder */}
          <Card className="p-0 overflow-hidden mb-6">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 relative">
              {/* This will be replaced with actual map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-blue-500 animate-pulse" />
              </div>
              <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg text-sm font-semibold">
                🔴 Live
              </div>
            </div>
          </Card>

          {/* Stats Under Map - Compact */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-4 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Hide Scrollbar CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Star, Users, Award, TrendingUp, ArrowRight,
  Briefcase, Code, GraduationCap, Heart, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { VerifiedBadge } from '@/components/VerifiedBadge';

export default function MentorHome() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories with icons
  const categories = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'technology', label: 'Technology', icon: Code },
    { id: 'jobs', label: 'Jobs', icon: Building },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'life', label: 'Life', icon: Heart }
  ];

  // Featured mentors
  const featuredMentors = [
    {
      id: '1',
      name: 'Daniel Tesfay',
      avatar: 'DT',
      title: 'Software Engineer at Google',
      category: 'technology',
      rating: 4.9,
      reviews: 127,
      sessions: 234,
      hourlyRate: 75,
      isVerified: true,
      tags: ['Software Engineering', 'Career Growth']
    },
    {
      id: '2',
      name: 'Sara Woldu',
      avatar: 'SW',
      title: 'Founder & CEO of TechStart Eritrea',
      category: 'business',
      rating: 5.0,
      reviews: 89,
      sessions: 156,
      hourlyRate: 120,
      isVerified: true,
      tags: ['Entrepreneurship', 'Business Strategy']
    },
    {
      id: '3',
      name: 'Meron Kidane',
      avatar: 'MK',
      title: 'Digital Marketing Expert',
      category: 'business',
      rating: 4.8,
      reviews: 65,
      sessions: 98,
      hourlyRate: 60,
      isVerified: true,
      tags: ['Digital Marketing', 'Social Media']
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=mentor`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero Section - Compact */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              Find Your Mentor
            </h1>
            <p className="text-sm md:text-lg opacity-90">
              Connect with experienced professionals from the Habesha Community
            </p>
          </div>

          {/* Stats - HORIZONTAL LAYOUT */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">6+</div>
              <div className="text-xs md:text-sm opacity-90">Expert Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">1.2K+</div>
              <div className="text-xs md:text-sm opacity-90">Sessions Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">4.8★</div>
              <div className="text-xs md:text-sm opacity-90">Average Rating</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search mentors by name, skill, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/95 backdrop-blur border-0 text-gray-900"
            />
            {searchQuery && (
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8"
                onClick={handleSearch}
              >
                Search
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Categories - HORIZONTAL SNAP SCROLL */}
      <div className="sticky top-16 z-40 bg-background border-b">
        <div className="container mx-auto px-4 max-w-4xl py-3">
          <div className="overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="snap-start whitespace-nowrap flex-shrink-0 gap-2"
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - COMPACT SPACING */}
      <div className="container mx-auto px-4 py-4 md:py-6 max-w-4xl">
        {/* CTA Section - COMPACT */}
        <Card className="p-4 md:p-6 mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold mb-1">Become a Mentor</h3>
              <p className="text-sm text-muted-foreground">
                Share your expertise and help others grow
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate('/mentor/onboarding')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 whitespace-nowrap"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Featured Mentors - COMPACT */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-bold">Featured Mentors</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/mentor/list')}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {featuredMentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/mentor/${mentor.id}`)}
              >
                <div className="flex gap-3">
                  <Avatar className="w-14 h-14 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                      {mentor.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-base truncate">{mentor.name}</h3>
                      <VerifiedBadge isVerified={mentor.isVerified} size="sm" />
                    </div>

                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {mentor.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{mentor.rating}</span>
                        <span className="text-muted-foreground">({mentor.reviews})</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Award className="w-3.5 h-3.5" />
                        <span>{mentor.sessions} sessions</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="font-bold text-blue-600">
                        ${mentor.hourlyRate}/hr
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {mentor.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs px-2 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works - COMPACT */}
        <Card className="p-4 md:p-6 mb-4">
          <h2 className="text-xl font-bold mb-3">How It Works</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 font-bold text-blue-600 dark:text-blue-400">
                1
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Browse Mentors</h3>
                <p className="text-sm text-muted-foreground">
                  Find experts in your field of interest
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 font-bold text-blue-600 dark:text-blue-400">
                2
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Book a Session</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a time that works for both of you
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 font-bold text-blue-600 dark:text-blue-400">
                3
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Learn & Grow</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized guidance and feedback
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Browse All Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={() => navigate('/mentor/list')}
        >
          <Users className="w-5 h-5 mr-2" />
          Browse All Mentors
        </Button>
      </div>

      {/* Snap Scroll CSS */}
      <style>{`
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }
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
```


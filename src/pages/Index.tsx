import { useState } from 'react';
import { 
  Heart, GraduationCap, ShoppingBag, Users, Search,
  TrendingUp, Sparkles, Globe, MessageSquare,
  Home, Briefcase, Wrench, Calendar, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUsers] = useState(12847);

  const mainApps = [
    {
      id: 'matchmaking',
      name: 'Matchmaking',
      name_ti: 'መስዋእቲ',
      name_am: 'ጋብቻ',
      icon: Heart,
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      description: 'Find your soulmate',
      description_ti: 'ሕይወትካ ምስ ዝመስል ሰብ ርኸብ',
      path: '/match',
      stats: '3,421 matches made',
      highlight: 'Most Popular',
      tagline: 'Faith-centered connections'
    },
    {
      id: 'mentorship',
      name: 'Mentorship',
      name_ti: 'መምህርነት',
      name_am: 'አማካሪነት',
      icon: GraduationCap,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      description: 'Learn from experts',
      description_ti: 'ካብ ጥበብተኛታት ተማሃር',
      path: '/mentor',
      stats: '847 active mentors',
      highlight: 'New',
      tagline: 'Career & personal growth'
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      name_ti: 'ዕዳጋ',
      name_am: 'ገበያ',
      icon: ShoppingBag,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      description: 'Buy, sell, find housing & jobs',
      description_ti: 'ግዛእ፣ ሽጥ፣ ገዛ ወይ ስራሕ ርኸብ',
      path: '/market',
      stats: '5,234 active listings',
      tagline: 'Products • Housing • Jobs • Services',
      subcategories: [
        { name: 'Products', name_ti: 'ኣቕሑ', icon: ShoppingBag, path: '/market' },
        { name: 'Housing', name_ti: 'ገዛ', icon: Home, path: '/browse?category=housing' },
        { name: 'Jobs', name_ti: 'ስራሕ', icon: Briefcase, path: '/browse?category=jobs' },
        { name: 'Services', name_ti: 'ኣገልግሎት', icon: Wrench, path: '/browse?category=services' }
      ]
    },
    {
      id: 'community',
      name: 'Community',
      name_ti: 'ማሕበረሰብ',
      name_am: 'ማህበረሰብ',
      icon: Users,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      description: 'Forums, events & groups',
      description_ti: 'መድረኽ፣ ፈስቲቫላት፣ ጉጅለታት',
      path: '/forums',
      stats: '892 active discussions',
      tagline: 'Connect with your community',
      subcategories: [
        { name: 'Forums', name_ti: 'መድረኽ', icon: MessageSquare, path: '/forums' },
        { name: 'Events', name_ti: 'ፈስቲቫል', icon: Calendar, path: '/browse?category=events' },
        { name: 'Groups', name_ti: 'ጉጅለ', icon: Users, path: '/forums' }
      ]
    }
  ];

  const cityData = [
    { city: 'Asmara', city_ti: 'ኣስመራ', country: '🇪🇷', users: 2341, left: '52%', top: '48%' },
    { city: 'Addis Ababa', city_ti: 'አዲስ አበባ', country: '🇪🇹', users: 3892, left: '54%', top: '52%' },
    { city: 'Washington DC', city_ti: 'ዋሽንግተን', country: '🇺🇸', users: 1847, left: '25%', top: '42%' },
    { city: 'Toronto', city_ti: 'ቶሮንቶ', country: '🇨🇦', users: 1234, left: '22%', top: '38%' },
    { city: 'London', city_ti: 'ለንደን', country: '🇬🇧', users: 892, left: '48%', top: '35%' },
    { city: 'Stockholm', city_ti: 'ስቶክሆልም', country: '🇸🇪', users: 741, left: '50%', top: '28%' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const checkAuthAndNavigate = async (path: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && (path.includes('match') || path.includes('mentor'))) {
      navigate(`/auth/login?redirect=${path}`);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8 md:pb-0">
      {/* Hero Section - Mobile Optimized */}
      <section className="container mx-auto px-4 py-8 md:py-12 lg:py-20 max-w-7xl">
        {/* Logo & Tagline */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            HabeshaCommunity
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium px-4">
            ሓደ ማሕበረሰብ • One Community • አንድ ማህበረሰብ
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            🇪🇷 Eritrea • 🇪🇹 Ethiopia • 🌍 Worldwide
          </p>
        </div>

        {/* Global Search Bar - Mobile Optimized */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8 md:mb-12 px-2">
          <div className="relative group">
            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search everything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 md:h-16 pl-12 md:pl-16 pr-4 md:pr-6 text-base md:text-lg rounded-full border-2 shadow-lg hover:shadow-xl focus:shadow-2xl transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
              onClick={() => navigate('/match')}
            >
              💝 Find Match
            </Badge>
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              onClick={() => setSearchQuery('housing in Asmara')}
            >
              🏠 Housing in Asmara
            </Badge>
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              onClick={() => setSearchQuery('remote jobs')}
            >
              💼 Remote Jobs
            </Badge>
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              onClick={() => navigate('/mentor')}
            >
              🎓 Business Mentors
            </Badge>
          </div>
        </form>

        {/* Live Map Preview - Mobile Optimized */}
        <Card className="mb-8 md:mb-12 overflow-hidden shadow-2xl">
          <div className="relative h-64 md:h-80 lg:h-[400px] bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30">
            {/* Map Background Pattern */}
            <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
              <Globe className="w-12 h-12 md:w-16 lg:w-20 text-blue-500 mb-3 md:mb-4 animate-spin" style={{ animationDuration: '20s' }} />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-center">🌍 Global Community</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {activeUsers.toLocaleString()} active members
              </p>
              
              {/* City Badges */}
              <div className="flex flex-wrap gap-2 justify-center max-w-full px-4">
                {cityData.map((location) => (
                  <Badge 
                    key={location.city}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:scale-105 transition-transform cursor-pointer text-xs md:text-sm"
                    onClick={() => setSearchQuery(location.city)}
                  >
                    {location.country} {location.city}: {location.users.toLocaleString()}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Breathing dots - Hidden on small mobile */}
            <div className="absolute inset-0 pointer-events-none hidden sm:block">
              {cityData.map((location, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: location.left,
                    top: location.top,
                  }}
                >
                  <div 
                    className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full animate-ping absolute"
                    style={{
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: '2s'
                    }}
                  />
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Main 4 Apps Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {mainApps.map((app, index) => {
            const Icon = app.icon;
            
            return (
              <Card
                key={app.id}
                className="group relative overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => checkAuthAndNavigate(app.path)}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                {/* Content */}
                <div className="relative p-4 md:p-6 space-y-3 md:space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    {app.highlight && (
                      <Badge className="bg-amber-500 text-white text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {app.highlight}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1 md:mb-2">
                      {app.name_ti} • {app.name_am}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                      {app.description}
                    </p>
                    <p className="text-xs text-muted-foreground italic">{app.tagline}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center text-xs md:text-sm font-medium text-muted-foreground">
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-2 text-green-500" />
                    {app.stats}
                  </div>

                  {/* Subcategories */}
                  {app.subcategories && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2 pt-2 border-t border-border">
                      {app.subcategories.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <Badge 
                            key={sub.name} 
                            variant="secondary" 
                            className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(sub.path);
                            }}
                          >
                            <SubIcon className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">{sub.name}</span>
                            <span className="sm:hidden">{sub.name_ti}</span>
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {/* Arrow */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between group-hover:bg-primary/10 transition-colors text-sm"
                  >
                    <span>Enter</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick Stats - Mobile Optimized */}
      <section className="bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-2xl md:text-4xl font-bold text-pink-600 dark:text-pink-400 mb-1 md:mb-2">3.4K</div>
              <div className="text-xs md:text-sm text-muted-foreground">Matches</div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 md:mb-2">847</div>
              <div className="text-xs md:text-sm text-muted-foreground">Mentors</div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 md:mb-2">5.2K</div>
              <div className="text-xs md:text-sm text-muted-foreground">Listings</div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1 md:mb-2">892</div>
              <div className="text-xs md:text-sm text-muted-foreground">Discussions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Note & Values - Mobile Optimized */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
            <div className="text-center mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold mb-2">🌟 Our Values</h3>
              <p className="text-sm md:text-base text-muted-foreground">Built for the Habesha diaspora</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl md:text-3xl mb-2">🇪🇷 🇪🇹</div>
                <h4 className="font-bold text-sm md:text-base mb-1">Eritrean & Ethiopian</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Both communities equally</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl mb-2">☪️ ✝️</div>
                <h4 className="font-bold text-sm md:text-base mb-1">All Faiths Welcome</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Orthodox, Catholic, Muslim</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl mb-2">🗣️</div>
                <h4 className="font-bold text-sm md:text-base mb-1">Multi-Language</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Tigrinya, Amharic, English</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA - Mobile Optimized */}
      <section className="py-8 md:py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white mx-4 md:mx-0 rounded-2xl md:rounded-none">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            Join Our Community
          </h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto px-4">
            Connect with Habesha singles, find mentors, and engage with your community
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button 
              size="lg"
              onClick={() => checkAuthAndNavigate('/match')}
              className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-white text-blue-600 hover:bg-gray-100"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Start Matching
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate('/auth/register')}
              className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-transparent border-2 border-white hover:bg-white/10"
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>

      <style>{`
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

export default Index;

import { useState, useEffect } from 'react';
import { 
  Heart, GraduationCap, ShoppingBag, Users, Search,
  TrendingUp, Sparkles, MessageSquare,
  Home, Briefcase, Wrench, Calendar, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from 'next-themes';
import WorldActivityHero from '@/components/WorldActivityHero';

const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const SearchBarComponent = () => (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
          <Input
            type="text"
            placeholder="Search everything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 pl-16 pr-6 text-lg rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 shadow-lg hover:shadow-xl focus:shadow-2xl transition-all focus:bg-white/20"
          />
        </div>
      </form>
      
      {/* Four main buttons below search */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          type="button"
          size="lg"
          className="min-w-[120px] bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
          onClick={() => checkAuthAndNavigate('/forums')}
        >
          <Users className="w-5 h-5 mr-2" />
          Community
        </Button>
        <Button
          type="button"
          size="lg"
          className="min-w-[120px] bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
          onClick={() => checkAuthAndNavigate('/match')}
        >
          <Heart className="w-5 h-5 mr-2" />
          Match
        </Button>
        <Button
          type="button"
          size="lg"
          className="min-w-[120px] bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
          onClick={() => checkAuthAndNavigate('/market')}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Market
        </Button>
        <Button
          type="button"
          size="lg"
          className="min-w-[120px] bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
          onClick={() => checkAuthAndNavigate('/mentor')}
        >
          <GraduationCap className="w-5 h-5 mr-2" />
          Mentor
        </Button>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background pb-8 md:pb-0">
      {/* Title above map */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          HabeshaCommunity
        </h1>
      </div>

      {/* World Activity Map with Search Bar */}
      <WorldActivityHero
        mode={theme === 'dark' ? 'dark' : 'light'}
        onCityClick={(city) => navigate(`/browse?city=${encodeURIComponent(city)}`)}
        SearchBar={SearchBarComponent}
        onNavigate={(path) => navigate(path)}
      />

      {/* Main 4 Apps Grid */}
      <section className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {mainApps.map((app) => {
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

      {/* Quick Stats */}
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

      {/* Cultural Note & Values */}
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

      {/* Final CTA */}
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

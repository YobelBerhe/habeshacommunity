import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Book, Heart, Users, ShoppingBag, Calendar, Activity,
  ChevronRight, MessageCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GlobalSearch } from '@/components/GlobalSearch';
import { GlobalHeader } from '@/components/navigation/GlobalHeader';

interface CategoryConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  href: string;
  description: string;
  badge?: number;
}

const ALL_CATEGORIES: CategoryConfig[] = [
  { 
    id: 'spiritual', 
    label: 'Spiritual', 
    icon: Book, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
    href: '/spiritual/today',
    description: 'Bible, prayers, reading plans'
  },
  { 
    id: 'match', 
    label: 'Match', 
    icon: Heart, 
    color: 'text-pink-600',
    bgColor: 'bg-pink-500',
    href: '/match/discover',
    description: 'Find your life partner'
  },
  { 
    id: 'mentor', 
    label: 'Mentor', 
    icon: Users, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    href: '/mentor',
    description: 'Get guidance & advice'
  },
  { 
    id: 'marketplace', 
    label: 'Marketplace', 
    icon: ShoppingBag, 
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    href: '/marketplace',
    description: 'Jobs, housing, products'
  },
  { 
    id: 'community', 
    label: 'Community', 
    icon: Calendar, 
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-500',
    href: '/community',
    description: 'Events, groups, forums'
  },
  { 
    id: 'health', 
    label: 'Health', 
    icon: Activity, 
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-500',
    href: '/health',
    description: 'Nutrition, fitness, wellness'
  },
  { 
    id: 'inbox', 
    label: 'Inbox', 
    icon: MessageCircle, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
    href: '/inbox',
    description: 'Messages & conversations'
  },
];

export default function Hub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userName, setUserName] = useState('Friend');
  const [visibleCategories, setVisibleCategories] = useState<string[]>(ALL_CATEGORIES.map(c => c.id));
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);
  const [lastActiveCategory, setLastActiveCategory] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUnreadMessages();
      setGreeting(getGreeting());
    }
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchUserProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('display_name, visible_categories, hidden_categories')
      .eq('id', user.id)
      .single();
    
    if (data) {
      if (data.display_name) {
        setUserName(data.display_name.split(' ')[0]);
      }
      
      setVisibleCategories(data.visible_categories || ALL_CATEGORIES.map(c => c.id));
      setHiddenCategories(data.hidden_categories || []);
      
      // Get last active category from localStorage
      const lastActive = localStorage.getItem(`lastActiveCategory_${user.id}`);
      setLastActiveCategory(lastActive);
    }
  };

  const fetchUnreadMessages = async () => {
    // Placeholder - would query messages table if available
    setUnreadMessages(0);
  };

  const handleCategoryClick = (categoryId: string, href: string) => {
    if (user) {
      localStorage.setItem(`lastActiveCategory_${user.id}`, categoryId);
    }
    navigate(href);
  };

  const activeCategories = ALL_CATEGORIES.filter(cat => 
    visibleCategories.includes(cat.id)
  );

  const comingSoonCategories = ALL_CATEGORIES.filter(cat => 
    hiddenCategories.includes(cat.id)
  );

  const continueCategory = lastActiveCategory 
    ? ALL_CATEGORIES.find(c => c.id === lastActiveCategory)
    : null;

  // Add unread badge to inbox category
  const categoriesWithBadges = activeCategories.map(cat => {
    if (cat.id === 'inbox' && unreadMessages > 0) {
      return { ...cat, badge: unreadMessages };
    }
    return cat;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader showSearch />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">
        {/* Greeting */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">
            {greeting}, {userName} 👋
          </h1>
          <p className="text-muted-foreground">Welcome to your community hub</p>
        </div>

        {/* Global Search */}
        <div className="mb-6">
          <GlobalSearch />
        </div>

        {/* Continue Card */}
        {continueCategory && visibleCategories.includes(continueCategory.id) && (
          <Card 
            className="mb-6 p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
            onClick={() => handleCategoryClick(continueCategory.id, continueCategory.href)}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${continueCategory.bgColor}/10`}>
                <continueCategory.icon className={`h-6 w-6 ${continueCategory.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Continue where you left off</p>
                <p className="font-semibold text-foreground">{continueCategory.label}</p>
                <p className="text-sm text-muted-foreground">{continueCategory.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        )}

        {/* Your Categories */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Services</h2>
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate('/hub/manage-categories')}
              className="text-primary"
            >
              Manage
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categoriesWithBadges.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow relative"
                  onClick={() => handleCategoryClick(category.id, category.href)}
                >
                  {category.badge !== undefined && category.badge > 0 && (
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      {category.badge}
                    </Badge>
                  )}
                  <div className={`w-12 h-12 rounded-full ${category.bgColor}/10 flex items-center justify-center mb-3`}>
                    <Icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground">{category.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Coming Soon */}
        {comingSoonCategories.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Add More Services</h2>
            <div className="grid grid-cols-2 gap-4">
              {comingSoonCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.id} className="p-4 opacity-60">
                    <Badge variant="secondary" className="mb-2">Hidden</Badge>
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">{category.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/hub/manage-categories');
                      }}
                    >
                      Enable
                    </Button>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Card 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
              onClick={() => navigate('/hub/manage-categories')}
            >
              Manage your categories
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Card>
            <Card 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
              onClick={() => navigate('/account/settings')}
            >
              Account settings
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Card>
            <Card 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
              onClick={() => navigate('/help')}
            >
              Help & support
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

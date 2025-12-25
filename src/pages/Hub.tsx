import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Book, Heart, Users, ShoppingBag, Calendar, Activity,
  Bell, Settings, LogOut, ChevronRight, Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { GlobalSearch } from '@/components/GlobalSearch';

interface CategoryConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  href: string;
  description: string;
}

const ALL_CATEGORIES: CategoryConfig[] = [
  { 
    id: 'spiritual', 
    label: 'Spiritual', 
    icon: Book, 
    color: 'text-spiritual',
    bgColor: 'bg-spiritual',
    href: '/spiritual/today',
    description: 'Bible, prayers, reading plans'
  },
  { 
    id: 'match', 
    label: 'Match', 
    icon: Heart, 
    color: 'text-match',
    bgColor: 'bg-match',
    href: '/match/discover',
    description: 'Find your life partner'
  },
  { 
    id: 'mentor', 
    label: 'Mentor', 
    icon: Users, 
    color: 'text-mentor',
    bgColor: 'bg-mentor',
    href: '/mentor',
    description: 'Get guidance & advice'
  },
  { 
    id: 'marketplace', 
    label: 'Marketplace', 
    icon: ShoppingBag, 
    color: 'text-marketplace',
    bgColor: 'bg-marketplace',
    href: '/marketplace',
    description: 'Jobs, housing, products'
  },
  { 
    id: 'community', 
    label: 'Community', 
    icon: Calendar, 
    color: 'text-community',
    bgColor: 'bg-community',
    href: '/community',
    description: 'Events, groups, forums'
  },
  { 
    id: 'health', 
    label: 'Health', 
    icon: Activity, 
    color: 'text-health',
    bgColor: 'bg-health',
    href: '/health',
    description: 'Nutrition, fitness, wellness'
  },
];

export default function Hub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userName, setUserName] = useState('Friend');
  const [userInitials, setUserInitials] = useState('U');
  const [visibleCategories, setVisibleCategories] = useState<string[]>(ALL_CATEGORIES.map(c => c.id));
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);
  const [lastActiveCategory, setLastActiveCategory] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUnreadCount();
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
    const { data } = await supabase
      .from('profiles')
      .select('display_name, visible_categories, hidden_categories')
      .eq('id', user?.id)
      .single();
    
    if (data) {
      if (data.display_name) {
        setUserName(data.display_name.split(' ')[0]);
        setUserInitials(
          data.display_name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()
        );
      }
      
      setVisibleCategories(data.visible_categories || ALL_CATEGORIES.map(c => c.id));
      setHiddenCategories(data.hidden_categories || []);
      
      // Get last active category from localStorage
      const lastActive = localStorage.getItem(`lastActiveCategory_${user?.id}`);
      setLastActiveCategory(lastActive);
    }
  };

  const fetchUnreadCount = async () => {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id)
      .eq('read', false);
    
    setUnreadCount(count || 0);
  };

  const handleCategoryClick = (categoryId: string, href: string) => {
    // Save as last active category
    localStorage.setItem(`lastActiveCategory_${user?.id}`, categoryId);
    navigate(href);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                HabeshaCommunity
              </span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account/dashboard')}>
                    <Users className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/account/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/hub/manage-categories')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Manage Categories
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

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
            className="mb-6 p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4"
            style={{ borderLeftColor: `hsl(var(--${continueCategory.id}))` }}
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
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Services</h2>
          <div className="grid grid-cols-2 gap-4">
            {activeCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCategoryClick(category.id, category.href)}
                >
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
                      onClick={() => navigate('/hub/manage-categories')}
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

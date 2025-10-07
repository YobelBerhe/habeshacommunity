import { Moon, Sun, Globe, Bell, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import AppSwitcher from './nav/AppSwitcher';
import MobileDrawer from './nav/MobileDrawer';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const Header = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('ti');
  const [user, setUser] = useState<any>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    checkUser();
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchCounts = async () => {
    if (!user) return;

    // Fetch conversations for the user
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id')
      .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`);

    const conversationIds = conversations?.map(c => c.id) || [];

    // Fetch unread messages
    if (conversationIds.length > 0) {
      const { count: msgCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('read', false)
        .in('conversation_id', conversationIds);
      
      setUnreadMessages(msgCount || 0);
    }

    // Fetch unread notifications
    const { count: notifCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    setNotifications(notifCount || 0);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const languages = [
    { code: 'ti', name: 'ትግርኛ', name_en: 'Tigrinya', flag: '🇪🇷' },
    { code: 'am', name: 'አማርኛ', name_en: 'Amharic', flag: '🇪🇹' },
    { code: 'en', name: 'English', name_en: 'English', flag: '🇺🇸' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left: Mobile Menu + Logo + App Switcher */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <MobileDrawer />
            
            <Button
              variant="ghost"
              className="font-bold text-base md:text-lg hover:text-primary p-2"
              onClick={() => navigate('/')}
            >
              <span className="hidden sm:inline">HabeshaCommunity</span>
              <span className="sm:hidden">Habesha</span>
            </Button>
            
            <div className="hidden lg:block">
              <AppSwitcher />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Language Toggle - Hidden on small mobile */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" title="Language">
                    <Globe className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    Language
                  </div>
                  <DropdownMenuSeparator />
                  {languages.map(lang => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`cursor-pointer ${language === lang.code ? 'bg-primary/10' : ''}`}
                    >
                      <span className="mr-2 text-lg">{lang.flag}</span>
                      <div>
                        <div className="font-medium text-sm">{lang.name}</div>
                        <div className="text-xs text-muted-foreground">{lang.name_en}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {user ? (
              <>
                {/* Notifications - Hidden on small mobile */}
                <div className="hidden sm:block">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative"
                      onClick={() => navigate('/notifications')}
                      title="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {notifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                          {notifications}
                        </Badge>
                      )}
                    </Button>
                  </div>

                {/* Messages */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => navigate('/inbox')}
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </Badge>
                  )}
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full p-0">
                      <Avatar className="h-9 w-9 md:h-10 md:w-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-sm">
                          {user.email?.[0].toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Manage account</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/account/dashboard')}>
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/match/profile/me')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/account/settings')}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/auth/login')}
                  className="hidden sm:inline-flex"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/auth/register')}
                >
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Join</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


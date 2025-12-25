import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  MessageCircle, 
  Bell, 
  Search
} from 'lucide-react';

interface GlobalHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  transparent?: boolean;
}

export function GlobalHeader({ 
  title, 
  showBack = false,
  showSearch = false,
  transparent = false 
}: GlobalHeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [userInitials, setUserInitials] = useState('U');

  const fetchUnreadCounts = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch unread notifications count
      const { data: notifData } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('read', false)
        .limit(100);

      setUnreadNotifications(notifData?.length || 0);
      
      // For messages, we'll just set a placeholder for now
      // Real implementation would query a messages table if available
      setUnreadMessages(0);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  }, [user]);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();
    
    if (data?.display_name) {
      setUserInitials(
        data.display_name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      );
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUnreadCounts();
      fetchUserProfile();
      
      // Real-time subscriptions for notifications
      const notificationsChannel = supabase
        .channel('notifications-header')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'notifications',
        }, () => {
          fetchUnreadCounts();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(notificationsChannel);
      };
    }
  }, [user, fetchUnreadCounts, fetchUserProfile]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/hub');
    }
  };

  return (
    <header className={`sticky top-0 z-50 ${transparent ? 'bg-transparent' : 'bg-background/95 backdrop-blur border-b'}`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-14 flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-2">
            {showBack ? (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <button 
                className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
                onClick={() => navigate('/hub')}
              >
                HC
              </button>
            )}
            
            {title && (
              <h1 className="text-lg font-semibold ml-1">{title}</h1>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1">
            {/* Search - only on hub */}
            {showSearch && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/search')}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Messages - ALWAYS VISIBLE */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/inbox')}
              aria-label={`Messages ${unreadMessages > 0 ? `(${unreadMessages} unread)` : ''}`}
            >
              <MessageCircle className="h-5 w-5" />
              {unreadMessages > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </Badge>
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/notifications')}
              aria-label={`Notifications ${unreadNotifications > 0 ? `(${unreadNotifications} unread)` : ''}`}
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Badge>
              )}
            </Button>

            {/* Profile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate('/dashboard/profile')}
              aria-label="Profile menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

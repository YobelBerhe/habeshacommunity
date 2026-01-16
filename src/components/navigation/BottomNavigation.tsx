import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, MessageCircle, Bell, User, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  matchPaths?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: Home, 
    href: '/home',
    matchPaths: ['/home', '/hub']
  },
  { 
    id: 'discover', 
    label: 'Discover', 
    icon: Compass, 
    href: '/browse',
    matchPaths: ['/browse', '/search']
  },
  { 
    id: 'inbox', 
    label: 'Messages', 
    icon: MessageCircle, 
    href: '/inbox',
    matchPaths: ['/inbox', '/chat']
  },
  { 
    id: 'activity', 
    label: 'Activity', 
    icon: Bell, 
    href: '/notifications',
    matchPaths: ['/notifications']
  },
  { 
    id: 'account', 
    label: 'Account', 
    icon: User, 
    href: '/account/dashboard',
    matchPaths: ['/account', '/dashboard', '/settings']
  }
];

interface BottomNavigationProps {
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Determine active tab based on current path
  const getActiveTab = () => {
    const currentPath = location.pathname;
    
    for (const item of NAV_ITEMS) {
      if (item.matchPaths?.some(path => currentPath.startsWith(path))) {
        return item.id;
      }
    }
    
    return 'home';
  };

  const activeTab = getActiveTab();

  // Fetch unread counts
  useEffect(() => {
    if (user) {
      fetchUnreadCounts();
      
      // Subscribe to real-time updates
      const messagesChannel = supabase
        .channel('messages-count')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages'
          },
          () => fetchUnreadCounts()
        )
        .subscribe();

      const notificationsChannel = supabase
        .channel('notifications-count')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          () => fetchUnreadCounts()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messagesChannel);
        supabase.removeChannel(notificationsChannel);
      };
    }
  }, [user]);

  const fetchUnreadCounts = async () => {
    if (!user) return;

    // Fetch unread messages - get conversations where user is participant and has unread
    const { count: messagesCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .neq('sender_id', user.id)
      .eq('read', false);

    setUnreadMessages(messagesCount || 0);

    // Fetch unread notifications
    const { count: notificationsCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    setUnreadNotifications(notificationsCount || 0);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40",
      "safe-area-bottom",
      className
    )}>
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const showBadge = 
            (item.id === 'inbox' && unreadMessages > 0) ||
            (item.id === 'activity' && unreadNotifications > 0);
          const badgeCount = item.id === 'inbox' ? unreadMessages : unreadNotifications;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className="flex flex-col items-center justify-center gap-1 px-3 py-1 relative min-w-[60px]"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-emerald-100 scale-110" 
                  : "bg-transparent hover:bg-gray-100"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isActive ? "text-emerald-600" : "text-gray-400"
                )} />
              </div>
              
              <span className={cn(
                "text-[10px] font-semibold transition-colors duration-200",
                isActive ? "text-emerald-600" : "text-gray-400"
              )}>
                {item.label}
              </span>

              {/* Badge */}
              {showBadge && (
                <div className="absolute top-0 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-[9px] text-white font-bold px-1">
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        .safe-area-bottom {
          padding-bottom: max(env(safe-area-inset-bottom), 8px);
        }
      `}</style>
    </nav>
  );
};

export default BottomNavigation;

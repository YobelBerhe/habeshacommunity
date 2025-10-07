import { Sparkles, Users, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function MatchBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [matchCount, setMatchCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadCounts();
    const interval = setInterval(loadCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadCounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Count mutual matches
      const { count: matches } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      // Count unread messages
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`);

      if (conversations) {
        const convIds = conversations.map(c => c.id);
        const { count: unread } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .in('conversation_id', convIds)
          .eq('read', false)
          .neq('sender_id', user.id);

        setUnreadCount(unread || 0);
      }

      setMatchCount(matches || 0);
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  };

  const items = [
    { id: 'discover', path: '/match/discover', icon: Sparkles, label: 'Discover', badge: null },
    { id: 'matches', path: '/match/matches', icon: Users, label: 'Matches', badge: matchCount },
    { id: 'messages', path: '/inbox', icon: MessageCircle, label: 'Messages', badge: unreadCount },
    { id: 'profile', path: '/match/profile/me', icon: User, label: 'Profile', badge: null },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50 lg:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors relative
                ${active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 mb-1 ${active ? 'fill-primary/20' : ''}`} />
                {item.badge !== null && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
                    {item.badge > 9 ? '9+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs font-medium ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

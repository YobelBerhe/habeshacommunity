import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Users, MessageSquare, MoreHorizontal } from 'lucide-react';

export default function CommunityNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/hub', icon: Home, label: 'Home' },
    { path: '/community/events', icon: Calendar, label: 'Events' },
    { path: '/community/groups', icon: Users, label: 'Groups' },
    { path: '/community/forums', icon: MessageSquare, label: 'Forums' },
    { path: '/community/more', icon: MoreHorizontal, label: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/community/events' && location.pathname === '/community');

          return (
            <Button
              key={path}
              variant="ghost"
              className={`flex flex-col items-center gap-1 h-14 px-3 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => navigate(path)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">
                {label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}

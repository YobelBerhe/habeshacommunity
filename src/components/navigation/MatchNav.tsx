import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Compass, MessageCircle, Star, MoreHorizontal } from 'lucide-react';

export default function MatchNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/hub', icon: Home, label: 'Home' },
    { path: '/match/discover', icon: Compass, label: 'Discover' },
    { path: '/match/matches', icon: MessageCircle, label: 'Matches' },
    { path: '/match/liked', icon: Star, label: 'Liked' },
    { path: '/match/more', icon: MoreHorizontal, label: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/match/discover' && location.pathname === '/match');

          return (
            <Button
              key={path}
              variant="ghost"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${
                isActive ? 'text-match' : 'text-muted-foreground'
              }`}
              onClick={() => navigate(path)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">
                {label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}

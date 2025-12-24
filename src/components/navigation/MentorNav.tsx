import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, Calendar, User, MoreHorizontal } from 'lucide-react';

export default function MentorNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/hub', icon: Home, label: 'Home' },
    { path: '/mentor/browse', icon: Search, label: 'Browse' },
    { path: '/mentor/sessions', icon: Calendar, label: 'Sessions' },
    { path: '/mentor/become', icon: User, label: 'Become Mentor' },
    { path: '/mentor/more', icon: MoreHorizontal, label: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/mentor/browse' && location.pathname === '/mentor');

          return (
            <Button
              key={path}
              variant="ghost"
              className={`flex flex-col items-center gap-1 h-14 px-3 ${
                isActive ? 'text-mentor' : 'text-muted-foreground'
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

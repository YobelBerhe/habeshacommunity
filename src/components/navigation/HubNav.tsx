import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, User } from 'lucide-react';

export default function HubNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/hub', icon: Home, label: 'Home' },
    { path: '/inbox', icon: MessageCircle, label: 'Inbox' },
    { path: '/account/dashboard', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-around h-16">
          {tabs.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;

            return (
              <Button
                key={path}
                variant="ghost"
                className={`flex-col h-14 px-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => navigate(path)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">
                  {label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

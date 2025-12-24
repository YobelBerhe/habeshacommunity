import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Grid, Package, Heart, MoreHorizontal } from 'lucide-react';

export default function MarketplaceNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/hub', icon: Home, label: 'Home' },
    { path: '/marketplace/browse', icon: Grid, label: 'Browse' },
    { path: '/marketplace/selling', icon: Package, label: 'Selling' },
    { path: '/marketplace/saved', icon: Heart, label: 'Saved' },
    { path: '/marketplace/more', icon: MoreHorizontal, label: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/marketplace/browse' && location.pathname === '/marketplace');

          return (
            <Button
              key={path}
              variant="ghost"
              className={`flex flex-col items-center gap-1 h-14 px-3 ${
                isActive ? 'text-marketplace' : 'text-muted-foreground'
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

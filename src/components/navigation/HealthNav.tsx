import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, UtensilsCrossed, Dumbbell, TrendingUp, MoreHorizontal } from 'lucide-react';

export default function HealthNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/hub', icon: Home, label: 'Home' },
    { path: '/health/nutrition', icon: UtensilsCrossed, label: 'Nutrition' },
    { path: '/health/fitness', icon: Dumbbell, label: 'Fitness' },
    { path: '/health/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/health/more', icon: MoreHorizontal, label: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/health/nutrition' && location.pathname === '/health');

          return (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => navigate(path)}
            >
              <Icon className="h-5 w-5" />
              <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                {label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}

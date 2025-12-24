import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Book, CheckSquare, MoreHorizontal } from 'lucide-react';

export default function SpiritualNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/hub', icon: Home, label: 'Home' },
    { path: '/spiritual/today', icon: BookOpen, label: 'Today' },
    { path: '/spiritual/bible', icon: Book, label: 'Bible' },
    { path: '/spiritual/plans', icon: CheckSquare, label: 'Plans' },
    { path: '/spiritual/more', icon: MoreHorizontal, label: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex justify-around py-2">
          {tabs.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || 
              (path === '/spiritual/today' && location.pathname === '/spiritual');

            return (
              <Button
                key={path}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  isActive ? 'text-spiritual' : 'text-muted-foreground'
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
      </div>
    </nav>
  );
}

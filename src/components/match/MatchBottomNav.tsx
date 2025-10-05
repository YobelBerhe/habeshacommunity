import { Home, Search, Heart, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function MatchBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { id: 'discover', path: '/match/discover', icon: Search, label: 'Discover' },
    { id: 'matches', path: '/match/list', icon: Heart, label: 'Matches' },
    { id: 'chat', path: '/inbox', icon: MessageCircle, label: 'Messages' },
    { id: 'profile', path: '/account/settings', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-around z-50 safe-area-pb">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center space-y-1 py-2 transition-colors ${
              isActive ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

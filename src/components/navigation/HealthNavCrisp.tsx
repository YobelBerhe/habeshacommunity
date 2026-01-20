import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Apple, Dumbbell, TrendingUp, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  matchPaths?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { 
    id: 'home', 
    label: 'Today', 
    icon: Home, 
    path: '/health',
    matchPaths: ['/health']
  },
  { 
    id: 'nutrition', 
    label: 'Nutrition', 
    icon: Apple, 
    path: '/health/nutrition',
    matchPaths: ['/health/nutrition', '/health/nutrition/log', '/health/recipes']
  },
  { 
    id: 'fitness', 
    label: 'Fitness', 
    icon: Dumbbell, 
    path: '/health/fitness',
    matchPaths: ['/health/fitness', '/health/exercise']
  },
  { 
    id: 'progress', 
    label: 'Progress', 
    icon: TrendingUp, 
    path: '/health/progress',
    matchPaths: ['/health/progress', '/health/dashboard']
  },
  { 
    id: 'more', 
    label: 'More', 
    icon: MoreHorizontal, 
    path: '/health/more',
    matchPaths: ['/health/more', '/health/fasting', '/health/sleep', '/health/hydration', '/health/mental']
  },
];

export default function HealthNavCrisp() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const currentPath = location.pathname;
    
    // Check exact match first
    for (const item of NAV_ITEMS) {
      if (currentPath === item.path) return item.id;
    }
    
    // Check path matches
    for (const item of NAV_ITEMS) {
      if (item.matchPaths?.some(p => currentPath.startsWith(p))) {
        return item.id;
      }
    }
    
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1 px-4 py-2 relative min-w-[60px]"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1 : 1,
                }}
                className={cn(
                  "p-1.5 rounded-xl transition-colors duration-200",
                  isActive ? "bg-gray-900" : "bg-transparent"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isActive ? "text-white" : "text-gray-400"
                )} />
              </motion.div>
              
              <span className={cn(
                "text-[10px] font-medium transition-colors duration-200",
                isActive ? "text-gray-900" : "text-gray-400"
              )}>
                {item.label}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="health-nav-indicator"
                  className="absolute -bottom-0 w-1 h-1 bg-gray-900 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
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
}

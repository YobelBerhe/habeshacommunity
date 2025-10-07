import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Heart, Eye, User } from 'lucide-react';

interface Activity {
  id: string;
  type: 'message' | 'favorite' | 'view' | 'profile_update';
  user_name: string;
  description: string;
  timestamp: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('activity-feed')
      .on('broadcast', { event: 'activity' }, (payload) => {
        const activity: Activity = payload.payload;
        setActivities(prev => [activity, ...prev].slice(0, 20));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const icons = {
    message: MessageSquare,
    favorite: Heart,
    view: Eye,
    profile_update: User,
  };

  const colors = {
    message: 'text-blue-500',
    favorite: 'text-red-500',
    view: 'text-purple-500',
    profile_update: 'text-green-500',
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground px-2">
        Recent Activity
      </h3>
      
      <AnimatePresence mode="popLayout">
        {activities.map((activity) => {
          const Icon = icons[activity.type];
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              layout
              className="flex items-start gap-3 p-3 hover:bg-accent rounded-lg transition-colors"
            >
              <div className={`p-2 rounded-full bg-muted ${colors[activity.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user_name}</span>{' '}
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {activities.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No recent activity
        </p>
      )}
    </div>
  );
}

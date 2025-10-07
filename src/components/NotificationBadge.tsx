import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useLiveNotifications } from '@/hooks/useLiveNotifications';
import { useAuth } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NotificationBadge() {
  const { user } = useAuth();
  const { unreadCount } = useLiveNotifications(user?.id || '');
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => navigate('/notifications')}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="w-5 h-5" />
      
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-destructive text-destructive-foreground text-xs font-bold rounded-full px-1"
          >
            <motion.span
              key={unreadCount}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

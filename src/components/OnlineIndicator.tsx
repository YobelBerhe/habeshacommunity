import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OnlineIndicatorProps {
  isOnline: boolean;
  status?: 'online' | 'away' | 'busy';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function OnlineIndicator({
  isOnline,
  status = 'online',
  size = 'md',
  showLabel = false,
  className = '',
}: OnlineIndicatorProps) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const colors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const labels = {
    online: 'Online',
    away: 'Away',
    busy: 'Busy',
  };

  if (!isOnline) {
    return showLabel ? (
      <span className="text-xs text-muted-foreground">Offline</span>
    ) : null;
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="relative">
        <motion.div
          className={cn(
            'rounded-full',
            sizes[size],
            colors[status]
          )}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full',
            colors[status],
            'opacity-50'
          )}
          animate={{
            scale: [1, 1.5],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium">{labels[status]}</span>
      )}
    </div>
  );
}

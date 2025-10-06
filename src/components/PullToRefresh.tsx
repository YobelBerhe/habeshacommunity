import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export function PullToRefresh({ 
  children, 
  onRefresh, 
  threshold = 80 
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0);
  
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const rotate = useTransform(y, [0, threshold], [0, 360]);
  
  const handleDragEnd = async (_event: any, info: any) => {
    if (info.offset.y > threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    y.set(0);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 z-10"
        style={{ opacity }}
      >
        <motion.div style={{ rotate }}>
          <RefreshCw className="w-6 h-6 text-primary" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0 }}
        style={{ y }}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>

      {/* Loading overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-20">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
    </div>
  );
}

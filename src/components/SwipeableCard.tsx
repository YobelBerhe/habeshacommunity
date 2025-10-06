import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: 'favorite' | 'delete';
  rightAction?: 'favorite' | 'delete';
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = 'delete',
  rightAction = 'favorite',
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const leftColor = useTransform(x, [-150, -50, 0], ['#ef4444', '#ef4444', 'transparent']);
  const rightColor = useTransform(x, [0, 50, 150], ['transparent', '#22c55e', '#22c55e']);
  
  const handleDragEnd = (_event: any, info: PanInfo) => {
    setIsDragging(false);
    
    if (info.offset.x < -100 && onSwipeLeft) {
      onSwipeLeft();
    } else if (info.offset.x > 100 && onSwipeRight) {
      onSwipeRight();
    }
    
    // Reset position
    x.set(0);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Background actions */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-between px-6"
        style={{ backgroundColor: leftColor }}
      >
        <Trash2 className="w-6 h-6 text-white" />
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-between px-6"
        style={{ backgroundColor: rightColor }}
      >
        <div />
        <Heart className="w-6 h-6 text-white" />
      </motion.div>

      {/* Draggable card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.2}
        style={{ x }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

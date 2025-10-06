import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cardHoverVariants, scaleIn } from '@/lib/animations';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

export function AnimatedCard({ children, className = '', onClick, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={scaleIn}
      transition={{ delay }}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

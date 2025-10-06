import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { containerVariants, itemVariants } from '@/lib/animations';

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedList({ children, className = '' }: AnimatedListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({ children, className = '' }: AnimatedListProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

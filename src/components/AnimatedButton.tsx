import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ReactNode } from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

export function AnimatedButton({ 
  children, 
  isLoading, 
  disabled,
  variant,
  size,
  ...props 
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
    >
      <Button
        {...props}
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        className="relative"
      >
        <motion.span
          animate={{
            opacity: isLoading ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <LoadingSpinner size="sm" variant="dots" />
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
}

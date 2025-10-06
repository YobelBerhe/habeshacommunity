import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ReactNode } from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  ariaLabel?: string;
}

export function AnimatedButton({ 
  children, 
  isLoading, 
  disabled,
  variant,
  size,
  ariaLabel,
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
        aria-label={ariaLabel}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        disabled={disabled || isLoading}
        className="relative"
      >
        <motion.span
          aria-hidden={isLoading}
          animate={{
            opacity: isLoading ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        
        {isLoading && (
          <>
            <span className="sr-only">Loading</span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <LoadingSpinner size="sm" variant="dots" />
            </motion.div>
          </>
        )}
      </Button>
    </motion.div>
  );
}

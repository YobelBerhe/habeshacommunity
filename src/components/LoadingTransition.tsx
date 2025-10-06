import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface LoadingTransitionProps {
  isLoading: boolean;
  children: ReactNode;
  loader?: ReactNode;
}

/**
 * Smooth transition between loading and content states
 * Prevents jarring layout shifts
 */
export function LoadingTransition({ 
  isLoading, 
  children, 
  loader 
}: LoadingTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loader || (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

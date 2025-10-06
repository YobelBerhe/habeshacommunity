import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const shimmer = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

// Page loader with spinner
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// Card skeleton loader with shimmer effect
export function CardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <style>{shimmer}</style>
      <div 
        className="h-48 bg-gradient-to-r from-muted via-muted/50 to-muted"
        style={{
          backgroundSize: '1000px 100%',
          animation: 'shimmer 2s infinite linear'
        }}
      />
      <CardHeader className="space-y-2">
        <div 
          className="h-5 w-3/4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded"
          style={{
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite linear'
          }}
        />
        <div 
          className="h-4 w-1/2 bg-gradient-to-r from-muted via-muted/50 to-muted rounded"
          style={{
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite linear'
          }}
        />
      </CardHeader>
      <CardContent className="space-y-2">
        <div 
          className="h-3 w-full bg-gradient-to-r from-muted via-muted/50 to-muted rounded"
          style={{
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite linear'
          }}
        />
        <div 
          className="h-3 w-5/6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded"
          style={{
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite linear'
          }}
        />
      </CardContent>
      <CardFooter className="gap-2">
        <div 
          className="h-9 flex-1 bg-gradient-to-r from-muted via-muted/50 to-muted rounded"
          style={{
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite linear'
          }}
        />
        <div 
          className="h-9 flex-1 bg-gradient-to-r from-muted via-muted/50 to-muted rounded"
          style={{
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite linear'
          }}
        />
      </CardFooter>
    </Card>
  );
}

// List item skeleton with shimmer
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <style>{shimmer}</style>
      <div 
        className="w-12 h-12 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full"
        style={{
          backgroundSize: '1000px 100%',
          animation: 'shimmer 2s infinite linear'
        }}
      />
      <div className="flex-1 space-y-2">
        <div 
          className="h-4 w-1/3 bg-gradient-to-r from-muted via-muted/50 to-muted rounded"
          style={{
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite linear'
          }}
        />
        <div 
          className="h-3 w-2/3 bg-gradient-to-r from-muted via-muted/50 to-muted rounded"
          style={{
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite linear'
          }}
        />
      </div>
      <div 
        className="w-20 h-8 bg-gradient-to-r from-muted via-muted/50 to-muted rounded"
        style={{
          backgroundSize: '1000px 100%',
          animation: 'shimmer 2s infinite linear'
        }}
      />
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 border-b">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 bg-muted rounded animate-pulse" />
      ))}
    </div>
  );
}

// Grid skeleton loader
export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// List skeleton loader
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton to content smooth transition
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

export function SkeletonToContent({ 
  isLoading, 
  skeleton, 
  children 
}: { 
  isLoading: boolean; 
  skeleton: ReactNode; 
  children: ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { ReactNode } from 'react';

interface MobileOptimizedProps {
  children: ReactNode;
  className?: string;
}

export const MobileOptimized = ({ children, className = '' }: MobileOptimizedProps) => {
  return (
    <div className={`w-full max-w-full overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
};

// Usage example:
// Wrap any page content with this to ensure no horizontal scroll
// <MobileOptimized>
//   <YourPageContent />
// </MobileOptimized>

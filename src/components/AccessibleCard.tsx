import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AccessibleCardProps {
  children: ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Accessible card component with proper ARIA attributes
 * Handles interactive and non-interactive states
 */
export function AccessibleCard({ 
  children, 
  title, 
  description,
  onClick,
  className = '' 
}: AccessibleCardProps) {
  const isInteractive = !!onClick;

  return (
    <Card
      role={isInteractive ? 'button' : 'article'}
      aria-label={title}
      aria-description={description}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isInteractive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
      className={className}
    >
      {children}
    </Card>
  );
}

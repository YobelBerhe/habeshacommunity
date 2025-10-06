import { Badge } from '@/components/ui/badge';
import { ReactNode } from 'react';

interface AccessibleBadgeProps {
  children: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  icon?: ReactNode;
}

/**
 * Accessible badge component with proper ARIA labeling
 */
export function AccessibleBadge({ children, variant, icon }: AccessibleBadgeProps) {
  return (
    <Badge 
      variant={variant}
      className="inline-flex items-center gap-1.5 font-semibold"
      role="status"
      aria-label={children}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </Badge>
  );
}

import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VerifiedBadgeProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VerifiedBadge = ({ 
  isVerified, 
  size = 'md', 
  showLabel = true 
}: VerifiedBadgeProps) => {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <Badge className={`bg-green-600 hover:bg-green-700 text-white border-none ${sizeClasses[size]}`}>
      <CheckCircle className={`${iconSizes[size]} ${showLabel ? 'mr-1' : ''}`} />
      {showLabel && 'Verified'}
    </Badge>
  );
};

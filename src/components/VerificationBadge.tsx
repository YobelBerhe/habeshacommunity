import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VerificationBadgeProps {
  isVerified: boolean;
  status?: 'pending' | 'approved' | 'rejected' | null;
  showText?: boolean;
  className?: string;
}

export function VerificationBadge({ isVerified, status, showText = false, className }: VerificationBadgeProps) {
  if (isVerified) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="default" className={`bg-green-600 hover:bg-green-700 ${className}`}>
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {showText && 'Verified'}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This mentor has been verified by our team</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (status === 'pending') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className={className}>
              <Clock className="w-3 h-3 mr-1" />
              {showText && 'Pending Review'}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Verification in progress</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (status === 'rejected') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="destructive" className={className}>
              <XCircle className="w-3 h-3 mr-1" />
              {showText && 'Not Verified'}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Verification was not approved</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
}

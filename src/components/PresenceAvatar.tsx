import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { OnlineIndicator } from './OnlineIndicator';
import { cn } from '@/lib/utils';

interface PresenceAvatarProps {
  src?: string;
  fallback: string;
  isOnline?: boolean;
  status?: 'online' | 'away' | 'busy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PresenceAvatar({
  src,
  fallback,
  isOnline = false,
  status = 'online',
  size = 'md',
  className = '',
}: PresenceAvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('relative', className)}>
      <Avatar className={sizes[size]}>
        <AvatarImage src={src} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      
      {isOnline && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-0.5">
          <OnlineIndicator isOnline={isOnline} status={status} size="sm" />
        </div>
      )}
    </div>
  );
}

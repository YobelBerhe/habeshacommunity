import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ThemedCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <Card className={cn('themed-card', className)} {...props} />;
}

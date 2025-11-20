import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ThemedButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return <Button className={cn('themed-button', className)} {...props} />;
}

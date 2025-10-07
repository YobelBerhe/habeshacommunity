import { Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

interface InstallButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}

export function InstallButton({ 
  variant = 'default', 
  size = 'default',
  showLabel = true 
}: InstallButtonProps) {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();

  if (isInstalled) {
    return showLabel ? (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span>App installed</span>
      </div>
    ) : null;
  }

  if (!isInstallable) return null;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={promptInstall}
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      {showLabel && 'Install App'}
    </Button>
  );
}

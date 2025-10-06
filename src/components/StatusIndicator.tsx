import { Check, AlertCircle, Info, X } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

/**
 * Accessible status indicator that doesn't rely on color alone
 * Uses icons + text + semantic borders for all status types
 */
export function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const config = {
    success: {
      icon: Check,
      className: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200',
      label: 'Success',
    },
    error: {
      icon: X,
      className: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
      label: 'Error',
    },
    warning: {
      icon: AlertCircle,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200',
      label: 'Warning',
    },
    info: {
      icon: Info,
      className: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200',
      label: 'Information',
    },
  };

  const Icon = config[status].icon;

  return (
    <div 
      className={`flex items-start gap-3 p-4 rounded-lg border-2 ${config[status].className}`}
      role="alert"
      aria-label={`${config[status].label}: ${message}`}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

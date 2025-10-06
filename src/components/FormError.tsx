import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message: string;
  id?: string;
}

/**
 * Accessible form error component with icon and proper ARIA
 * Meets WCAG requirements for error identification
 */
export function FormError({ message, id }: FormErrorProps) {
  return (
    <div 
      id={id}
      role="alert"
      className="flex items-start gap-2 mt-2 p-3 rounded-md bg-destructive/10 border-2 border-destructive"
    >
      <AlertCircle 
        className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" 
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-destructive">
        {message}
      </p>
    </div>
  );
}

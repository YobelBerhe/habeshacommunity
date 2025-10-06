import { ComponentType } from 'react';

interface AccessibleIconProps {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean; 'aria-label'?: string }>;
  label?: string;
  decorative?: boolean;
  className?: string;
}

/**
 * Accessible icon wrapper that handles ARIA attributes properly
 * Decorative icons are hidden from screen readers
 * Functional icons get proper labels
 */
export function AccessibleIcon({ 
  icon: Icon, 
  label, 
  decorative = false,
  className = '' 
}: AccessibleIconProps) {
  return (
    <>
      <Icon 
        className={className}
        aria-hidden={decorative || !label}
        aria-label={!decorative && label ? label : undefined}
      />
      {!decorative && label && (
        <span className="sr-only">{label}</span>
      )}
    </>
  );
}

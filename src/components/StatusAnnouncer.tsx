import { useEffect } from 'react';
import { announceToScreenReader } from '@/utils/semanticHelpers';

interface StatusAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

/**
 * Component that announces status changes to screen readers
 * Use after successful actions like saving, deleting, etc.
 */
export function StatusAnnouncer({ message, priority = 'polite' }: StatusAnnouncerProps) {
  useEffect(() => {
    if (message) {
      announceToScreenReader(message, priority);
    }
  }, [message, priority]);

  return null;
}

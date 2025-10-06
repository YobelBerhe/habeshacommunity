import { useRef } from 'react';

/**
 * Hook for managing ARIA live regions for screen reader announcements
 */
export function useLiveRegion() {
  const regionRef = useRef<HTMLDivElement>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (regionRef.current) {
      regionRef.current.setAttribute('aria-live', priority);
      regionRef.current.textContent = message;
    }
  };

  return { regionRef, announce };
}

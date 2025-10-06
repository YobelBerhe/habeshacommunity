import { useEffect, useRef } from 'react';
import { trapFocus, focusFirstElement } from '@/utils/focusManagement';

/**
 * Hook to trap focus within a container element
 * Useful for modals, dialogs, and other overlays
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(isActive: boolean = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const cleanup = trapFocus(element);

    // Focus first focusable element
    focusFirstElement(element);

    return cleanup;
  }, [isActive]);

  return ref;
}

import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  enabled?: boolean;
}

/**
 * Hook to register keyboard shortcuts
 * @param key - The key to listen for (case-insensitive)
 * @param callback - Function to call when shortcut is triggered
 * @param options - Modifier keys and enabled state
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: KeyboardShortcutOptions = {}
) {
  const { ctrl, shift, alt, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (!ctrl || e.ctrlKey || e.metaKey) &&
        (!shift || e.shiftKey) &&
        (!alt || e.altKey)
      ) {
        e.preventDefault();
        callback();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, ctrl, shift, alt, enabled]);
}

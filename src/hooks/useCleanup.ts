import { useEffect, useRef } from 'react';

export function useCleanup() {
  const cleanupFns = useRef<(() => void)[]>([]);

  const addCleanup = (fn: () => void) => {
    cleanupFns.current.push(fn);
  };

  useEffect(() => {
    return () => {
      cleanupFns.current.forEach(fn => {
        try {
          fn();
        } catch (error) {
          console.error('[Cleanup] Error:', error);
        }
      });
    };
  }, []);

  return { addCleanup };
}

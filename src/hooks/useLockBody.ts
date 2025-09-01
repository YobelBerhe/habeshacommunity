import { useEffect } from 'react';

export function useLockBody(lock: boolean) {
  useEffect(() => {
    const el = document.documentElement;
    if (lock) {
      el.classList.add('overflow-hidden', 'touch-none');
    } else {
      el.classList.remove('overflow-hidden', 'touch-none');
    }
    return () => el.classList.remove('overflow-hidden', 'touch-none');
  }, [lock]);
}
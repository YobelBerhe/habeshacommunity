import { useEffect, useState, useCallback } from 'react';

/**
 * Hook for roving tab index pattern (keyboard navigation in lists)
 * Allows arrow key navigation through a list of items
 */
export function useRovingTabIndex(itemCount: number, enabled: boolean = true) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % itemCount);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + itemCount) % itemCount);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(itemCount - 1);
    }
  }, [itemCount, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  return {
    activeIndex,
    setActiveIndex,
    getItemProps: (index: number) => ({
      tabIndex: index === activeIndex ? 0 : -1,
      'data-active': index === activeIndex,
      onFocus: () => setActiveIndex(index),
    }),
  };
}

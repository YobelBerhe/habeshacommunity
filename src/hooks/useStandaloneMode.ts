import { useState, useEffect } from 'react';

export function useStandaloneMode() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [displayMode, setDisplayMode] = useState<'browser' | 'standalone' | 'fullscreen' | 'minimal-ui'>('browser');

  useEffect(() => {
    // Check display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
      setDisplayMode('standalone');
    } else if (window.matchMedia('(display-mode: fullscreen)').matches) {
      setIsStandalone(true);
      setDisplayMode('fullscreen');
    } else if (window.matchMedia('(display-mode: minimal-ui)').matches) {
      setIsStandalone(true);
      setDisplayMode('minimal-ui');
    }

    // iOS Safari check
    if ((window.navigator as any).standalone) {
      setIsStandalone(true);
      setDisplayMode('standalone');
    }

    console.log('[PWA] Display mode:', displayMode, 'Standalone:', isStandalone);
  }, []);

  return {
    isStandalone,
    displayMode,
    isBrowser: !isStandalone,
  };
}

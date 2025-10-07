import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You\'re back online!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You\'re offline', {
        description: 'Some features may not be available',
        duration: Infinity,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      setRegistration(reg);
      console.log('[SW] Registered:', reg);

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
              
              toast.info('Update available!', {
                description: 'A new version is ready',
                action: {
                  label: 'Update',
                  onClick: () => updateServiceWorker(newWorker),
                },
                duration: Infinity,
              });
            }
          });
        }
      });

      // Check for updates on load
      reg.update();
    } catch (error) {
      console.error('[SW] Registration failed:', error);
    }
  };

  const updateServiceWorker = (worker: ServiceWorker) => {
    worker.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  };

  return {
    registration,
    updateAvailable,
    isOnline,
  };
}

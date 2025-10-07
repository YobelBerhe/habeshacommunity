import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const { isOnline } = useServiceWorker();

  useEffect(() => {
    if (!isOnline) {
      setIsConnected(false);
      setShowStatus(true);
    } else if (!isConnected && isOnline) {
      setIsConnected(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    }
  }, [isOnline, isConnected]);

  useEffect(() => {
    const channel = supabase.channel('connection-status');

    channel
      .on('system', {}, (payload) => {
        if (payload.status === 'SUBSCRIBED') {
          setIsConnected(true);
          setShowStatus(false);
        }
      })
      .subscribe();

    // Monitor network status
    const handleOnline = () => {
      setIsConnected(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsConnected(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      channel.unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg ${
            isConnected
              ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isConnected ? 'Back online' : 'You\'re offline - Cached content available'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

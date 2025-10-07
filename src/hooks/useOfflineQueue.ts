import { useState, useEffect } from 'react';
import { offlineQueue } from '@/utils/offlineQueue';
import { toast } from 'sonner';

export function useOfflineQueue() {
  const [queueLength, setQueueLength] = useState(offlineQueue.getQueueLength());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueueLength(offlineQueue.getQueueLength());
    }, 1000);

    const handleOnline = async () => {
      if (offlineQueue.getQueueLength() > 0) {
        setIsSyncing(true);
        
        toast.loading('Syncing queued actions...', { id: 'sync' });
        
        const results = await offlineQueue.processQueue();
        
        if (results) {
          toast.success(
            `Synced ${results.success} action${results.success !== 1 ? 's' : ''}`,
            { id: 'sync' }
          );
          
          if (results.failed > 0) {
            toast.error(`${results.failed} action${results.failed !== 1 ? 's' : ''} failed`);
          }
        }
        
        setIsSyncing(false);
        setQueueLength(offlineQueue.getQueueLength());
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const queueAction = (
    type: 'favorite' | 'message' | 'listing' | 'booking',
    action: () => Promise<any>,
    data: any
  ) => {
    return offlineQueue.add({ type, action, data });
  };

  const clearQueue = () => {
    offlineQueue.clear();
    setQueueLength(0);
    toast.success('Queue cleared');
  };

  return {
    queueLength,
    isSyncing,
    queueAction,
    clearQueue,
  };
}

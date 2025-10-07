import { motion, AnimatePresence } from 'framer-motion';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export function SyncStatus() {
  const { queueLength, isSyncing } = useOfflineQueue();
  const isOnline = navigator.onLine;

  if (!isOnline && queueLength === 0) return null;

  return (
    <AnimatePresence>
      {(queueLength > 0 || isSyncing) && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-20 right-4 z-40 bg-card border shadow-lg rounded-full px-4 py-2"
        >
          <div className="flex items-center gap-2 text-sm">
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                <span className="font-medium">Syncing...</span>
              </>
            ) : isOnline ? (
              <>
                <Cloud className="w-4 h-4 text-green-500" />
                <span className="font-medium">{queueLength} pending</span>
              </>
            ) : (
              <>
                <CloudOff className="w-4 h-4 text-orange-500" />
                <span className="font-medium">{queueLength} queued</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

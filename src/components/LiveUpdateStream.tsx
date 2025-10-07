import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Update {
  id: string;
  type: 'new_listing' | 'price_drop' | 'saved_search';
  title: string;
  message: string;
  link?: string;
  timestamp: number;
}

export function LiveUpdateStream() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useRealtimeSubscription({
    table: 'listings',
    event: 'INSERT',
    onInsert: (payload) => {
      const listing = payload.new;
      
      const update: Update = {
        id: `new-${listing.id}`,
        type: 'new_listing',
        title: 'New listing posted',
        message: listing.title,
        link: `/l/${listing.id}`,
        timestamp: Date.now(),
      };

      setUpdates(prev => [update, ...prev].slice(0, 5));
      
      // Auto-dismiss after 10 seconds
      setTimeout(() => {
        setDismissed(prev => new Set(prev).add(update.id));
      }, 10000);
    },
  });

  const visibleUpdates = updates.filter(u => !dismissed.has(u.id));

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {visibleUpdates.map((update) => (
          <motion.div
            key={update.id}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="bg-card border shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-shadow pointer-events-auto"
            onClick={() => {
              if (update.link) {
                navigate(update.link);
              }
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {update.type.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="font-semibold text-sm mb-1">{update.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {update.message}
                </p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDismissed(prev => new Set(prev).add(update.id));
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss update"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

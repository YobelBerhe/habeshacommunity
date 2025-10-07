import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { draftStorage } from '@/utils/draftStorage';
import { formatDistanceToNow } from 'date-fns';

interface DraftRecoveryProps {
  type: 'message' | 'listing' | 'review';
  onRecover: (content: any) => void;
  onDismiss: () => void;
}

export function DraftRecovery({ type, onRecover, onDismiss }: DraftRecoveryProps) {
  const [drafts, setDrafts] = useState(draftStorage.getDraftsByType(type));

  if (drafts.length === 0) return null;

  const handleRecover = (draft: any) => {
    onRecover(draft.content);
    draftStorage.deleteDraft(draft.id);
    setDrafts(draftStorage.getDraftsByType(type));
  };

  const handleDismiss = (draftId: string) => {
    draftStorage.deleteDraft(draftId);
    setDrafts(draftStorage.getDraftsByType(type));
    if (drafts.length === 1) {
      onDismiss();
    }
  };

  return (
    <AnimatePresence>
      {drafts.map((draft) => (
        <motion.div
          key={draft.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
                Draft Found
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Saved {formatDistanceToNow(draft.timestamp, { addSuffix: true })}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleRecover(draft)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Recover
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDismiss(draft.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

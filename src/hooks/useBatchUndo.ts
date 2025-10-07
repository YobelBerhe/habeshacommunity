import { useState, useCallback } from 'react';
import { showUndoToast } from '@/components/UndoToast';

interface BatchAction {
  id: string;
  execute: () => Promise<void>;
  undo: () => Promise<void>;
}

export function useBatchUndo() {
  const [pendingActions, setPendingActions] = useState<BatchAction[]>([]);

  const addToBatch = useCallback((action: BatchAction) => {
    setPendingActions(prev => [...prev, action]);
  }, []);

  const executeBatch = useCallback(async (message: string) => {
    const actionsToExecute = [...pendingActions];
    setPendingActions([]);

    try {
      // Execute all actions
      await Promise.all(actionsToExecute.map(a => a.execute()));

      showUndoToast({
        message,
        onUndo: async () => {
          // Undo all in reverse order
          for (let i = actionsToExecute.length - 1; i >= 0; i--) {
            await actionsToExecute[i].undo();
          }
        },
      });
    } catch (error) {
      // Rollback on error
      for (let i = actionsToExecute.length - 1; i >= 0; i--) {
        try {
          await actionsToExecute[i].undo();
        } catch (undoError) {
          console.error('Failed to rollback:', undoError);
        }
      }
      throw error;
    }
  }, [pendingActions]);

  const clearBatch = useCallback(() => {
    setPendingActions([]);
  }, []);

  return {
    addToBatch,
    executeBatch,
    clearBatch,
    batchSize: pendingActions.length,
  };
}

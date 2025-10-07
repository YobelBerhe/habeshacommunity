import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UndoableAction<T> {
  action: () => Promise<void>;
  undo: () => Promise<void>;
  message: string;
  data?: T;
}

export function useUndoableAction<T>() {
  const [history, setHistory] = useState<UndoableAction<T>[]>([]);
  const [redoStack, setRedoStack] = useState<UndoableAction<T>[]>([]);

  const executeAction = useCallback(async (
    action: UndoableAction<T>,
    showToast: boolean = true
  ) => {
    try {
      await action.action();
      setHistory(prev => [...prev, action]);
      setRedoStack([]); // Clear redo stack on new action

      if (showToast) {
        toast.success(action.message, {
          action: {
            label: 'Undo',
            onClick: async () => {
              await undoLastAction();
            },
          },
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error('Action failed');
      throw error;
    }
  }, []);

  const undoLastAction = useCallback(async () => {
    const lastAction = history[history.length - 1];
    if (!lastAction) return;

    try {
      await lastAction.undo();
      setHistory(prev => prev.slice(0, -1));
      setRedoStack(prev => [...prev, lastAction]);
      toast.success('Undone');
    } catch (error) {
      toast.error('Failed to undo');
      throw error;
    }
  }, [history]);

  const redoLastAction = useCallback(async () => {
    const lastUndo = redoStack[redoStack.length - 1];
    if (!lastUndo) return;

    try {
      await lastUndo.action();
      setRedoStack(prev => prev.slice(0, -1));
      setHistory(prev => [...prev, lastUndo]);
      toast.success('Redone');
    } catch (error) {
      toast.error('Failed to redo');
      throw error;
    }
  }, [redoStack]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setRedoStack([]);
  }, []);

  return {
    executeAction,
    undoLastAction,
    redoLastAction,
    canUndo: history.length > 0,
    canRedo: redoStack.length > 0,
    clearHistory,
  };
}

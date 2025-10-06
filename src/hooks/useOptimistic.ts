import { useState, useCallback } from 'react';

interface OptimisticOptions<T> {
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  rollbackDelay?: number;
}

/**
 * Generic hook for optimistic UI updates
 * Updates UI immediately, then confirms with server
 * Rolls back on error
 */
export function useOptimistic<T>(
  initialState: T,
  options: OptimisticOptions<T> = {}
) {
  const [state, setState] = useState(initialState);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const updateOptimistically = useCallback(
    async (
      optimisticValue: T,
      asyncAction: () => Promise<T>
    ) => {
      const previousState = state;
      
      // Apply optimistic update immediately
      setState(optimisticValue);
      setIsOptimistic(true);

      try {
        // Perform actual async operation
        const result = await asyncAction();
        
        // Update with real result
        setState(result);
        setIsOptimistic(false);
        options.onSuccess?.(result);
      } catch (error) {
        // Rollback on error
        setState(previousState);
        setIsOptimistic(false);
        options.onError?.(error as Error);
      }
    },
    [state, options]
  );

  return {
    state,
    setState,
    updateOptimistically,
    isOptimistic,
  };
}

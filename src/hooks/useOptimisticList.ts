import { useState, useCallback } from 'react';

/**
 * Optimistic list operations hook
 * Handles add/remove/update with rollback on error
 */
export function useOptimisticList<T extends { id: string }>(initialItems: T[]) {
  const [items, setItems] = useState(initialItems);

  const addItem = useCallback(async (
    tempItem: T,
    asyncAdd: () => Promise<T>
  ) => {
    // Add optimistically
    setItems(prev => [...prev, tempItem]);

    try {
      const realItem = await asyncAdd();
      // Replace temp with real
      setItems(prev => 
        prev.map(item => item.id === tempItem.id ? realItem : item)
      );
      return realItem;
    } catch (error) {
      // Remove on error
      setItems(prev => prev.filter(item => item.id !== tempItem.id));
      throw error;
    }
  }, []);

  const removeItem = useCallback(async (
    itemId: string,
    asyncRemove: () => Promise<void>
  ) => {
    const previousItems = items;
    
    // Remove optimistically
    setItems(prev => prev.filter(item => item.id !== itemId));

    try {
      await asyncRemove();
    } catch (error) {
      // Restore on error
      setItems(previousItems);
      throw error;
    }
  }, [items]);

  const updateItem = useCallback(async (
    itemId: string,
    updates: Partial<T>,
    asyncUpdate: () => Promise<T>
  ) => {
    const previousItems = items;
    
    // Update optimistically
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    );

    try {
      const updatedItem = await asyncUpdate();
      setItems(prev => 
        prev.map(item => item.id === itemId ? updatedItem : item)
      );
      return updatedItem;
    } catch (error) {
      // Rollback on error
      setItems(previousItems);
      throw error;
    }
  }, [items]);

  return {
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
  };
}

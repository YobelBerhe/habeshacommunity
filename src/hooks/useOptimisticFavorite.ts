import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useOfflineQueue } from './useOfflineQueue';

/**
 * Optimistic favorite toggle hook with offline queue support
 * Updates UI immediately, queues action if offline
 */
export function useOptimisticFavorite(
  listingId: string, 
  userId: string | undefined, 
  initialIsFavorited: boolean
) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, setIsPending] = useState(false);
  const { queueAction } = useOfflineQueue();

  // Don't attempt operations if no userId
  if (!userId) {
    return { 
      isFavorited: false, 
      toggleFavorite: async () => {
        toast.error('Please log in to save favorites');
      }, 
      isPending: false 
    };
  }

  const toggleFavorite = async () => {
    const previousState = isFavorited;
    const willFavorite = !isFavorited;
    
    // Optimistic update - instant feedback
    setIsFavorited(willFavorite);
    setIsPending(true);

    const performAction = async () => {
      if (willFavorite) {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, listing_id: listingId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', listingId);
        if (error) throw error;
      }
    };

    // Check if online
    if (!navigator.onLine) {
      queueAction('favorite', performAction, { listingId, userId, willFavorite });
      toast.info('Queued for when you\'re back online', {
        description: willFavorite ? 'Will add to favorites' : 'Will remove from favorites',
      });
      setIsPending(false);
      return;
    }

    // Try immediately if online
    try {
      await performAction();
      toast.success(willFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      // Revert on error
      setIsFavorited(previousState);
      toast.error('Failed to update favorites');
      console.error('Favorite error:', error);
    } finally {
      setIsPending(false);
    }
  };

  return { isFavorited, toggleFavorite, isPending };
}

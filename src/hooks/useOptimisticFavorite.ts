import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Optimistic favorite toggle hook
 * Updates UI immediately, rolls back on error
 */
export function useOptimisticFavorite(
  listingId: string, 
  userId: string, 
  initialIsFavorited: boolean
) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, setIsPending] = useState(false);

  const toggleFavorite = async () => {
    const previousState = isFavorited;
    
    // Optimistic update - instant feedback
    setIsFavorited(!isFavorited);
    setIsPending(true);

    try {
      if (!isFavorited) {
        // Add favorite
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, listing_id: listingId });
        
        if (error) throw error;
        toast.success('Added to favorites');
      } else {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', listingId);
        
        if (error) throw error;
        toast.success('Removed from favorites');
      }
    } catch (error) {
      // Rollback on error
      setIsFavorited(previousState);
      toast.error('Failed to update favorite');
      console.error('Favorite error:', error);
    } finally {
      setIsPending(false);
    }
  };

  return { isFavorited, toggleFavorite, isPending };
}

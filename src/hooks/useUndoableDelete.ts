import { useUndoableAction } from './useUndoableAction';
import { supabase } from '@/integrations/supabase/client';

export function useUndoableDelete() {
  const { executeAction } = useUndoableAction();

  const deleteListing = async (listingId: string, listing: any) => {
    await executeAction({
      action: async () => {
        const { error } = await supabase
          .from('listings')
          .delete()
          .eq('id', listingId);
        
        if (error) throw error;
      },
      undo: async () => {
        const { error } = await supabase
          .from('listings')
          .insert(listing);
        
        if (error) throw error;
      },
      message: 'Listing deleted',
      data: listing,
    });
  };

  const deleteFavorite = async (userId: string, listingId: string) => {
    await executeAction({
      action: async () => {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', listingId);
        
        if (error) throw error;
      },
      undo: async () => {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, listing_id: listingId });
        
        if (error) throw error;
      },
      message: 'Removed from favorites',
    });
  };

  return { deleteListing, deleteFavorite };
}

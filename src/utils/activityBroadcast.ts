import { supabase } from '@/integrations/supabase/client';

export async function broadcastActivity(
  type: 'message' | 'favorite' | 'view' | 'profile_update',
  userId: string,
  userName: string,
  description: string
) {
  const channel = supabase.channel('activity-feed');
  
  await channel.send({
    type: 'broadcast',
    event: 'activity',
    payload: {
      id: `${type}-${Date.now()}`,
      type,
      user_name: userName,
      description,
      timestamp: new Date().toISOString(),
    },
  });
}

// Helper functions for common activities
export const activity = {
  viewedListing: (userName: string, listingTitle: string) =>
    broadcastActivity('view', '', userName, `viewed "${listingTitle}"`),
  
  favorited: (userName: string, listingTitle: string) =>
    broadcastActivity('favorite', '', userName, `favorited "${listingTitle}"`),
  
  sentMessage: (userName: string, recipientName: string) =>
    broadcastActivity('message', '', userName, `sent a message to ${recipientName}`),
  
  updatedProfile: (userName: string) =>
    broadcastActivity('profile_update', '', userName, `updated their profile`),
};

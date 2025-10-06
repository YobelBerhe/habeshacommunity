import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';

export function useMessageNotifications(onNotification?: (conversationId: string, senderName: string) => void) {
  const { user } = useAuth();

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Register service worker for push notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service worker registration failed:', err);
      });
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('global-message-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload: any) => {
          const newMessage = payload.new;
          
          // Don't notify if user sent the message
          if (newMessage.sender_id === user.id) return;

          // Get sender's info
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .maybeSingle();

          // Check if this message is in user's conversations
          const { data: conversation } = await supabase
            .from('conversations')
            .select('*')
            .eq('id', newMessage.conversation_id)
            .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
            .maybeSingle();

          if (!conversation) return;

          const senderName = senderProfile?.display_name || 'Someone';
          const messagePreview = newMessage.content.substring(0, 50);
          const currentUserId = user.id;

          // Create a notification in the database
          await supabase.functions.invoke('create-notification', {
            body: {
              userId: currentUserId,
              type: 'message',
              title: `New message from ${senderName}`,
              body: messagePreview,
              link: '/inbox',
              senderId: newMessage.sender_id,
              conversationId: newMessage.conversation_id
            }
          });

          // Call optional callback
          if (onNotification) {
            onNotification(newMessage.conversation_id, senderName);
          }

          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(`New message from ${senderName}`, {
              body: messagePreview,
              icon: senderProfile?.avatar_url || '/favicon.ico',
              badge: '/favicon.ico',
              tag: `message-${newMessage.id}`,
              requireInteraction: false,
            });

            notification.onclick = () => {
              window.focus();
              window.location.href = `/inbox`;
              notification.close();
            };
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, onNotification]);
}

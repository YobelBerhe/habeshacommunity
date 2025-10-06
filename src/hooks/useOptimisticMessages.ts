import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  isPending?: boolean;
}

/**
 * Optimistic message sending hook
 * Shows message immediately while sending
 * Removes on error
 */
export function useOptimisticMessages(conversationId: string, userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      content,
      sender_id: userId,
      created_at: new Date().toISOString(),
      isPending: true,
    };

    // Add optimistic message immediately
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Replace temp message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId 
            ? { ...data, isPending: false }
            : msg
        )
      );
    } catch (error) {
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      throw error;
    }
  }, [conversationId, userId]);

  return { messages, setMessages, sendMessage };
}

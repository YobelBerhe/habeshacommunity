import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Send, Loader2, Plus, ChevronLeft, Phone, Video, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/auth';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
}

interface ChatWindowProps {
  conversationId: string;
  participantName: string;
  onBack?: () => void;
}

export function ChatWindow({ conversationId, participantName, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadMessages();
    
    // Set up realtime subscription for new messages
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      // Mark unread messages as read
      if (user) {
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('conversation_id', conversationId)
          .neq('sender_id', user.id)
          .eq('read', false);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    toast.info(`Calling ${participantName}...`, {
      description: 'Voice call feature coming soon!'
    });
  };

  const handleVideoCall = () => {
    toast.info(`Starting video call with ${participantName}...`, {
      description: 'Video call feature coming soon!'
    });
  };

  const handleAttachment = () => {
    toast.info('Attachments feature coming soon!');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageContent = newMessage.trim();
    setSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: user.id,
            content: messageContent,
          } as any,
        ])
        .select('id')
        .single();

      if (error) throw error;
      if (!data?.id) {
        throw new Error('Message insert returned no id');
      }

      setNewMessage('');

      // Send email notification (non-blocking)
      supabase
        .functions
        .invoke('send-message-notification', {
          body: {
            conversationId,
            senderId: user.id,
            messageContent,
          },
        })
        .catch((err) => {
          console.error('Failed to send email notification:', err);
          // Non-blocking
        });
    } catch (error: any) {
      console.error('Error sending message:', error?.message || error, error);
      toast.error(error?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[600px] flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <div className="p-8 flex justify-center items-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      {/* Chat Header with Gradient */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4">
        <div className="flex items-center justify-between text-white">
          {onBack && (
            <button onClick={onBack} className="hover:opacity-80 transition-opacity">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center space-x-2 flex-1 ml-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <p className="font-bold text-sm">{participantName}</p>
              <p className="text-xs text-pink-100">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              type="button"
              onClick={handleCall}
              className="hover:opacity-80 transition-opacity"
              aria-label="Voice call"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button 
              type="button"
              onClick={handleVideoCall}
              className="hover:opacity-80 transition-opacity"
              aria-label="Video call"
            >
              <Video className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-2xl p-3 max-w-[75%] shadow-sm ${
                  message.sender_id === user?.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 rounded-tr-sm'
                    : 'bg-white dark:bg-gray-700 rounded-tl-sm'
                }`}
              >
                <p className={`text-sm ${
                  message.sender_id === user?.id 
                    ? 'text-white' 
                    : 'text-gray-800 dark:text-gray-200'
                }`}>
                  {message.content}
                </p>
                <p className={`text-xs mt-1 ${
                  message.sender_id === user?.id
                    ? 'text-pink-100'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <button 
            type="button"
            onClick={handleAttachment}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Add attachment"
          >
            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

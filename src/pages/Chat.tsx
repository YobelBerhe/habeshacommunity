import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Smile, Image as ImageIcon } from 'lucide-react';
import CitySearchBar from '@/components/CitySearchBar';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { uploadListingImages } from '@/utils/upload';

// Boards, including an "All" view that aggregates every board
const CHAT_BOARDS = [
  { id: 'all', name: 'All Boards', description: 'Everything in one place' },
  { id: 'general', name: 'General', description: 'General discussions' },
  { id: 'housing', name: 'Housing & Tips', description: 'Housing advice and tips' },
  { id: 'jobs', name: 'Jobs & Career', description: 'Job opportunities and career advice' },
  { id: 'services', name: 'Services', description: 'Local services and recommendations' },
  { id: 'events', name: 'Events & Community', description: 'Community events and gatherings' },
];

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  username?: string;
  avatar_url?: string | null;
  city: string;
  board: string;
  created_at: string;
  message_type?: 'text' | 'voice' | 'image';
  media_url?: string | null;
}

// Deterministic user color generator (stable across sessions)
function colorForUser(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360; // 0..359
  // Use semantic lightness/sat values compatible with theme contrast
  return `hsl(${hue} 65% 50%)`;
}

export default function Chat() {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [activeBoard, setActiveBoard] = useState<string>('all');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const { user, openAuth } = useAuth();
  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGlobal = useMemo(() => !selectedCity, [selectedCity]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const handleSend = async (messageType: 'text' | 'image' = 'text', mediaUrl?: string) => {
    console.log('🔵 Send button clicked', { message, messageType, mediaUrl, user: !!user, selectedCity, activeBoard });
    
    if (messageType === 'text' && !message.trim()) {
      console.log('❌ Empty message, returning');
      toast.error('Please type a message');
      return;
    }

    if (!user) {
      console.log('❌ No user, opening auth');
      toast.error('Please sign in to send messages');
      openAuth();
      return;
    }

    if (!selectedCity) {
      console.log('❌ No city selected');
      toast.error('Please select a city to post');
      return;
    }

    console.log('✅ All checks passed, sending message...');
    setLoading(true);
    
    try {
      const insertData: any = {
        content: messageType === 'text' ? message.trim() : 'Photo',
        user_id: user.id,
        city: selectedCity,
        board: activeBoard === 'all' ? 'general' : activeBoard,
        message_type: messageType,
        media_url: mediaUrl || null,
      };

      console.log('📤 Inserting message:', insertData);

      const { data, error } = await supabase
        .from('chat_messages')
        .insert(insertData)
        .select('*');

      console.log('📥 Response:', { data, error });

      if (error) {
        console.error('❌ Database error:', error);
        toast.error(`Database error: ${error.message}`);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('✅ Message sent successfully');
        setMessage('');
        setShowEmoji(false);
        toast.success('Message sent!');
      }
    } catch (e) {
      console.error('💥 Error sending message:', e);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
      console.log('🔵 Send complete, loading:', false);
    }
  };


  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error('Please sign in to send photos');
      openAuth();
      return;
    }

    if (!selectedCity) {
      toast.error('Please select a city to post');
      return;
    }

    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      toast.info('Uploading photo...');
      const urls = await uploadListingImages(Array.from(files), user.id, 'chat-media');
      
      if (urls.length > 0) {
        await handleSend('image', urls[0]);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    }
  };

  // Load messages whenever filters change (supports global and per-city views)
  useEffect(() => {
    const load = async () => {
      try {
        let query = supabase
          .from('chat_messages')
          .select('*');
        if (!isGlobal) query = query.eq('city', selectedCity);
        if (activeBoard !== 'all') query = query.eq('board', activeBoard);
        query = query.order('created_at', { ascending: true });

        const { data: messages, error } = await query;
        if (error) throw error;

        // Fetch profiles separately
        if (messages && messages.length > 0) {
          const userIds = [...new Set(messages.map(m => m.user_id))];
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name, avatar_url')
            .in('id', userIds);

          const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

          const withNames = messages.map((m: any) => ({
            ...m,
            username: profileMap.get(m.user_id)?.display_name || 'Member',
            avatar_url: profileMap.get(m.user_id)?.avatar_url || null,
          }));

          setMessages(withNames);
        } else {
          setMessages([]);
        }
      } catch (e) {
        console.error('Error loading messages:', e);
        setMessages([]);
      }
    };

    load();
  }, [isGlobal, selectedCity, activeBoard]);

  // Realtime inserts
  useEffect(() => {
    const channel = supabase
      .channel('chat_messages_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async (payload) => {
          const msg = payload.new as ChatMessage;

          // Filter on the client according to current view
          if (!msg) return;
          if (!isGlobal && msg.city !== selectedCity) return;
          if (activeBoard !== 'all' && msg.board !== activeBoard) return;

          // Fetch user profile for the new message
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', msg.user_id)
            .single();

          // Check if message already exists to prevent duplicates
          setMessages((prev) => {
            if (prev.some((p) => p.id === msg.id)) return prev;
            
            return [
              ...prev,
              { 
                ...msg, 
                username: profile?.display_name || 'Member',
                avatar_url: profile?.avatar_url || null,
              },
            ];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isGlobal, selectedCity, activeBoard]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const commonEmojis = ['😀','😂','🥲','😍','😎','🤔','🙌','👏','🙏','🔥','🎉','💯','✨','🌍','🏠','💼','🛠️','📣','📍','💬'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-semibold">Chat</h1>
          </div>

          <div className="flex-1 max-w-xs mx-4">
            <CitySearchBar
              value={selectedCity}
              onCitySelect={handleCitySelect}
              placeholder="Choose city..."
              className="w-full"
              disableNavigation={true}
            />
          </div>

          <div className="w-6" />
        </div>
      </header>

      <div className="flex flex-col h-[calc(100vh-73px)]">
        {/* Global notice */}
        {isGlobal && (
          <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/30 border-b">
            Viewing the global feed. Select a city to post messages.
          </div>
        )}

        {/* Board tabs */}
        <div className="border-b bg-muted/30">
          <div className="flex overflow-x-auto">
            {CHAT_BOARDS.map((board) => (
              <button
                key={board.id}
                onClick={() => setActiveBoard(board.id)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeBoard === board.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {board.name}
              </button>
            ))}
          </div>
        </div>

          {/* Chat content */}
          <div className="flex-1 flex flex-col">
            <div ref={listRef} className="flex-1 chat-container p-4 space-y-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {CHAT_BOARDS.find((b) => b.id === activeBoard)?.name}
                    {!isGlobal ? ` • ${selectedCity}` : ''}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {CHAT_BOARDS.find((b) => b.id === activeBoard)?.description}
                  </p>
                  <div className="text-sm text-muted-foreground">Be the first to start the conversation!</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg) => {
                    const color = colorForUser(msg.user_id);
                    return (
                      <div key={msg.id} className="flex items-start gap-2 sm:gap-3 py-1">
                        <div
                          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                          style={{ backgroundColor: color }}
                        >
                          {msg.avatar_url ? (
                            <img
                              src={msg.avatar_url}
                              alt={msg.username || 'User'}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            (msg.username || 'M')[0].toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span
                              className="font-medium text-sm"
                              style={{ color }}
                            >
                              {msg.username || 'Member'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.created_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          {msg.message_type === 'image' && msg.media_url ? (
                            <img 
                              src={msg.media_url} 
                              alt="Shared photo" 
                              className="max-w-[250px] sm:max-w-xs rounded-lg mt-1"
                            />
                          ) : (
                            <p className="text-sm break-words whitespace-pre-wrap mt-0.5">
                              {msg.content}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          {/* Composer */}
          <div className="force-input-light border-t p-4 bg-background">
            <div className="relative flex items-center gap-2">
              {/* Text input area */}
              <div className="flex-1 relative flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowEmoji((v) => !v)}
                  className="p-2 rounded-md hover:bg-muted text-muted-foreground flex-shrink-0"
                  aria-label="Toggle emoji picker"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={isGlobal ? 'Select a city to post' : 'Type your message...'}
                  className="flex-1 px-3 py-2 border rounded-lg bg-white text-black placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading || isGlobal}
                />

                {/* Photo upload button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-md hover:bg-muted text-muted-foreground flex-shrink-0"
                  aria-label="Upload photo"
                  disabled={loading || isGlobal}
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!loading && message.trim() && !isGlobal) {
                      handleSend();
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!loading && message.trim() && !isGlobal) {
                      handleSend();
                    }
                  }}
                  disabled={loading || !message.trim() || isGlobal}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0 touch-manipulation"
                  title={isGlobal ? 'Select a city to send messages' : loading ? 'Sending...' : 'Send message'}
                >
                  <Send className="w-4 h-4" />
                </button>

                {showEmoji && (
                  <div className="absolute bottom-14 left-0 z-20 p-2 rounded-md border bg-popover text-popover-foreground shadow-md w-[280px]">
                    <div className="grid grid-cols-8 gap-1 text-lg">
                      {commonEmojis.map((e) => (
                        <button
                          key={e}
                          type="button"
                          className="hover:bg-muted rounded"
                          onClick={() => setMessage((m) => m + e)}
                          aria-label={`Insert ${e}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
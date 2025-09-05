import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, MessageCircle, Send, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MobileHeader from '@/components/layout/MobileHeader';
import Header from '@/components/Header';
import { getAppState } from '@/utils/storage';

interface DmThread {
  id: string;
  created_at: string;
  last_message?: {
    body: string;
    created_at: string;
    sender_id: string;
  };
  other_user?: {
    display_name: string;
    email: string;
  };
}

interface DmMessage {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export default function Inbox() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<DmThread[]>([]);
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const appState = getAppState();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    fetchThreads();
    
    // Check for auto-start conversations from URL params
    const mentorId = searchParams.get('mentor');
    const matchId = searchParams.get('match');
    const listingId = searchParams.get('listing');
    
    if (mentorId || matchId || listingId) {
      handleAutoStartConversation(mentorId, matchId, listingId);
    }
  }, [user, navigate, searchParams]);

  useEffect(() => {
    if (selectedThread) {
      fetchMessages(selectedThread);
      
      // Set up realtime subscription for new messages
      const channel = supabase
        .channel('dm_messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'dm_messages',
            filter: `thread_id=eq.${selectedThread}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as DmMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedThread]);

  const fetchThreads = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dm_threads')
        .select(`
          id,
          created_at,
          dm_members!inner (user_id),
          dm_messages (
            body,
            created_at,
            sender_id
          )
        `)
        .eq('dm_members.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process threads to get the latest message and other user info
      const processedThreads = await Promise.all(
        (data || []).map(async (thread: any) => {
          // Get the latest message
          const { data: latestMessage } = await supabase
            .from('dm_messages')
            .select('*')
            .eq('thread_id', thread.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get other user in the thread
          const { data: members } = await supabase
            .from('dm_members')
            .select('user_id')
            .eq('thread_id', thread.id)
            .neq('user_id', user.id)
            .limit(1)
            .single();

          let otherUser = null;
          if (members) {
            const { data: userData } = await supabase
              .from('users')
              .select('name, email')
              .eq('id', members.user_id)
              .single();

            otherUser = userData ? {
              display_name: userData.name || userData.email.split('@')[0],
              email: userData.email
            } : null;
          }

          return {
            ...thread,
            last_message: latestMessage,
            other_user: otherUser
          };
        })
      );

      setThreads(processedThreads);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      const { data, error } = await supabase
        .from('dm_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleAutoStartConversation = async (mentorId?: string | null, matchId?: string | null, listingId?: string | null) => {
    if (!user) return;

    let otherUserId = null;

    // Determine the other user based on the context
    if (mentorId) {
      const { data } = await supabase
        .from('mentors')
        .select('user_id')
        .eq('id', mentorId)
        .single();
      otherUserId = data?.user_id;
    } else if (matchId) {
      otherUserId = matchId;
    } else if (listingId) {
      const { data } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', listingId)
        .single();
      otherUserId = data?.user_id;
    }

    if (otherUserId && otherUserId !== user.id) {
      await createOrFindThread(otherUserId);
    }
  };

  const createOrFindThread = async (otherUserId: string) => {
    if (!user) return;

    try {
      // Check if thread already exists
      const { data: existingThread } = await supabase
        .from('dm_threads')
        .select(`
          id,
          dm_members!inner (user_id)
        `)
        .eq('dm_members.user_id', user.id);

      // Find thread where both users are members
      let threadId = null;
      for (const thread of existingThread || []) {
        const { data: members } = await supabase
          .from('dm_members')
          .select('user_id')
          .eq('thread_id', thread.id);

        const memberIds = members?.map(m => m.user_id) || [];
        if (memberIds.includes(otherUserId) && memberIds.includes(user.id)) {
          threadId = thread.id;
          break;
        }
      }

      // Create new thread if none exists
      if (!threadId) {
        const { data: newThread, error: threadError } = await supabase
          .from('dm_threads')
          .insert({})
          .select()
          .single();

        if (threadError) throw threadError;

        // Add both users as members
        const { error: membersError } = await supabase
          .from('dm_members')
          .insert([
            { thread_id: newThread.id, user_id: user.id },
            { thread_id: newThread.id, user_id: otherUserId }
          ]);

        if (membersError) throw membersError;
        threadId = newThread.id;
      }

      setSelectedThread(threadId);
      await fetchThreads();
    } catch (error) {
      console.error('Error creating/finding thread:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async () => {
    if (!selectedThread || !newMessage.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('dm_messages')
        .insert({
          thread_id: selectedThread,
          sender_id: user.id,
          body: newMessage.trim()
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header 
        currentCity={appState.city}
        onCityChange={() => {}}
        onAccountClick={() => {}}
        onLogoClick={() => navigate('/')}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="md:hidden"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Messages</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Thread List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading conversations...
                  </div>
                ) : threads.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No conversations yet</p>
                    <p className="text-xs">Start messaging from listings or profiles</p>
                  </div>
                ) : (
                  threads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThread(thread.id)}
                      className={`w-full p-4 text-left border-b hover:bg-muted/50 transition-colors ${
                        selectedThread === thread.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="font-medium mb-1">
                        {thread.other_user?.display_name || 'Anonymous User'}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {thread.last_message?.body || 'No messages yet'}
                      </div>
                      {thread.last_message && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatTime(thread.last_message.created_at)}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="md:col-span-2">
            {selectedThread ? (
              <>
                <CardContent className="p-0">
                  <ScrollArea className="h-[450px] p-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Start the conversation</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender_id === user.id ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                                message.sender_id === user.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.body}</p>
                              <div
                                className={`text-xs mt-1 ${
                                  message.sender_id === user.id
                                    ? 'text-primary-foreground/70'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {formatTime(message.created_at)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      disabled={sending}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
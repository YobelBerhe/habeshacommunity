import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/auth';

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  booking_id: string | null;
  last_message_at: string | null;
  other_participant: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  last_message: {
    content: string;
    created_at: string;
  } | null;
  unread_count: number;
  is_mentor_conversation: boolean;
}

interface ConversationListProps {
  onSelectConversation: (conversationId: string, participantName: string) => void;
}

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      // Get conversations where user is participant
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          participant1_id,
          participant2_id,
          booking_id,
          last_message_at
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (convError) throw convError;

      // For each conversation, get the other participant's profile and last message
      const enrichedConversations = await Promise.all(
        (convData || []).map(async (conv) => {
          const otherParticipantId =
            conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id;

          // Get other participant profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, display_name, avatar_url')
            .eq('id', otherParticipantId)
            .single();

          // Get last message
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('read', false)
            .neq('sender_id', user.id);

          // Check if this is a mentor conversation
          const { data: mentorData } = await supabase
            .from('mentors')
            .select('id')
            .eq('user_id', otherParticipantId)
            .maybeSingle();

          return {
            ...conv,
            other_participant: profileData || {
              id: otherParticipantId,
              display_name: 'Unknown User',
              avatar_url: null,
            },
            last_message: lastMsg || null,
            unread_count: unreadCount || 0,
            is_mentor_conversation: !!mentorData,
          };
        })
      );

      setConversations(enrichedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground mb-2">No conversations yet</p>
          <p className="text-sm text-muted-foreground">
            Book a mentor session to start chatting
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <Card
          key={conv.id}
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() =>
            onSelectConversation(
              conv.id,
              conv.other_participant.display_name || 'Unknown User'
            )
          }
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={conv.other_participant.avatar_url || undefined} />
                <AvatarFallback>
                  {(conv.other_participant.display_name || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">
                      {conv.other_participant.display_name || 'Unknown User'}
                    </h3>
                    {conv.is_mentor_conversation && (
                      <Badge variant="secondary" className="text-xs">
                        Mentor
                      </Badge>
                    )}
                  </div>
                  {conv.unread_count > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {conv.unread_count}
                    </Badge>
                  )}
                </div>
                
                {conv.last_message && (
                  <>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {conv.last_message.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(conv.last_message.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

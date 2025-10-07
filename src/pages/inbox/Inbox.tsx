import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import MentorHeader from '@/components/MentorHeader';
import { useEffect, useState } from 'react';
import { ConversationList } from '@/components/ConversationList';
import { ChatWindow } from '@/components/ChatWindow';
import { useMessageNotifications } from '@/hooks/useMessageNotifications';

export default function Inbox() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    name: string;
    participantId: string;
    avatar?: string;
  } | null>(null);

  // Set up push notifications
  useMessageNotifications((conversationId, senderName) => {
    // Auto-select conversation when notification is clicked
    // Note: senderId would need to be fetched separately or passed from notification
    setSelectedConversation({ id: conversationId, name: senderName, participantId: '' });
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  // Auto-open conversation if passed in state
  useEffect(() => {
    if (location.state?.openConversationId && location.state?.mentorName) {
      setSelectedConversation({
        id: location.state.openConversationId,
        name: location.state.mentorName,
        participantId: location.state.mentorId || '',
        avatar: location.state.mentorAvatar,
      });
      // Clear the state after using it
      navigate('/inbox', { replace: true, state: {} });
    }
  }, [location.state]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Messages" backPath="/" />
      <div className="container mx-auto px-4 pt-4 pb-8">
        {selectedConversation ? (
          <ChatWindow
            conversationId={selectedConversation.id}
            participantName={selectedConversation.name}
            participantId={selectedConversation.participantId}
            participantAvatar={selectedConversation.avatar}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <ConversationList
            onSelectConversation={(id, name, participantId, avatar) =>
              setSelectedConversation({ id, name, participantId, avatar })
            }
          />
        )}
      </div>
    </div>
  );
}

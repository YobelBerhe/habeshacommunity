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
  } | null>(null);

  // Set up push notifications
  useMessageNotifications((conversationId, senderName) => {
    // Auto-select conversation when notification is clicked
    setSelectedConversation({ id: conversationId, name: senderName });
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
      });
      // Clear the state after using it
      navigate('/inbox', { replace: true, state: {} });
    }
  }, [location.state]);

  if (!user) return null;
import { PageLoader } from '@/components/LoadingStates';
  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Messages" backPath="/" />
      <div className="container mx-auto px-4 pt-4 pb-8">
        {selectedConversation ? (
          <ChatWindow
            conversationId={selectedConversation.id}
            participantName={selectedConversation.name}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <ConversationList
            onSelectConversation={(id, name) =>
              setSelectedConversation({ id, name })
            }
          />
        )}
      </div>
    </div>
  );
}

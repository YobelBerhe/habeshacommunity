import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { MessageCircle } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { useEffect, useState } from 'react';
import { ConversationList } from '@/components/ConversationList';
import { ChatWindow } from '@/components/ChatWindow';

export default function Inbox() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Messages" backPath="/" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Inbox</h1>
        </div>

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

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateConversation } from '@/utils/conversations';
import { useNavigate } from 'react-router-dom';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  listingOwnerId: string;
}

export default function MessageModal({ 
  isOpen, 
  onClose, 
  listingTitle,
  listingOwnerId,
}: MessageModalProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [message, setMessage] = useState(`Hi, I'm interested in: ${listingTitle}`);
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    try {
      setSending(true);
      const { conversationId } = await getOrCreateConversation(listingOwnerId, message);
      toast({ title: 'Message sent' });
      onClose();
      navigate('/inbox', { state: { openConversationId: conversationId, mentorName: listingTitle } });
    } catch (e: any) {
      toast({ title: 'Failed to send message', description: e?.message || 'Please try again', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">About: {listingTitle}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write your message..." />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSend} disabled={sending}>{sending ? 'Sending...' : 'Send'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

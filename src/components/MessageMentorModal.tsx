import { X } from "lucide-react";

interface MessageMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
  mentorName: string;
  mentorUserId: string;
}

export default function MessageMentorModal({ 
  isOpen, 
  onClose, 
  mentorName 
}: MessageMentorModalProps) {
  // Disabled - requires database schema update for direct messaging
  // Current schema uses conversations table, not direct messages with recipient_id
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Message {mentorName}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center text-muted-foreground py-8">
          <p>Direct messaging feature is being updated.</p>
          <p className="text-sm mt-2">Please check back soon!</p>
        </div>
      </div>
    </div>
  );
}

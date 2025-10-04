-- Add unread message tracking to messages table
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false;

-- Create index for faster unread queries
CREATE INDEX IF NOT EXISTS idx_messages_read 
ON public.messages(conversation_id, read);

-- Update existing messages to be marked as read
UPDATE public.messages SET read = true WHERE read IS NULL;
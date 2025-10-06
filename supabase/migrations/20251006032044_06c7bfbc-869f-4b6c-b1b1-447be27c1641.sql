-- Add sender_id to notifications table for threading
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS sender_id uuid REFERENCES auth.users(id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_sender_id ON public.notifications(sender_id);

-- Add conversation_id for message notifications
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS conversation_id uuid;
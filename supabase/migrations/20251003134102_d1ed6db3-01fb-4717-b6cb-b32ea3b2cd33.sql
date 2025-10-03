-- Add support for different message types and media URLs
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'image')),
ADD COLUMN IF NOT EXISTS media_url TEXT;

-- Create storage bucket for chat media
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for chat-media bucket
CREATE POLICY "Users can upload their own chat media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'chat-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view chat media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'chat-media');
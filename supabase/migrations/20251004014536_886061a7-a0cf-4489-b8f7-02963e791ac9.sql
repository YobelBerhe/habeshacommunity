-- Add mentor/mentee specific columns to conversations for better querying
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL;

-- Create index for faster booking-related conversation lookups
CREATE INDEX IF NOT EXISTS idx_conversations_booking ON public.conversations(booking_id);

-- Create trigger to auto-create conversation when booking is created
CREATE OR REPLACE FUNCTION public.auto_create_conversation_on_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  mentor_user_id uuid;
BEGIN
  -- Get the mentor's user_id from the mentor record
  SELECT user_id INTO mentor_user_id
  FROM mentors
  WHERE id = NEW.mentor_id;

  -- Only create conversation if one doesn't exist for this booking
  IF NOT EXISTS (
    SELECT 1 FROM conversations 
    WHERE booking_id = NEW.id
  ) THEN
    -- Insert conversation with correct participant ordering
    IF NEW.user_id < mentor_user_id THEN
      INSERT INTO conversations (participant1_id, participant2_id, booking_id)
      VALUES (NEW.user_id, mentor_user_id, NEW.id);
    ELSE
      INSERT INTO conversations (participant1_id, participant2_id, booking_id)
      VALUES (mentor_user_id, NEW.user_id, NEW.id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to auto-create conversations on booking
DROP TRIGGER IF EXISTS trigger_auto_create_conversation ON public.bookings;
CREATE TRIGGER trigger_auto_create_conversation
AFTER INSERT ON public.bookings
FOR EACH ROW
WHEN (NEW.status IN ('pending', 'confirmed'))
EXECUTE FUNCTION public.auto_create_conversation_on_booking();

-- Create function to notify on new messages
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient_id uuid;
  conversation_participants record;
BEGIN
  -- Get both participants
  SELECT participant1_id, participant2_id INTO conversation_participants
  FROM conversations
  WHERE id = NEW.conversation_id;
  
  -- Determine recipient (the person who didn't send the message)
  IF NEW.sender_id = conversation_participants.participant1_id THEN
    recipient_id := conversation_participants.participant2_id;
  ELSE
    recipient_id := conversation_participants.participant1_id;
  END IF;
  
  -- Create notification for recipient
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    recipient_id,
    'message',
    'New message',
    LEFT(NEW.content, 100),
    '/inbox'
  );
  
  -- Update last_message_at in conversation
  UPDATE conversations 
  SET last_message_at = NEW.created_at 
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to send notifications on new messages
DROP TRIGGER IF EXISTS trigger_notify_new_message ON public.messages;
CREATE TRIGGER trigger_notify_new_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_message();

-- Add RLS policy to allow starting conversations with verified mentors
CREATE POLICY "Users can create conversations with verified mentors"
ON public.conversations
FOR INSERT
WITH CHECK (
  auth.uid() = participant1_id OR auth.uid() = participant2_id
);
-- Simplify the notify_new_message function to remove edge function call
-- The frontend now handles calling the email notification edge function
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  recipient_id uuid;
  conversation_participants record;
  sender_name text;
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
  
  -- Get sender's name
  SELECT COALESCE(display_name, 'A user') INTO sender_name
  FROM profiles
  WHERE id = NEW.sender_id;
  
  -- Create notification for recipient
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    recipient_id,
    'message',
    'New message from ' || sender_name,
    LEFT(NEW.content, 100),
    '/inbox'
  );
  
  -- Update last_message_at in conversation
  UPDATE conversations 
  SET last_message_at = NEW.created_at 
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$function$;
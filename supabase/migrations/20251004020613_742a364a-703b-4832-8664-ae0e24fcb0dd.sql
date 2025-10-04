-- Add email notification preference to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT true;

-- Update the notify_new_message function to handle email notifications
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
  recipient_email text;
  recipient_wants_email boolean;
  has_unread_messages boolean;
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
    'New message',
    LEFT(NEW.content, 100),
    '/inbox'
  );
  
  -- Update last_message_at in conversation
  UPDATE conversations 
  SET last_message_at = NEW.created_at 
  WHERE id = NEW.conversation_id;
  
  -- Check if recipient wants email notifications
  SELECT email_notifications_enabled INTO recipient_wants_email
  FROM profiles
  WHERE id = recipient_id;
  
  -- Check if recipient has unread messages (is offline)
  SELECT EXISTS(
    SELECT 1 FROM messages 
    WHERE conversation_id = NEW.conversation_id 
    AND sender_id = NEW.sender_id 
    AND read = false
  ) INTO has_unread_messages;
  
  -- If recipient wants emails and has unread messages, call edge function
  IF recipient_wants_email AND has_unread_messages THEN
    -- Get recipient email from auth.users
    SELECT email INTO recipient_email
    FROM auth.users
    WHERE id = recipient_id;
    
    -- Call edge function to send email (non-blocking)
    PERFORM net.http_post(
      url := current_setting('app.settings.api_url') || '/functions/v1/send-message-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'recipientEmail', recipient_email,
        'senderName', sender_name,
        'messagePreview', LEFT(NEW.content, 100),
        'conversationId', NEW.conversation_id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;
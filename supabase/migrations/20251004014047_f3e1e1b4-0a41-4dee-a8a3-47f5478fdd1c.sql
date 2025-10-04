-- Prevent user_id from being changed on mentor_credits
-- This ensures credits are strictly non-transferable

CREATE OR REPLACE FUNCTION public.prevent_credit_transfer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id <> OLD.user_id THEN
    RAISE EXCEPTION 'Credits cannot be transferred. User ID cannot be changed.';
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to enforce non-transferable credits
CREATE TRIGGER lock_credit_user_id
BEFORE UPDATE ON public.mentor_credits
FOR EACH ROW
EXECUTE FUNCTION public.prevent_credit_transfer();

-- Add comment for documentation
COMMENT ON TRIGGER lock_credit_user_id ON public.mentor_credits IS 
'Prevents credits from being transferred between users by blocking user_id updates';
-- Remove expires_at column from mentor_credits (keeping credits lifetime)
ALTER TABLE public.mentor_credits DROP COLUMN IF EXISTS expires_at;

-- Drop the expires index since we don't need it anymore
DROP INDEX IF EXISTS idx_mentor_credits_expires;
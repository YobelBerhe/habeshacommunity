-- Create mentor_credits table for session bundles
CREATE TABLE IF NOT EXISTS public.mentor_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  bundle_size INTEGER NOT NULL,
  credits_left INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add used_credit column to mentor_bookings
ALTER TABLE public.mentor_bookings 
ADD COLUMN IF NOT EXISTS used_credit BOOLEAN DEFAULT false;

-- Enable RLS on mentor_credits
ALTER TABLE public.mentor_credits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own credits
CREATE POLICY "Users can view their own credits"
ON public.mentor_credits
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can view credits for their mentor profile
CREATE POLICY "Mentors can view credits purchased for them"
ON public.mentor_credits
FOR SELECT
USING (
  mentor_id IN (
    SELECT id FROM public.mentors WHERE user_id = auth.uid()
  )
);

-- Create index for faster credit lookups
CREATE INDEX IF NOT EXISTS idx_mentor_credits_user_mentor 
ON public.mentor_credits(user_id, mentor_id, credits_left);

CREATE INDEX IF NOT EXISTS idx_mentor_credits_expires 
ON public.mentor_credits(expires_at) 
WHERE credits_left > 0;
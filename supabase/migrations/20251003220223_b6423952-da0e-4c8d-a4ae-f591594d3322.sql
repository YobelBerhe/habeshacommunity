-- Add Stripe Connect fields to mentors table
ALTER TABLE public.mentors
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS payouts_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_required BOOLEAN DEFAULT true;

-- Add platform fee tracking to mentor_bookings
ALTER TABLE public.mentor_bookings
ADD COLUMN IF NOT EXISTS application_fee_cents INTEGER,
ADD COLUMN IF NOT EXISTS net_to_mentor_cents INTEGER,
ADD COLUMN IF NOT EXISTS charge_id TEXT,
ADD COLUMN IF NOT EXISTS transfer_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_mentors_stripe_account ON public.mentors(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session ON public.mentor_bookings(stripe_session_id);
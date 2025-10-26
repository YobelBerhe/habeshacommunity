-- Drop the overly permissive policy that exposes mentor data publicly
DROP POLICY IF EXISTS "Mentors are viewable by everyone" ON public.mentors;

-- Allow mentors to view their own full profile including Stripe data
CREATE POLICY "Mentors can view their own profile"
ON public.mentors
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create a view that only exposes public mentor fields (hides sensitive data)
CREATE OR REPLACE VIEW public.public_mentors 
WITH (security_invoker = on)
AS
SELECT 
  id,
  name,
  title,
  bio,
  expertise,
  languages,
  currency,
  avatar_url,
  city,
  country,
  timezone,
  display_name,
  photos,
  website_url,
  topics,
  skills,
  industries,
  youtube_link,
  price_cents,
  hourly_rate_cents,
  rating_avg,
  rating_count,
  is_verified,
  is_featured,
  badges_count,
  available,
  created_at,
  updated_at
FROM public.mentors
WHERE available = true;

-- Grant SELECT on the public view to authenticated users
GRANT SELECT ON public.public_mentors TO authenticated;

-- Note: Sensitive fields excluded from public view:
-- user_id, stripe_account_id, payouts_enabled, onboarding_required, verification_celebrated
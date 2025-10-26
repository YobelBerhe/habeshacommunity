-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Allow users to view their own full profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow authenticated users to view other profiles
-- Note: Application layer must filter sensitive columns (gender, referral_code, etc.)
-- and only return public fields (display_name, avatar_url, city, bio, country)
CREATE POLICY "Authenticated users can view public profile data"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Important: RLS controls row-level access, not column-level access.
-- The application code must ensure that when fetching other users' profiles,
-- only public fields are selected: display_name, avatar_url, city, bio, country
-- Sensitive fields to exclude: gender, referral_code, email_notifications_enabled, credits_balance
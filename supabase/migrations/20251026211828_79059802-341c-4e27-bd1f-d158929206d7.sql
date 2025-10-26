-- Drop the overly permissive policy that exposes all profile data
DROP POLICY IF EXISTS "Authenticated users can view public profile data" ON public.profiles;

-- Create a view that only exposes public profile fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  display_name,
  avatar_url,
  bio,
  city,
  country
FROM public.profiles;

-- Grant SELECT on the public view to authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;

-- Note: Users can still view their own full profile via the existing policy:
-- "Users can view their own profile" allows SELECT when auth.uid() = id
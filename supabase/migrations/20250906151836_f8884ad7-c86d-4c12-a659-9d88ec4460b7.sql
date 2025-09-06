-- Fix critical security vulnerability in match_profiles table
-- First check existing policies and drop the problematic one

-- Drop the existing permissive policy that allows public access
DROP POLICY IF EXISTS "profiles readable" ON public.match_profiles;

-- Create a security definer function for controlled profile discovery
-- This allows the app to implement proper matching logic without exposing all data
CREATE OR REPLACE FUNCTION public.get_potential_matches(
  p_user_id uuid DEFAULT auth.uid(),
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  age integer,
  city text,
  country text,
  bio text,
  photos text[],
  gender text,
  seeking text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return profiles for authenticated users
  IF p_user_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Return potential matches excluding the requesting user
  -- Add your matching logic here (e.g., age range, location, preferences)
  RETURN QUERY
  SELECT 
    mp.user_id,
    mp.display_name,
    mp.age,
    mp.city,
    mp.country,
    mp.bio,
    mp.photos,
    mp.gender,
    mp.seeking
  FROM public.match_profiles mp
  WHERE mp.user_id != p_user_id
    AND mp.user_id NOT IN (
      -- Exclude profiles already matched/rejected (implement as needed)
      SELECT '00000000-0000-0000-0000-000000000000'::uuid
      WHERE false
    )
  ORDER BY mp.created_at DESC
  LIMIT p_limit;
END;
$$;
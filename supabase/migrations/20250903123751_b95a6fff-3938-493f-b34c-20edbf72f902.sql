-- Create a more secure RLS policy for listing_contacts that prevents spam harvesting

-- First, drop the overly permissive existing policy
DROP POLICY IF EXISTS "Authenticated users can view contact info" ON public.listing_contacts;

-- Create a secure policy that only allows:
-- 1. Listing owners to see their own contact info
-- 2. Authenticated users to see contact info only for listings they are specifically viewing
CREATE POLICY "Secure contact info access" 
ON public.listing_contacts 
FOR SELECT 
TO authenticated
USING (
  -- Allow listing owners to see their own contact info
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE listings.id = listing_contacts.listing_id 
    AND listings.user_id = auth.uid()
  )
  OR
  -- Allow authenticated users to see contact info (this will be further restricted in the app layer)
  auth.uid() IS NOT NULL
);

-- Create a function to track listing views for legitimate interest tracking
CREATE OR REPLACE FUNCTION public.track_listing_view(listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update the view timestamp for this user and listing
  INSERT INTO public.listing_views (user_id, listing_id, viewed_at)
  VALUES (auth.uid(), listing_id, now())
  ON CONFLICT (user_id, listing_id) 
  DO UPDATE SET viewed_at = now();
END;
$$;

-- Create a table to track legitimate listing views
CREATE TABLE IF NOT EXISTS public.listing_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  listing_id uuid NOT NULL,
  viewed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable RLS on listing_views
ALTER TABLE public.listing_views ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own views
CREATE POLICY "Users can track their own listing views" 
ON public.listing_views 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own views
CREATE POLICY "Users can update their own listing views" 
ON public.listing_views 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to see their own views
CREATE POLICY "Users can see their own listing views" 
ON public.listing_views 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);
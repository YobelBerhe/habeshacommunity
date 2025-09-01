-- Create RLS policy for listing_counts view
-- First, we need to drop the view and recreate it as a regular view (not security definer)
DROP VIEW IF EXISTS public.listing_counts;

-- Create the view without security definer
CREATE VIEW public.listing_counts AS
SELECT 
  subcategory, 
  COUNT(*)::int AS total
FROM public.listings
WHERE status = 'active'
GROUP BY subcategory;

-- Enable RLS on the view (even though it inherits from the listings table)
-- Add a policy to allow anyone to read listing counts since this is public data
CREATE POLICY "Anyone can view listing counts" ON public.listing_counts
  FOR SELECT
  USING (true);
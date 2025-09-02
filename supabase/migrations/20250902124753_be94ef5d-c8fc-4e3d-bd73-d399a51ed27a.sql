-- Drop the existing view
DROP VIEW IF EXISTS public.listing_counts;

-- Recreate the view with explicit security_invoker option
CREATE VIEW public.listing_counts 
WITH (security_invoker = true)
AS 
SELECT 
  subcategory,
  COUNT(*)::integer AS total
FROM public.listings
WHERE status = 'active'
GROUP BY subcategory;

-- Grant permissions
GRANT SELECT ON public.listing_counts TO authenticated;
GRANT SELECT ON public.listing_counts TO anon;
-- Drop the existing listing_counts view that has SECURITY DEFINER
DROP VIEW IF EXISTS public.listing_counts;

-- Recreate the view without SECURITY DEFINER (using SECURITY INVOKER by default)
CREATE VIEW public.listing_counts AS 
SELECT 
  subcategory,
  COUNT(*)::integer AS total
FROM public.listings
WHERE status = 'active'
GROUP BY subcategory;

-- Grant appropriate permissions
GRANT SELECT ON public.listing_counts TO authenticated;
GRANT SELECT ON public.listing_counts TO anon;
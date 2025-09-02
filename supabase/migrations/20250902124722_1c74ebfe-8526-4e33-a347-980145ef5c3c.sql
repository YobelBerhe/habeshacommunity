-- Drop the view completely
DROP VIEW IF EXISTS public.listing_counts CASCADE;

-- Recreate the view with explicit security invoker and proper ownership
CREATE VIEW public.listing_counts 
WITH (security_invoker = true)
AS 
SELECT 
  subcategory,
  COUNT(*)::integer AS total
FROM public.listings
WHERE status = 'active'
GROUP BY subcategory;

-- Change ownership to the service role instead of postgres superuser
ALTER VIEW public.listing_counts OWNER TO authenticator;

-- Grant appropriate permissions
GRANT SELECT ON public.listing_counts TO authenticated;
GRANT SELECT ON public.listing_counts TO anon;
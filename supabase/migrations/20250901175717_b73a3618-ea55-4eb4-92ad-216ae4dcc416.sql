-- Fix the function to have proper search path set
CREATE OR REPLACE FUNCTION public.get_listing_counts()
RETURNS TABLE(subcategory text, total int)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 
    l.subcategory, 
    COUNT(*)::int AS total
  FROM public.listings l
  WHERE l.status = 'active'
  GROUP BY l.subcategory;
$$;
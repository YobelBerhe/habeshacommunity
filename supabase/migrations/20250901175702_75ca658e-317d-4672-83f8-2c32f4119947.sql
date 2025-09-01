-- Create a function to get listing counts instead of a view
CREATE OR REPLACE FUNCTION public.get_listing_counts()
RETURNS TABLE(subcategory text, total int)
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT 
    l.subcategory, 
    COUNT(*)::int AS total
  FROM public.listings l
  WHERE l.status = 'active'
  GROUP BY l.subcategory;
$$;
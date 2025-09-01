-- Create view for listing counts by subcategory
CREATE OR REPLACE VIEW public.listing_counts AS
SELECT 
  subcategory, 
  COUNT(*)::int AS total
FROM public.listings
WHERE status = 'active'
GROUP BY subcategory;
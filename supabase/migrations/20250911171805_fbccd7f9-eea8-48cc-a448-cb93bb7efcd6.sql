-- Drop and recreate the track_listing_view function to fix ambiguous column issue
DROP FUNCTION IF EXISTS public.track_listing_view(uuid);

CREATE OR REPLACE FUNCTION public.track_listing_view(p_listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert or update the view timestamp for this user and listing
  INSERT INTO public.listing_views (user_id, listing_id, viewed_at)
  VALUES (auth.uid(), p_listing_id, now())
  ON CONFLICT (user_id, listing_id)
  DO UPDATE SET viewed_at = now();
END;
$function$;
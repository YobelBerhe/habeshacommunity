-- Fix security definer view by enabling security invoker mode
-- This ensures the view respects RLS policies of the querying user
ALTER VIEW public.public_profiles SET (security_invoker = on);
-- Insert current authenticated user if they don't exist in public.users
INSERT INTO public.users (id, email, name)
SELECT 
  'ce6b594b-8b01-4571-bb14-f15364f3d9d4',
  'gebremichaelgirmai@gmail.com',
  'Yobel'
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE id = 'ce6b594b-8b01-4571-bb14-f15364f3d9d4'
);
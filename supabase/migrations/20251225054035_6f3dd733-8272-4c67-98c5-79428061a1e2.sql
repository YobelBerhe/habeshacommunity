-- Allow anyone (public) to view available mentors for browsing
CREATE POLICY "Anyone can view available mentors"
ON public.mentors
FOR SELECT
TO public
USING (available = true);

-- Also ensure bookings table has proper RLS for users to view their own bookings
-- Check if policy exists first
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' 
    AND policyname = 'Users can view their own bookings'
  ) THEN
    CREATE POLICY "Users can view their own bookings"
    ON public.bookings
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;
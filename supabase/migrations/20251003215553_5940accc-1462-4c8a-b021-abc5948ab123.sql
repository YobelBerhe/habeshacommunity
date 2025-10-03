-- Create mentor_bookings table
CREATE TABLE public.mentor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'accepted', 'declined', 'cancelled', 'completed')),
  message TEXT,
  notes TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  stripe_session_id TEXT,
  join_url TEXT,
  join_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own bookings or bookings for their mentor profile"
ON public.mentor_bookings
FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  auth.uid() IN (
    SELECT user_id FROM public.mentors WHERE id = mentor_bookings.mentor_id
  )
);

CREATE POLICY "Users can create bookings"
ON public.mentor_bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and mentors can update bookings"
ON public.mentor_bookings
FOR UPDATE
USING (
  auth.uid() = user_id 
  OR 
  auth.uid() IN (
    SELECT user_id FROM public.mentors WHERE id = mentor_bookings.mentor_id
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_mentor_bookings_updated_at
  BEFORE UPDATE ON public.mentor_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
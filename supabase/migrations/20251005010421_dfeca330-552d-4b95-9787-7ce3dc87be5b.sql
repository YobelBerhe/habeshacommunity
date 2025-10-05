-- Create mentor_availability table to store available time slots
CREATE TABLE public.mentor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  available_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mentor_availability ENABLE ROW LEVEL SECURITY;

-- Everyone can view available slots
CREATE POLICY "Available slots are viewable by everyone"
ON public.mentor_availability
FOR SELECT
USING (true);

-- Mentors can manage their own availability
CREATE POLICY "Mentors can manage their own availability"
ON public.mentor_availability
FOR ALL
USING (
  mentor_id IN (
    SELECT id FROM public.mentors WHERE user_id = auth.uid()
  )
);

-- Add scheduled_time to bookings table if not exists
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS scheduled_time TIME;

-- Add trigger for updated_at
CREATE TRIGGER update_mentor_availability_updated_at
BEFORE UPDATE ON public.mentor_availability
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster queries
CREATE INDEX idx_mentor_availability_mentor_date 
ON public.mentor_availability(mentor_id, available_date);

-- Create function to get available slots for a mentor on a specific date
CREATE OR REPLACE FUNCTION public.get_available_slots(
  p_mentor_id UUID,
  p_date DATE
)
RETURNS TABLE(
  id UUID,
  start_time TIME,
  end_time TIME,
  is_booked BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ma.id,
    ma.start_time,
    ma.end_time,
    ma.is_booked
  FROM public.mentor_availability ma
  WHERE ma.mentor_id = p_mentor_id
    AND ma.available_date = p_date
  ORDER BY ma.start_time;
END;
$$;
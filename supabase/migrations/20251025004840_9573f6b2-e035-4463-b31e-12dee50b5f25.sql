-- Create session_logs table for tracking mentor session duration
CREATE TABLE IF NOT EXISTS public.session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.mentor_bookings(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  proof_recorded BOOLEAN DEFAULT FALSE,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;

-- Users and mentors can view session logs for their bookings
CREATE POLICY "Users and mentors can view session logs"
  ON public.session_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.mentor_bookings
      WHERE mentor_bookings.id = session_logs.session_id
      AND (
        mentor_bookings.user_id = auth.uid()
        OR mentor_bookings.mentor_id IN (
          SELECT id FROM public.mentors WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Allow creating session logs for bookings
CREATE POLICY "Users and mentors can create session logs"
  ON public.session_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mentor_bookings
      WHERE mentor_bookings.id = session_logs.session_id
      AND (
        mentor_bookings.user_id = auth.uid()
        OR mentor_bookings.mentor_id IN (
          SELECT id FROM public.mentors WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Allow updating session logs for bookings
CREATE POLICY "Users and mentors can update session logs"
  ON public.session_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.mentor_bookings
      WHERE mentor_bookings.id = session_logs.session_id
      AND (
        mentor_bookings.user_id = auth.uid()
        OR mentor_bookings.mentor_id IN (
          SELECT id FROM public.mentors WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_session_logs_session_id ON public.session_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_session_logs_created_at ON public.session_logs(created_at DESC);
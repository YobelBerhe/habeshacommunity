-- Add meeting provider fields to mentors table
ALTER TABLE mentors 
ADD COLUMN meeting_provider text DEFAULT 'discord',
ADD COLUMN meeting_base_url text;

-- Add join URL and payment fields to mentor_bookings table
ALTER TABLE mentor_bookings 
ADD COLUMN join_url text,
ADD COLUMN join_expires_at timestamptz,
ADD COLUMN payment_status text DEFAULT 'pending',
ADD COLUMN stripe_session_id text;

-- Create booking access logs table
CREATE TABLE booking_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES mentor_bookings(id) ON DELETE CASCADE,
  viewer_id uuid,
  viewed_at timestamptz DEFAULT now()
);

-- Enable RLS on booking_access_logs
ALTER TABLE booking_access_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for booking_access_logs
CREATE POLICY "Users can view their own access logs" 
ON booking_access_logs 
FOR SELECT 
USING (auth.uid() = viewer_id);

CREATE POLICY "Users can create their own access logs" 
ON booking_access_logs 
FOR INSERT 
WITH CHECK (auth.uid() = viewer_id);
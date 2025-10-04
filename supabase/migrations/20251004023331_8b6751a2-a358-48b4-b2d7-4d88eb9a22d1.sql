-- Add reminder tracking flags to bookings table
ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS reminder_1h_sent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_5m_sent boolean DEFAULT false;

-- Enable pg_cron extension for scheduled reminders
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Drop old 15-minute schedule if exists
SELECT cron.unschedule('session-reminders-every-15min')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'session-reminders-every-15min');

-- Schedule reminder function to run every 5 minutes
SELECT cron.schedule(
  'session-reminders-every-5min',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url:='https://gybpcmtzowhfbofsiiah.supabase.co/functions/v1/send-session-reminders',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5YnBjbXR6b3doZmJvZnNpaWFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQxOTczNiwiZXhwIjoyMDc0OTk1NzM2fQ.0oGCCRoq5T_RoY5QzwY8JOBBVdVFcRE_5Hf7EoQBKrI"}'::jsonb
  );
  $$
);
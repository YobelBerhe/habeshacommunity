-- Add read_at timestamp column to notifications table
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS read_at timestamp with time zone;

-- Migrate existing data: set read_at for notifications that are marked as read
UPDATE public.notifications
SET read_at = created_at
WHERE read = true AND read_at IS NULL;

-- We'll keep the read column for backward compatibility but read_at is now the source of truth
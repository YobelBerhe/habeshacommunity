-- Fix notifications.id to auto-generate and be primary key
-- 1) Fill any existing null ids
UPDATE public.notifications
SET id = gen_random_uuid()
WHERE id IS NULL;

-- 2) Ensure default UUID on id
ALTER TABLE public.notifications
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3) Add primary key if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.notifications'::regclass
      AND contype = 'p'
  ) THEN
    ALTER TABLE public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
  END IF;
END $$;
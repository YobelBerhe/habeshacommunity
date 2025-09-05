-- Create notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null,                      -- e.g. 'booking.created', 'booking.accepted'
  title text not null,
  body text,
  link text,                               -- e.g. '/mentor/bookings' or '/inbox?thread=...'
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.notifications enable row level security;

-- RLS policies
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_notifications_user_created on public.notifications (user_id, created_at desc);
create index if not exists idx_notifications_unread on public.notifications (user_id) where read_at is null;

-- Enable realtime for notifications
alter table public.notifications replica identity full;
alter publication supabase_realtime add table public.notifications;
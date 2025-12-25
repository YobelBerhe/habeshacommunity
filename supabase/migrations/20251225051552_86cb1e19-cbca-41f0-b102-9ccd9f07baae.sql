-- Create groups table for community groups
CREATE TABLE IF NOT EXISTS public.community_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Social',
  cover_image TEXT,
  city TEXT,
  state TEXT,
  is_private BOOLEAN DEFAULT false,
  creator_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS public.community_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  status TEXT DEFAULT 'active',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Enable RLS
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_group_members ENABLE ROW LEVEL SECURITY;

-- Groups policies
CREATE POLICY "Community groups are viewable by everyone" ON public.community_groups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create community groups" ON public.community_groups FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their community groups" ON public.community_groups FOR UPDATE USING (auth.uid() = creator_id);

-- Group members policies
CREATE POLICY "Community group members are viewable by everyone" ON public.community_group_members FOR SELECT USING (true);
CREATE POLICY "Users can join community groups" ON public.community_group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave community groups" ON public.community_group_members FOR DELETE USING (auth.uid() = user_id);
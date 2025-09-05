-- MENTORING
CREATE TABLE IF NOT EXISTS public.mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  bio text,
  topics text[] DEFAULT '{}',           -- ['language','health','career',...]
  languages text[] DEFAULT '{}',        -- ['ti','am','en',...]
  city text, 
  country text,
  price_cents int DEFAULT 0, 
  currency text DEFAULT 'USD',
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mentors readable" ON public.mentors 
  FOR SELECT USING (true);

CREATE POLICY "mentors upsert own" ON public.mentors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mentors update own" ON public.mentors
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- MENTOR BOOKINGS
CREATE TABLE IF NOT EXISTS public.mentor_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  mentee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text CHECK (status IN ('requested','accepted','declined','completed','cancelled')) DEFAULT 'requested',
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "booking visible to participants" ON public.mentor_bookings
  FOR SELECT USING (
    auth.uid() = mentee_id OR 
    auth.uid() = (SELECT user_id FROM mentors m WHERE m.id = mentor_bookings.mentor_id)
  );

CREATE POLICY "mentee create" ON public.mentor_bookings 
  FOR INSERT WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "participants update" ON public.mentor_bookings
  FOR UPDATE USING (
    auth.uid() = mentee_id OR 
    auth.uid() = (SELECT user_id FROM mentors m WHERE m.id = mentor_bookings.mentor_id)
  );

-- MATCHMAKING
CREATE TABLE IF NOT EXISTS public.match_questions (
  id serial PRIMARY KEY,
  text text NOT NULL,
  choices text[] NOT NULL,          -- ['A','B','C'...]
  weight int DEFAULT 1              -- relative importance
);

CREATE TABLE IF NOT EXISTS public.match_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  city text, 
  country text,
  gender text, 
  seeking text, 
  age int,
  bio text,
  photos text[] DEFAULT '{}',       -- public URLs
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.match_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile upsert" ON public.match_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own profile update" ON public.match_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles readable" ON public.match_profiles 
  FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.match_answers (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id int REFERENCES public.match_questions(id) ON DELETE CASCADE,
  choice_index int NOT NULL,         -- index into choices
  importance int DEFAULT 1,          -- 1..3 (how much they care)
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, question_id)
);

ALTER TABLE public.match_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own answers" ON public.match_answers
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- MATCH SCORES (optional precomputed similarity)
CREATE TABLE IF NOT EXISTS public.match_scores (
  user_a uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score numeric NOT NULL,           -- 0..100
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_a, user_b)
);

ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read scores" ON public.match_scores 
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- DIRECT MESSAGES (DMs)
CREATE TABLE IF NOT EXISTS public.dm_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dm_members (
  thread_id uuid REFERENCES public.dm_threads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.dm_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES public.dm_threads(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.dm_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members can read thread" ON public.dm_threads 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM dm_members m WHERE m.thread_id = id AND m.user_id = auth.uid())
  );

CREATE POLICY "members can read msgs" ON public.dm_messages 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM dm_members m WHERE m.thread_id = dm_messages.thread_id AND m.user_id = auth.uid())
  );

CREATE POLICY "members can insert msgs" ON public.dm_messages 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM dm_members m WHERE m.thread_id = dm_messages.thread_id AND m.user_id = auth.uid())
  );

-- Seed some match questions
INSERT INTO public.match_questions (text, choices, weight) VALUES
('What is your preferred weekend activity?', ARRAY['Going out with friends', 'Reading at home', 'Outdoor adventures', 'Cultural events'], 1),
('How important is family in your life?', ARRAY['Very important', 'Somewhat important', 'Not very important'], 3),
('What type of relationship are you seeking?', ARRAY['Casual dating', 'Serious relationship', 'Marriage', 'Friendship first'], 3),
('How do you handle disagreements?', ARRAY['Direct discussion', 'Give space first', 'Seek mediation', 'Avoid conflict'], 2),
('What role does faith play in your life?', ARRAY['Very important', 'Somewhat important', 'Not important', 'Prefer not to say'], 2),
('How do you prefer to communicate?', ARRAY['In person', 'Phone calls', 'Text messages', 'Video calls'], 1),
('What is your ideal living situation?', ARRAY['City center', 'Suburbs', 'Small town', 'Rural area'], 1),
('How important is career ambition?', ARRAY['Very important', 'Somewhat important', 'Work-life balance is key', 'Not a priority'], 2),
('What do you value most in a partner?', ARRAY['Honesty', 'Humor', 'Intelligence', 'Kindness'], 3),
('How do you spend your free time?', ARRAY['Sports/fitness', 'Arts/culture', 'Social activities', 'Quiet hobbies'], 1)
ON CONFLICT (id) DO NOTHING;
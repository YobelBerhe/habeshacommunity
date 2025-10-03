-- Create match_questions table with sections and weighted questions
CREATE TABLE IF NOT EXISTS public.match_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL CHECK (section IN ('core_profile', 'partner_prefs', 'lifestyle', 'fun')),
  question_text TEXT NOT NULL,
  choices JSONB NOT NULL DEFAULT '[]'::jsonb,
  weight INTEGER NOT NULL DEFAULT 1 CHECK (weight BETWEEN 1 AND 3),
  is_required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_answers table to store responses
CREATE TABLE IF NOT EXISTS public.user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.match_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Create likes table for swipe actions
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(liker_id, liked_id),
  CHECK (liker_id != liked_id)
);

-- Create matches table for mutual likes
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id)
);

-- Enable RLS
ALTER TABLE public.match_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for match_questions (public read)
CREATE POLICY "Questions are viewable by authenticated users"
ON public.match_questions FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for user_answers
CREATE POLICY "Users can view their own answers"
ON public.user_answers FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own answers"
ON public.user_answers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers"
ON public.user_answers FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for likes
CREATE POLICY "Users can view likes they sent or received"
ON public.likes FOR SELECT
TO authenticated
USING (auth.uid() = liker_id OR auth.uid() = liked_id);

CREATE POLICY "Users can create likes"
ON public.likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = liker_id);

CREATE POLICY "Users can delete their own likes"
ON public.likes FOR DELETE
TO authenticated
USING (auth.uid() = liker_id);

-- RLS Policies for matches
CREATE POLICY "Users can view their own matches"
ON public.matches FOR SELECT
TO authenticated
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Function to create match when mutual like occurs
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  mutual_like_exists BOOLEAN;
  smaller_id UUID;
  larger_id UUID;
BEGIN
  -- Check if reciprocal like exists
  SELECT EXISTS(
    SELECT 1 FROM public.likes
    WHERE liker_id = NEW.liked_id AND liked_id = NEW.liker_id
  ) INTO mutual_like_exists;

  -- If mutual like exists, create match and conversation
  IF mutual_like_exists THEN
    -- Ensure consistent ordering for match table
    IF NEW.liker_id < NEW.liked_id THEN
      smaller_id := NEW.liker_id;
      larger_id := NEW.liked_id;
    ELSE
      smaller_id := NEW.liked_id;
      larger_id := NEW.liker_id;
    END IF;

    -- Insert match (ignore if already exists)
    INSERT INTO public.matches (user1_id, user2_id)
    VALUES (smaller_id, larger_id)
    ON CONFLICT (user1_id, user2_id) DO NOTHING;

    -- Create conversation if not exists
    INSERT INTO public.conversations (participant1_id, participant2_id)
    VALUES (smaller_id, larger_id)
    ON CONFLICT (participant1_id, participant2_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to auto-create matches
CREATE TRIGGER create_match_on_mutual_like
AFTER INSERT ON public.likes
FOR EACH ROW
EXECUTE FUNCTION public.check_and_create_match();

-- Seed match questions
-- Section 1: Core Profile
INSERT INTO public.match_questions (section, question_text, choices, weight, is_required) VALUES
('core_profile', 'What is your gender?', '["Male","Female","Other"]', 3, true),
('core_profile', 'What is your age?', '[]', 3, true),
('core_profile', 'Which city do you live in?', '[]', 2, true),
('core_profile', 'What is your relationship status?', '["Single","Divorced","Widowed"]', 3, true),
('core_profile', 'What is your religion or faith?', '["Christian","Muslim","Other"]', 3, true),
('core_profile', 'Do you smoke?', '["Yes","No","Sometimes"]', 2, false),
('core_profile', 'Do you drink alcohol?', '["Yes","No","Sometimes"]', 2, false),
('core_profile', 'Do you have children?', '["Yes","No"]', 3, false);

-- Section 2: Partner Preferences
INSERT INTO public.match_questions (section, question_text, choices, weight, is_required) VALUES
('partner_prefs', 'Preferred partner age range?', '["18-25","26-35","36-45","46+"]', 3, true),
('partner_prefs', 'Preferred partner religion?', '["Christian","Muslim","Any"]', 3, true),
('partner_prefs', 'Preferred partner education level?', '["High School","College","Graduate","Any"]', 2, false),
('partner_prefs', 'Preferred partner location?', '["Eritrea","USA","Europe","Africa","Anywhere"]', 2, false),
('partner_prefs', 'Are you okay with a partner who already has children?', '["Yes","No","Maybe"]', 3, false);

-- Section 3: Lifestyle & Values
INSERT INTO public.match_questions (section, question_text, choices, weight, is_required) VALUES
('lifestyle', 'How important is family to you?', '["Very important","Somewhat important","Not important"]', 3, true),
('lifestyle', 'How do you usually handle disagreements?', '["Calm discussion","Avoid conflict","Passionate debate"]', 3, true),
('lifestyle', 'How central is faith in your daily life?', '["Essential","Somewhat important","Not important"]', 3, true),
('lifestyle', 'What is your communication style?', '["In person","Phone calls","Texting","Video chat"]', 2, false),
('lifestyle', 'Do you prioritize career, family, or balance?', '["Career","Family","Balance"]', 3, true),
('lifestyle', 'How do you prefer to spend weekends?', '["Family time","Friends","Church/Mosque","Traveling","Relaxing at home"]', 2, false),
('lifestyle', 'What do you value most in a partner?', '["Honesty","Kindness","Faith","Humor","Ambition"]', 3, true),
('lifestyle', 'Would you relocate for a relationship?', '["Yes","No","Maybe"]', 2, false);

-- Section 4: Fun Questions
INSERT INTO public.match_questions (section, question_text, choices, weight, is_required) VALUES
('fun', 'How do you like your mornings?', '["Coffee","Tea","No breakfast"]', 1, false),
('fun', 'How do you like weddings?', '["Big traditional","Simple family","Modern style"]', 1, false),
('fun', 'How do you like traveling?', '["Love exploring","Sometimes","Prefer staying local"]', 1, false),
('fun', 'How do you like music?', '["Traditional Eritrean","Gospel","Afrobeats","Mix of all"]', 1, false),
('fun', 'How do you like spending evenings?', '["Family dinners","Friends","Gym","Quiet reading"]', 1, false);
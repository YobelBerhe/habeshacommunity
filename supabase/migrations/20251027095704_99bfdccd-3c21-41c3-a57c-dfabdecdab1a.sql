-- =====================================================
-- HABESHA COMMUNITY - SPIRITUAL SECTION DATABASE SCHEMA
-- PART 1: Complete Bible, Reading Plans, Progress System
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- BIBLE VERSIONS & BOOKS
-- =====================================================

CREATE TABLE bible_versions (
  id SERIAL PRIMARY KEY,
  version_id INTEGER UNIQUE NOT NULL,
  abbreviation VARCHAR(20) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  language_code VARCHAR(10) NOT NULL,
  language_name TEXT NOT NULL,
  description TEXT,
  audio_available BOOLEAN DEFAULT false,
  text_available BOOLEAN DEFAULT true,
  copyright TEXT,
  publisher TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bible_books (
  id SERIAL PRIMARY KEY,
  usfm VARCHAR(10) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  abbreviation VARCHAR(20),
  canon VARCHAR(5) NOT NULL CHECK (canon IN ('ot', 'nt')),
  book_order INTEGER NOT NULL,
  chapters_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bible_chapters (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES bible_books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  usfm VARCHAR(20) UNIQUE NOT NULL,
  verses_count INTEGER NOT NULL,
  canonical BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, chapter_number)
);

CREATE TABLE bible_verses (
  id SERIAL PRIMARY KEY,
  version_id INTEGER REFERENCES bible_versions(id) ON DELETE CASCADE,
  chapter_id INTEGER REFERENCES bible_chapters(id) ON DELETE CASCADE,
  verse_number INTEGER NOT NULL,
  usfm VARCHAR(30) NOT NULL,
  text TEXT NOT NULL,
  text_searchable TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', text)) STORED,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(version_id, chapter_id, verse_number)
);

CREATE INDEX idx_verses_usfm ON bible_verses(usfm);
CREATE INDEX idx_verses_chapter ON bible_verses(chapter_id);
CREATE INDEX idx_verses_version ON bible_verses(version_id);
CREATE INDEX idx_verses_search ON bible_verses USING GIN(text_searchable);

-- =====================================================
-- READING PLANS
-- =====================================================

CREATE TABLE reading_plan_publishers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reading_plans (
  id SERIAL PRIMARY KEY,
  external_id INTEGER UNIQUE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  about_html TEXT,
  about_text TEXT,
  publisher_id INTEGER REFERENCES reading_plan_publishers(id),
  days_count INTEGER NOT NULL,
  popularity_rank INTEGER DEFAULT 0,
  premium BOOLEAN DEFAULT false,
  languages JSONB DEFAULT '["en"]'::jsonb,
  categories JSONB DEFAULT '[]'::jsonb,
  gradient JSONB,
  cover_image_url TEXT,
  thumbnail_url TEXT,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  total_subscriptions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reading_plan_days (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER REFERENCES reading_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_id, day_number)
);

CREATE TABLE reading_plan_segments (
  id SERIAL PRIMARY KEY,
  day_id INTEGER REFERENCES reading_plan_days(id) ON DELETE CASCADE,
  segment_order INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('scripture', 'devotional', 'video', 'prayer', 'reflection')),
  usfm VARCHAR(50),
  version_id INTEGER REFERENCES bible_versions(id),
  title TEXT,
  content_html TEXT,
  content_text TEXT,
  video_url TEXT,
  video_thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(day_id, segment_order)
);

-- =====================================================
-- USER PROGRESS & SUBSCRIPTIONS
-- =====================================================

CREATE TABLE user_plan_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES reading_plans(id) ON DELETE CASCADE,
  current_day INTEGER DEFAULT 1,
  completed_days INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  last_read_at TIMESTAMPTZ,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plan_id)
);

CREATE TABLE user_day_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES user_plan_subscriptions(id) ON DELETE CASCADE,
  day_id INTEGER REFERENCES reading_plan_days(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  time_spent_seconds INTEGER,
  UNIQUE(subscription_id, day_id)
);

-- =====================================================
-- VERSE HIGHLIGHTS & BOOKMARKS
-- =====================================================

CREATE TABLE user_verse_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verse_id INTEGER REFERENCES bible_verses(id) ON DELETE CASCADE,
  color VARCHAR(20) DEFAULT 'yellow',
  note TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, verse_id)
);

CREATE TABLE user_verse_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verse_id INTEGER REFERENCES bible_verses(id) ON DELETE CASCADE,
  note TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, verse_id)
);

-- =====================================================
-- VERSE OF THE DAY
-- =====================================================

CREATE TABLE verse_of_the_day (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  verse_id INTEGER REFERENCES bible_verses(id),
  usfm VARCHAR(30) NOT NULL,
  version_id INTEGER REFERENCES bible_versions(id) DEFAULT 111,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STREAK TRACKING
-- =====================================================

CREATE TABLE user_reading_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_days_read INTEGER DEFAULT 0,
  last_read_date DATE,
  streak_start_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_daily_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_date DATE NOT NULL,
  verses_read INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  chapters_read INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  plans_engaged INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, read_date)
);

-- =====================================================
-- USER PREFERENCES
-- =====================================================

CREATE TABLE user_bible_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_version_id INTEGER REFERENCES bible_versions(id) DEFAULT 111,
  font_size VARCHAR(10) DEFAULT 'medium',
  theme VARCHAR(20) DEFAULT 'light',
  show_verse_numbers BOOLEAN DEFAULT true,
  red_letter_words BOOLEAN DEFAULT true,
  cross_references BOOLEAN DEFAULT true,
  daily_reminder_enabled BOOLEAN DEFAULT false,
  daily_reminder_time TIME DEFAULT '08:00:00',
  verse_of_day_notification BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_user_subscriptions_user ON user_plan_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_plan_subscriptions(status);
CREATE INDEX idx_user_highlights_user ON user_verse_highlights(user_id);
CREATE INDEX idx_user_bookmarks_user ON user_verse_bookmarks(user_id);
CREATE INDEX idx_user_streaks_user ON user_reading_streaks(user_id);
CREATE INDEX idx_plans_popularity ON reading_plans(popularity_rank DESC);
CREATE INDEX idx_plans_categories ON reading_plans USING GIN(categories);
CREATE INDEX idx_votd_date ON verse_of_the_day(date DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE user_plan_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_day_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verse_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verse_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bible_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON user_plan_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON user_plan_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON user_plan_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own highlights" ON user_verse_highlights
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can manage own highlights" ON user_verse_highlights
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks" ON user_verse_bookmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own streaks" ON user_reading_streaks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences" ON user_bible_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own day completions" ON user_day_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own day completions" ON user_day_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_reading_streak()
RETURNS TRIGGER AS $$
DECLARE
  v_streak_record RECORD;
  v_yesterday DATE;
BEGIN
  v_yesterday := NEW.read_date - INTERVAL '1 day';
  
  SELECT * INTO v_streak_record
  FROM user_reading_streaks
  WHERE user_id = NEW.user_id;
  
  IF NOT FOUND THEN
    INSERT INTO user_reading_streaks (user_id, current_streak, longest_streak, total_days_read, last_read_date, streak_start_date)
    VALUES (NEW.user_id, 1, 1, 1, NEW.read_date, NEW.read_date);
  ELSE
    IF v_streak_record.last_read_date = v_yesterday THEN
      UPDATE user_reading_streaks
      SET current_streak = current_streak + 1,
          longest_streak = GREATEST(longest_streak, current_streak + 1),
          total_days_read = total_days_read + 1,
          last_read_date = NEW.read_date,
          updated_at = NOW()
      WHERE user_id = NEW.user_id;
    ELSIF v_streak_record.last_read_date < v_yesterday THEN
      UPDATE user_reading_streaks
      SET current_streak = 1,
          total_days_read = total_days_read + 1,
          last_read_date = NEW.read_date,
          streak_start_date = NEW.read_date,
          updated_at = NOW()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reading_streak
AFTER INSERT ON user_daily_readings
FOR EACH ROW
EXECUTE FUNCTION update_reading_streak();

CREATE OR REPLACE FUNCTION check_plan_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_total_days INTEGER;
  v_completed_count INTEGER;
BEGIN
  SELECT days_count INTO v_total_days
  FROM reading_plans
  WHERE id = (SELECT plan_id FROM user_plan_subscriptions WHERE id = NEW.subscription_id);
  
  SELECT COUNT(*) INTO v_completed_count
  FROM user_day_completions
  WHERE subscription_id = NEW.subscription_id;
  
  IF v_completed_count >= v_total_days THEN
    UPDATE user_plan_subscriptions
    SET status = 'completed',
        completed_at = NOW(),
        updated_at = NOW()
    WHERE id = NEW.subscription_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_plan_completion
AFTER INSERT ON user_day_completions
FOR EACH ROW
EXECUTE FUNCTION check_plan_completion();

-- =====================================================
-- HELPFUL VIEWS
-- =====================================================

CREATE VIEW user_active_plans_with_progress AS
SELECT 
  ups.id,
  ups.user_id,
  ups.plan_id,
  rp.title,
  rp.slug,
  rp.days_count,
  rp.cover_image_url,
  rp.gradient,
  ups.current_day,
  ups.status,
  ups.started_at,
  ROUND((ARRAY_LENGTH(ups.completed_days, 1)::DECIMAL / rp.days_count) * 100, 2) as progress_percentage,
  ups.last_read_at
FROM user_plan_subscriptions ups
JOIN reading_plans rp ON ups.plan_id = rp.id
WHERE ups.status = 'active';

CREATE VIEW popular_reading_plans AS
SELECT 
  id,
  title,
  slug,
  description,
  days_count,
  gradient,
  cover_image_url,
  popularity_rank,
  average_rating,
  total_subscriptions
FROM reading_plans
WHERE premium = false
ORDER BY popularity_rank ASC
LIMIT 50;
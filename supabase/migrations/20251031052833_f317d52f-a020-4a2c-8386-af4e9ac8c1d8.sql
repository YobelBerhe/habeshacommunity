-- ==========================================
-- HABESHACOMMUNITY HEALTH CATEGORY MIGRATION
-- Phase 2: Complete Health Integration
-- ==========================================

-- 1. EXTEND PROFILES TABLE WITH CULTURAL FIELDS
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cultural_background TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS primary_language TEXT DEFAULT 'English';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS follows_orthodox_fasting BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fasting_strictness TEXT;

-- Add constraint for fasting_strictness
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_fasting_strictness_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_fasting_strictness_check 
  CHECK (fasting_strictness IN ('strict', 'moderate', 'flexible'));

-- Add health-related preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS health_goal TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fitness_level TEXT DEFAULT 'beginner';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 2. HABESHA FOOD LOGS TABLE
CREATE TABLE IF NOT EXISTS habesha_food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME NOT NULL,
  food_name TEXT NOT NULL,
  food_name_amharic TEXT,
  food_name_tigrinya TEXT,
  is_traditional_habesha BOOLEAN DEFAULT FALSE,
  is_fasting_appropriate BOOLEAN DEFAULT FALSE,
  calories INTEGER NOT NULL,
  protein_g DECIMAL(5,1) NOT NULL,
  carbs_g DECIMAL(5,1) NOT NULL,
  fats_g DECIMAL(5,1) NOT NULL,
  fiber_g DECIMAL(5,1),
  serving_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habesha_food_logs_user_date ON habesha_food_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_habesha_food_logs_traditional ON habesha_food_logs(is_traditional_habesha) WHERE is_traditional_habesha = TRUE;
CREATE INDEX IF NOT EXISTS idx_habesha_food_logs_fasting ON habesha_food_logs(is_fasting_appropriate) WHERE is_fasting_appropriate = TRUE;

ALTER TABLE habesha_food_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own food logs" ON habesha_food_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own food logs" ON habesha_food_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food logs" ON habesha_food_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food logs" ON habesha_food_logs
  FOR DELETE USING (auth.uid() = user_id);

-- 3. ORTHODOX FASTING CALENDAR TABLE
CREATE TABLE IF NOT EXISTS orthodox_fasting_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  fast_type TEXT NOT NULL,
  fast_name TEXT,
  description TEXT,
  strictness TEXT,
  day_of_fast INTEGER,
  total_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraint for fast_type
ALTER TABLE orthodox_fasting_calendar DROP CONSTRAINT IF EXISTS fasting_calendar_fast_type_check;
ALTER TABLE orthodox_fasting_calendar ADD CONSTRAINT fasting_calendar_fast_type_check 
  CHECK (fast_type IN ('lent', 'wednesday', 'friday', 'apostles', 'dormition', 'nativity', 'none'));

-- Add constraint for strictness
ALTER TABLE orthodox_fasting_calendar DROP CONSTRAINT IF EXISTS fasting_calendar_strictness_check;
ALTER TABLE orthodox_fasting_calendar ADD CONSTRAINT fasting_calendar_strictness_check 
  CHECK (strictness IN ('full', 'partial', 'fish-allowed'));

CREATE INDEX IF NOT EXISTS idx_fasting_calendar_date ON orthodox_fasting_calendar(date);
CREATE INDEX IF NOT EXISTS idx_fasting_calendar_type ON orthodox_fasting_calendar(fast_type);

ALTER TABLE orthodox_fasting_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fasting calendar viewable by all" ON orthodox_fasting_calendar
  FOR SELECT USING (true);

-- 4. USER FASTING PARTICIPATION TABLE
CREATE TABLE IF NOT EXISTS user_fasting_participation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fast_type TEXT NOT NULL,
  fast_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  days_completed INTEGER DEFAULT 0,
  days_missed INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fast_type, start_date)
);

CREATE INDEX IF NOT EXISTS idx_fasting_participation_user ON user_fasting_participation(user_id);
CREATE INDEX IF NOT EXISTS idx_fasting_participation_active ON user_fasting_participation(is_active) WHERE is_active = TRUE;

ALTER TABLE user_fasting_participation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own fasting participation" ON user_fasting_participation
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own fasting participation" ON user_fasting_participation
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fasting participation" ON user_fasting_participation
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fasting participation" ON user_fasting_participation
  FOR DELETE USING (auth.uid() = user_id);

-- 5. HEALTH COACHES TABLE
CREATE TABLE IF NOT EXISTS health_coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coach_type TEXT NOT NULL,
  certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  specializations TEXT[] DEFAULT ARRAY[]::TEXT[],
  languages TEXT[] DEFAULT ARRAY['English']::TEXT[],
  speaks_amharic BOOLEAN DEFAULT FALSE,
  speaks_tigrinya BOOLEAN DEFAULT FALSE,
  orthodox_fasting_expert BOOLEAN DEFAULT FALSE,
  traditional_foods_expert BOOLEAN DEFAULT FALSE,
  habesha_community_focus BOOLEAN DEFAULT FALSE,
  price_per_session_cents INTEGER NOT NULL,
  session_duration_min INTEGER DEFAULT 60,
  availability_schedule JSONB,
  bio TEXT,
  success_stories_count INTEGER DEFAULT 0,
  habesha_clients_count INTEGER DEFAULT 0,
  total_clients_count INTEGER DEFAULT 0,
  rating_avg DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraint for coach_type
ALTER TABLE health_coaches DROP CONSTRAINT IF EXISTS health_coaches_coach_type_check;
ALTER TABLE health_coaches ADD CONSTRAINT health_coaches_coach_type_check 
  CHECK (coach_type IN ('fitness', 'nutrition', 'sleep', 'wellness', 'mental_health'));

CREATE INDEX IF NOT EXISTS idx_health_coaches_type ON health_coaches(coach_type);
CREATE INDEX IF NOT EXISTS idx_health_coaches_languages ON health_coaches USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_health_coaches_habesha ON health_coaches(habesha_community_focus) WHERE habesha_community_focus = TRUE;
CREATE INDEX IF NOT EXISTS idx_health_coaches_rating ON health_coaches(rating_avg DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_health_coaches_active ON health_coaches(is_active) WHERE is_active = TRUE;

ALTER TABLE health_coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coaches" ON health_coaches
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Coaches can create own profile" ON health_coaches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Coaches can update own profile" ON health_coaches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Coaches can delete own profile" ON health_coaches
  FOR DELETE USING (auth.uid() = user_id);

-- 6. HEALTH COACH BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS health_coach_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES health_coaches(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  duration_min INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  meeting_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraint for status
ALTER TABLE health_coach_bookings DROP CONSTRAINT IF EXISTS health_coach_bookings_status_check;
ALTER TABLE health_coach_bookings ADD CONSTRAINT health_coach_bookings_status_check 
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));

CREATE INDEX IF NOT EXISTS idx_health_bookings_user ON health_coach_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_health_bookings_coach ON health_coach_bookings(coach_id);
CREATE INDEX IF NOT EXISTS idx_health_bookings_date ON health_coach_bookings(session_date);
CREATE INDEX IF NOT EXISTS idx_health_bookings_status ON health_coach_bookings(status);

ALTER TABLE health_coach_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON health_coach_bookings
  FOR SELECT USING (
    auth.uid() = user_id OR 
    coach_id IN (SELECT id FROM health_coaches WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create bookings" ON health_coach_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and coaches can update bookings" ON health_coach_bookings
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    coach_id IN (SELECT id FROM health_coaches WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can cancel own bookings" ON health_coach_bookings
  FOR DELETE USING (auth.uid() = user_id);

-- 7. CREATE FUNCTION TO UPDATE COACH UPDATED_AT
CREATE OR REPLACE FUNCTION update_health_coach_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER health_coaches_updated_at
  BEFORE UPDATE ON health_coaches
  FOR EACH ROW
  EXECUTE FUNCTION update_health_coach_updated_at();

-- 8. CREATE FUNCTION TO UPDATE BOOKING UPDATED_AT
CREATE OR REPLACE FUNCTION update_health_booking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER health_bookings_updated_at
  BEFORE UPDATE ON health_coach_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_health_booking_updated_at();
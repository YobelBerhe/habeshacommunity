-- Health Profiles Table
CREATE TABLE IF NOT EXISTS health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Basic Info
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm DECIMAL(5,2),
  height_unit TEXT DEFAULT 'cm',
  
  -- Goals
  weight_goal_kg DECIMAL(5,2),
  weight_goal_type TEXT CHECK (weight_goal_type IN ('lose', 'maintain', 'gain')),
  daily_calorie_goal INTEGER,
  daily_water_goal_ml INTEGER DEFAULT 2000,
  weekly_exercise_goal_minutes INTEGER DEFAULT 150,
  sleep_goal_hours DECIMAL(3,1) DEFAULT 8.0,
  
  -- Preferences
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active', 'extra_active')),
  diet_type TEXT CHECK (diet_type IN ('omnivore', 'vegetarian', 'vegan', 'pescatarian', 'orthodox_fasting', 'other')),
  
  -- Privacy
  share_progress BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Body Measurements Table
CREATE TABLE IF NOT EXISTS body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  weight_kg DECIMAL(5,2) NOT NULL,
  weight_unit TEXT DEFAULT 'kg',
  body_fat_percentage DECIMAL(4,2),
  muscle_mass_kg DECIMAL(5,2),
  bmi DECIMAL(4,2),
  notes TEXT,
  
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nutrition Logs Table
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  food_name TEXT NOT NULL,
  portion_size TEXT,
  
  -- Nutrition Info
  calories INTEGER,
  protein_g DECIMAL(5,2),
  carbs_g DECIMAL(5,2),
  fat_g DECIMAL(5,2),
  fiber_g DECIMAL(5,2),
  
  -- Metadata
  is_habesha_food BOOLEAN DEFAULT false,
  is_fasting_friendly BOOLEAN DEFAULT false,
  notes TEXT,
  
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercise Logs Table
CREATE TABLE IF NOT EXISTS exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  exercise_name TEXT NOT NULL,
  exercise_type TEXT CHECK (exercise_type IN ('cardio', 'strength', 'flexibility', 'dance', 'sports', 'other')) NOT NULL,
  duration_minutes INTEGER,
  
  -- Strength Training
  sets INTEGER,
  reps INTEGER,
  weight_kg DECIMAL(5,2),
  
  -- Cardio
  distance_km DECIMAL(5,2),
  calories_burned INTEGER,
  
  -- General
  intensity TEXT CHECK (intensity IN ('low', 'moderate', 'high', 'very_high')),
  notes TEXT,
  is_traditional_exercise BOOLEAN DEFAULT false,
  
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sleep Logs Table
CREATE TABLE IF NOT EXISTS sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  sleep_start TIMESTAMPTZ NOT NULL,
  sleep_end TIMESTAMPTZ NOT NULL,
  duration_hours DECIMAL(4,2),
  quality TEXT CHECK (quality IN ('poor', 'fair', 'good', 'excellent')),
  
  -- Details
  interruptions INTEGER DEFAULT 0,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hydration Logs Table
CREATE TABLE IF NOT EXISTS hydration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  amount_ml INTEGER NOT NULL,
  beverage_type TEXT DEFAULT 'water',
  
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mental Health Logs Table
CREATE TABLE IF NOT EXISTS mental_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  mood TEXT CHECK (mood IN ('very_bad', 'bad', 'neutral', 'good', 'very_good')) NOT NULL,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  
  -- Activities
  meditation_minutes INTEGER,
  prayer_minutes INTEGER,
  journaling BOOLEAN DEFAULT false,
  
  notes TEXT,
  
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health Goals Table
CREATE TABLE IF NOT EXISTS health_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  goal_type TEXT CHECK (goal_type IN ('weight', 'exercise', 'nutrition', 'sleep', 'hydration', 'mental', 'custom')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2),
  unit TEXT,
  
  start_date DATE NOT NULL,
  target_date DATE,
  completed_at TIMESTAMPTZ,
  
  status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_profiles
CREATE POLICY "Users can view own health profile" ON health_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health profile" ON health_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health profile" ON health_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for body_measurements
CREATE POLICY "Users can view own measurements" ON body_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own measurements" ON body_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own measurements" ON body_measurements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own measurements" ON body_measurements FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for nutrition_logs
CREATE POLICY "Users can view own nutrition logs" ON nutrition_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own nutrition logs" ON nutrition_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own nutrition logs" ON nutrition_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own nutrition logs" ON nutrition_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for exercise_logs
CREATE POLICY "Users can view own exercise logs" ON exercise_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own exercise logs" ON exercise_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exercise logs" ON exercise_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exercise logs" ON exercise_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for sleep_logs
CREATE POLICY "Users can view own sleep logs" ON sleep_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sleep logs" ON sleep_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sleep logs" ON sleep_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sleep logs" ON sleep_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for hydration_logs
CREATE POLICY "Users can view own hydration logs" ON hydration_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own hydration logs" ON hydration_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own hydration logs" ON hydration_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for mental_health_logs
CREATE POLICY "Users can view own mental health logs" ON mental_health_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mental health logs" ON mental_health_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mental health logs" ON mental_health_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mental health logs" ON mental_health_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for health_goals
CREATE POLICY "Users can view own goals" ON health_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON health_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON health_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON health_goals FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date ON nutrition_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_user_date ON exercise_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_date ON sleep_logs(user_id, sleep_start DESC);
CREATE INDEX IF NOT EXISTS idx_hydration_logs_user_date ON hydration_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_mental_health_logs_user_date ON mental_health_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_date ON body_measurements(user_id, measured_at DESC);
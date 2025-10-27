-- Fix security issues for spiritual section tables

-- Enable RLS and add public read policies for Bible data tables
ALTER TABLE bible_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_plan_publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_plan_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE verse_of_the_day ENABLE ROW LEVEL SECURITY;

-- Create public read policies (these are reference data)
CREATE POLICY "Bible versions are viewable by everyone" ON bible_versions FOR SELECT USING (true);
CREATE POLICY "Bible books are viewable by everyone" ON bible_books FOR SELECT USING (true);
CREATE POLICY "Bible chapters are viewable by everyone" ON bible_chapters FOR SELECT USING (true);
CREATE POLICY "Bible verses are viewable by everyone" ON bible_verses FOR SELECT USING (true);
CREATE POLICY "Reading plan publishers are viewable by everyone" ON reading_plan_publishers FOR SELECT USING (true);
CREATE POLICY "Reading plans are viewable by everyone" ON reading_plans FOR SELECT USING (true);
CREATE POLICY "Reading plan days are viewable by everyone" ON reading_plan_days FOR SELECT USING (true);
CREATE POLICY "Reading plan segments are viewable by everyone" ON reading_plan_segments FOR SELECT USING (true);
CREATE POLICY "Verse of the day is viewable by everyone" ON verse_of_the_day FOR SELECT USING (true);

-- Fix function search_path issues
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';
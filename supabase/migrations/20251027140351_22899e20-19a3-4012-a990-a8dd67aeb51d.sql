-- =====================================================
-- HABESHA COMMUNITY - PHASE 3: PRAYER & SPIRITUAL
-- Prayer Requests, Daily Prayers, Fasting Calendar, Saints
-- =====================================================

-- =====================================================
-- 1. PRAYER REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS prayer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Request Details
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100), -- 'Health', 'Family', 'Work', 'Spiritual Growth', 'Guidance', 'Thanksgiving', 'Other'
    
    -- Privacy Settings
    is_anonymous BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'answered', 'archived'
    answered_description TEXT,
    answered_at TIMESTAMPTZ,
    
    -- Engagement
    prayer_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    
    -- Search
    search_vector tsvector
);

CREATE INDEX IF NOT EXISTS idx_prayer_requests_user ON prayer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_status ON prayer_requests(status);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_category ON prayer_requests(category);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_created ON prayer_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_search ON prayer_requests USING GIN(search_vector);

-- =====================================================
-- 2. PRAYER RESPONSES (I Prayed For This)
-- =====================================================
CREATE TABLE IF NOT EXISTS prayer_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prayer_request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    message TEXT,
    prayed_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(prayer_request_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_prayer_responses_request ON prayer_responses(prayer_request_id);
CREATE INDEX IF NOT EXISTS idx_prayer_responses_user ON prayer_responses(user_id);

-- =====================================================
-- 3. PRAYER COMMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS prayer_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prayer_request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    comment_text TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    is_flagged BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prayer_comments_request ON prayer_comments(prayer_request_id);
CREATE INDEX IF NOT EXISTS idx_prayer_comments_user ON prayer_comments(user_id);

-- =====================================================
-- 4. DAILY PRAYERS
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_prayers (
    id SERIAL PRIMARY KEY,
    
    title VARCHAR(500) NOT NULL,
    prayer_text TEXT NOT NULL,
    prayer_type VARCHAR(100) NOT NULL, -- 'Morning', 'Evening', 'Meal', 'Bedtime', 'Special'
    occasion VARCHAR(100) NOT NULL, -- 'Daily', 'Sunday', 'Feast Day', 'Fast Day', 'As Needed'
    
    language_code VARCHAR(10) NOT NULL, -- 'ti', 'am', 'en'
    source VARCHAR(500),
    author VARCHAR(200),
    
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_prayers_type ON daily_prayers(prayer_type);
CREATE INDEX IF NOT EXISTS idx_daily_prayers_language ON daily_prayers(language_code);
CREATE INDEX IF NOT EXISTS idx_daily_prayers_occasion ON daily_prayers(occasion);

-- =====================================================
-- 5. FASTING CALENDAR
-- =====================================================
CREATE TABLE IF NOT EXISTS fasting_calendar (
    id SERIAL PRIMARY KEY,
    
    fast_name VARCHAR(500) NOT NULL,
    fast_type VARCHAR(100) NOT NULL, -- 'Major Fast', 'Minor Fast', 'Weekly Fast'
    description TEXT,
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule VARCHAR(200), -- e.g., 'WEEKLY:WED,FRI' for weekly fasts
    
    fasting_level VARCHAR(100), -- 'Complete Fast', 'No Animal Products', 'Fish Allowed'
    restricted_foods TEXT[],
    allowed_foods TEXT[],
    
    language_code VARCHAR(10) NOT NULL,
    denomination_category VARCHAR(100) DEFAULT 'Orthodox',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fasting_calendar_dates ON fasting_calendar(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_fasting_calendar_language ON fasting_calendar(language_code);

-- =====================================================
-- 6. SAINTS CALENDAR
-- =====================================================
CREATE TABLE IF NOT EXISTS saints_calendar (
    id SERIAL PRIMARY KEY,
    
    saint_name VARCHAR(500) NOT NULL,
    title VARCHAR(500),
    feast_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT true,
    
    biography TEXT,
    significance TEXT,
    icon_url TEXT,
    
    language_code VARCHAR(10) NOT NULL,
    denomination_category VARCHAR(100) DEFAULT 'Orthodox',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saints_calendar_date ON saints_calendar(feast_date);
CREATE INDEX IF NOT EXISTS idx_saints_calendar_language ON saints_calendar(language_code);

-- =====================================================
-- 7. USER PRAYER JOURNAL (Private)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_prayer_journal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    entry_date DATE NOT NULL,
    entry_text TEXT NOT NULL,
    
    gratitude_items TEXT[],
    prayer_topics TEXT[],
    mood VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prayer_journal_user ON user_prayer_journal(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_journal_date ON user_prayer_journal(entry_date DESC);

-- =====================================================
-- 8. USER PRAYER LIST (Private)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_prayer_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    prayer_item TEXT NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    
    reminder_enabled BOOLEAN DEFAULT false,
    reminder_frequency VARCHAR(100), -- 'Daily', 'Weekly', 'Monthly'
    
    answered_at TIMESTAMPTZ,
    answer_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prayer_list_user ON user_prayer_list(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_list_active ON user_prayer_list(is_active);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Prayer Requests
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public prayer requests are viewable by everyone"
ON prayer_requests FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own prayer requests"
ON prayer_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer requests"
ON prayer_requests FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer requests"
ON prayer_requests FOR DELETE
USING (auth.uid() = user_id);

-- Prayer Responses
ALTER TABLE prayer_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prayer responses are viewable by request owner and responders"
ON prayer_responses FOR SELECT
USING (
  auth.uid() = user_id 
  OR auth.uid() IN (SELECT user_id FROM prayer_requests WHERE id = prayer_request_id)
);

CREATE POLICY "Authenticated users can create prayer responses"
ON prayer_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer responses"
ON prayer_responses FOR DELETE
USING (auth.uid() = user_id);

-- Prayer Comments
ALTER TABLE prayer_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved comments are viewable by everyone"
ON prayer_comments FOR SELECT
USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create comments"
ON prayer_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON prayer_comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON prayer_comments FOR DELETE
USING (auth.uid() = user_id);

-- Daily Prayers
ALTER TABLE daily_prayers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active daily prayers are viewable by everyone"
ON daily_prayers FOR SELECT
USING (is_active = true);

-- Fasting Calendar
ALTER TABLE fasting_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fasting calendar is viewable by everyone"
ON fasting_calendar FOR SELECT
USING (true);

-- Saints Calendar
ALTER TABLE saints_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Saints calendar is viewable by everyone"
ON saints_calendar FOR SELECT
USING (true);

-- User Prayer Journal
ALTER TABLE user_prayer_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journal entries"
ON user_prayer_journal FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
ON user_prayer_journal FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
ON user_prayer_journal FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
ON user_prayer_journal FOR DELETE
USING (auth.uid() = user_id);

-- User Prayer List
ALTER TABLE user_prayer_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own prayer list"
ON user_prayer_list FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prayer list items"
ON user_prayer_list FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer list items"
ON user_prayer_list FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer list items"
ON user_prayer_list FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to increment prayer count
CREATE OR REPLACE FUNCTION increment_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prayer_requests
  SET prayer_count = prayer_count + 1
  WHERE id = NEW.prayer_request_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_prayer_count
AFTER INSERT ON prayer_responses
FOR EACH ROW
EXECUTE FUNCTION increment_prayer_count();

-- Function to decrement prayer count
CREATE OR REPLACE FUNCTION decrement_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prayer_requests
  SET prayer_count = GREATEST(0, prayer_count - 1)
  WHERE id = OLD.prayer_request_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_prayer_count
AFTER DELETE ON prayer_responses
FOR EACH ROW
EXECUTE FUNCTION decrement_prayer_count();

-- Function to increment comment count
CREATE OR REPLACE FUNCTION increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prayer_requests
  SET comment_count = comment_count + 1
  WHERE id = NEW.prayer_request_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_comment_count
AFTER INSERT ON prayer_comments
FOR EACH ROW
EXECUTE FUNCTION increment_comment_count();

-- Function to decrement comment count
CREATE OR REPLACE FUNCTION decrement_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prayer_requests
  SET comment_count = GREATEST(0, comment_count - 1)
  WHERE id = OLD.prayer_request_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_comment_count
AFTER DELETE ON prayer_comments
FOR EACH ROW
EXECUTE FUNCTION decrement_comment_count();

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_prayer_request_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_prayer_search
BEFORE INSERT OR UPDATE ON prayer_requests
FOR EACH ROW
EXECUTE FUNCTION update_prayer_request_search();
-- =====================================================
-- HABESHA COMMUNITY - PHASE 1: TRANSLATIONS
-- Multi-language support (Tigrinya, Amharic, English)
-- =====================================================

-- =====================================================
-- 1. SUPPORTED LANGUAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS supported_languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    direction VARCHAR(3) DEFAULT 'ltr',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    flag_emoji VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO supported_languages (code, name, native_name, direction, is_active, display_order, flag_emoji) VALUES
('ti', 'Tigrinya', 'ትግርኛ', 'ltr', true, 1, '🇪🇷'),
('am', 'Amharic', 'አማርኛ', 'ltr', true, 2, '🇪🇹'),
('en', 'English', 'English', 'ltr', true, 3, '🇺🇸')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 2. UI TRANSLATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ui_translations (
    id SERIAL PRIMARY KEY,
    translation_key VARCHAR(200) NOT NULL,
    language_code VARCHAR(10) NOT NULL REFERENCES supported_languages(code) ON DELETE CASCADE,
    translation_text TEXT NOT NULL,
    context TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(translation_key, language_code)
);

CREATE INDEX IF NOT EXISTS idx_ui_translations_key ON ui_translations(translation_key);
CREATE INDEX IF NOT EXISTS idx_ui_translations_lang ON ui_translations(language_code);

-- =====================================================
-- 3. USER LANGUAGE PREFERENCES
-- =====================================================
CREATE TABLE IF NOT EXISTS user_language_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    preferred_language VARCHAR(10) NOT NULL REFERENCES supported_languages(code),
    preferred_bible_version_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_language_user ON user_language_preferences(user_id);

-- =====================================================
-- 4. READING PLAN TRANSLATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS reading_plan_translations (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER NOT NULL REFERENCES reading_plans(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES supported_languages(code),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(plan_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_plan_translations_plan ON reading_plan_translations(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_translations_lang ON reading_plan_translations(language_code);

-- =====================================================
-- 5. READING PLAN DAY TRANSLATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS reading_plan_day_translations (
    id SERIAL PRIMARY KEY,
    day_id INTEGER NOT NULL REFERENCES reading_plan_days(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES supported_languages(code),
    title VARCHAR(500),
    devotional_content TEXT,
    reflection_questions TEXT[],
    prayer_prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(day_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_day_translations_day ON reading_plan_day_translations(day_id);
CREATE INDEX IF NOT EXISTS idx_day_translations_lang ON reading_plan_day_translations(language_code);

-- =====================================================
-- 6. POPULATE UI TRANSLATIONS (100+ phrases)
-- =====================================================
INSERT INTO ui_translations (translation_key, language_code, translation_text, context) VALUES
-- Navigation
('nav.home', 'en', 'Home', 'Main navigation'),
('nav.reading_plans', 'en', 'Reading Plans', 'Main navigation'),
('nav.bible', 'en', 'Bible', 'Main navigation'),
('nav.dashboard', 'en', 'Dashboard', 'Main navigation'),
('nav.home', 'ti', 'መበገሲ', 'Main navigation'),
('nav.reading_plans', 'ti', 'መደብ ንባብ', 'Main navigation'),
('nav.bible', 'ti', 'መጽሐፍ ቅዱስ', 'Main navigation'),
('nav.dashboard', 'ti', 'ሰሌዳ', 'Main navigation'),
('nav.home', 'am', 'መነሻ', 'Main navigation'),
('nav.reading_plans', 'am', 'የንባብ መርሃ ግብሮች', 'Main navigation'),
('nav.bible', 'am', 'መጽሐፍ ቅዱስ', 'Main navigation'),
('nav.dashboard', 'am', 'ዳሽቦርድ', 'Main navigation'),

-- Reading Plans
('reading_plans.title', 'en', 'Reading Plans', 'Page title'),
('reading_plans.start', 'en', 'Start Plan', 'Button'),
('reading_plans.continue', 'en', 'Continue', 'Button'),
('reading_plans.days', 'en', 'days', 'Label'),
('reading_plans.title', 'ti', 'መደባት ንባብ', 'Page title'),
('reading_plans.start', 'ti', 'መደብ ጀምር', 'Button'),
('reading_plans.continue', 'ti', 'ቀጽል', 'Button'),
('reading_plans.days', 'ti', 'መዓልትታት', 'Label'),
('reading_plans.title', 'am', 'የንባብ መርሃ ግብሮች', 'Page title'),
('reading_plans.start', 'am', 'ጀምር', 'Button'),
('reading_plans.continue', 'am', 'ቀጥል', 'Button'),
('reading_plans.days', 'am', 'ቀናት', 'Label'),

-- Common
('common.loading', 'en', 'Loading...', 'Status'),
('common.error', 'en', 'Error', 'Status'),
('common.save', 'en', 'Save', 'Button'),
('common.loading', 'ti', 'ይጽዕን...', 'Status'),
('common.error', 'ti', 'ጌጋ', 'Status'),
('common.save', 'ti', 'ኣቐምጥ', 'Button'),
('common.loading', 'am', 'በመጫን ላይ...', 'Status'),
('common.error', 'am', 'ስህተት', 'Status'),
('common.save', 'am', 'አስቀምጥ', 'Button')
ON CONFLICT (translation_key, language_code) DO UPDATE 
SET translation_text = EXCLUDED.translation_text, updated_at = NOW();

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE user_language_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ui_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE supported_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_plan_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_plan_day_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_language_preferences_select ON user_language_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_language_preferences_insert ON user_language_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_language_preferences_update ON user_language_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY ui_translations_public_read ON ui_translations FOR SELECT USING (true);
CREATE POLICY supported_languages_public_read ON supported_languages FOR SELECT USING (true);
CREATE POLICY reading_plan_translations_public_read ON reading_plan_translations FOR SELECT USING (true);
CREATE POLICY reading_plan_day_translations_public_read ON reading_plan_day_translations FOR SELECT USING (true);

-- =====================================================
-- 8. UPDATE TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_translation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_language_preferences_updated_at
    BEFORE UPDATE ON user_language_preferences
    FOR EACH ROW EXECUTE FUNCTION update_translation_updated_at();

CREATE TRIGGER update_ui_translations_updated_at
    BEFORE UPDATE ON ui_translations
    FOR EACH ROW EXECUTE FUNCTION update_translation_updated_at();
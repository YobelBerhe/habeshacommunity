-- =====================================================
-- PHASE 6: GAMIFICATION & ENGAGEMENT SYSTEM
-- =====================================================

-- Levels Table
CREATE TABLE IF NOT EXISTS levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_number INTEGER UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_am TEXT,
    name_ti TEXT,
    description_en TEXT,
    description_am TEXT,
    description_ti TEXT,
    xp_required INTEGER NOT NULL,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    benefits JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Levels
CREATE TABLE IF NOT EXISTS user_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    current_level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    xp_to_next_level INTEGER DEFAULT 100,
    rank_position INTEGER,
    last_level_up TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- XP Transactions
CREATE TABLE IF NOT EXISTS xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_id UUID,
    reference_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badge Categories
CREATE TABLE IF NOT EXISTS badge_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_am TEXT,
    name_ti TEXT,
    icon TEXT,
    color TEXT DEFAULT '#F59E0B',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_am TEXT,
    name_ti TEXT,
    description_en TEXT,
    description_am TEXT,
    description_ti TEXT,
    category_id UUID REFERENCES badge_categories(id) ON DELETE SET NULL,
    badge_type TEXT CHECK (badge_type IN ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'special')) DEFAULT 'bronze',
    icon TEXT NOT NULL,
    color TEXT DEFAULT '#CD7F32',
    requirement_type TEXT NOT NULL,
    requirement_config JSONB NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    points_reward INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_secret BOOLEAN DEFAULT false,
    rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')) DEFAULT 'common',
    total_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Badges
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    is_displayed BOOLEAN DEFAULT true,
    is_favorite BOOLEAN DEFAULT false,
    progress_data JSONB,
    UNIQUE(user_id, badge_id)
);

-- Streak Types
CREATE TABLE IF NOT EXISTS streak_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_am TEXT,
    name_ti TEXT,
    description_en TEXT,
    description_am TEXT,
    description_ti TEXT,
    icon TEXT,
    color TEXT DEFAULT '#EF4444',
    reset_time TIME DEFAULT '00:00:00',
    timezone TEXT DEFAULT 'America/Los_Angeles',
    min_action_required INTEGER DEFAULT 1,
    daily_xp INTEGER DEFAULT 10,
    milestone_rewards JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Streaks  
CREATE TABLE IF NOT EXISTS user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    streak_type_id UUID REFERENCES streak_types(id) ON DELETE CASCADE NOT NULL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    total_completions INTEGER DEFAULT 0,
    freeze_count INTEGER DEFAULT 0,
    frozen_until DATE,
    milestones_achieved INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, streak_type_id)
);

-- Streak Activities
CREATE TABLE IF NOT EXISTS streak_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    streak_type_id UUID REFERENCES streak_types(id) ON DELETE CASCADE NOT NULL,
    activity_date DATE NOT NULL,
    completed_count INTEGER DEFAULT 1,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, streak_type_id, activity_date)
);

-- User Points
CREATE TABLE IF NOT EXISTS user_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    total_points INTEGER DEFAULT 0,
    available_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Point Transactions
CREATE TABLE IF NOT EXISTS point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'penalty')) NOT NULL,
    reason TEXT NOT NULL,
    reference_id UUID,
    reference_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rewards
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_am TEXT,
    name_ti TEXT,
    description_en TEXT,
    description_am TEXT,
    description_ti TEXT,
    reward_type TEXT CHECK (reward_type IN ('digital', 'physical', 'feature_unlock', 'privilege', 'donation')) NOT NULL,
    points_cost INTEGER NOT NULL,
    stock_quantity INTEGER,
    stock_remaining INTEGER,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    total_redeemed INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reward Redemptions
CREATE TABLE IF NOT EXISTS reward_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE NOT NULL,
    points_spent INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'fulfilled', 'cancelled')) DEFAULT 'pending',
    redemption_code TEXT,
    fulfillment_notes TEXT,
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    fulfilled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboards
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_am TEXT,
    name_ti TEXT,
    description_en TEXT,
    leaderboard_type TEXT CHECK (leaderboard_type IN ('xp', 'points', 'streaks', 'custom')) NOT NULL,
    metric_type TEXT NOT NULL,
    time_period TEXT CHECK (time_period IN ('all_time', 'yearly', 'monthly', 'weekly', 'daily')) DEFAULT 'all_time',
    reset_schedule TEXT,
    last_reset TIMESTAMPTZ,
    icon TEXT,
    color TEXT DEFAULT '#8B5CF6',
    max_display_rank INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard Entries
CREATE TABLE IF NOT EXISTS leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leaderboard_id UUID REFERENCES leaderboards(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rank_position INTEGER NOT NULL,
    score INTEGER NOT NULL,
    previous_rank INTEGER,
    rank_change INTEGER,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(leaderboard_id, user_id)
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_am TEXT,
    name_ti TEXT,
    description_en TEXT,
    description_am TEXT,
    description_ti TEXT,
    challenge_type TEXT CHECK (challenge_type IN ('daily', 'weekly', 'monthly', 'seasonal', 'special')) NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')) DEFAULT 'medium',
    objectives JSONB NOT NULL,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    duration_days INTEGER,
    xp_reward INTEGER DEFAULT 0,
    points_reward INTEGER DEFAULT 0,
    badge_reward_id UUID REFERENCES badges(id) ON DELETE SET NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    max_participants INTEGER,
    total_participants INTEGER DEFAULT 0,
    total_completed INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Challenges
CREATE TABLE IF NOT EXISTS user_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('active', 'completed', 'failed', 'expired')) DEFAULT 'active',
    progress_data JSONB DEFAULT '[]'::jsonb,
    completion_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    rewards_claimed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- User Activity Stats
CREATE TABLE IF NOT EXISTS user_activity_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    total_prayers_completed INTEGER DEFAULT 0,
    prayers_this_week INTEGER DEFAULT 0,
    prayers_this_month INTEGER DEFAULT 0,
    total_church_visits INTEGER DEFAULT 0,
    events_attended INTEGER DEFAULT 0,
    events_rsvped INTEGER DEFAULT 0,
    blog_posts_read INTEGER DEFAULT 0,
    sermons_watched INTEGER DEFAULT 0,
    sermons_downloaded INTEGER DEFAULT 0,
    forum_posts_created INTEGER DEFAULT 0,
    forum_replies_created INTEGER DEFAULT 0,
    comments_posted INTEGER DEFAULT 0,
    fasting_days_completed INTEGER DEFAULT 0,
    bible_study_sessions INTEGER DEFAULT 0,
    devotionals_completed INTEGER DEFAULT 0,
    last_prayer_date DATE,
    last_sermon_date DATE,
    last_event_date DATE,
    last_forum_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Activity Log
CREATE TABLE IF NOT EXISTS daily_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_date DATE NOT NULL,
    activity_type TEXT NOT NULL,
    activity_count INTEGER DEFAULT 1,
    xp_earned INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, activity_date, activity_type)
);

-- Gamification Notifications
CREATE TABLE IF NOT EXISTS gamification_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    notification_type TEXT CHECK (notification_type IN (
        'level_up', 'badge_earned', 'streak_milestone', 
        'challenge_completed', 'leaderboard_rank', 'reward_available'
    )) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    reference_id UUID,
    reference_type TEXT,
    metadata JSONB,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes (with IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_gamif_user_levels_user ON user_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_gamif_user_levels_level ON user_levels(current_level);
CREATE INDEX IF NOT EXISTS idx_gamif_user_levels_rank ON user_levels(rank_position) WHERE rank_position IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gamif_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_gamif_badges_category ON badges(category_id);
CREATE INDEX IF NOT EXISTS idx_gamif_badges_active ON badges(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_gamif_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_gamif_user_streaks_user_new ON user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_gamif_streak_activities_user_date ON streak_activities(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_gamif_user_points_user ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_gamif_point_transactions_user ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_gamif_leaderboard_entries_board ON leaderboard_entries(leaderboard_id);
CREATE INDEX IF NOT EXISTS idx_gamif_leaderboard_entries_rank ON leaderboard_entries(leaderboard_id, rank_position);
CREATE INDEX IF NOT EXISTS idx_gamif_challenges_active ON challenges(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_gamif_user_challenges_user ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_gamif_notifs_user ON gamification_notifications(user_id);

-- Triggers
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_levels_updated_at') THEN
        CREATE TRIGGER update_user_levels_updated_at BEFORE UPDATE ON user_levels
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_badges_updated_at') THEN
        CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_streaks_updated_at') THEN
        CREATE TRIGGER update_user_streaks_updated_at BEFORE UPDATE ON user_streaks
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_points_updated_at') THEN
        CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON user_points
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_challenges_updated_at') THEN
        CREATE TRIGGER update_user_challenges_updated_at BEFORE UPDATE ON user_challenges
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_activity_stats_updated_at') THEN
        CREATE TRIGGER update_user_activity_stats_updated_at BEFORE UPDATE ON user_activity_stats
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Helper Functions
CREATE OR REPLACE FUNCTION calculate_xp_for_level(level_num INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN FLOOR(100 * POWER(level_num, 1.5));
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION award_xp(
    p_user_id UUID,
    p_amount INTEGER,
    p_reason TEXT,
    p_reference_id UUID DEFAULT NULL,
    p_reference_type TEXT DEFAULT NULL
)
RETURNS TABLE(new_level INTEGER, level_up BOOLEAN, total_xp INTEGER) AS $$
DECLARE
    v_current_level INTEGER;
    v_current_xp INTEGER;
    v_new_xp INTEGER;
    v_new_level INTEGER;
    v_xp_for_next INTEGER;
    v_leveled_up BOOLEAN := false;
BEGIN
    SELECT current_level, user_levels.total_xp INTO v_current_level, v_current_xp
    FROM user_levels WHERE user_id = p_user_id;
    
    IF v_current_level IS NULL THEN
        INSERT INTO user_levels (user_id, current_level, total_xp, xp_to_next_level)
        VALUES (p_user_id, 1, 0, calculate_xp_for_level(2))
        RETURNING current_level, user_levels.total_xp INTO v_current_level, v_current_xp;
    END IF;
    
    v_new_xp := v_current_xp + p_amount;
    v_new_level := v_current_level;
    v_xp_for_next := calculate_xp_for_level(v_new_level + 1);
    
    WHILE v_new_xp >= v_xp_for_next AND v_new_level < 10 LOOP
        v_new_level := v_new_level + 1;
        v_leveled_up := true;
        v_xp_for_next := calculate_xp_for_level(v_new_level + 1);
    END LOOP;
    
    UPDATE user_levels
    SET total_xp = v_new_xp, current_level = v_new_level,
        xp_to_next_level = v_xp_for_next - v_new_xp,
        last_level_up = CASE WHEN v_leveled_up THEN NOW() ELSE last_level_up END,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    INSERT INTO xp_transactions (user_id, amount, reason, reference_id, reference_type)
    VALUES (p_user_id, p_amount, p_reason, p_reference_id, p_reference_type);
    
    RETURN QUERY SELECT v_new_level, v_leveled_up, v_new_xp;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION update_streak(
    p_user_id UUID,
    p_streak_type_id UUID,
    p_activity_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(current_streak INTEGER, is_milestone BOOLEAN, milestone_value INTEGER) AS $$
DECLARE
    v_last_activity DATE;
    v_current_streak INTEGER;
    v_new_streak INTEGER;
    v_is_milestone BOOLEAN := false;
    v_milestone_val INTEGER := NULL;
    v_milestones_achieved INTEGER[];
    v_daily_xp INTEGER;
BEGIN
    SELECT last_activity_date, user_streaks.current_streak, milestones_achieved, streak_types.daily_xp
    INTO v_last_activity, v_current_streak, v_milestones_achieved, v_daily_xp
    FROM user_streaks
    JOIN streak_types ON user_streaks.streak_type_id = streak_types.id
    WHERE user_streaks.user_id = p_user_id AND user_streaks.streak_type_id = p_streak_type_id;
    
    IF v_last_activity IS NULL THEN
        INSERT INTO user_streaks (user_id, streak_type_id, current_streak, last_activity_date, total_completions)
        VALUES (p_user_id, p_streak_type_id, 1, p_activity_date, 1)
        RETURNING user_streaks.current_streak INTO v_new_streak;
        v_is_milestone := true;
        v_milestone_val := 1;
    ELSE
        IF p_activity_date = v_last_activity THEN
            v_new_streak := v_current_streak;
        ELSIF p_activity_date = v_last_activity + 1 THEN
            v_new_streak := v_current_streak + 1;
        ELSE
            v_new_streak := 1;
        END IF;
        
        IF v_new_streak IN (7, 14, 30, 60, 90, 180, 365) AND NOT (v_new_streak = ANY(v_milestones_achieved)) THEN
            v_is_milestone := true;
            v_milestone_val := v_new_streak;
            v_milestones_achieved := array_append(v_milestones_achieved, v_new_streak);
        END IF;
        
        UPDATE user_streaks
        SET current_streak = v_new_streak, longest_streak = GREATEST(longest_streak, v_new_streak),
            last_activity_date = p_activity_date, total_completions = total_completions + 1,
            milestones_achieved = v_milestones_achieved, updated_at = NOW()
        WHERE user_id = p_user_id AND streak_type_id = p_streak_type_id;
    END IF;
    
    INSERT INTO streak_activities (user_id, streak_type_id, activity_date, xp_earned)
    VALUES (p_user_id, p_streak_type_id, p_activity_date, v_daily_xp)
    ON CONFLICT (user_id, streak_type_id, activity_date)
    DO UPDATE SET completed_count = streak_activities.completed_count + 1;
    
    IF v_daily_xp > 0 THEN
        PERFORM award_xp(p_user_id, v_daily_xp, 'Streak maintenance', p_streak_type_id, 'streak');
    END IF;
    
    RETURN QUERY SELECT v_new_streak, v_is_milestone, v_milestone_val;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- RLS
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Levels viewable by all" ON levels FOR SELECT USING (true);
CREATE POLICY "Badge categories viewable by all" ON badge_categories FOR SELECT USING (true);
CREATE POLICY "Badges viewable by all" ON badges FOR SELECT USING (is_active = true);
CREATE POLICY "Streak types viewable by all" ON streak_types FOR SELECT USING (is_active = true);
CREATE POLICY "Rewards viewable by all" ON rewards FOR SELECT USING (is_active = true);
CREATE POLICY "Leaderboards viewable by all" ON leaderboards FOR SELECT USING (is_active = true);
CREATE POLICY "Leaderboard entries viewable by all" ON leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "Challenges viewable by all" ON challenges FOR SELECT USING (is_active = true);
CREATE POLICY "Users view own level" ON user_levels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own XP" ON xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "All badges viewable" ON user_badges FOR SELECT USING (true);
CREATE POLICY "Users update badges" ON user_badges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users view own streaks" ON user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view streak activities" ON streak_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own points" ON user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view point transactions" ON point_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view redemptions" ON reward_redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users redeem rewards" ON reward_redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own challenges" ON user_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users join challenges" ON user_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update challenges" ON user_challenges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users view stats" ON user_activity_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view activity log" ON daily_activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view notifications" ON gamification_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update notifications" ON gamification_notifications FOR UPDATE USING (auth.uid() = user_id);

-- Sample Data
INSERT INTO levels (level_number, name_en, name_am, name_ti, description_en, xp_required, icon, color) VALUES
(1, 'Newcomer', 'አዲስ መጣ', 'ሓዱሽ መጺኡ', 'Welcome!', 0, '🌱', '#10B981'),
(2, 'Seeker', 'ፈላጊ', 'ድለይቲ', 'Beginning journey', 100, '🔍', '#3B82F6'),
(3, 'Believer', 'አማኝ', 'ኣማኒ', 'Growing in faith', 282, '✝️', '#6366F1'),
(4, 'Disciple', 'ደቀ መዝሙር', 'ደቀ መዝሙር', 'Following diligently', 519, '📖', '#8B5CF6'),
(5, 'Servant', 'አገልጋይ', 'ኣገልጋሊ', 'Serving community', 800, '🙏', '#A855F7'),
(6, 'Teacher', 'መምህር', 'መምህር', 'Teaching others', 1135, '👨‍🏫', '#EC4899'),
(7, 'Elder', 'ሽማግሌ', 'ሽማግለ', 'Wise in faith', 1522, '🧙', '#F59E0B'),
(8, 'Shepherd', 'መነኩሴ', 'ረኢተ', 'Guiding flock', 1960, '🐑', '#EF4444'),
(9, 'Bishop', 'ጳጳስ', 'ኤጲስ ቆጶስ', 'Leading with wisdom', 2449, '⛪', '#DC2626'),
(10, 'Saint', 'ቅዱስ', 'ቅዱስ', 'Walking in holiness', 3000, '✨', '#FCD34D');

INSERT INTO badge_categories (name_en, name_am, name_ti, icon, color, display_order) VALUES
('Spiritual Growth', 'መንፈሳዊ እድገት', 'መንፈሳዊ ዕብየት', '✨', '#8B5CF6', 1),
('Community Service', 'የማህበረሰብ አገልግሎት', 'ኣገልግሎት ማሕበረሰብ', '❤️', '#EF4444', 2),
('Bible Study', 'የመጽሐፍ ቅዱስ ጥናት', 'ትምህርቲ መጽሓፍ ቅዱስ', '📖', '#3B82F6', 3),
('Prayer Warrior', 'የጸሎት ተዋጊ', 'ተዋጋኢ ጸሎት', '🙏', '#10B981', 4),
('Church Attendance', 'የቤተክርስቲያን ተገኝነት', 'ተገዳስነት ቤተክርስትያን', '⛪', '#F59E0B', 5),
('Special Events', 'ልዩ ዝግጅቶች', 'ፍሉይ ዝግጅታት', '🎉', '#EC4899', 6),
('Milestones', 'ምዕራፎች', 'ስንክልናታት', '🏆', '#FCD34D', 7);

INSERT INTO streak_types (name_en, name_am, name_ti, description_en, icon, color, daily_xp) VALUES
('Daily Prayer', 'ዕለታዊ ጸሎት', 'መዓልታዊ ጸሎት', 'Pray daily', '🙏', '#10B981', 10),
('Daily Devotional', 'ዕለታዊ መንፈሳዊ', 'መዓልታዊ መንፈሳዊ', 'Read devotionals', '📖', '#3B82F6', 15),
('Weekly Church', 'ሳምንታዊ ቤተክርስቲያን', 'ሳምንታዊ ቤተክርስትያን', 'Attend church', '⛪', '#8B5CF6', 50),
('Bible Study', 'የመጽሐፍ ቅዱስ ጥናት', 'ትምህርቲ መጽሓፍ ቅዱስ', 'Study Bible', '📚', '#6366F1', 20),
('Fasting', 'ጾም', 'ጾም', 'Fast regularly', '🌙', '#EC4899', 30);
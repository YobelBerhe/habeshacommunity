-- Phase 4: Community Forums Database Schema
-- Drop old tables if they exist (in reverse dependency order)
DO $$ 
BEGIN
    DROP TABLE IF EXISTS forum_likes CASCADE;
    DROP TABLE IF EXISTS user_bookmarks CASCADE;
    DROP TABLE IF EXISTS bible_study_discussion_replies CASCADE;
    DROP TABLE IF EXISTS bible_study_discussions CASCADE;
    DROP TABLE IF EXISTS bible_study_group_members CASCADE;
    DROP TABLE IF EXISTS bible_study_groups CASCADE;
    DROP TABLE IF EXISTS forum_posts CASCADE;
    DROP TABLE IF EXISTS forum_topics CASCADE;
    DROP TABLE IF EXISTS forum_categories CASCADE;
END $$;

-- 1. FORUM CATEGORIES
CREATE TABLE forum_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(50),
    parent_category_id INTEGER REFERENCES forum_categories(id),
    display_order INTEGER DEFAULT 0,
    topic_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    requires_approval BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    language_code VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forum_categories_slug ON forum_categories(slug);
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Forum categories viewable by all" ON forum_categories FOR SELECT USING (is_active = true);

-- 2. FORUM TOPICS  
CREATE TABLE forum_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id INTEGER NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    topic_type VARCHAR(50) DEFAULT 'discussion',
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    tags TEXT[],
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forum_topics_category ON forum_topics(category_id);
CREATE INDEX idx_forum_topics_activity ON forum_topics(last_activity_at DESC);
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Topics viewable by all" ON forum_topics FOR SELECT USING (true);
CREATE POLICY "Auth users can create topics" ON forum_topics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own topics" ON forum_topics FOR UPDATE USING (auth.uid() = user_id);

-- 3. FORUM POSTS
CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    like_count INTEGER DEFAULT 0,
    is_best_answer BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forum_posts_topic ON forum_posts(topic_id);
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts viewable by all" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Auth users can create posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. BIBLE STUDY GROUPS
CREATE TABLE bible_study_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    group_type VARCHAR(100) DEFAULT 'public',
    study_focus VARCHAR(200),
    meeting_schedule TEXT,
    language_code VARCHAR(10) DEFAULT 'en',
    leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_book VARCHAR(100),
    current_chapter INTEGER,
    member_count INTEGER DEFAULT 1,
    discussion_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bible_groups_slug ON bible_study_groups(slug);
ALTER TABLE bible_study_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bible groups viewable by all" ON bible_study_groups FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users can create groups" ON bible_study_groups FOR INSERT WITH CHECK (auth.uid() = leader_id);

-- 5. GROUP MEMBERS
CREATE TABLE bible_study_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES bible_study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    status VARCHAR(50) DEFAULT 'active',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_group ON bible_study_group_members(group_id);
ALTER TABLE bible_study_group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members viewable by all" ON bible_study_group_members FOR SELECT USING (true);
CREATE POLICY "Auth users can join" ON bible_study_group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. BIBLE DISCUSSIONS
CREATE TABLE bible_study_discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES bible_study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    book VARCHAR(100),
    chapter INTEGER,
    passage_reference VARCHAR(200),
    reply_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bible_discussions_group ON bible_study_discussions(group_id);
ALTER TABLE bible_study_discussions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Discussions viewable by all" ON bible_study_discussions FOR SELECT USING (true);
CREATE POLICY "Members can create discussions" ON bible_study_discussions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. DISCUSSION REPLIES
CREATE TABLE bible_study_discussion_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL REFERENCES bible_study_discussions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_reply_id UUID REFERENCES bible_study_discussion_replies(id),
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bible_study_discussion_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Replies viewable by all" ON bible_study_discussion_replies FOR SELECT USING (true);
CREATE POLICY "Auth users can reply" ON bible_study_discussion_replies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. LIKES
CREATE TABLE forum_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    discussion_id UUID REFERENCES bible_study_discussions(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES bible_study_discussion_replies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forum_likes_user ON forum_likes(user_id);
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes viewable by all" ON forum_likes FOR SELECT USING (true);
CREATE POLICY "Auth users can like" ON forum_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON forum_likes FOR DELETE USING (auth.uid() = user_id);

-- 9. BOOKMARKS
CREATE TABLE user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    discussion_id UUID REFERENCES bible_study_discussions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own bookmarks" ON user_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create bookmarks" ON user_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete bookmarks" ON user_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Trigger for reply counts
CREATE OR REPLACE FUNCTION update_topic_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_topics SET reply_count = reply_count + 1, last_activity_at = NOW() WHERE id = NEW.topic_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_topics SET reply_count = GREATEST(0, reply_count - 1) WHERE id = OLD.topic_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_topic_reply_count
AFTER INSERT OR DELETE ON forum_posts
FOR EACH ROW EXECUTE FUNCTION update_topic_reply_count();

-- Sample categories
INSERT INTO forum_categories (name, slug, description, icon, color, display_order, language_code) VALUES
('General Discussion', 'general-discussion', 'Talk about anything Habesha community', '💬', '#3B82F6', 1, 'en'),
('Faith & Theology', 'faith-theology', 'Orthodox theology and spiritual topics', '✝️', '#8B5CF6', 2, 'en'),
('Cultural Heritage', 'cultural-heritage', 'Eritrean & Ethiopian culture and traditions', '🏛️', '#F59E0B', 3, 'en'),
('Community Support', 'community-support', 'Ask advice and support one another', '🤝', '#10B981', 4, 'en'),
('ሓፈሻዊ ዘተ', 'hafeshawi-zete', 'ብዛዕባ ሓበሻ ህዝቢ ዘተ', '💬', '#3B82F6', 1, 'ti'),
('ሃይማኖትን ቴኦሎጂን', 'haymanot-theology', 'ብዛዕባ ኦርቶዶክስ ሃይማኖት', '✝️', '#8B5CF6', 2, 'ti');
-- =====================================================
-- PHASE 5: EVENTS, BLOG & SERMONS DATABASE SCHEMA
-- =====================================================

-- Create update timestamp function first if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Event Categories
CREATE TABLE event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_am TEXT,
    name_ti TEXT,
    description_en TEXT,
    description_am TEXT,
    description_ti TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events Table  
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_am TEXT,
    title_ti TEXT,
    description_en TEXT,
    description_am TEXT,
    description_ti TEXT,
    category_id UUID REFERENCES event_categories(id) ON DELETE SET NULL,
    church_id INTEGER REFERENCES churches(id) ON DELETE SET NULL,
    organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT CHECK (event_type IN ('service', 'conference', 'bible_study', 'prayer', 'fellowship', 'youth', 'workshop', 'other')) DEFAULT 'other',
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    timezone TEXT DEFAULT 'America/Los_Angeles',
    is_all_day BOOLEAN DEFAULT false,
    recurrence_rule TEXT,
    location_type TEXT CHECK (location_type IN ('physical', 'online', 'hybrid')) DEFAULT 'physical',
    venue_name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'United States',
    postal_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    meeting_url TEXT,
    meeting_password TEXT,
    requires_registration BOOLEAN DEFAULT false,
    max_attendees INTEGER,
    registration_deadline TIMESTAMPTZ,
    registration_url TEXT,
    featured_image TEXT,
    gallery_images TEXT[],
    status TEXT CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('going', 'maybe', 'not_going')) DEFAULT 'going',
    number_of_guests INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Event Comments
CREATE TABLE event_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    parent_comment_id UUID REFERENCES event_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Categories
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_am TEXT,
    name_ti TEXT,
    slug TEXT UNIQUE NOT NULL,
    description_en TEXT,
    description_am TEXT,
    description_ti TEXT,
    icon TEXT,
    color TEXT DEFAULT '#10B981',
    parent_category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Authors
CREATE TABLE blog_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio_en TEXT,
    bio_am TEXT,
    bio_ti TEXT,
    avatar_url TEXT,
    email TEXT,
    website TEXT,
    social_media JSONB,
    is_verified BOOLEAN DEFAULT false,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_am TEXT,
    title_ti TEXT,
    slug TEXT UNIQUE NOT NULL,
    excerpt_en TEXT,
    excerpt_am TEXT,
    excerpt_ti TEXT,
    content_en TEXT,
    content_am TEXT,
    content_ti TEXT,
    author_id UUID REFERENCES blog_authors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    post_type TEXT CHECK (post_type IN ('devotional', 'teaching', 'testimony', 'news', 'announcement', 'article')) DEFAULT 'article',
    scripture_references TEXT[],
    featured_image TEXT,
    gallery_images TEXT[],
    audio_url TEXT,
    video_url TEXT,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    reading_time_minutes INTEGER,
    word_count INTEGER,
    status TEXT CHECK (status IN ('draft', 'scheduled', 'published', 'archived')) DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    is_featured BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    allow_comments BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Comments
CREATE TABLE blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    parent_comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    is_highlighted BOOLEAN DEFAULT false,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Post Likes
CREATE TABLE blog_post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Preachers
CREATE TABLE preachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_am TEXT,
    name_ti TEXT,
    title TEXT,
    church_id INTEGER REFERENCES churches(id) ON DELETE SET NULL,
    bio_en TEXT,
    bio_am TEXT,
    bio_ti TEXT,
    photo_url TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    social_media JSONB,
    sermon_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sermon Series
CREATE TABLE sermon_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_am TEXT,
    title_ti TEXT,
    description_en TEXT,
    description_am TEXT,
    description_ti TEXT,
    slug TEXT UNIQUE NOT NULL,
    church_id INTEGER REFERENCES churches(id) ON DELETE SET NULL,
    thumbnail_url TEXT,
    start_date DATE,
    end_date DATE,
    sermon_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sermons
CREATE TABLE sermons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_am TEXT,
    title_ti TEXT,
    slug TEXT UNIQUE NOT NULL,
    description_en TEXT,
    description_am TEXT,
    description_ti TEXT,
    preacher_id UUID REFERENCES preachers(id) ON DELETE SET NULL,
    series_id UUID REFERENCES sermon_series(id) ON DELETE SET NULL,
    church_id INTEGER REFERENCES churches(id) ON DELETE SET NULL,
    sermon_date DATE NOT NULL,
    sermon_type TEXT CHECK (sermon_type IN ('sunday_service', 'bible_study', 'conference', 'special_event', 'teaching', 'other')) DEFAULT 'sunday_service',
    primary_scripture TEXT,
    secondary_scriptures TEXT[],
    audio_url TEXT,
    audio_duration_seconds INTEGER,
    audio_file_size_mb DECIMAL(10, 2),
    video_url TEXT,
    video_duration_seconds INTEGER,
    video_file_size_mb DECIMAL(10, 2),
    thumbnail_url TEXT,
    transcript_en TEXT,
    transcript_am TEXT,
    transcript_ti TEXT,
    sermon_notes_url TEXT,
    study_guide_url TEXT,
    allow_downloads BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[],
    topics TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sermon Comments
CREATE TABLE sermon_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sermon_id UUID REFERENCES sermons(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    parent_comment_id UUID REFERENCES sermon_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp_seconds INTEGER,
    is_approved BOOLEAN DEFAULT true,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sermon Likes
CREATE TABLE sermon_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sermon_id UUID REFERENCES sermons(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sermon_id, user_id)
);

-- Sermon Downloads
CREATE TABLE sermon_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sermon_id UUID REFERENCES sermons(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    download_type TEXT CHECK (download_type IN ('audio', 'video', 'notes', 'transcript')) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_category ON events(category_id);
CREATE INDEX idx_events_church ON events(church_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_featured ON events(is_featured) WHERE is_featured = true;
CREATE INDEX idx_event_rsvps_event ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_user ON event_rsvps(user_id);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at) WHERE status = 'published';
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX idx_sermons_preacher ON sermons(preacher_id);
CREATE INDEX idx_sermons_series ON sermons(series_id);
CREATE INDEX idx_sermons_church ON sermons(church_id);
CREATE INDEX idx_sermons_date ON sermons(sermon_date);
CREATE INDEX idx_sermons_status ON sermons(status);
CREATE INDEX idx_sermons_featured ON sermons(is_featured) WHERE is_featured = true;
CREATE INDEX idx_sermons_slug ON sermons(slug);
CREATE INDEX idx_sermon_comments_sermon ON sermon_comments(sermon_id);

-- Triggers
CREATE TRIGGER update_event_categories_updated_at BEFORE UPDATE ON event_categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_event_rsvps_updated_at BEFORE UPDATE ON event_rsvps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_authors_updated_at BEFORE UPDATE ON blog_authors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_preachers_updated_at BEFORE UPDATE ON preachers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sermon_series_updated_at BEFORE UPDATE ON sermon_series
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sermons_updated_at BEFORE UPDATE ON sermons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE preachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermon_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermon_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermon_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermon_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event categories viewable by all" ON event_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Published events viewable by all" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update events" ON events FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can delete events" ON events FOR DELETE USING (auth.uid() = organizer_id);
CREATE POLICY "RSVPs viewable by all" ON event_rsvps FOR SELECT USING (true);
CREATE POLICY "Users can RSVP" ON event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update RSVP" ON event_rsvps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete RSVP" ON event_rsvps FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Blog categories viewable by all" ON blog_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Published posts viewable by all" ON blog_posts FOR SELECT USING (status = 'published' AND published_at <= NOW());
CREATE POLICY "Authors view own drafts" ON blog_posts FOR SELECT USING (auth.uid() IN (SELECT user_id FROM blog_authors WHERE id = author_id));
CREATE POLICY "Authors create posts" ON blog_posts FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM blog_authors WHERE id = author_id));
CREATE POLICY "Authors update own posts" ON blog_posts FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM blog_authors WHERE id = author_id));
CREATE POLICY "Approved comments viewable" ON blog_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users comment" ON blog_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update comments" ON blog_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete comments" ON blog_comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Likes viewable by all" ON blog_post_likes FOR SELECT USING (true);
CREATE POLICY "Users like posts" ON blog_post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unlike posts" ON blog_post_likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Published sermons viewable" ON sermons FOR SELECT USING (status = 'published');
CREATE POLICY "Preachers viewable by all" ON preachers FOR SELECT USING (true);
CREATE POLICY "Series viewable by all" ON sermon_series FOR SELECT USING (is_active = true);
CREATE POLICY "Sermon comments viewable" ON sermon_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users comment sermons" ON sermon_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update sermon comments" ON sermon_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Sermon likes viewable" ON sermon_likes FOR SELECT USING (true);
CREATE POLICY "Users like sermons" ON sermon_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unlike sermons" ON sermon_likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users view downloads" ON sermon_downloads FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Track downloads" ON sermon_downloads FOR INSERT WITH CHECK (true);

-- Helper Functions
CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
    words_per_minute INTEGER := 200;
    word_count INTEGER;
BEGIN
    word_count := array_length(regexp_split_to_array(content, '\s+'), 1);
    RETURN GREATEST(1, CEIL(word_count::DECIMAL / words_per_minute));
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION update_blog_post_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.content_en IS NOT NULL THEN
        NEW.reading_time_minutes := calculate_reading_time(NEW.content_en);
        NEW.word_count := array_length(regexp_split_to_array(NEW.content_en, '\s+'), 1);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER calculate_blog_post_reading_time
    BEFORE INSERT OR UPDATE ON blog_posts
    FOR EACH ROW
    WHEN (NEW.content_en IS NOT NULL)
    EXECUTE FUNCTION update_blog_post_reading_time();

CREATE OR REPLACE FUNCTION update_sermon_count_on_series()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.series_id IS NOT NULL THEN
        UPDATE sermon_series SET sermon_count = sermon_count + 1 WHERE id = NEW.series_id;
    ELSIF TG_OP = 'DELETE' AND OLD.series_id IS NOT NULL THEN
        UPDATE sermon_series SET sermon_count = GREATEST(0, sermon_count - 1) WHERE id = OLD.series_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_series_sermon_count AFTER INSERT OR DELETE ON sermons
    FOR EACH ROW EXECUTE FUNCTION update_sermon_count_on_series();

-- Sample Data
INSERT INTO event_categories (name_en, name_am, name_ti, description_en, icon, color, display_order) VALUES
('Church Service', 'የቤተክርስቲያን አገልግሎት', 'ቤተ ክርስትያን አገልግሎት', 'Regular church services', 'church', '#8B5CF6', 1),
('Bible Study', 'የመጽሐፍ ቅዱስ ጥናት', 'መጽሓፍ ቅዱስ ትምህርቲ', 'Bible studies', 'book-open', '#3B82F6', 2),
('Prayer Meeting', 'የጸሎት ስብሰባ', 'ጸሎት ኣኼባ', 'Prayer meetings', 'hands-praying', '#10B981', 3),
('Youth Event', 'የወጣቶች ዝግጅት', 'መንእሰያት ዓወት', 'Youth events', 'users', '#F59E0B', 4),
('Conference', 'ኮንፈረንስ', 'ኮንፈረንስ', 'Conferences', 'presentation', '#EF4444', 5),
('Fellowship', 'ዝምድና', 'ሕብረት', 'Fellowship', 'coffee', '#6366F1', 6),
('Fasting', 'ጾም', 'ጾም', 'Fasting periods', 'moon', '#8B5CF6', 7),
('Holiday', 'በዓል', 'በዓል', 'Holidays', 'calendar-star', '#EC4899', 8);

INSERT INTO blog_categories (name_en, name_am, name_ti, slug, description_en, icon, color, display_order) VALUES
('Devotionals', 'መንፈሳዊ', 'መንፈሳዊ', 'devotionals', 'Daily devotionals', 'book-heart', '#10B981', 1),
('Teaching', 'ትምህርት', 'ትምህርቲ', 'teaching', 'Biblical teaching', 'graduation-cap', '#3B82F6', 2),
('Testimonies', 'ምስክርነት', 'መስክር', 'testimonies', 'Testimonies', 'message-circle', '#F59E0B', 3),
('News', 'ዜና', 'ዜና', 'news', 'News', 'newspaper', '#6366F1', 4),
('Family Life', 'የቤተሰብ ሕይወት', 'ሂወት ስድራቤት', 'family-life', 'Family life', 'home', '#EC4899', 5),
('Fasting & Prayer', 'ጾምና ጸሎት', 'ጾምን ጸሎትን', 'fasting-prayer', 'Fasting & Prayer', 'moon-stars', '#8B5CF6', 6),
('Orthodox Faith', 'ኦርቶዶክስ እምነት', 'ኦርቶዶክስ ሃይማኖት', 'orthodox-faith', 'Orthodox teachings', 'cross', '#EF4444', 7);
-- =====================================================
-- HABESHA COMMUNITY - PHASE 2: CHURCH FINDER
-- Complete church directory for Eritrean & Ethiopian churches worldwide
-- =====================================================

-- Enable PostGIS extension for geolocation
CREATE EXTENSION IF NOT EXISTS postgis;

-- =====================================================
-- 1. DENOMINATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS church_denominations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    parent_denomination_id INTEGER REFERENCES church_denominations(id),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert major denominations
INSERT INTO church_denominations (name, category, description, display_order) VALUES
('Eritrean Orthodox Tewahedo', 'Orthodox', 'Eritrean Orthodox Tewahedo Church', 1),
('Ethiopian Orthodox Tewahedo', 'Orthodox', 'Ethiopian Orthodox Tewahedo Church', 2),
('Eritrean Catholic', 'Catholic', 'Eritrean Catholic Church (Ge''ez Rite)', 10),
('Ethiopian Catholic', 'Catholic', 'Ethiopian Catholic Church (Ge''ez Rite)', 11),
('Roman Catholic', 'Catholic', 'Roman Catholic Church', 12),
('Evangelical Lutheran', 'Protestant', 'Evangelical Lutheran Church of Eritrea', 20),
('Ethiopian Evangelical', 'Protestant', 'Ethiopian Kale Heywet Church', 21),
('Pentecostal', 'Protestant', 'Pentecostal Churches', 22),
('Mekane Yesus', 'Protestant', 'Ethiopian Evangelical Church Mekane Yesus', 23),
('Seventh-day Adventist', 'Protestant', 'Seventh-day Adventist Church', 24),
('Baptist', 'Protestant', 'Baptist Churches', 25),
('Methodist', 'Protestant', 'Methodist Churches', 26),
('Interdenominational', 'Other', 'Interdenominational Churches', 90)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. CHURCHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS churches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    denomination_id INTEGER REFERENCES church_denominations(id),
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    state_province VARCHAR(200),
    city VARCHAR(200) NOT NULL,
    address TEXT,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location geography(POINT, 4326),
    phone VARCHAR(50),
    email VARCHAR(255),
    website TEXT,
    languages TEXT[] DEFAULT ARRAY[]::TEXT[],
    primary_language VARCHAR(10),
    description TEXT,
    founding_year INTEGER,
    priest_pastor_name VARCHAR(255),
    capacity INTEGER,
    main_image_url TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    has_parking BOOLEAN DEFAULT false,
    has_wheelchair_access BOOLEAN DEFAULT false,
    has_sunday_school BOOLEAN DEFAULT false,
    has_youth_ministry BOOLEAN DEFAULT false,
    has_livestream BOOLEAN DEFAULT false,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    verification_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    search_vector tsvector
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_churches_location ON churches USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_churches_country ON churches(country);
CREATE INDEX IF NOT EXISTS idx_churches_city ON churches(city);
CREATE INDEX IF NOT EXISTS idx_churches_denomination ON churches(denomination_id);
CREATE INDEX IF NOT EXISTS idx_churches_search ON churches USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_churches_slug ON churches(slug);

-- Update search vector trigger
CREATE OR REPLACE FUNCTION update_church_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER churches_search_vector_update
BEFORE INSERT OR UPDATE ON churches
FOR EACH ROW EXECUTE FUNCTION update_church_search_vector();

-- Update location from lat/lng trigger
CREATE OR REPLACE FUNCTION update_church_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER churches_location_update
BEFORE INSERT OR UPDATE ON churches
FOR EACH ROW EXECUTE FUNCTION update_church_location();

-- =====================================================
-- 3. CHURCH SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS church_services (
    id SERIAL PRIMARY KEY,
    church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    day_of_week INTEGER,
    time TIME,
    duration_minutes INTEGER,
    language VARCHAR(10),
    is_livestreamed BOOLEAN DEFAULT false,
    livestream_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_church_services_church ON church_services(church_id);

-- =====================================================
-- 4. CHURCH CONTACTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS church_contacts (
    id SERIAL PRIMARY KEY,
    church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    role VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_church_contacts_church ON church_contacts(church_id);

-- =====================================================
-- 5. CHURCH REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS church_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified_visit BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(church_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_church_reviews_church ON church_reviews(church_id);
CREATE INDEX IF NOT EXISTS idx_church_reviews_user ON church_reviews(user_id);

-- =====================================================
-- 6. USER FAVORITE CHURCHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_favorite_churches (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, church_id)
);

CREATE INDEX IF NOT EXISTS idx_user_favorite_churches_user ON user_favorite_churches(user_id);

-- =====================================================
-- 7. CHURCH EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS church_events (
    id SERIAL PRIMARY KEY,
    church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(50),
    location_details TEXT,
    is_online BOOLEAN DEFAULT false,
    online_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_church_events_church ON church_events(church_id);
CREATE INDEX IF NOT EXISTS idx_church_events_date ON church_events(event_date);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Churches: Public read, authenticated create
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Churches are viewable by everyone" ON churches FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can create churches" ON churches FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own churches" ON churches FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Services: Public read
ALTER TABLE church_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are viewable by everyone" ON church_services FOR SELECT USING (true);

-- Contacts: Public read
ALTER TABLE church_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contacts are viewable by everyone" ON church_contacts FOR SELECT USING (true);

-- Reviews: Public read, users manage own
ALTER TABLE church_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON church_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create their own reviews" ON church_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON church_reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON church_reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Favorites: Users manage own
ALTER TABLE user_favorite_churches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own favorites" ON user_favorite_churches FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own favorites" ON user_favorite_churches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON user_favorite_churches FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Events: Public read
ALTER TABLE church_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are viewable by everyone" ON church_events FOR SELECT USING (true);

-- Denominations: Public read
ALTER TABLE church_denominations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Denominations are viewable by everyone" ON church_denominations FOR SELECT USING (true);
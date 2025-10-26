-- Add simple performance indexes for search optimization

-- Mentors indexes for filtering
CREATE INDEX IF NOT EXISTS idx_mentors_available ON mentors(available) WHERE available = true;
CREATE INDEX IF NOT EXISTS idx_mentors_city ON mentors(city);
CREATE INDEX IF NOT EXISTS idx_mentors_name ON mentors(name);

-- Match profiles indexes
CREATE INDEX IF NOT EXISTS idx_match_profiles_active ON match_profiles(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_match_profiles_city ON match_profiles(city);

-- Listings indexes  
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_mentors_available_city ON mentors(available, city) WHERE available = true;
CREATE INDEX IF NOT EXISTS idx_match_profiles_active_city ON match_profiles(active, city) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_listings_status_city ON listings(status, city) WHERE status = 'active';
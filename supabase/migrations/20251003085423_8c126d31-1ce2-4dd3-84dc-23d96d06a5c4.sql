-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create enums
CREATE TYPE listing_category AS ENUM ('housing', 'jobs', 'services', 'forsale', 'community');
CREATE TYPE listing_status AS ENUM ('active', 'paused', 'flagged', 'archived');
CREATE TYPE contact_method AS ENUM ('phone', 'whatsapp', 'telegram', 'email');
CREATE TYPE forum_board AS ENUM ('general', 'housing_tips', 'jobs_career', 'immigration_legal', 'community_events', 'buy_sell_swap', 'health_wellness', 'faith_bible', 'tech_learn');
CREATE TYPE notification_type AS ENUM ('message', 'favorite', 'reply', 'mention', 'system');

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- LISTINGS TABLE
-- ============================================
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  country TEXT,
  category listing_category NOT NULL,
  subcategory TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER,
  currency TEXT DEFAULT 'USD',
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  location_lat DECIMAL(10, 7),
  location_lng DECIMAL(10, 7),
  website_url TEXT,
  contact_hidden BOOLEAN DEFAULT false,
  status listing_status DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_listings_user_id ON public.listings(user_id);
CREATE INDEX idx_listings_city ON public.listings(city);
CREATE INDEX idx_listings_category ON public.listings(category);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_location ON public.listings(location_lat, location_lng);
CREATE INDEX idx_listings_created_at ON public.listings(created_at DESC);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings are viewable by everyone"
  ON public.listings FOR SELECT
  USING (status = 'active' OR user_id = auth.uid());

CREATE POLICY "Users can create their own listings"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON public.listings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
  ON public.listings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- LISTING CONTACTS TABLE
-- ============================================
CREATE TABLE public.listing_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  contact_method contact_method,
  contact_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_listing_contacts_listing_id ON public.listing_contacts(listing_id);

ALTER TABLE public.listing_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listing contacts viewable by everyone"
  ON public.listing_contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_contacts.listing_id
      AND (listings.contact_hidden = false OR listings.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their listing contacts"
  ON public.listing_contacts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_contacts.listing_id
      AND listings.user_id = auth.uid()
    )
  );

-- ============================================
-- FAVORITES TABLE
-- ============================================
CREATE TABLE public.favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON public.favorites(listing_id);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SAVED SEARCHES TABLE
-- ============================================
CREATE TABLE public.saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  params JSONB NOT NULL,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_searches_user_id ON public.saved_searches(user_id);

ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved searches"
  ON public.saved_searches FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- FORUM TOPICS TABLE
-- ============================================
CREATE TABLE public.forum_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL,
  board forum_board NOT NULL,
  title TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_forum_topics_city ON public.forum_topics(city);
CREATE INDEX idx_forum_topics_board ON public.forum_topics(board);
CREATE INDEX idx_forum_topics_updated_at ON public.forum_topics(updated_at DESC);

ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forum topics are viewable by everyone"
  ON public.forum_topics FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create topics"
  ON public.forum_topics FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own topics"
  ON public.forum_topics FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own topics"
  ON public.forum_topics FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================
-- FORUM MESSAGES TABLE
-- ============================================
CREATE TABLE public.forum_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES public.forum_topics(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_forum_messages_topic_id ON public.forum_messages(topic_id);
CREATE INDEX idx_forum_messages_created_at ON public.forum_messages(created_at);

ALTER TABLE public.forum_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forum messages are viewable by everyone"
  ON public.forum_messages FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create messages"
  ON public.forum_messages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own messages"
  ON public.forum_messages FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own messages"
  ON public.forum_messages FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================
-- MENTORS TABLE
-- ============================================
CREATE TABLE public.mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  expertise TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  hourly_rate_cents INTEGER,
  currency TEXT DEFAULT 'USD',
  avatar_url TEXT,
  city TEXT,
  country TEXT,
  timezone TEXT,
  available BOOLEAN DEFAULT true,
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mentors_user_id ON public.mentors(user_id);
CREATE INDEX idx_mentors_available ON public.mentors(available);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors are viewable by everyone"
  ON public.mentors FOR SELECT
  USING (available = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own mentor profile"
  ON public.mentors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mentor profile"
  ON public.mentors FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  meeting_url TEXT,
  notes TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_mentor_id ON public.bookings(mentor_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_session_date ON public.bookings(session_date);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM public.mentors WHERE id = bookings.mentor_id));

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and mentors can update bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM public.mentors WHERE id = bookings.mentor_id));

-- ============================================
-- MARKETPLACE ITEMS TABLE
-- ============================================
CREATE TABLE public.marketplace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  category TEXT NOT NULL,
  condition TEXT,
  images TEXT[] DEFAULT '{}',
  city TEXT NOT NULL,
  country TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_user_id ON public.marketplace_items(user_id);
CREATE INDEX idx_marketplace_city ON public.marketplace_items(city);
CREATE INDEX idx_marketplace_category ON public.marketplace_items(category);

ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Marketplace items are viewable by everyone"
  ON public.marketplace_items FOR SELECT
  USING (status = 'active' OR user_id = auth.uid());

CREATE POLICY "Users can create their own items"
  ON public.marketplace_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON public.marketplace_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON public.marketplace_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MATCH PROFILES TABLE
-- ============================================
CREATE TABLE public.match_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  looking_for TEXT,
  photos TEXT[] DEFAULT '{}',
  city TEXT NOT NULL,
  country TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_match_profiles_user_id ON public.match_profiles(user_id);
CREATE INDEX idx_match_profiles_city ON public.match_profiles(city);
CREATE INDEX idx_match_profiles_active ON public.match_profiles(active);

ALTER TABLE public.match_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match profiles are viewable by authenticated users"
  ON public.match_profiles FOR SELECT
  USING (auth.uid() IS NOT NULL AND (active = true OR user_id = auth.uid()));

CREATE POLICY "Users can create their own match profile"
  ON public.match_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own match profile"
  ON public.match_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT different_participants CHECK (participant1_id != participant2_id)
);

CREATE INDEX idx_conversations_participant1 ON public.conversations(participant1_id);
CREATE INDEX idx_conversations_participant2 ON public.conversations(participant2_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
    )
  );

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.forum_topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.mentors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.match_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TRIGGER FOR PROFILE CREATION
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRIGGER FOR FORUM REPLY COUNT
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_topic_replies()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.forum_topics
  SET replies_count = replies_count + 1,
      updated_at = NOW()
  WHERE id = NEW.topic_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_replies AFTER INSERT ON public.forum_messages
  FOR EACH ROW EXECUTE FUNCTION public.increment_topic_replies();
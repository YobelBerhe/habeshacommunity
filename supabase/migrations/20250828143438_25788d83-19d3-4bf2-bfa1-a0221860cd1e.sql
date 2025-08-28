-- Enable RLS on tables that are missing it
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for donations
CREATE POLICY "Users can view their own donations" ON donations
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own donations" ON donations
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for forum boards (public read, admin write)
CREATE POLICY "Anyone can view forum boards" ON forum_boards
FOR SELECT USING (true);

-- Create RLS policies for forum topics
CREATE POLICY "Anyone can view forum topics" ON forum_topics
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create topics" ON forum_topics
FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own topics" ON forum_topics
FOR UPDATE USING (auth.uid() = author_id);

-- Create RLS policies for forum posts
CREATE POLICY "Anyone can view forum posts" ON forum_posts
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON forum_posts
FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON forum_posts
FOR UPDATE USING (auth.uid() = author_id);

-- Create RLS policies for user activity
CREATE POLICY "Users can view their own activity" ON user_activity
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity" ON user_activity
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT USING (auth.uid() = id::uuid);

CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (auth.uid() = id::uuid);

CREATE POLICY "Users can insert their own profile" ON users
FOR INSERT WITH CHECK (auth.uid() = id::uuid);
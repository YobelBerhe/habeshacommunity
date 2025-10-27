-- Add missing RLS policies for Phase 5 tables

-- Event Comments policies
CREATE POLICY "Event comments viewable by all" ON event_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can comment on events" ON event_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own event comments" ON event_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own event comments" ON event_comments FOR DELETE USING (auth.uid() = user_id);

-- Blog Authors policies  
CREATE POLICY "Blog authors viewable by all" ON blog_authors FOR SELECT USING (true);
CREATE POLICY "Users can create author profile" ON blog_authors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own author profile" ON blog_authors FOR UPDATE USING (auth.uid() = user_id);
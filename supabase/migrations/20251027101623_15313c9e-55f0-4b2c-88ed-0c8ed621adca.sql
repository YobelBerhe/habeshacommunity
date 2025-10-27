-- =====================================================
-- SEED DATA: Bible Books, Versions, and Reading Plans
-- =====================================================

-- Insert all Bible books with metadata
INSERT INTO bible_books (usfm, name, abbreviation, canon, book_order, chapters_count) VALUES
-- OLD TESTAMENT (39 books)
('GEN', 'Genesis', 'Gen.', 'ot', 1, 50),
('EXO', 'Exodus', 'Exod.', 'ot', 2, 40),
('LEV', 'Leviticus', 'Lev.', 'ot', 3, 27),
('NUM', 'Numbers', 'Num.', 'ot', 4, 36),
('DEU', 'Deuteronomy', 'Deut.', 'ot', 5, 34),
('JOS', 'Joshua', 'Josh.', 'ot', 6, 24),
('JDG', 'Judges', 'Judg.', 'ot', 7, 21),
('RUT', 'Ruth', 'Ruth', 'ot', 8, 4),
('1SA', '1 Samuel', '1 Sam.', 'ot', 9, 31),
('2SA', '2 Samuel', '2 Sam.', 'ot', 10, 24),
('1KI', '1 Kings', '1 Kings', 'ot', 11, 22),
('2KI', '2 Kings', '2 Kings', 'ot', 12, 25),
('1CH', '1 Chronicles', '1 Chron.', 'ot', 13, 29),
('2CH', '2 Chronicles', '2 Chron.', 'ot', 14, 36),
('EZR', 'Ezra', 'Ezra', 'ot', 15, 10),
('NEH', 'Nehemiah', 'Neh.', 'ot', 16, 13),
('EST', 'Esther', 'Esther', 'ot', 17, 10),
('JOB', 'Job', 'Job', 'ot', 18, 42),
('PSA', 'Psalms', 'Ps.', 'ot', 19, 150),
('PRO', 'Proverbs', 'Prov.', 'ot', 20, 31),
('ECC', 'Ecclesiastes', 'Eccles.', 'ot', 21, 12),
('SNG', 'Song of Solomon', 'Song', 'ot', 22, 8),
('ISA', 'Isaiah', 'Isa.', 'ot', 23, 66),
('JER', 'Jeremiah', 'Jer.', 'ot', 24, 52),
('LAM', 'Lamentations', 'Lam.', 'ot', 25, 5),
('EZK', 'Ezekiel', 'Ezek.', 'ot', 26, 48),
('DAN', 'Daniel', 'Dan.', 'ot', 27, 12),
('HOS', 'Hosea', 'Hos.', 'ot', 28, 14),
('JOL', 'Joel', 'Joel', 'ot', 29, 3),
('AMO', 'Amos', 'Amos', 'ot', 30, 9),
('OBA', 'Obadiah', 'Obad.', 'ot', 31, 1),
('JON', 'Jonah', 'Jonah', 'ot', 32, 4),
('MIC', 'Micah', 'Mic.', 'ot', 33, 7),
('NAM', 'Nahum', 'Nah.', 'ot', 34, 3),
('HAB', 'Habakkuk', 'Hab.', 'ot', 35, 3),
('ZEP', 'Zephaniah', 'Zeph.', 'ot', 36, 3),
('HAG', 'Haggai', 'Hag.', 'ot', 37, 2),
('ZEC', 'Zechariah', 'Zech.', 'ot', 38, 14),
('MAL', 'Malachi', 'Mal.', 'ot', 39, 4),
-- NEW TESTAMENT (27 books)
('MAT', 'Matthew', 'Matt.', 'nt', 40, 28),
('MRK', 'Mark', 'Mark', 'nt', 41, 16),
('LUK', 'Luke', 'Luke', 'nt', 42, 24),
('JHN', 'John', 'John', 'nt', 43, 21),
('ACT', 'Acts', 'Acts', 'nt', 44, 28),
('ROM', 'Romans', 'Rom.', 'nt', 45, 16),
('1CO', '1 Corinthians', '1 Cor.', 'nt', 46, 16),
('2CO', '2 Corinthians', '2 Cor.', 'nt', 47, 13),
('GAL', 'Galatians', 'Gal.', 'nt', 48, 6),
('EPH', 'Ephesians', 'Eph.', 'nt', 49, 6),
('PHP', 'Philippians', 'Phil.', 'nt', 50, 4),
('COL', 'Colossians', 'Col.', 'nt', 51, 4),
('1TH', '1 Thessalonians', '1 Thes.', 'nt', 52, 5),
('2TH', '2 Thessalonians', '2 Thes.', 'nt', 53, 3),
('1TI', '1 Timothy', '1 Tim.', 'nt', 54, 6),
('2TI', '2 Timothy', '2 Tim.', 'nt', 55, 4),
('TIT', 'Titus', 'Titus', 'nt', 56, 3),
('PHM', 'Philemon', 'Philem.', 'nt', 57, 1),
('HEB', 'Hebrews', 'Heb.', 'nt', 58, 13),
('JAS', 'James', 'James', 'nt', 59, 5),
('1PE', '1 Peter', '1 Pet.', 'nt', 60, 5),
('2PE', '2 Peter', '2 Pet.', 'nt', 61, 3),
('1JN', '1 John', '1 John', 'nt', 62, 5),
('2JN', '2 John', '2 John', 'nt', 63, 1),
('3JN', '3 John', '3 John', 'nt', 64, 1),
('JUD', 'Jude', 'Jude', 'nt', 65, 1),
('REV', 'Revelation', 'Rev.', 'nt', 66, 22)
ON CONFLICT (usfm) DO NOTHING;

-- Insert Bible versions
INSERT INTO bible_versions (version_id, abbreviation, name, language_code, language_name, audio_available, text_available, publisher) VALUES
(111, 'KJV', 'King James Version', 'en', 'English', true, true, 'Public Domain'),
(1, 'NIV', 'New International Version', 'en', 'English', true, true, 'Biblica'),
(59, 'ESV', 'English Standard Version', 'en', 'English', true, true, 'Crossway'),
(114, 'NKJV', 'New King James Version', 'en', 'English', true, true, 'Thomas Nelson'),
(97, 'MSG', 'The Message', 'en', 'English', true, true, 'NavPress'),
(206, 'NLT', 'New Living Translation', 'en', 'English', true, true, 'Tyndale House'),
(65, 'AMP', 'Amplified Bible', 'en', 'English', false, true, 'Lockman Foundation'),
(943, 'AMBBP', 'Amharic Bible 2000', 'am', 'Amharic', false, true, 'Ethiopian Bible Society'),
(1301, 'TIGBBL', 'Tigrinya Bible', 'ti', 'Tigrinya', false, true, 'Ethiopian Bible Society')
ON CONFLICT (version_id) DO NOTHING;

-- Insert reading plan publishers
INSERT INTO reading_plan_publishers (id, name, description, website) VALUES
(1, 'YouVersion', 'The Bible App publisher', 'https://www.youversion.com'),
(2, 'Life.Church', 'A church focused on spreading the Gospel', 'https://www.life.church'),
(3, 'Passion Movement', 'Equipping students to make Jesus famous', 'https://passionmovement.com'),
(4, 'Proverbs 31 Ministries', 'Biblical encouragement for women', 'https://proverbs31.org'),
(5, 'Christ Community Church', 'A gospel-centered church', 'https://cccomaha.org')
ON CONFLICT (id) DO NOTHING;

-- Insert sample reading plans
INSERT INTO reading_plans (
  external_id, slug, title, description, about_text, publisher_id, days_count, 
  popularity_rank, premium, languages, categories, gradient
) VALUES
(45997, 'gospel-to-the-ends-of-the-earth', 'Exploring the Book of Acts: Gospel to the Ends of the Earth',
 'A 6-day journey through Acts following the early church''s Spirit-led mission.',
 'Discover how the gospel spread from Jerusalem to the ends of the earth through the power of the Holy Spirit.',
 1, 6, 100, false, '["en"]'::jsonb, '["devotional", "bible study"]'::jsonb,
 '{"angle": 135, "colors": [["4F46E5", 0], ["7C3AED", 1]]}'::jsonb),

(61234, 'overcoming-anxiety', '7 Days to Overcoming Anxiety',
 'Find peace and rest in God''s presence through Scripture and prayer.',
 'Learn biblical strategies to overcome anxiety and experience God''s peace.',
 2, 7, 95, false, '["en"]'::jsonb, '["devotional", "mental health"]'::jsonb,
 '{"angle": 120, "colors": [["10B981", 0], ["059669", 1]]}'::jsonb),

(58392, 'proverbs-31-woman', 'The Proverbs 31 Woman: 30 Days',
 'A month-long study of the virtuous woman described in Proverbs 31.',
 'Discover timeless wisdom for women of faith through daily reflections.',
 4, 30, 90, false, '["en"]'::jsonb, '["devotional", "women"]'::jsonb,
 '{"angle": 90, "colors": [["EC4899", 0], ["DB2777", 1]]}'::jsonb)
ON CONFLICT (slug) DO NOTHING;
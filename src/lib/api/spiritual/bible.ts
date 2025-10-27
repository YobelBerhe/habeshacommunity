/**
 * Bible Verses & Verse of the Day API Functions
 */

import { supabase, getCurrentUser } from './client';
import type {
  BibleVerse,
  BibleVersion,
  BibleBook,
  BibleChapter,
  VerseOfTheDay,
  UserVerseHighlight,
  UserVerseBookmark,
  CreateHighlightInput,
  CreateBookmarkInput,
  HighlightColor,
} from '@/types/spiritual';

// =====================================================
// BIBLE VERSIONS & BOOKS
// =====================================================

/**
 * Get all Bible versions
 */
export async function getBibleVersions(languageCode?: string): Promise<BibleVersion[]> {
  let query = supabase
    .from('bible_versions')
    .select('*')
    .order('name');

  if (languageCode) {
    query = query.eq('language_code', languageCode);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching Bible versions:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a Bible version by abbreviation
 */
export async function getBibleVersion(abbreviation: string): Promise<BibleVersion | null> {
  const { data, error } = await supabase
    .from('bible_versions')
    .select('*')
    .eq('abbreviation', abbreviation)
    .maybeSingle();

  if (error) {
    console.error('Error fetching Bible version:', error);
    throw error;
  }

  return data;
}

/**
 * Get all Bible books
 */
export async function getBibleBooks(): Promise<BibleBook[]> {
  const { data, error } = await supabase
    .from('bible_books')
    .select('*')
    .order('book_order');

  if (error) {
    console.error('Error fetching Bible books:', error);
    throw error;
  }

  return (data || []) as unknown as BibleBook[];
}

/**
 * Get a Bible book by USFM code
 */
export async function getBibleBook(usfm: string): Promise<BibleBook | null> {
  const { data, error } = await supabase
    .from('bible_books')
    .select('*')
    .eq('usfm', usfm.toUpperCase())
    .maybeSingle();

  if (error) {
    console.error('Error fetching Bible book:', error);
    throw error;
  }

  return data as BibleBook | null;
}

// =====================================================
// VERSES
// =====================================================

/**
 * Get a single verse
 */
export async function getVerse(usfm: string, versionId?: number): Promise<BibleVerse | null> {
  const version = versionId || 111; // Default to KJV

  const { data, error } = await supabase
    .from('bible_verses')
    .select('*')
    .eq('usfm', usfm)
    .eq('version_id', version)
    .maybeSingle();

  if (error) {
    console.error('Error fetching verse:', error);
    throw error;
  }

  return data;
}

/**
 * Get multiple verses by USFM references
 */
export async function getVerses(usfms: string[], versionId?: number): Promise<BibleVerse[]> {
  const version = versionId || 111;

  const { data, error } = await supabase
    .from('bible_verses')
    .select('*')
    .in('usfm', usfms)
    .eq('version_id', version);

  if (error) {
    console.error('Error fetching verses:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get all verses in a chapter
 */
export async function getChapterVerses(bookUsfm: string, chapter: number, versionId?: number): Promise<BibleVerse[]> {
  const version = versionId || 111;
  const chapterUsfm = `${bookUsfm}.${chapter}`;

  // Get chapter ID
  const { data: chapterData } = await supabase
    .from('bible_chapters')
    .select('id')
    .eq('usfm', chapterUsfm)
    .maybeSingle();

  if (!chapterData) return [];

  const { data, error } = await supabase
    .from('bible_verses')
    .select('*')
    .eq('chapter_id', chapterData.id)
    .eq('version_id', version)
    .order('verse_number');

  if (error) {
    console.error('Error fetching chapter verses:', error);
    throw error;
  }

  return data || [];
}

/**
 * Search verses by text
 */
export async function searchVerses(
  query: string,
  versionId?: number,
  limit: number = 50
): Promise<BibleVerse[]> {
  const version = versionId || 111;

  const { data, error } = await supabase
    .from('bible_verses')
    .select('*')
    .eq('version_id', version)
    .textSearch('text_searchable', query)
    .limit(limit);

  if (error) {
    console.error('Error searching verses:', error);
    throw error;
  }

  return data || [];
}

// =====================================================
// VERSE OF THE DAY
// =====================================================

/**
 * Get today's Verse of the Day
 */
export async function getTodayVOTD(): Promise<VerseOfTheDay | null> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('verse_of_the_day')
    .select('*')
    .eq('date', today)
    .maybeSingle();

  if (error) {
    console.error('Error fetching VOTD:', error);
    throw error;
  }

  return data as unknown as VerseOfTheDay | null;
}

/**
 * Get Verse of the Day for a specific date
 */
export async function getVOTDByDate(date: string): Promise<VerseOfTheDay | null> {
  const { data, error } = await supabase
    .from('verse_of_the_day')
    .select('*')
    .eq('date', date)
    .maybeSingle();

  if (error) {
    console.error('Error fetching VOTD:', error);
    throw error;
  }

  return data as unknown as VerseOfTheDay | null;
}

// =====================================================
// USER HIGHLIGHTS & BOOKMARKS
// =====================================================

/**
 * Get user's highlights
 */
export async function getUserHighlights(): Promise<UserVerseHighlight[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_verse_highlights')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching highlights:', error);
    throw error;
  }

  return (data || []) as UserVerseHighlight[];
}

/**
 * Create a highlight
 */
export async function createHighlight(input: CreateHighlightInput): Promise<UserVerseHighlight> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  const { data, error } = await supabase
    .from('user_verse_highlights')
    .insert({
      user_id: user.id,
      verse_id: input.verse_id,
      color: input.color || 'yellow',
      note: input.note,
      is_public: input.is_public || false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating highlight:', error);
    throw error;
  }

  return data as UserVerseHighlight;
}

/**
 * Update a highlight
 */
export async function updateHighlight(
  highlightId: string,
  updates: Partial<CreateHighlightInput>
): Promise<UserVerseHighlight> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  const { data, error } = await supabase
    .from('user_verse_highlights')
    .update(updates)
    .eq('id', highlightId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating highlight:', error);
    throw error;
  }

  return data as UserVerseHighlight;
}

/**
 * Delete a highlight
 */
export async function deleteHighlight(highlightId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  const { error } = await supabase
    .from('user_verse_highlights')
    .delete()
    .eq('id', highlightId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting highlight:', error);
    throw error;
  }
}

/**
 * Get user's bookmarks
 */
export async function getUserBookmarks(): Promise<UserVerseBookmark[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_verse_bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }

  return data || [];
}

/**
 * Create a bookmark
 */
export async function createBookmark(input: CreateBookmarkInput): Promise<UserVerseBookmark> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  const { data, error } = await supabase
    .from('user_verse_bookmarks')
    .insert({
      user_id: user.id,
      verse_id: input.verse_id,
      note: input.note,
      tags: input.tags || [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating bookmark:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a bookmark
 */
export async function deleteBookmark(bookmarkId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  const { error } = await supabase
    .from('user_verse_bookmarks')
    .delete()
    .eq('id', bookmarkId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting bookmark:', error);
    throw error;
  }
}

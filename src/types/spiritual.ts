/**
 * HABESHA COMMUNITY - SPIRITUAL SECTION
 * TypeScript Types & Interfaces
 * Based on Bible.com data structure
 */

// =====================================================
// BIBLE TYPES
// =====================================================

export interface BibleVersion {
  id: number;
  version_id: number;
  abbreviation: string; // "KJV", "NIV", "ESV"
  name: string; // "King James Version"
  language_code: string; // "en", "am", "ti"
  language_name: string; // "English", "Amharic"
  description?: string;
  audio_available: boolean;
  text_available: boolean;
  copyright?: string;
  publisher?: string;
  created_at: string;
  updated_at: string;
}

export interface BibleBook {
  id: number;
  usfm: string; // "GEN", "EXO", "MAT"
  name: string; // "Genesis", "Matthew"
  abbreviation?: string; // "Gen.", "Matt."
  canon: 'ot' | 'nt'; // Old Testament / New Testament
  book_order: number; // 1-66
  chapters_count: number;
  created_at: string;
}

export interface BibleChapter {
  id: number;
  book_id: number;
  chapter_number: number;
  usfm: string; // "GEN.1", "MAT.5"
  verses_count: number;
  canonical: boolean;
  created_at: string;
}

export interface BibleVerse {
  id: number;
  version_id: number;
  chapter_id: number;
  verse_number: number;
  usfm: string; // "GEN.1.1", "JHN.3.16"
  text: string;
  audio_url?: string;
  created_at: string;
}

// =====================================================
// READING PLAN TYPES
// =====================================================

export interface PlanGradient {
  angle: number;
  colors: [string, number][]; // [["ffff", 0], ["aaaa", 1]]
}

export interface PlanImage {
  id: string;
  url: string;
  attribution?: string;
}

export interface ReadingPlanPublisher {
  id: number;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  created_at: string;
}

export interface ReadingPlan {
  id: number;
  external_id?: number;
  slug: string;
  title: string;
  description?: string;
  about_html?: string;
  about_text?: string;
  publisher_id?: number;
  publisher?: ReadingPlanPublisher;
  days_count: number;
  popularity_rank: number;
  premium: boolean;
  languages: string[]; // ["en", "es", "fr"]
  categories: string[]; // ["devotional", "topical"]
  
  // Visual
  gradient?: PlanGradient;
  cover_image_url?: string;
  thumbnail_url?: string;
  
  // Metadata
  average_rating: number;
  total_ratings: number;
  total_subscriptions: number;
  
  created_at: string;
  updated_at: string;
}

export interface ReadingPlanDay {
  id: number;
  plan_id: number;
  day_number: number;
  title?: string;
  description?: string;
  segments?: ReadingPlanSegment[];
  created_at: string;
}

export type SegmentType = 'scripture' | 'devotional' | 'video' | 'prayer' | 'reflection';

export interface ReadingPlanSegment {
  id: number;
  day_id: number;
  segment_order: number;
  type: SegmentType;
  
  // Scripture segment
  usfm?: string; // "GEN.1.1-31", "PSA.23"
  version_id?: number;
  
  // Content segment
  title?: string;
  content_html?: string;
  content_text?: string;
  
  // Video segment
  video_url?: string;
  video_thumbnail?: string;
  
  created_at: string;
}

// =====================================================
// USER PROGRESS TYPES
// =====================================================

export type SubscriptionStatus = 'active' | 'completed' | 'paused' | 'abandoned';

export interface UserPlanSubscription {
  id: string; // UUID
  user_id: string; // UUID
  plan_id: number;
  plan?: ReadingPlan;
  
  // Progress
  current_day: number;
  completed_days: number[];
  status: SubscriptionStatus;
  
  // Timestamps
  started_at: string;
  completed_at?: string;
  last_read_at?: string;
  
  // Metadata
  notes?: string;
  rating?: number; // 1-5
  review?: string;
  
  created_at: string;
  updated_at: string;
}

export interface UserDayCompletion {
  id: string; // UUID
  subscription_id: string; // UUID
  day_id: number;
  user_id: string; // UUID
  completed_at: string;
  time_spent_seconds?: number;
}

// Progress view type
export interface UserPlanProgress extends UserPlanSubscription {
  progress_percentage: number;
}

// =====================================================
// HIGHLIGHTS & BOOKMARKS
// =====================================================

export type HighlightColor = 'yellow' | 'blue' | 'green' | 'pink' | 'orange';

export interface UserVerseHighlight {
  id: string; // UUID
  user_id: string; // UUID
  verse_id: number;
  verse?: BibleVerse;
  color: HighlightColor;
  note?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserVerseBookmark {
  id: string; // UUID
  user_id: string; // UUID
  verse_id: number;
  verse?: BibleVerse;
  note?: string;
  tags: string[];
  created_at: string;
}

// =====================================================
// VERSE OF THE DAY
// =====================================================

export interface VerseOfTheDay {
  id: number;
  date: string; // YYYY-MM-DD
  verse_id: number;
  verse?: BibleVerse;
  usfm: string;
  version_id: number;
  version?: BibleVersion;
  images: PlanImage[];
  created_at: string;
}

// =====================================================
// STREAK TRACKING
// =====================================================

export interface UserReadingStreak {
  id: string; // UUID
  user_id: string; // UUID
  current_streak: number;
  longest_streak: number;
  total_days_read: number;
  last_read_date?: string; // YYYY-MM-DD
  streak_start_date?: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface UserDailyReading {
  id: string; // UUID
  user_id: string; // UUID
  read_date: string; // YYYY-MM-DD
  verses_read: number[];
  chapters_read: number[];
  plans_engaged: number[];
  time_spent_seconds: number;
  created_at: string;
}

// =====================================================
// USER PREFERENCES
// =====================================================

export type FontSize = 'small' | 'medium' | 'large' | 'x-large';
export type Theme = 'light' | 'dark' | 'sepia';

export interface UserBiblePreferences {
  user_id: string; // UUID
  default_version_id: number;
  font_size: FontSize;
  theme: Theme;
  
  // Reading preferences
  show_verse_numbers: boolean;
  red_letter_words: boolean; // Words of Jesus
  cross_references: boolean;
  
  // Notifications
  daily_reminder_enabled: boolean;
  daily_reminder_time: string; // HH:MM:SS
  verse_of_day_notification: boolean;
  
  created_at: string;
  updated_at: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// =====================================================
// FORM TYPES
// =====================================================

export interface CreatePlanSubscriptionInput {
  plan_id: number;
  current_day?: number;
}

export interface UpdatePlanSubscriptionInput {
  current_day?: number;
  status?: SubscriptionStatus;
  notes?: string;
  rating?: number;
  review?: string;
}

export interface CompleteDayInput {
  subscription_id: string;
  day_id: number;
  day_number: number;
  time_spent_seconds?: number;
}

export interface CreateHighlightInput {
  verse_id: number;
  color: HighlightColor;
  note?: string;
  is_public?: boolean;
}

export interface CreateBookmarkInput {
  verse_id: number;
  note?: string;
  tags?: string[];
}

export interface UpdatePreferencesInput {
  default_version_id?: number;
  font_size?: FontSize;
  theme?: Theme;
  show_verse_numbers?: boolean;
  red_letter_words?: boolean;
  cross_references?: boolean;
  daily_reminder_enabled?: boolean;
  daily_reminder_time?: string;
  verse_of_day_notification?: boolean;
}

// =====================================================
// UTILITY TYPES
// =====================================================

export interface USFMReference {
  book: string; // "GEN"
  chapter?: number;
  verse?: number;
  endVerse?: number; // For ranges like "GEN.1.1-31"
}

export interface ParsedUSFM {
  original: string;
  book: BibleBook;
  chapter?: number;
  startVerse?: number;
  endVerse?: number;
  isRange: boolean;
}

// =====================================================
// COMPONENT PROP TYPES
// =====================================================

export interface PlanCardProps {
  plan: ReadingPlan;
  onClick?: () => void;
  showProgress?: boolean;
  progress?: number;
}

export interface VerseCardProps {
  verse: BibleVerse;
  version?: BibleVersion;
  highlight?: UserVerseHighlight;
  bookmark?: UserVerseBookmark;
  onHighlight?: (color: HighlightColor) => void;
  onBookmark?: () => void;
  onShare?: () => void;
}

export interface StreakBadgeProps {
  streak: UserReadingStreak;
  size?: 'sm' | 'md' | 'lg';
}

export interface ProgressCircleProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

// =====================================================
// CONSTANTS
// =====================================================

export const BIBLE_CANONS = {
  OT: 'ot',
  NT: 'nt',
} as const;

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  ABANDONED: 'abandoned',
} as const;

export const HIGHLIGHT_COLORS = {
  YELLOW: 'yellow',
  BLUE: 'blue',
  GREEN: 'green',
  PINK: 'pink',
  ORANGE: 'orange',
} as const;

export const FONT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  X_LARGE: 'x-large',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SEPIA: 'sepia',
} as const;

// =====================================================
// TYPE GUARDS
// =====================================================

export function isValidUSFM(usfm: string): boolean {
  // Basic USFM validation: BOOK.CHAPTER or BOOK.CHAPTER.VERSE
  const pattern = /^[A-Z0-9]{3,6}(\.\d+)?(\.\d+(-\d+)?)?$/;
  return pattern.test(usfm);
}

export function isActiveSubscription(subscription: UserPlanSubscription): boolean {
  return subscription.status === SUBSCRIPTION_STATUSES.ACTIVE;
}

export function isCompletedSubscription(subscription: UserPlanSubscription): boolean {
  return subscription.status === SUBSCRIPTION_STATUSES.COMPLETED;
}

/**
 * Spiritual Section API
 * Central export file for all spiritual API functions
 */

// Client and utilities
export { supabase, getCurrentUser, isAuthenticated } from './client';
export type { SupabaseClient } from './client';

// Bible API
export {
  getBibleVersions,
  getBibleVersion,
  getBibleBooks,
  getBibleBook,
  getVerse,
  getVerses,
  getChapterVerses,
  searchVerses,
  getTodayVOTD,
  getVOTDByDate,
  getUserHighlights,
  createHighlight,
  updateHighlight,
  deleteHighlight,
  getUserBookmarks,
  createBookmark,
  deleteBookmark,
} from './bible';

// Reading Plans API
export {
  getReadingPlans,
  getFeaturedPlans,
  getReadingPlan,
  getPlanDays,
  getPlanDay,
  subscribeToPlan,
  getUserActiveSubscriptions,
  getUserSubscriptions,
  getUserSubscription,
  updateSubscription,
  pauseSubscription,
  resumeSubscription,
  abandonSubscription,
  completeDay,
  isDayCompleted,
  getCompletedDays,
} from './reading-plans';

// User Progress API
export {
  getUserStreak,
  recordDailyReading,
  getReadingHistory,
  hasReadToday,
  getStreakStats,
  getUserPreferences,
  updatePreferences,
  getReadingStatsSummary,
} from './user-progress';

// Prayer API
export {
  getPrayerRequests,
  getPrayerRequest,
  createPrayerRequest,
  updatePrayerRequest,
  deletePrayerRequest,
  prayForRequest,
  removePrayerResponse,
  getPrayerResponses,
  addPrayerComment,
  getPrayerComments,
  getDailyPrayers,
  getMorningPrayers,
  getEveningPrayers,
  getMealPrayers,
  getFastingCalendar,
  getTodaysFast,
  getSaints,
  getTodaysSaint,
  getPrayerJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getUserPrayerList,
  createPrayerItem,
  updatePrayerItem,
  deletePrayerItem,
  getPrayerStatistics,
} from './prayer';

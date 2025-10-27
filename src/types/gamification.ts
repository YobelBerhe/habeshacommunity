// =====================================================
// PHASE 6: TYPESCRIPT TYPES
// Gamification System
// =====================================================

// =====================================================
// LEVELS & XP TYPES
// =====================================================

export interface Level {
  id: string;
  level_number: number;
  name_en: string;
  name_am?: string;
  name_ti?: string;
  description_en?: string;
  description_am?: string;
  description_ti?: string;
  xp_required: number;
  icon?: string;
  color: string;
  benefits?: {
    features: string[];
    [key: string]: any;
  };
  created_at: string;
}

export interface UserLevel {
  id: string;
  user_id: string;
  current_level: number;
  total_xp: number;
  xp_to_next_level: number;
  rank_position?: number;
  last_level_up?: string;
  created_at: string;
  updated_at: string;
  level_details?: Level;
  user?: any;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  reference_id?: string;
  reference_type?: string;
  created_at: string;
  user?: any;
}

// =====================================================
// BADGES & ACHIEVEMENTS TYPES
// =====================================================

export interface BadgeCategory {
  id: string;
  name_en: string;
  name_am?: string;
  name_ti?: string;
  icon?: string;
  color: string;
  display_order: number;
  created_at: string;
  badges?: Badge[];
}

export type BadgeType = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'special';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type BadgeRequirementType = 'streak' | 'count' | 'achievement' | 'special';

export interface BadgeRequirementConfig {
  streak_type?: string;
  days?: number;
  action?: string;
  count?: number;
  complete_all?: string[];
  complete_any?: string[];
  event_type?: string;
  custom_logic?: string;
  [key: string]: any;
}

export interface Badge {
  id: string;
  name_en: string;
  name_am?: string;
  name_ti?: string;
  description_en?: string;
  description_am?: string;
  description_ti?: string;
  category_id?: string;
  badge_type: BadgeType;
  icon: string;
  color: string;
  requirement_type: BadgeRequirementType;
  requirement_config: BadgeRequirementConfig;
  xp_reward: number;
  points_reward: number;
  is_active: boolean;
  is_secret: boolean;
  rarity: BadgeRarity;
  total_earned: number;
  created_at: string;
  updated_at: string;
  category?: BadgeCategory;
  user_progress?: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  is_displayed: boolean;
  is_favorite: boolean;
  progress_data?: {
    current: number;
    required: number;
    percentage: number;
    [key: string]: any;
  };
  badge?: Badge;
  user?: any;
}

// =====================================================
// STREAKS TYPES
// =====================================================

export interface StreakType {
  id: string;
  name_en: string;
  name_am?: string;
  name_ti?: string;
  description_en?: string;
  description_am?: string;
  description_ti?: string;
  icon?: string;
  color: string;
  reset_time: string;
  timezone: string;
  min_action_required: number;
  daily_xp: number;
  milestone_rewards?: {
    [days: number]: {
      xp: number;
      points?: number;
      badge_id?: string;
    };
  };
  is_active: boolean;
  created_at: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  streak_type_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  total_completions: number;
  freeze_count: number;
  frozen_until?: string;
  milestones_achieved: number[];
  created_at: string;
  updated_at: string;
  streak_type?: StreakType;
  user?: any;
}

export interface StreakActivity {
  id: string;
  user_id: string;
  streak_type_id: string;
  activity_date: string;
  completed_count: number;
  xp_earned: number;
  created_at: string;
  streak_type?: StreakType;
  user?: any;
}

// =====================================================
// POINTS & REWARDS TYPES
// =====================================================

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  available_points: number;
  lifetime_points: number;
  created_at: string;
  updated_at: string;
  user?: any;
}

export type PointTransactionType = 'earned' | 'spent' | 'bonus' | 'penalty';

export interface PointTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: PointTransactionType;
  reason: string;
  reference_id?: string;
  reference_type?: string;
  created_at: string;
  user?: any;
}

export type RewardType = 'digital' | 'physical' | 'feature_unlock' | 'privilege' | 'donation';

export interface Reward {
  id: string;
  name_en: string;
  name_am?: string;
  name_ti?: string;
  description_en?: string;
  description_am?: string;
  description_ti?: string;
  reward_type: RewardType;
  points_cost: number;
  stock_quantity?: number;
  stock_remaining?: number;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  total_redeemed: number;
  created_at: string;
  updated_at: string;
}

export type RedemptionStatus = 'pending' | 'approved' | 'fulfilled' | 'cancelled';

export interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  points_spent: number;
  status: RedemptionStatus;
  redemption_code?: string;
  fulfillment_notes?: string;
  redeemed_at: string;
  fulfilled_at?: string;
  created_at: string;
  reward?: Reward;
  user?: any;
}

// =====================================================
// LEADERBOARDS TYPES
// =====================================================

export type LeaderboardType = 'xp' | 'points' | 'streaks' | 'custom';
export type LeaderboardTimePeriod = 'all_time' | 'yearly' | 'monthly' | 'weekly' | 'daily';

export interface Leaderboard {
  id: string;
  name_en: string;
  name_am?: string;
  name_ti?: string;
  description_en?: string;
  leaderboard_type: LeaderboardType;
  metric_type: string;
  time_period: LeaderboardTimePeriod;
  reset_schedule?: string;
  last_reset?: string;
  icon?: string;
  color: string;
  max_display_rank: number;
  is_active: boolean;
  created_at: string;
  entries?: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  id: string;
  leaderboard_id: string;
  user_id: string;
  rank_position: number;
  score: number;
  previous_rank?: number;
  rank_change?: number;
  period_start?: string;
  period_end?: string;
  computed_at: string;
  leaderboard?: Leaderboard;
  user?: any;
}

// =====================================================
// CHALLENGES & QUESTS TYPES
// =====================================================

export type ChallengeType = 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'special';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface ChallengeObjective {
  type: string;
  count: number;
  description: string;
  [key: string]: any;
}

export interface Challenge {
  id: string;
  name_en: string;
  name_am?: string;
  name_ti?: string;
  description_en?: string;
  description_am?: string;
  description_ti?: string;
  challenge_type: ChallengeType;
  difficulty: ChallengeDifficulty;
  objectives: ChallengeObjective[];
  start_date?: string;
  end_date?: string;
  duration_days?: number;
  xp_reward: number;
  points_reward: number;
  badge_reward_id?: string;
  image_url?: string;
  is_active: boolean;
  max_participants?: number;
  total_participants: number;
  total_completed: number;
  created_at: string;
  updated_at: string;
  badge_reward?: Badge;
  user_progress?: UserChallenge;
}

export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'expired';

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: ChallengeStatus;
  progress_data: {
    objective_index: number;
    current: number;
    required: number;
    completed: boolean;
  }[];
  completion_percentage: number;
  started_at: string;
  completed_at?: string;
  expires_at?: string;
  rewards_claimed: boolean;
  created_at: string;
  updated_at: string;
  challenge?: Challenge;
  user?: any;
}

// =====================================================
// ACTIVITY & STATS TYPES
// =====================================================

export interface UserActivityStats {
  id: string;
  user_id: string;
  total_prayers_completed: number;
  prayers_this_week: number;
  prayers_this_month: number;
  total_church_visits: number;
  events_attended: number;
  events_rsvped: number;
  blog_posts_read: number;
  sermons_watched: number;
  sermons_downloaded: number;
  forum_posts_created: number;
  forum_replies_created: number;
  comments_posted: number;
  fasting_days_completed: number;
  bible_study_sessions: number;
  devotionals_completed: number;
  last_prayer_date?: string;
  last_sermon_date?: string;
  last_event_date?: string;
  last_forum_date?: string;
  created_at: string;
  updated_at: string;
  user?: any;
}

export interface DailyActivityLog {
  id: string;
  user_id: string;
  activity_date: string;
  activity_type: string;
  activity_count: number;
  xp_earned: number;
  points_earned: number;
  created_at: string;
  user?: any;
}

// =====================================================
// NOTIFICATIONS TYPES
// =====================================================

export type GamificationNotificationType =
  | 'level_up'
  | 'badge_earned'
  | 'streak_milestone'
  | 'challenge_completed'
  | 'leaderboard_rank'
  | 'reward_available';

export interface GamificationNotification {
  id: string;
  user_id: string;
  notification_type: GamificationNotificationType;
  title: string;
  message: string;
  reference_id?: string;
  reference_type?: string;
  metadata?: { [key: string]: any };
  is_read: boolean;
  read_at?: string;
  created_at: string;
  user?: any;
}

// =====================================================
// REQUEST/RESPONSE TYPES
// =====================================================

export interface AwardXPRequest {
  user_id: string;
  amount: number;
  reason: string;
  reference_id?: string;
  reference_type?: string;
}

export interface AwardXPResponse {
  new_level: number;
  level_up: boolean;
  total_xp: number;
}

export interface UpdateStreakRequest {
  user_id: string;
  streak_type_id: string;
  activity_date?: string;
}

export interface UpdateStreakResponse {
  current_streak: number;
  is_milestone: boolean;
  milestone_value?: number;
}

export interface AwardPointsRequest {
  user_id: string;
  amount: number;
  reason: string;
  reference_id?: string;
  reference_type?: string;
}

export interface RedeemRewardRequest {
  reward_id: string;
}

export interface RedeemRewardResponse {
  redemption: RewardRedemption;
  remaining_points: number;
}

export interface JoinChallengeRequest {
  challenge_id: string;
}

export interface UpdateChallengeProgressRequest {
  challenge_id: string;
  objective_index: number;
  progress: number;
}

export interface BadgeFilters {
  category_id?: string;
  badge_type?: BadgeType;
  rarity?: BadgeRarity;
  is_earned?: boolean;
  search?: string;
}

export interface ChallengeFilters {
  challenge_type?: ChallengeType;
  difficulty?: ChallengeDifficulty;
  is_active?: boolean;
  status?: ChallengeStatus;
}

export interface LeaderboardFilters {
  leaderboard_type?: LeaderboardType;
  time_period?: LeaderboardTimePeriod;
  limit?: number;
}

// =====================================================
// DASHBOARD TYPES
// =====================================================

export interface GamificationDashboard {
  user_level: UserLevel;
  level_details: Level;
  next_level: Level;
  user_points: UserPoints;
  active_streaks: UserStreak[];
  recent_badges: UserBadge[];
  active_challenges: UserChallenge[];
  leaderboard_positions: {
    leaderboard: Leaderboard;
    entry: LeaderboardEntry;
  }[];
  activity_stats: UserActivityStats;
  recent_notifications: GamificationNotification[];
}

export interface GamificationProfile {
  user_id: string;
  level: UserLevel;
  total_badges: number;
  displayed_badges: UserBadge[];
  favorite_badge?: UserBadge;
  streaks: UserStreak[];
  activity_stats: UserActivityStats;
  rank_positions: LeaderboardEntry[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProgressTracker {
  current: number;
  required: number;
  percentage: number;
  is_complete: boolean;
}

export interface Milestone {
  value: number;
  label: string;
  is_achieved: boolean;
  rewards?: {
    xp?: number;
    points?: number;
    badge_id?: string;
  };
}

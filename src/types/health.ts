// =====================================================
// HEALTH TYPES
// Type definitions for health tracking features
// =====================================================

// Workout Types
export const WORKOUT_TYPES = [
  'strength',
  'cardio',
  'flexibility',
  'sports',
  'traditional_dance',
  'mixed'
] as const;

export const INTENSITY_LEVELS = ['light', 'moderate', 'hard', 'very_hard'] as const;

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  workout_type: typeof WORKOUT_TYPES[number];
  intensity: typeof INTENSITY_LEVELS[number];
  date: string;
  started_at?: string;
  completed_at?: string;
  duration_minutes?: number;
  calories_burned?: number;
  location?: string;
  notes?: string;
  created_at: string;
}

export interface CreateWorkoutInput {
  name: string;
  workout_type: typeof WORKOUT_TYPES[number];
  intensity: typeof INTENSITY_LEVELS[number];
  date: string;
  started_at?: string;
  completed_at?: string;
  duration_minutes?: number;
  calories_burned?: number;
  location?: string;
  notes?: string;
}

// Exercise Types
export interface Exercise {
  id: string;
  name_en: string;
  name_am?: string;
  name_ti?: string;
  description_en?: string;
  description_am?: string;
  description_ti?: string;
  category: string;
  muscle_group?: string;
  equipment_needed?: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  calories_per_minute?: number;
  is_traditional: boolean;
  video_url?: string;
  image_url?: string;
  tags?: string[];
  instructions_en?: string[];
  instructions_am?: string[];
  instructions_ti?: string[];
  created_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_name: string;
  sets?: number;
  reps?: number;
  weight_kg?: number;
  duration_minutes?: number;
  distance_km?: number;
  calories_burned?: number;
  notes?: string;
  order_index: number;
  created_at: string;
}

export interface CreateWorkoutExerciseInput {
  exercise_id: string;
  exercise_name: string;
  sets?: number;
  reps?: number;
  weight_kg?: number;
  duration_minutes?: number;
  distance_km?: number;
  calories_burned?: number;
  notes?: string;
  order_index: number;
}

// Nutrition Types
export interface Food {
  id: string;
  name_en: string;
  name_am?: string;
  name_ti?: string;
  category: string;
  is_habesha_food: boolean;
  is_fasting_appropriate: boolean;
  serving_size_g?: number;
  serving_size_description?: string;
  calories_per_serving?: number;
  protein_g?: number;
  carbs_g?: number;
  fats_g?: number;
  fiber_g?: number;
  created_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_time: string;
  date: string;
  total_calories?: number;
  total_protein_g?: number;
  total_carbs_g?: number;
  total_fats_g?: number;
  total_fiber_g?: number;
  notes?: string;
  created_at: string;
}

// Sleep Types
export interface SleepRecord {
  id: string;
  user_id: string;
  date: string;
  bed_time: string;
  wake_time: string;
  total_hours?: number;
  quality_rating?: number;
  notes?: string;
  created_at: string;
}

// Hydration Types
export interface HydrationRecord {
  id: string;
  user_id: string;
  date: string;
  amount_ml: number;
  drink_type?: string;
  recorded_at: string;
  created_at: string;
}

// Mental Health Types
export interface MoodRecord {
  id: string;
  user_id: string;
  date: string;
  mood_rating: number;
  energy_level?: number;
  stress_level?: number;
  notes?: string;
  recorded_at: string;
  created_at: string;
}

// Health Profile
export interface HealthProfile {
  id: string;
  user_id: string;
  height_cm?: number;
  weight_kg?: number;
  date_of_birth?: string;
  biological_sex?: 'male' | 'female' | 'other';
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  health_goals?: string[];
  dietary_restrictions?: string[];
  medical_conditions?: string[];
  daily_calorie_goal?: number;
  daily_protein_goal_g?: number;
  daily_water_goal_ml?: number;
  weekly_exercise_goal_minutes?: number;
  created_at: string;
  updated_at: string;
}

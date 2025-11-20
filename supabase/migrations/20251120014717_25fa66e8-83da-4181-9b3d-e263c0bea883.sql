-- =====================================================
-- DayAI Health Tracking System - Complete Schema
-- =====================================================

-- Daily Targets Table
CREATE TABLE IF NOT EXISTS public.daily_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  calories INTEGER NOT NULL DEFAULT 2000,
  protein_g INTEGER NOT NULL DEFAULT 150,
  carbs_g INTEGER NOT NULL DEFAULT 200,
  fats_g INTEGER NOT NULL DEFAULT 60,
  water_oz INTEGER DEFAULT 64,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Food Logs Table
CREATE TABLE IF NOT EXISTS public.food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_name TEXT NOT NULL,
  serving_size TEXT,
  calories INTEGER,
  protein_g NUMERIC(10,2),
  carbs_g NUMERIC(10,2),
  fats_g NUMERIC(10,2),
  fiber_g NUMERIC(10,2),
  sugar_g NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scanned Products Table
CREATE TABLE IF NOT EXISTS public.scanned_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  barcode TEXT NOT NULL,
  product_name TEXT,
  brand TEXT,
  nutrition_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_to_diary BOOLEAN DEFAULT FALSE
);

-- Shopping Lists Table
CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes Table
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  images TEXT[],
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER DEFAULT 2,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  nutrition_per_serving JSONB,
  ingredients JSONB DEFAULT '[]'::jsonb,
  instructions JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe Unlocks Table
CREATE TABLE IF NOT EXISTS public.recipe_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Favorite Recipes Table
CREATE TABLE IF NOT EXISTS public.favorite_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Enable RLS
ALTER TABLE public.daily_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scanned_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_targets
CREATE POLICY "Users can view their own daily targets"
  ON public.daily_targets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily targets"
  ON public.daily_targets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily targets"
  ON public.daily_targets FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for food_logs
CREATE POLICY "Users can view their own food logs"
  ON public.food_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food logs"
  ON public.food_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food logs"
  ON public.food_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food logs"
  ON public.food_logs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for scanned_products
CREATE POLICY "Users can view their own scanned products"
  ON public.scanned_products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scanned products"
  ON public.scanned_products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for shopping_lists
CREATE POLICY "Users can view their own shopping lists"
  ON public.shopping_lists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shopping lists"
  ON public.shopping_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping lists"
  ON public.shopping_lists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping lists"
  ON public.shopping_lists FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for recipes (public viewing)
CREATE POLICY "Anyone can view recipes"
  ON public.recipes FOR SELECT
  USING (true);

-- RLS Policies for recipe_unlocks
CREATE POLICY "Users can view their own recipe unlocks"
  ON public.recipe_unlocks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipe unlocks"
  ON public.recipe_unlocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for favorite_recipes
CREATE POLICY "Users can view their own favorite recipes"
  ON public.favorite_recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite recipes"
  ON public.favorite_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite recipes"
  ON public.favorite_recipes FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_targets_user_date ON public.daily_targets(user_id, date);
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON public.food_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_scanned_products_user ON public.scanned_products(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user ON public.shopping_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_unlocks_user ON public.recipe_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_recipes_user ON public.favorite_recipes(user_id);
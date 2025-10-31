// lib/nutrition/habesha-foods.ts
// Traditional Ethiopian/Eritrean foods database

export interface HabeshaFood {
  id: string;
  name: string;
  name_amharic?: string;
  name_tigrinya?: string;
  category: 'main' | 'side' | 'beverage' | 'snack' | 'breakfast';
  is_vegan: boolean;
  is_fasting_appropriate: boolean;
  nutrition: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fats_g: number;
    fiber_g: number;
    sugar_g?: number;
  };
  serving_size: string;
  ingredients: string[];
  preparation_time_min: number;
  cultural_significance?: string;
  best_for?: string[];
  image_url?: string;
}

export const HABESHA_FOODS_DATABASE: HabeshaFood[] = [
  // MAIN DISHES
  {
    id: 'injera',
    name: 'Injera',
    name_amharic: 'እንጀራ',
    name_tigrinya: 'እንጀራ',
    category: 'main',
    is_vegan: true,
    is_fasting_appropriate: true,
    nutrition: {
      calories: 85,
      protein_g: 2,
      carbs_g: 18,
      fats_g: 0.5,
      fiber_g: 2
    },
    serving_size: '1 piece (50g)',
    ingredients: ['teff flour', 'water', 'starter culture (ersho)'],
    preparation_time_min: 180,
    cultural_significance: 'The foundation of every Ethiopian meal, made from ancient teff grain',
    best_for: ['Energy', 'Digestion', 'Gluten-free option'],
    image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400'
  },
  {
    id: 'doro-wat',
    name: 'Doro Wat',
    name_amharic: 'ዶሮ ወጥ',
    name_tigrinya: 'ደርሆ ጸብሒ',
    category: 'main',
    is_vegan: false,
    is_fasting_appropriate: false,
    nutrition: {
      calories: 350,
      protein_g: 35,
      carbs_g: 15,
      fats_g: 18,
      fiber_g: 3
    },
    serving_size: '1 cup (250g)',
    ingredients: ['chicken', 'berbere spice', 'onions', 'garlic', 'niter kibbeh (spiced butter)', 'hard-boiled eggs'],
    preparation_time_min: 90,
    cultural_significance: 'National dish of Ethiopia, traditionally served at celebrations',
    best_for: ['Protein', 'Special occasions', 'Muscle building'],
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'
  },
  {
    id: 'shiro-wat',
    name: 'Shiro Wat',
    name_amharic: 'ሽሮ ወጥ',
    name_tigrinya: 'ሽሮ ጸብሒ',
    category: 'main',
    is_vegan: true,
    is_fasting_appropriate: true,
    nutrition: {
      calories: 200,
      protein_g: 12,
      carbs_g: 25,
      fats_g: 6,
      fiber_g: 8
    },
    serving_size: '1 cup (200g)',
    ingredients: ['chickpea flour', 'onions', 'garlic', 'berbere', 'oil'],
    preparation_time_min: 30,
    cultural_significance: 'Most popular fasting food, quick and nutritious',
    best_for: ['Fasting', 'Protein', 'Quick meals'],
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'
  },
  {
    id: 'kitfo',
    name: 'Kitfo',
    name_amharic: 'ክትፎ',
    name_tigrinya: 'ክትፎ',
    category: 'main',
    is_vegan: false,
    is_fasting_appropriate: false,
    nutrition: {
      calories: 280,
      protein_g: 25,
      carbs_g: 2,
      fats_g: 20,
      fiber_g: 0
    },
    serving_size: '150g',
    ingredients: ['minced beef', 'mitmita spice', 'clarified butter', 'cardamom'],
    preparation_time_min: 15,
    cultural_significance: 'Ethiopian steak tartare, considered a delicacy',
    best_for: ['Protein', 'Low-carb', 'Special occasions'],
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'
  },
  {
    id: 'tibs',
    name: 'Tibs',
    name_amharic: 'ጥብስ',
    name_tigrinya: 'ጥብሲ',
    category: 'main',
    is_vegan: false,
    is_fasting_appropriate: false,
    nutrition: {
      calories: 320,
      protein_g: 28,
      carbs_g: 8,
      fats_g: 20,
      fiber_g: 2
    },
    serving_size: '200g',
    ingredients: ['beef or lamb', 'onions', 'peppers', 'rosemary', 'butter'],
    preparation_time_min: 20,
    cultural_significance: 'Sautéed meat dish, popular at gatherings',
    best_for: ['Protein', 'Quick meals', 'Celebrations'],
    image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400'
  },
  {
    id: 'misir-wat',
    name: 'Misir Wat',
    name_amharic: 'ምስር ወጥ',
    name_tigrinya: 'በርስን ጸብሒ',
    category: 'main',
    is_vegan: true,
    is_fasting_appropriate: true,
    nutrition: {
      calories: 220,
      protein_g: 15,
      carbs_g: 35,
      fats_g: 4,
      fiber_g: 12
    },
    serving_size: '1 cup (200g)',
    ingredients: ['red lentils', 'berbere', 'onions', 'garlic', 'ginger'],
    preparation_time_min: 35,
    cultural_significance: 'Staple fasting food, protein-rich and filling',
    best_for: ['Fasting', 'Protein', 'Weight loss'],
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'
  },

  // SIDE DISHES
  {
    id: 'gomen',
    name: 'Gomen',
    name_amharic: 'ጎመን',
    name_tigrinya: 'ሓምሊ',
    category: 'side',
    is_vegan: true,
    is_fasting_appropriate: true,
    nutrition: {
      calories: 80,
      protein_g: 5,
      carbs_g: 12,
      fats_g: 2,
      fiber_g: 6
    },
    serving_size: '1 cup (150g)',
    ingredients: ['collard greens', 'onions', 'garlic', 'ginger'],
    preparation_time_min: 25,
    cultural_significance: 'Healthy side dish, rich in vitamins and minerals',
    best_for: ['Vitamins', 'Weight loss', 'Digestion'],
    image_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400'
  },
  {
    id: 'azifa',
    name: 'Azifa',
    name_amharic: 'አዚፋ',
    name_tigrinya: 'በርቂ',
    category: 'side',
    is_vegan: true,
    is_fasting_appropriate: true,
    nutrition: {
      calories: 150,
      protein_g: 9,
      carbs_g: 22,
      fats_g: 3,
      fiber_g: 8
    },
    serving_size: '1 cup (150g)',
    ingredients: ['green lentils', 'mustard', 'lemon juice', 'onions', 'jalapeño'],
    preparation_time_min: 15,
    cultural_significance: 'Refreshing lentil salad, perfect for fasting',
    best_for: ['Fasting', 'Light meals', 'Summer'],
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
  },

  // BREAKFAST
  {
    id: 'ful-medames',
    name: 'Ful Medames',
    name_amharic: 'ፉል',
    name_tigrinya: 'ፉል',
    category: 'breakfast',
    is_vegan: true,
    is_fasting_appropriate: true,
    nutrition: {
      calories: 180,
      protein_g: 10,
      carbs_g: 30,
      fats_g: 2,
      fiber_g: 10
    },
    serving_size: '1 cup (200g)',
    ingredients: ['fava beans', 'cumin', 'garlic', 'lemon juice', 'olive oil'],
    preparation_time_min: 20,
    cultural_significance: 'Traditional breakfast, especially popular during fasting',
    best_for: ['Breakfast', 'Fasting', 'Energy'],
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'
  },
  {
    id: 'firfir',
    name: 'Firfir',
    name_amharic: 'ፍርፍር',
    name_tigrinya: 'ፍርፍር',
    category: 'breakfast',
    is_vegan: false,
    is_fasting_appropriate: false,
    nutrition: {
      calories: 220,
      protein_g: 8,
      carbs_g: 28,
      fats_g: 10,
      fiber_g: 3
    },
    serving_size: '1 plate (200g)',
    ingredients: ['shredded injera', 'berbere sauce', 'clarified butter', 'onions'],
    preparation_time_min: 15,
    cultural_significance: 'Popular breakfast using leftover injera',
    best_for: ['Breakfast', 'Leftover utilization', 'Quick meals'],
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400'
  },

  // BEVERAGES
  {
    id: 'ethiopian-coffee',
    name: 'Ethiopian Coffee (Bunna)',
    name_amharic: 'ቡና',
    name_tigrinya: 'ቡን',
    category: 'beverage',
    is_vegan: true,
    is_fasting_appropriate: true,
    nutrition: {
      calories: 5,
      protein_g: 0,
      carbs_g: 0,
      fats_g: 0,
      fiber_g: 0,
      sugar_g: 0
    },
    serving_size: '1 cup (240ml)',
    ingredients: ['coffee beans', 'water', 'sugar (optional)'],
    preparation_time_min: 30,
    cultural_significance: 'Coffee ceremony is sacred ritual, birthplace of coffee',
    best_for: ['Social bonding', 'Energy', 'Tradition'],
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400'
  },
  {
    id: 'tella',
    name: 'Tella',
    name_amharic: 'ጠላ',
    name_tigrinya: 'ሱዋ',
    category: 'beverage',
    is_vegan: true,
    is_fasting_appropriate: false,
    nutrition: {
      calories: 120,
      protein_g: 2,
      carbs_g: 15,
      fats_g: 0,
      fiber_g: 0,
      sugar_g: 3
    },
    serving_size: '1 glass (300ml)',
    ingredients: ['barley', 'gesho leaves', 'water'],
    preparation_time_min: 10080, // 7 days fermentation
    cultural_significance: 'Traditional homemade beer, served at celebrations',
    best_for: ['Celebrations', 'Social gatherings', 'Cultural events'],
    image_url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400'
  },

  // SNACKS
  {
    id: 'kolo',
    name: 'Kolo',
    name_amharic: 'ቆሎ',
    name_tigrinya: 'ቆሎ',
    category: 'snack',
    is_vegan: true,
    is_fasting_appropriate: true,
    nutrition: {
      calories: 140,
      protein_g: 4,
      carbs_g: 25,
      fats_g: 3,
      fiber_g: 4
    },
    serving_size: '1/4 cup (30g)',
    ingredients: ['roasted barley', 'roasted chickpeas', 'roasted peanuts', 'salt'],
    preparation_time_min: 45,
    cultural_significance: 'Traditional snack served with coffee',
    best_for: ['Snacking', 'Coffee ceremony', 'Travel'],
    image_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400'
  },
  {
    id: 'dabo-kolo',
    name: 'Dabo Kolo',
    name_amharic: 'ዳቦ ቆሎ',
    name_tigrinya: 'ዳቦ ቆሎ',
    category: 'snack',
    is_vegan: false,
    is_fasting_appropriate: false,
    nutrition: {
      calories: 160,
      protein_g: 3,
      carbs_g: 22,
      fats_g: 7,
      fiber_g: 1
    },
    serving_size: '1/3 cup (40g)',
    ingredients: ['wheat flour', 'butter', 'honey', 'berbere', 'eggs'],
    preparation_time_min: 60,
    cultural_significance: 'Crunchy bread snack, popular for road trips',
    best_for: ['Snacking', 'Travel', 'Energy boost'],
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'
  },

  // VEGAN COMBO
  {
    id: 'beyaynetu',
    name: 'Beyaynetu (Vegan Combo)',
    name_amharic: 'በያይነቱ',
    name_tigrinya: 'ዓይነታት',
    category: 'main',
    is_vegan: true,
    is_fasting_appropriate: true,
    nutrition: {
      calories: 450,
      protein_g: 20,
      carbs_g: 70,
      fats_g: 12,
      fiber_g: 18
    },
    serving_size: '1 platter',
    ingredients: ['misir wat', 'gomen', 'tikil gomen', 'shiro', 'azifa', 'injera'],
    preparation_time_min: 60,
    cultural_significance: 'Complete vegan meal, perfect for fasting',
    best_for: ['Fasting', 'Complete meal', 'Sharing'],
    image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400'
  }
];

/**
 * Search Habesha foods
 */
export function searchHabeshaFoods(
  query: string,
  filters?: {
    fastingOnly?: boolean;
    veganOnly?: boolean;
    category?: string;
    maxCalories?: number;
    minProtein?: number;
  }
): HabeshaFood[] {
  let results = HABESHA_FOODS_DATABASE;

  // Apply filters
  if (filters?.fastingOnly) {
    results = results.filter(food => food.is_fasting_appropriate);
  }

  if (filters?.veganOnly) {
    results = results.filter(food => food.is_vegan);
  }

  if (filters?.category) {
    results = results.filter(food => food.category === filters.category);
  }

  if (filters?.maxCalories) {
    results = results.filter(food => food.nutrition.calories <= filters.maxCalories);
  }

  if (filters?.minProtein) {
    results = results.filter(food => food.nutrition.protein_g >= filters.minProtein);
  }

  // Search by query
  if (query) {
    const lower = query.toLowerCase();
    results = results.filter(food =>
      food.name.toLowerCase().includes(lower) ||
      food.name_amharic?.includes(query) ||
      food.name_tigrinya?.includes(query) ||
      food.ingredients.some(ing => ing.toLowerCase().includes(lower)) ||
      food.cultural_significance?.toLowerCase().includes(lower)
    );
  }

  return results;
}

/**
 * Get food by ID
 */
export function getFoodById(id: string): HabeshaFood | undefined {
  return HABESHA_FOODS_DATABASE.find(food => food.id === id);
}

/**
 * Get foods by category
 */
export function getFoodsByCategory(category: string): HabeshaFood[] {
  return HABESHA_FOODS_DATABASE.filter(food => food.category === category);
}

/**
 * Get recommended foods for goal
 */
export function getRecommendedFoods(goal: 'weight_loss' | 'muscle_gain' | 'fasting' | 'energy'): HabeshaFood[] {
  switch (goal) {
    case 'weight_loss':
      return HABESHA_FOODS_DATABASE
        .filter(f => f.nutrition.calories < 200 && f.nutrition.fiber_g > 5)
        .slice(0, 10);
    
    case 'muscle_gain':
      return HABESHA_FOODS_DATABASE
        .filter(f => f.nutrition.protein_g > 15)
        .sort((a, b) => b.nutrition.protein_g - a.nutrition.protein_g)
        .slice(0, 10);
    
    case 'fasting':
      return HABESHA_FOODS_DATABASE
        .filter(f => f.is_fasting_appropriate)
        .slice(0, 10);
    
    case 'energy':
      return HABESHA_FOODS_DATABASE
        .filter(f => f.nutrition.carbs_g > 20)
        .slice(0, 10);
    
    default:
      return [];
  }
}

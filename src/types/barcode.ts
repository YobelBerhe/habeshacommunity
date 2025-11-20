export interface ScannedProduct {
  barcode: string;
  name: string;
  brand: string;
  image?: string;
  serving_size: string;
  servings_per_container: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
    saturated_fat?: number;
    trans_fat?: number;
  };
  health_analysis: {
    approved: boolean;
    health_score: number;
    processing_level: string;
    warnings: string[];
    red_flags: string[];
    positives: string[];
    recommendation: string;
  };
  ingredients?: string[];
  allergens?: string[];
  harmful_ingredients?: string[];
  alternatives?: Array<{
    name: string;
    brand: string;
    why: string;
    image?: string;
  }>;
}

export interface ScanHistory {
  id: string;
  barcode: string;
  product: ScannedProduct;
  scanned_at: string;
  added_to_diary?: boolean;
}

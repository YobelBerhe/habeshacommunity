export interface ValidationRule<T> {
  validate: (value: T, allFilters: Record<string, any>) => boolean;
  message: string;
}

export function validateFilters<T extends Record<string, any>>(
  filters: T,
  rules: Record<keyof T, ValidationRule<any>[]>
): { isValid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};
  
  for (const [key, ruleList] of Object.entries(rules)) {
    const value = filters[key];
    const fieldErrors: string[] = [];
    
    for (const rule of ruleList as ValidationRule<any>[]) {
      if (!rule.validate(value, filters)) {
        fieldErrors.push(rule.message);
      }
    }
    
    if (fieldErrors.length > 0) {
      errors[key] = fieldErrors;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Common validation rules
export const commonRules = {
  required: <T>(message = 'This field is required'): ValidationRule<T> => ({
    validate: (value) => value !== undefined && value !== null && value !== '',
    message,
  }),
  
  minValue: (min: number, message?: string): ValidationRule<number> => ({
    validate: (value) => value === undefined || value >= min,
    message: message || `Must be at least ${min}`,
  }),
  
  maxValue: (max: number, message?: string): ValidationRule<number> => ({
    validate: (value) => value === undefined || value <= max,
    message: message || `Must be at most ${max}`,
  }),
  
  priceRange: (): ValidationRule<any> => ({
    validate: (_, filters) => {
      const { minPrice, maxPrice } = filters;
      if (minPrice && maxPrice) {
        return minPrice <= maxPrice;
      }
      return true;
    },
    message: 'Min price must be less than max price',
  }),
};

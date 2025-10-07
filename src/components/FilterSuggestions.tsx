import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FilterSuggestion {
  label: string;
  filters: Record<string, any>;
  reason: string;
}

interface FilterSuggestionsProps {
  suggestions: FilterSuggestion[];
  onApply: (filters: Record<string, any>) => void;
}

export function FilterSuggestions({ suggestions, onApply }: FilterSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Suggested Filters</h3>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onApply(suggestion.filters)}
            className="w-full text-left p-3 rounded-md bg-background hover:bg-accent transition-colors"
          >
            <div className="font-medium text-sm">{suggestion.label}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {suggestion.reason}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

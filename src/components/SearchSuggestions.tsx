import { Clock, TrendingUp, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchSuggestionsProps {
  recentSearches: string[];
  popularSearches: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
}

export function SearchSuggestions({
  recentSearches,
  popularSearches,
  onSelect,
  onRemove,
}: SearchSuggestionsProps) {
  return (
    <div className="space-y-4 p-4">
      {recentSearches.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Searches
          </h3>
          <div className="space-y-1">
            {recentSearches.map((query, index) => (
              <motion.button
                key={query}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(query)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent rounded-md group"
              >
                <span>{query}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(query);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${query} from history`}
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {popularSearches.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((query, index) => (
              <motion.button
                key={query}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(query)}
                className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-full"
              >
                {query}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

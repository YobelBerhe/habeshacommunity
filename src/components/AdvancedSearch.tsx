import { useState } from 'react';
import { Autocomplete } from './Autocomplete';
import { SearchSuggestions } from './SearchSuggestions';
import { useSmartSearch } from '@/hooks/useSmartSearch';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AdvancedSearchProps {
  onSearch: (query: string) => void;
  searchFn: (query: string) => Promise<any[]>;
  placeholder?: string;
}

export function AdvancedSearch({ onSearch, searchFn, placeholder }: AdvancedSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { history, addToHistory, removeFromHistory } = useSearchHistory();
  const { query, setQuery, results, isSearching } = useSmartSearch({
    searchFn,
    minQueryLength: 2,
  });

  const popularSearches = ['mentors', 'housing', 'jobs', 'events'];

  const handleSearch = (searchQuery: string) => {
    addToHistory(searchQuery);
    onSearch(searchQuery);
    setIsFocused(false);
  };

  const handleSelect = (item: any) => {
    const searchQuery = item.title || item.name || query;
    handleSearch(searchQuery);
  };

  return (
    <Popover open={isFocused && (query.length === 0 || results.length > 0)}>
      <PopoverTrigger asChild>
        <div onFocus={() => setIsFocused(true)} onBlur={() => setTimeout(() => setIsFocused(false), 200)}>
          <Autocomplete
            value={query}
            onChange={setQuery}
            onSelect={handleSelect}
            suggestions={results}
            isLoading={isSearching}
            placeholder={placeholder}
            displayValue={(item) => item.title || item.name}
          />
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        {query.length === 0 && (
          <SearchSuggestions
            recentSearches={history}
            popularSearches={popularSearches}
            onSelect={(q) => {
              setQuery(q);
              handleSearch(q);
            }}
            onRemove={removeFromHistory}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

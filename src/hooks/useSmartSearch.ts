import { useState, useEffect, useCallback, useRef } from 'react';

interface SearchOptions<T> {
  searchFn: (query: string) => Promise<T[]>;
  debounceMs?: number;
  minQueryLength?: number;
  onResults?: (results: T[]) => void;
}

export function useSmartSearch<T>({
  searchFn,
  debounceMs = 300,
  minQueryLength = 2,
  onResults,
}: SearchOptions<T>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < minQueryLength) {
      setResults([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsSearching(true);
    setError(null);

    try {
      const searchResults = await searchFn(searchQuery);
      setResults(searchResults);
      onResults?.(searchResults);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError('Search failed. Please try again.');
        console.error('Search error:', err);
      }
    } finally {
      setIsSearching(false);
    }
  }, [searchFn, minQueryLength, onResults]);

  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    clearSearch,
  };
}

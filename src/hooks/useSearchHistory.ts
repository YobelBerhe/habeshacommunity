import { useState, useEffect } from 'react';

const STORAGE_KEY = 'hn.search.history';
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    
    setHistory(prev => {
      const filtered = prev.filter(q => q !== query);
      return [query, ...filtered].slice(0, MAX_HISTORY);
    });
  };

  const removeFromHistory = (query: string) => {
    setHistory(prev => prev.filter(q => q !== query));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}

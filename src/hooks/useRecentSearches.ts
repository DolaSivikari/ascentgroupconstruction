import { useState, useEffect } from 'react';

const STORAGE_KEY = 'navigation_recent_searches';
const MAX_RECENT_SEARCHES = 10;
const MAX_AGE_DAYS = 30;

interface RecentSearch {
  query: string;
  timestamp: number;
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setRecentSearches([]);
        return;
      }

      const searches: RecentSearch[] = JSON.parse(stored);
      const cutoffTime = Date.now() - (MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
      
      // Filter out old searches and extract queries
      const validSearches = searches
        .filter(s => s.timestamp > cutoffTime)
        .map(s => s.query);
      
      setRecentSearches(validSearches);
    } catch (error) {
      console.error('Failed to load recent searches:', error);
      setRecentSearches([]);
    }
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const searches: RecentSearch[] = stored ? JSON.parse(stored) : [];
      
      // Remove duplicate if exists
      const filtered = searches.filter(s => s.query.toLowerCase() !== query.toLowerCase());
      
      // Add new search at the beginning
      const updated = [
        { query: query.trim(), timestamp: Date.now() },
        ...filtered
      ].slice(0, MAX_RECENT_SEARCHES);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentSearches(updated.map(s => s.query));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  const removeSearch = (query: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const searches: RecentSearch[] = JSON.parse(stored);
      const filtered = searches.filter(s => s.query !== query);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setRecentSearches(filtered.map(s => s.query));
    } catch (error) {
      console.error('Failed to remove search:', error);
    }
  };

  const clearRecentSearches = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  };

  return {
    recentSearches,
    addRecentSearch,
    removeSearch,
    clearRecentSearches
  };
}

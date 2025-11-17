import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'navigation_history';
const MAX_HISTORY_ITEMS = 8;

export interface NavigationHistoryItem {
  path: string;
  name: string;
  timestamp: number;
  category: string;
}

export function useNavigationHistory() {
  const [history, setHistory] = useState<NavigationHistoryItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setHistory([]);
        return;
      }

      const items: NavigationHistoryItem[] = JSON.parse(stored);
      setHistory(items.slice(0, MAX_HISTORY_ITEMS));
    } catch (error) {
      console.error('Failed to load navigation history:', error);
      setHistory([]);
    }
  };

  const trackNavigation = (name: string, category: string) => {
    if (!name || !category || location.pathname === '/') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const items: NavigationHistoryItem[] = stored ? JSON.parse(stored) : [];
      
      // Remove duplicate paths
      const filtered = items.filter(item => item.path !== location.pathname);
      
      // Add new item at the beginning
      const updated = [
        {
          path: location.pathname,
          name,
          timestamp: Date.now(),
          category
        },
        ...filtered
      ].slice(0, MAX_HISTORY_ITEMS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setHistory(updated);
    } catch (error) {
      console.error('Failed to track navigation:', error);
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const getRecentlyViewed = (limit: number = 5) => {
    return history.slice(0, limit);
  };

  return {
    history,
    trackNavigation,
    clearHistory,
    getRecentlyViewed
  };
}

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseAutoSaveOptions {
  interval?: number; // milliseconds
  enabled?: boolean;
  storageKey: string;
}

export const useAutoSave = <T extends Record<string, any>>(
  data: T,
  onSave: (data: T) => Promise<void>,
  options: UseAutoSaveOptions
) => {
  const { interval = 30000, enabled = true, storageKey } = options;
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const previousDataRef = useRef<string>('');

  // Save to localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        data,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  // Load from localStorage
  const loadFromLocalStorage = (): { data: T; timestamp: string } | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return null;
  };

  // Clear localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);
    
    // Skip if data hasn't changed
    if (currentData === previousDataRef.current) return;
    
    previousDataRef.current = currentData;
    
    // Save to localStorage immediately
    saveToLocalStorage();

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for database sync
    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSave(data);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, interval, onSave, storageKey]);

  return {
    lastSaved,
    isSaving,
    loadFromLocalStorage,
    clearLocalStorage,
    saveToLocalStorage,
  };
};

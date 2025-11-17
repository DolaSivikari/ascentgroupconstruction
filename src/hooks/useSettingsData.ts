import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseSettingsDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSettingsData<T = any>(
  tableName: string,
  selectQuery: string = '*'
): UseSettingsDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try maybeSingle first (returns null if no rows or multiple rows)
      const { data: result, error: fetchError } = await (supabase as any)
        .from(tableName)
        .select(selectQuery)
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError) throw fetchError;
      
      // If no result from maybeSingle, try getting the latest updated row
      if (!result) {
        const { data: latestResult } = await (supabase as any)
          .from(tableName)
          .select(selectQuery)
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (latestResult) {
          console.warn(`Multiple active rows found in ${tableName}, using latest updated`);
          setData(latestResult as T);
          return;
        }
      }
      
      setData(result as T);
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching ${tableName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchData };
}

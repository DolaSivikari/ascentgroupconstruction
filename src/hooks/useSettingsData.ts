import { useCallback, useEffect, useState } from 'react';
import { fetchActiveSettingsRow } from '@/hooks/useActiveSettings';

interface UseSettingsDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSettingsData<T = unknown>(
  tableName: string,
  selectQuery: string = '*'
): UseSettingsDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchActiveSettingsRow<T>(tableName, selectQuery);

      if (result.warning) {
        console.warn(result.warning);
      }

      if (!result.data) {
        setError(new Error(result.warning || `No active settings found in ${tableName}`));
      }

      setData(result.data);
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching ${tableName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [tableName, selectQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

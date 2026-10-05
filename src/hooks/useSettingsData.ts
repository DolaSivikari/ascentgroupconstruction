import { useCallback, useEffect, useState } from "react";
import { fetchActiveSettingsRow } from "@/hooks/useActiveSettings";
import type { Database } from "@/integrations/supabase/types";

interface UseSettingsDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSettingsData<T = any>(
  tableName: string,
  selectQuery: string,
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

      setData(result.data);
    } catch (err) {
      setData(null);
      setError(
        err instanceof Error
          ? err
          : Object.assign(
              new Error(
                String(
                  (err as { message?: string })?.message ||
                    "Could not load settings.",
                ),
              ),
              { code: (err as { code?: string })?.code },
            ),
      );
      console.error(`Error fetching ${tableName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [tableName, selectQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const refresh = (event: Event) => {
      if ((event as CustomEvent).detail === tableName) void fetchData();
    };
    window.addEventListener("ascent-settings-updated", refresh);
    return () => window.removeEventListener("ascent-settings-updated", refresh);
  }, [tableName, fetchData]);
  return { data, loading, error, refetch: fetchData };
}

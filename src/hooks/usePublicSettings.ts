import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  visitorSupabase,
  PUBLIC_SETTINGS_PROJECTIONS,
} from "@/lib/publicSettings";
export function usePublicSettings<T>(
  table: keyof typeof PUBLIC_SETTINGS_PROJECTIONS,
) {
  const client = useQueryClient();
  useEffect(() => {
    const refresh = (event: Event) => {
      if ((event as CustomEvent).detail === table)
        void client.invalidateQueries({ queryKey: ["public-settings", table] });
    };
    window.addEventListener("ascent-settings-updated", refresh);
    return () => window.removeEventListener("ascent-settings-updated", refresh);
  }, [client, table]);
  return useQuery({
    queryKey: ["public-settings", table],
    queryFn: async () => {
      const { data, error } = await visitorSupabase
        .from(table)
        .select(PUBLIC_SETTINGS_PROJECTIONS[table])
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as unknown as T | null;
    },
    staleTime: 60_000,
    retry: false,
  });
}

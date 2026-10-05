import { useQuery } from "@tanstack/react-query";
import { visitorSupabase } from "@/lib/publicSettings";
/** Both the public build switch and server readiness must be enabled. */
export function useIntakeEnabled() {
  const configured = import.meta.env.VITE_INTAKE_V2_ENABLED === "true";
  const { data } = useQuery({
    queryKey: ["intake-v2-readiness"],
    enabled: configured,
    queryFn: async () => {
      const result = await visitorSupabase.functions.invoke("intake-status", {
        body: {},
      });
      return !result.error && result.data?.enabled === true;
    },
    staleTime: 60000,
    retry: false,
  });
  return configured && data === true;
}

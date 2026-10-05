import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { logError } from "@/utils/errorLogger";

/** Live updates are optional; an unavailable socket must not break the HTTP list. */
export const useRealtimeProjects = (refreshProjects: () => void) => {
  const refresh = useRef(refreshProjects);
  refresh.current = refreshProjects;

  useEffect(() => {
    let channel: RealtimeChannel | undefined;
    let active = true;
    let reported = false;
    const reportFailure = (reason: unknown) => {
      if (!active || reported) return;
      reported = true;
      void logError(
        reason instanceof Error ? reason : new Error(String(reason)),
        { feature: "projects-realtime", fallback: "HTTP project list" },
      );
    };

    try {
      // Keep the reference even if subscribe throws, so cleanup can remove it.
      channel = supabase.channel("public-projects-changes");
      channel
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "projects" },
          () => {
            // Re-read only published rows, including after unpublishing/deletion.
            // Applying events to an empty initial snapshot would lose updates.
            if (active) refresh.current();
          },
        )
        .subscribe((status, error) => {
          if (status === "SUBSCRIBED") reported = false;
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            reportFailure(
              error || new Error(`Project live updates: ${status}`),
            );
          }
        });
    } catch (error) {
      reportFailure(error);
    }

    return () => {
      active = false;
      if (channel) {
        const reportCleanup = (error: unknown) => {
          void logError(
            error instanceof Error ? error : new Error(String(error)),
            {
              feature: "projects-realtime-cleanup",
            },
          );
        };
        try {
          void supabase.removeChannel(channel).catch(reportCleanup);
        } catch (error) {
          reportCleanup(error);
        }
      }
    };
  }, []);
};

import { useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SearchAnalyticsData {
  search_query: string;
  results_count: number;
  section_distribution?: Record<string, number>;
  clicked_result_name?: string;
  clicked_result_link?: string;
}

// Generate or retrieve a session ID for anonymous tracking
const getSessionId = (): string => {
  const SESSION_KEY = "search_session_id";
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
};

export function useSearchAnalytics() {
  const sessionId = useRef(getSessionId());
  const lastTrackedQuery = useRef<string>("");
  const trackingTimeout = useRef<NodeJS.Timeout>();

  // Debounced search tracking to avoid excessive database writes
  const trackSearch = useCallback(async (data: SearchAnalyticsData) => {
    // Avoid tracking empty queries or duplicate consecutive searches
    if (!data.search_query.trim() || data.search_query === lastTrackedQuery.current) {
      return;
    }

    lastTrackedQuery.current = data.search_query;

    // Clear any pending tracking
    if (trackingTimeout.current) {
      clearTimeout(trackingTimeout.current);
    }

    // Debounce the tracking by 1 second
    trackingTimeout.current = setTimeout(async () => {
      try {
        await supabase.from("search_analytics").insert({
          search_query: data.search_query.toLowerCase().trim(),
          results_count: data.results_count,
          section_distribution: data.section_distribution,
          user_session_id: sessionId.current,
          searched_at: new Date().toISOString(),
        });
      } catch (error) {
        // Silently fail - analytics shouldn't break the user experience
        console.debug("Search analytics tracking failed:", error);
      }
    }, 1000);
  }, []);

  // Track when a user clicks on a search result
  const trackResultClick = useCallback(async (
    searchQuery: string,
    resultName: string,
    resultLink: string
  ) => {
    try {
      await supabase.from("search_analytics").insert({
        search_query: searchQuery.toLowerCase().trim(),
        results_count: 1, // We know they found at least one result they clicked
        clicked_result_name: resultName,
        clicked_result_link: resultLink,
        user_session_id: sessionId.current,
        searched_at: new Date().toISOString(),
      });
    } catch (error) {
      console.debug("Result click tracking failed:", error);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (trackingTimeout.current) {
        clearTimeout(trackingTimeout.current);
      }
    };
  }, []);

  return {
    trackSearch,
    trackResultClick,
  };
}

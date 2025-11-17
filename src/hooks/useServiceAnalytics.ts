import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Get unique user identifier
const getUserIdentifier = () => {
  let identifier = localStorage.getItem('user_identifier');
  if (!identifier) {
    identifier = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('user_identifier', identifier);
  }
  return identifier;
};

// Get session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

interface AnalyticsEvent {
  service_link: string;
  service_name: string;
  event_type: 'impression' | 'click' | 'conversion';
  position?: number;
  variant?: string;
  source?: string;
}

export const useServiceAnalytics = () => {
  const queryClient = useQueryClient();

  // Track analytics event
  const trackEvent = useMutation({
    mutationFn: async (event: AnalyticsEvent) => {
      const { error } = await supabase
        .from('popular_services_analytics')
        .insert({
          ...event,
          user_identifier: getUserIdentifier(),
          session_id: getSessionId(),
          source: event.source || 'mobile_nav',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate analytics queries
      queryClient.invalidateQueries({ queryKey: ['service-analytics'] });
    },
  });

  // Track service interaction
  const trackInteraction = useMutation({
    mutationFn: async ({
      serviceLink,
      timeSpent = 0,
      fromPopular = false,
    }: {
      serviceLink: string;
      timeSpent?: number;
      fromPopular?: boolean;
    }) => {
      const { error } = await supabase.rpc('track_service_interaction', {
        p_user_identifier: getUserIdentifier(),
        p_service_link: serviceLink,
        p_time_spent: timeSpent,
        p_from_popular: fromPopular,
      });

      if (error) throw error;
    },
  });

  // Get analytics dashboard data
  const useAnalyticsDashboard = () => {
    return useQuery({
      queryKey: ['service-analytics', 'dashboard'],
      queryFn: async () => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { data, error } = await supabase
          .from('popular_services_analytics')
          .select('*')
          .gte('created_at', oneWeekAgo.toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Calculate metrics
        const impressions = data.filter(d => d.event_type === 'impression').length;
        const clicks = data.filter(d => d.event_type === 'click').length;
        const conversions = data.filter(d => d.event_type === 'conversion').length;
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
        const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

        // Service performance
        const servicePerformance = data.reduce((acc, item) => {
          if (!acc[item.service_link]) {
            acc[item.service_link] = {
              name: item.service_name,
              impressions: 0,
              clicks: 0,
              conversions: 0,
            };
          }
          if (item.event_type === 'impression') acc[item.service_link].impressions++;
          if (item.event_type === 'click') acc[item.service_link].clicks++;
          if (item.event_type === 'conversion') acc[item.service_link].conversions++;
          return acc;
        }, {} as Record<string, { name: string; impressions: number; clicks: number; conversions: number }>);

        return {
          summary: {
            impressions,
            clicks,
            conversions,
            ctr: ctr.toFixed(2),
            conversionRate: conversionRate.toFixed(2),
          },
          servicePerformance: Object.entries(servicePerformance).map(([link, data]) => ({
            link,
            ...data,
            ctr: data.impressions > 0 ? ((data.clicks / data.impressions) * 100).toFixed(2) : '0',
          })),
          recentEvents: data.slice(0, 50),
        };
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  return {
    trackEvent: trackEvent.mutate,
    trackInteraction: trackInteraction.mutate,
    useAnalyticsDashboard,
    getUserIdentifier,
  };
};

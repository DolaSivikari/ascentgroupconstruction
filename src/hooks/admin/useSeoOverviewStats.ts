import { useMemo } from 'react';
import type { AnalyticsSnapshot, SeoContentItem, SEOSettings } from '@/pages/admin/seo/types';

interface SeoOverviewStats {
  totalPages: number;
  avgSeoScore: number;
  totalViews: number;
  indexedPages: number;
}

export const useSeoOverviewStats = (
  seoSettings: SEOSettings[],
  analytics: AnalyticsSnapshot[],
  contentItems: SeoContentItem[]
): SeoOverviewStats => {
  return useMemo(() => {
    const avgSeoScore =
      contentItems.length > 0
        ? Math.round(contentItems.reduce((sum, item) => sum + item.seoScore, 0) / contentItems.length)
        : 0;

    const totalViews = analytics.reduce((sum, a) => sum + a.page_views, 0);

    return {
      totalPages: seoSettings.length,
      avgSeoScore,
      totalViews,
      indexedPages: contentItems.length,
    };
  }, [seoSettings, analytics, contentItems]);
};

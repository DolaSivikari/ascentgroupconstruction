import { useMemo } from 'react';
import type {
  DailyMetrics,
  PageMetrics,
  QueryMetrics,
  SearchConsoleData,
} from '@/pages/admin/seo/types';

interface AggregatedMetrics {
  totalClicks: number;
  totalImpressions: number;
  avgCTR: number;
  avgPosition: number;
  previousClicks: number;
  previousImpressions: number;
}

export const useSearchConsoleMetrics = (rows: SearchConsoleData[]) => {
  return useMemo(() => {
    const empty: AggregatedMetrics = {
      totalClicks: 0,
      totalImpressions: 0,
      avgCTR: 0,
      avgPosition: 0,
      previousClicks: 0,
      previousImpressions: 0,
    };

    if (!rows.length) {
      return {
        metrics: empty,
        dailyMetrics: [] as DailyMetrics[],
        topPages: [] as PageMetrics[],
        topQueries: [] as QueryMetrics[],
        clicksChange: 0,
        impressionsChange: 0,
      };
    }

    const halfwayPoint = Math.floor(rows.length / 2);
    const recent = rows.slice(halfwayPoint);
    const previous = rows.slice(0, halfwayPoint);

    const totalClicks = recent.reduce((s, r) => s + r.clicks, 0);
    const totalImpressions = recent.reduce((s, r) => s + r.impressions, 0);
    const avgCTR = (recent.reduce((s, r) => s + r.ctr, 0) / recent.length) * 100;
    const avgPosition = recent.reduce((s, r) => s + r.position, 0) / recent.length;
    const previousClicks = previous.reduce((s, r) => s + r.clicks, 0);
    const previousImpressions = previous.reduce((s, r) => s + r.impressions, 0);

    const metrics: AggregatedMetrics = {
      totalClicks,
      totalImpressions,
      avgCTR,
      avgPosition,
      previousClicks,
      previousImpressions,
    };

    // Daily aggregation
    const dailyMap = new Map<string, DailyMetrics>();
    rows.forEach((row) => {
      const existing = dailyMap.get(row.date);
      if (existing) {
        existing.clicks += row.clicks;
        existing.impressions += row.impressions;
      } else {
        dailyMap.set(row.date, {
          date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr * 100,
          position: row.position,
        });
      }
    });

    // Top pages
    const pageMap = new Map<string, PageMetrics>();
    rows.forEach((row) => {
      const existing = pageMap.get(row.page_path);
      if (existing) {
        existing.clicks += row.clicks;
        existing.impressions += row.impressions;
      } else {
        pageMap.set(row.page_path, {
          page_path: row.page_path,
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr,
          position: row.position,
        });
      }
    });

    // Top queries
    const queryMap = new Map<string, QueryMetrics>();
    rows.forEach((row) => {
      const existing = queryMap.get(row.query);
      if (existing) {
        existing.clicks += row.clicks;
        existing.impressions += row.impressions;
      } else {
        queryMap.set(row.query, {
          query: row.query,
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr,
          position: row.position,
        });
      }
    });

    const clicksChange =
      previousClicks > 0 ? ((totalClicks - previousClicks) / previousClicks) * 100 : 0;
    const impressionsChange =
      previousImpressions > 0
        ? ((totalImpressions - previousImpressions) / previousImpressions) * 100
        : 0;

    return {
      metrics,
      dailyMetrics: Array.from(dailyMap.values()),
      topPages: Array.from(pageMap.values()).sort((a, b) => b.clicks - a.clicks).slice(0, 10),
      topQueries: Array.from(queryMap.values()).sort((a, b) => b.impressions - a.impressions).slice(0, 10),
      clicksChange,
      impressionsChange,
    };
  }, [rows]);
};

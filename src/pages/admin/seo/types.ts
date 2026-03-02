export interface SEOSettings {
  id: string;
  entity_type: string;
  entity_id: string;
  permalink: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  focus_keyword: string;
  seo_score: number;
}

export interface AnalyticsSnapshot {
  page_path: string;
  page_views: number;
  unique_visitors: number;
  avg_time_on_page: number;
  bounce_rate: number;
}

export interface SearchConsoleData {
  page_path: string;
  query: string;
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SeoContentItem {
  id: string;
  type: string;
  seoScore: number;
  displayTitle: string;
  url: string;
  recommendations: string[];
}

export interface DailyMetrics {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PageMetrics {
  page_path: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface QueryMetrics {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

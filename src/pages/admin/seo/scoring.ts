interface ScoringInput {
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  featured_image?: string | null;
  content?: string | null;
  long_description?: string | null;
}

export type SeoContentKind = 'blog' | 'service' | 'project';

export interface SeoScoreResult {
  score: number;
  recommendations: string[];
}

/**
 * Calculate SEO score (0-100) for a content item with field-level recommendations.
 * - Title: 30pts (30-60 chars)
 * - Description: 30pts (120-160 chars)
 * - Keywords: 20pts
 * - Featured image: 10pts
 * - Content length: 10pts
 */
export const calculateSEOScore = (item: ScoringInput, type: SeoContentKind): SeoScoreResult => {
  let score = 0;
  const recommendations: string[] = [];

  // Title (30/100)
  if (item.seo_title) {
    if (item.seo_title.length >= 30 && item.seo_title.length <= 60) {
      score += 30;
    } else {
      score += 15;
      recommendations.push(
        `${type === 'blog' ? 'Title' : 'SEO title'} should be 30-60 characters (currently ${item.seo_title.length})`,
      );
    }
  } else {
    recommendations.push('Add an SEO title');
  }

  // Description (30/100)
  if (item.seo_description) {
    if (item.seo_description.length >= 120 && item.seo_description.length <= 160) {
      score += 30;
    } else {
      score += 15;
      recommendations.push(
        `Meta description should be 120-160 characters (currently ${item.seo_description.length})`,
      );
    }
  } else {
    recommendations.push('Add a meta description');
  }

  // Keywords (20/100)
  if (item.seo_keywords && item.seo_keywords.length > 0) {
    score += 20;
  } else {
    recommendations.push('Add SEO keywords');
  }

  // Featured image (10/100)
  if (item.featured_image) {
    score += 10;
  } else {
    recommendations.push('Add a featured image');
  }

  // Content length (10/100)
  if (type === 'blog' && item.content && item.content.length > 300) {
    score += 10;
  } else if ((type === 'service' || type === 'project') && item.long_description && item.long_description.length > 150) {
    score += 10;
  } else {
    recommendations.push('Add more content for better SEO');
  }

  return { score, recommendations };
};

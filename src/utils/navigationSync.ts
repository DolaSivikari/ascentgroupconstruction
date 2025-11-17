import { supabase } from "@/integrations/supabase/client";

export interface NavigationSyncResult {
  isValid: boolean;
  missingSlugs: string[];
  unpublishedSlugs: string[];
  extraSlugs: string[];
}

/**
 * Navigation service slugs that should be published and accessible
 * Keep this in sync with navigation-structure-enhanced.ts
 */
export const EXPECTED_SERVICE_SLUGS = [
  // Building Envelope Systems
  'eifs-stucco-sealant',
  'cladding-systems',
  'protective-coatings',
  'waterproofing',
  
  // Interior Construction
  'interior-buildouts',
  'painting-services',
  'tile-flooring',
];

/**
 * Validates that all navigation service links have corresponding published services in database
 */
export async function validateNavigationSync(): Promise<NavigationSyncResult> {
  const { data: publishedServices, error } = await supabase
    .from('services')
    .select('slug, publish_state')
    .eq('publish_state', 'published');

  if (error) {
    console.error('Error fetching services for sync validation:', error);
    return {
      isValid: false,
      missingSlugs: EXPECTED_SERVICE_SLUGS,
      unpublishedSlugs: [],
      extraSlugs: [],
    };
  }

  const publishedSlugs = publishedServices?.map(s => s.slug) || [];
  
  // Find services in navigation but not published in database
  const missingSlugs = EXPECTED_SERVICE_SLUGS.filter(
    slug => !publishedSlugs.includes(slug)
  );

  // Find services published in database but not in navigation
  const extraSlugs = publishedSlugs.filter(
    slug => !EXPECTED_SERVICE_SLUGS.includes(slug)
  );

  // Check for services that exist but aren't published
  const { data: allServices } = await supabase
    .from('services')
    .select('slug, publish_state')
    .in('slug', EXPECTED_SERVICE_SLUGS);

  const unpublishedSlugs = allServices
    ?.filter(s => s.publish_state !== 'published')
    .map(s => s.slug) || [];

  return {
    isValid: missingSlugs.length === 0 && unpublishedSlugs.length === 0,
    missingSlugs,
    unpublishedSlugs,
    extraSlugs,
  };
}

/**
 * Gets a human-readable description of sync issues
 */
export function getSyncIssuesDescription(result: NavigationSyncResult): string {
  const issues: string[] = [];

  if (result.missingSlugs.length > 0) {
    issues.push(`Missing from database: ${result.missingSlugs.join(', ')}`);
  }

  if (result.unpublishedSlugs.length > 0) {
    issues.push(`Not published: ${result.unpublishedSlugs.join(', ')}`);
  }

  if (result.extraSlugs.length > 0) {
    issues.push(`Not in navigation: ${result.extraSlugs.join(', ')}`);
  }

  return issues.join(' | ');
}

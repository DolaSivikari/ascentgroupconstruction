/**
 * Meta Tag Generator
 * Generates comprehensive meta tags for SEO and social sharing
 */

const SITE_URL = 'https://ascentgroupconstruction.com';
const DEFAULT_IMAGE = '/og-image.jpg';

export interface PageMeta {
  // Basic
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
  
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile' | 'product';
  
  // Twitter
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  
  // Article specific
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  
  // Local SEO
  geoRegion?: string;
  geoPlacename?: string;
  geoPosition?: string;
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
  rel?: string;
  href?: string;
}

/**
 * Generate comprehensive meta tags from PageMeta config
 */
export function generateMetaTags(meta: PageMeta, pathname: string): MetaTag[] {
  const fullTitle = meta.title.includes('Ascent') 
    ? meta.title 
    : `${meta.title} | Ascent Group Construction`;
  
  const canonicalUrl = meta.canonical || `${SITE_URL}${pathname}`;
  const ogImage = meta.ogImage || DEFAULT_IMAGE;
  const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  const tags: MetaTag[] = [
    // Basic Meta
    { name: 'description', content: meta.description },
    { name: 'robots', content: meta.noindex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1' },
    { name: 'googlebot', content: 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1' },
    { name: 'bingbot', content: 'index,follow' },
    
    // Open Graph
    { property: 'og:title', content: meta.ogTitle || fullTitle },
    { property: 'og:description', content: meta.ogDescription || meta.description },
    { property: 'og:image', content: fullImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `${fullTitle} - Preview` },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: meta.ogType || 'website' },
    { property: 'og:locale', content: 'en_CA' },
    { property: 'og:site_name', content: 'Ascent Group Construction' },
    
    // Twitter
    { name: 'twitter:card', content: meta.twitterCard || 'summary_large_image' },
    { name: 'twitter:title', content: meta.twitterTitle || fullTitle },
    { name: 'twitter:description', content: meta.twitterDescription || meta.description },
    { name: 'twitter:image', content: meta.twitterImage || fullImageUrl },
    { name: 'twitter:image:alt', content: `${fullTitle} - Preview` },
    
    // Geo/Local
    { name: 'geo.region', content: meta.geoRegion || 'CA-ON' },
    { name: 'geo.placename', content: meta.geoPlacename || 'Toronto' },
    { name: 'geo.position', content: meta.geoPosition || '43.7615;-79.4111' },
    { name: 'ICBM', content: '43.7615, -79.4111' },
    
    // Language
    { httpEquiv: 'content-language', content: 'en-CA' },
    { name: 'language', content: 'English' },
  ];
  
  // Keywords if provided
  if (meta.keywords?.length) {
    tags.push({ name: 'keywords', content: meta.keywords.join(', ') });
  }
  
  // Article meta
  if (meta.publishedTime) {
    tags.push(
      { property: 'article:published_time', content: meta.publishedTime },
      { property: 'og:type', content: 'article' }
    );
    
    if (meta.modifiedTime) {
      tags.push({ property: 'article:modified_time', content: meta.modifiedTime });
    }
    if (meta.author) {
      tags.push({ property: 'article:author', content: meta.author });
    }
    if (meta.section) {
      tags.push({ property: 'article:section', content: meta.section });
    }
    if (meta.tags?.length) {
      meta.tags.forEach(tag => {
        tags.push({ property: 'article:tag', content: tag });
      });
    }
  }
  
  return tags.filter(t => t.content);
}

/**
 * Default SEO values for different page types
 */
export const defaultMeta: Record<string, Partial<PageMeta>> = {
  home: {
    title: 'Ascent Group Construction | Ontario Building Envelope & Restoration Specialists',
    description: 'Ontario building envelope & interior trades contractor. Professional execution of EIFS, masonry, painting, and restoration work. Serving property managers, GCs, and building owners across the GTA.',
    keywords: ['building envelope contractor', 'facade remediation', 'waterproofing', 'Ontario contractor', 'GTA construction'],
  },
  services: {
    title: 'Our Services',
    description: 'Comprehensive building envelope and restoration services including facade remediation, waterproofing, EIFS, masonry restoration, cladding systems, and protective coatings.',
    keywords: ['construction services', 'building envelope', 'facade remediation', 'waterproofing', 'EIFS', 'masonry restoration'],
  },
  projects: {
    title: 'Our Projects',
    description: 'View our portfolio of completed building envelope, restoration, and construction projects across Ontario and the Greater Toronto Area.',
    keywords: ['construction projects', 'portfolio', 'case studies', 'completed projects', 'GTA construction'],
  },
  about: {
    title: 'About Us',
    description: 'Learn about Ascent Group Construction, Ontario\'s specialty contractor for building envelope and restoration services. Founded by experienced construction professionals.',
    keywords: ['about us', 'construction company', 'specialty contractor', 'Ontario', 'GTA'],
  },
  contact: {
    title: 'Contact Us',
    description: 'Contact Ascent Group Construction for building envelope, restoration, and construction services in Ontario and the GTA. Call 647-528-6804 or email us.',
    keywords: ['contact', 'quote request', 'construction quote', 'GTA contractor'],
  },
  blog: {
    title: 'Blog & Insights',
    description: 'Expert insights, industry news, and project case studies from Ascent Group Construction. Stay informed about building envelope and restoration best practices.',
    keywords: ['construction blog', 'industry insights', 'case studies', 'building envelope news'],
  },
  faq: {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about building envelope, restoration services, project timelines, costs, and working with Ascent Group Construction.',
    keywords: ['FAQ', 'construction questions', 'building envelope FAQ', 'contractor questions'],
  },
};

/**
 * Generate page title with proper formatting
 */
export function formatPageTitle(title: string, includeCompany = true): string {
  if (title.toLowerCase().includes('ascent')) {
    return title;
  }
  return includeCompany ? `${title} | Ascent Group Construction` : title;
}

/**
 * Truncate description to SEO-friendly length
 */
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Generate keywords from content
 */
export function extractKeywords(text: string, maxKeywords = 10): string[] {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'they', 'their', 'them', 'we', 'our', 'us', 'you', 'your'];
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

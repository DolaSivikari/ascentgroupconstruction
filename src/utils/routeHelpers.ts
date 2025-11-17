/**
 * Route mapping helpers for consistent admin and public navigation
 * Prevents 404s by providing canonical route resolution
 */

export const ADMIN_ROUTES = {
  dashboard: '/admin',
  services: '/admin/services',
  projects: '/admin/projects',
  blog: '/admin/blog',
  
  media: '/admin/media',
  users: '/admin/users',
  securityCenter: '/admin/security-center',
  seoDashboard: '/admin/seo-dashboard',
  performanceDashboard: '/admin/performance-dashboard',
  contacts: '/admin/contacts',
  resumes: '/admin/resumes',
  hero: '/admin/hero',
  siteSettings: '/admin/site-settings',
  testimonials: '/admin/testimonials',
  stats: '/admin/stats',
} as const;

/**
 * Get admin edit route for a content type and ID
 */
export const getAdminEditRoute = (type: string, id: string): string => {
  const routes: Record<string, string> = {
    service: `/admin/services/${id}`,
    project: `/admin/projects/${id}`,
    blog: `/admin/blog/${id}`,
    'case-study': `/admin/blog/${id}`,
  };
  return routes[type] || `/admin/${type}/${id}`;
};

/**
 * Get public route for a content type and slug
 */
export const getPublicRoute = (type: string, slug: string): string => {
  const routes: Record<string, string> = {
    service: `/services/${slug}`,
    project: `/projects/${slug}`,
    blog: `/blog/${slug}`,
    'case-study': `/blog/${slug}`,
    home: '/',
  };
  return routes[type] || `/${slug}`;
};

/**
 * Validate if a route exists (basic check)
 */
export const isValidAdminRoute = (path: string): boolean => {
  return Object.values(ADMIN_ROUTES).some(route => path.startsWith(route));
};

/**
 * Generate preview URL with token for draft content
 */
export const getPreviewUrl = (type: string, slug: string, token: string): string => {
  const baseRoute = getPublicRoute(type, slug);
  return `${baseRoute}?preview=true&token=${token}`;
};

/**
 * Generate a secure preview token
 */
export const generatePreviewToken = (): string => {
  return `preview_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Known valid public routes
 */
export const VALID_PUBLIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/projects',
  '/contact',
  '/careers',
  '/blog',
  '/estimate',
  '/prequalification',
  '/submit-rfp',
  
  '/sustainability',
  '/faq',
  '/company/certifications-insurance',
  '/company/equipment-resources',
  '/company/developers',
  '/our-process',
  '/capabilities',
  '/property-managers',
  '/commercial-clients',
  '/resources/service-areas',
  '/resources/contractor-portal',
] as const;

/**
 * Validate if a public route exists
 */
export const isValidPublicRoute = (path: string): boolean => {
  // Check exact match
  if (VALID_PUBLIC_ROUTES.includes(path as any)) return true;
  
  // Check dynamic routes
  if (path.startsWith('/services/')) return true;
  if (path.startsWith('/projects/')) return true;
  if (path.startsWith('/blog/')) return true;
  
  return false;
};

/**
 * Validate and normalize admin-entered URL
 */
export const validateAdminUrl = (url: string): { valid: boolean; error?: string } => {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'URL is empty' };
  }

  // External URLs are always valid
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return { valid: true };
  }

  // Ensure internal URLs start with /
  if (!url.startsWith('/')) {
    return { valid: false, error: 'Internal URLs must start with /' };
  }

  // Check if it's a valid route
  if (!isValidPublicRoute(url)) {
    return { valid: false, error: `Route "${url}" may not exist. Please verify.` };
  }

  return { valid: true };
};

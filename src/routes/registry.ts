export const PUBLIC_ROUTE_PATTERNS = [
  "/",
  "/about",
  "/services",
  "/services/:slug",
  "/markets",
  "/projects",
  "/projects/:slug",
  "/blog",
  "/blog/:slug",
  "/case-studies",
  "/case-study/:slug",
  "/contact",
  "/estimate",
  "/careers",
  "/faq",
  "/prequalification",
  "/capabilities",
  "/our-process",
  "/why-specialty-contractor",
  "/submit-rfp",
  "/commercial-clients",
  "/property-managers",
  "/for-general-contractors",
  "/for-architects",
  "/emergency-repair",
  "/homeowners",
  "/company/certifications-insurance",

  "/company/developers",
  "/company/technology",
  "/resources/service-areas",
  "/resources/contractor-portal",
  "/service-areas/:city",
  "/tekev",
  "/unsubscribe",
  "/admin",
  "/privacy",
  "/terms",
  "/accessibility",
  "/404",
] as const;

export const ADMIN_ROUTES = {
  dashboard: "/admin",
  pageHeaders: "/admin/page-headers",
  services: "/admin/services",
  servicesManager: "/admin/services-manager",
  projects: "/admin/projects",
  blog: "/admin/blog",
  media: "/admin/media",
  emailDelivery: "/admin/email-delivery",
  audit: "/admin/audit",
  monitoring: "/admin/monitoring",
  users: "/admin/users",
  seoDashboard: "/admin/seo-dashboard",
  performanceDashboard: "/admin/performance-dashboard",
  contacts: "/admin/contacts",
  resumes: "/admin/resumes",
  hero: "/admin/hero-images",
  siteSettings: "/admin/settings?tab=general",
  testimonials: "/admin/testimonials",
  stats: "/admin/stats",
  inbox: "/admin/inbox",
} as const;

export const ALL_KNOWN_ROUTE_PATTERNS: readonly string[] = [
  ...PUBLIC_ROUTE_PATTERNS,
  ...Object.values(ADMIN_ROUTES),
];

export const routePatternToRegex = (pattern: string): RegExp => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const normalized = escaped.replace(/:[\w]+/g, "[^/]+");
  return new RegExp(`^${normalized}$`);
};

export const isKnownRoute = (
  path: string,
  patterns: readonly string[] = ALL_KNOWN_ROUTE_PATTERNS,
): boolean => {
  return patterns.some((pattern) => routePatternToRegex(pattern).test(path));
};

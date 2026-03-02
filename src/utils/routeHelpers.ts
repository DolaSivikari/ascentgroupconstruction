/**
 * Route mapping helpers for consistent admin and public navigation.
 */

import { ADMIN_ROUTES as CANONICAL_ADMIN_ROUTES, PUBLIC_ROUTE_PATTERNS, isKnownRoute } from '@/routes/registry';

export const ADMIN_ROUTES = {
  ...CANONICAL_ADMIN_ROUTES,
} as const;

export const getAdminEditRoute = (type: string, id: string): string => {
  const routes: Record<string, string> = {
    service: `/admin/services/${id}`,
    project: `/admin/projects/${id}`,
    blog: `/admin/blog/${id}`,
    'case-study': `/admin/blog/${id}`,
  };
  return routes[type] || `/admin/${type}/${id}`;
};

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

export const isValidAdminRoute = (path: string): boolean => {
  const normalized = (path.split('#')[0] ?? '').split('?')[0] ?? '';
  return Object.values(ADMIN_ROUTES).some((route) => normalized.startsWith(route.split('?')[0] ?? ''));
  const normalized = path.split('#')[0].split('?')[0];
  return Object.values(ADMIN_ROUTES).some((route) => normalized.startsWith(route.split('?')[0]));
};

export const getPreviewUrl = (type: string, slug: string, token: string): string => {
  const baseRoute = getPublicRoute(type, slug);
  return `${baseRoute}?preview=true&token=${token}`;
};

export const generatePreviewToken = (): string => {
  return `preview_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

export const VALID_PUBLIC_ROUTES = [...PUBLIC_ROUTE_PATTERNS] as const;

export const isValidPublicRoute = (path: string): boolean => {
  const normalized = (path.split('#')[0] ?? '').split('?')[0] ?? '';
  const normalized = path.split('#')[0].split('?')[0];
  return isKnownRoute(normalized, VALID_PUBLIC_ROUTES);
};

export const validateAdminUrl = (url: string): { valid: boolean; error?: string } => {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'URL is empty' };
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return { valid: true };
  }

  if (!url.startsWith('/')) {
    return { valid: false, error: 'Internal URLs must start with /' };
  }

  if (!isValidPublicRoute(url)) {
    return { valid: false, error: `Route "${url}" may not exist. Please verify.` };
  }

  return { valid: true };
};

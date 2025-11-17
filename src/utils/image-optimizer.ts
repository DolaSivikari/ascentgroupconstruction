/**
 * Image optimization utilities for generating srcset, sizes, and responsive image URLs
 */

export interface SrcSetOptions {
  baseUrl: string;
  widths?: number[];
  formats?: ('webp' | 'avif' | 'jpg')[];
}

export interface ResponsiveSizes {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}

/**
 * Standard responsive widths for srcset generation
 */
export const STANDARD_WIDTHS = [400, 800, 1200, 1600, 2000];

/**
 * Generate srcset string for responsive images
 * @param baseUrl - Base image URL
 * @param widths - Array of widths to generate
 * @returns Formatted srcset string
 * 
 * @example
 * generateSrcSet('/images/hero.jpg', [400, 800, 1200])
 * // Returns: '/images/hero.jpg?w=400 400w, /images/hero.jpg?w=800 800w, /images/hero.jpg?w=1200 1200w'
 */
export const generateSrcSet = (
  baseUrl: string,
  widths: number[] = STANDARD_WIDTHS
): string => {
  return widths
    .map(width => `${baseUrl}?w=${width} ${width}w`)
    .join(', ');
};

/**
 * Generate sizes attribute for responsive images
 * @param sizes - Object defining sizes for different breakpoints
 * @returns Formatted sizes string
 * 
 * @example
 * generateSizes({ mobile: '100vw', tablet: '50vw', desktop: '33vw' })
 * // Returns: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
 */
export const generateSizes = (sizes: ResponsiveSizes): string => {
  const parts: string[] = [];
  
  if (sizes.mobile) {
    parts.push(`(max-width: 768px) ${sizes.mobile}`);
  }
  if (sizes.tablet) {
    parts.push(`(max-width: 1200px) ${sizes.tablet}`);
  }
  if (sizes.desktop) {
    parts.push(sizes.desktop);
  }
  
  // Default fallback
  if (parts.length === 0) {
    return '100vw';
  }
  
  return parts.join(', ');
};

/**
 * Calculate aspect ratio from dimensions
 * @param width - Image width
 * @param height - Image height
 * @returns Aspect ratio string (e.g., '16/9')
 */
export const calculateAspectRatio = (width: number, height: number): string => {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
};

/**
 * Validate if image dimensions match target aspect ratio
 * @param width - Image width
 * @param height - Image height
 * @param targetRatio - Target aspect ratio (e.g., 16/9, 4/3)
 * @param tolerance - Acceptable deviation (default: 0.01)
 * @returns Boolean indicating if aspect ratio matches
 */
export const validateAspectRatio = (
  width: number,
  height: number,
  targetRatio: string,
  tolerance: number = 0.01
): boolean => {
  const [targetWidth, targetHeight] = targetRatio.split('/').map(Number);
  const actualRatio = width / height;
  const expectedRatio = targetWidth / targetHeight;
  
  return Math.abs(actualRatio - expectedRatio) <= tolerance;
};

/**
 * Generate multiple format URLs for <picture> element
 * @param baseUrl - Base image URL (without extension)
 * @param formats - Array of formats to generate
 * @returns Object with URLs for each format
 * 
 * @example
 * generateFormatUrls('/images/hero', ['avif', 'webp', 'jpg'])
 * // Returns: { avif: '/images/hero.avif', webp: '/images/hero.webp', jpg: '/images/hero.jpg' }
 */
export const generateFormatUrls = (
  baseUrl: string,
  formats: ('webp' | 'avif' | 'jpg')[] = ['avif', 'webp', 'jpg']
): Record<string, string> => {
  const baseWithoutExt = baseUrl.replace(/\.[^/.]+$/, '');
  
  return formats.reduce((acc, format) => {
    acc[format] = `${baseWithoutExt}.${format}`;
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Get optimal image width based on viewport size
 * @param viewportWidth - Current viewport width
 * @param containerWidth - Container width (as percentage or px)
 * @returns Optimal image width
 */
export const getOptimalWidth = (
  viewportWidth: number,
  containerWidth: string = '100vw'
): number => {
  // Parse container width
  let width = viewportWidth;
  
  if (containerWidth.endsWith('vw')) {
    const percentage = parseFloat(containerWidth) / 100;
    width = viewportWidth * percentage;
  } else if (containerWidth.endsWith('px')) {
    width = parseFloat(containerWidth);
  }
  
  // Round up to nearest standard width
  const standardWidth = STANDARD_WIDTHS.find(w => w >= width);
  return standardWidth || STANDARD_WIDTHS[STANDARD_WIDTHS.length - 1];
};

/**
 * Check if image format is modern (WebP or AVIF)
 * @param url - Image URL
 * @returns Boolean indicating if format is modern
 */
export const isModernFormat = (url: string): boolean => {
  return /\.(webp|avif)$/i.test(url);
};

/**
 * Convert legacy format to modern format URL
 * @param url - Original image URL
 * @param preferredFormat - Preferred modern format (default: 'webp')
 * @returns URL with modern format
 */
export const convertToModernFormat = (
  url: string,
  preferredFormat: 'webp' | 'avif' = 'webp'
): string => {
  return url.replace(/\.(jpg|jpeg|png)$/i, `.${preferredFormat}`);
};

/**
 * Lazy loading configuration for images
 */
export const LAZY_LOAD_CONFIG = {
  rootMargin: '50px',
  threshold: 0.01,
};

/**
 * Image quality presets for different use cases
 */
export const QUALITY_PRESETS = {
  thumbnail: { webp: 60, avif: 50, jpg: 70 },
  standard: { webp: 85, avif: 75, jpg: 80 },
  highQuality: { webp: 95, avif: 85, jpg: 90 },
} as const;

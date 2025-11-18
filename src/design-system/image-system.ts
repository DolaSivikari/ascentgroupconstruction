/**
 * Unified Image Treatment System
 * Standardized aspect ratios and image handling across the site
 */

/**
 * Standard aspect ratios for consistent image presentation
 */
export const ASPECT_RATIOS = {
  /** Hero sections, banners - 16:9 */
  hero: 'aspect-[16/9]',
  /** Project images, service cards - 4:3 */
  card: 'aspect-[4/3]',
  /** Portrait shots, team photos - 3:4 */
  portrait: 'aspect-[3/4]',
  /** Square images - 1:1 */
  square: 'aspect-square',
  /** Wide panoramic shots - 21:9 */
  wide: 'aspect-[21/9]',
} as const;

/**
 * Standard image treatments
 */
export const IMAGE_STYLES = {
  /** Base image container with border radius */
  container: 'overflow-hidden rounded-[var(--radius-lg)]',
  
  /** Image with smooth hover zoom */
  zoom: 'transition-transform duration-500 group-hover:scale-110',
  
  /** Grayscale to color on hover */
  colorReveal: 'grayscale group-hover:grayscale-0 transition-all duration-300',
  
  /** Standard object cover */
  cover: 'w-full h-full object-cover',
  
  /** Object contain for logos */
  contain: 'w-full h-full object-contain',
} as const;

/**
 * Combined image treatment patterns
 */
export const IMAGE_PATTERNS = {
  /** Project card image - 4:3 with zoom */
  projectCard: `${ASPECT_RATIOS.card} ${IMAGE_STYLES.container}`,
  
  /** Hero image - 16:9 with zoom */
  hero: `${ASPECT_RATIOS.hero} ${IMAGE_STYLES.container}`,
  
  /** Team photo - Square with color reveal */
  team: `${ASPECT_RATIOS.square} ${IMAGE_STYLES.container}`,
  
  /** Service card - 4:3 with color reveal */
  serviceCard: `${ASPECT_RATIOS.card} ${IMAGE_STYLES.container}`,
} as const;

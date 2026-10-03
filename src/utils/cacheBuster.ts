/**
 * Cache-busting utility for API requests and asset URLs
 * Ensures users always get fresh content after CMS updates
 */

// Vite's hashed bundle URL is stable across visits and changes on a deployment.
const APP_VERSION = new URL(import.meta.url).pathname;
const VERSION_KEY = 'app_deployment_version';
const LAST_CHECK_KEY = 'last_version_check';
const CACHE_PREFIXES = ['app-precache-', 'app-runtime-', 'app-api-'];

// Expose build version for quick diagnostics
if (typeof window !== 'undefined') {
  (window as Window & { __BUILD_VERSION?: string }).__BUILD_VERSION = APP_VERSION;
}

/**
 * Add cache-busting query parameter to URL
 */
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${encodeURIComponent(APP_VERSION)}`;
};

/**
 * Force reload with cache invalidation
 */
export const bustCache = (): void => {
  // Explicit admin action only; preserve the current URL, query and auth state.
  void clearAllCaches().then(() => window.location.reload());
};

/**
 * Get current cache version
 */
export const getCacheVersion = (): string => APP_VERSION;

/**
 * Check if cache needs refresh (compares stored vs current version)
 */
export const needsCacheRefresh = (): boolean => {
  const storedVersion = localStorage.getItem('app_version');
  return storedVersion !== APP_VERSION;
};

/**
 * Mark cache as refreshed
 */
export const markCacheRefreshed = (): void => {
  localStorage.setItem('app_version', APP_VERSION);
  localStorage.setItem('last_cache_refresh', new Date().toISOString());
};

/**
 * Check if a new deployment has occurred
 */
export const checkForDeploymentUpdate = async (): Promise<boolean> => {
  try {
    const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
    const now = Date.now();
    
    // Only check once per minute.
    if (lastCheck && now - parseInt(lastCheck) < 60000) {
      return false;
    }
    
    localStorage.setItem(LAST_CHECK_KEY, now.toString());
    
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const currentVersion = APP_VERSION;
    
    localStorage.setItem(VERSION_KEY, currentVersion);
    return !!storedVersion && storedVersion !== currentVersion;
  } catch (error) {
    console.error('[Cache Buster] Error checking for updates:', error);
    return false;
  }
};

/**
 * Clear all caches without reloading (caller handles reload)
 */
export const clearAllCaches = async (): Promise<void> => {
  try {
    // Only unregister this application's worker, never another worker on the origin.
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      const ownRegs = regs.filter(reg => [reg.active, reg.waiting, reg.installing].some(worker => {
        if (!worker) return false;
        const url = new URL(worker.scriptURL);
        return url.origin === window.location.origin && url.pathname === '/service-worker.js';
      }));
      await Promise.all(ownRegs.map(reg => reg.unregister()));
    }

    // Clear service worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.filter(name => CACHE_PREFIXES.some(prefix => name.startsWith(prefix)))
        .map(name => caches.delete(name)));
    }

    // Clear localStorage version
    localStorage.removeItem(VERSION_KEY);
    localStorage.removeItem(LAST_CHECK_KEY);

    if (import.meta.env.DEV) console.log('[Cache Buster] All caches cleared');
  } catch (error) {
    console.error('[Cache Buster] Error clearing caches:', error);
  }
};

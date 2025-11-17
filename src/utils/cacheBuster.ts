/**
 * Cache-busting utility for API requests and asset URLs
 * Ensures users always get fresh content after CMS updates
 */

const APP_VERSION = Date.now().toString();
const VERSION_KEY = 'app_deployment_version';
const LAST_CHECK_KEY = 'last_version_check';

// Expose build version for quick diagnostics
if (typeof window !== 'undefined') {
  // @ts-ignore
  (window as any).__BUILD_VERSION = APP_VERSION;
}

/**
 * Add cache-busting query parameter to URL
 */
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${APP_VERSION}`;
};

/**
 * Force reload with cache invalidation
 */
export const bustCache = (): void => {
  const timestamp = Date.now();
  
  // Clear service worker caches if available
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach(name => caches.delete(name));
    });
  }
  
  // Force reload with new timestamp
  window.location.search = `?v=${timestamp}`;
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
    
    // Only check once per hour
    if (lastCheck && now - parseInt(lastCheck) < 60000) {
      return false;
    }
    
    localStorage.setItem(LAST_CHECK_KEY, now.toString());
    
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const currentVersion = APP_VERSION;
    
    if (storedVersion && storedVersion !== currentVersion) {
      return true;
    }
    
    localStorage.setItem(VERSION_KEY, currentVersion);
    return false;
  } catch (error) {
    console.error('[Cache Buster] Error checking for updates:', error);
    return false;
  }
};

/**
 * Clear all caches and force reload
 */
export const clearAllCaches = async (): Promise<void> => {
  try {
    // Ask active SW (if any) to clear its caches first
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try { navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' }); } catch {}
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
      console.log('[Cache Buster] Unregistered all service workers');
    }

    // Clear service worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('[Cache Buster] Cleared all service worker caches');
    }

    // Clear localStorage version
    localStorage.removeItem(VERSION_KEY);
    localStorage.removeItem(LAST_CHECK_KEY);

    // Force hard reload
    window.location.reload();
  } catch (error) {
    console.error('[Cache Buster] Error clearing caches:', error);
  }
};

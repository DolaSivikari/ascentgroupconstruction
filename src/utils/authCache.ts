const CACHE_KEY = 'admin-auth-verified';
const CACHE_DURATION = 30000; // 30 seconds

interface AuthCache {
  isAdmin: boolean;
  timestamp: number;
}

export const getAuthCache = (): AuthCache | null => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: AuthCache = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - data.timestamp < CACHE_DURATION) {
      return data;
    }
    
    // Cache expired
    clearAuthCache();
    return null;
  } catch {
    return null;
  }
};

export const setAuthCache = (isAdmin: boolean): void => {
  try {
    const data: AuthCache = {
      isAdmin,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if sessionStorage is not available
  }
};

export const clearAuthCache = (): void => {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // Silently fail
  }
};

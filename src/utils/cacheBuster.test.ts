import { afterEach, describe, expect, it, vi } from 'vitest';
import { addCacheBuster, checkForDeploymentUpdate, clearAllCaches, getCacheVersion } from './cacheBuster';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('deployment cache management', () => {
  it('uses a stable bundle version rather than a new timestamp on every visit', async () => {
    const version = getCacheVersion();
    vi.spyOn(Date, 'now').mockReturnValue(1000);
    expect(await checkForDeploymentUpdate()).toBe(false);
    vi.spyOn(Date, 'now').mockReturnValue(100000);
    expect(await checkForDeploymentUpdate()).toBe(false);
    expect(getCacheVersion()).toBe(version);
    expect(addCacheBuster('/photo.webp')).toContain(encodeURIComponent(version));
  });

  it('records a changed deployment so the same change is not detected repeatedly', async () => {
    localStorage.setItem('app_deployment_version', 'previous-build');
    expect(await checkForDeploymentUpdate()).toBe(true);
    localStorage.removeItem('last_version_check');
    expect(await checkForDeploymentUpdate()).toBe(false);
  });

  it('explicit cache clearing preserves other caches, workers and auth storage', async () => {
    const ownUnregister = vi.fn().mockResolvedValue(true);
    const otherUnregister = vi.fn().mockResolvedValue(true);
    vi.stubGlobal('navigator', {
      serviceWorker: {
        getRegistrations: vi.fn().mockResolvedValue([
          { active: { scriptURL: `${window.location.origin}/service-worker.js` }, unregister: ownUnregister },
          { active: { scriptURL: `${window.location.origin}/other-worker.js` }, unregister: otherUnregister },
        ]),
      },
    });
    const deleteCache = vi.fn().mockResolvedValue(true);
    vi.stubGlobal('caches', {
      keys: vi.fn().mockResolvedValue(['app-runtime-4.0.0', 'app-api-4.0.0', 'another-app-cache']),
      delete: deleteCache,
    });
    localStorage.setItem('auth-fixture', 'preserve');
    localStorage.setItem('cookieConsent', 'accepted');
    await clearAllCaches();
    expect(ownUnregister).toHaveBeenCalledTimes(1);
    expect(otherUnregister).not.toHaveBeenCalled();
    expect(deleteCache.mock.calls.map(([name]) => name)).toEqual(['app-runtime-4.0.0', 'app-api-4.0.0']);
    expect(localStorage.getItem('auth-fixture')).toBe('preserve');
    expect(localStorage.getItem('cookieConsent')).toBe('accepted');
  });
});

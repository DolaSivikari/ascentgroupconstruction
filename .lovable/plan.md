

# Diagnosis: Published Site Blank Page

## Root Cause Found

I fetched both published URLs (`ascentgroupconstruction.lovable.app` and `www.ascentgroupconstruction.com`) -- both return a **blank white page**. The preview works perfectly.

The published HTML has `<div id="root"></div>` (empty) with the static fallback hidden by `display: none !important` CSS. When the React JS bundle fails to load or execute, **there is nothing visible**. The page is blank because:

1. **The service worker** (`public/service-worker.js`) may be caching a stale/broken version of the HTML or JS assets from a previous deploy, preventing the new build from loading
2. **The `index.html` has no visible fallback** when JS fails -- the `#root` is empty and `.static-content` is hidden by inline CSS

## Plan

### 1. Add a visible loading indicator inside `#root`
Add a simple CSS-only loading spinner inside `<div id="root">` so users see *something* while React loads. React's `createRoot().render()` will replace this content automatically.

### 2. Bump the service worker cache version
Update `CACHE_VERSION` in `public/service-worker.js` to force cache invalidation on next visit. This ensures stale cached assets from broken deploys are cleared.

### 3. Clean up leftover landing gateway files
Delete `src/components/landing/LandingWrapper.tsx`, `src/pages/LandingGateway.tsx`, and related files that are no longer referenced in routing.

### 4. Remove `page-loading` CSS that blocks all rendering
The `page-loading` class on `<html>` sets `animation: none !important` on ALL elements. If the class is never removed (because React/JS fails to mount), nothing animates or transitions -- contributing to the "stuck" appearance.  Add a small inline script in `index.html` that removes this class after a timeout as a safety net.

## Technical Details

**`index.html` changes:**
- Add a loading spinner inside `<div id="root">` (replaced when React mounts)
- Add `<script>setTimeout(() => document.documentElement.classList.remove('loading','page-loading'), 3000)</script>` as safety net
- Keep the `<noscript>` static fallback for SEO crawlers

**`public/service-worker.js` changes:**
- Change `CACHE_VERSION` from current value to a new version string to bust all cached assets

After implementing, you will need to click **Publish > Update** to deploy the fixed version. If the service worker is still serving the old cached page, users may need to hard-refresh (Ctrl+Shift+R) or wait for the SW update cycle.


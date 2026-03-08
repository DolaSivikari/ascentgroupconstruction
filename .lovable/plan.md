

# Deep Analysis: Published Site Blank Page

## Root Cause Identified

After extensive analysis, I found **two compounding issues**:

### Issue 1: Malformed `index.html` structure
The `index.html` has a structural error left over from previous edits. There's an **orphan `</div>`** on line 438 that doesn't match any opening tag:

```text
Line 188: <div id="root">         ← opens root
Line 197: </div>                  ← closes root
...
Line 209: <div class="static-content">  ← opens static
Line 437: </div>                  ← closes static
Line 438: </div>                  ← ORPHAN - no matching open tag
Line 439: <script type="module" src="/src/main.tsx">
```

Additionally, `<link rel="preload" as="video">` on line 117 uses an **invalid `as` attribute value** (browsers warn about this on every page load). And there are duplicate `<title>` and `<meta name="description">` tags (lines 124-127) that could confuse Vite's HTML processing.

### Issue 2: Service Worker precaching HTML
The service worker precaches `/` and `/index.html` during install (line 16-25 of `service-worker.js`). Once the old service worker cached a broken/old version of the HTML, even after bumping `CACHE_VERSION`, the OLD service worker still controls the page until the browser fetches and installs the new one. Since the HTML fetch strategy is network-first, this should work -- but if the deployment hasn't actually updated (due to a failed build from the HTML issues), the SW keeps serving stale content.

## Plan

### 1. Fix `index.html` structure
- Remove orphan `</div>` on line 438
- Remove duplicate `<title>` and `<meta name="description">` tags (keep only lines 126-127)
- Change `<link rel="preload" as="video">` to `<link rel="preload" as="fetch" crossorigin>` (valid preload type)
- Move the `.static-content` div inside `<noscript>` so it only renders when JS is disabled (proper structure for SEO crawlers)

### 2. Add forced SW cleanup script
Add an inline script at the very top of `<body>` (before `#root`) that immediately unregisters all service workers and clears all caches on the first visit after deployment. This nuclear option guarantees the new HTML loads fresh:

```html
<script>
if('serviceWorker' in navigator){
  navigator.serviceWorker.getRegistrations().then(function(r){
    r.forEach(function(reg){reg.unregister()})
  });
  if('caches' in window){caches.keys().then(function(k){
    k.forEach(function(n){caches.delete(n)})
  })}
}
</script>
```

### 3. Remove HTML from SW precache
In `public/service-worker.js`, remove `/` and `/index.html` from the `precacheUrls` array. HTML should NEVER be precached -- the network-first strategy already handles it correctly, and precaching creates the exact stale-content risk we're seeing.

### 4. Bump SW cache version again
Change `CACHE_VERSION` from `2.0.0` to `3.0.0` to ensure the new SW invalidates everything.

## After Implementation
You will need to click **Publish > Update** one more time after these fixes are applied. The SW cleanup script will force-clear all caches on the first visit, ensuring the React app loads fresh.


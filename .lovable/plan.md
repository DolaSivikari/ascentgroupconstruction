

## Mobile Cache Issue — Not a Code Problem

The new mobile navigation **is** deployed correctly (verified `MobileNavSheet.tsx` has the latest flat accordion structure). What you're seeing on your phone is a **cached old version** of the JavaScript bundle. This is a common mobile browser behavior, especially on iOS Safari and Chrome mobile.

## Step 1 — Try these on your phone first (no code changes needed)

These resolve the issue 95% of the time:

**iPhone (Safari):**
1. Open Settings → Safari → **Clear History and Website Data**
2. Or: long-press the reload button in Safari address bar → tap "Reload Without Content Blockers" / hard reload
3. Or: close all Safari tabs, force-quit Safari, reopen

**iPhone (Chrome):**
1. Chrome → ⋯ menu → Settings → Privacy and Security → **Clear Browsing Data** → select "Cached Images and Files" → Clear

**Android (Chrome):**
1. Chrome → ⋮ menu → Settings → Privacy and Security → **Clear Browsing Data** → "Cached images and files" → Clear

**Quickest universal test:** Open the site in a **private/incognito window** on your phone. If the new menu appears there, it's 100% a cache issue.

## Step 2 — If clearing cache doesn't fix it

Then it's a real deployment issue and I should investigate:

1. **Audit which mobile nav component is actually rendered** — confirm `Navigation.tsx` is using the updated `MobileNavSheet.tsx` and there isn't a second/older mobile menu component still wired up somewhere.
2. **Check the production build output** — verify the deployed bundle on `ascentgroupconstruction.com` actually contains the new `MobileNavSheet` code (compare hash of the JS bundle vs preview).
3. **Verify the custom domain isn't pinned to an older deploy** — sometimes custom domain DNS/CDN caching can lag behind the Lovable preview URL.
4. **Add cache-busting** — set `Cache-Control: no-cache` on `index.html` so browsers always fetch fresh asset hashes (the JS bundles themselves are already hash-named, so the real culprit is usually a cached `index.html` pointing to old bundle filenames).

## What I need from you to proceed

**Please try the cache-clear steps above first**, then report back:

- ✅ "Works after clearing cache" → no code changes needed, we're done
- ❌ "Still shows old menu even in incognito / after clearing cache" → I'll dig into Step 2 and ship a fix

Don't approve this as a build task yet — try the cache clear first. If it works, we save a deploy cycle. If it doesn't, I have a clear investigation path ready.


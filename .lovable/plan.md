# Performance fix plan

Lighthouse score is **86 / Performance**. The biggest wins are concentrated in 4 hotspots — fixing them should push score to ~95+ and cut LCP from 2.0s toward ~1.2s.

## What's actually slow

| Hotspot | Today | Cost | Fix |
|---|---|---|---|
| **Header logo PNG** | 1920×986, 246 KB, rendered at 156×80 | ~245 KB wasted on every page | Resize + convert to WebP |
| **Hero poster** | `/hero-poster-1.webp` 274 KB | LCP candidate, no long-term cache | Re-encode smaller + 1-year immutable header |
| **`site_settings` fetched 6× on homepage** | `useCompanySettings` is a raw `useEffect`, called in Navigation, StickyInquiryBar, MobileNavSheet, InteractiveCTA, DirectAnswer | 5 duplicate network round-trips, ~1.9s tail on critical path | Move it into React Query under the same `['site-settings']` key already used by `useSiteSettings` |
| **Forced reflow in `useScrollReveal`** | Calls `getBoundingClientRect()` synchronously in every reveal hook | 38 ms TBT, every component that uses the hook | Defer the read into `requestAnimationFrame` |

## Changes

### 1. Shrink the header logo
- Resize `src/assets/ascent-logo-horizontal-light.png` to ~480×246 (2× display size) and convert to WebP at q=85.
- Same treatment for the dark/round variants used in nav so theme switches don't pull a 250 KB PNG.
- Update imports in `Navigation.tsx` / wherever the logo is loaded.
- Expected: 245 KB → ~15 KB per page load.

### 2. Re-encode the hero poster
- Re-encode `public/hero-poster-1.webp` to ~1600×900 at q=72.
- Bump cache lifetime in `public/_headers`:
  ```
  /hero-poster-*.webp
    Cache-Control: public, max-age=31536000, immutable
  ```
- Expected: 274 KB → ~90 KB and zero refetch on repeat visits.

### 3. Dedupe `site_settings` queries
- Rewrite `src/hooks/useCompanySettings.ts` on top of React Query with `queryKey: ['site-settings']` and `staleTime: 5 * 60 * 1000`, matching `useSiteSettings` exactly so both hooks share the same cache entry.
- Keep the public API (`{ settings, loading, error }`) unchanged so the 5 call sites don't need edits.
- Expected: 6 `site_settings` HTTP calls → 1.

### 4. Fix the forced reflow in `useScrollReveal`
- In `src/hooks/useScrollReveal.ts`, wrap the initial `getBoundingClientRect()` viewport check in `requestAnimationFrame` so React's commit phase has flushed before we read layout, and skip the read entirely if `IntersectionObserver` is supported by using the observer's first synchronous callback for the in-view check instead.
- Expected: 38 ms → ~0 ms TBT contribution from this hook.

## Out of scope (intentionally)

- **`chunk-charts` (recharts) saving 88 KB** — already isolated to its own chunk and only imported by admin pages. Lighthouse flags it because a `<link rel="modulepreload">` is emitted; this is a Vite default and removing it requires touching build config. Low ROI on a public-page audit.
- **Render-blocking CSS (110 ms)** — comes from the single hashed `index.css`. Splitting would hurt cacheability on internal pages where it pays off. Skip.
- **Unsplash image (351 KB)** — comes from a CMS-driven testimonial/project record, not code. Surface to the user as a separate content task if they want to fix it.
- **Minify JavaScript (62 KB)** — Lighthouse compares against terser; we already use esbuild minify. Switching costs build time without changing UX meaningfully.

## Risk

All four changes are localized. The logo swap and poster re-encode are visual — quick eyeball before merging. The React Query refactor of `useCompanySettings` keeps the return shape identical so call sites don't change. The `useScrollReveal` change preserves the same "skip animation if already in view" semantics.

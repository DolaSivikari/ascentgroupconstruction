# 🔎 Deep Site Audit — Findings & Fix Plan

I scanned the **entire codebase**: 299 components, 56 pages, 58 hooks, public assets, routing, design system, accessibility, and code hygiene. Here's everything I found, ranked by impact.

---

## 🔴 CRITICAL — Performance & Bundle

### 1. No code splitting on public pages
`src/routes/AppRoutes.tsx` **eagerly imports 30+ pages** at the top of the file (Index, About, Services, Projects, Contact, Estimate, FAQ, ContractorPortal, Technology, Capabilities, Markets, etc.). The `lazy()` helper is defined but never used for these pages.
**Impact:** First-load JS bundle is ~30+ pages worth of code on every visit.
**Fix:** Convert non-critical routes to `lazyWithFallback(...)`. Keep `Index`, `Navigation`, `Footer` eager. Lazy-load: admin pages, blog, FAQ, technology, careers, prequalification, RFP, legal pages.

### 2. Hero video is 13 MB
`public/hero-clipchamp.mp4` is **13 MB** — unacceptable for an LCP-adjacent asset.
**Fix:** Re-encode at 1080p H.264 CRF 28 + AAC 96kbps (~2–3 MB target), or serve as WebM/AV1 with MP4 fallback. Add `preload="metadata"` instead of `auto`.

### 3. Unused public assets shipping to production
- `public/hero-poster-2.webp` through `hero-poster-6.webp` (5 files, ~1.1 MB total) — referenced in `service-worker.js` precache but **not used anywhere in the app**.
- `public/apple-touch-icon.png` (2.2 MB!) — apple-touch-icons should be 180×180 PNG, ~10 KB.
- `public/favicon.png` (231 KB) — favicons should be ~5–15 KB.
**Fix:** Delete unused posters (or wire them into the rotating hero slides), regenerate apple-touch-icon at 180×180, regenerate favicon at 32×32.

### 4. Service worker precaches non-existent assets
`public/service-worker.js` precaches `hero-poster-1` through `hero-poster-6` but only `hero-poster-1` is actually used. SW install warnings on every fresh visit.
**Fix:** Trim precache list to assets actually referenced.

---

## 🟠 HIGH — Code Health

### 5. Duplicate component files
- `src/design-system/components/Card.tsx` AND `src/ui/Card.tsx` (the `ui/` one is marked `@deprecated`)
- `src/components/sections/Section.tsx` AND `src/ui/Section.tsx`
- `src/components/FilterBar.tsx` AND a second `FilterBar.tsx`
- `src/components/PageHero.tsx` AND a second `PageHero.tsx`
**Fix:** Pick canonical source of truth, migrate imports, delete deprecated copies.

### 6. Largest files need refactoring
| File | Lines |
|---|---|
| `src/pages/admin/SEODashboard.tsx` | **1,117** |
| `src/pages/company/Technology.tsx` | **996** |
| `src/components/homepage/EnhancedHero.tsx` | 696 |
| `src/pages/admin/BlogPostEditor.tsx` | 628 |
| `src/pages/ProjectDetail.tsx` | 618 |
| `src/pages/ServiceDetail.tsx` | 610 |

These are hard to maintain. **Fix:** Extract sub-sections into their own components (especially Technology and SEODashboard).

### 7. `: any` usage (74 hits across 15 files)
Worst offenders: `ProjectEditor.tsx` (9), `WhyChooseUsManager.tsx` (8), `webVitals.ts` (6), `SEODashboard.tsx` (5), `Projects.tsx` (5).
**Fix:** Replace `any` with proper Supabase row types from `src/integrations/supabase/types.ts`.

### 8. 73 `console.log/warn/error` statements in src
Top: `main.tsx` (10), `SEODashboard.tsx` (6), `usePerformanceMonitoring.ts` (6), `errorLogger.ts` (5), `cacheBuster.ts` (5).
**Fix:** Wrap in `if (import.meta.env.DEV)` or strip via build config; keep `console.error` in error boundaries only.

---

## 🟡 MEDIUM — Design System Compliance

### 9. ~96 hardcoded Tailwind color classes
Violations of the design token system (Navy/Charcoal/Steel Blue):
- `text-yellow-400`, `text-gray-300` in `StarRating.tsx`
- `bg-green-600`, `bg-yellow-600` in `ProjectGallery.tsx` (category tabs)
- `bg-yellow-500` in `BlogPost.tsx` preview banner
- `text-green-500`, `text-yellow-500`, `text-red-500` across `HealthCheckTab.tsx`, `Unsubscribe.tsx`, `FilterBar.tsx`
- `text-red-300/50/400` in `toast.tsx`
**Fix:** Map to semantic tokens — `text-success`, `text-warning`, `text-destructive` defined in `tokens.css`. Add the missing tokens if not present.

### 10. 163 inline `style={{...}}` usages
Many likely unnecessary. **Fix:** Audit and migrate to Tailwind classes where possible (keep dynamic values like animation delays, computed widths).

---

## 🟢 LOW — Accessibility & Polish

### 11. Decorative img with empty alt is correct (verified)
False positive on initial scan — `EnhancedHero.tsx` correctly uses `alt=""` on decorative previous-poster crossfade. No action needed.

### 12. 121 `useEffect(() => {})` — many likely missing dependency arrays
**Fix:** Run `eslint-plugin-react-hooks` exhaustive-deps and address warnings.

### 13. SEO consistency
99 occurrences of "Error in" / "Failed to" patterns suggest inconsistent error messaging surfaced to users. Standardize on toast feedback, not raw error strings.

---

## 📋 Proposed Execution Order

I recommend **3 focused PRs** rather than one giant batch — easier to QA each:

### **Pass 1 — Quick wins (low risk, big impact)** ⭐ Recommended start
- Convert 25+ public routes to lazy-loaded chunks in `AppRoutes.tsx`
- Delete unused hero posters 2–6 (or wire them into hero rotation, your call)
- Fix `service-worker.js` precache list
- Regenerate `apple-touch-icon.png` at 180×180 and `favicon.png` at 32×32
- Resolve duplicate `Card.tsx` / `Section.tsx` (delete deprecated, update imports)
- Strip dev `console.log` from `main.tsx`, `cacheBuster.ts`, `webVitals.ts`

### **Pass 2 — Design system hardening**
- Replace 96 hardcoded color classes with semantic tokens
- Add missing `--success`, `--warning`, `--info` tokens to `tokens.css`
- Audit & remove unnecessary inline styles
- Fix `eslint react-hooks/exhaustive-deps` warnings

### **Pass 3 — Refactoring (medium risk)**
- Split `SEODashboard.tsx` (1,117 lines) into tab components
- Split `Technology.tsx` (996 lines) into section components
- Replace `: any` in admin editors with proper Supabase types
- Re-encode hero video to ~2–3 MB

---

## ❓ Where would you like to start?

Reply with the pass you want me to implement (or pick specific items à la carte):

- **"Pass 1"** — quick wins, ~6 items, low risk, biggest immediate user-visible impact (faster first load, smaller bundle)
- **"Pass 2"** — design system cleanup
- **"Pass 3"** — heavy refactors
- **"All of Pass 1 + delete the unused posters"** — typical recommendation
- Or call out specific items (e.g. "just lazy-load routes and shrink the hero video")

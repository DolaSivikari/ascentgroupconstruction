# Comprehensive Enhancement Plan — 14 Items, 5 Batches

I've grouped your 14 requests into 5 logical batches that share files/concerns, so we minimize duplicate work and avoid merge conflicts. You can approve all, or call out batches to skip.

---

## Batch A — Brand Asset & SEO Image Refresh
*(items: favicon regeneration, OG/SEO meta images, monument-mark accents on 404/loading/transitions, vertical ring logo on About hero)*

**Goal:** Deploy the newly uploaded ringed logo + monument-icon variants consistently across favicon, social previews, and brand-hallmark surfaces.

**Files & changes:**
1. **Copy uploaded assets into `public/`**
   - `LOGO-ICONS-2-2.png` → `public/brand/icon-monument.png` (square monument-only)
   - `LOGO-ICONS-3.png` → `public/brand/icon-monument-ring.png` (ringed hallmark)
   - `yuv-logo-dark-yatay-4.png` → `public/brand/logo-horizontal-dark.png`
   - `yuv-logo-white-yatay-4.png` → `public/brand/logo-horizontal-white.png`
   - `yuv-logo-dark-dikey-2.png` → `public/brand/logo-vertical-dark.png`
   - `yuv-logo-white-dikey-3.png` → `public/brand/logo-vertical-white.png`
2. **Regenerate favicons** — use ImageMagick (via `nix run nixpkgs#imagemagick`) to derive from the monument-only icon:
   - `public/favicon.ico` (16/32/48 multi-res)
   - `public/favicon.png` (32×32, replaces existing)
   - `public/favicon-192.png`, `public/favicon-512.png` (PWA)
   - `public/apple-touch-icon.png` (180×180, replaces the 2.2 MB original — major perf win)
   - `public/og-image.png` (1200×630 social card built from horizontal-dark logo + brand background)
3. **Update `index.html` head** — point all icon/OG/Twitter meta tags at the new local assets; replace the external `storage.googleapis.com` OG URL with `/og-image.png`.
4. **Update `src/components/SEO.tsx`** default `ogImage` to `/og-image.png`.
5. **404 page (`src/pages/NotFound.tsx`)** — render `icon-monument-ring.png` at ~96×96 above the heading as a subtle hallmark.
6. **Loading state (`index.html` spinner + `UnifiedAdminLayout` loader)** — swap the generic spinner for the ringed monument with a slow CSS rotation on the ring only (text/monument static).
7. **Page transition (`PageTransition` component)** — add an optional brand-mark fade indicator for cross-route transitions (subtle, ≤300ms).
8. **About page leadership hero** — add the vertical ring logo (`logo-vertical-dark.png`) as a 120-px accent next to the leadership intro instead of the current wordmark-only treatment.

**Files edited:** `index.html`, `src/components/SEO.tsx`, `src/pages/NotFound.tsx`, `src/pages/About.tsx` (or leadership component), `src/components/admin/UnifiedAdminLayout.tsx`, `src/components/transitions/PageTransition.tsx` (if it exists).
**Files created:** ~6 brand assets in `public/brand/`.

---

## Batch B — Design Token System Hardening
*(items: remaining hardcoded Tailwind color cleanup, refactor Badge to true semantic variants, CONTRIBUTING.md token rules, design-token preview page)*

**Goal:** Finish the Pass-2 token migration and document/showcase the system so it doesn't regress.

**Files & changes:**
1. **Refactor `src/components/ui/badge.tsx`**
   - Replace all hardcoded `hsl(142 76% 36%)`, `hsl(38 92% 50%)`, etc. with the semantic Tailwind utilities (`bg-success`, `bg-warning`, `bg-danger`, `bg-info`) introduced in Pass 2.
   - Collapse duplicate variants (`completed`/`active`/`resolved` → all map to `success`; `contacted` → `info`; `new` → uses `brand-accent`).
   - Keep the public API backward-compatible by aliasing legacy variant names to the new semantic ones.
2. **Sweep remaining ~8 hardcoded color instances** flagged in Pass 2 (mostly intentional dark glass effects). Re-audit and either token-ize or add an inline justification comment so future audits skip them.
3. **Create `src/pages/dev/TokenPreview.tsx`** — a developer-only route (`/dev/tokens`, gated to `import.meta.env.DEV` or admin) showing:
   - 4 columns (success, warning, danger, info) × rows for `bg-{token}`, `text-{token}`, `border-{token}`, plus opacity ramps `/10 /20 /50 /80`.
   - Brand swatches (primary, accent, ink, muted, line, bg-soft).
   - Badge component live demo with every variant + size.
4. **Append a "Design Tokens" section to `CONTRIBUTING.md`** (create file if missing) covering:
   - The semantic palette rule (use `bg-success` not `bg-green-500`).
   - The `mem://design/semantic-color-tokens` reference.
   - 3 do/don't code examples.
   - Link to `/dev/tokens` preview.

**Files edited:** `src/components/ui/badge.tsx`, ~5 remaining files with leftover palette classes, `CONTRIBUTING.md` (new), `src/routes/AppRoutes.tsx` (register dev route).
**Files created:** `src/pages/dev/TokenPreview.tsx`, `CONTRIBUTING.md` (if absent).

---

## Batch C — Dark Mode Toggle
*(item: dark-mode toggle with persisted preference)*

**Goal:** Wire a working light/dark toggle so semantic tokens and glass surfaces adapt across themes.

**Files & changes:**
1. **Install `next-themes`** (already partially used by `sonner.tsx`) — `bun add next-themes`.
2. **Add `<ThemeProvider>`** in `src/main.tsx` wrapping `<App />`, with `attribute="class"`, `defaultTheme="light"`, `enableSystem`.
3. **Define dark-mode HSL variables in `src/styles/tokens.css`** under `.dark { ... }` for: `--bg`, `--bg-soft`, `--ink`, `--muted`, `--line`, `--brand-primary` (slightly lighter for contrast), and `--admin-*` tokens. Semantic feedback colors (`--success`, `--warning`, `--danger`, `--info`) keep their hue but shift lightness ~10% for contrast.
4. **Create `src/components/ui/ThemeToggle.tsx`** — sun/moon icon button that calls `setTheme('light' | 'dark')`. Persistence is automatic via `next-themes` (localStorage key `theme`).
5. **Place the toggle** in the desktop nav (right side, near contact CTA) and mobile menu drawer footer.
6. **Smoke-test glass cards, hero overlays, admin sidebar, and badges** in both themes — adjust any surface that breaks.

**Files edited:** `src/main.tsx`, `src/styles/tokens.css`, navigation components, `package.json`.
**Files created:** `src/components/ui/ThemeToggle.tsx`.

> **Note:** Brand decisions to confirm — should the homepage hero stay forced-light (cinematic feel) or invert in dark mode? Default plan: keep the hero video section forced-light via `class="light"` override; let the rest of the site flip.

---

## Batch D — Performance & Adaptive Media
*(items: lazy-load Search Console components, vendor bundle splitting, WebM/MP4 adaptive hero video)*

**Goal:** Faster admin SEO page + smaller hero payload on modern browsers.

**Files & changes:**
1. **Lazy-load Search Console UI** in `src/pages/admin/SEODashboard.tsx`:
   - Convert `SEODashboardAnalyticsTab` import to `React.lazy(() => import('@/components/admin/seo/SEODashboardAnalyticsTab'))`.
   - Wrap rendering in `<Suspense fallback={<Skeleton/>}>`.
   - This defers `recharts` (~90 KB gz) until the Analytics tab opens.
2. **Vendor bundle splitting** in `vite.config.ts` — add a manual `rollupOptions.output.manualChunks` function that groups:
   - `recharts` + `d3-*` → `chunk-charts`
   - `@tanstack/react-query` → `chunk-query`
   - `framer-motion` → `chunk-motion`
   - `@radix-ui/*` → `chunk-radix`
   > **Caveat:** `mem://tech/production-deployment-reliability` notes "no manualChunks" historically caused blank-page issues. We'll use a *conservative* split (4 well-isolated chunks only) and verify with the smoke-test script after build.
3. **Encode adaptive WebM hero video**
   - Run `ffmpeg -i public/hero-clipchamp.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 -an public/hero-clipchamp.webm` (target ~350-450 KB).
   - Update `src/components/shared/VideoBackground.tsx` to render `<source src=".webm" type="video/webm">` first, MP4 second (browser picks first supported).
   - Add the new file to `service-worker.js` precache list.

**Files edited:** `src/pages/admin/SEODashboard.tsx`, `vite.config.ts`, `src/components/shared/VideoBackground.tsx`, `public/service-worker.js`.
**Files created:** `public/hero-clipchamp.webm`.

---

## Batch E — Code Quality: Type Safety + Tests
*(items: finish `:any` cleanup in ProjectEditor/WhyChooseUsManager/Projects, unit tests for SEO scoring helpers)*

**Goal:** Wrap up Pass 3 type-safety work and lock in SEO scoring behavior with tests.

**Files & changes:**
1. **`src/pages/admin/ProjectEditor.tsx`** — replace 9 `:any` instances with proper types from `src/integrations/supabase/types.ts` (`Tables<'projects'>`, `Tables<'services'>`, etc.). Type the form-state, image-handlers, and service-tag handlers explicitly.
2. **`src/components/admin/WhyChooseUsManager.tsx`** — type the 8 `any` instances: define a `WhyChooseUsItem` interface mirroring the table schema; type `SortableItem` props, `handleDragEnd` event (`DragEndEvent` from `@dnd-kit/core`), and form data.
3. **`src/pages/admin/Projects.tsx`** — type the 5 `any` instances using `Tables<'projects'>`.
4. **Set up Vitest** if not already configured (per the frontend-testing-setup guide): `vitest.config.ts`, `src/test/setup.ts`, devDependencies.
5. **Create `src/pages/admin/seo/__tests__/scoring.test.ts`** with cases for:
   - `calculateSEOScore`: empty input, perfect input, missing-title, too-long-description, missing-OG, missing-canonical.
   - Any helper parsers (`parseMetaTags`, `extractKeywords` if present).
   - Edge cases: HTML entities, very long strings, multi-line descriptions.
   - Target ≥ 90% line coverage on `scoring.ts`.

**Files edited:** `src/pages/admin/ProjectEditor.tsx`, `src/components/admin/WhyChooseUsManager.tsx`, `src/pages/admin/Projects.tsx`, `package.json` (devDeps), `tsconfig.app.json`.
**Files created:** `vitest.config.ts`, `src/test/setup.ts`, `src/pages/admin/seo/__tests__/scoring.test.ts`.

---

## ⚠ One item I'm reclassifying: "Fix localhost:8080 failed fetches"

The 50+ failed `GET http://localhost:8080/` requests in your network log are **Vite HMR (hot-module-reload) ping probes** sent from the dev iframe to the local dev server. They are **expected** in the published preview environment because there is no local Vite dev server at port 8080 — only the deployed bundle. They are silent in the browser console, do not affect users, and disappear in production. **No code change is needed**, and trying to "fix" them would actually break HMR in genuine local dev sessions.

If you'd still like, I can suppress the noise by:
- (a) Adding `server.hmr.clientPort: 443` to `vite.config.ts` so the iframe pings the correct preview origin instead of localhost, **or**
- (b) Doing nothing (recommended — current behavior is normal).

I'll default to **(a)** as a polish step, slotted into Batch D.

---

## Recommended execution order

If you approve everything, I'll execute batches in this order to minimize churn:
1. **Batch A** (assets — touches `public/` + a few isolated files, low risk)
2. **Batch B** (token cleanup + preview page — depends on nothing else)
3. **Batch E** (type safety + tests — independent backend/admin work)
4. **Batch C** (dark mode — needs Batch B's tokens stable first)
5. **Batch D** (perf — last because vendor splitting requires a clean build to validate)

You can approve all batches together, or pick a subset like "A + B only" or "skip C, do everything else." Let me know how you'd like to proceed.
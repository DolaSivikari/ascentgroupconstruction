# Full Website Audit — Findings & Fix Plan

Three parallel audits ran across frontend standards, backend (DB + edge functions), and SEO/routing/performance. **76 findings** total. Below: the headline issues and a 6-batch fix plan you approve one at a time.

## Headline Issues (the ones costing you the most)

### 🔴 Site-breaking / security
1. **All 38 database functions are missing `SET search_path`** — search-path hijack risk on every privileged DB call.
2. **Brute-force lockout is silently broken** — `check-login-attempt` queries a table (`auth_account_lockouts`) that doesn't exist. Failed-login protection is a no-op.
3. **5 RLS policies are wide open to anonymous users** — `suppressed_emails`, `google_auth_tokens` (INSERT), `error_logs`, `document_access_log`, `search_console_data`, `email_unsubscribe_tokens`, `review_requests`, `project-images` storage upload.
4. **`/estimate` form bypasses the `submit-form` edge function** — no spam/honeypot/zod validation, direct anon insert.
5. **`documents` storage bucket is fully public** — DB-level `requires_authentication` is bypassed by the raw storage URL.
6. **Storage buckets have no file-size limits** — DoS / storage-exhaustion risk.
7. **XSS risk in `ProjectCaseStudy.tsx`** — 5× `dangerouslySetInnerHTML` on CMS strings with no sanitization.

### 🔴 SEO / routing breakage (likely tanking rankings)
8. **www vs non-www canonical war** — `_redirects` strips www, sitemap + robots.txt + Helmet declare www, `index.html` declares non-www. Google sees split signals on every URL.
9. **6 `_redirects` rules point to routes that don't exist** (`/services/sealants`, `/services/parking-garage`, `/sustainability`, etc.) → 404s.
10. **Static `<link rel="canonical">` in `index.html` duplicates every per-page Helmet canonical** → two canonicals per page.
11. **`LocalBusiness` schema fires on every page** instead of just homepage → "multiple items" warnings.
12. **16 public pages are missing `<SEO>` / Helmet** (Capabilities, Careers, Estimate, Homeowners, OurProcess, Prequalification, PropertyManagers, CommercialClients, all `/company/*`, all `/resources/*`, EmergencyRepair, NotFound). They inherit the generic homepage `<title>`.
13. **Sitemap `lastmod` dates are in 2026** (future) — Google distrusts these.
14. **Routes missing from sitemap**: `/for-architects`, `/emergency-repair`, `/why-specialty-contractor`, `/service-areas/:city`, all blog/project slugs.

### 🔴 Performance (explains your 5096ms LCP/FCP)
15. **Inline service-worker purge script blocks first paint** and triggers `location.reload()` on visits with an existing SW.
16. **`manualChunks` in `vite.config.ts`** — your own memory rule forbids this; forces radix + framer-motion to load on every route.
17. **Hero MP4 not `preload="none"`** — competes with LCP.

### 🟠 Standards violations (your "AI template" smell)
18. **Body font is Barlow, not Inter** — `src/index.css:209` overrides your design system; Barlow isn't even loaded so it falls back silently to system-ui.
19. **7 admin screens use native `confirm()` / `alert()`** instead of your custom `ConfirmDialog` (violates your admin UI memory rule).
20. **`SubmitRFPNew` form has no zod resolver.**
21. **Three pages have duplicate `<main>` landmarks** (Blog, SubmitRFPNew, ServiceDetail) — WCAG violation.
22. **~80 hardcoded `text-white` / `bg-white` / `bg-black/80`** instances in pages, primitives (`ui/Button.tsx`, `ui/Badge.tsx`), and overlays — violates your "no hardcoded colors" rule.
23. **Broken CSS variables** — `--safety-yellow-accessible` and `--text-on-yellow` referenced but never defined → invisible text on accessible-yellow buttons.
24. **Inflated-stat placeholder** in admin (`"e.g., 500+ Projects"`) directly contradicts your honesty rule.
25. **FAQ + PeopleAlsoAsk schema injected via raw DOM** — accumulates duplicate `FAQPage` blocks on SPA navigation.

Full findings (76 items) are saved as the reports below.

---

## Fix Plan — 6 Approval Batches

I'll auto-apply BATCH 1 immediately (low-risk cleanups, no DB/structural change), then pause for your approval on each subsequent batch.

### ✅ BATCH 1 — Safe auto-fixes (apply immediately, no approval needed)
**Cosmetic / hygiene only. No DB, no routing changes, no behavior change.**
- Strip `console.log` from `EmailLink.tsx`, `personalization.ts`, `assetResolver.ts`, `devContactValidation.ts`, `webVitals.ts` (DEV-gate them).
- Replace `text-white` / `bg-white` in `src/ui/Button.tsx`, `src/components/ui/button.tsx`, `src/components/ui/badge.tsx` with `text-primary-foreground` / `bg-card`.
- Replace `bg-black/80` overlays in `dialog.tsx`/`drawer.tsx`/`sheet.tsx` with `bg-foreground/80`.
- Fix `ProjectGallery.tsx` `text-[hsl(var(--bg))]` → `text-success-foreground` / `text-warning-foreground`.
- Add missing `aria-label` to icon-only buttons (MobileNavSheet, SearchSuggestions, StickyPageNav, Capabilities, FAQ).
- Remove `"e.g., 500+ Projects"` placeholder; replace with honest example.
- Fix `company/Developers.tsx` malformed `canonical={`n=…`}` prop.
- Add `<SEO noindex>` to `NotFound.tsx`.
- Define the missing `--safety-yellow-accessible` and `--text-on-yellow` CSS variables in `:root`.
- Future-date all sitemap `lastmod` entries to today.

### 🟠 BATCH 2 — Critical security (DB + RLS) — **approval required**
- Migration: add `SET search_path = public, pg_temp` to **all 38** SECURITY DEFINER functions.
- Migration: scope wide-open INSERT policies (`suppressed_emails`, `google_auth_tokens`, `error_logs`, `document_access_log`, `search_console_data`, `email_unsubscribe_tokens`, `review_requests`, `ab_test_assignments`) to `service_role` or add proper `WITH CHECK (auth.uid() = user_id)`.
- Migration: tighten `project-images` storage INSERT policy to admins; add `file_size_limit` to all 3 buckets (project-images 5MB, rfp-attachments 25MB, documents 25MB).
- Migration: make `documents` bucket private + add signed-URL helper for `requires_authentication=true` rows.
- Fix `check-login-attempt` edge function: either create `auth_account_lockouts` table or rewrite against existing `auth_failed_attempts`.
- Strip email PII from `console.log` in `check-login-attempt`, `invite-user`.
- Add explicit `verify_jwt` entries for all 18 edge functions in `supabase/config.toml`.

### 🟠 BATCH 3 — SEO/routing critical — **approval required**
- Decide www vs non-www (recommend **www** since sitemap/robots/llms already use it). Update `_redirects`, `index.html`, `SITE_URL` constant.
- Fix the 6 broken `_redirects` targets (point to real slugs).
- Remove static `<link rel="canonical">` and `twitter:url` from `index.html` (Helmet owns them).
- Refactor `SEO.tsx`: emit `LocalBusiness` schema only when `isHomepage` prop is true.
- Migrate sitemap to **generator script** (`scripts/generate-sitemap.ts`) so blog posts, projects, and location pages auto-populate. Add `predev` / `prebuild` hooks.
- Add `<SEO>` component to the 16 missing pages.
- Add proper `BlogPosting` JSON-LD to `BlogPost.tsx` via `structuredData` prop.
- Refactor `FAQAccordion.tsx` + `PeopleAlsoAsk.tsx` + `schema-injector.ts` to use Helmet (no raw DOM mutation).
- Dedupe `_headers` cache rules; move CSP from `/` to `/*`.

### 🟠 BATCH 4 — Performance (LCP fix) — **approval required**
- Move SW-purge inline script to a deferred module loaded on `window.load`.
- Remove `manualChunks` from `vite.config.ts` (per your own memory rule).
- Add `preload="none"` to hero `<video>` element.
- Load GA4 on `requestIdleCallback` instead of the hardcoded 3000ms timeout.
- Verify hero poster is the LCP element and is correctly preloaded.

### 🟠 BATCH 5 — Standards & XSS — **approval required**
- Replace Barlow with Inter in `src/index.css:209,215,244` (or load Barlow properly if you actually want it — confirm with me).
- Sanitize all 5 `dangerouslySetInnerHTML` calls in `ProjectCaseStudy.tsx` with DOMPurify.
- Add zod resolver to `SubmitRFPNew` form (schema already exists at `src/schemas/rfp-validation.ts`).
- Route `/estimate` submission through the `submit-form` edge function.
- Convert the 7 native `confirm()`/`alert()` admin calls to `ConfirmDialog` + toast.
- Fix duplicate `<main>` landmarks in Blog, SubmitRFPNew, ServiceDetail.
- Add `useReducedMotion` hook to nav `animate-pulse` orbs.

### 🟢 BATCH 6 — Polish & cleanup — **approval required**
- Remove remaining ~70 page-level `text-white` instances (Capabilities, About, PageHeader, ContractorPortal).
- Reduce `backdrop-blur` on enterprise cards (keep only on nav).
- Remove duplicate/redundant INSERT policies (quote_requests, rfp_submissions).
- Fix `featured_services` / `project_services` `USING(true)` to scope to `is_active=true`.
- Add `deno.json` to each edge function for dependency pinning.
- Guard `src/pages/dev/TokenPreview.tsx` behind production-mode check.
- Audit and remove dead/unused files.

---

## What happens next
On your approval, I'll execute BATCH 1 immediately (safe), then propose BATCH 2 as a single migration for your review. Each subsequent batch waits for your go-ahead.

If you want a different ordering (e.g., "do SEO/perf first because rankings are bleeding" or "security first, perf can wait") — say so when you approve, and I'll resequence.

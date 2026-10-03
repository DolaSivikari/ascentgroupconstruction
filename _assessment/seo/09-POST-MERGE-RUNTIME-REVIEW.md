Across PR #37, PR #38, PR #39, and PR #40, a large amount of documentation, unit testing, and component refactoring was committed to the repository (`main` branch). 

However, when audited against the live running application in the browser, several high-profile features were either intentionally deferred, partially built without backend changes, or failed at runtime due to browser/Vite integration bugs.

Here is the deep dive into what was claimed, what was actually delivered, and what is currently not working—broken down PR by PR.

---

PR #37: Typography & Design System Unification
Merged via commit `9754758` (`932c5bb` + `25aebd8`)

What Was Implemented:
* Self-Hosted Barlow Typeface: Added `public/fonts/barlow-*.woff2` and `@font-face` definitions in `src/styles/typography.css`, removing third-party font download dependencies.
* Card & Surface Tokens: Pinned card border radius to 8px (`--radius-sm: 8px`) across standard cards, `Card.tsx`, and `SectionHeader.tsx`.
* Standard Button Adapter: Consolidated button exports in `src/components/ui/button.tsx` to point to the canonical `src/ui/Button.tsx`.
* Documentation: Created `docs/design-system.md` and `docs/site-page-inventory.csv`.

What Was NOT Implemented & Why:
1. No Header/Media Fixes: PR #37 was strictly limited to typography and CSS token harmonization. It intentionally did not touch page headers, video playback, or routing issues.
2. Lingering Inline Overrides: Older components and admin screens retained legacy Tailwind utility overrides that bypassed the design tokens (addressed in later PRs).

---

PR #38: Page Discovery & Sitemap Expansion
Merged via commit `f8efc96` (`ff14bff`)

What Was Implemented:
* Sitemap Coverage: Expanded `public/sitemap.xml` from 49 URLs to 85 URLs, incorporating all 17 city pages, 11 project case studies, and 6 blog articles.
* Native Project Links: Wrapped `ProjectCard.tsx` in standard React Router `<Link to={`/projects/${slug}`}>` tags so middle-click/new-tab navigation works for search engines and users.
* City Links in Service Pages: Updated `ServiceAreaSection.tsx` so city names link directly to `/service-areas/:city`.
* Specialty Breadcrumbs: Added parent-child hierarchy in `service-registry.ts` linking specialized services to their parent category.

What Was NOT Implemented & Why:
1. Desktop Mega Menu Remained Capped at 12: The desktop navigation header mega menu still hides 10 specialized services. PR #38's explicit rule was "improve page discovery without expanding or cluttering the main menu", so the 10 services were only registered for internal search and mobile navigation.
2. City Pages Remained Unusable: While PR #38 added links pointing to `/service-areas/:city`, the destination pages themselves were not updated—they still lacked hero images and proper layout handling.

---

PR #39: Inbox Details, Consent & Site Reliability
Merged via commit `15f7b6e` (`8052e72`)

What Was Implemented:
* Analytics Consent Gating: Updated `CookieBanner.tsx` and `analyticsConsent.ts` so Google Analytics, search tracking, and A/B test logging are strictly blocked until the user clicks "Accept Analytics".
* RFP File Upload Resilience: In `SubmitRFPNew.tsx`, if one attachment fails to upload, successful uploads are preserved rather than wiping the form.
* Inbox Pagination & Private Attachments: `src/lib/inbox/api.ts` was upgraded to generate authenticated, 5-minute signed Supabase storage URLs for RFP drawings and blueprints.
* Audit Documentation: Added the comprehensive audit files in `_assessment/` (`01-REPORT.md` through `05-IMPLEMENTATION-STATUS.md`).

What Was NOT Implemented & Why:
1. No Unified `inquiries` Table (Database Migration Skipped): 
    Why:* The audit proposed creating a single unified `inquiries` PostgreSQL table. PR #39 intentionally skipped this to avoid risky database migrations while development was transitioning to Codex. The inbox still queries disconnected legacy tables (`contact_submissions`, `rfp_submissions`, `quote_requests`).
2. No `admin_notes` for Quotes or Estimates: 
    Why:* The `quote_requests` table in the database lacks an `admin_notes` column. Rather than adding the column via SQL, PR #39 simply made quote notes read-only in the UI.
3. No Server-Side Email Intake Consolidation:
    Why:* Email notification architecture was deferred pending domain and credential verification (`RESEND_API_KEY` remains unconfigured; form emails rely on `@lovable.dev/email-js`).

---

PR #40: Page Headers & Admin Inquiry Workflows
Merged via commit `20235ed` (`cfa2d28`)

What Was Implemented in Code:
* Replaced native browser `confirm()` with branded `ConfirmDialog` across admin screens.
* Added `src/pages/admin/PageHeaders.tsx` inventory dashboard.
* Added image upload and preview directly into the admin Service Editor.
* Created `HeroPresenceProvider` and `useHeroPresence` to dynamically manage navbar transparency.
* Expanded the unit test suite to 270 passing Vitest tests.

What WAS NOT IMPLEMENTED OR FAILED AT RUNTIME (The 4 Major Regressions):

| Page / Component | Claimed in PR #40 Status | Actual Runtime Reality in Browser | The Root Cause (Why It Failed) |
| :--- | :--- | :--- | :--- |
| All 17 City Pages (`/service-areas/:city`) | "All 17 city pages use the illustrated regional map" | ❌ CRASHES: Displays `<p>Failed to load Location</p>` | `LocationPage.tsx` imports `getCityHero` from `@/data/hero-images`. Vite's module graph throws a runtime `SyntaxError: The requested module '/src/data/hero-images.ts' does not provide an export named 'getCityHero'`, triggering `lazyWithFallback`. |
| Flagship Service Hero (`/services/building-envelope-solutions`) | "All 22 canonical service slugs have mapped images" | ❌ EMPTY DARK BOX: `PageHero` renders with NO photo | The Supabase row contains `/src/assets/heroes/hero-facade-remediation.jpg`. The helper `isUsableHeroImage` rejects `/src/` paths as invalid, and the fallback pipeline fails to supply `image` to `PageHero` props (`image: undefined`). |
| Legal Pages Navbar (`/privacy`, `/terms`) | "Legal pages have solid, readable navigation at the top" | ❌ TRANSPARENT NAVBAR: White text on white background | `HeroPresenceProvider` evaluates `hasHero: true` on initial mount because `routeKey` state initialization incorrectly assumes an active hero surface on top-level routes. |
| Homepage Hero Video (`EnhancedHero.tsx`) | Claimed working in prior notes | ❌ PAUSED ON POSTER: Autoplay aborted | PR #40 explicitly left video logic untouched. Chromium still rejects playback with `The play() request was interrupted by a new load request` caused by `v.load()` on line 242. |

---

Summary of What Remains Unfinished

1. Runtime Bugs (Immediate Fix Needed):
   * Fix the export/import of `getCityHero` so all 17 city landing pages render.
   * Fix the image prop handover in `ServiceDetail.tsx` so building envelope and interior service pages display their photos.
   * Fix `HeroPresenceProvider` so legal and text pages get a solid navbar on load.
   * Remove `v.load()` from `EnhancedHero.tsx` so the homepage hero video autoplays.
2. Backend & Architecture (Intentionally Deferred):
   * Unifying the 3 submission tables into a single `inquiries` schema.
   * Adding `admin_notes` to `quote_requests`.
   * Restructuring the desktop mega menu into sub-trade categories for all 22 services.

When you want to resolve the 4 runtime bugs above in the codebase, let me know and we can switch to Build mode to implement the fixes.
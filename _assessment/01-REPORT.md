# 01 — Technical Report: Ascent Group Construction website

*Audit date: 2026-10-02. Scope: Phases 0–2 (orientation, codebase inventory, run-and-verify). Page-by-page audit is in `03-PAGE-AUDIT.md`; inbox analysis in `04-INBOX-READINESS.md`; issue list in `02-FINDINGS.md`.*

**Conventions.** Paths are relative to the repo root (the folder that contains `package.json`; on the user's PC this is `...\ascentgroupconstruction-main\ascentgroupconstruction-main`). Line numbers refer to the files as audited. "Unknown" means the repo cannot answer the question; each Unknown says what would answer it. Facts and opinions are separated: opinions live only in sections labelled **Assessment** or in `02-FINDINGS.md`. No secret values appear anywhere in this report; environment variables are listed by name only.

**How the audit was run.** All reading was done on the user's folder in read-only fashion. Installing, linting, type-checking, testing and building were done in a **scratch copy outside the user's folder** (see Phase 2). Nothing in the repo was modified.

---

## Phase 0 — Orientation

### 0.1 Git state (exact commands and output)

The folder is **not a git repository** (it looks like a GitHub "Download ZIP" export, hence the `-main` suffix on the folder name). Commands run and their verbatim output:

```
$ git status
fatal: not a git repository (or any parent up to mount point /sessions/.../mnt)
Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).

$ git branch
fatal: not a git repository (or any parent up to mount point /sessions/.../mnt)

$ git log -15 --oneline
fatal: not a git repository (or any parent up to mount point /sessions/.../mnt)
```

Consequences: no commit history, branch, or authorship is available (Unknown: whether the real GitHub repo has history, and who deploys from it — answer: the GitHub repo URL or Lovable project settings). As a substitute for the "git status at the end" check, a SHA-256 manifest of all 810 files was taken **before** any output was written and is re-compared at the end (see the "Finish" section at the end of this report).

### 0.2 Stack identification

| Item | Finding | Evidence |
|---|---|---|
| Framework | React 18.3 single-page app (client-side rendered) | `package.json` deps; `src/main.tsx`; `index.html:267` |
| Language | TypeScript (non-strict) | `tsconfig.app.json:25` (`"strict": false`), `tsconfig.json:4,13` |
| Build tool | Vite 5.4 with `@vitejs/plugin-react-swc` | `vite.config.ts`, build log (`vite v5.4.21`) |
| Routing | `react-router-dom` v6 | `src/routes/AppRoutes.tsx` |
| Styling | Tailwind CSS 3 + CSS variables + shadcn/ui (Radix) | `tailwind.config.ts`, `components.json`, `src/index.css` |
| Data/backend | Supabase (Postgres, Auth, Storage, Edge Functions) via "Lovable Cloud"; TanStack Query on the client | `src/integrations/supabase/`, `supabase/`, `README.md:34,198` |
| Forms | react-hook-form + zod are installed, but the main public forms use hand-rolled `useState` + zod `parse` | `src/pages/Contact.tsx:31-63` |
| Package manager | **bun** (lockfile `bun.lock`); `deno.lock` also present; **no** `package-lock.json`/`pnpm-lock.yaml`/`yarn.lock` | repo root listing |
| Node version requirement | None declared: no `engines` field, no `.nvmrc`/`.node-version`. README says "Node.js 18+" (`README.md:280`). Audit used Node v22.23.2, bun 1.4.2 | `package.json`; `README.md:279-281` |
| Hosting | Lovable (see section E) | `.lovable/`, `public/_redirects:1-4`, `README.md:34` |
| ORM | Drizzle is configured only for migrations/schema tooling (`drizzle.config.ts`); the app talks to Supabase via supabase-js, not Drizzle | `drizzle.config.ts`, `drizzle/schema.ts` (1 line) |

**package.json scripts** (`package.json:6-14`): `dev` (vite, port 8080 per `vite.config.ts:15`), `build`, `build:dev`, `build:optimized` (sets `ENABLE_IMAGE_OPTIMIZATION=true`), `lint` (eslint), `preview`, `validate:sw`, `typecheck:selected`. **There is no `test` script** and no full `typecheck` script.

### 0.3 Folder tree (3 levels, excluding `node_modules`, build output, `.git`, and this `_assessment/` folder)

```
.
.env
.github
.github/workflows
.github/workflows/lighthouse-ci.yml
.github/workflows/smoke-test.yml
.gitignore
.lighthouserc.js
.lovable
.lovable/mcp
.lovable/mcp/manifest.json
.lovable/plan.md
0===
CONTRIBUTING.md
README.md
bun.lock
components.json
deno.lock
docs
docs/ACCESSIBILITY.md
docs/ADMIN_FEATURE_STATUS.md
docs/ADMIN_GUIDE.md
docs/ARCHITECTURE_OVERVIEW.md
docs/AUDIT_IMPLEMENTATION_COMPLETE.md
docs/BRAND_GUIDELINES.md
docs/BUSINESS_MODULE_GUIDE.md
docs/CI_RELEASE_SANITY_CHECKLIST.md
docs/COMPANY_SETTINGS.md
docs/DATABASE_ERD.md
docs/DEPLOYMENT.md
docs/DESIGN_SYSTEM.md
docs/DEVELOPER_ONBOARDING.md
docs/PERFORMANCE_OPTIMIZATION_2025.md
docs/README.md
docs/RESPONSIVE_TESTING_RESULTS.md
docs/RLS_AUDIT_RESULTS.md
docs/SERVICES_MANAGEMENT.md
docs/VIDEO_OPTIMIZATION_GUIDE.md
documents
documents/REPO_STRUCTURE_MAP.md
drizzle
drizzle.config.ts
drizzle/migrations
drizzle/migrations/0000_harden_preview_tokens_versions_documents.sql
drizzle/migrations/0001_harden_pii_grants_rls_and_definer_execute.sql
drizzle/migrations/0002_restrict_admin_definer_and_storage_policies.sql
drizzle/migrations/meta
drizzle/schema.ts
eslint.config.js
index.html
package.json
postcss.config.js
public
public/_headers
public/_redirects
public/apple-touch-icon.png
public/ascent-logo.png
public/brand
public/brand/icon-monument-ring.png
public/brand/icon-monument.png
public/brand/logo-horizontal-dark.png
public/brand/logo-horizontal-light.png
public/brand/logo-vertical-dark.png
public/brand/logo-vertical-light.png
public/documents
public/documents/Ascent_Group_Construction_-_Sto_Listing_Certificate.pdf
public/favicon-192.png
public/favicon-512.png
public/favicon.ico
public/favicon.png
public/fonts
public/fonts/inter-400.woff2
public/hero-clipchamp.mp4
public/hero-poster-1.webp
public/images
public/images/ascent-logo-nav-dark.png
public/images/ascent-logo-nav-light.png
public/llms.txt
public/og-image.png
public/placeholder.svg
public/robots.txt
public/service-worker.js
public/sitemap.xml
scripts
scripts/README.md
scripts/audit-rls-policies.sql
scripts/audit-routes.ts
scripts/audit-service-pages.ts
scripts/auto-fix-imports.js
scripts/check-console-errors.js
scripts/convert-images.js
scripts/design-audit.js
scripts/design-lint.js
scripts/smoke-test.sh
scripts/validate-sw.js
scripts/verify-headers.js
src
src/App.tsx
src/assets
src/assets/ascent-icon-round.png
src/assets/ascent-icon.png
src/assets/ascent-logo-horizontal-dark-round.png
src/assets/ascent-logo-horizontal-dark.webp
src/assets/ascent-logo-horizontal-light-round.png
src/assets/ascent-logo-horizontal-light.webp
src/assets/ascent-logo-intro.mp4
src/assets/ascent-logo-vertical-dark-round.png
src/assets/ascent-logo-vertical-dark.png
src/assets/ascent-logo-vertical-light-round.png
src/assets/ascent-logo-vertical-light.png
src/assets/ascent-logo-vertical-white.png
src/assets/hero-building-envelope.jpg
src/assets/hero-clipchamp.mp4
src/assets/hero-construction-management.jpg
src/assets/hero-design-build.jpg
src/assets/hero-eifs-stucco.jpg
src/assets/hero-exterior-cladding.jpg
src/assets/hero-general-contracting.jpg
src/assets/hero-interior-buildouts.jpg
src/assets/hero-masonry-restoration.jpg
src/assets/hero-metal-cladding.jpg
src/assets/hero-parking-rehabilitation.jpg
src/assets/hero-waterproofing.jpg
src/assets/heroes
src/assets/landing-bg-dark.png
src/assets/landing-bg-light.png
src/assets/partners
src/components
src/components/BeforeAfterSlider.tsx
src/components/BlogPreview.tsx
src/components/Breadcrumb.tsx
src/components/ContentPageHeader.tsx
src/components/CookieBanner.tsx
src/components/EmailLink.tsx
src/components/ErrorBoundary.tsx
src/components/FeaturedProjects.tsx
src/components/FilterBar.tsx
src/components/Footer.tsx
src/components/InteractiveLightbox.tsx
src/components/Navigation.tsx
src/components/OptimizedImage.tsx
src/components/PageHeader.tsx
src/components/PaintCalculator.tsx
src/components/ProcessTimelineStep.tsx
src/components/ProjectCard.tsx
src/components/ProjectFeaturedCard.tsx
src/components/ProjectGallery.tsx
src/components/ProjectSidebar.tsx
src/components/QuoteWidget.tsx
src/components/ResumeSubmissionDialog.tsx
src/components/SEO.tsx
src/components/ScrollToTop.tsx
src/components/SkipLink.tsx
src/components/StickyInquiryBar.tsx
src/components/Testimonials.tsx
src/components/ThemeProvider.tsx
src/components/admin
src/components/animations
src/components/blog
src/components/contact
src/components/contractor
src/components/estimator
src/components/footer
src/components/forms
src/components/homepage
src/components/layout
src/components/navigation
src/components/partners
src/components/partnerships
src/components/projects
src/components/proof
src/components/rfp
src/components/sections
src/components/seo
src/components/services
src/components/shared
src/components/skeletons
src/components/timeline
src/components/tools
src/components/ui
src/components/unified
src/constants
src/constants/company.ts
src/constants/siteSettingsColumns.ts
src/data
src/data/blog-faq-data.ts
src/data/case-study-faq-data.ts
src/data/enriched-company-content.ts
src/data/enriched-hero-slides.ts
src/data/estimator-model.json
src/data/hero-images.ts
src/data/merged-services-data.ts
src/data/navigation-descriptions.ts
src/data/navigation-icons.ts
src/data/navigation-structure-enhanced.ts
src/data/page-faqs.ts
src/data/partnership-models.ts
src/data/service-area-cities.ts
src/data/service-faqs-enriched.ts
src/data/service-people-ask.ts
src/data/service-pillars.ts
src/data/service-quick-facts.ts
src/data/service-registry.ts
src/data/specialty-contractor-comparison.ts
src/data/video-metadata.ts
src/data/wave1-services.ts
src/design-system
src/design-system/animations.ts
src/design-system/components
src/design-system/constants.ts
src/design-system/image-system.ts
src/design-system/layouts.ts
src/design-system/tokens.ts
src/design-system/typography.ts
src/hooks
src/hooks/admin
src/hooks/use-mobile.tsx
src/hooks/use-toast.ts
src/hooks/use3DTilt.ts
src/hooks/useABTest.ts
src/hooks/useActiveSettings.ts
src/hooks/useAdminAuth.ts
src/hooks/useAdminRoleCheck.ts
src/hooks/useAggregateRating.ts
src/hooks/useAutoSave.ts
src/hooks/useBulkSelection.ts
src/hooks/useCarousel.ts
src/hooks/useCompanyOverview.ts
src/hooks/useCompanyOverviewAdmin.ts
src/hooks/useCompanySettings.ts
src/hooks/useCountUpOnView.ts
src/hooks/useDocuments.ts
src/hooks/useFeaturedServices.ts
src/hooks/useFormCompletion.ts
src/hooks/useHomepageData.ts
src/hooks/useHoverTimeout.ts
src/hooks/useIdleTimeout.ts
src/hooks/useImageLoad.ts
src/hooks/useIntersectionObserver.ts
src/hooks/useKeyboardShortcuts.ts
src/hooks/useNavigationHistory.ts
src/hooks/useNavigationSearch.ts
src/hooks/useOnPageNav.ts
src/hooks/usePageAnalytics.ts
src/hooks/usePerformanceMonitoring.ts
src/hooks/usePermissions.ts
src/hooks/usePersonalizedRecommendations.ts
src/hooks/usePopularSearches.ts
src/hooks/usePopularServices.ts
src/hooks/usePreviewMode.ts
src/hooks/useRealtimeProjects.ts
src/hooks/useRecentSearches.ts
src/hooks/useReducedMotion.ts
src/hooks/useSEOKeywords.ts
src/hooks/useScrollDirection.ts
src/hooks/useScrollFadeIn.ts
src/hooks/useScrollIndicator.ts
src/hooks/useScrollReveal.ts
src/hooks/useSearchAnalytics.ts
src/hooks/useServiceAnalytics.ts
src/hooks/useServicesAdmin.ts
src/hooks/useSettingsData.ts
src/hooks/useSettingsValidation.ts
src/hooks/useSiteSettings.ts
src/hooks/useStaggerAnimation.ts
src/hooks/useSwipeGesture.ts
src/hooks/useTableFilters.ts
src/hooks/useTablePagination.ts
src/hooks/useTableSort.ts
src/hooks/useUnsavedChanges.ts
src/hooks/useUrlFilters.ts
src/hooks/useVideoPreloader.tsx
src/hooks/useWhyChooseUs.ts
src/hooks/useWhyChooseUsAdmin.ts
src/index.css
src/integrations
src/integrations/supabase
src/lib
src/lib/analytics.ts
src/lib/mcp
src/lib/motion-presets.ts
src/lib/utils.ts
src/lib/webVitals.ts
src/main.tsx
src/pages
src/pages/About.tsx
src/pages/Accessibility.tsx
src/pages/Auth.tsx
src/pages/Blog.tsx
src/pages/BlogPost.tsx
src/pages/Capabilities.tsx
src/pages/Careers.tsx
src/pages/CommercialClients.tsx
src/pages/Contact.tsx
src/pages/EmailUnsubscribe.tsx
src/pages/EmergencyRepair.tsx
src/pages/Estimate.tsx
src/pages/FAQ.tsx
src/pages/ForArchitects.tsx
src/pages/ForGeneralContractors.tsx
src/pages/Homeowners.tsx
src/pages/Index.tsx
src/pages/Markets.tsx
src/pages/NotFound.tsx
src/pages/OAuthConsent.tsx
src/pages/OurProcess.tsx
src/pages/Prequalification.tsx
src/pages/Privacy.tsx
src/pages/ProjectDetail.tsx
src/pages/Projects.tsx
src/pages/PropertyManagers.tsx
src/pages/ServiceDetail.tsx
src/pages/Services.tsx
src/pages/SubmitRFPNew.tsx
src/pages/Terms.tsx
src/pages/Unsubscribe.tsx
src/pages/WhySpecialtyContractor.tsx
src/pages/admin
src/pages/company
src/pages/dev
src/pages/resources
src/pages/services
src/routes
src/routes/AppRoutes.tsx
src/routes/registry.ts
src/schemas
src/schemas/rfp-validation.ts
src/schemas/settings-validation.ts
src/styles
src/styles/admin-page-shell.css
src/styles/admin-sidebar.css
src/styles/admin-theme.css
src/styles/animations.css
src/styles/index.css
src/styles/interactions.css
src/styles/mobile-nav.css
src/styles/rich-text-editor.css
src/styles/textures.css
src/styles/tokens.css
src/styles/typography.css
src/test
src/test/setup.ts
src/ui
src/ui/Button.tsx
src/ui/Card.tsx
src/ui/Input.tsx
src/ui/Select.tsx
src/ui/Textarea.tsx
src/ui/index.ts
src/utils
src/utils/ab-testing.ts
src/utils/assetResolver.ts
src/utils/authCache.ts
src/utils/cacheBuster.ts
src/utils/devContactValidation.ts
src/utils/documentUrl.ts
src/utils/errorLogger.ts
src/utils/estimator.ts
src/utils/faq-schema.ts
src/utils/formatPhone.ts
src/utils/formatProjectValue.ts
src/utils/getIcon.ts
src/utils/haptics.ts
src/utils/image-normalizer.ts
src/utils/image-optimizer.ts
src/utils/imageResolver.ts
src/utils/personalization.ts
src/utils/previewToken.ts
src/utils/relatedLinks.ts
src/utils/review-helpers.ts
src/utils/routeHelpers.ts
src/utils/sanitize.ts
src/utils/schema-injector.ts
src/utils/schemaGenerators.ts
src/utils/seo
src/utils/serviceIcons.ts
src/utils/statusHelpers.ts
src/utils/structured-data.ts
src/vite-env.d.ts
supabase
supabase/config.toml
supabase/functions
supabase/functions/_shared
supabase/functions/analyze-performance
supabase/functions/check-login-attempt
supabase/functions/fetch-search-console-data
supabase/functions/generate-keywords
supabase/functions/generate-seo-content
supabase/functions/generate-sitemap
supabase/functions/google-oauth-callback
supabase/functions/google-search-console-auth
supabase/functions/handle-email-events
supabase/functions/invite-user
supabase/functions/mcp
supabase/functions/preview-transactional-email
supabase/functions/process-image
supabase/functions/scheduled-fetch-search-console
supabase/functions/send-admin-notification
supabase/functions/send-contact-notification
supabase/functions/send-estimate-confirmation
supabase/functions/send-package-notification
supabase/functions/send-quote-confirmation
supabase/functions/send-resume-notification
supabase/functions/send-review-request
supabase/functions/send-rfp-emails
supabase/functions/send-rfp-notification
supabase/functions/submit-form
supabase/migrations
supabase/migrations/20251117201340_remix_migration_from_pg_dump.sql
supabase/migrations/20251117204514_e3ce6104-8470-49f4-a9ca-ba193b672369.sql
supabase/migrations/20251117210811_3507f670-890d-4415-99a8-53019d36b08f.sql
supabase/migrations/20251118013455_8dbdce1f-12c0-434a-9d42-687d473b2624.sql
supabase/migrations/20251118171619_b80e372a-0622-4953-b04f-d08cc8c27f6e.sql
supabase/migrations/20251118172153_af39e260-fea1-48e3-af3a-d48f44fd0261.sql
supabase/migrations/20251118172339_3e265589-9ff4-41cb-96f8-a6db973deb4f.sql
supabase/migrations/20251118172556_1e2426e3-58e1-4427-aa8b-49a6cf43acd4.sql
supabase/migrations/20251118191204_31cdd36f-0eae-4891-91b7-934d2238cb08.sql
supabase/migrations/20251118192317_1ae277f8-e7c6-4392-aeb1-24012b94eea1.sql
supabase/migrations/20251119033604_80e8b4ea-50c9-4953-8851-a265ac0309b2.sql
supabase/migrations/20251119150657_1d222b08-e17b-4898-8427-cc736c04c7cf.sql
supabase/migrations/20251121151044_f150430a-4c50-4787-a87d-5c321c6c39e7.sql
supabase/migrations/20251207202648_f89c5f0d-09ab-475e-a3c3-745d8de6e9be.sql
supabase/migrations/20251207213352_64faf05c-1156-443e-b3c4-eb33b51b8470.sql
supabase/migrations/20260119042619_129d965c-76f5-4a36-ac5e-25d7ea382370.sql
supabase/migrations/20260308144215_29c0e518-2c6a-4193-8d89-5da102c480e4.sql
supabase/migrations/20260308204816_2d6766d7-cf71-4a2e-9418-e11d387a2fc2.sql
supabase/migrations/20260308235706_1d3c9552-3527-4908-ae61-99edbbbd5c72.sql
supabase/migrations/20260411214722_81b9582e-22d3-493f-b7ce-b2e6f7e6d810.sql
supabase/migrations/20260417170110_5cfd09d9-4c81-4e76-a4d0-a2182bd457b6.sql
supabase/migrations/20260426013909_54117b06-0677-4e1a-aaba-a424847f885e.sql
supabase/migrations/20260426014120_69a54517-970d-4bfd-a257-26bafebaacbd.sql
supabase/migrations/20260426015414_bb835949-3cd3-4429-a581-4ef8548cbd5d.sql
supabase/migrations/20260504125759_8805e1dd-85d7-4b6e-aeb0-5e24ebb47449.sql
supabase/migrations/20260606032336_38e850a6-b6e5-4e25-a0eb-f1a5d509944e.sql
supabase/migrations/20260606035322_eff3bb18-fac9-4936-b15d-f895f30f6b4f.sql
supabase/migrations/20260609011303_05138e86-14b7-4bf9-9f4c-ab3a98d365eb.sql
supabase/migrations/20260609220313_323e1669-eb70-40a8-8729-6d495f35b137.sql
supabase/migrations/20260610192714_641be78a-287e-4e7f-ae87-1494ee723ed9.sql
supabase/migrations/20260610193847_6df1e88b-b35d-499d-a212-271692337593.sql
supabase/migrations/202611020001_fix_recommendations_cache_rls.sql
supabase/migrations/202611020002_fix_security_definer_functions.sql
tailwind.config.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
tsconfig.selected-strict.json
vite.config.ts
vitest.config.ts
```

Totals: 810 files — `src/` 648 files (19 MB), `supabase/` 71, `public/` 26 (2.9 MB), `docs/` 19, `scripts/` 12, `drizzle/` 8, `.github/` 2, `.lovable/` 2. A stray file named `0===` (12 bytes, content `===tabIndex`) sits in the repo root; it looks like an accidental shell redirect (inference).

### 0.4 Documentation read

`README.md` (358 lines), `CONTRIBUTING.md`, and `docs/*` (19 files: ACCESSIBILITY, ADMIN_FEATURE_STATUS, ADMIN_GUIDE, ARCHITECTURE_OVERVIEW, AUDIT_IMPLEMENTATION_COMPLETE, BRAND_GUIDELINES, BUSINESS_MODULE_GUIDE, CI_RELEASE_SANITY_CHECKLIST, COMPANY_SETTINGS, DATABASE_ERD, DEPLOYMENT, DESIGN_SYSTEM, DEVELOPER_ONBOARDING, PERFORMANCE_OPTIMIZATION_2025, README, RESPONSIVE_TESTING_RESULTS, RLS_AUDIT_RESULTS, SERVICES_MANAGEMENT, VIDEO_OPTIMIZATION_GUIDE) plus `documents/REPO_STRUCTURE_MAP.md` and `.lovable/plan.md` exist. The README is treated as a **claim** and verified against code throughout; discrepancies are listed in section 1.X ("README vs reality") at the end of Phase 1.

**Important context the README gives (claims, verified where noted later):** the company "was established in 2025" with "15+ years combined team experience" (`README.md:18`); it is "not a full-service general contractor" and "design-build and construction management are not current service offerings" (`README.md:19-21`); the admin login is the deliberately non-obvious route `/tekev` (`README.md:272`).


---

## Phase 1 — Codebase inventory

### 1A. Routes and pages

**Router:** React Router v6 `<Routes>` in `src/routes/AppRoutes.tsx` (262 lines), mounted from `src/App.tsx`. Only `Index` and `NotFound` are imported eagerly; every other page is `React.lazy` (`AppRoutes.tsx:1-86`). A second, hand-maintained list of "known" routes exists in `src/routes/registry.ts:1-42` and is **not** derived from `AppRoutes.tsx` (it omits `/email-unsubscribe` and `/.lovable/oauth/consent`; it lists `/admin/*` routes that differ from the real ones).

**Slug resolution and 404 behaviour (facts):**

- `/services/:slug` → `src/pages/ServiceDetail.tsx`. It queries the `services` table (`ServiceDetail.tsx:184`). If the query errors or returns nothing it runs `<Navigate to="/404" replace />` (`ServiceDetail.tsx:216-218`). Nine `/services/<slug>` routes are declared *before* the catch-all and render static content from `src/data/wave1-services.ts` (`AppRoutes.tsx:129-137`). 33 legacy slugs are redirected client-side with `<Navigate replace>` (`AppRoutes.tsx:93-126`) — these are JavaScript redirects, **not** HTTP 301s (see 1E).
- `/projects/:slug` → `src/pages/ProjectDetail.tsx`. If the project is not found it calls `navigate("/projects")` (`ProjectDetail.tsx:158`), i.e. it redirects to the list rather than showing a 404.
- `/blog/:slug` and `/case-study/:slug` both render `BlogPost.tsx`; a missing post shows an inline "Article Not Found" block with **no** `noindex` and no redirect (`BlogPost.tsx:105-117`). `/case-studies` renders the **Blog** list page (`AppRoutes.tsx:249`), not a case-study list.
- `/service-areas/:city` → `LocationPage.tsx`. 17 cities are hard-coded in the `locationDetails` object (`LocationPage.tsx`, Toronto … Milton plus `king-city`). An unknown city renders a "Location Not Found" block with **no** `noindex` (`LocationPage.tsx:212-230`).
- `*` and `/404` → `NotFound.tsx`, which does set `noindex` (`NotFound.tsx:62`).
- Because the site is a single-page app, **every** URL is served the same `index.html`; whether the host answers unknown paths with HTTP 200 or 404 is **Unknown** (needs a request against the live host; Lovable hosting is documented to do an SPA fallback, but this was not verified here).

**Public route table** (generated from `AppRoutes.tsx`, 39 rows are client-side redirects; admin routes are summarised after the table):

| # | Path | Component file / target | Kind | In sitemap.xml? | AppRoutes.tsx line |
|---|---|---|---|---|---|
| 1 | `/services` | src/pages/Services.tsx | page | yes | 90 |
| 2 | `/services/building-envelope` | → /services/building-envelope-solutions | redirect | n/a | 93 |
| 3 | `/services/interior-buildouts` | → /services/interior-buildouts-finishing | redirect | n/a | 94 |
| 4 | `/services/eifs-stucco` | → /services/eifs-stucco-systems | redirect | n/a | 95 |
| 5 | `/services/metal-cladding` | → /services/cladding-systems | redirect | n/a | 96 |
| 6 | `/services/exterior-envelope` | → /services/building-envelope-solutions | redirect | n/a | 97 |
| 7 | `/services/exterior-cladding` | → /services/cladding-systems | redirect | n/a | 98 |
| 8 | `/services/exterior-siding` | → /services/cladding-systems | redirect | n/a | 99 |
| 9 | `/services/drywall-finishing` | → /services/interior-buildouts-finishing | redirect | n/a | 100 |
| 10 | `/services/suite-buildouts` | → /services/interior-buildouts-finishing | redirect | n/a | 101 |
| 11 | `/services/painting` | → /services/painting-services | redirect | n/a | 102 |
| 12 | `/services/condo-multi-unit` | → /services/interior-buildouts-finishing | redirect | n/a | 103 |
| 13 | `/services/residential-painting` | → /services/painting-services | redirect | n/a | 104 |
| 14 | `/services/commercial-painting` | → /services/painting-services | redirect | n/a | 105 |
| 15 | `/services/general-contracting` | → /services | redirect | n/a | 106 |
| 16 | `/services/construction-management` | → /services | redirect | n/a | 107 |
| 17 | `/services/design-build` | → /services | redirect | n/a | 108 |
| 18 | `/services/waterproofing` | → /services/waterproofing-systems | redirect | n/a | 109 |
| 19 | `/services/sealant-replacement` | → /services/sealant-programs | redirect | n/a | 110 |
| 20 | `/services/roofing` | → /services/building-envelope-solutions | redirect | n/a | 111 |
| 21 | `/services/windows-doors` | → /services/building-envelope-solutions | redirect | n/a | 112 |
| 22 | `/services/preconstruction-services` | → /services | redirect | n/a | 113 |
| 23 | `/services/virtual-design-construction` | → /services | redirect | n/a | 114 |
| 24 | `/services/parking-rehabilitation` | → /services/parking-garage-restoration | redirect | n/a | 115 |
| 25 | `/services/sustainable-construction` | → /services/sustainable-building | redirect | n/a | 116 |
| 26 | `/services/protective-coatings` | → /services/painting-services | redirect | n/a | 117 |
| 27 | `/services/stucco` | → /services/cladding-systems | redirect | n/a | 119 |
| 28 | `/services/stucco-eifs` | → /services/eifs-stucco-systems | redirect | n/a | 120 |
| 29 | `/services/sealants` | → /services/building-envelope-solutions | redirect | n/a | 121 |
| 30 | `/services/sealants-caulking` | → /services/sealant-programs | redirect | n/a | 122 |
| 31 | `/services/parking-garage` | → /services/parking-garage-restoration | redirect | n/a | 123 |
| 32 | `/services/commercial` | → /services | redirect | n/a | 124 |
| 33 | `/services/condo` | → /services/painting-services | redirect | n/a | 125 |
| 34 | `/services/masonry` | → /services/masonry-restoration | redirect | n/a | 126 |
| 35 | `/services/commercial-painting-gta` | src/pages/services/CommercialPaintingGTA.tsx | page | yes | 129 |
| 36 | `/services/fire-retardant-coatings-ontario` | src/pages/services/FireRetardantCoatingsOntario.tsx | page | yes | 130 |
| 37 | `/services/exterior-painting-toronto` | src/pages/services/ExteriorPaintingToronto.tsx | page | yes | 131 |
| 38 | `/services/caulking-sealants-toronto` | src/pages/services/CaulkingSealantsToronto.tsx | page | yes | 132 |
| 39 | `/services/interior-painting-toronto` | src/pages/services/InteriorPaintingToronto.tsx | page | yes | 133 |
| 40 | `/services/residential-exterior-painting-gta` | src/pages/services/ResidentialExteriorPaintingGTA.tsx | page | yes | 134 |
| 41 | `/services/tile-installation-toronto` | src/pages/services/TileInstallationToronto.tsx | page | yes | 135 |
| 42 | `/services/flooring-installation-gta` | src/pages/services/FlooringInstallationGTA.tsx | page | yes | 136 |
| 43 | `/services/handyman-patching-toronto` | src/pages/services/HandymanPatchingToronto.tsx | page | yes | 137 |
| 44 | `/services/:slug` | src/pages/ServiceDetail.tsx | page | dynamic | 140 |
| 45 | `/` | src/pages/Index.tsx | page | yes | 203 |
| 46 | `/about` | src/pages/About.tsx | page | yes | 204 |
| 47 | `/markets` | src/pages/Markets.tsx | page | yes | 205 |
| 48 | `/why-specialty-contractor` | src/pages/WhySpecialtyContractor.tsx | page | NO | 206 |
| 49 | `/prequalification` | src/pages/Prequalification.tsx | page | yes | 207 |
| 50 | `/capabilities` | src/pages/Capabilities.tsx | page | yes | 208 |
| 51 | `/careers` | src/pages/Careers.tsx | page | yes | 209 |
| 52 | `/sustainability` | → /services/sustainable-building | redirect | n/a | 212 |
| 53 | `/insights` | → /blog | redirect | n/a | 213 |
| 54 | `/service-selector` | → /services | redirect | n/a | 214 |
| 55 | `/free-quote` | → /contact | redirect | n/a | 216 |
| 56 | `/get-estimate` | → /contact | redirect | n/a | 217 |
| 57 | `/projects` | src/pages/Projects.tsx | page | yes | 221 |
| 58 | `/contact` | src/pages/Contact.tsx | page | yes | 222 |
| 59 | `/estimate` | src/pages/Estimate.tsx | page | yes | 223 |
| 60 | `/submit-rfp` | src/pages/SubmitRFPNew.tsx | page | yes | 224 |
| 61 | `/for-general-contractors` | src/pages/ForGeneralContractors.tsx | page | yes | 225 |
| 62 | `/for-architects` | src/pages/ForArchitects.tsx | page | NO | 226 |
| 63 | `/emergency-repair` | src/pages/EmergencyRepair.tsx | page | NO | 227 |
| 64 | `/privacy` | src/pages/Privacy.tsx | page | yes | 228 |
| 65 | `/terms` | src/pages/Terms.tsx | page | yes | 229 |
| 66 | `/accessibility` | src/pages/Accessibility.tsx | page | yes | 230 |
| 67 | `/unsubscribe` | src/pages/Unsubscribe.tsx | page | NO | 231 |
| 68 | `/email-unsubscribe` | src/pages/EmailUnsubscribe.tsx | page | NO | 232 |
| 69 | `/property-managers` | src/pages/PropertyManagers.tsx | page | yes | 233 |
| 70 | `/homeowners` | src/pages/Homeowners.tsx | page | yes | 234 |
| 71 | `/commercial-clients` | src/pages/CommercialClients.tsx | page | yes | 235 |
| 72 | `/our-process` | src/pages/OurProcess.tsx | page | yes | 236 |
| 73 | `/faq` | src/pages/FAQ.tsx | page | yes | 237 |
| 74 | `/tekev` | src/pages/Auth.tsx | page | NO | 238 |
| 75 | `/.lovable/oauth/consent` | src/pages/OAuthConsent.tsx | page | NO | 239 |
| 76 | `/company/certifications-insurance` | src/pages/company/CertificationsInsurance.tsx | page | yes | 240 |
| 77 | `/company/equipment-resources` | → /company/technology | redirect | n/a | 241 |
| 78 | `/company/technology` | src/pages/company/Technology.tsx | page | yes | 242 |
| 79 | `/company/developers` | src/pages/company/Developers.tsx | page | yes | 243 |
| 80 | `/resources/contractor-portal` | src/pages/resources/ContractorPortal.tsx | page | yes | 244 |
| 81 | `/resources/service-areas` | src/pages/resources/ServiceAreas.tsx | page | yes | 245 |
| 82 | `/service-areas/:city` | src/pages/resources/LocationPage.tsx | page | dynamic | 246 |
| 83 | `/blog` | src/pages/Blog.tsx | page | yes | 247 |
| 84 | `/blog/:slug` | src/pages/BlogPost.tsx | page | dynamic | 248 |
| 85 | `/case-studies` | src/pages/Blog.tsx | page | NO | 249 |
| 86 | `/case-study/:slug` | src/pages/BlogPost.tsx | page | dynamic | 250 |
| 87 | `/projects/:slug` | src/pages/ProjectDetail.tsx | page | dynamic | 251 |
| 88 | `/dev/tokens` | src/pages/dev/TokenPreview.tsx | page | NO | 256 |
| 89 | `/404` | src/pages/NotFound.tsx | page | NO | 258 |
| 90 | `*` | src/pages/NotFound.tsx | page | NO | 259 |

**Admin routes** (`AppRoutes.tsx:144-198`): one `<Route path="/admin" element={<UnifiedAdminLayout/>}>` with ~50 children (dashboard, services, projects, blog, media, users, testimonials, documents-library, estimates-quotes, **inbox**, settings, seo-dashboard, audit, monitoring, email-templates, homepage-builder, qa/quick-contact-form, plus ~25 legacy redirects). The login page is **`/tekev`** (`AppRoutes.tsx:238`), not `/admin/login`.

**Pages that exist and are linked from `llms.txt`/the footer but missing from `sitemap.xml`:** `/why-specialty-contractor`, `/for-architects`, `/emergency-repair`, plus all 17 `/service-areas/<city>` pages and every `/projects/<slug>` page (see 1B).

### 1B. Rendering strategy and SEO plumbing

**Rendering: 100% client-side (CSR) — fact.** `npm run build` produces one `dist/index.html` plus JS chunks (`vite build`, no prerender/SSG/SSR plugin in `vite.config.ts` or `package.json`). Every route is therefore delivered to non-JS clients as the **same** static HTML. `index.html` hard-codes the following head tags, which are what a crawler or link-preview bot that does not run JavaScript will see on *every* URL:

| Tag | `index.html` line | Value |
|---|---|---|
| `<title>` | 129 | `Ascent Group Construction \| Building Envelope & Restoration` |
| `<meta name="description">` | 130 | `Self-performing specialty contractor delivering building envelope, façade, masonry, EIFS and parking garage restoration across the GTA and Ontario.` |
| `<link rel="canonical">` | 170 | `https://www.ascentgroupconstruction.com/` (the **homepage**, on every route) |
| `og:title` / `og:description` / `og:image` | 152-154 | same homepage values; `og:url` is not set statically |
| `twitter:url` | 163 | `https://www.ascentgroupconstruction.com/` |
| `<meta name="robots">` | 134 | `index, follow, max-image-preview:large, …` |
| `<div id="root">` body | 203-213 | spinner and the text `Loading...` (line 209) |
| `<noscript>` block | 218-265 | a one-page static fallback (hero H1, two CTAs, footer `© 2025 Ascent Group Construction`, line 262) |

**Root cause of the three known SEO issues (verified by experiment, not just by reading):**

1. *"Loading…" in the no-JS view.* `index.html:205-211` puts a spinner and the word "Loading..." inside `#root`; the app replaces it only after the JS bundle runs. Non-JS clients see "Loading…" (the `<noscript>` block is only shown when JavaScript is *disabled*, not when it is *unavailable to a bot*; most bots that skip JS still parse the `#root` content).
2. *Same title and description on every page.* Two independent causes:
   - **(a) Static head** (above): a client that does not run JS gets the homepage title/description for every URL.
   - **(b) A runtime bug that affects JS-capable clients too.** `src/components/Footer.tsx:136` and `:156` render `<SEO structuredData={citationSchema} />` with **no `title` or `description`**. Because the Footer renders after the page's own `<SEO>`, `react-helmet-async` lets the later (title-less) instance win, so `document.title` and the Helmet-managed description/`og:title` fall back to the default (`SEO.tsx:27,38`). Observed in headless Chromium: on `/about`, `/services`, `/contact` and every other route captured, `document.title` stayed `Ascent Group Construction | Building Envelope & Restoration` (see table in Phase 2.5). **Confirmation experiment:** in the scratch copy only, I replaced the two Footer `<SEO …/>` elements with empty fragments and rebuilt; the same headless run then produced per-page titles (`About — Envelope & Restoration | Ascent Group Construction`, `Specialty Contracting Services | Ascent Group Construction`, …). The repository itself was not changed.
3. *Homepage canonical on every page.* `index.html:170` is a static canonical to `/`. React Helmet adds a **second** `<link rel="canonical">` (route-specific) without removing the static one, so at runtime every non-home page has **two canonical tags with different URLs** (`/` and the page URL). Verified in Chromium (`/about`: `https://www.ascentgroupconstruction.com/` and `https://www.ascentgroupconstruction.com/about`). Google's documentation says conflicting canonical declarations are unreliable and may be ignored; the effect on Google's index cannot be measured from code (Unknown — check Search Console → Pages → "Duplicate, Google chose different canonical").


**Other head/SEO facts**

- `SEO.tsx:38` builds `fullTitle = title ? "${title} | ${COMPANY_NAME}" : "${COMPANY_NAME} | Building Envelope & Restoration"`. Pages that already put the brand in their own title therefore get it twice, e.g. `Contact.tsx:157` → `Contact Us | Ascent Group Construction | Ascent Group Construction` (observed in the Chromium experiment). Affected: Contact, Estimate, Markets, Projects, OurProcess, Prequalification, SubmitRFPNew, ServiceAreas, ContractorPortal, CertificationsInsurance, EmailUnsubscribe, plus EmergencyRepair and ForArchitects (`… | Ascent Group` + brand).
- Pages with **no** `<SEO>`: `src/pages/Auth.tsx` (`/tekev`) and `OAuthConsent.tsx`; they inherit the static `index, follow` robots tag.
- `src/pages/NotFound.tsx:62` sets `noindex`. `LocationPage` unknown-city (`:212-230`) and `BlogPost` not-found (`:105-117`) do not.
- Google Analytics `G-42L85RG6M6` is injected from `index.html:88-95`; cookie banner exists (see page audit). A **second** third-party call, `https://ipapi.co/json/`, is made from `src/utils/personalization.ts:182` (constructor path `:54`, imported by `src/pages/Index.tsx:32`) to guess the visitor's city and store it in `localStorage`. It is blocked by the site's own CSP in `public/_headers` (`connect-src` lacks `ipapi.co`) *if* that file were honoured (it is not — see 1E).
- Google Fonts: Barlow loaded from Google (`index.html:122-126`), with two hard-coded `fonts.gstatic.com` preloads (`index.html:116-117`); `public/fonts/inter-400.woff2` is the only self-hosted font. The preload URLs are version-pinned (`/v13/…`) and can go stale.

**`public/sitemap.xml`** (hand-maintained, 9,902 bytes): 49 `<url>` entries, host `https://www.ascentgroupconstruction.com`. `lastmod`: 25 entries `2026-03-08`, 24 entries `2026-06-06`; header comment says "Last updated: 2026-03-08" (`sitemap.xml:8-9`). Missing although they are real pages: `/why-specialty-contractor`, `/for-architects`, `/emergency-repair`, `/case-studies`, all 17 `/service-areas/<city>`, and every `/projects/<slug>` (project/case-study detail pages are the most valuable pages for bid evaluators). Only **one** blog post is listed (`/blog/toronto-property-manager-maintenance-guide`, line 218). A dynamic generator exists — `supabase/functions/generate-sitemap/index.ts` (queries the DB, lists 16 city pages) — but it uses host `https://ascentgroupconstruction.com` (**apex, no `www`**, `generate-sitemap/index.ts:27`) and is only invoked from the admin UI (`SEODashboard.tsx:260`, `SitemapManager.tsx:53`); nothing publishes its output to `/sitemap.xml`. Host mismatch (apex vs `www`) between that function, `smoke-test.yml` and the static sitemap/canonicals is a latent duplicate-host risk.

**`public/robots.txt`** (1,365 bytes): groups for `*`, Googlebot, Googlebot-Image, Googlebot-Video, Bingbot, MSNBot, Yandex, DuckDuckBot, Baiduspider, Twitterbot, facebookexternalhit, LinkedInBot, Pinterest and 11 AI crawlers each say `Allow: /`. The only `Disallow` lines (`/admin`, `/admin/`, `/tekev`, `/auth`, `/api/`) sit in a *second* `User-agent: *` group at the bottom. Crawlers follow only the most specific group that matches them, so **Googlebot, Bingbot and the other named bots are not covered by those Disallow lines** (they match their own `Allow: /` group). Also: `Crawl-delay` is ignored by Google; `Host:` is a Yandex-only directive; and listing `/tekev` in a public file advertises the admin login path. Sitemap line: `https://www.ascentgroupconstruction.com/sitemap.xml`.

**`public/llms.txt`** (7,230 bytes): an AI-crawler summary. It repeats claims (`$2M commercial general liability`, `15+ years of combined hands-on experience`, `our crew are direct employees, not subcontractors` at line 5) — note the last one conflicts with the "85% self-performed" claim used everywhere else (see 1H). Lists Saturday hours as 9:00–14:00 (line 57) whereas the JSON-LD in `SEO.tsx:119-123` says Saturday 09:00–16:00.

**JSON-LD.** `index.html` contains no JSON-LD. All structured data is injected client-side: `SEO.tsx:47-202` builds a `["HomeAndConstructionBusiness","LocalBusiness"]` organisation (name, phone, email, address, geo `43.7615,-79.4111`, `areaServed` = 5 cities + Ontario, opening hours, `priceRange "$$-$$$"`, `paymentAccepted` incl. "Financing Available", `foundingDate "2025"`, a 6-item `OfferCatalog`) and adds an aggregate rating only if `includeRating` is set and real testimonials exist (`SEO.tsx:205+`). Because `<SEO>` is rendered twice per page (page + Footer), the organisation block is emitted **twice** per page with the same `@id`, and pages that pass FAQ data emit `FAQPage` twice (observed on `/about`). A `ProfessionalService` block is emitted on every page. Types observed at runtime: HomeAndConstructionBusiness/LocalBusiness, ProfessionalService, BreadcrumbList, FAQPage, HowTo, ItemList, Service, VideoObject, WebSite, Question (home).

### 1C. The contact form, end to end

There is **not one** lead form but at least ten entry points into the database (table below). The "Contact" page (`/contact`) is the closest to what the brief describes, so it is traced in full; the others are summarised.

**All public lead-capture paths (facts):**

| # | Where (file:line) | Path to the database | Email trigger | Notes |
|---|---|---|---|---|
| 1 | `src/pages/Contact.tsx:71` (`/contact`) | `supabase.functions.invoke('submit-form', formType 'contact')` → service-role insert into `contact_submissions` | **Browser** then calls `send-contact-notification` (`Contact.tsx:103`) | traced below |
| 2 | `src/pages/Estimate.tsx:292,312` (`/estimate`) | **Direct anon insert from the browser** into `contact_submissions` and `quote_requests` | Browser calls `send-estimate-confirmation` (`Estimate.tsx:342`) | bypasses `submit-form` and its spam filters; protected only by RLS `WITH CHECK` + a DB rate-limit trigger |
| 3 | `src/components/estimator/QuoteRequestDialog.tsx:69` | Direct anon insert into `contact_submissions` | Browser calls `send-quote-confirmation` (`:81`) | same as #2 |
| 4 | `src/pages/SubmitRFPNew.tsx:171` (`/submit-rfp`) | `submit-form` with `formType: 'rfp'` → `rfp_submissions` (+ file uploads to Storage) | Browser calls `send-rfp-emails` (`:200`) | the closest thing to a "bid invitation" form today |
| 5 | `src/components/homepage/InteractiveCTA.tsx:133` (home page "Start a Project Conversation") | `submit-form` | not checked | third contact form, on the homepage |
| 6 | `src/components/forms/InlineLeadForm.tsx:79` | `submit-form` | not checked | reusable inline form |
| 7 | `src/components/homepage/PrequalPackage.tsx:44` | `submit-form` `prequalification` → `prequalification_downloads` | none found | gate for the prequal package |
| 8 | `src/pages/resources/ContractorPortal.tsx:95` | `submit-form` | not checked | "Partner With Ascent" |
| 9 | `src/components/ResumeSubmissionDialog.tsx:61` | `submit-form` `resume` → `resume_submissions` | browser calls `send-resume-notification` (`:89`) | careers |
| 10 | `src/components/blog/NewsletterSection.tsx:34`, `src/components/footer/NewsletterBackend.tsx:36` | Direct anon insert into `newsletter_subscribers` | n/a | two separate newsletter forms |

In addition, database triggers (`notify_*` in `supabase/migrations/20251117201340_remix_migration_from_pg_dump.sql:736-850`) create **in-app** rows in `admin_notifications` for new submissions; they do **not** send email. All admin email therefore depends on the browser successfully calling a second edge function after the insert.

#### 1C.1 What the visitor sees (UI) and how it is validated on the client

`/contact` shows a hero, a trust bar, a form card titled "Send Us a Message" and a side card with phone/email/hours and a "Submit RFP" button. Fields: Full Name\*, Email\*, Phone, Company, Project Details\* (min 10 chars), a required consent checkbox, an optional newsletter checkbox, a hidden honeypot field `honeypot`. There is **no** field for *who you are* (owner / property manager / GC / consultant), project type, building address, urgency, bid due date or a drawings link. Validation is a Zod schema applied inside the submit handler (not react-hook-form):

`src/pages/Contact.tsx` lines 30-39:

```ts
  30  // Input validation schema
  31  const contactSchema = z.object({
  32    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  33    email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  34    phone: z.string().trim().max(20, "Phone must be less than 20 characters").regex(/^[0-9\s()+-]*$/, "Phone contains invalid characters").optional().or(z.literal("")),
  35    company: z.string().trim().max(100, "Company name must be less than 100 characters").optional().or(z.literal("")),
  36    message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
  37    consent: z.boolean().refine((val) => val === true, { message: "You must consent to be contacted" }),
  38    newsletterConsent: z.boolean().optional(),
  39  });
```

Observation on the schema: the name regex `^[a-zA-Z\s'-]+$` (line 32) rejects accented letters, periods and curly apostrophes, so e.g. "Zoë", "José", "Dr. Smith", "O’Brien" (curly) fail with "Name contains invalid characters". The same regex is repeated on the server in `send-contact-notification/index.ts:30`. `consent` and `newsletterConsent` are validated client-side only (see 1C.3).

#### 1C.2 Submit handler and API call (`src/pages/Contact.tsx`)

`src/pages/Contact.tsx` lines 51-137:

```tsx
  51    const handleSubmit = async (e: React.FormEvent) => {
  52      e.preventDefault();
  53      if (isSubmittingRef.current) return;
  54      const now = Date.now();
  55      if (now - lastSubmitTime < 10000) {
  56        toast({ title: "Slow down!", description: "Please wait a moment before submitting again.", variant: "destructive" });
  57        return;
  58      }
  59      isSubmittingRef.current = true;
  60      setIsSubmitting(true);
  61  
  62      try {
  63        const validatedData = contactSchema.parse(formData);
  64        
  65        trackFormSubmit('contact_form', {
  66          has_phone: !!validatedData.phone,
  67          has_company: !!validatedData.company,
  68          newsletter_opt_in: validatedData.newsletterConsent
  69        });
  70        
  71        const { data, error } = await supabase.functions.invoke('submit-form', {
  72          body: {
  73            formType: 'contact',
  74            data: {
  75              name: validatedData.name, 
  76              email: validatedData.email, 
  77              phone: validatedData.phone, 
  78              company: validatedData.company, 
  79              message: validatedData.message, 
  80              submission_type: 'contact',
  81              consent_timestamp: new Date().toISOString(),
  82              newsletter_consent: validatedData.newsletterConsent || false
  83            },
  84            honeypot: formData.honeypot
  85          }
  86        });
  87  
  88        if (error) {
  89          if (error.message?.includes('Rate limit exceeded')) {
  90            toast({ title: "Too many submissions", description: "Please try again in a few minutes.", variant: "destructive" });
  91            return;
  92          }
  93          throw error;
  94        }
  95        if (data && (data as { success?: boolean }).success === false) {
  96          throw new Error('The submission was not accepted. Please try again.');
  97        }
  98  
  99        let notificationWarning = false;
 100        try {
 101          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Email notification timeout')), 10000));
 102          await Promise.race([
 103            supabase.functions.invoke('send-contact-notification', {
 104              body: { name: validatedData.name, email: validatedData.email, phone: validatedData.phone, company: validatedData.company, message: validatedData.message, submissionType: "Contact Form" }
 105            }),
 106            timeoutPromise
 107          ]);
 108  
 109          // Review requests are sent by staff from the admin area, not triggered
 110          // by anonymous form submissions.
 111        } catch (emailError) {
 112          notificationWarning = true;
 113          console.error('Email notification failed:', emailError);
 114        }
 115  
 116        await trackABTestConversion('homepage-hero-2024', 1);
 117  
 118        toast({
 119          title: "Message sent!",
 120          description: notificationWarning
 121            ? "Your request was saved, but email notifications are delayed. Our team will still follow up."
 122            : "We'll get back to you within 24 hours. Check your email for confirmation.",
 123        });
 124        setFormData({ name: "", email: "", phone: "", company: "", message: "", honeypot: "", consent: false, newsletterConsent: false });
 125        setLastSubmitTime(now);
 126      } catch (error) {
 127        if (error instanceof z.ZodError) {
 128          const firstError = error.issues[0];
 129          toast({ title: "Validation Error", description: firstError.message, variant: "destructive" });
 130        } else {
 131          toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
 132        }
 133      } finally {
 134        setIsSubmitting(false);
 135        isSubmittingRef.current = false;
 136      }
 137    };
```

Facts about this handler worth recording:

- The call is `supabase.functions.invoke('submit-form', …)` (`:71`) — an edge function, not a direct table insert. The anonymous visitor authenticates with the project's public anon key (`.env` → `VITE_SUPABASE_PUBLISHABLE_KEY`; value not reproduced here).
- `startedAt` is **not** sent (`:71-86`), so the "submitted too fast" filter in `submit-form` (`index.ts:118-124`) is inert for this form.
- The branch at `:89` (`error.message?.includes('Rate limit exceeded')`) is probably dead: for a non-2xx response `supabase-js` v2 (`^2.116.0`, `package.json:50`) sets `error.message` to a generic "Edge Function returned a non-2xx status code", so the visitor would see the generic "Failed to send message" toast on a 429 (not verified at runtime).
- Email is a **second, browser-initiated** call (`:99-114`). If the tab is closed, the network drops, or the 10-second client timeout wins the race (`:101-107`), the lead is saved but no email is sent; the visitor is told "Your request was saved, but email notifications are delayed" (`:120-121`).
- `trackABTestConversion('homepage-hero-2024', 1)` (`:116`) is called on every contact submission regardless of which page variant the user saw.

#### 1C.3 JSX of the form (`src/pages/Contact.tsx`)

`src/pages/Contact.tsx` lines 215-289:

```tsx
 215              <div className="lg:col-span-2">
 216                <Card variant="elevated" size="lg">
 217                  <div className="mb-6">
 218                    <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
 219                    <p className="text-muted-foreground">
 220                      Fill out the form below and our team will get back to you within one business day.
 221                    </p>
 222                  </div>
 223                  <form onSubmit={handleSubmit} className="space-y-6">
 224                    <div className="grid md:grid-cols-2 gap-6">
 225                      <div className="space-y-2">
 226                        <Label htmlFor="name" className="text-base">Full Name *</Label>
 227                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Smith" className="h-12 text-base" />
 228                      </div>
 229                      <div className="space-y-2">
 230                        <Label htmlFor="email" className="text-base">Email *</Label>
 231                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="h-12 text-base" />
 232                      </div>
 233                    </div>
 234                    <div className="grid md:grid-cols-2 gap-6">
 235                      <div className="space-y-2">
 236                        <Label htmlFor="phone" className="text-base">Phone</Label>
 237                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="(647) 123-4567" className="h-12 text-base" />
 238                      </div>
 239                      <div className="space-y-2">
 240                        <Label htmlFor="company" className="text-base">Company</Label>
 241                        <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Your Company" className="h-12 text-base" />
 242                      </div>
 243                    </div>
 244                    <div className="space-y-2">
 245                      <Label htmlFor="message" className="text-base font-semibold">Project Details *</Label>
 246                      <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="Tell us about your project requirements, timeline, and budget..." className="min-h-[160px] text-base" />
 247                    </div>
 248                    
 249                    <div className="space-y-3 pt-2">
 250                      <div className="flex items-start gap-3">
 251                        <input type="checkbox" id="consent" name="consent" checked={formData.consent} onChange={handleChange} required className="mt-1" />
 252                        <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
 253                          I consent to Ascent Group Construction contacting me about my inquiry via email or phone. *
 254                        </Label>
 255                      </div>
 256                      <div className="flex items-start gap-3">
 257                        <input type="checkbox" id="newsletterConsent" name="newsletterConsent" checked={formData.newsletterConsent} onChange={handleChange} className="mt-1" />
 258                        <Label htmlFor="newsletterConsent" className="text-sm leading-relaxed cursor-pointer">
 259                          I'd also like to receive construction industry insights and project updates. <Link to="/privacy" className="text-primary underline hover:no-underline">Privacy Policy</Link>
 260                        </Label>
 261                      </div>
 262                    </div>
 263                    
 264                    {/* Honeypot */}
 265                    <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
 266                      <Label htmlFor="website">Website</Label>
 267                      <Input id="website" name="honeypot" type="text" tabIndex={-1} autoComplete="off" value={formData.honeypot} onChange={handleChange} />
 268                    </div>
 269  
 270                    <MagneticButton className="w-full">
 271                      <RippleEffect className="w-full">
 272                        <Button type="submit" size="lg" className="w-full h-14 text-lg gap-3" disabled={isSubmitting}>
 273                          {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Sending...</>) : (<>Submit Request<ArrowRight className="w-5 h-5" /></>)}
 274                        </Button>
 275                      </RippleEffect>
 276                    </MagneticButton>
 277  
 278                    {/* Trust Badge */}
 279                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
 280                      <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-primary" />$2M Insured</span>
 281                      <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-primary" />WSIB Compliant</span>
 282                    </div>
 283  
 284                    <p className="text-xs text-muted-foreground text-center">
 285                      Your information is secure and will only be used to respond to your inquiry.
 286                    </p>
 287                  </form>
 288                </Card>
 289              </div>
```

#### 1C.4 Backend 1 — `supabase/functions/submit-form/index.ts` (complete file, 291 lines)

Behaviour summary (facts): CORS `*`; per-IP rate limit 5 per 15 min per form type via RPC `check_and_update_rate_limit` (fails *open* on error, `_shared/rateLimiter.ts:34-45`); honeypot; too-fast check (only if the client sends `startedAt`); a "3+ links" heuristic for non-RFP forms; a duplicate-content check (same email+message within 10 min, also fails open); Zod validation per form type; insert with the **service-role key** (`:90-91`) so RLS is bypassed; response `{success:true,id,created_at}`. A blocked submission returns **HTTP 202 with `success:false`** (`:71-75`). Not stored although the client sends them: `consent_timestamp` and `newsletter_consent` — they are not in `contactSchema` (`:7-14`) and Zod's default object parsing drops unknown keys, and the insert (`:181-189`) does not write them. `config.toml:6-7` sets `verify_jwt = false` for this function.

`supabase/functions/submit-form/index.ts` lines 1-291:

```ts
   1  import { createClient } from "npm:@supabase/supabase-js@2";
   2  import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
   3  import { checkRateLimit, createRateLimitResponse, getClientIdentifier } from "../_shared/rateLimiter.ts";
   4  import { createErrorResponse } from "../_shared/errorHandler.ts";
   5  import { corsHeaders, handleCors, jsonResponse } from "../_shared/http.ts";
   6  
   7  const contactSchema = z.object({
   8    name: z.string().min(1).max(100),
   9    email: z.string().email().max(255),
  10    phone: z.string().max(20).optional().nullable(),
  11    company: z.string().max(100).optional().nullable(),
  12    message: z.string().min(1).max(2000),
  13    submission_type: z.string().max(50).optional(),
  14  });
  15  
  16  const resumeSchema = z.object({
  17    name: z.string().min(1).max(100),
  18    email: z.string().email().max(255),
  19    phone: z.string().max(20).optional().nullable(),
  20    coverMessage: z.string().max(2000).optional().nullable(),
  21    // Frontend may send either a newline-separated string OR an array of links
  22    portfolioLinks: z.union([z.string().max(1000), z.array(z.string()).max(20)]).optional().nullable(),
  23  });
  24  
  25  const prequalificationSchema = z.object({
  26    companyName: z.string().min(1).max(200),
  27    contactName: z.string().min(1).max(100),
  28    email: z.string().email().max(255),
  29    phone: z.string().max(20).optional().nullable(),
  30    projectType: z.string().max(100).optional().nullable(),
  31    projectValueRange: z.string().max(50).optional().nullable(),
  32    message: z.string().max(2000).optional().nullable(),
  33  });
  34  
  35  const rfpSchema = z.object({
  36    company_name: z.string().min(1).max(200),
  37    contact_name: z.string().min(1).max(100),
  38    email: z.string().email().max(255),
  39    phone: z.string().min(10).max(20),
  40    title: z.string().max(100).optional().nullable(),
  41    project_name: z.string().min(1).max(300),
  42    project_type: z.string().min(1).max(100),
  43    project_location: z.string().min(1).max(500),
  44    estimated_value_range: z.string().min(1).max(50),
  45    estimated_timeline: z.string().min(1).max(200),
  46    project_start_date: z.string().optional().nullable(),
  47    delivery_method: z.string().min(1).max(100),
  48    bonding_required: z.boolean().optional(),
  49    prequalification_complete: z.boolean().optional(),
  50    scope_of_work: z.string().min(1).max(5000),
  51    additional_requirements: z.string().max(2000).optional().nullable(),
  52    plans_available: z.boolean().optional(),
  53    site_visit_required: z.boolean().optional(),
  54    attachment_urls: z.array(z.string()).optional().nullable(),
  55  });
  56  
  57  type FormSubmission = {
  58    formType: 'contact' | 'resume' | 'prequalification' | 'rfp';
  59    data: any;
  60    honeypot?: string;
  61    startedAt?: number;
  62  };
  63  
  64  // Spam heuristics
  65  function looksLikeLinkSpam(text: string | undefined | null): boolean {
  66    if (!text) return false;
  67    const matches = text.match(/(https?:\/\/|www\.)/gi);
  68    return (matches?.length ?? 0) >= 3;
  69  }
  70  
  71  function blockedResponse(reason: 'honeypot' | 'too_fast' | 'link_spam' | 'repeat_content'): Response {
  72    // This is deliberately distinct from a persisted submission. Do not claim a
  73    // record exists when anti-abuse controls rejected it.
  74    return jsonResponse({ success: false, status: 'blocked', reason }, 202);
  75  }
  76  
  77  async function sha256Hex(input: string): Promise<string> {
  78    const buf = new TextEncoder().encode(input);
  79    const hash = await crypto.subtle.digest('SHA-256', buf);
  80    return Array.from(new Uint8Array(hash))
  81      .map((b) => b.toString(16).padStart(2, '0'))
  82      .join('');
  83  }
  84  
  85  Deno.serve(async (req) => {
  86    const cors = handleCors(req);
  87    if (cors) return cors;
  88  
  89    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  90    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  91    const supabase = createClient(supabaseUrl, supabaseKey);
  92  
  93    try {
  94      const payload = (await req.json()) as FormSubmission;
  95      const { formType, honeypot, startedAt } = payload;
  96  
  97      const clientId = getClientIdentifier(req);
  98  
  99      if (!['contact', 'resume', 'prequalification', 'rfp'].includes(formType)) {
 100        return createErrorResponse(new Error('Invalid form type'), 'Invalid form type', 400, 'submit-form');
 101      }
 102  
 103      // Limit each public form independently before any database insert. This
 104      // keeps one noisy form type from consuming the allowance for another.
 105      const rateLimit = await checkRateLimit(supabase, clientId, `submit-form:${formType}`, 5, 15);
 106      if (!rateLimit.allowed) {
 107        console.log(`[rate_limited] client=${clientId} type=${formType}`);
 108        return createRateLimitResponse(rateLimit.retry_after_seconds ?? 900, corsHeaders);
 109      }
 110  
 111      // --- Spam Filter 1: Honeypot ---
 112      if (honeypot && honeypot.trim().length > 0) {
 113        console.log(`[spam_blocked] reason=honeypot client=${clientId} type=${formType}`);
 114        return blockedResponse('honeypot');
 115      }
 116  
 117      // --- Spam Filter 2: Submitted too fast (< 2s from form interaction) ---
 118      if (typeof startedAt === 'number' && startedAt > 0) {
 119        const elapsed = Date.now() - startedAt;
 120        if (elapsed < 2000) {
 121          console.log(`[spam_blocked] reason=too_fast elapsed=${elapsed}ms client=${clientId} type=${formType}`);
 122          return blockedResponse('too_fast');
 123        }
 124      }
 125  
 126      // --- Spam Filter 3: Link-heavy message body ---
 127      const messageBody =
 128        payload.data?.message ??
 129        payload.data?.scope_of_work ??
 130        payload.data?.coverMessage ??
 131        '';
 132      // RFP scopes commonly include plan-room and document links. Apply this
 133      // generic link heuristic only to the smaller public lead forms.
 134      if (formType !== 'rfp' && looksLikeLinkSpam(messageBody)) {
 135        console.log(`[spam_blocked] reason=link_spam client=${clientId} type=${formType}`);
 136        return blockedResponse('link_spam');
 137      }
 138  
 139      // --- Spam Filter 4: Repeat content (same message+email within 10 min) ---
 140      // CRITICAL: This is a "nice to have" guard. ANY failure here must NOT block legitimate
 141      // submissions. Wrapped in a defensive IIFE that always returns { allowed: true } on error.
 142      const repeatCheck = await (async (): Promise<{ allowed: boolean }> => {
 143        if (!messageBody || !payload.data?.email) return { allowed: true };
 144        try {
 145          const fingerprint = await sha256Hex(`${payload.data.email}:${messageBody}`.toLowerCase());
 146          const { data: rateData, error: rateErr } = await supabase.rpc(
 147            'check_and_update_rate_limit',
 148            {
 149              p_identifier: `${clientId}:${fingerprint.slice(0, 16)}`,
 150              p_endpoint: `submit-form-dup:${formType}`,
 151              p_limit: 1,
 152              p_window_minutes: 10,
 153            },
 154          );
 155          if (rateErr) {
 156            console.warn('[spam_filter] repeat-content RPC error (allowing through):', rateErr);
 157            return { allowed: true };
 158          }
 159          const allowed = !(rateData && (rateData as any).allowed === false);
 160          return { allowed };
 161        } catch (e) {
 162          console.warn('[spam_filter] repeat-content check threw (allowing through):', e);
 163          return { allowed: true };
 164        }
 165      })();
 166      if (!repeatCheck.allowed) {
 167        console.log(`[spam_blocked] reason=repeat_content client=${clientId} type=${formType}`);
 168        return blockedResponse('repeat_content');
 169      }
 170  
 171      let insertResult: any;
 172      let insertedId: string | null = null;
 173      let createdAt: string | null = null;
 174  
 175      try {
 176        switch (formType) {
 177          case 'contact': {
 178            const validatedData = contactSchema.parse(payload.data);
 179            insertResult = await supabase
 180              .from('contact_submissions')
 181              .insert({
 182                name: validatedData.name,
 183                email: validatedData.email,
 184                phone: validatedData.phone || null,
 185                company: validatedData.company || null,
 186                message: validatedData.message,
 187                submission_type: validatedData.submission_type || 'contact',
 188                status: 'new'
 189              });
 190            break;
 191          }
 192          case 'resume': {
 193            const validatedData = resumeSchema.parse(payload.data);
 194            // Normalize portfolioLinks (string or array) into a single text block,
 195            // then combine with the cover message since resume_submissions has only
 196            // a `cover_letter` column (no portfolio_links column).
 197            const portfolioText = Array.isArray(validatedData.portfolioLinks)
 198              ? validatedData.portfolioLinks.filter(Boolean).join('\n')
 199              : (validatedData.portfolioLinks ?? '').trim();
 200            const coverLetterBody = [
 201              validatedData.coverMessage?.trim(),
 202              portfolioText ? `\n\nPortfolio links:\n${portfolioText}` : null,
 203            ]
 204              .filter(Boolean)
 205              .join('') || null;
 206  
 207            insertResult = await supabase
 208              .from('resume_submissions')
 209              .insert({
 210                applicant_name: validatedData.name,
 211                email: validatedData.email,
 212                phone: validatedData.phone || null,
 213                cover_letter: coverLetterBody,
 214                status: 'new'
 215              });
 216            break;
 217          }
 218          case 'prequalification': {
 219            const validatedData = prequalificationSchema.parse(payload.data);
 220            insertResult = await supabase
 221              .from('prequalification_downloads')
 222              .insert({
 223                company_name: validatedData.companyName,
 224                contact_name: validatedData.contactName,
 225                email: validatedData.email,
 226                phone: validatedData.phone || null,
 227                project_type: validatedData.projectType || null,
 228                project_value_range: validatedData.projectValueRange || null,
 229                message: validatedData.message || null,
 230                status: 'new'
 231              });
 232            break;
 233          }
 234          case 'rfp': {
 235            const validatedData = rfpSchema.parse(payload.data);
 236            insertResult = await supabase
 237              .from('rfp_submissions')
 238              .insert({
 239                company_name: validatedData.company_name,
 240                contact_name: validatedData.contact_name,
 241                email: validatedData.email,
 242                phone: validatedData.phone,
 243                title: validatedData.title || null,
 244                project_name: validatedData.project_name,
 245                project_type: validatedData.project_type,
 246                project_location: validatedData.project_location,
 247                estimated_value_range: validatedData.estimated_value_range,
 248                estimated_timeline: validatedData.estimated_timeline,
 249                project_start_date: validatedData.project_start_date || null,
 250                delivery_method: validatedData.delivery_method,
 251                bonding_required: validatedData.bonding_required ?? false,
 252                prequalification_complete: validatedData.prequalification_complete ?? false,
 253                scope_of_work: validatedData.scope_of_work,
 254                additional_requirements: validatedData.additional_requirements || null,
 255                plans_available: validatedData.plans_available ?? false,
 256                site_visit_required: validatedData.site_visit_required ?? false,
 257                consent_timestamp: new Date().toISOString(),
 258                attachment_urls: validatedData.attachment_urls && validatedData.attachment_urls.length > 0
 259                  ? validatedData.attachment_urls
 260                  : null,
 261              })
 262              .select('id, created_at')
 263              .single();
 264            if (insertResult?.data) {
 265              insertedId = (insertResult.data as any).id;
 266              createdAt = (insertResult.data as any).created_at;
 267            }
 268            break;
 269          }
 270        }
 271      } catch (validationError) {
 272        console.error('[Validation Error]', validationError);
 273        return createErrorResponse(validationError, 'Invalid form data', 400, 'submit-form');
 274      }
 275  
 276      if (insertResult?.error) {
 277        throw insertResult.error;
 278      }
 279  
 280      console.log(`[Success] ${formType} submission from ${clientId}`);
 281      return jsonResponse({
 282        success: true,
 283        message: 'Submission received successfully',
 284        id: insertedId,
 285        created_at: createdAt,
 286      });
 287    } catch (error) {
 288      console.error('[Error]', error);
 289      return createErrorResponse(error, 'Failed to process submission', 500, 'submit-form');
 290    }
 291  });
```

`getClientIdentifier` (`_shared/rateLimiter.ts:53-59`) trusts `cf-connecting-ip`, then the first `x-forwarded-for` value, then `x-real-ip`. Whether Supabase's edge layer overwrites a client-supplied `X-Forwarded-For` is **Unknown** (needs a test against a deployed function); if it does not, the rate limit can be evaded by rotating that header. `_shared/http.ts:1-4` sets `Access-Control-Allow-Origin: *`.

#### 1C.5 Backend 2 — `supabase/functions/send-contact-notification/index.ts` (complete file, 210 lines)

Behaviour summary (facts): `config.toml:57-58` sets `verify_jwt = true`, but the browser calls it with the public anon key, which *is* a valid JWT — so any website visitor (or any script holding the anon key printed in the JS bundle) can call it directly. It does **not** check that a matching `contact_submissions` row exists, so it can be used to make Ascent's mail account send a branded "Thanks for contacting Ascent" email to **any address the caller supplies** (`to: [email]` at `:182`), limited only by a 5-per-minute per-IP counter (`:94-101`; fails open at `:103-106`). It sends two emails: one to `info@ascentgroupconstruction.com` (`:141-158`) and a confirmation to the visitor (`:180-191`). Both use **`from: "…<onboarding@resend.dev>"`** — Resend's shared *test* sender (see 1D). The result of each `resend.emails.send(...)` is returned as JSON but its `error` field is never inspected (`:193`), so the function answers HTTP 200 even if Resend rejected the message.

`supabase/functions/send-contact-notification/index.ts` lines 1-210:

```ts
   1  import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
   2  import { createClient } from "npm:@supabase/supabase-js@2";
   3  import { Resend } from "https://esm.sh/resend@2.0.0";
   4  import { createErrorResponse, createRateLimitResponse, logSecurityError } from "../_shared/errorHandler.ts";
   5  import { renderBrandedEmail, renderPlainText, REPLY_TO_EMAIL } from "../_shared/emailTemplate.ts";
   6  
   7  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
   8  
   9  const corsHeaders = {
  10    "Access-Control-Allow-Origin": "*",
  11    "Access-Control-Allow-Headers":
  12      "authorization, x-client-info, apikey, content-type",
  13  };
  14  
  15  interface ContactNotificationRequest {
  16    name: string;
  17    email: string;
  18    phone?: string;
  19    company?: string;
  20    message: string;
  21    submissionType: string;
  22  }
  23  
  24  // Input validation function
  25  const validateInput = (data: ContactNotificationRequest): { valid: boolean; error?: string } => {
  26    // Name validation
  27    if (!data.name || data.name.trim().length < 2 || data.name.trim().length > 100) {
  28      return { valid: false, error: "Invalid name length" };
  29    }
  30    if (!/^[a-zA-Z\s'-]+$/.test(data.name)) {
  31      return { valid: false, error: "Invalid name characters" };
  32    }
  33  
  34    // Email validation
  35    if (!data.email || data.email.trim().length > 255) {
  36      return { valid: false, error: "Invalid email length" };
  37    }
  38    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  39    if (!emailRegex.test(data.email)) {
  40      return { valid: false, error: "Invalid email format" };
  41    }
  42  
  43    // Phone validation (if provided)
  44    if (data.phone && (data.phone.length > 20 || !/^[0-9\s()+-]*$/.test(data.phone))) {
  45      return { valid: false, error: "Invalid phone format" };
  46    }
  47  
  48    // Company validation (if provided)
  49    if (data.company && data.company.length > 100) {
  50      return { valid: false, error: "Invalid company name length" };
  51    }
  52  
  53    // Message validation
  54    if (!data.message || data.message.trim().length < 10 || data.message.trim().length > 2000) {
  55      return { valid: false, error: "Invalid message length" };
  56    }
  57  
  58    return { valid: true };
  59  };
  60  
  61  // Sanitize input to prevent XSS
  62  const sanitize = (str: string): string => {
  63    return str
  64      .replace(/&/g, '&amp;')
  65      .replace(/</g, '&lt;')
  66      .replace(/>/g, '&gt;')
  67      .replace(/"/g, '&quot;')
  68      .replace(/'/g, '&#x27;')
  69      .replace(/\//g, '&#x2F;');
  70  };
  71  
  72  const handler = async (req: Request): Promise<Response> => {
  73    // Handle CORS preflight requests with comprehensive headers
  74    if (req.method === "OPTIONS") {
  75      return new Response(null, { 
  76        status: 200,
  77        headers: {
  78          ...corsHeaders,
  79          'Access-Control-Max-Age': '86400', // 24 hours
  80        }
  81      });
  82    }
  83  
  84    try {
  85      const supabaseClient = createClient(
  86        Deno.env.get('SUPABASE_URL') ?? '',
  87        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  88      );
  89  
  90      // Get client identifier for rate limiting (IP or user ID)
  91      const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  92      const identifier = `contact-${clientIP}`;
  93  
  94      // Enhanced rate limiting: 5 requests per minute (reduced from 50)
  95      const { data: rateLimitResult, error: rateLimitError } = await supabaseClient
  96        .rpc('check_and_update_rate_limit', {
  97          p_identifier: identifier,
  98          p_endpoint: 'send-contact-notification',
  99          p_limit: 5, // Reduced to 5 per minute for contact forms
 100          p_window_minutes: 1
 101        });
 102  
 103      if (rateLimitError) {
 104        logSecurityError('rate_limit_check', rateLimitError, { identifier });
 105        // Allow request on error to prevent blocking legitimate users
 106        console.warn('Rate limit check failed, allowing request:', rateLimitError);
 107      } else if (rateLimitResult && !rateLimitResult.allowed) {
 108        logSecurityError('rate_limit_exceeded', new Error('Rate limit exceeded'), {
 109          identifier,
 110          request_count: rateLimitResult.request_count,
 111          limit: rateLimitResult.limit,
 112        });
 113        
 114        return createRateLimitResponse(rateLimitResult.retry_after_seconds || 60);
 115      }
 116  
 117      const requestData: ContactNotificationRequest = await req.json();
 118  
 119      // Validate input
 120      const validation = validateInput(requestData);
 121      if (!validation.valid) {
 122        return createErrorResponse(
 123          new Error(validation.error),
 124          validation.error,
 125          400,
 126          'input_validation'
 127        );
 128      }
 129  
 130      // Sanitize all inputs
 131      const { name, email, phone, company, message, submissionType } = {
 132        name: sanitize(requestData.name.trim()),
 133        email: sanitize(requestData.email.trim()),
 134        phone: requestData.phone ? sanitize(requestData.phone.trim()) : undefined,
 135        company: requestData.company ? sanitize(requestData.company.trim()) : undefined,
 136        message: sanitize(requestData.message.trim()),
 137        submissionType: sanitize(requestData.submissionType),
 138      };
 139  
 140      // Send notification to admin
 141      const adminEmail = await resend.emails.send({
 142        from: "Ascent Group <onboarding@resend.dev>",
 143        to: ["info@ascentgroupconstruction.com"],
 144        reply_to: requestData.email.trim(),
 145        subject: `[Contact] ${name} — ${submissionType}`,
 146        html: `
 147          <h2>New Contact Submission</h2>
 148          <p><strong>Type:</strong> ${submissionType}</p>
 149          <p><strong>Name:</strong> ${name}</p>
 150          <p><strong>Email:</strong> ${email}</p>
 151          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
 152          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
 153          <p><strong>Message:</strong></p>
 154          <p>${message}</p>
 155          <hr>
 156          <p><small>Submitted from Ascent Group Construction website</small></p>
 157        `,
 158      });
 159  
 160      // Send confirmation to user (branded template)
 161      const customerHeading = `Thanks for reaching out, ${name}`;
 162      const customerBodyHtml = `
 163        <p>Hi ${name},</p>
 164        <p>We've received your message and a member of our team will respond within <strong>1 business day</strong>. For urgent matters, please call us directly.</p>
 165        <div style="margin:18px 0;padding:14px 16px;background-color:#f9fafb;border-radius:4px;">
 166          <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;margin-bottom:6px;">Your message</div>
 167          <div style="font-size:14px;color:#333;line-height:1.5;">${message.replace(/\n/g, "<br>")}</div>
 168        </div>
 169        <p>Need immediate assistance? Call <a href="tel:6475286804" style="color:#003366;font-weight:600;">+1 (647) 528-6804</a> or reply directly to this email.</p>
 170      `;
 171      const customerBodyText = `Hi ${name},
 172  
 173  We've received your message and a member of our team will respond within 1 business day. For urgent matters, please call us directly.
 174  
 175  Your message:
 176  ${requestData.message.trim()}
 177  
 178  Need immediate assistance? Call +1 (647) 528-6804 or reply to this email.`;
 179  
 180      const userEmail = await resend.emails.send({
 181        from: "Ascent Group Construction <onboarding@resend.dev>",
 182        to: [email],
 183        reply_to: REPLY_TO_EMAIL,
 184        subject: "Thanks for contacting Ascent Group Construction — we'll respond within 1 business day",
 185        html: renderBrandedEmail({
 186          preheader: "We received your message and will respond within 1 business day.",
 187          heading: customerHeading,
 188          bodyHtml: customerBodyHtml,
 189        }),
 190        text: renderPlainText({ heading: customerHeading, textBody: customerBodyText }),
 191      });
 192  
 193      return new Response(JSON.stringify({ adminEmail, userEmail }), {
 194        status: 200,
 195        headers: {
 196          "Content-Type": "application/json",
 197          ...corsHeaders,
 198        },
 199      });
 200    } catch (error: any) {
 201      return createErrorResponse(
 202        error,
 203        'Failed to process contact submission',
 204        500,
 205        'send_contact_notification'
 206      );
 207    }
 208  };
 209  
 210  serve(handler);
```

### 1D. Backend, authentication and email

**Architecture (fact):** there is no server of the project's own. The browser talks directly to a **Supabase project (Lovable Cloud)** — project ref `<project-ref>` (value withheld; `supabase/config.toml:1`; the public URL appears in `index.html:107` and in the JS bundle) — for Postgres (with Row Level Security), Auth, Storage and **24 Deno edge functions** (`supabase/functions/*`, plus `_shared/`). 33 SQL migrations are in `supabase/migrations/`; a second, separate migration track exists in `drizzle/migrations/` (`drizzle.config.ts`; one hardening file `0001_harden_pii_grants_rls_and_definer_execute.sql`). Which track is applied to the live database is **Unknown** (Lovable normally applies only `supabase/migrations`). Two migrations have 12-digit version prefixes dated `202611020001/2` (`supabase/migrations/202611020001_fix_recommendations_cache_rls.sql`, `…0002_fix_security_definer_functions.sql`) — a different format from the 14-digit timestamps used elsewhere and dated in the future relative to today (2026-10-02); the Supabase CLI sorts by numeric version, so ordering relative to the others is **Unknown**.

**Edge functions** (`verify_jwt` from `supabase/config.toml`; "callers" = invocations found in `src/`):

| Function | `verify_jwt` | Purpose (from code) | Called from `src/`? |
|---|---|---|---|
| `submit-form` | **false** | Public lead intake (contact/resume/prequal/rfp), service-role insert, spam filters | yes (≥8 call sites) |
| `send-contact-notification` | true (anon key passes) | Resend: admin email + visitor confirmation | `Contact.tsx:103` |
| `send-estimate-confirmation` | true | Resend: estimate notifications | `Estimate.tsx:342` |
| `send-quote-confirmation` | true | Resend: quote-dialog notifications | `QuoteRequestDialog.tsx:81` |
| `send-resume-notification` | true | Resend: careers | `ResumeSubmissionDialog.tsx:89` |
| `send-rfp-emails` | **false** | Lovable email stack: RFP confirmation + internal notice, looked up by `rfpId` | `SubmitRFPNew.tsx:200` |
| `send-rfp-notification` | true | Resend: older RFP notification | **no caller found** |
| `send-package-notification` | true | Resend: prequal package notification to `projects@` | **no caller found** |
| `send-review-request` | true | Lovable email: review request | no caller found (staff-triggered?) |
| `send-admin-notification` | **false** (checks JWT + admin role itself, `index.ts:27-58`) | In-app `admin_notifications` rows (not email) | no caller found |
| `check-login-attempt` | **false** | Login lockout (per email+IP, `index.ts:43`) | `Auth.tsx:40,61,69` |
| `invite-user`, `process-image`, `analyze-performance`, `generate-keywords`, `generate-seo-content`, `fetch-search-console-data`, `google-search-console-auth` | true | admin tooling / SEO | admin UI |
| `google-oauth-callback`, `scheduled-fetch-search-console`, `generate-sitemap`, `handle-email-events`, `preview-transactional-email` | **false** | OAuth redirect, cron, sitemap, email webhook, template preview | admin UI / webhook |
| `mcp` | not listed in `config.toml` (platform default) | Lovable MCP server (`@lovable.dev/mcp-js`) exposing list/get tools for projects, services, blog, contact and RFP submissions; each tool checks the bearer token (`mcp/index.ts:78,110,…`) and uses OAuth issuer `https://<ref>.supabase.co/auth/v1` (`:275-277`) | n/a |

**Email — two parallel stacks (fact):**

1. **Resend with the shared test sender.** Every Resend-based function sends `from: "… <onboarding@resend.dev>"` — 12 occurrences: `send-contact-notification/index.ts:142,181`, `send-estimate-confirmation/index.ts:122,138`, `send-package-notification/index.ts:161,207`, `send-quote-confirmation/index.ts:106,120`, `send-resume-notification/index.ts:158,202`, `send-rfp-notification/index.ts:155,185`. Resend documents `onboarding@resend.dev` as a testing sender that can only deliver to the email address of the Resend account owner. If the `ascentgroupconstruction.com` domain has not been verified in Resend and these functions still use that sender, **messages to `info@`, `estimating@`, `projects@`, `careers@` and to every visitor would be rejected** — and because the functions ignore the send result (see 1C.5) nobody would be told. Whether the production Resend account has a verified domain is **Unknown** (check Resend → Domains and Logs). Recipients are hard-coded: `info@` (contact), `estimating@` (estimate, quote, RFP), `projects@` (package), `careers@` (resume).
2. **Lovable Emails** (`@lovable.dev/email-js`) for RFP and review requests: `_shared/transactional-email-templates/send-email.ts` sends `from: "${SITE_NAME} <noreply@${FROM_DOMAIN}>"` with `SITE_NAME = "AscentGroupWebsiteV1 47"` (`send-email.ts:10`), `FROM_DOMAIN = "www.ascentgroupconstruction.com"` (`:16`), `SENDER_DOMAIN = "notify.www.ascentgroupconstruction.com"` (`:13`). So an RFP confirmation would show the sender name **"AscentGroupWebsiteV1 47"** to a GC. It is the better-engineered path (recipient and content loaded server-side from the stored row; idempotency key per RFP, `send-rfp-emails/index.ts:134,158`; suppression handling; `email_send_log`).

**Authentication and authorisation (fact):**

- Admin login is Supabase email+password at **`/tekev`** (`src/pages/Auth.tsx`), titled "Ascent Group CMS — Admin Access Only". It calls `check-login-attempt` before/after sign-in (lockout scoped to `email|IP`). No MFA or CAPTCHA was found in the code read. The login URL is disclosed in `public/robots.txt`.
- Roles live in table `user_roles` (`admin`, `super_admin`). The admin UI guard is **client-side** (`src/components/admin/UnifiedAdminLayout.tsx:95-97` redirects non-admins to `/`; role fetched by `src/hooks/useAdminAuth.ts`). That guard is only a UX layer; real protection is Postgres RLS (`public.is_admin(auth.uid())` in the policies) and the role checks inside edge functions.
- RLS (baseline dump `20251117201340_remix_migration_from_pg_dump.sql`): anonymous `INSERT … WITH CHECK (true)` on `contact_submissions` (`:4239`), `rfp_submissions` (`:4232`), `quote_requests` (`:4451`), `prequalification_downloads` (`:4246`), `newsletter_subscribers` (`:4253`); `SELECT` limited to admins (`:4127`, `:4325` blocks anonymous select on contacts). Later migrations add a rate-limit trigger (`20260417170110_*.sql`) and PII-grant hardening (`drizzle/migrations/0001_*.sql`). The **effective** policy set on the live database is Unknown (run `select * from pg_policies` against the project).
- Storage buckets created in migrations: `project-images` (public), `documents` (public), `rfp-attachments` (private; policies in `20260308204816_*.sql` and `20260610193847_*.sql`).

**Secrets (names only):** `.env` (committed, not git-ignored — `.gitignore` has no `.env` entry) holds `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL` (public, browser-side values). Edge functions read `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `LOVABLE_API_KEY`, `LOVABLE_SEND_URL`, `GOOGLE_SEARCH_CONSOLE_CLIENT_ID`, `GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET`, `GOOGLE_SEARCH_CONSOLE_REDIRECT_URI` (set in the Supabase dashboard, not in the repo). No secret *values* were read or are reproduced in this report.

### 1E. Hosting, deployment, redirects, environment variables

- **Hosting (documented, not verifiable from code):** Lovable (`README.md:34` "Hosting | Lovable (with Lovable Cloud / Supabase backend)"; `.lovable/` folder; `lovable-tagger` and `@lovable.dev/mcp-js` plugins in `vite.config.ts:4-6,26-27`; `public/_redirects:1-4` states that Lovable hosting ignores it). There is no `netlify.toml`, `vercel.json`, `wrangler.toml` or Dockerfile. How the site is built and published (Lovable "Publish" button vs. the GitHub integration) is **Unknown**; the production domain is `www.ascentgroupconstruction.com` (canonical host in `SITE_URL`, `src/constants/company.ts:7-8`).
- **Redirects and headers — what actually works:** `public/_redirects` (45 lines, 301 rules for legacy URLs, apex→www, and SPA fallbacks) and `public/_headers` (cache policy, `X-Frame-Options`, `Referrer-Policy`, a CSP) are Netlify-format files. By the repo's own note (`_redirects:1-4`) **they have no effect on Lovable hosting**. Consequences (facts about the repo, effect on the live host Unknown until tested with `curl -I`): legacy URLs are redirected only in JavaScript (`<Navigate replace>`, `AppRoutes.tsx:93-126,212-217`) — a crawler that does not run JS sees HTTP 200 and the homepage HTML for every legacy URL; the CSP, `X-Frame-Options: DENY`, long-lived asset caching and no-cache HTML rules are unlikely to be applied; and `_redirects` and `AppRoutes.tsx` disagree with each other (e.g. `_redirects:38` sends `/sustainability` to `/services/sustainable-construction`, `AppRoutes.tsx:212` to `/services/sustainable-building`; `_redirects:34-35` send `/case-studies` and `/case-study/*` to `/blog…`, `AppRoutes.tsx:249-250` renders pages at those paths). The note at `_redirects:3` says the non-www→www redirect is handled by Lovable's edge: **Unknown** (test `curl -I http://ascentgroupconstruction.com`).
- **Service worker (fact):** `public/service-worker.js` (202 lines, "Permanent Service Worker") is registered in production by `src/main.tsx:70-74`, but `index.html:176-202` ("NUCLEAR: Force-clear all service workers and caches; auto-reload once if stale SW detected") **unregisters every service worker and deletes every cache on each full page load**, and reloads the page once per session if it found one. The two mechanisms fight each other: a returning visitor can get a registration → purge → forced reload cycle. The "offline support" described in comments is therefore not in effect.
- **CI (fact):** `.github/workflows/lighthouse-ci.yml` (19 lines) and `smoke-test.yml` (81 lines). Both run `npm ci`, and `smoke-test.yml` uses `actions/setup-node` with `cache: 'npm'`, but the repo contains **no `package-lock.json`** (only `bun.lock` and `deno.lock`), so both workflows would fail at the install/cache step. `lighthouse-ci.yml` never runs Lighthouse (it builds and runs `validate:sw`; `.lighthouserc.js` is unused by it). `smoke-test.yml` runs every 6 hours (`cron '0 */6 * * *'`) against **`https://ascentgroupconstruction.com` (apex, not `www`)** and then also runs `npx tsx` *and* `npx ts-node` on `scripts/audit-routes.ts`. Whether these workflows run (i.e. whether the code is on GitHub with Actions enabled) is **Unknown**.
- **Lockfile problem (fact, found while running the project):** `bun.lock` pins 1,264 package tarball URLs to a private Lovable mirror (`europe-west4-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache`). Outside Lovable, `bun install --frozen-lockfile` fails with HTTP 403 for ~985 packages. I could install only after rewriting those URLs in a **scratch copy** (integrity hashes kept); your `bun.lock` was not touched. Impact: a new developer, a CI runner, or any host other than Lovable cannot install dependencies from the repo as shipped.

**Environment variable names**

| Name | Where used | Visible to browser? |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` | `.env`; `src/integrations/supabase/client.ts` | yes (public by design) |
| `VITE_SITE_URL` | `src/constants/company.ts:8` (falls back to production URL) | yes |
| `VITE_ENABLE_PERFORMANCE_TRACKING` | 2 uses in `src/` | yes |
| `ENABLE_IMAGE_OPTIMIZATION` | `package.json` script `build:optimized`, `smoke-test.yml` | build-time |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | edge functions (28 / 12 / 19 uses) | no |
| `RESEND_API_KEY` | 6 edge functions | no |
| `LOVABLE_API_KEY`, `LOVABLE_SEND_URL` | `_shared/transactional-email-templates/send-email.ts` and 3 others | no |
| `GOOGLE_SEARCH_CONSOLE_CLIENT_ID`, `…_CLIENT_SECRET`, `…_REDIRECT_URI` | Search Console functions | no |
| GitHub Actions secret `VITE_SUPABASE_PROJECT_ID` | `smoke-test.yml:39` | CI |

Missing from the repo: no `.env.example` documenting the above.

### 1F. Styling and reusable components

- **Tailwind 3 + shadcn/Radix.** Config `tailwind.config.ts` (container and screens at `:21-28`; `fontFamily.sans = Inter` at `:29-30`). Design tokens are CSS variables in `src/index.css` (e.g. `--primary: 210 100% 20%` "Navy #003366", `--accent: 24 90% 50%` "Construction Orange", `index.css:49,58`) and `src/styles/tokens.css` (169 lines); dark theme tokens at `index.css:129+`. Global CSS is split across `src/index.css` and the files in `src/styles/` (`index.css` 974 lines plus 11 files in `src/styles/`).
- **Fonts.** The CSS body font is **Barlow** loaded from Google Fonts (`index.css:214,220,249`; `index.html:122-126`), while Tailwind's `sans` is Inter (`tailwind.config.ts:30`) and only `public/fonts/inter-400.woff2` is self-hosted; `index.css:682` references **Playfair Display**, which is not loaded anywhere. Admin CSS uses Inter (`src/styles/admin-theme.css:39`).
- **Three overlapping UI layers:** `src/components/ui/*` (56 shadcn primitives), `src/ui/*` (own `Button`, `Card`, `Input`, `Select`, `Textarea`; used by pages, e.g. `Contact.tsx` imports `@/ui/Button`), and `src/design-system/components/*` (CTABand, TrustRibbon, ProofStrip, SectionHeader, FAQAccordion, StickyPageNav, …). `eslint.config.js:24-29` has a `no-restricted-imports` rule meant to steer imports, and it is violated 13 times (lint, Phase 2).
- **Reusable section components exist and are applied consistently** (`Section`, `SectionBadge`, `TrustRibbon`, `GCTrustStrip`, `PrequalPackage`, `ProofStrip`), but the same trust claims are re-typed in at least 12 components (see 1H) rather than read from one source.
- **Global UI:** `StickyInquiryBar.tsx` (mobile/desktop bottom bar after 600 px scroll; hidden on `/admin`, `/estimate`, `/contact`, `/submit-rfp`, `/login`, `/auth` but not `/tekev`, `StickyInquiryBar.tsx:18-19`), `CookieBanner.tsx` (covers the bottom ~22% of the viewport on first visit — see screenshots), `ScrollToTop`, `ErrorBoundary`.

### 1G. Content: where it lives, one full example of each, and media weight

**Where content lives (facts):**

| Content | Storage | Evidence |
|---|---|---|
| Service pages (13 slugs in the sitemap: building-envelope-solutions, cladding-systems, waterproofing-systems, eifs-stucco-systems, masonry-restoration, facade-remediation, parking-garage-restoration, sealant-programs, painting-services, interior-buildouts-finishing, interior-finishing-renovations, tile-flooring, sustainable-building) | **Supabase table `services`** (DB-driven), plus per-slug static helpers (`src/data/service-quick-facts.ts`, `service-people-ask.ts`, `service-pillars.ts`, `service-faqs-enriched.ts`, `merged-services-data.ts`) | `ServiceDetail.tsx:184`; not seeded in any migration |
| 9 "Wave 1" SEO/AEO service pages | **In the repo**, `src/data/wave1-services.ts` (807 lines) rendered by `Wave1ServicePage.tsx` | `AppRoutes.tsx:129-137` |
| Projects / case studies | **Supabase table `projects`** (+ `project_images`); the repo contains **no case-study content at all** | `Projects.tsx:103`, `ProjectDetail.tsx:116`; no `INSERT INTO public.projects` in any migration |
| Blog posts | **Supabase table `blog_posts`** | `Blog.tsx:40`, `BlogPost.tsx:63`; only one post URL is in the sitemap |
| Testimonials, hero slides, site/footer/contact settings | Supabase tables `testimonials`, `hero_slides`, `site_settings`, `footer_settings`, `contact_page_settings` | `Testimonials.tsx:32`, `useHomepageData.ts:76`, `Footer.tsx:39-41`, `Contact.tsx:43` |
| Marketing copy for About/Capabilities/Markets/etc. | Hard-coded in the `.tsx` pages and in `src/data/*.ts` (3,866 lines) | e.g. `About.tsx:185,227`, `enriched-company-content.ts` |
| FAQs | `src/data/page-faqs.ts` (471 lines), `service-faqs-enriched.ts`, `blog-faq-data.ts`, `case-study-faq-data.ts` | |

Consequence: **the number, quality and truthfulness of live services, projects and blog posts cannot be determined from this repository (Unknown)**. What would answer it: a read-only export of the `services`, `projects`, `blog_posts` and `testimonials` tables, or the live site's pages.

**One full service entry (static; `WAVE1_PAGES["commercial-painting-gta"]`):**

`src/data/wave1-services.ts` lines 1-130:

```ts
   1  /**
   2   * Wave 1 AEO/GEO service pages — drafted content payload.
   3   *
   4   * One file, four pages. All copy is citation-ready (ChatGPT / Perplexity / Google AI Overviews).
   5   * Do not paraphrase or shorten without re-reading .lovable/plan.md — these strings drive
   6   * <title>, <meta description>, Direct Answer paragraphs, FAQ JSON-LD, and the trust strip.
   7   *
   8   * Trust language rules (locked):
   9   *   - "$2M commercial general liability" — verify against current policy
  10   *   - "15+ years of combined hands-on experience" — refers to crew, never company age
  11   *   - "Sto Canada Listed Installer" — no certificate ID until confirmed
  12   */
  13  
  14  export interface Wave1FAQ {
  15    question: string;
  16    answer: string;
  17  }
  18  
  19  export interface Wave1Section {
  20    heading: string;
  21    audience: string;
  22    bullets: string[];
  23  }
  24  
  25  export interface Wave1ServicePage {
  26    slug: string;
  27    title: string;
  28    metaDescription: string;
  29    primaryKeyword: string;
  30    secondaryKeywords: string[];
  31    h1: string;
  32    eyebrow: string;
  33    heroAlt: string;
  34    directAnswer: string;
  35    scopeHeading: string;
  36    scopeBullets: string[];
  37    /** Optional split sections (used for fire-retardant page) */
  38    splitSections?: Wave1Section[];
  39    materialsHeading?: string;
  40    materials?: string[];
  41    faqs: Wave1FAQ[];
  42    ctaSlug: string;
  43    /** Related sibling pages (slugs) */
  44    related: string[];
  45    /** Known trade-off note rendered as an HTML comment in source */
  46    knownTradeoff?: string;
  47  }
  48  
  49  const TRUST_LINE =
  50    "We self-perform, carry $2M commercial general liability and full WSIB coverage, and our crew brings 15+ years of combined hands-on experience.";
  51  
  52  export const WAVE1_PAGES: Record<string, Wave1ServicePage> = {
  53    "commercial-painting-gta": {
  54      slug: "commercial-painting-gta",
  55      title: "Commercial Painting Contractor GTA | Ascent Group",
  56      metaDescription:
  57        "Self-performed commercial painting across the GTA — offices, warehouses, ICI, multi-tenant. WSIB-covered, $2M CGL, off-hours scheduling available.",
  58      primaryKeyword: "commercial painting contractor GTA",
  59      secondaryKeywords: [
  60        "office painting Toronto",
  61        "warehouse painting Mississauga",
  62        "ICI painting subcontractor",
  63        "multi-tenant repaint",
  64        "commercial repaint contractor Ontario",
  65      ],
  66      h1: "Commercial Painting Contractor — Greater Toronto Area",
  67      eyebrow: "Commercial Painting",
  68      heroAlt:
  69        "Commercial painting by Ascent Group Construction — Greater Toronto Area",
  70      directAnswer:
  71        "Ascent Group Construction is a specialty contractor that self-performs commercial painting as one of several trade scopes across the Greater Toronto Area, including Toronto, Mississauga, Brampton, Vaughan, and Markham. We deliver interior and exterior repaints for offices, warehouses, ICI facilities, retail plazas, and multi-tenant buildings — including after-hours and weekend scheduling to avoid tenant disruption. Every project is executed by our own crew, not subcontracted out. We carry $2M commercial general liability, full WSIB coverage, and our crew brings 15+ years of combined hands-on experience applying Benjamin Moore, Sherwin-Williams, and PPG systems.",
  72      scopeHeading: "What we deliver",
  73      scopeBullets: [
  74        "Office interiors, common corridors, and lobbies",
  75        "Warehouse interiors, ceilings, and line-marking prep",
  76        "Exterior commercial repaints (stucco, EIFS, metal, masonry)",
  77        "Multi-tenant residential corridor and stairwell repaints",
  78        "Retail and plaza facade refresh",
  79        "Surface prep: pressure wash, sanding, priming, caulk renewal",
  80        "Off-hours and weekend scheduling to avoid tenant disruption",
  81        "Daily site clean and tenant-safe protection plans",
  82      ],
  83      materialsHeading: "Coating systems we apply",
  84      materials: [
  85        "Benjamin Moore Ultra Spec and Aura",
  86        "Sherwin-Williams ProMar and ProIndustrial",
  87        "PPG SPEEDHIDE",
  88      ],
  89      faqs: [
  90        {
  91          question: "How much does commercial painting cost in the GTA?",
  92          answer:
  93            "Most commercial repaints in the GTA run $2.50–$6.50 per square foot of wall area, depending on prep condition, ceiling height, surface type, and whether work is daytime or off-hours. After a site walkthrough we provide a fixed-price proposal with scope, schedule, and exclusions in writing.",
  94        },
  95        {
  96          question: "Do you do off-hours and weekend work?",
  97          answer:
  98            "Yes. For occupied offices, retail, and multi-tenant properties we routinely schedule evenings, weekends, and shutdown windows so tenants are not disrupted.",
  99        },
 100        {
 101          question: "Are you licensed, insured, and WSIB-covered?",
 102          answer:
 103            "Yes. We carry $2M commercial general liability and full WSIB coverage. Certificates are provided before site mobilization.",
 104        },
 105        {
 106          question: "Do you self-perform or subcontract?",
 107          answer:
 108            "We self-perform. Our painters are direct employees, which keeps quality, scheduling, and accountability under one roof. No broker layers.",
 109        },
 110        {
 111          question: "What surfaces do you paint?",
 112          answer:
 113            "Drywall, plaster, concrete block, exposed structure, metal, masonry, stucco, EIFS, and previously-coated substrates. We confirm coating compatibility before quoting.",
 114        },
 115        {
 116          question: "What paint brands do you use?",
 117          answer:
 118            "Benjamin Moore Ultra Spec and Aura, Sherwin-Williams ProMar and ProIndustrial, and PPG SPEEDHIDE — selected per substrate and exposure. We match client-specified systems on request.",
 119        },
 120        {
 121          question: "How quickly can you start?",
 122          answer:
 123            "For most commercial scopes under 5,000 sq ft we mobilize within 1–2 weeks of accepted proposal. Larger or phased projects are scheduled to the client's milestone dates.",
 124        },
 125      ],
 126      ctaSlug: "commercial-painting-gta",
 127      related: ["exterior-painting-toronto", "caulking-sealants-toronto"],
 128    },
 129  
 130    "fire-retardant-coatings-ontario": {
```

**One full case-study entry — not available in the repository.** Case studies exist only as rows in the `projects` table. The row shape (generated types, `src/integrations/supabase/types.ts:1770-1827`) is:

`src/integrations/supabase/types.ts` lines 1770-1827:

```ts
1770        projects: {
1771          Row: {
1772            after_images: Json | null
1773            before_images: Json | null
1774            budget_range: string | null
1775            canonical_url: string | null
1776            category: string | null
1777            challenge: string | null
1778            client_name: string | null
1779            client_type: string | null
1780            completion_date: string | null
1781            content_blocks: Json | null
1782            created_at: string | null
1783            created_by: string | null
1784            delivery_method: string | null
1785            description: string | null
1786            draft_content: Json | null
1787            duration: string | null
1788            featured: boolean | null
1789            featured_image: string | null
1790            gallery: Json | null
1791            id: string
1792            location: string | null
1793            og_image_url: string | null
1794            on_budget: boolean | null
1795            on_time_completion: boolean | null
1796            peak_workforce: number | null
1797            preview_token: string | null
1798            preview_token_created_by: string | null
1799            preview_token_expires_at: string | null
1800            process_notes: string | null
1801            project_size: string | null
1802            project_status: string | null
1803            project_value: string | null
1804            publish_state: Database["public"]["Enums"]["publish_state"] | null
1805            results: string | null
1806            safety_incidents: number | null
1807            scheduled_publish_at: string | null
1808            scope_of_work: string | null
1809            seo_description: string | null
1810            seo_keywords: string[] | null
1811            seo_title: string | null
1812            slug: string
1813            solution: string | null
1814            square_footage: string | null
1815            start_date: string | null
1816            subtitle: string | null
1817            summary: string | null
1818            tags: string[] | null
1819            team_credits: Json | null
1820            title: string
1821            trades_coordinated: number | null
1822            updated_at: string | null
1823            updated_by: string | null
1824            version: number | null
1825            year: string | null
1826            your_role: string | null
1827          }
```

The detail-page template renders the GC-relevant fields — `project_value`, `square_footage`, `your_role`, `delivery_method`, `client_type`, `trades_coordinated`, `peak_workforce`, `on_time_completion`, `on_budget`, `safety_incidents`, `team_credits`, `before_images`/`after_images` (`ProjectDetail.tsx:66-97,347-420`). The *template* is therefore well suited to estimators; whether any real project has these fields filled in is **Unknown**.

**Media inventory (sizes measured with `find`/`stat`; build output measured in the scratch build):**

| Item | Size | Where / how loaded | >500 KB? |
|---|---|---|---|
| `public/hero-clipchamp.mp4` (homepage hero video) | **565 KB** | `<video>` in `index.html:235-237` (noscript shell); in React via `src/data/enriched-hero-slides.ts:2` | **yes** |
| `src/assets/hero-clipchamp.mp4` (duplicate of the above, bundled by Vite) | 565 KB | `dist/assets/hero-clipchamp-*.mp4` (564 KB) | **yes (duplicate)** |
| `src/assets/ascent-logo-intro.mp4` | 814 KB | `dist/assets/ascent-logo-intro-*.mp4`; also referenced in `src/data/video-metadata.ts:38` | **yes** |
| `public/hero-poster-1.webp` | 128 KB | preloaded `index.html:113` (`fetchpriority=high`) | no |
| `public/og-image.png` | 279 KB (1200×630 declared) | social preview | no |
| `public/brand/*.png` (6 logos) and `public/ascent-logo.png` | 131-247 KB each | header logo etc. | no — but `.lovable/plan.md` itself records the header logo as a 1920×986, 246 KB PNG shown at 156×80 |
| `src/assets/*.png`, `heroes/*.jpg`, `partners/*.png` | 80 files, 15 MB total; largest 348 KB (`landing-bg-light.png`) | bundled into `dist/assets/` | no |
| Remote hero image `images.unsplash.com/photo-1504307651254-…` | n/a (hotlinked) | CSS background in `src/components/homepage/HomepageParallaxBreak.tsx:70` | n/a |

Only three files exceed 500 KB (the hero video, its duplicate, and the logo-intro video). The **JavaScript** is the real weight: the scratch production build emits `dist/assets/index-*.js` = **1,353 KB (306 KB gzip)** — despite the "only Index loads eagerly" comment, the entry chunk is large — plus `chunk-charts-*.js` 390 KB (a charting library, `modulepreload`ed in `dist/index.html` on every page, including public marketing pages) and `chunk-radix-*.js` 316 KB; CSS is 187 KB (29 KB gzip). `dist/` totals 22 MB across 233 asset files. No project photos live in the repo (they come from Supabase Storage, Unknown sizes). `<img loading="lazy">` / `OptimizedImage` usage: see 1I.

### 1H. Hard-coded company information (file:line) and the three "known issues"

**Canonical constants** live in `src/constants/company.ts` (single source, good practice): name `:10`, phone `:12-14` (`647-528-6804`), email `:16` (`info@ascentgroupconstruction.com`), address `:18-25` (2 Jody Ave, North York, ON M3N 1H1), site URL `:7-8`. The public footer and sticky bar prefer **database** values (`Footer.tsx:88-89`, `StickyInquiryBar.tsx:12-13` read `site_settings`/`company settings`) and fall back to these constants. **What the live database actually contains is Unknown** (it is where a placeholder or a personal address could still be hiding — see below).

**Duplicated hard-coded copies of the same facts (not read from the constants):**

| Fact | Locations |
|---|---|
| Phone `+1 (647) 528-6804` / `tel:6475286804` | `supabase/functions/send-contact-notification/index.ts:169,178`, `send-estimate-confirmation/index.ts:104,119`, `send-package-notification/index.ts:192,204`, `send-quote-confirmation/index.ts:91,103`, `send-rfp-notification/index.ts:128,146`, `_shared/emailTemplate.ts:15,103`, `_shared/transactional-email-templates/review-request.tsx:91` and `rfp-customer-confirmation.tsx:121`, `public/llms.txt:54`, seed migration `20251118013455_*.sql:16,26,46,59,78,96`; rendered `tel:` hrefs are inconsistent (`tel:6475286804` vs `tel:647-528-6804` on `/contact`) |
| Email addresses | `info@` (`company.ts:16`, `emailTemplate.ts:16,157`, `Contact.tsx:148`), `projects@` (`Contact.tsx:149`, `ForGeneralContractors.tsx:335`, `ServiceDetail.tsx:562`, `page-faqs.ts:221,397`), `estimating@` (`send-rfp-emails/index.ts:11` and 3 Resend functions), `careers@` (`send-resume-notification/index.ts:159,204`). Placeholder-only addresses (`john@example.com`, `admin@example.com`, `rfp@company.com`…) appear as form placeholders only. |
| Address | `company.ts:18-25`, `Contact.tsx:146` (fallback), `public/llms.txt:56` |
| Hours | `Contact.tsx:150` (weekday 8-6), `SEO.tsx:111-124` (Mon-Fri 08:00-18:00, **Sat 09:00-16:00**), `llms.txt:57` (**Sat 9:00-14:00**) — inconsistent |
| "$2M CGL" | 98 lines in 42 files (e.g. `Contact.tsx:280`, `Capabilities.tsx:390`, `ForGeneralContractors.tsx`, `TrustRibbon.tsx`) |
| "WSIB" | 147 lines in 53 files |
| "85% self-performed" | 31 lines in 21 files (`About.tsx:185,227,323`, `GCTrustStrip.tsx:10`, `CompanyResponse.tsx:17`, `InteractiveCTA.tsx:40`, `enriched-company-content.ts:35,50`, `page-faqs.ts:45,92,216`, `TrustRibbon.tsx:21`, …) |
| "15+ years" | 49 lines in 24 files |
| "10-person crew" | `PrequalPackage.tsx:18`, `ForGeneralContractors.tsx:47`, `EmergencyRepair.tsx:214` |
| Sto "Modules SCL-001 through SCL-010", CCMC numbers | `About.tsx:53`, `page-faqs.ts:40,356`, `Services.tsx:24`, `merged-services-data.ts:421`; yet `wave1-services.ts:11` says "no certificate ID until confirmed" |
| Copyright year | `index.html:262` (noscript block, **"© 2025"**); React footer uses a dynamic year (`src/components/footer/UnifiedFooter.tsx:38,303`) |

**The three known issues — confirmed or not:**

1. **Placeholder phone `(416) 555-1234`: NOT present in the code.** Two *other* fictional 555 numbers are: `src/pages/resources/ContractorPortal.tsx:404` (`placeholder="(416) 555-0100"` on an input, harmless) and `supabase/functions/_shared/transactional-email-templates/rfp-internal-notification.tsx:148` (`phone: '+1 416 555 0199'` inside the template's preview data; used only when previewing). The real number everywhere in code is 647-528-6804. The *live* value shown in the footer/sticky bar comes from the database (`site_settings.phone`) and is **Unknown** — if the live site still shows (416) 555-1234 it is stored there (fix in Admin → Settings), not in the repo.
2. **Personal Gmail as the company email: NOT present in the code.** A scan of `src/`, `public/`, `supabase/`, `docs/`, `scripts/` and `index.html` for `gmail|hotmail|yahoo|outlook|icloud|proton` addresses returned nothing. The database seed migration (`supabase/migrations/20251118013455_*.sql`) uses `info@ascentgroupconstruction.com`. The live `site_settings.email` / `contact_page_settings` values are **Unknown** for the same reason as above.
3. **Copyright "© 2025": CONFIRMED, but only in the no-JS fallback.** `index.html:262` hard-codes `© 2025 Ascent Group Construction` inside `<noscript>`. The React footer (`UnifiedFooter.tsx:303`) renders `© {currentYear}`. Related: `Privacy.tsx:21`, `Terms.tsx:22` and `Accessibility.tsx:22` print `Last Updated: {new Date().toLocaleDateString('en-CA')}` — i.e. **today's date on every load**, which makes the legal dates meaningless.

### 1I. Code health

| Measure | Result | Evidence |
|---|---|---|
| Size | 555 TS/TSX files in `src/`, ≈81,000 lines; 307 component files; 37 entries directly in `src/pages` | `find`/`wc` |
| TODO/FIXME/HACK | **0** | grep over `src/` and `supabase/functions` |
| `console.log` / `console.error`+`warn` in `src/` | 28 / 119 | grep |
| `any` (`: any`, `as any`, `<any>`) | 255 | grep; ESLint `no-explicit-any` reports 326 |
| `@ts-ignore`/`@ts-expect-error`/`@ts-nocheck`; `eslint-disable` | 2; 3 (plus `// @ts-nocheck` at the top of `send-rfp-emails/index.ts:1` and `send-review-request/index.ts:1`) | grep |
| TypeScript strictness | `strict: false`, `noImplicitAny: false`, `strictNullChecks: false` (`tsconfig.app.json:16-25`, `tsconfig.json:4-13`) | config |
| Automated tests | **1 test file, 5 tests** (`src/pages/admin/seo/__tests__/scoring.test.ts`); no test script in `package.json`; nothing covers forms, routing or SEO | Phase 2 |
| Lint | **360 errors, 44 warnings** in 606 files (326 `no-explicit-any`, 26 `react-hooks/exhaustive-deps`, 18 `react-refresh/only-export-components`, 13 `no-restricted-imports`, 8 `no-var`, 4 `no-empty`, 4 `ban-ts-comment`, 2 `no-empty-object-type`) | Phase 2 |
| Possibly unused dependencies (name never appears in source/config) | `@react-pdf/renderer`, `qrcode` (+ `@types/qrcode`), `react-spring`, `@hookform/resolvers`, `@types/dompurify` | scripted scan |
| Duplicated mechanisms | three UI layers (1F); two email stacks (1D); two migration tracks (1D); two newsletter forms (1C); two near-identical RFP email functions (`send-rfp-notification` unused vs `send-rfp-emails`); a static sitemap vs a dynamic sitemap function with a different host (1B); a service-worker register vs purge conflict (1E); `routes/registry.ts` vs `AppRoutes.tsx` (1A) | read |
| Images | 33 `<img>` tags in `src/`, 10 with `loading="lazy"`; many images are rendered through `OptimizedImage.tsx` or CSS backgrounds | scripted scan |
| Stray artefact | a file named `0===` (12 bytes) at the repo root, present before this audit started | baseline manifest |
| Known bugs found while reading | footer `<SEO>` overriding page titles (1B); doubled brand in titles (1B); dead rate-limit branch in `Contact.tsx:89` (1C.2); consent flags not stored (1C.4); `registry.ts` incomplete; Playfair Display referenced but not loaded (`index.css:682`) | read/run |

### 1J. README versus reality

| README statement | Reality (evidence) |
|---|---|
| "No inflated claims … ('24/7 emergency' etc.)" (`README.md:20`; "Removed … 24/7 emergency line" `:66`) | `src/pages/EmergencyRepair.tsx:90` title says "24/7 Façade & Envelope Response" and `:111` shows a "24/7 Available" badge |
| "Forms: react-hook-form + Zod" (`README.md:32`) | Only `SubmitRFPNew.tsx` uses react-hook-form (`:3,55`); Contact and Estimate use `useState` + `schema.parse` |
| "Verifiable metrics ($2M CGL, WSIB compliant, 85% self-performed)" (`:49`) | The site contradicts itself: homepage components say "WSIB registration and insurance **in progress**" (`CompanyIntroduction.tsx:119`, `HomepageServiceHighlights.tsx:99`, `PrequalPackage.tsx:17`) while trust strips elsewhere say "$2M CGL" and "WSIB Compliant"; `llms.txt:5` says crew are "direct employees, not subcontractors" (≠ 85%); `wave1-services.ts:9` says "$2M … verify against current policy" |
| "Separation of lead paths" (`:44-48`) | At least ten submission paths exist (1C); `/free-quote` and `/get-estimate` redirect to `/contact` (`AppRoutes.tsx:216-217`) |
| "Navigation maintains a `heroPages` array" (`:189`) | The code uses `heroPageExact` and `heroPagePrefixes` (`Navigation.tsx:94-102`); `/projects` is in the exact list; in the offline capture (database blocked) the page rendered with no hero, so the white nav text was invisible on the white page — production behaviour with data is Unknown (see page audit) |
| "Homepage … all backed by Supabase tables with fallback content" (`:72`) | Some homepage sections depend on the database and degrade when it returns no rows or is unreachable: the Featured Projects section returns `null` when there are no published projects (`HomepageFeaturedProjects.tsx:68`); "Why Property Owners Choose Us" shows the literal text `Loading...` while its query is pending (`WhyChooseUs.tsx:65-66`) and then falls back to built-in copy; hero, services grid, proof strip and credentials cards are static and do not depend on the database |
| "Hosting: Lovable" (`:34`) with `_redirects`/`_headers` shipped | Those files are ignored by Lovable (`_redirects:1-4`) |
| "`SEO … canonical URLs … across pages`" (`:87`) | Static homepage canonical in `index.html:170` conflicts with per-page canonicals at runtime (1B) |

---

## Phase 2 — Run and verify

**Where this was run.** Not in your folder. Dependencies, build output and caches were created in a scratch copy of the repository outside the connected folder, so no `node_modules/`, `dist/` or lockfile change appeared in the repo (verified with a SHA-256 manifest, see the Finish section). Tools: Bun 1.4.2 (the repo has a `bun.lock`, so Bun is the intended package manager), Node 22.23.2, headless Chromium 131 for the browser steps.

### 2.1 Install (lockfile)

| Step | Command | Result |
|---|---|---|
| 1 | `bun install --frozen-lockfile` (scratch copy, unmodified `bun.lock`) | **Failed.** 985 `warn: GET https://europe-west4-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/… - 403` lines; the lockfile pins 1,264 tarball URLs to a private Lovable package mirror that is not reachable outside Lovable's environment. |
| 2 | Same command after replacing those mirror URLs with the default registry in the **scratch copy only** (integrity hashes kept) | `985 packages installed [14.74s]` |
| — | `npm ci` | Not possible: no `package-lock.json` exists. |

Your `bun.lock` was not changed. Ask before changing it: the practical fix is to regenerate the lockfile against the public registry (`bun install`) or to delete the mirror URLs from it.

### 2.2 Lint, type-check, tests, build (exact outcomes)

| Check | Command | Outcome |
|---|---|---|
| Lint | `bun run lint` (`eslint .`) | **606 files: 360 errors, 44 warnings.** By rule: 326 `@typescript-eslint/no-explicit-any`, 26 `react-hooks/exhaustive-deps`, 18 `react-refresh/only-export-components`, 13 `no-restricted-imports`, 8 `no-var`, 4 `no-empty`, 4 `@typescript-eslint/ban-ts-comment`, 2 `no-empty-object-type`. Neither GitHub workflow runs lint, type-check or tests (`grep` over `.github/workflows` finds none). |
| Strict type-check (the project's own script) | `bun run typecheck:selected` (`tsc -p tsconfig.selected-strict.json --noEmit`) | **6 errors**: `src/components/navigation/AppLink.tsx(15,24)` TS2532; `src/utils/routeHelpers.ts(33,22)` TS2532, `(34,54)` TS18048, `(34,76)` TS2345, `(49,22)` TS2532, `(50,23)` TS2345 |
| Full type-check | `node_modules/.bin/tsc -p tsconfig.app.json --noEmit` (non-strict config) | **1 error**: `src/pages/admin/BlogPostEditor.tsx(195,50)` TS2345 — the `blog_posts` insert payload is typed as `{created_by…} | {updated_by…}` (conditional spread at lines 191-195) and is not assignable to the generated `Insert` type; a typing defect, behaviour at runtime Unknown |
| Tests | `node_modules/.bin/vitest run` (no `test` script exists in `package.json`; `vitest.config.ts` is present) | **1 file, 5 tests, all pass** (`src/pages/admin/seo/__tests__/scoring.test.ts`, 1.78 s) |
| Production build | `bun run build` (`vite build`) | **Succeeded in 17.4 s.** Warnings: chunks larger than 400 kB; Tailwind notes about arbitrary `duration-[…]`/`ease-[…]` classes. Output: `dist/` is 22 MB with 233 files in `dist/assets`; entry `index-*.js` **1,353 KB (306 KB gzip)**, `chunk-charts` 390 KB, `chunk-radix` 316 KB, CSS 187 KB (29 KB gzip). |
| Service-worker validation | `node scripts/validate-sw.js` | All 4 checks pass (note: SW is purged at runtime, see 1E). |
| Lighthouse / axe | Not run (no Lighthouse runner is installed and CI does not run it either). The repo's own `.lovable/plan.md` records a Lighthouse performance score of **86** with LCP ≈ 2.0 s (date and conditions unknown). | — |

### 2.3 Local preview and browser capture

`vite preview` was replaced by a tiny static server over the production build (`dist/`), with an SPA fallback to `index.html`, and **all external requests aborted** (Supabase, Google Fonts, GA, ipapi.co, Unsplash), so nothing touched production services and no form could be submitted. Chromium rendered 34 routes at **1440×900** and **390×844** (68 captures). Results:

- **No uncaught JavaScript errors** on any of the 68 captures. The only console errors are the aborted external requests (my own blocking).
- **No horizontal overflow at 390 px** on any route (`scrollWidth == clientWidth` everywhere).
- **Every page calls** `<project-ref>.supabase.co` (the database) and Google Fonts; the homepage additionally calls `ipapi.co` (visitor geolocation, `personalization.ts:182`), `images.unsplash.com` (`HomepageParallaxBreak.tsx:70`) and Google Tag Manager; `/contact` and the service-area pages load a `www.google.com` frame.
- **Limitation:** because the database was blocked, every DB-driven section (featured services, projects, testimonials, blog, partner logos, footer settings) rendered empty or in its fallback state. Those sections are audited from code and flagged "Unknown (needs live data)" in `03-PAGE-AUDIT.md`. On the home page the DB-dependent parts are the Featured Projects block (rendered as nothing when empty), "Why Property Owners Choose Us" (literal `Loading...` while pending, see `screenshots/sections/home-desktop-section-4.jpg`), and the footer/header contact settings. **Correction made during Phase 3:** an earlier version of this report attributed large blank bands in the section slices to the blocked database. That was a capture artefact: the services grid and several headings are static content that fades in when scrolled into view (`HomepageServiceHighlights.tsx:238-241`, `whileInView`), and my first full-page capture scrolled too fast to trigger them. A slow-scroll experiment (1200 ms per step) showed these elements reaching full opacity as they enter the viewport, and the section slices were regenerated at human scroll pace.
- Screenshots: `screenshots/<page>-desktop.png` and `-mobile.png` for the 34 routes (viewport captures with the cookie banner as a first-time visitor sees it), plus `screenshots/sections/*.jpg` (full-page slices of home, contact, for-general-contractors with the banner dismissed locally, captured with a slow scroll so scroll-triggered fade-ins have completed; the last slice of a page may show the fixed header repeated, which is a full-page-screenshot artefact).

### 2.4 Per-route HTML that a crawler sees **without JavaScript**

Method: the production `dist/index.html` is the only HTML the build produces. `dist/index.html:129,130,170` therefore gives **every** route the following (verified by reading the file; whether the live host serves `index.html` with HTTP 200 for deep links is Unknown — see 1A):

- `<title>`: `Ascent Group Construction | Building Envelope & Restoration`
- `<meta name="description">`: `Self-performing specialty contractor delivering building envelope, façade, masonry, EIFS and parking garage restoration across the GTA and Ontario.`
- `<link rel="canonical">`: `https://www.ascentgroupconstruction.com/`
- body: spinner + `Loading...`; `<noscript>` shows one generic landing section whose H1 ("Ontario's Prime Specialty Contractor for Building Envelope & Restoration") differs from the React homepage's H1 ("We Restore, Repair & Protect Buildings Across the GTA").

### 2.5 Per-route title / canonical after JavaScript runs (observed in Chromium; database blocked)

Reading guide: column 2 is what the code *intends*; column 4 is what the browser *actually showed*. Every page that renders the footer got the default title, because of the footer `<SEO>` bug (1B). Every non-home page carried two canonical tags.

| Route | Intended `<title>` in code | **No-JS** title / description / canonical (identical on every route) | **JS-rendered** `document.title` (observed, offline) | JS-rendered `<link rel="canonical">` tags (observed) | `<h1>` rendered |
|---|---|---|---|---|---|
| `/` | Envelope & Restoration GTA | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; / | We Restore, Repair & Protect Buildings Across the GTA |
| `/about` | About — Envelope & Restoration | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /about | 15 Years of Experience. One Clear Mission. |
| `/services` | Specialty Contracting Services | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /services | Specialty contracting services for envelope, restoration, an |
| `/services/masonry-restoration` | (DB: services.seo_title or name) | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /services/masonry-restoration | *(none)* |
| `/services/commercial-painting-gta` | (wave1 page.title) | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /services/commercial-painting-gta | Commercial Painting Contractor — Greater Toronto Area |
| `/markets` | Markets We Serve \| Ascent Group Construction | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /markets | Markets We Serve |
| `/projects` | Our Projects \| Ascent Group Construction | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /projects | Our Project Portfolio |
| `/contact` | Contact Us \| Ascent Group Construction | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /contact | Contact Us |
| `/estimate` | Request Project Estimate \| Ascent Group Construction | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /estimate | Request a Project Estimate |
| `/submit-rfp` | Submit RFP - Request for Proposal \| Ascent Group Construction | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /submit-rfp | Submit Your RFP |
| `/for-general-contractors` | Trade Partner for General Contractors | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /for-general-contractors | Reliable Trade Partner for General Contractors |
| `/for-architects` | For Architects & Building Science Consultants \| Ascent Group | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /for-architects | A Contractor Who Speaks Building Science |
| `/prequalification` | Vendor Pre-Qualification Package - Main Specialty Contractor \| … | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /prequalification | Vendor Pre-Qualification Package |
| `/capabilities` | Capabilities \| Self-Perform Specialty Contracting | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /capabilities | How Ascent Delivers Projects |
| `/our-process` | How We Work — From Inquiry to Closeout \| Ascent Group Construction | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /our-process | From Inquiry to Closeout |
| `/property-managers` | Property Management Services - Envelope & Restoration for Multi-Residential | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /property-managers | Envelope & Restoration Partner for Multi-Residential Propert |
| `/commercial-clients` | Commercial Building Envelope & Restoration Services - Toronto & GTA | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /commercial-clients | Envelope & Restoration for Commercial Properties |
| `/homeowners` | Residential Services for Homeowners \| Painting, Renovations, Tile, Flooring \| … | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /homeowners | Residential Services for Homeowners |
| `/emergency-repair` | Emergency Building Repair \| 24/7 Façade & Envelope Response \| Ascent Group | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /emergency-repair | Emergency Building Repair |
| `/faq` | Frequently Asked Questions \| Building Envelope & Restoration | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /faq | Frequently Asked Questions |
| `/careers` | Work With Ascent \| Careers in Envelope Restoration & Interior Trades | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /careers | Work With Ascent |
| `/why-specialty-contractor` | Specialty Contractor vs General Contractor \| Building Envelope & Restoration | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /why-specialty-contractor | Why We Focus on Specialty Trades |
| `/company/certifications-insurance` | Certifications & Insurance Coverage \| Ascent Group Construction | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /company/certifications-insurance | Certifications & Insurance Coverage |
| `/company/technology` | Technology & Digital Tools | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /company/technology | Built on Digital Precision |
| `/company/developers` | Developers & Contractors \| Partnership Solutions | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /company/developers | Build With a Trusted Partner |
| `/resources/service-areas` | Service Areas \| Ascent Group Construction | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /resources/service-areas | Service Areas |
| `/resources/contractor-portal` | Partner With Ascent \| Contractor Portal \| Ascent Group Construction | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /resources/contractor-portal | Partner With Ascent |
| `/service-areas/toronto` | Building Envelope Contractor in Toronto \| … | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /service-areas/toronto | Building Envelope Services in Toronto |
| `/blog` | Construction Insights \| Envelope & Restoration Contractor | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /blog | *(none)* |
| `/privacy` | (see Privacy.tsx) | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /privacy | Privacy Policy |
| `/terms` | (see Terms.tsx) | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /terms | Terms of Use |
| `/accessibility` | (see Accessibility.tsx) | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /accessibility | Accessibility Statement |
| `/tekev` | (none — no <SEO>) | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / | *(none)* |
| `/does-not-exist` | Page Not Found (noindex) | same homepage values | Ascent Group Construction \| Building Envelope & Restoration | / ; /does-not-exist | 404 |

**Experiment confirming the footer bug:** in the scratch copy the two `<SEO … />` elements in `Footer.tsx` (lines 136, 156) were replaced by empty fragments and rebuilt (`vite build --outDir dist-exp`, 17 s). Result: `/about` → `About — Envelope & Restoration | Ascent Group Construction`; `/services` → `Specialty Contracting Services | Ascent Group Construction`; `/contact` → `Contact Us | Ascent Group Construction | Ascent Group Construction` (doubled brand). Canonicals were still doubled (static + Helmet) because `index.html:170` was not changed in that experiment. The repository was not modified.

**Interactive-element checks on the captured pages:** `tel:` links present on `/`, `/contact`, `/submit-rfp`, `/for-general-contractors`, `/for-architects`, `/emergency-repair`, `/faq`, `/privacy`, `/terms`, `/accessibility`, service-area pages; **none** on `/about`, `/projects`, `/estimate`, `/prequalification`, `/our-process`, `/property-managers`, `/commercial-clients`, `/capabilities`, `/careers` (the sticky bar may add one on scroll; not captured). `mailto:` links appear only on `/contact` (`info@`, `projects@`). Images without `alt`: 0 on all captured pages.

---

## Finish — verification and commands run

### F.1 Did anything outside `_assessment/` change? No.

The folder is not a git repository, so `git status` was not available (section 0.1). Instead a SHA-256 manifest of every file was taken before any output was written (810 files, saved outside the repo as `~/scratch/baseline.sha256`). At the end, every file outside `_assessment/` was hashed again and the two manifests were compared:

```
$ cd <repo root>
$ find . -type f -not -path './_assessment/*' -print0 | xargs -0 sha256sum | sort -k2 > ~/scratch/final.sha256
$ wc -l ~/scratch/final.sha256
810
$ sort -k2 ~/scratch/baseline.sha256 > ~/scratch/baseline.sorted
$ diff ~/scratch/baseline.sorted ~/scratch/final.sha256
(no output)  -> IDENTICAL: no file outside _assessment/ was added, removed or changed
$ find . -type f -newer ~/scratch/baseline.sha256 -not -path './_assessment/*'
(no output)
$ find . -type d -newer ~/scratch/baseline.sha256 -not -path './_assessment*'
.
```

The only newer directory is the repo root itself, whose modification time changed because `_assessment/` was created inside it. The stray 12-byte file named `0===` at the repo root was already present when the baseline was taken (it is line 8 of the manifest) and its hash is unchanged; I did not create, edit or remove it. `.env` is in the manifest and is unchanged.

### F.2 What was created

Only inside `_assessment/`: `00-CHAT-SUMMARY.md`, `01-REPORT.md`, `02-FINDINGS.md` (50 findings: 6 Critical, 13 High, 23 Medium, 8 Low), `03-PAGE-AUDIT.md`, `04-INBOX-READINESS.md`, and `screenshots/` (68 full-viewport captures plus 20 section slices in `screenshots/sections/`). Everything else I created (scratch copy of the repo, dependency installs, build output, logs, browser scripts, hash manifests) lives in a scratch area outside the connected folder.

### F.3 Commands run

Grouped, because many one-off look-ups were run. Every command that changed state or executed project code is listed on its own line. The look-up commands, which only read, are described by type at the end.

**Source control probes (read-only):** `git status`, `git branch`, `git log -15 --oneline` (all returned "not a git repository"; output in 0.1).

**Baseline and final integrity check (read-only on the repo):** `find . -type f -print0 | xargs -0 sha256sum` (baseline, before any output), and the comparison commands shown in F.1.

**Scratch copy (outside the repo):** the repository was copied to a scratch folder before any install or build. No `node_modules/`, `dist/`, lockfile or cache was ever written inside the connected folder (confirmed by F.1).

**Install, checks and build (scratch copy only; script `~/scratch/run-checks.sh`):**

| Command | Result |
|---|---|
| `bun install --frozen-lockfile` (unmodified `bun.lock`) | Failed: 985 HTTP 403 errors from the private package mirror named in the lockfile |
| Same command after replacing mirror URLs with the default registry in the **scratch copy's** lockfile only (integrity hashes kept) | `985 packages installed` |
| `bun run lint` | 360 errors, 44 warnings |
| `bun run typecheck:selected` | 6 errors |
| `node_modules/.bin/tsc -p tsconfig.app.json --noEmit` | 1 error |
| `node_modules/.bin/vitest run` | 1 file, 5 tests, all pass |
| `bun run build` | Succeeded |
| `bun run validate:sw` | 4 of 4 checks pass |
| `vite build --outDir <experiment dir>` after emptying the two `<SEO>` elements in the **scratch** `Footer.tsx` | Used for the footer experiment in 2.5; the repo's `Footer.tsx` was not touched |

I did **not** run `npm ci` (no `package-lock.json`), upgrade any package, or change any dependency in the repo.

**Browser verification (outside the repo; `~/tools/pw`, headless Chromium through `@sparticuz/chromium` and `puppeteer-core`, installed with `npm install` into `~/tools`, not into the repo):** a small static server over the scratch `dist/` with an SPA fallback, with every external request aborted so that nothing reached Supabase, Google, ipapi.co or any other service. Scripts: `shoot.mjs` (34 routes at 1440x900 and 390x844), `full.mjs` and `fullslow.mjs` (full-page slices; the slow-scroll version after the fade-in correction), `struct.mjs` (headings, links, forms per route), `headdump.mjs` (title, canonical and JSON-LD after JavaScript runs), `txt.mjs` (visible text), `scrollexp.mjs` (scroll-triggered fade-in experiment), `gaexp.mjs` ("Reject Analytics" experiment).

**Document inspection (read-only):** `pdfinfo` and `pdftotext` on `public/documents/Ascent_Group_Construction_-_Sto_Listing_Certificate.pdf`.

**Look-up commands (read-only, several hundred, not listed one by one):** `ls`, `find`, `cat`, `head`, `tail`, `sed -n`, `grep`, `wc`, and short Python read-only scripts that parsed Markdown and `types.ts`, run on the repo or on my own output files. Where a command could have printed a secret (for example reading `supabase/config.toml` or the email functions), the output was filtered to hide the value (for example `project_id` redacted, lines containing `KEY` removed).

**Writes:** only to `_assessment/` (through the file-transfer tool and read-modify-write scripts) and to scratch. One attempt to delete my own earlier slice images inside `_assessment/` was refused by the sandbox, so they were overwritten in place instead. No source file was ever a deletion target.

**Not run, by rule:** any commit, push or deploy; any database migration; any call to a production API; any submission of a form against a real backend; any email; any package upgrade.

### F.4 Deviations and limits to know about

1. **Not a git repository**, so history, branch and authorship are Unknown and the SHA-256 manifest replaced `git status`.
2. **Install used a modified copy of the lockfile** (scratch copy only), because the shipped `bun.lock` cannot be installed outside Lovable. The brief allowed installing from the existing lockfile; the unmodified file failed, and that failure is recorded as F-34 and in 2.1 and 1E.
3. **The database was blocked during the browser runs**, so database-driven sections were audited from code and marked "Unknown (needs live data)".
4. **No live-site checks** (DNS, `curl -I`, Resend, analytics, RLS) were made; each is listed as an Unknown with the way to answer it in `02-FINDINGS.md` and `04-INBOX-READINESS.md`.
5. **Early in the session, delegated sub-agents failed** with rate-limit errors, so the remaining work was done sequentially.

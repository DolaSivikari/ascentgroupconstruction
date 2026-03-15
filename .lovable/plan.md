

# Fix Remaining ~70 Audit Issues — Prioritized Plan

## Current State After Claude Code

**Already fixed (skip these):** #1, #2, #4, #5, #6, #7, #8 (Testing.tsx deleted), #9, #10, #14, #15, #16, #17, #18, #24, #28 (ui/use-toast.ts gone), #42, #65, #67, #68, #89, #92

**Still broken — 72 issues remain.** Grouped into 6 implementation phases.

---

## Phase 1: Critical Bugs (5 issues)

| # | File | Fix |
|---|---|---|
| 3 | `WhoWeServe.tsx` | `Button asChild` wrapping `<Link>` is fine — but verify no nested `<Link>` inside `<Link>`. The current code looks clean; mark resolved if confirmed |
| 51 | `PerformanceChart.tsx:50`, `PerformanceDashboard.tsx:322` | Remove `/ 1000` from CLS calculations — CLS is already 0–1 |
| 59 | `UnifiedServiceCard.tsx:87` | Add optional chaining: `challenge_tags?.slice(0, 2)` |
| 61 | `useServiceAnalytics.ts:79` | Extract `useAnalyticsDashboard` out of `useServiceAnalytics` into a standalone exported hook |
| 66 | `Sustainability.tsx:81,108` | Fix "Ascen Group" → "Ascent Group" (2 occurrences) |

## Phase 2: Dead Code & Build Bloat (12 issues)

| # | File | Action |
|---|---|---|
| 11 | `utils/migrateAboutPageData.ts` | Delete (no imports) |
| 12 | `utils/migrateHomepageData.ts` | Delete (no imports) |
| 13 | `utils/migrateNavigationData.ts` | Still imported by `NavigationBuilder.tsx` — remove import + usage there, then delete file |
| 19 | `QuickActions.tsx:48-78` | Remove edit dialog stub (isEditDialogOpen state, Dialog, DialogTrigger, Settings button) |
| 20 | `FeaturedServicesManager.tsx:180` | Remove orphan Edit button with no onClick |
| 21 | `AdminPageHeader.tsx` | Remove unused `useNavigate` import |
| 22 | `ProjectEditorHeader.tsx` | Remove unused `CheckCircle2` import |
| 23 | `DynamicServicesMegaMenu.tsx:54` | Remove no-op `onMouseEnter={() => {}}` |
| 25 | `GlobalSearch.tsx` | Keep — it IS used by `UnifiedSidebar.tsx` (audit was wrong) |
| 80 | `utils/getIcon.ts` | This is the only file left with `import * as LucideIcons` — it's a utility that needs it. Audit resolved |
| 84 | `EstimatorStep2.tsx` | Already deleted. Resolved |
| 85 | `modern-tag.tsx` | Already deleted. Resolved |

## Phase 3: DRY Consolidation (18 issues)

| # | Files | Fix |
|---|---|---|
| 26 | 14+ files | `constants/company.ts` already exists. Search for remaining hardcoded phone/email/address and replace with imports |
| 27 | `utils/structured-data.ts` + `utils/seo/structured-data.ts` | `utils/seo/structured-data.ts` is only imported by `utils/seo/index.ts`. All page files import from `utils/structured-data.ts`. Delete `utils/seo/structured-data.ts`, move any unique functions into `utils/structured-data.ts` |
| 29 | `ScrollToTop.tsx` + `ui/scroll-to-top.tsx` | Different purpose: one auto-scrolls on route change (App.tsx), one is a visible button. Rename button to `BackToTopButton.tsx`, delete `BackToTop.tsx` duplicate |
| 30 | `BeforeAfterSlider.tsx` + `shared/BeforeAfterSlider.tsx` | `shared/` version has zero imports. Delete `shared/BeforeAfterSlider.tsx` |
| 31 | `WhoWeServe.tsx` + `WhoWeServeHomepage.tsx` | `WhoWeServeHomepage` is used on Index. `WhoWeServe` is used nowhere on Index. Check if `WhoWeServe` is used elsewhere; if not, delete it |
| 32 | `footer/TrustBadgeBar.tsx` + `homepage/TrustBadgeBar.tsx` | Check imports — keep whichever is actually used, rename the other or delete |
| 33 | `homepage/ClientSegmentCard.tsx` + `unified/ClientSegmentCard.tsx` | Check imports, consolidate to one |
| 34 | 3 PageHero variants | `shared/PageHero.tsx` is the primary. Check if `sections/PageHero.tsx` and `sections/UnifiedPageHero.tsx` have any imports; delete unused |
| 36 | `NotificationBell.tsx` + `NotificationBellInbox.tsx` | Different tables — merge into one component with a `table` prop |
| 37 | `useAdminAuth.ts` + `useAdminRoleCheck.ts` | Merge, add optional `redirectTo` param |
| 38 | `serviceIcons.ts` + `usePopularServices.ts` | Consolidate icon map to one location |
| 39 | `EnhancedPopularServices.tsx` + `SmartPopularServices.tsx` | Extract shared `serviceGradients` to a data file |
| 40 | `NewsletterBackend.tsx` + `NewsletterSection.tsx` | Extract shared subscribe logic into a `useNewsletterSubscribe` hook |
| 41 | `Navigation.tsx` | Refactor 4× mega menu blocks into a `.map()` over config array |
| 45 | `ui/Button.tsx` | Remove duplicate manual variant object, keep only CVA `buttonVariants` |
| 47 | `About.tsx` | Unify `processSchema` and `processSteps` into a single data source |
| 49 | `AdminPageLayout.tsx` vs `UnifiedAdminLayout.tsx` | If AdminPageLayout is a thin wrapper, inline it and delete |

Skipped: #35 (6 ServiceCard variants — too risky to merge in one pass), #43/#44/#46/#48 (component unification — lower priority, high surface area)

## Phase 4: Visual & CSS Bugs (10 issues)

| # | File | Fix |
|---|---|---|
| 69 | `CompanyIntroduction.tsx:136`, `ValuePillars.tsx:60` | `from-construction-orange/0 to-construction-orange/0` is intentional — it's the default state before `group-hover` overrides apply. **Not a bug** — mark resolved |
| 70 | `EnhancedHero.tsx:476` | Change gradient to monotonic: `from-black/70 via-black/60 to-black/80` or simplify to `from-black/70 to-black/80` |
| 71 | `FeatureCard.tsx:15` | Add `group` class to `<Card>`: `className={cn("h-full group", className)}` |
| 72 | `ProcessStepCard.tsx:15` | Same — add `group` class |
| 73 | `ContentHub.tsx:70,79` | Remove duplicate `md:py-24` (keep `py-16 md:py-20 lg:py-24`) |
| 74 | `Card.tsx:23,54` | Remove duplicate `hover:-translate-y-1` from interactive variant string since it's also conditionally applied |
| 75 | `button.tsx` | Fix to `min-h-[40px] md:min-h-[44px]` (desktop should be >= mobile) — actually mobile should be 44px for touch. This is correct behavior per WCAG. Mark resolved |
| 76 | `MetricCard.tsx:54` | Move `card-hover` class from progress bar to card root |
| 77 | `ProjectImageManager.tsx:101` | Fix `text-[hsl(var(--bg))]` → `text-background` or correct CSS variable |
| 78/79 | `ClientSegmentCard.tsx`, `ServiceQuickViewModal.tsx` | Replace `construction-orange` with `primary` token |

## Phase 5: Correctness & Admin Bugs (10 issues)

| # | File | Fix |
|---|---|---|
| 50 | `Projects.tsx:80-141` | Extract shared transform function, call from both `useEffect`s |
| 52-55 | 4 admin managers | Replace native `confirm()` with existing `ConfirmDialog` component |
| 56 | `PromotionsManager.tsx` | Add `start_date < end_date` validation |
| 57 | `ServiceCard.tsx`, `ServiceCard3D.tsx` | Type-safe icon resolution via shared `getIcon` util |
| 58 | `TieredServicesGrid.tsx:29` | Add null check on `getIconForService()` return |
| 60 | `RFPStep4Scope.tsx:5` | Change `import { Card } from '@/design-system'` → `from '@/ui/Card'` to match Steps 1–3 |
| 63 | `rfp-validation.ts:68` | Simplify: `.optional().transform(v => v || undefined)` |
| 64 | `TimelineSelector.tsx:116` | Add validation: `targetDate >= startDate` |

## Phase 6: UX & SEO Polish (12 issues)

| # | File | Fix |
|---|---|---|
| 87 | Codebase-wide | Remove `console.log`/`console.warn` statements (keep `console.error` in error handlers only) |
| 90 | `BlogCard.tsx:46`, `ContentHub.tsx:159` | Calculate read time: `Math.ceil(content.split(' ').length / 200)` min |
| 93 | `EstimatorStep5.tsx:119` | Replace `<input type="checkbox">` with design system `<Checkbox>` |
| 94 | `RFPStep4Scope.tsx:169` | Remove 💡 emoji, use an icon or plain text |
| 95 | `RFPStep2Project.tsx:74` | Move DollarSign icon outside `<Label>` text |
| 96 | `SearchBar.tsx:44` | Add `aria-label="Clear search"` |
| 97 | `CategoryTabs.tsx:15-27` | Add `role="tab"` and `aria-pressed` |
| 98 | `ProjectTypeSelector.tsx:77-118` | Add `aria-pressed` to selection buttons |
| 99 | Estimator + RFP steps | Add `aria-required="true"` to required inputs |
| 100 | `MobileNavSheet.tsx:180` | Add `aria-label="Clear search query"` |
| 101 | `Index.tsx`, `About.tsx`, `FAQ.tsx` | Pass explicit `canonical` prop to `<SEO>` |
| 102 | `ProjectDetail.tsx` | Add `ogTitle` and `ogDescription` to SEO component |
| 103 | `structured-data.ts` | Already uses `SITE_URL` from `constants/company.ts` which reads env var. Resolved |

---

## Implementation Order

**Batch 1** (Phase 1+2): ~17 edits across 15 files — critical bugs + dead code removal
**Batch 2** (Phase 4): ~10 visual/CSS fixes — quick wins
**Batch 3** (Phase 5): ~10 correctness fixes in admin + forms
**Batch 4** (Phase 3): ~18 DRY consolidations — highest risk, most files touched
**Batch 5** (Phase 6): ~12 UX/SEO polish items

Estimated: ~67 distinct fixes across ~45 files.


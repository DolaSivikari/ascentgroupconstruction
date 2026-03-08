

# Phase 1: Trust & Integrity Restoration — Implementation Plan

**Status: Approved. Ready to implement.**

## Key finding from DB verification

`project_value` is a **text column**. Actual stored values:
- Empty strings `""` (most projects)
- Comma-separated numbers like `"40,000,000"` (no dollar sign, no cents)

The existing code does `project_value / 100 / 1000000` on a string → `NaN`. The utility must strip commas, parse as float, and treat the value as **whole dollars** (not cents).

## Files to change (23 files)

### Contact: Gmail → business email (2 files)
- **`src/pages/Index.tsx`** line 86: `"email": "mailto:hebun.isik.ca@gmail.com"` → `"mailto:info@ascentgroupconstruction.com"` (JSON-LD schema, not a React component context — static string is correct here)
- **`src/pages/DynamicSpecialtyPage.tsx`** line 84: same Gmail → `info@ascentgroupconstruction.com`

### Contact: hardcoded phone → PhoneLink (7 files)
- **`src/pages/Terms.tsx`** line 320
- **`src/pages/Accessibility.tsx`** line 324
- **`src/pages/FAQ.tsx`** line ~459
- **`src/pages/Prequalification.tsx`** line ~419
- **`src/pages/resources/LocationPage.tsx`** line ~256
- **`src/pages/ServiceSelectorPage.tsx`** line ~48
- **`src/components/services/ServicePageTemplate.tsx`** lines ~238, ~434

### $NaN fix (5 files)
- **`src/utils/formatProjectValue.ts`** — NEW utility:
  - Input: `unknown` (string, number, null, undefined)
  - Strip `$`, commas, whitespace; parse as float
  - Two modes: `compact` → `"$5.0M"` / `"$750K"`, `full` → `"$5,000,000"`
  - Returns `null` if invalid/empty/NaN → caller hides the element
- **`src/components/ProjectCard.tsx`** line 117 — use utility
- **`src/components/projects/ProjectQuickView.tsx`** line 84 — use utility
- **`src/pages/Projects.tsx`** line 213 — use utility
- **`src/pages/ProjectDetail.tsx`** lines 319, 456 — use utility

### Admin truth labels (5 files)
- **`src/pages/admin/NavigationBuilder.tsx`** lines 356-360: two `<span>`s → single: "Saved to database only. Not currently wired to live site navigation."
- **`src/pages/admin/RedirectsManager.tsx`** lines 116-123: two banners → single: "Saved to database only. Not automatically deployed to hosting/CDN redirect rules."
- **`src/pages/admin/SEODashboard.tsx`** lines 1078-1083: two `<span>`s → single consolidated message
- **`src/pages/admin/TestimonialsManager.tsx`** lines 150-154: two `<span>`s → single: "Testimonials saved here only appear on public pages that actively query the testimonials table."
- **`src/pages/admin/StatsManager.tsx`** after line 164: ADD amber banner: "Saved to database only. Stats are not currently displayed on the public site."

### Route cleanup (1 file)
- **`src/routes/AppRoutes.tsx`** lines 174-176: remove duplicate `hero-images`, `navigation`, and `navigation-builder` routes (already handled by lines 170-173)

### Service nav fix (2 files)
- **`src/pages/admin/ServiceEditor.tsx`** lines 122, 148, 284: `navigate("/admin/services")` → `navigate("/admin/services-manager")`
- **`src/pages/admin/Dashboard.tsx`** line 292: same fix

### Copyright (1 file)
- **`index.html`** line 231: `© 2024` → `© 2025`

## What is intentionally untouched
- `src/utils/seo/ai-content.ts` — correctly uses static strings for crawler metadata
- `src/utils/seo/structured-data.ts` — already uses `info@ascentgroupconstruction.com`
- `src/components/seo/DirectAnswer.tsx`, `InteractiveCTA.tsx` — already use `useCompanySettings()` with phone fallback
- Tab deep-links (Settings, Inbox, HomepageBuilder) — verified working correctly
- Homepage layout, /services rebuild, marketing copy — Phase 2+

## What requires external verification (not code)
- DNS A records for apex and www → `185.158.133.1`
- Both domains added in Lovable project settings → Domains
- SSL certificates for both
- Any legacy hosting provider still serving old content


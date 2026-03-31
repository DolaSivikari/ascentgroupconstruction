

## Lead Generation Plan — B2B Specialty Contractor Approach

### What's Actually Wrong

Your site looks like a GC-level firm but **converts like a brochure**. The problem isn't missing popups — it's that your conversion paths don't match how GCs, PMs, and owners actually buy:

1. **"Request Unit Pricing" for GCs goes to `/contact`** — a generic form. A GC procurement team wants to submit a scope, not fill out a contact form.
2. **InteractiveCTA (your only inline form) is dead code** — never imported anywhere.
3. **No mid-page conversion** — 6 content sections between the hero and the bottom CTA. A PM reading your services list has no way to act without scrolling to the bottom or navigating away.
4. **Hero CTAs are fine for B2B** ("Submit RFP", "Prequalify Now") — but slide 3 sends to `/markets` (informational) instead of a conversion path.
5. **Prequalification docs require a page visit** — GCs want to download your prequal package and vendor packet quickly, not browse a page.

### The Fix — 4 Changes (Professional B2B)

#### 1. ✅ Restore the inline form on the homepage
Import existing `InteractiveCTA` into `Index.tsx`, placed between WhyChooseUs and ProcessStrip. Update its heading from "Request Site Assessment" to **"Start a Project Conversation"** and button from "Request a Proposal" to **"Submit Inquiry"** — matching your professional CTA language standards.

#### 2. ✅ Fix hero slide 3 CTA
Changed slide 3 primary CTA from "View Markets" → `/markets` to **"Request Site Assessment"** → `/contact`.

#### 3. ✅ Add a professional sticky inquiry bar
Slim, understated bar at the bottom of the viewport. Two variants:
- **Desktop:** "Looking for a trade partner? Request unit pricing or submit a scope →" with a single link to `/submit-rfp`
- **Mobile:** Tap-to-call button + "Submit Scope" button

#### 4. ✅ Add quick-access credential downloads in the proof strip
Added "Download Prequal Package" link in `HomepageProofStrip`.

---

## Visual Dominance — Staged Implementation Plan

### PASS 1 — Safe Visual Upgrades (planned, not yet implemented)
1. Animated Stat Counters (ProofStrip)
2. Full-Bleed Parallax Image Break
3. Hover-Reveal Service Detail Panels

### PASS 2 — Cinematic Scroll Mechanics (planned, not yet implemented)
4. Horizontal-Scroll Project Showcase
5. Scroll-Activated Process Timeline

---

## Passes 3–5: Foundation Fixes

### PASS 3 — /services Page Rebuild ✅ IMPLEMENTED
- **3a.** `/services` page now queries published services from DB, grouped by category
- **3b.** Removed 7 hardcoded service pages (PaintingServices, TileFlooring, etc.) — all service detail pages now use `ServiceDetail` which fetches from DB by slug
- **3c.** Fixed homepage service links to match actual DB slugs (`facade-remediation`, `eifs-stucco-systems`, `waterproofing-systems`, `interior-buildouts-finishing`, `parking-garage-restoration`)
- Legacy slug redirects preserved in AppRoutes for SEO continuity

### PASS 4 — Data Quality ✅ IMPLEMENTED
- **4a.** Project cards now show branded "AGC" placeholder when `featured_image` is missing; summary fallback text for blank descriptions
- **4b.** Created `src/utils/formatPhone.ts` — centralized phone formatting utility. Updated 6 files to use it instead of inline regex/hardcoded strings
- **4c.** Replaced hardcoded `https://ascentgroupconstruction.com` URLs in Index.tsx structured data with `SITE_URL` and `COMPANY_EMAIL` constants

### PASS 5 — Admin Wiring & Domain Hygiene ✅ IMPLEMENTED
- **5c.** Added Netlify-only note to `_redirects`; SEO.tsx already uses `SITE_URL` for canonicals
- **5d.** Removed hardcoded service page imports from AppRoutes; legacy redirects now map to correct DB slugs
- Sustainability redirect fixed to point to `sustainable-building` (actual DB slug)

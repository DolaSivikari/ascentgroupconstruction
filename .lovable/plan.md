

# Phase 2 — Content Truth Hardening (Revised Plan)

## Revised Issues & File List

### A. Fabricated Stats (HIGH)

| Claim | Files | Action |
|---|---|---|
| 98% Client Satisfaction | `InteractiveCTA.tsx` L35, `PremiumServiceHero.tsx` L49 | Remove story card; replace stat |
| 95% On-Time Delivery | `QuickFactsSidebar.tsx` L37, `WhyChooseUs.tsx` L12 fallback | Remove/replace with verifiable item |
| 25+ Years Experience | `PremiumServiceHero.tsx` L53 | Fix to 15+ (team experience) |
| 500+ Projects, "Award-winning GC" | `migrateHomepageData.ts` L33-44, L98-110 | Fix seed data |
| $50M+, 500+ Projects, 50+ Trades, 98% templates | `StatsManager.tsx` L135-143 | Replace with realistic templates |

### B. Fabricated Partner Case Studies (HIGH)

`PartnerCaseStudies.tsx` — three detailed case studies with fabricated dollar values, LEED Gold, zero-incident claims. Used on Contact page only.

**Action:** Remove `<PartnerCaseStudies>` from `Contact.tsx`. Keep component file but do not render it publicly. This is safer than trying to rewrite fabricated projects into "representative scenarios" — that still risks trust damage. The component can be re-enabled later if real case studies are added.

### C. Unsupported LEED/Sustainable Building Page (HIGH)

`SustainableBuilding.tsx` is a full public service page claiming LEED consulting, certification support, Passive House, Green Globes — none verifiable.

**Action:** Rewrite the page to focus on what Ascent actually does: energy-efficient envelope assemblies, sustainable material sourcing, waste diversion practices. Remove all LEED consulting/certification claims. Remove Passive House and Green Globes certification claims. Keep "sustainable building practices" as an honest capability framing.

Also fix LEED references in:
- `Index.tsx` L51, L74 — schema QA answer and knowsAbout
- `migrateAboutPageData.ts` L86 — "LEED-certified construction expertise" seed data

### D. "Hundreds of" Projects — Standardized Fix (MEDIUM)

Appears in 6 files. Standard replacement pattern: **"Our team members bring hands-on experience from a wide range of envelope, restoration, and interior trades projects across the GTA"** — clearly attributing to team career history, not Ascent's company portfolio.

| File | Line | Current | Fix |
|---|---|---|---|
| `About.tsx` L184 | "Our team has delivered hundreds of..." | Rewrite with standard pattern |
| `Homeowners.tsx` L126 | "worked on hundreds of residential..." | Rewrite with standard pattern |
| `FAQ.tsx` L36 | "hundreds of highrise and commercial..." | Rewrite with standard pattern |
| `FAQ.tsx` L102 | "painted hundreds of businesses" | Rewrite with standard pattern |
| `OurProcess.tsx` L234 | "completed hundreds of commercial projects" | Rewrite with standard pattern |
| `enriched-company-content.ts` L20, L59, L92 | Multiple "hundreds of" | Rewrite with standard pattern |

### E. 24/7 Emergency Claims — Remove Unless Operationally Real (MEDIUM)

Appears in 7 surfaces. Since we cannot verify a staffed 24/7 line, **remove all "24/7" claims** and replace with honest language:

| File | Current | Replacement |
|---|---|---|
| `ServiceStats.tsx` L27 | "24/7" Emergency Response | "Rapid" Response Available |
| `PremiumServiceHero.tsx` L30 | "24/7 Support" badge | "Responsive Support" |
| `QuickFactsSidebar.tsx` L105 | "24/7 Emergency" credential | "Urgent Response" |
| `InteractiveCTA.tsx` L224 | "24/7 Support" | "Responsive Support" |
| `PremiumContactHero.tsx` L33 | "Available 24/7" badge | "Responsive & Available" |
| `OurProcess.tsx` L194 | "24/7 emergency line" | "Emergency contact for urgent issues" |
| `ServiceAreas.tsx` L177 | "Available 24/7 within GTA core" | "Available for urgent repairs within GTA core" |

### F. Overclaiming Headlines & Copy (MEDIUM)

| File | Current | Fix |
|---|---|---|
| `PremiumServiceHero.tsx` L35 | "Complete Construction Solutions" | "Envelope, Restoration & Interior Trades" |
| `PremiumServiceHero.tsx` L38 | "From concept to completion, we deliver excellence across Ontario" | "Specialty trade expertise across the Greater Toronto Area" |
| `DirectAnswer.tsx` L28 | "Ontario's Trusted Construction Partner" | "GTA Specialty Contractor" |
| `DirectAnswer.tsx` L35 | "Ontario's complete construction partner" | "a specialty contractor for building envelope, restoration, and interior trades in the Greater Toronto Area" |
| `InteractiveCTA.tsx` L164 | "Your Construction Partner For Success" | "Your Envelope, Restoration & Trades Partner" |
| `WhyChooseUs.tsx` L10 fallback | "21+ Service Offerings" | Remove stats badge |
| `WhyChooseUs.tsx` L11 fallback | "industry-leading brands" | "trusted manufacturer brands" |
| `Index.tsx` L86 | "Comprehensive Services Under One Roof" schema | "Specialty Trade Services" |

### G. Safety/Certification Overclaims (MEDIUM)

| File | Current | Fix |
|---|---|---|
| `FAQ.tsx` L214 | "Our team holds COR" | "Our team is working toward COR certification" |
| `FAQ.tsx` L214 | "maintain perfect safety record" | "maintain strong safety protocols" |
| `FAQ.tsx` L210 | "zero outstanding claims" | "good standing with WSIB" |

### H. Contract Types Still on OurProcess (MEDIUM)

`OurProcess.tsx` L132-144 still lists "Construction Management (CM)" and "Design-Build" as available contract types — removed from estimator in Phase 1 but still visible here.

**Action:** Remove CM and Design-Build entries. Keep Lump Sum, Cost Plus, Unit Price, T&M.

### I. Client Portal Claim (LOW)

`OurProcess.tsx` L189 — "Online dashboard to view schedules, invoices, change orders" — cannot verify this exists.

**Action:** Replace with "Project documentation shared via secure cloud folders" — which is already described elsewhere and is credibly deliverable.

### J. Response Time Claims (LOW)

`ServiceAreas.tsx` L23/28/33 — "24-hour response" for Durham/York/Halton regions.

**Action:** Change to "Next business day response" for outer regions. Keep "Same-day service available" for GTA Core as that is more defensible.

---

## Complete Revised File List (19 files)

| # | File | Changes |
|---|---|---|
| 1 | `src/components/homepage/QuickFactsSidebar.tsx` | Remove 95% on-time, 98% satisfaction; replace with verifiable items; "Urgent Response" not "24/7" |
| 2 | `src/components/homepage/InteractiveCTA.tsx` | Remove 98% story card; soften headline; remove 24/7 |
| 3 | `src/components/services/PremiumServiceHero.tsx` | Fix H1, stats (remove 98%, fix 25+→15+), remove 24/7 badge |
| 4 | `src/components/homepage/WhyChooseUs.tsx` | Fix fallback: remove 95%, "industry-leading", "21+" |
| 5 | `src/components/seo/DirectAnswer.tsx` | Rewrite to specialty contractor positioning |
| 6 | `src/components/services/ServiceStats.tsx` | "24/7" → "Rapid" |
| 7 | `src/components/services/ServicesTrustBar.tsx` | "Ontario-Wide" → "GTA & Southern Ontario" |
| 8 | `src/components/contact/PremiumContactHero.tsx` | "Available 24/7" → "Responsive & Available" |
| 9 | `src/pages/OurProcess.tsx` | Remove CM/Design-Build contracts; fix Client Portal claim; fix "hundreds"; fix 24/7 |
| 10 | `src/pages/FAQ.tsx` | Fix COR, "perfect safety", "zero claims", "hundreds" |
| 11 | `src/pages/Homeowners.tsx` | Standardize "hundreds" language |
| 12 | `src/pages/About.tsx` | Standardize "hundreds" language |
| 13 | `src/pages/Index.tsx` | Remove "LEED consulting" from schema; fix "Comprehensive Services" |
| 14 | `src/pages/Contact.tsx` | Remove `<PartnerCaseStudies>` import and render |
| 15 | `src/pages/services/SustainableBuilding.tsx` | Remove LEED/certification claims; rewrite to honest envelope sustainability focus |
| 16 | `src/pages/resources/ServiceAreas.tsx` | Remove 24/7; soften outer-region response times |
| 17 | `src/utils/migrateHomepageData.ts` | Fix seed data: remove 500+, 98%, GC, Award-winning |
| 18 | `src/utils/migrateAboutPageData.ts` | Remove "LEED-certified construction expertise" |
| 19 | `src/pages/admin/StatsManager.tsx` | Replace inflated templates with realistic values |
| 20 | `src/data/enriched-company-content.ts` | Standardize "hundreds" language (3 instances) |

## Intentionally Left Untouched

- **`PartnerCaseStudies.tsx` component file** — kept in codebase but removed from public rendering. Can be re-enabled with real projects later.
- **`ForGeneralContractors.tsx`** — accurately describes subcontractor relationship
- **`specialty-contractor-comparison.ts`** — educational comparison data, not claiming GC status
- **Individual service detail pages** (masonry, EIFS, cladding, etc.) — describe actual trade capabilities accurately
- **Legal pages** (Privacy, Terms) — reviewed, no false claims found
- **Contact page structure** — only removing PartnerCaseStudies, rest is accurate
- **Navigation links to `/services/sustainable-building`** — page stays but with honest content; no route removal needed

## Claims That Can Stay

| Claim | Basis |
|---|---|
| 15+ years (team/leadership experience) | Founder career history |
| 10+ projects completed | Modest, plausible for 2025 company |
| $2M CGL coverage | Stated consistently, verifiable |
| WSIB compliant | Consistently stated, clearance certs referenced |
| "Working toward COR" | Honest aspirational framing |
| 85% self-performed | Previously flagged for periodic verification |
| 10-person crew | Consistent |
| GTA service area | Supported by city list |
| Benjamin Moore / Sherwin-Williams | Manufacturer relationships stated consistently |

Note on "10+ projects completed": this appears in `ServiceStats.tsx` and `QuickFactsSidebar.tsx`. It is modest enough to be plausible but cannot be independently verified from code. Leaving it because understating is better than overstating, and removing it would leave a gap. If the operator knows this is wrong, it should be corrected.

## Checks After Implementation

1. Grep for remaining "98%" in public-facing files
2. Grep for remaining "95%" on-time claims
3. Grep for "500+" project claims
4. Grep for "LEED consulting" in public content/schema
5. Grep for "complete construction" in headlines
6. Grep for "industry-leading" in public copy
7. Grep for "perfect safety" / "zero claims"
8. Grep for "24/7" in public-facing components
9. Grep for "hundreds of" — verify all instances use standardized team-career framing
10. Verify `PartnerCaseStudies` is not rendered on any public page
11. Verify `SustainableBuilding.tsx` no longer claims LEED consulting
12. TypeScript build check
13. Console error check

## What Requires Manual Verification

- Whether the 24/7 emergency line is actually staffed (if yes, claims can be restored)
- Whether the partner case studies represent real projects (if yes, component can be re-enabled)
- Whether a client portal actually exists and functions
- Whether "10+ projects completed" is accurate as of current date


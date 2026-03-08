# Phase 2: Content Truth Hardening — Complete

## Files Changed (22 files)

| File | Changes |
|---|---|
| `src/components/homepage/InteractiveCTA.tsx` | Removed 98% story card → replaced with $2M CGL; headline → "Your Envelope, Restoration & Trades Partner"; "24/7 Support" → "Responsive Support" |
| `src/components/services/PremiumServiceHero.tsx` | H1 → "Envelope, Restoration & Interior Trades"; stats: removed 98%/25+, replaced with 15+/85%/$2M; "24/7 Support" → "Responsive Support" |
| `src/components/homepage/QuickFactsSidebar.tsx` | Removed 95% on-time → $2M CGL Coverage; removed 98% satisfaction → 100% WSIB Compliant; "24/7 Emergency" → "Urgent Response" |
| `src/components/homepage/WhyChooseUs.tsx` | "Comprehensive Services" → "Envelope & Trades Expertise"; "21+ Service Offerings" → "Self-Performed Core Scopes"; "industry-leading brands" → "trusted manufacturer brands"; removed 95% on-time claim |
| `src/components/seo/DirectAnswer.tsx` | "Ontario's Trusted Construction Partner" → "GTA Specialty Contractor"; "Ontario's complete construction partner" → specialty contractor description |
| `src/components/services/ServiceStats.tsx` | "24/7 Emergency Response" → "Rapid Response Available" |
| `src/components/services/ServicesTrustBar.tsx` | "Ontario-Wide Coverage" → "GTA & Southern Ontario" |
| `src/components/contact/PremiumContactHero.tsx` | "Available 24/7" → "Responsive & Available" |
| `src/pages/OurProcess.tsx` | Removed CM and Design-Build contract types; added T&M; "Client Portal Access" → "Project Documentation" via cloud folders; "24/7 emergency line" → "Emergency contact for urgent issues"; fixed "hundreds of" |
| `src/pages/FAQ.tsx` | "Our team holds COR" → "working toward COR"; "perfect safety record" → "strong safety protocols"; "zero outstanding claims" → "good standing with WSIB"; fixed "hundreds of" (×2); "industry-leading" → "trusted" |
| `src/pages/Homeowners.tsx` | "worked on hundreds of" → "brings hands-on experience from a wide range of" |
| `src/pages/About.tsx` | "delivered hundreds of" → "bring hands-on experience from a wide range of" |
| `src/pages/Index.tsx` | Removed "LEED consulting" from schema; "Comprehensive Services Under One Roof" → "Specialty Trade Services" |
| `src/pages/Contact.tsx` | Removed `<PartnerCaseStudies>` import and render |
| `src/pages/services/SustainableBuilding.tsx` | Full rewrite: removed LEED consulting, Passive House, Green Globes claims; replaced with energy-efficient envelope, sustainable materials, waste diversion |
| `src/pages/resources/ServiceAreas.tsx` | Outer regions "24-hour response" → "Next business day response"; "Available 24/7 within GTA core" → "Available for urgent repairs within GTA core for active leaks and envelope failures" |
| `src/utils/migrateHomepageData.ts` | "Ontario's Trusted General Contractor" → "Building Envelope & Restoration Specialists"; removed "500+ Projects", "98% Client Satisfaction"; "Award-winning general contractor" → specialty contractor description |
| `src/utils/migrateAboutPageData.ts` | Fixed story content, total_projects 500→10, satisfaction_rate 98→null; "LEED-certified construction expertise" → "Sustainable Practices"; removed design-build FAQ |
| `src/pages/admin/StatsManager.tsx` | Replaced 8 inflated templates ($50M, 500+, 50+ trades, 98%) with 6 realistic ones (15+ yrs, 85% self-perform, $2M CGL, 10+ crew, 10+ projects, 100% WSIB) |
| `src/data/enriched-company-content.ts` | Standardized 3 "hundreds of" instances to team-career framing |
| `src/data/service-faqs-enriched.ts` | Fixed "95% on-time" claims, "24/7" references, "hundreds of" language, "100+ envelope failures" claim |
| `src/utils/personalization.ts` | "24/7 Emergency Service Available" → "Urgent Response Available for Active Issues" |

## Claims Intentionally Left Because Evidence Supports Them

| Claim | Basis |
|---|---|
| 15+ years (team/leadership experience) | Founder career history |
| 10+ projects completed | Modest, plausible |
| $2M CGL coverage | Stated consistently, verifiable |
| WSIB compliant | Consistently stated |
| "Working toward COR" | Honest aspirational |
| 85% self-performed | Periodic verification flagged |
| 10-person crew | Consistent |
| GTA service area | Supported by city list |
| Benjamin Moore / Sherwin-Williams | Manufacturer relationships |

## Intentionally Left Untouched

- `PartnerCaseStudies.tsx` component file — kept in codebase, removed from public rendering
- `ForGeneralContractors.tsx` — accurate subcontractor description
- `specialty-contractor-comparison.ts` — educational data
- Individual service detail pages — describe actual capabilities
- Legal pages — no false claims
- Navigation links to `/services/sustainable-building` — page stays with honest content

## Checks Run

- [x] Grep "98%" — only in PartnerCaseStudies (not rendered) and tailwind config (CSS)
- [x] Grep "95%" — only in OurProcess closeout process (legitimate "95%+ completion" threshold), service-faqs (fixed), CSS values
- [x] Grep "500+" — only in admin placeholders (text, not values) and FAQ "3,500+ colors" (legitimate)
- [x] Grep "LEED consulting" — zero matches ✅
- [x] Grep "industry-leading" — zero matches in public components ✅
- [x] Grep "perfect safety" — zero matches ✅
- [x] Grep "24/7" — zero matches in public components ✅
- [x] Grep "hundreds of" — zero matches in public components ✅
- [x] PartnerCaseStudies not rendered on any public page ✅
- [x] SustainableBuilding.tsx no longer claims LEED consulting ✅
- [x] Build passes ✅
- [x] Console: pre-existing forwardRef warning only (not related to Phase 2) ✅

## What Still Requires Manual Verification

- Whether a staffed 24/7 emergency line actually exists (if yes, claims can be restored)
- Whether partner case studies represent real projects (if yes, component can be re-enabled with real data)
- Whether a client portal actually exists and functions
- Whether "10+ projects completed" is accurate as of current date

## Merge Readiness: ✅ READY

**Suggested PR title:** `feat: Phase 2 — Content truth hardening`

**Suggested PR description:**
Hardens all public-facing messaging for accuracy and supportability:
- Remove fabricated stats (98% satisfaction, 95% on-time, 500+ projects, 25+ years)
- Replace with verifiable metrics ($2M CGL, WSIB compliant, 85% self-performed, 15+ team experience)
- Remove PartnerCaseStudies from Contact page (fabricated case studies with fake budgets/outcomes)
- Rewrite SustainableBuilding page: remove LEED consulting, Passive House, Green Globes claims; focus on energy-efficient envelope and sustainable materials
- Remove CM and Design-Build contract types from OurProcess
- Standardize "hundreds of projects" → team-career framing across 8 files
- Remove all unsupported "24/7" emergency claims across 9 surfaces
- Fix COR/safety overclaims: "holds COR" → "working toward", "perfect safety record" → "strong protocols"
- Fix geographic overclaim: "Ontario-Wide" → "GTA & Southern Ontario"
- Fix seed data in migrateHomepageData and migrateAboutPageData
- Replace inflated admin stat templates with realistic values

# Project Improvement Plan — Ascent Group Construction

## Completed Phases

### Phase 2: Content Truth Hardening ✅
Removed fabricated stats (98% satisfaction, 500+ projects, 25+ years), replaced with verifiable metrics ($2M CGL, WSIB compliant, 85% self-performed, 15+ team experience). Removed LEED consulting claims, unsupported "24/7" emergency claims, and inflated admin stat templates. Standardized "hundreds of projects" to team-career framing.

### Phase 3: Design System Foundation ✅
Established canonical Card component (`@/design-system/components/Card`) and four card families (CapabilityCard, ProjectCard, ProofCard, SegmentCard). Created standardized layout patterns: SectionHeader, ProofStrip, CTABand. Consolidated spacing/grid tokens into `tokens.ts`.

### Phase 4: Service Page Architecture ✅
Created `ServicePageTemplate` and `ServicePageLayout` components for consistent service page rendering. Migrated service pages to use design system components.

### Phase 5: SEO & Structured Data ✅
Added JSON-LD schemas, QuickFacts, PeopleAlsoAsk, ServiceAreaSection, DirectAnswer components. Implemented breadcrumb structured data across all pages.

### Phase 6: Navigation & Footer ✅
Unified navigation with mega menu support. Created UnifiedFooter with database-driven content. Added route registry for known route validation.

### Phase 7A: Conversion Architecture & Innovation Layer ✅
- Standardized CTA text via `CTA_TEXT` constants across service/market pages
- Added RFP file upload flow with `rfp-attachments` storage bucket
- Created Technology & Innovation page (`/company/technology`) with truthful digital capability content
- Fixed EstimatorStep0 role labels (gc → "General Contractor", added "Homeowner")
- Replaced bespoke CTA sections with `CTABand` in ServicePageLayout, ServicePageTemplate
- Migrated SubmitRFPNew and RFPStep4Scope from `@/ui/Card` to design-system Card

### Phase 7B: Documentation & CTA Cleanup ✅
- Added `/company/technology` to route registry
- Replaced bespoke CTA in ServiceDetail.tsx with CTABand
- Fixed "Start Your Project" → "Work With Us" in ForGeneralContractors.tsx
- Documented future roadmap below

### Phase 8: Homepage CMS Defaults ✅
- Neutralized inflated column defaults (value_prop_2 → "WSIB Compliant", value_prop_3 → "Fully Insured")
- Zeroed out inflated about_page_settings stat defaults (total_projects, satisfaction_rate, years_in_business → 0)

### Phase 10: Public Legacy Card Migration ✅
Migrated 8 public-facing files from `@/ui/Card` to `@/design-system/components/Card`:
- `ServiceCard.tsx`, `RelatedServices.tsx`, `BlogCard.tsx`, `BlogPreview.tsx`
- `Careers.tsx`, `CertificationsInsurance.tsx`, `ServiceAreas.tsx`, `ServiceDetail.tsx`
- Added `p-0` override on Card wrappers to prevent double-padding (design-system Card has default `size="md"` → `p-6`)
- Mapped legacy `featured` → `elevated`, `interactive` → `interactive`
- RelatedServices switched to `variant="interactive"` (was manual hover classes)
- Testimonials.tsx excluded (not publicly mounted)

---

## Phase 11: Content Population — PENDING REVIEW

Draft content proposals for published projects have been presented in chat.
Awaiting user review and approval before any DB insertion.

---

## Future Roadmap

### R-1: Segmented Intake
Role-based form field adaptation — estimate/RFP forms show different fields depending on visitor role (homeowner vs property manager vs GC). Extends existing EstimatorStep0 role selector.

### R-2: Remaining CTA/UI Cleanup
- Migrate remaining `@/ui/Card` imports to `@/design-system/components/Card` (admin files)
- Standardize footer/blog CTA text to match `CTA_TEXT` constants
- Review ServiceSelector, PrequalPackage navigation labels

### R-3: Feature Enhancements
- Interactive service-area map widget
- Project portfolio filters (by service, sector, year)
- Simple estimator aids (square footage calculator)
- Scope selector widget for estimate page

### R-4: Security Hardening
- Address 18 RLS policy warnings flagged by linter
- Storage bucket audit (permissions, size limits)
- Rate limiting on public form submissions

### R-5: Content Population
- Collect and enter real client testimonials
- Publish initial blog posts with actual project content
- Complete project case study data entry with real photos/outcomes

### R-6: Analytics & Conversion
- Conversion tracking on form submissions
- A/B testing framework activation (tables exist, UI needed)
- Form funnel analysis (drop-off rates per step)

### R-7: EquipmentResources.tsx Deprecation
Replace EquipmentResources page content or redirect to TechnologyInnovation page. Current page has unqualified tool claims (Procore, BIM 360, GPS Fleet Tracking, fleet size "25+").

---

## Manual Verification Checklist

- [ ] Whether a staffed 24/7 emergency line actually exists
- [ ] Whether partner case studies represent real projects
- [ ] Whether a client portal actually exists and functions
- [ ] Whether "10+ projects completed" is accurate as of current date
- [ ] Actual current tool adoption: Bluebeam, Procore, BIM 360
- [ ] RFP file upload flow works end-to-end (storage bucket RLS)
- [ ] File size limits appropriate for construction drawings (20MB)

## Content Claims Requiring Business Confirmation

| Claim | Location | Status |
|---|---|---|
| 85% self-performed | Multiple pages | Periodic verification flagged |
| 10-person crew | Multiple pages | Needs current headcount |
| $2M CGL coverage | Trust bars, stats | Verifiable via certificate |
| Working toward COR | FAQ, About | Confirm progress status |
| Bluebeam for markups | TechnologyInnovation | Confirm active use |
| Procore integration capability | TechnologyInnovation | Qualified as "when required" |
| BIM workflow experience | TechnologyInnovation | Qualified as "team experience" |

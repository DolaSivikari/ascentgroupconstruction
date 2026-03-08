

# Phase 7A — Conversion Architecture, Innovation Layer

## Files to Create/Change (11)

| File | Action |
|---|---|
| `src/pages/company/TechnologyInnovation.tsx` | **New** — truthful digital capability page |
| `src/routes/AppRoutes.tsx` | Add `/company/technology` route + import |
| `src/components/rfp/RFPStep4Scope.tsx` | Add `FileUploadZone` for drawings/specs; migrate `@/ui/Card` → design-system; add `onFilesChange` callback |
| `src/pages/SubmitRFPNew.tsx` | Upload files to storage on submit; add `attachment_urls` to DB column; migrate `@/ui/Card` → design-system |
| `src/design-system/constants.ts` | Standardize `CTA_TEXT` — replace vague entries |
| `src/components/services/ServicePageTemplate.tsx` | Update final CTA text to use `CTA_TEXT` constants |
| `src/components/services/ServicePageLayout.tsx` | Replace bespoke CTA section with `CTABand`; use `CTA_TEXT` |
| `src/components/estimator/EstimatorStep0.tsx` | Fix `gc` duplicate label; add `homeowner` role |
| `src/components/homepage/CompanyResponse.tsx` | Fix "Start Your Project" → "Contact Us" |
| `src/components/seo/DirectAnswer.tsx` | Fix CTA text to "Contact Us" |
| `src/components/homepage/HomepageFinalCta.tsx` | Fix heading text |

**Database migration:**
1. Add `attachment_urls text[]` column to `rfp_submissions`
2. Create `rfp-attachments` storage bucket (private) with RLS for anonymous INSERT

## Issues Found

1. **EstimatorStep0 line 149**: `gc` role shows "Building Owner" — duplicate of `owner` on line 147. No "Homeowner" option exists.
2. **RFP form has no file upload** despite `plans_available` checkbox and `FileUploadZone` component existing elsewhere.
3. **`rfp_submissions` table** has no attachment column — needs `attachment_urls text[]`.
4. **No `rfp-attachments` storage bucket** — only `project-images` exists.
5. **CTA text inconsistency** across 14+ files — "Start Your Project", "Request Project Proposal", "Request Consultation", "Ready to Start Your Project?" used interchangeably.
6. **EquipmentResources.tsx** claims Procore, Autodesk Construction Cloud, BIM 360, GPS Fleet Tracking as current tools without qualification. Fleet size "25+" and equipment quantities are unverifiable.
7. **No `/company/technology` route** — no dedicated innovation/technology page.
8. **ServicePageLayout** uses a bespoke CTA section instead of `CTABand`.
9. **`SubmitRFPNew.tsx`** imports `Card`/`CardContent` from `@/ui/Card` (legacy).

## Exact Changes

### 1. Database Migration

```sql
-- Add attachment column to rfp_submissions
ALTER TABLE public.rfp_submissions 
ADD COLUMN attachment_urls text[] DEFAULT '{}';

-- Create rfp-attachments storage bucket (private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('rfp-attachments', 'rfp-attachments', false);

-- Allow anonymous uploads to rfp-attachments
CREATE POLICY "Anyone can upload RFP attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'rfp-attachments');

-- Allow authenticated admins to read RFP attachments
CREATE POLICY "Admins can read RFP attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'rfp-attachments' AND EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
));
```

### 2. CTA Standardization (`constants.ts`)

Replace vague CTA entries:
- `contact`: "Start Your Project" → "Contact Us"
- `project`: "Request Project Quote" → "Request an Estimate"  
- Keep `primary` as "Request a Proposal" (used in heroes)
- Keep `startProject` for residential-only contexts

### 3. RFP File Upload (`RFPStep4Scope.tsx` + `SubmitRFPNew.tsx`)

- Add `onFilesChange` prop to `RFPStep4Scope`
- Render `FileUploadZone` when `plans_available` is checked (conditional — only show upload zone when user indicates plans exist)
- Accept: PDF, DOC, DOCX, DWG, images (max 20MB each, max 5 files)
- In `SubmitRFPNew.tsx`: on submit, upload files to `rfp-attachments` bucket, collect URLs, store in `attachment_urls` column
- Migrate both files from `@/ui/Card` to design-system `Card`

### 4. EstimatorStep0 Fixes

- Line 149: Change `gc` label from "Building Owner" to "General Contractor"
- Add new option: `<SelectItem value="homeowner">Homeowner</SelectItem>`

### 5. ServicePageTemplate CTA (line 505-511)

Replace:
```
title="Ready to Start Your Project?"
primaryCta={{ text: "Request Project Proposal", href: "/contact" }}
```
With:
```
title="Ready to Discuss Your Project?"
primaryCta={{ text: CTA_TEXT.primary, href: "/contact" }}
```

### 6. ServicePageLayout CTA (lines 82-100)

Replace bespoke `Section` + manual buttons with `CTABand` component:
```tsx
<CTABand
  title={ctaTitle}
  description={ctaDescription}
  primaryCta={{ text: "Request Consultation", href: "/contact" }}
  secondaryCta={{ text: "View Projects", href: "/projects" }}
  variant="dark"
/>
```

### 7. TechnologyInnovation.tsx (New Page)

Sections:
- **How We Work Digitally** — intro explaining Ascent uses digital tools to improve coordination, documentation, and quality
- **Current Practice** — using `CapabilityCard` grid:
  - "Digital Markup & Plan Review" — "We use Bluebeam for takeoffs, document markup, and collaborative plan review"
  - "Photo Documentation" — "Systematic progress photos and condition documentation on every project"
  - "Digital Reporting" — "Daily reports, progress tracking, and client-facing project updates"
  - "Closeout Packages" — "Digital assembly of warranty docs, product data sheets, as-builts, and lien releases"
- **Coordination Capabilities** — what the team can integrate with:
  - "BIM & 3D Coordination" — "Our team has experience working within BIM workflows and 3D coordination processes on GC-led projects. We can receive, interpret, and work from BIM models when provided."
  - "Project Management Platforms" — "We integrate with Procore, BIM 360, and other PM platforms when required by the project team"
- **Future Investment** — clearly labeled:
  - "We are actively evaluating expanded digital capabilities including drone-based progress monitoring, digital twin documentation, and advanced scheduling integration. These represent our development roadmap, not current standard practice."
- CTA: `CTABand` with "Contact Us" → `/contact`
- SEO: truthful title/description, no overclaims
- Uses `Section`, `SectionHeader`, `CapabilityCard`, `CTABand`

### 8. CompanyResponse, DirectAnswer, HomepageFinalCta

- CompanyResponse line 36: "Start Your Project" → "Contact Us"
- DirectAnswer line 69: "Ready to Start Your Project?" → "Ready to Discuss Your Project?"
- DirectAnswer line 84: "Start Your Project" → "Contact Us"
- HomepageFinalCta line 35: "Ready to Start Your Project?" → "Ready to Discuss Your Project?"

## What Will NOT Be Changed

- **Full segmented intake** (form field adaptation per role) — Phase 7B
- **Staged rollout framework** — site is live, no in-code deployment pipeline
- **EquipmentResources.tsx** — will NOT be modified in this phase; the new Technology page provides the truthful alternative. EquipmentResources can be deprecated in a future phase.
- **Homepage, About, admin panel** — out of scope
- **Service-area widget, scope selector** — future enhancements
- **Footer CTA links** — the footer uses "Start Your Project" as a link label in PrequalPackage and ServiceSelector, but these are in components not directly touched; CTA_TEXT constant change will enable future cleanup

## Content Dependencies

- Technology page: tools qualified as "team experience" not "company standard on every project" — manual verification needed for Bluebeam, Procore, BIM 360 actual adoption status
- No invented metrics or testimonials

## Manual/External Verification Needed

1. Actual current tool adoption (Bluebeam, Procore, BIM 360) — copy is qualified but should be verified
2. Storage bucket RLS working for anonymous uploads (test upload flow)
3. File size limits appropriate for construction drawings (20MB per file)
4. Visual review of technology page copy for truth alignment
5. Visual review of CTA text changes across service/market pages

## Checks

1. TypeScript build passes
2. `/company/technology` route renders correctly
3. RFP file upload section appears when "Plans Available" is checked
4. File upload to `rfp-attachments` bucket works on submission
5. `attachment_urls` stored in `rfp_submissions` after upload
6. RFP success state remains in-place (no redirect)
7. EstimatorStep0 shows "General Contractor" for `gc`, has "Homeowner" option
8. CTA text consistent: no "Start Your Project" in service/market CTA bands
9. No `@/ui/Card` imports in `SubmitRFPNew.tsx` or `RFPStep4Scope.tsx`
10. No overclaims on technology page
11. No console errors on modified pages


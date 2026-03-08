

# Phase 7B — Documentation, CTA Cleanup, and Future Roadmap

## Summary

Phase 7B is primarily a **documentation and cleanup phase**, not a feature build. It delivers three things:

1. **Update `.lovable/plan.md`** with Phase 3-7A completion records and a structured future roadmap
2. **Clean up remaining CTA inconsistencies** that Phase 7A missed (6 files still use "Start Your Project" in public-facing components)
3. **Add `/company/technology` to the route registry** (missed in 7A)
4. **Replace the bespoke CTA in `ServiceDetail.tsx`** with `CTABand` (missed in 7A)

## Files to Change (4)

| File | Action |
|---|---|
| `.lovable/plan.md` | Full rewrite — document Phases 3-7A completion, add structured future roadmap |
| `src/routes/registry.ts` | Add `/company/technology` to `PUBLIC_ROUTE_PATTERNS` |
| `src/pages/ServiceDetail.tsx` | Replace bespoke CTA section (lines 392-423) with `CTABand` |
| `src/pages/ForGeneralContractors.tsx` | Change "Start Your Project" heading to "Work With Us" |

## Issues Found

1. **`plan.md`** still only contains Phase 2 — Phases 3-7A are undocumented
2. **`registry.ts`** missing `/company/technology` route added in 7A
3. **`ServiceDetail.tsx`** lines 392-410 still has a bespoke gradient CTA with "Ready to Start Your Project?" — was not migrated to `CTABand`
4. **`ForGeneralContractors.tsx`** line 298 still says "Start Your Project" as a section heading for the GC contact area — should be "Work With Us" or "Get in Touch"
5. **Remaining "Start Your Project" in footer, PrequalPackage, ServiceSelector, BlogPost, ServiceAreas, PartnerCaseStudies** — these are lower priority (footer is branding, PartnerCaseStudies is not rendered, others are navigation labels). Document as future cleanup, not this phase.

## Exact Changes

### 1. `.lovable/plan.md` — Full Rewrite

Replace Phase 2-only content with a structured document covering:
- **Completed phases summary** (Phase 2-7A, one paragraph each with key outcomes)
- **Future roadmap** organized into:
  - **7B-1: Segmented Intake** — role-based form field adaptation (estimate/RFP forms show different fields per visitor role)
  - **7B-2: Remaining CTA/UI Cleanup** — migrate remaining 87 files from `@/ui/Card` to design-system (admin files low priority); footer/blog CTA text
  - **7B-3: Feature Enhancements** — scope selector widget, service-area map, project filters, simple estimator aids
  - **7B-4: Security Hardening** — 18 RLS policy warnings, storage bucket audit
  - **7B-5: Content Population** — testimonials, blog posts, project case study data entry
  - **7B-6: Analytics & Conversion** — conversion tracking, A/B testing, form funnel analysis
  - **7B-7: EquipmentResources.tsx Deprecation** — replace with link to TechnologyInnovation page
- **Manual verification checklist** (items flagged across phases)
- **Content claims requiring business confirmation**

### 2. `registry.ts` — Add Missing Route

Add `'/company/technology'` to `PUBLIC_ROUTE_PATTERNS`.

### 3. `ServiceDetail.tsx` — Replace Bespoke CTA

Replace lines 392-423 (gradient section with manual buttons) with:
```tsx
<CTABand
  title="Ready to Discuss Your Project?"
  description="Get a detailed proposal from our team"
  primaryCta={{ text: CTA_TEXT.project, href: "/estimate" }}
  secondaryCta={{ text: CTA_TEXT.contact, href: "/contact" }}
  variant="dark"
/>
```

### 4. `ForGeneralContractors.tsx` — Fix Section Heading

Line 298: "Start Your Project" → "Work With Us"

## What Will NOT Be Changed

- **87 files with `@/ui/Card`** — most are admin components; full migration is documented as future work, not this phase
- **Footer "Start Your Project"** — this is a branded section label in the footer layout; documented for future review
- **`ServiceSelector.tsx`** — navigation label, not a CTA band
- **`BlogPost.tsx`** — low-traffic CTA; documented for future cleanup
- **No new features** — this phase is documentation + residual cleanup only

## Checks

1. TypeScript build passes
2. `/company/technology` appears in route registry
3. `ServiceDetail.tsx` uses `CTABand` instead of bespoke gradient CTA
4. `ForGeneralContractors.tsx` no longer says "Start Your Project"
5. `plan.md` contains structured roadmap with all phases documented
6. No console errors on modified pages


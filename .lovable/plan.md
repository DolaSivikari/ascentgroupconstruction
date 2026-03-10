

# Full Implementation Plan — Tender Readiness & SEO Gaps

Based on the audit, here's everything remaining, organized by implementation order. Items 1-2 are already resolved.

---

## Phase A: Quick Wins (same session)

### A1. Update `index.html` meta keywords
Replace the painting-heavy keywords on line 123 with envelope/restoration/tender-intent terms:
```
building envelope contractor ontario, facade remediation toronto, specialty contractor GTA,
masonry restoration, EIFS stucco repair, parking garage restoration, waterproofing contractor,
cladding systems ontario, prequalified subcontractor, WSIB compliant contractor
```

### A2. Fix city data mismatch
- Add `"king-city"` entry to `LocationPage.tsx` locationDetails (it's in the cities list but has no landing page data)
- Add `"Hamilton"` to `service-area-cities.ts` (it has a LocationPage entry but isn't in the cities list)
- Update `ServiceAreas.tsx` SEO description to remove "painting" language

### A3. Update `ServiceAreas.tsx` SEO metadata
The meta description still says "painting and construction services" — align to envelope/restoration positioning.

---

## Phase B: New Audience Pages (2 new pages)

### B1. `/for-architects` page
A page targeting architects and building science consultants who specify contractors at design phase. Sections:
- Hero: "Partner With a Contractor Who Understands Your Specs"
- Material systems expertise (EIFS, masonry, cladding, coatings — product lines like Dryvit, Sto, Benjamin Moore)
- How we work with design teams (shop drawings, mock-ups, submittals)
- Typical project types (remediation, new construction envelope, tenant improvement)
- CTA: "Request a Consultation" → `/contact`

Uses existing components: `PageHero`, `Section`, `SectionHeader`, `CapabilityCard`, `CTABand`, `OperationalProofBar`.

### B2. `/emergency-repair` page
Captures high-value urgent work (water infiltration, storm damage). Sections:
- Hero with prominent phone number: "Same-Day Site Assessment, GTA-Wide"
- Emergency services list (water infiltration, facade failure, storm damage, sealant failure)
- Response process (call → same-day assessment → temporary measures → permanent repair)
- Service area coverage
- CTA: Phone call + contact form

---

## Phase C: Routing & Registry Updates

- Add routes for `/for-architects` and `/emergency-repair` to `AppRoutes.tsx`
- Add both to `PUBLIC_ROUTE_PATTERNS` in `routes/registry.ts`
- Add to navigation (Services mega menu or footer links)

---

## Phase D: Tender-Intent Keyword Pages (content enrichment)

### D1. Enhance `/prequalification` page
Add tender-intent keywords naturally: "WSIB compliant subcontractor", "bonded contractor GTA", "prequalified specialty contractor Ontario". Add a "Downloadable Capability Statement" section placeholder (PDF upload via admin later).

### D2. Enhance `/submit-rfp` page
Add "building envelope RFP" keyword targeting in SEO meta and page copy.

### D3. Enhance `/company/certifications-insurance` page
Add "COR certified facade contractor" keyword targeting.

---

## Phase E: Blog Content Strategy (infrastructure only)

No blog posts to write in code — but ensure the blog hub and individual post pages properly target these keyword clusters via SEO defaults:
- WSIB compliance guides
- EIFS vs stucco comparisons
- Facade remediation process
- Self-performed work advantages
- Building envelope maintenance schedules

This is already supported by the existing blog infrastructure and admin editor.

---

## Summary of Files

| Phase | Files Modified/Created | Effort |
|---|---|---|
| A1 | `index.html` | 1 line |
| A2 | `LocationPage.tsx`, `service-area-cities.ts` | ~15 lines |
| A3 | `ServiceAreas.tsx` | 2 lines |
| B1 | New `src/pages/ForArchitects.tsx` | ~250 lines |
| B2 | New `src/pages/EmergencyRepair.tsx` | ~200 lines |
| C | `AppRoutes.tsx`, `routes/registry.ts` | ~10 lines |
| D | `Prequalification.tsx`, `SubmitRFPNew.tsx`, `CertificationsInsurance.tsx` | ~15 lines |

**Not in scope** (requires user action, not code):
- Setting `ENABLE_IMAGE_OPTIMIZATION=true` in production env
- Writing real case study content (needs actual project data)
- Publishing blog posts (admin CMS workflow)
- Requesting Google Reviews
- Registering on DataBid/ConstructConnect


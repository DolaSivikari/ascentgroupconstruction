

# Phase 1 — Production Integrity and Trust Cleanup (Revised)

## Issues Found

### A. Structured Data Misrepresentation (TRUST — HIGH)

**`GeneralContractor` @type used in 6 files:**
| File | Location |
|---|---|
| `src/components/SEO.tsx` L39 | `["GeneralContractor", "LocalBusiness"]` |
| `src/utils/structured-data.ts` L19 | `"GeneralContractor"` + stale description mentioning "LEED certification support" |
| `src/utils/seo/structured-data.ts` L135, L370 | `"GeneralContractor"` in localBusiness + location schemas |
| `src/utils/schemaGenerators.ts` L125, L176 | `"GeneralContractor"` in localBusiness + SERVICE_SCHEMAS entry |
| `src/utils/faq-schema.ts` L33 | `"GeneralContractor"` in service schema provider |
| `src/pages/resources/LocationPage.tsx` L196 | `"GeneralContractor"` in per-city LocalBusiness |

**Fix:** Change all to `"HomeAndConstructionBusiness"` (valid Schema.org type for specialty contractors).

### B. Conflicting Address in SEO.tsx (TRUST — MEDIUM)

`SEO.tsx` uses `streetAddress: "Greater Toronto Area"`, `postalCode: "M5H 2N2"`. Every other file uses `2 Jody Ave, North York, ON M3N 1H1`.

**Fix:** Align to real address.

### C. Fake Awards in SEO.tsx (TRUST — MEDIUM)

`award` array includes "Licensed Building Envelope Contractor Ontario" — not a verifiable award/license name. WSIB compliance is a status, not an award.

**Fix:** Remove `award` array entirely.

### D. Overclaimed Offer Catalog in SEO.tsx (TRUST — MEDIUM)

Lists "Commercial Construction" and "Residential Construction & Renovation" as full services — implies GC capability.

**Fix:** Replace with actual specialty services (building envelope, EIFS/stucco, masonry restoration, cladding, protective coatings, painting, interior finishing, parking garage restoration).

### E. Stale Description in `structured-data.ts` (TRUST — MEDIUM)

Default description: "Professional construction management services in Ontario. Specializing in commercial, industrial, and institutional projects with LEED certification support." — mentions construction management and LEED, neither of which are offered.

**Fix:** Replace with accurate specialty contractor description.

### F. GC-Overclaiming Service Schemas in `schemaGenerators.ts` (TRUST — MEDIUM)

`SERVICE_SCHEMAS` includes `"general-contracting"`, `"construction-management"`, `"design-build"` entries that describe full GC capabilities. These are not services the company offers.

**Fix:** Remove those three entries. Keep the specialty-trade entries.

### G. Hero Slide Fallback Trust Issues (TRUST — MEDIUM)

Three issues in `enriched-hero-slides.ts` (fallback data, shown if DB is empty):
1. **Slide 1:** "Prime contractor for facade remediation..." — ambiguous phrasing that could imply GC role. Should use "Specialty contractor" or "Envelope lead contractor."
2. **Slide 2:** `"Quality Home Services"` + `"Commercial-grade quality for homeowners"` with CTA to `/homeowners` — this slide describes a residential painting/reno service that is secondary to the core business and uses vague consumer language.
3. **Slide 3:** `"85% Self-Performed"` stat — no way to verify this is still accurate.

**Fix:**
- Slide 1: Change "Prime contractor" → "Specialty contractor"
- Slide 2: Rewrite to match core positioning (envelope/restoration), change CTA from `/homeowners` to `/services`
- Slide 3: Keep "85%" but it should be flagged as needing periodic verification (no code change needed, document only)

### H. FAQ Overclaiming (TRUST — MEDIUM)

`FAQ.tsx` L48: "We specialize in general contracting, commercial construction, multi-family construction, design-build..." — directly claims GC and design-build services.

**Fix:** Rewrite to reflect specialty contractor scope.

### I. Navigation Mega Menu GC Claim (TRUST — LOW-MEDIUM)

`DynamicServicesMegaMenu.tsx` L113/116: "GC + Self-Perform = Schedule Certainty" and "By delivering both general contracting and self-perform trades..." — implies current GC capability.

**Fix:** Rewrite to reflect specialty self-perform model without claiming GC status.

### J. Estimator Dropdown Overclaiming (TRUST — LOW)

`EstimatorStep1.tsx` L72-74: Dropdown includes "General Contracting", "Design-Build Services", "Construction Management" as selectable service types.

**Fix:** Remove these three options. Keep "Suite Buildouts", "Tile & Flooring", "Sustainable Building", "Preconstruction Services".

### K. Careers Page Inflated Language (TRUST — LOW)

`Careers.tsx` L52, L62: "Industry-leading safety equipment" and "Industry-leading wages" — unverifiable claims for a 2025-founded company.

**Fix:** Change to "Professional safety equipment" and "Competitive wages".

### L. `ai-content.ts` "Specialty prime contractor" USP (TRUST — LOW)

USP list includes "Specialty prime contractor." This is used in AI content surfaces. The term is contextually defensible in construction (prime on envelope scope), but inconsistent with the broader cleanup.

**Fix:** Change to "Specialty lead contractor" for clarity.

### M. `ai-content.ts` Services Page Description (TRUST — LOW)

L62: "...as a specialty prime contractor" — same issue.

**Fix:** Change to "as a specialty lead contractor."

---

## Production Integrity Assessment

### What exists in-repo (verified working):

| Protection | Location | Status |
|---|---|---|
| www→non-www 301 redirect | `public/_redirects` L4-6 | Correct |
| http→https redirect | `public/_redirects` L5-6 | Correct |
| Canonical URL in `<head>` | `SEO.tsx` forces `https://ascentgroupconstruction.com` | Correct |
| Legacy URL redirects | `public/_redirects` L8-31 | Correct, covers old service slugs |
| In-app route redirects | `AppRoutes.tsx` L95-117 | Correct, mirrors `_redirects` |
| Cache headers | `public/_headers` | `no-cache` for HTML, long-cache for assets |
| `robots.txt` | Correct canonical sitemap URL | Verified |

### What CANNOT be verified from code (requires external checks):

```text
EXTERNAL VERIFICATION CHECKLIST
================================
1. DNS Resolution
   - Verify: nslookup ascentgroupconstruction.com → points to hosting IP
   - Verify: nslookup www.ascentgroupconstruction.com → same IP or CNAME to apex
   - Tool: dnschecker.org

2. SSL Certificates
   - Verify: https://ascentgroupconstruction.com loads with valid cert
   - Verify: https://www.ascentgroupconstruction.com redirects (not cert error)

3. Redirect Behavior (live)
   - Test: curl -I https://www.ascentgroupconstruction.com → 301 to non-www
   - Test: curl -I http://ascentgroupconstruction.com → 301 to https
   - Test: curl -I http://www.ascentgroupconstruction.com → 301 to https non-www

4. Same Build Served
   - Compare page source on apex vs www before redirect
   - Confirm no stale/cached legacy version on either

5. CDN Cache Purge (post-deploy)
   - After publishing, confirm updated meta tags appear on live site
   - If caching proxy exists, trigger cache purge

6. Search Console
   - Submit updated sitemap after deploy
   - Request re-crawl of homepage, /services, /about, /contact, /faq
   - Monitor for stale snippets in search results over 2-4 weeks
```

**No additional in-repo changes are needed for production integrity.** The repo-side protections are correct. Any issues would be DNS/hosting configuration.

---

## CTA / Route Trust Spot-Checks

| Surface | CTA / Link | Target | Status |
|---|---|---|---|
| Homepage Final CTA | "Submit RFP" | `/submit-rfp` | Route exists, page renders |
| Homepage Final CTA | "Get Estimate" | `/estimate` | Route exists, page renders |
| Homepage Final CTA | "Contact Us" | `/contact` | Route exists, page renders |
| Hero Slide 1 | "Request a Proposal" | `/contact` | OK |
| Hero Slide 2 (fallback) | "Start Your Project" | `/homeowners` | Route exists but **misaligned** — secondary service, not core CTA |
| Hero Slide 3 | "Request Proposal" | `/contact` | OK |
| Services mega menu | "Learn More" | `/about` | OK |
| Footer CTAs | Phone/email links | Verified in PhoneLink | OK |
| `/services/general-contracting` | Redirect | `/services` | 301 redirect, OK |
| `/services/construction-management` | Redirect | `/services` | 301 redirect, OK |
| `/services/design-build` | Redirect | `/services` | 301 redirect, OK |
| `/company/developers` | Direct route | Renders Developers page | OK |
| `/for-general-contractors` | Direct route | Renders ForGC page | OK |

**Issue found:** Hero slide 2 fallback CTA goes to `/homeowners` — a secondary residential page that doesn't represent core positioning. Fixed as part of slide 2 rewrite above.

---

## Files to Change

| File | Changes |
|---|---|
| `src/components/SEO.tsx` | Fix @type, address, remove awards, rewrite offer catalog |
| `src/utils/structured-data.ts` | Fix @type, fix stale default description |
| `src/utils/seo/structured-data.ts` | Fix @type in localBusinessSchema + generateLocationSchema |
| `src/utils/schemaGenerators.ts` | Fix @type in generateLocalBusinessSchema, remove GC/CM/DB from SERVICE_SCHEMAS |
| `src/utils/faq-schema.ts` | Fix @type in generateServiceSchema provider |
| `src/pages/resources/LocationPage.tsx` | Fix @type in local business schema |
| `src/data/enriched-hero-slides.ts` | Fix slide 1 "prime contractor" → "specialty contractor", rewrite slide 2 |
| `src/pages/FAQ.tsx` | Rewrite GC-overclaiming FAQ answer |
| `src/components/navigation/DynamicServicesMegaMenu.tsx` | Rewrite "GC + Self-Perform" copy |
| `src/components/estimator/EstimatorStep1.tsx` | Remove GC/design-build/CM dropdown options |
| `src/pages/Careers.tsx` | "Industry-leading" → "Professional" / "Competitive" |
| `src/utils/seo/ai-content.ts` | "Specialty prime contractor" → "Specialty lead contractor" |

## Intentionally Left Untouched

- Homepage layout/design — out of scope
- Admin pages — not public-facing trust surfaces
- Form logic — no changes
- Service page content — separate phase
- About page — already uses honest language ("emerging specialty contractor", "goal is to expand into full general contracting")
- `ForGeneralContractors.tsx` — describes subcontractor relationship accurately
- `specialty-contractor-comparison.ts` — data file used on `/why-specialty-contractor`, accurately contrasts models

## Checks After Implementation

1. Build passes with no TypeScript errors
2. Console log check for runtime errors
3. Grep for remaining `GeneralContractor` in non-data-comparison files
4. Grep for remaining "industry-leading" outside of justified contexts
5. Verify all modified structured data outputs valid JSON-LD
6. Spot-check hero slide fallback renders correctly
7. Verify estimator dropdown no longer shows GC/CM/DB options
8. Verify FAQ answer reflects specialty scope


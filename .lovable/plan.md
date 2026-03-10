
# Fix Two High-Priority Data Contradictions

## Issues Found (confirmed)

1. **$5M insurance claim** — Lines 60 and 85 of `CertificationsInsurance.tsx` both say "$5M liability coverage" in the SEO meta description. Every other location on the site says $2M CGL. Fix: change "$5M" → "$2M" in both SEO description strings.

2. **Wrong email domain** — Line 439 of `Prequalification.tsx` uses `info@ascentgroup.ca` instead of the canonical `info@ascentgroupconstruction.com`. Fix: replace with the correct domain using the existing `ASCENT_EMAIL_ENCODED` constant from `EmailLink.tsx`.

## Changes

### `src/pages/company/CertificationsInsurance.tsx`
- Line 60: `$5M` → `$2M` in meta description
- Line 85: `$5M` → `$2M` in meta description

### `src/pages/Prequalification.tsx`
- Line 439: Replace `btoa('info@ascentgroup.ca')` with the `ASCENT_EMAIL_ENCODED` constant (imported from `@/components/EmailLink`) which resolves to `info@ascentgroupconstruction.com`

Two files, three line changes. No logic or layout changes.

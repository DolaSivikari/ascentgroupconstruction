

# UX / Visual-Consistency Pass — Implementation Plan

## 1. Files to Change

| # | File | Scope |
|---|------|-------|
| 1 | `src/components/Navigation.tsx` | Fix heroPages slug (1 line) |
| 2 | `src/pages/Estimate.tsx` | Rebuild page structure: add PageHero, remove PaintCalculator, add trust/pathway context, preserve all form logic |
| 3 | `src/components/homepage/WhoWeServeHomepage.tsx` | Improve visual treatment: muted background, stronger card styling, better spacing |
| 4 | `src/components/homepage/CompanyOverviewHub.tsx` | Improve visual hierarchy: differentiate the three columns, better card styling |
| 5 | `src/components/footer/UnifiedFooter.tsx` | Add "Resources" link group, fix logo positioning hack, improve mobile layout |
| 6 | `src/pages/Contact.tsx` | Add contact pathway guidance section, remove "Quick/Detailed" toggle (use single professional form), add contact info sidebar alongside form |

## 2. What Is Wrong on Each Surface

**Estimate:**
- No PageHero — jumps straight to a bare `h1` with `pt-24` padding. Feels disconnected from every other page.
- `PaintCalculator` widget embedded at the top — leftover painting-estimator energy, not aligned with specialty contractor positioning.
- No guidance about when to use Estimate vs Contact vs Submit RFP.
- No trust framing (no proof strip, no credential context).
- The form card is fine; the wrapper/page context is weak.

**Sustainable Construction hero/nav:**
- `heroPages` array in Navigation.tsx contains `/services/sustainable-building` but the actual route is `/services/sustainable-construction`. One-character mismatch means the nav does not go transparent on this page, breaking the hero visual blend.

**Homepage Who We Serve:**
- Plain `bg-background` with no visual differentiation from surrounding sections.
- SegmentCards are functional but visually flat — horizontal icon+text layout doesn't command attention on the homepage.
- Missing subtle background treatment to separate it from adjacent sections.

**Homepage Company Overview Hub:**
- Three identical-looking elevated cards in a row — visually monotone.
- Content density is high but visual hierarchy is flat (all three columns look the same weight).
- The `bg-gradient-to-b from-background to-muted/30` gradient is very subtle, almost invisible.

**Footer:**
- Missing "Resources" grouping (Certifications, Technology, Service Areas, Contractor Portal) — these secondary pages have no footer presence.
- Logo `-ml-16` negative margin hack is fragile and can clip on certain viewports.
- Mobile accordion only has 2 groups (Company, Services) — needs Resources too.
- CTA section in desktop column 3 has "View Services" as secondary CTA which duplicates the Services column; should be "Request Estimate" instead.

**Contact:**
- "Quick Contact" vs "Detailed Request" toggle feels app-like, not enterprise.
- No pathway guidance (when to use Contact vs Estimate vs Submit RFP).
- Contact information (address, phone, hours) is not visible alongside the form — buried below in the map section.
- Map section text says "Mississauga" but fallback address says "North York" — copy inconsistency.
- `TrustedPartners` section is orphaned between form and map with no visual purpose.

## 3. What Will Be Preserved

- All form submission logic (Supabase inserts, edge function calls, validation schemas, error handling, success states)
- All CMS/settings data reads (`useSettingsData`, `useCompanyOverview`, `useWhyChooseUs`)
- All fallback data arrays
- Lead-flow hardening (in-place success panels, duplicate submission guards, notification failure feedback)
- URL parameter pre-fills on Estimate
- Quote dialog flow for non-estimatable services
- All estimator step components and their wiring
- A/B test tracking and analytics calls
- SEO metadata and structured data
- Honeypot fields and rate limiting

## 4. Backend/CMS Wiring That Must Remain Untouched

- `supabase.from("contact_submissions").insert(...)` in Estimate
- `supabase.from("quote_requests").insert(...)` in Estimate
- `supabase.functions.invoke('submit-form', ...)` in Contact
- `supabase.functions.invoke('send-contact-notification', ...)` in Contact
- `supabase.functions.invoke('send-review-request', ...)` in both
- `useSettingsData('contact_page_settings')` in Contact
- `useCompanyOverview()` in CompanyOverviewHub
- `useWhyChooseUs()` in WhyChooseUs (not changing this file but noting dependency)
- `trackABTestConversion` calls in both forms

## 5. Design-System Components/Patterns to Use

- `PageHero` — add to Estimate page (matching Contact, Services, etc.)
- `Section` — wrap Estimate content sections properly
- `SectionHeader` — for sub-section headings
- `Card` (design-system) — already in use, will keep
- `CTABand` — potential use for Estimate pathway guidance
- `ProofStrip` — add trust bar to Estimate
- `SegmentCard` — keep for Who We Serve but with enhanced background context
- `mainPageHeroes` — use existing hero image mapping for Estimate

## 6. Checks to Run

- Verify Estimate form submission still works end-to-end (form data → Supabase)
- Verify Contact form submission still works
- Verify nav transparency on `/services/sustainable-construction`
- Verify footer renders correctly on desktop and mobile
- Verify homepage section spacing and visual flow
- Console log check for errors

## 7. Visual-Risk / Regression-Risk Notes

- **Estimate**: Removing PaintCalculator from the page could surprise users who relied on it. However, it is a painting-specific tool that conflicts with specialty-contractor positioning. It will remain as a component in codebase, just not rendered on this page.
- **Footer**: Adding a third link column changes the 11-column grid distribution. Need to rebalance carefully.
- **Contact**: Removing the Quick/Detailed toggle simplifies the page but removes the multi-step form path. The multi-step form (with budget slider, project type selector, file upload) adds complexity without clear conversion value on a Contact page — those belong on Submit RFP. Will keep the simple direct form only.
- **CompanyOverviewHub**: Changes are styling-only. CMS data path and fallbacks fully preserved.




# Phase 5B — Revised Plan with Tightening Notes Applied

## Files to Change (5)

| File | Change Summary |
|---|---|
| `src/pages/PropertyManagers.tsx` | Migrate benefits to `CapabilityCard`, headers to `SectionHeader`, process to `Section`, CTA to `CTABand` |
| `src/pages/CommercialClients.tsx` | Replace `BenefitsSection`/`CTASection`/`@/ui/Card` with design-system equivalents; build real 4-step process; fix SEO truth |
| `src/pages/Homeowners.tsx` | Migrate WhyChooseUs cards to `CapabilityCard`, process cards to `CapabilityCard`, final CTA to `CTABand`; keep `ResidentialServiceCard`, FAQ, animations, residential warmth |
| `src/pages/company/Developers.tsx` | Remove decorative blurs; replace `@/ui/Card`+`@/ui/Button` with design-system; remove hover animations; fix truth claims; replace CTA with `CTABand`; extra truth scan |
| `src/pages/ForGeneralContractors.tsx` | Lightest touch — migrate headers to `SectionHeader`, replace `FeatureCard` with `CapabilityCard`; keep everything else |

---

## Revised CTA Table (per tightening note #1)

| Page | Primary CTA | Route | Secondary CTA | Route |
|---|---|---|---|---|
| PropertyManagers | "Contact Us" | `/contact` | "Request a Proposal" | `/contact` |
| CommercialClients | "Request an Estimate" | `/estimate` | "Contact Us" | `/contact` |
| Homeowners | "Request an Estimate" | `/estimate` | "Contact Us" | `/contact` |
| Developers | "Contact Us" | `/contact` | "Submit an RFP" | `/contact` |
| ForGeneralContractors | *(keep existing contact section as-is)* | — | — | — |

Key changes from original plan:
- **PropertyManagers**: Both CTAs go to `/contact` (not `/estimate`) — property management scopes are consultation-led, not simple estimate requests
- **Developers**: Secondary changed from "Access Contractor Portal" to "Submit an RFP" — developers are clients, not portal users
- **Homeowners**: Changed "Start Your Project" to "Request an Estimate" for system-wide CTA consistency

---

## Homeowners Differentiation (tightening note #2)

The Homeowners page will **remain visually distinct** from commercial pages:
- **Keep** `ResidentialServiceCard` with pricing ranges and timelines
- **Keep** `ScrollReveal` and `StaggerContainer` animations (residential warmth)
- **Keep** FAQ accordion with all 5 questions
- **Keep** `Badge` in intro section
- **Keep** `H2` typography component usage
- **Keep** the residential-specific copy tone throughout
- Only migrate: WhyChooseUs cards → `CapabilityCard`, process step cards → `CapabilityCard`, final CTA → `CTABand`
- The `construction-orange` color tokens in FAQ icons will be changed to `primary` for design-system consistency (minor visual alignment, not structural)

---

## Developers Truth Scan (tightening note #3)

Flagged items to fix:
1. **Line 31**: "15+ years partnering with GTA developers" → "15+ years of combined team experience across GTA commercial projects"
2. **Line 155**: "Full-scope painting and building envelope solutions" → "Painting and building envelope services for new construction"
3. **Line 26**: "15+ years combined team experience with proven execution on large-scale developments" — "proven execution on large-scale" is overclaim for a new company. Fix to: "15+ years of combined team experience in commercial and multi-unit construction"
4. **SEO description line 91**: "15+ years experience and proven delivery on multi-unit residential and commercial builds" → "15+ years combined team experience supporting multi-unit residential and commercial projects"
5. **Hero line 104-105**: "Reliable subcontracting for painting, EIFS, stucco, and building envelope systems on projects of any scale" — "any scale" is overclaim → "on mid-rise and commercial projects"
6. **Line 125**: "Financial strength, technical expertise, and track record you can trust" — "financial strength" and "track record" are overclaims for a new company → "Technical capability and professional standards you can count on"

---

## Commercial Clients 4-Step Process (tightening note #4)

Replace the thin link to `/our-process` with a concrete 4-step section:

1. **Site Review & Scope Definition** — "We visit your facility to assess condition, identify priorities, and define scope around your operational schedule"
2. **Proposal & Scheduling** — "Detailed proposal with phased approach, material specifications, and scheduling options that minimize business disruption"
3. **Coordinated Execution** — "After-hours and weekend work where needed. Daily progress updates and direct communication with your facility manager"
4. **Closeout & Documentation** — "Final walkthrough, deficiency resolution, warranty documentation, and maintenance recommendations"

---

## Exact Changes Per Page

### PropertyManagers.tsx
- Benefits section: replace bespoke gradient-icon `Card variant="interactive"` with `SectionHeader` + `CapabilityCard` grid
- Services with ROI section: replace manual header with `SectionHeader`; keep the `Card variant="elevated"` + `border-l-4` pattern (it's purposeful for ROI display)
- Process section: wrap in `Section` component, replace manual header with `SectionHeader`
- CTA section: replace bespoke `Section` + manual buttons with `CTABand variant="dark"`

### CommercialClients.tsx
- Remove `BenefitsSection` import; replace with `Section` + `SectionHeader` + `CapabilityCard` grid
- Remove `CTASection` import; replace with `CTABand`
- Remove `@/ui/Card` import; replace industries section with `Section` + `SectionHeader` + design-system `Card`
- Replace thin process link with real 4-step process section using `Section` + `SectionHeader` + design-system `Card`
- Fix SEO description: "15+ years experience serving commercial clients" → "15+ years of combined team experience in commercial construction"

### Homeowners.tsx
- WhyChooseUs cards (lines 207-224): replace `Card`/`CardContent` with `CapabilityCard`
- Process steps (lines 277-296): replace `Card`/`CardContent` with `CapabilityCard` (keep step numbers in layout)
- Final CTA (lines 378-413): replace bespoke background-image section with `CTABand variant="dark"`
- FAQ icons: change `text-construction-orange` to `text-primary` (5 instances)
- CTA text: "Start Your Project" → "Request an Estimate" in final CTA and process step 1

### Developers.tsx
- Remove fixed decorative blur backgrounds (lines 95-98)
- Remove `@/ui/Card` and `@/ui/Button` imports; use design-system `Card` and `@/ui/Button` (canonical path)
- Remove all `hover:-translate-y-2`, `group-hover:scale-110`, `group-hover:rotate-6` animations
- Remove `animate-fade-in-up` and `animationDelay` inline styles
- Wrap all sections in `Section` component
- Replace manual headers with `SectionHeader`
- Benefits section: replace with `CapabilityCard` grid
- Services section: use design-system `Card` (keep checklist format)
- Process section: use design-system `Card` (keep step number format)
- Documentation section: use design-system `Card` (keep current layout — it's purposeful)
- Contact CTA: replace bespoke section with `CTABand`
- Apply all 6 truth fixes listed above

### ForGeneralContractors.tsx
- Replace 3 manual `<h2>/<p>` header blocks with `SectionHeader`
- Replace `FeatureCard` import with `CapabilityCard` import
- Replace `FeatureCard` render (6 items) with `CapabilityCard` (map `description` → `description`, drop `stats` if unused)
- Keep: `ProcessStepCard`, pilot projects section, prequalification section, contact section, `CardGrid`

---

## Legacy Removals

| Component | Removed From |
|---|---|
| `BenefitsSection` | CommercialClients |
| `CTASection` | CommercialClients |
| `@/ui/Card` + `@/ui/CardContent` | CommercialClients, Developers |
| `@/ui/Button` | Developers (switch to `@/ui/Button` canonical — same path, just confirming) |
| `FeatureCard` | ForGeneralContractors |
| Bespoke gradient-icon cards | PropertyManagers |
| Decorative blur backgrounds | Developers |
| `construction-orange` color tokens | Homeowners FAQ, FeatureCard (via replacement) |

---

## Intentionally NOT Changed

- `ResidentialServiceCard` — purpose-built, strong
- `ProcessStepCard` — clean, used on GC page
- FAQ accordion — well-structured
- GC pilot projects section — honest, strong
- GC prequalification section — useful
- GC contact section — purpose-built CTA
- PropertyManagers services-with-ROI card pattern (border-l-4) — works well for that context
- Homepage, Services, About — Phase 5A scope
- Routes, navigation, admin — out of scope

---

## Checks

1. TypeScript build passes
2. All 5 pages render without console errors
3. No remaining `BenefitsSection` or `CTASection` imports
4. No remaining `@/ui/Card` imports in modified files
5. No remaining `FeatureCard` imports in modified files
6. All `SectionHeader` instances render correctly
7. All `CapabilityCard` instances render correctly
8. All `CTABand` instances render correctly
9. Decorative blur backgrounds removed from Developers
10. Grep for truth issues: "15+ years partnering", "Full-scope", "proven 6-step", "any scale", "financial strength"
11. CTA text/routes match revised table
12. Homeowners FAQ icons use `text-primary` not `text-construction-orange`


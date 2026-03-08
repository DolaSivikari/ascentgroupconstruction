

# Phase 6 — Implementation Plan

## Files to Create/Change

| File | Action |
|---|---|
| `src/pages/OurProcess.tsx` | Full rewrite — 7-step operational process, remove FAQ, remove blurs |
| `src/components/projects/ProjectCaseStudy.tsx` | Add `scopeDelivered`, `executionApproach`, `constraints`; migrate `@/ui/Card` → design-system |
| `src/pages/ProjectDetail.tsx` | Migrate `@/ui/Card` → design-system; replace bespoke CTA with `CTABand`; add related-services block; pass `scopeDelivered` |
| `src/components/ProjectCard.tsx` | Add optional `client_type` badge and `challenge` one-liner |
| `src/components/proof/OperationalProofBar.tsx` | **New** — configurable proof module |
| `src/components/services/ServicePageTemplate.tsx` | Add conditional related-projects section; add process cross-link; migrate `@/ui/Card` → design-system |
| `src/pages/PropertyManagers.tsx` | Add `OperationalProofBar` before CTA |
| `src/pages/CommercialClients.tsx` | Add `OperationalProofBar` before CTA |
| `src/pages/ForGeneralContractors.tsx` | Add `OperationalProofBar` before contact section |

## Issues Found

1. **OurProcess** — painting-centric 4-step, puffery ("proven process", "Step-by-Step Excellence", "Experience the Ascent Difference"), decorative blur backgrounds, painting-specific FAQ, unused data structures
2. **ProjectCaseStudy** — uses `@/ui/Card` (legacy); missing scope/execution/constraints sections
3. **ProjectDetail** — uses `@/ui/Card` (legacy); bespoke CTA; no related-services cross-link
4. **ProjectCard** — `client_type` not rendered; no challenge display
5. **ServicePageTemplate** — uses `@/ui/Card` (legacy); no related-projects; no process cross-link
6. **No reusable proof module** beyond `ProofStrip`

## Exact Changes

### 1. OurProcess.tsx — Full Rewrite
- Remove all painting-specific content, FAQ, decorative blurs, unused data
- 7-step operational process: Inquiry, Site Assessment, Estimate, Pre-Con, Execution, Closeout, Post-Project Support
- Use `Section`, `SectionHeader`, `CapabilityCard`, `CTABand`, `ProofStrip`
- Keep `AnimatedProcessTimeline` (feed it new 7-step data)
- Keep HowTo schema (update to 7 steps)
- Cross-links: services, GC pathway
- SEO: "How We Work — From Inquiry to Closeout"

### 2. ProjectCaseStudy.tsx
- Migrate `@/ui/Card` → `@/design-system/components/Card`
- Add optional `scopeDelivered`, `executionApproach` (string), `constraints` (string[])
- Each renders only when populated — no empty headings
- `scopeDelivered` between Challenge and Solution; `executionApproach` after Solution; `constraints` as badge list

### 3. ProjectDetail.tsx
- Migrate `@/ui/Card` → `@/design-system/components/Card`
- Replace bespoke CTA (lines 574-601) with `CTABand`
- Pass `scope_of_work` → `scopeDelivered` to `ProjectCaseStudy`
- Add lightweight related-services badges after team credits (from existing `project.services` data, no extra query)

### 4. ProjectCard.tsx
- Add optional `client_type?: string` — render as compact outline badge in metrics row
- Add optional `challenge?: string` — one-line italic text, `line-clamp-1`, above description

### 5. OperationalProofBar.tsx (New)
- Configurable: accepts optional `items` array, `title`, `description`
- Default 6 items: Self-Performed Scopes, WSIB & CGL, Occupied-Building Experience, Schedule Coordination, Documentation & Closeout, Manufacturer Compliance
- Uses `Section` + `SectionHeader` + `CapabilityCard` grid
- Market pages pass page-specific subsets

### 6. ServicePageTemplate.tsx
- Migrate `@/ui/Card` → `@/design-system/components/Card`
- Add conditional related-projects: query `project_services` + `projects` where service matches AND `publish_state='published'`, limit 3, ordered by featured then newest. Hidden when 0 results.
- Add "Learn about our full process →" link in process section footer → `/our-process`
- Replace bespoke final CTA with `CTABand`

### 7. Market Pages
- PropertyManagers: add `OperationalProofBar` with PM subset (Occupied-Building, Documentation, Schedule, WSIB) before CTABand
- CommercialClients: add `OperationalProofBar` with commercial subset (Schedule, Self-Performed, WSIB, Documentation) before CTABand
- ForGeneralContractors: add `OperationalProofBar` with GC subset (Self-Performed, Schedule, Documentation, WSIB) before contact section

## Execution Notes Applied
1. Related-projects capped at 3, lightweight display
2. ProjectCard `challenge` truncated to 1 line via `line-clamp-1`
3. OurProcess SEO/schema continuity: HowTo schema updated to 7 steps, breadcrumbs valid, no painting metadata survives

## Content Dependencies
- Project data population depends on admin entry — structure is ready
- Testimonials not invented — structure supports them
- `project_services` tagging depends on admin data — UI fully gated

## Checks
1. TypeScript build passes
2. OurProcess renders 7 steps, no "proven process" / "exceptional" / "Ascent Difference"
3. No decorative blurs on OurProcess
4. No painting FAQ on OurProcess
5. ProjectCaseStudy hides sections when empty
6. No `@/ui/Card` imports in modified files (except AnimatedProcessTimeline which is untouched)
7. Related-projects hidden when no data
8. OperationalProofBar renders on 3 market pages
9. All cross-links resolve to valid routes
10. No console errors


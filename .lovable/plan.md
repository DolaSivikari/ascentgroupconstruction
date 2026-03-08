

# Phase 5A Implementation Plan — Home, Services, About

## Files to Change (9)

| File | Change |
|---|---|
| `src/components/homepage/TrustBadgeBar.tsx` | Replace bespoke badge layout with `ProofStrip` component |
| `src/components/homepage/WhoWeServeHomepage.tsx` | Replace `ClientSegmentCard` (from unified) with `SegmentCard` from design system |
| `src/components/homepage/WhyChooseUs.tsx` | Keep `useWhyChooseUs()` + fallback. Render via `CapabilityCard`. Fix title to "Why Clients Choose Us" |
| `src/components/homepage/CompanyOverviewHub.tsx` | Keep `useCompanyOverview()` + fallback. Flatten tabs into static 3-column layout. Handle missing sections gracefully |
| `src/components/services/OperationalCapabilities.tsx` | Replace inline icon+text with `CapabilityCard` grid |
| `src/components/services/ServicesClientSegments.tsx` | Replace inline `Card` + `Link` with `SegmentCard` |
| `src/components/services/ServicesTrustBar.tsx` | Replace bespoke trust bar with `ProofStrip` |
| `src/pages/About.tsx` | Remove `WhoWeServeSection`, replace raw CTA with `CTABand` (with Markets bridge link) |
| `src/pages/Index.tsx` | No structural changes — section order stays identical. Just confirm imports still resolve after component internals change |

## Issues in Current Code

1. **TrustBadgeBar** — bespoke 3-item badge row, not using `ProofStrip`
2. **WhoWeServeHomepage** — uses `ClientSegmentCard` from `@/components/unified` (legacy) with `examples` bullet lists and `construction-orange` color tokens instead of `SegmentCard`
3. **WhyChooseUs** — uses `@/ui/Card` (legacy import) and `steel-blue` color token. Title says "Property Owners" (too narrow). CMS logic is correct and preserved
4. **CompanyOverviewHub** — tab UI hides 2/3 of content. `fallbackPromise` line 29 says "15+ years of proven excellence" (puffery). CMS logic is correct and preserved
5. **OperationalCapabilities** — bespoke icon+text list, uses `TYPOGRAPHY_STYLES` for headers instead of `SectionHeader`
6. **ServicesClientSegments** — uses design-system `Card` directly with manual `Link` wrapper and `ArrowRight` icon instead of `SegmentCard`
7. **ServicesTrustBar** — bespoke 5-item trust grid, not using `ProofStrip`
8. **About.tsx** — `WhoWeServeSection` at line 220 generates broken links from title strings (`/${title.toLowerCase().replace(/\s+/g, '-')}`). CTA is raw `Card` + `Button` instead of `CTABand`

## Exact Changes

### 1. `TrustBadgeBar.tsx`
- Remove bespoke badge rendering (icon + label + detail divs)
- Import and render `ProofStrip` with the same 3 items mapped to `{ icon, value, label }` format
- Use `variant="light"` and `columns={3}`

### 2. `WhoWeServeHomepage.tsx`
- Remove import of `ClientSegmentCard` from `@/components/unified` and `SectionBadge`
- Import `SectionHeader` and `SegmentCard` from `@/design-system/components`
- Replace header block with `<SectionHeader badge="Who We Serve" title="..." description="..." align="left" />`
- Replace `ClientSegmentCard` render with `SegmentCard` — drop `examples` prop (not supported), keep `icon`, `title`, `description`, map `link` → `href`, add `badge` where appropriate
- Keep `GRID.cards4` layout

### 3. `WhyChooseUs.tsx`
**CMS path preserved:** `useWhyChooseUs()` hook and 6-item `fallbackDifferentiators` array stay
- Remove import of `Card` from `@/ui/Card`
- Import `CapabilityCard` from `@/design-system/components`
- Import `SectionHeader` from `@/design-system/components`
- Change title: "Why Property Owners Choose Us" → "Why Clients Choose Us"
- Replace `<Card variant="elevated">` rendering with `<CapabilityCard icon={Icon} title={item.title} description={item.desc} stat={item.stats} />`
- Replace header block with `<SectionHeader>` component
- Use `GRID.cards3` for the grid
- Remove `steel-blue` color references (use `primary` via CapabilityCard defaults)
- Keep `isLoading` check

### 4. `CompanyOverviewHub.tsx`
**CMS path preserved:** `useCompanyOverview()` hook and all 3 fallback arrays stay
- Remove `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger` imports
- Remove `useState` for `activeTab`
- Keep `useRef`, `useIntersectionObserver`, `useReducedMotion`, `useCompanyOverview`
- Replace tab UI with a static 3-column grid:
  - Column 1: "Our Approach" — renders `OUR_APPROACH` as checklist items
  - Column 2: "Our Values" — renders `COMPANY_VALUES` as icon+title+description items
  - Column 3: "Our Promise" — renders `OUR_PROMISE` as title+description items
- Each column renders only if its data array has items (graceful empty handling)
- Fix fallbackPromise line 29: "15+ years of proven excellence" → "15+ years of team experience"
- Use `Section` component for consistent spacing
- Use `SectionHeader` for the heading

### 5. `OperationalCapabilities.tsx`
- Remove `TYPOGRAPHY_STYLES` import
- Import `SectionHeader` and `CapabilityCard` from `@/design-system/components`
- Replace manual header with `<SectionHeader badge="How We Work" title="Operational Capability" description="..." align="left" />`
- Replace inline icon+text divs with `<CapabilityCard icon={cap.icon} title={cap.title} description={cap.description} />`
- Keep `Section size="major" className="bg-muted/30"`
- Keep `GRID.cards3` equivalent grid (currently `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

### 6. `ServicesClientSegments.tsx`
- Remove `Card` import from design-system, `ArrowRight` icon, `TYPOGRAPHY_STYLES`
- Import `SectionHeader` and `SegmentCard` from `@/design-system/components`
- Replace manual header with `<SectionHeader badge="Who We Work With" title="Client Segments We Support" description="..." align="left" />`
- Replace `<Link><Card>...</Card></Link>` with `<SegmentCard icon={seg.icon} title={seg.title} description={seg.description} href={seg.link} />`
- Keep `Section size="major"` and 3-column grid

### 7. `ServicesTrustBar.tsx`
- Remove bespoke grid rendering
- Import `ProofStrip` from `@/design-system/components`
- Map `TRUST_ITEMS` to ProofStrip format: `{ icon, value: item.label, label: item.detail }`
- Render `<ProofStrip items={...} variant="dark" columns={4} />` (5 items don't map to ProofStrip's 2/3/4 column options — use a custom className or render as a 3+2 split. Actually, looking at ProofStrip it uses CSS grid so 5 items in a 4-col grid will wrap. Better to pick the 4 strongest items or keep all 5 with `columns={4}` and let the 5th wrap)
- **Decision:** Keep all 5 items. ProofStrip uses `grid-cols-2 md:grid-cols-4` which will wrap the 5th item cleanly on desktop. This is acceptable.
- Wrap in `Section size="subsection"`

### 8. `About.tsx`
- Remove `WhoWeServeCard`, `WhoWeServeSection` imports from `@/components/unified`
- Remove `clientTypes` array (lines 112-137)
- Remove `WhoWeServeSection` render block (lines 220-236)
- Import `CTABand` from `@/design-system/components`
- Replace the raw CTA section (lines 292-312) with:
```
<CTABand
  title="Ready to Discuss Your Project?"
  description="Whether you need trade pricing for an active tender or want to discuss a restoration project, we're here to help."
  primaryCta={{ text: "Contact Us", href: "/contact" }}
  secondaryCta={{ text: "Explore Our Markets", href: "/markets" }}
  variant="dark"
/>
```
- The secondary CTA "Explore Our Markets" provides the bridge from About → Markets (tightening note #3)
- Remove unused imports: `Button`, `CTA_TEXT`, `Building2`, `Factory`, `FileText`, `Home` (only keep icons still used)

### 9. `Index.tsx`
- No changes needed. All imports remain valid since the component filenames and export names are unchanged. Section order is preserved exactly as-is.

## CMS Data Paths Preserved

| Hook | File | Status |
|---|---|---|
| `useWhyChooseUs()` | `WhyChooseUs.tsx` | **Kept** — DB read + 6-item fallback, rendering migrated to `CapabilityCard` |
| `useCompanyOverview()` | `CompanyOverviewHub.tsx` | **Kept** — DB read for sections/items + 3 fallback arrays, rendering flattened from tabs to columns |

## Content Fixes

1. WhyChooseUs title: "Why Property Owners Choose Us" → "Why Clients Choose Us"
2. CompanyOverviewHub fallbackPromise: "15+ years of proven excellence" → "15+ years of team experience"

## Intentionally NOT Changed

- `EnhancedHero` — stable, complex
- `HomepageServiceHighlights` — already uses design-system Card
- `HomepageFeaturedProjects` — already clean, Supabase-driven
- `HomepageFinalCta` — already clean
- `ServicePillarsGrid` — already uses SectionHeader + Card
- `ServicesProcessSnapshot` — already clean
- `ServicesFeaturedWork` — already clean
- `ServicesCtaSection` — 3-path CTA layout that CTABand cannot replicate (max 2 buttons)
- All 5 market segment pages — deferred to Phase 5B
- `Index.tsx` — no structural changes, section order preserved

## Checks

1. TypeScript build passes
2. Homepage renders all 8 sections in correct order
3. Services renders with migrated components
4. About renders without WhoWeServe, with CTABand including Markets bridge
5. `useWhyChooseUs()` still called and fallback works
6. `useCompanyOverview()` still called and fallback works
7. No console errors
8. WhyChooseUs title reads "Why Clients Choose Us"
9. Grep: no remaining `@/ui/Card` imports in modified files
10. CompanyOverviewHub renders all 3 columns when data exists, gracefully handles missing sections

## Manual Verification Needed

- Visual consistency of flattened CompanyOverviewHub (was tab-based, now columnar)
- Mobile responsiveness of CapabilityCard grids
- Whether the About → Markets bridge via CTABand secondary CTA is sufficient navigation




## Card System Compliance Audit & Enforcement

I audited every card component against your established standards (memory: `design-system-foundation`, `editorial-enterprise-design-standards`, `project-card-resilience-fixes`). Several violations exist that cause uneven heights and visual inconsistency.

### The rules (from your own memory)

1. **Single canonical Card source** — `@/design-system/components/Card` only. The competing `src/ui/Card.tsx` and `src/components/shared/UnifiedCard.tsx` should be retired.
2. **Four canonical card families**: `CapabilityCard`, `ProjectCard`, `ProofCard`, `SegmentCard`. Legacy `UnifiedCard`, `FeatureCard`, `BenefitCard`, `ClientSegmentCard`, `WhoWeServeCard` are deprecated.
3. **`primary` theme token only** — never hardcoded `construction-orange` in card UI.
4. **Equal heights in grids** — every card must have `h-full` and its parent grid item must stretch.
5. **Editorial flat style** — no backdrop-blur, no gradient overlays, 8px radius, restrained accents.

### Violations found

| Component | Violation |
|---|---|
| `src/ui/Card.tsx` | Duplicate Card source (parallel to canonical) — used by `ServiceCardTier1/2/3`, `ProjectFeaturedCard` |
| `src/components/shared/UnifiedCard.tsx` | Retired pattern still alive |
| `src/components/unified/FeatureCard.tsx` | Uses `text-construction-orange` (line 28); deprecated by `CapabilityCard` |
| `src/components/unified/BenefitCard.tsx` | Uses `text-construction-orange` (line 16); inconsistent `p-0` content padding causes height mismatch |
| `src/components/unified/ClientSegmentCard.tsx` | Deprecated by `SegmentCard`; varying content lengths produce uneven heights despite `h-full` because no `flex-grow` on description |
| `src/components/unified/WhoWeServeCard.tsx` | Deprecated by `SegmentCard`; two variants with different paddings/structures |
| `src/components/homeowners/ResidentialServiceCard.tsx` | Hardcoded `construction-orange` everywhere (lines 31-33, 49); uses gradient overlay (banned) |
| `src/components/services/ServiceCardTier1/2/3.tsx` | Use `@/ui/Card` (wrong source); Tier1 uses `border-2`, Tier2/3 don't → uneven borders in shared grids |
| `src/components/services/ServiceCard.tsx` | Uses `bg-steel-blue` instead of `primary`; mixes `p-0` outer + `p-8` inner unnecessarily |
| `src/components/blog/BlogCard.tsx` | `p-0` outer + `p-8` inner anti-pattern; `border-2` makes it taller than other cards in mixed grids |
| Grid usage in pages | Several places (`Capabilities.tsx`, `ServiceAreas.tsx`) use raw `<div>` inside `Card` with custom padding instead of canonical sizing |

### Root cause of uneven heights

Three things compound:
1. Cards from `@/ui/Card` have different default padding/border than `@/design-system/components/Card`. When mixed in a grid, heights diverge.
2. Some cards apply `p-0` outer + `p-8` inner; others apply `size="md"` (which is `p-6`). 24px vs 32px content padding → cards differ by 16px in fixed-content areas.
3. Cards without `flex flex-col h-full` on the inner content can't stretch when description length varies.

### Plan — enforce compliance in 4 steps

**Step 1 — Standardize the canonical Card** (`src/design-system/components/Card.tsx`)
- Confirm `h-full` opt-in works correctly (it does via `hover` prop wrapper).
- Add a `stretchContent` behavior: when the card holds a column of content with a CTA at bottom, ensure `flex flex-col h-full` is applied to inner.

**Step 2 — Migrate the 3 ServiceCardTier components to canonical**
- Switch `import { Card } from "@/ui/Card"` → `from "@/design-system/components/Card"`.
- Standardize all 3 tiers to `variant="interactive" size="md" h-full`. Remove `border-2` from Tier1 (use shadow elevation instead — matches your "flat editorial" rule).
- Remove `bg-accent/10` and use `bg-primary/10` for icon containers.

**Step 3 — Retire legacy card files (delete + redirect imports)**
- Delete: `src/components/shared/UnifiedCard.tsx`, `src/components/unified/FeatureCard.tsx`, `src/components/unified/BenefitCard.tsx`, `src/components/unified/ClientSegmentCard.tsx`, `src/components/unified/WhoWeServeCard.tsx`, `src/components/homeowners/ResidentialServiceCard.tsx`, `src/ui/Card.tsx`.
- Update `src/components/unified/index.ts` and any imports to point to the canonical `CapabilityCard` / `SegmentCard` / `ProofCard`.
- Files needing import updates (~10): `ClientSelector.tsx`, `WhoWeServeHomepage.tsx`, `ClientValueProposition.tsx`, `Homeowners.tsx`, `ProjectFeaturedCard.tsx`, the 3 ServiceCardTier files, plus any page using `ResidentialServiceCard`.

**Step 4 — Fix outliers**
- `ServiceCard.tsx` (services): replace `bg-steel-blue` icon bg with `bg-primary/10` + `text-primary`. Remove `p-0` outer, use canonical `size="md"`. Keep `flex flex-col h-full` for stretch.
- `BlogCard.tsx`: same — drop `p-0`/`p-8`/`border-2`, use canonical `size="md"`.
- `ProjectCard.tsx`: verify already compliant (it is — uses canonical Card + `size="sm"`).
- Sweep remaining `text-construction-orange` / `bg-construction-orange` inside cards → `primary` token. (Leaves `ValuePillars` and `PrequalPackage` homepage sections alone — those are intentional branded gradients, not cards in a uniform grid.)

### Files touched (~15)

**Edit:**
- `src/components/services/ServiceCard.tsx`
- `src/components/services/ServiceCardTier1.tsx`
- `src/components/services/ServiceCardTier2.tsx`
- `src/components/services/ServiceCardTier3.tsx`
- `src/components/blog/BlogCard.tsx`
- `src/components/ProjectFeaturedCard.tsx` (switch Card import)
- `src/components/unified/index.ts` (re-export canonical instead of legacy)
- `src/pages/Homeowners.tsx` (swap `ResidentialServiceCard` → `CapabilityCard`)
- `src/components/homepage/ClientSelector.tsx` (swap `WhoWeServeCard` → `SegmentCard`)
- `src/components/homepage/WhoWeServeHomepage.tsx` (swap `ClientSegmentCard` → `SegmentCard`)
- `src/components/homepage/ClientValueProposition.tsx` (swap `WhoWeServeCard` → `SegmentCard`)

**Delete (7):**
- `src/ui/Card.tsx`
- `src/components/shared/UnifiedCard.tsx`
- `src/components/unified/FeatureCard.tsx`
- `src/components/unified/BenefitCard.tsx`
- `src/components/unified/ClientSegmentCard.tsx`
- `src/components/unified/WhoWeServeCard.tsx`
- `src/components/homeowners/ResidentialServiceCard.tsx`

### Out of scope

- Non-card "branded panel" sections that intentionally use gradients (`ValuePillars`, `PrequalPackage` hero panels) — these aren't grid cards and are intentionally distinct.
- Admin panel cards — different design system, stays utilitarian.
- The `tailwind.config.ts` `construction-orange` token stays defined (used by SVGs and badges) — we just stop using it inside cards.

### Risk & mitigation

- All deleted files are replaced by canonical equivalents with the same visual intent. Imports are swapped, not orphaned.
- TypeScript will surface any missed import after deletion — caught at build time.
- After this, every card in the same grid will share identical padding (`p-6`), border-radius (8px), shadow scale, and stretch behavior → uniform heights guaranteed.


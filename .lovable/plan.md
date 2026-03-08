

# Phase 3 — Design System Foundation (Revised with Compatibility Notes)

## Compatibility Analysis

### 1. Card Prop Compatibility

Three distinct card APIs currently exist:

| Source | Props | Variants | Key Differences |
|---|---|---|---|
| `@/ui/Card` | `variant` (CVA), `className`, `ref`, all HTML div props | default, elevated, interactive, featured, glass, flat | No `size`, no `hover`, no `children` type constraint. CardContent has `p-6 pt-0`. |
| `@/components/ui/card` | Identical to `@/ui/Card` | Identical | Exact duplicate file. |
| `@/design-system/components/Card` | `variant`, `size`, `hover`, `className`, `ref`, `children` (required) | default, elevated, interactive, ghost, outline | Has `size` (sm/md/lg with built-in padding). CardContent has NO padding. CardFooter has `border-t`. Different variant names (no `featured`/`glass`/`flat`; has `ghost`/`outline`). |
| `UnifiedCard` | `variant`, `className`, `onClick`, `children` | base, elevated, interactive | No ref. No sub-components. Always applies `p-6`. |

**Critical incompatibility:** The two systems have different variant sets AND different sub-component defaults (CardContent padding, CardFooter border). A raw re-export from design-system Card would break the 84 files importing `@/ui/Card` because:
- Missing variants: `featured`, `glass`, `flat` would become undefined
- CardContent loses its `p-6 pt-0` default padding
- CardFooter gains unexpected `border-t`

**Resolution:** The re-export bridge files (`@/ui/Card`, `@/components/ui/card`) must keep their own implementations for now. They are already identical and stable. The canonical design-system Card is used by the 24 newer files and the new card families. Unification of the old ShadCN-style Card into the design-system Card is a **migration task for a later phase**, not a bridge task.

### 2. UnifiedCard Retirement — File-by-File Safety Check

All 9 files use UnifiedCard as a simple styled div wrapper. Usage pattern is always: `<UnifiedCard variant="elevated|base|interactive" className="...">` with children being raw JSX (icons, headings, paragraphs). No unique layout behavior, no icon slots, no badge logic.

| File | Usage | Safe to replace with `Card`? |
|---|---|---|
| `BuildingEnvelope.tsx` | 3 usages: elevated (x2), base (x1), all with `className="p-6"` | Yes — `Card variant="elevated" size="md"` |
| `TileFlooring.tsx` | elevated, no extra padding class | Yes — `Card variant="elevated"` (default md padding) |
| `SustainableBuilding.tsx` | elevated | Yes |
| `PaintingServices.tsx` | elevated | Yes |
| `InteriorBuildouts.tsx` | elevated | Yes |
| `ProtectiveCoatings.tsx` | elevated | Yes |
| `CladdingSystems.tsx` | elevated | Yes |
| `PropertyManagers.tsx` | interactive | Yes — `Card variant="interactive"` |
| `Estimate.tsx` | base | Yes — `Card variant="default"` |

All 9 are straight replacements. UnifiedCard's `base` maps to Card's `default`, `elevated` maps directly, `interactive` maps directly. The `p-6` that UnifiedCard always applies is equivalent to Card's default `size="md"`.

### 3. Section Compatibility

| Source | Props |
|---|---|
| `@/ui/Section` | `children`, `className` only |
| `@/components/sections/Section` | `children`, `size`, `maxWidth`, `className`, `disableAnimation`, `animationDirection`, `animationDelay` |

`@/ui/Section` is a strict subset — it only takes `children` and `className`. A re-export from `@/components/sections/Section` is **safe** because the extra props all have defaults. Existing callers passing only `children` and `className` will work identically.

However, `@/ui/Section` is currently imported by **zero files** (confirmed via grep). So the re-export is a no-op safety measure — low risk, low impact.

---

## Revised Plan

### Files to Create (7)

| File | Purpose |
|---|---|
| `src/design-system/components/CapabilityCard.tsx` | Replaces FeatureCard + BenefitCard — icon, title, description, optional stats |
| `src/design-system/components/ProofCard.tsx` | Stat/trust signal card — value, label, icon |
| `src/design-system/components/SegmentCard.tsx` | Client segment card — icon, title, description, link, optional benefits |
| `src/design-system/components/CTABand.tsx` | Standardized CTA section — title, description, primary/secondary CTA, dark/light variant |
| `src/design-system/components/SectionHeader.tsx` | Section heading pattern — badge, title, description, align |
| `src/design-system/components/ProofStrip.tsx` | Horizontal stat bar — items array, variant |
| `src/design-system/components/index.ts` | Central export barrel |

### Files to Modify (14)

| File | Change |
|---|---|
| `src/ui/Section.tsx` | Re-export from `@/components/sections/Section` (safe — zero current imports, subset props) |
| `src/design-system/tokens.ts` | Add GRID definitions from layouts.ts |
| `src/design-system/constants.ts` | Remove duplicated SPACING, HOVER_STATES, ANIMATIONS (keep LAYOUT, CTA_TEXT, BRAND, CARD_STYLES) |
| `src/design-system/layouts.ts` | Convert to re-export from tokens.ts for backward compat |
| `src/components/unified/index.ts` | Add new card family exports |
| `src/pages/services/BuildingEnvelope.tsx` | Replace UnifiedCard → Card |
| `src/pages/services/TileFlooring.tsx` | Replace UnifiedCard → Card |
| `src/pages/services/SustainableBuilding.tsx` | Replace UnifiedCard → Card |
| `src/pages/services/PaintingServices.tsx` | Replace UnifiedCard → Card |
| `src/pages/services/InteriorBuildouts.tsx` | Replace UnifiedCard → Card |
| `src/pages/services/ProtectiveCoatings.tsx` | Replace UnifiedCard → Card |
| `src/pages/services/CladdingSystems.tsx` | Replace UnifiedCard → Card |
| `src/pages/PropertyManagers.tsx` | Replace UnifiedCard → Card |
| `src/pages/Estimate.tsx` | Replace UnifiedCard → Card |

### Light Validation (2 files)

| File | Change |
|---|---|
| `src/pages/Services.tsx` | Use SectionHeader in one section heading |
| `src/pages/About.tsx` | Use SectionHeader + ProofStrip in one section |

### NOT Changed (Intentional)

- `src/ui/Card.tsx` — **NOT re-exported.** Kept as-is because prop/variant incompatibility with design-system Card would break 84 consumers. Migration to unified Card is a separate future phase.
- `src/components/ui/card.tsx` — Same reason. Kept as-is.
- All 84 files importing from `@/ui/Card` — untouched.
- All 24 files importing from `@/design-system/components/Card` — untouched (already canonical).
- Homepage, admin pages, service detail content, routes — out of scope.
- `tokens.css` — already correct, no changes.
- `ProjectCard` — stable, not consolidated this phase.

### Checks

1. TypeScript build passes
2. All 9 UnifiedCard replacement pages render correctly
3. Services and About validation pages render with new components
4. No console errors
5. Grep for remaining `UnifiedCard` imports (should be zero after migration)
6. Verify `@/ui/Card` consumers still work (no changes to that file)


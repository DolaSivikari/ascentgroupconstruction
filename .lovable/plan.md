

# Answers to All Three Questions

---

## Phase 2: Clarifications

### 1. `500+` Placeholder Cleanup

**Status: One remaining instance — admin-only, not public-facing.**

The text `500+` appears only as an `<input placeholder>` in `src/pages/admin/HeroSlidesManager.tsx` line 382. This is ghost text inside an empty form field that an admin sees when editing hero slides. It is never rendered to public visitors. The companion placeholder on line 392 says `"Projects Completed"`.

**Recommendation:** Fix it now — change placeholder from `"500+"` to `"10+"` to match the truth-hardened stat scale. Low risk, prevents an admin from being nudged toward an inflated number.

### 2. Final File Accounting

The approved plan listed 20 files. The implementation changed 22 files. The 2 extras:

| Extra File | Why |
|---|---|
| `src/data/service-faqs-enriched.ts` | Contained "95% on-time," "24/7," "hundreds of," and "100+ envelope failures" claims — all within Phase 2 scope. Caught during implementation grep. |
| `src/utils/personalization.ts` | Contained "24/7 Emergency Service Available" — within Phase 2 scope. Caught during implementation grep. |

Both are legitimate Phase 2 scope additions found during implementation checks. No files were changed outside of scope.

### Phase 2 Remaining Cleanup
- Fix `HeroSlidesManager.tsx` placeholder `"500+"` → `"10+"`
- Everything else is clean: zero `"hundreds of"`, zero `"24/7"`, zero `"LEED consulting"`, `PartnerCaseStudies` removed from public rendering, `SustainableBuilding.tsx` fully rewritten, `About.tsx` fixed.

**Phase 2 merge readiness: READY** (with the one placeholder fix as a minor follow-up).

---

## Phase 3: Confirmations

### 1. New Component Usage Status

| Component | Status | Where Used |
|---|---|---|
| `CapabilityCard` | **Foundation-only** — not yet wired into any page | Defined in `src/design-system/components/CapabilityCard.tsx`, exported from index |
| `ProofCard` | **Foundation-only** — not yet wired into any page | Defined in `src/design-system/components/ProofCard.tsx`, exported from index |
| `SegmentCard` | **Foundation-only** — not yet wired into any page | Defined in `src/design-system/components/SegmentCard.tsx`, exported from index. Note: `ClientSegmentCard` (the old pattern) is still used in `WhoWeServeHomepage.tsx` — migration deferred. |
| `CTABand` | **Foundation-only** — not yet wired into any page | Defined in `src/design-system/components/CTABand.tsx`, exported from index |
| `SectionHeader` | **Live** — used on 2 pages | `ServicePillarsGrid.tsx` (Services page) and `About.tsx` (2 sections) |
| `ProofStrip` | **Live** — used on 1 page | `About.tsx` (credentials strip) |

**Summary:** 4 of 6 new components are foundation-only (available but not yet consumed by pages). 2 (`SectionHeader`, `ProofStrip`) are live and validated. This matches the plan — light validation on Services and About only.

### 2. Section Compatibility Confirmation

- `src/ui/Section.tsx` was converted to a re-export of `@/components/sections/Section`
- **Zero files** import from `@/ui/Section` (confirmed by grep) — no consumers to break
- The canonical `Section` accepts a superset of props (`size`, `maxWidth`, `disableAnimation`, etc.) with defaults, so the subset interface is fully compatible
- **No adapter wrapper was needed**
- **No regressions** — build passes, no console errors related to Section

### Deferred from Full Design-System Convergence

- `@/ui/Card` and `@/components/ui/card` remain as separate implementations (84 consumers, variant incompatibility). Card unification is a future migration phase.
- `ClientSegmentCard` (old pattern) still used in `WhoWeServeHomepage.tsx` — to be migrated to `SegmentCard` when pages are refactored.
- `FeatureCard`, `BenefitCard` (old patterns) still exist in `@/components/unified/` — to be retired when pages adopt `CapabilityCard`.
- `ProjectCard` left as-is (stable, no consolidation needed yet).

**Phase 3 merge readiness: READY.**


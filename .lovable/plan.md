

# Pre-Phase 4 Correction Pass

## 3 Surgical Fixes

### Fix 1: Condo & Multi-Unit pillar mismatch
**File:** `src/data/service-pillars.ts` (lines 55-61)

The pillar currently routes to `/services/painting-services`, which is misleading — a user clicking "Condo & Multi-Unit Work" expects coordinated multi-trade work, not just painting.

**Best option:** Route to `/services/interior-buildouts` instead. That page covers drywall, framing, millwork, and finish carpentry for commercial and multi-unit spaces — a much stronger match for "coordinated trade packages for occupied condominiums." Also tighten the description to align with interior buildout scopes rather than implying full-building coordination.

Change:
- `route`: `/services/painting-services` → `/services/interior-buildouts`
- `description`: "Coordinated trade packages for occupied condominiums, apartment buildings, and multi-unit residential properties." → "Interior finishing and turnover packages for occupied condominiums, apartment buildings, and multi-unit residential properties."
- `scopes[0]`: "Occupied-unit painting programs" → "Suite turnover finishing"

This is truthful — interior buildouts is the closest real page, and the revised description matches what that page delivers.

### Fix 2: Verify Developers link
**Result:** `/company/developers` exists. Route is in `AppRoutes.tsx` (line 208), component is `src/pages/company/Developers.tsx`, it's in the sitemap, navigation, and registry. **No change needed.**

### Fix 3: Soften oversized-GC wording
**File:** `src/components/homepage/CompanyOverviewHub.tsx` (line 68)

Change:
- `"Your Complete Construction Partner Across Ontario"` → `"Your Envelope, Restoration & Interior Trades Partner Across Ontario"`

Also soften the support copy on line 71-72 slightly to stay consistent — current copy already says "envelope systems to specialty restoration" which is fine, but the phrase "comprehensive solutions" can be tightened to "focused trade execution."

### Files to change
| File | Change |
|---|---|
| `src/data/service-pillars.ts` | Fix pillar 7 route + description + first scope |
| `src/components/homepage/CompanyOverviewHub.tsx` | Soften H2 and one phrase in support copy |

### Not changing in this pass
- Orphaned `ServicesExplorer` / `PrequalPackage` cleanup (low priority)
- Generic `WhyChooseUs` fallback wording (low priority)
- DB-dependent route guards for masonry/renovations (medium, but stable records)
- `DirectAnswer.tsx` "complete construction partner" reference (SEO component, lower visibility, can be addressed later)
- `GeneralSettingsTab.tsx` placeholder text (admin-only, not public)

### Checks
1. Build passes with no errors
2. Homepage renders correctly with new H2
3. `/services` page pillar grid still renders 8 cards
4. Condo pillar card now links to `/services/interior-buildouts`
5. No other files reference the old condo→painting-services mapping (the shared data file is the single source of truth)


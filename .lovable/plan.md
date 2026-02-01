

# Service Names Review & SEO Alignment Plan

## Problem Summary
After analyzing your services database, I found several naming issues that hurt discoverability and confuse potential clients:

| Current Name | Problem | Client Search Terms |
|-------------|---------|---------------------|
| **Architectural Coatings** | Technical jargon; clients search for "painting" | "painting contractor", "commercial painting" |
| **Interior Buildouts & Finishing** | Vague; could mean many things | "tenant improvements", "commercial renovations" |
| **Interior Finishing & Renovations** | Overlaps with above; redundant | Same as above |
| **Sealant Replacement Programs** | Program vs. Service confusion | "caulking replacement", "joint sealant repair" |
| **EIFS & Stucco Systems** | Technical acronym; homeowners don't know "EIFS" | "stucco repair", "synthetic stucco" |
| **Façade Remediation** | Technical term | "building facade repair", "exterior restoration" |

## Recommended Name Changes

### High Priority (Immediate Impact)

| Current Name | Recommended Name | Reason |
|-------------|------------------|--------|
| Architectural Coatings | **Painting Services** | Matches slug, SEO keywords, and client searches |
| Interior Buildouts & Finishing | **Tenant Improvements** | Industry-standard term for commercial interior work |
| Sealant Replacement Programs | **Caulking & Sealant Services** | Clearer action-oriented name |

### Medium Priority (Consider Updating)

| Current Name | Recommended Name | Reason |
|-------------|------------------|--------|
| EIFS & Stucco Systems | **Stucco & EIFS Repair** | Lead with common term, include technical for pros |
| Façade Remediation | **Exterior Facade Repair** | More accessible while keeping technical accuracy |

### Keep As-Is (Good Names)
- Building Envelope Solutions ✓
- Cladding Systems ✓
- Masonry Restoration ✓
- Waterproofing Systems ✓
- Tile & Flooring ✓
- Parking Garage Restoration ✓

## Implementation Details

### Database Updates Required
I'll update the `services` table to change:

```text
1. "Architectural Coatings" → "Painting Services"
2. "Interior Buildouts & Finishing" → "Tenant Improvements"  
3. "Interior Finishing & Renovations" → "Interior Renovations" (simplified)
4. "Sealant Replacement Programs" → "Caulking & Sealant Services"
5. "EIFS & Stucco Systems" → "Stucco & EIFS Repair"
```

### Category Cleanup
Current categories are inconsistent. I recommend simplifying to:

| Current Categories | Proposed Categories |
|-------------------|---------------------|
| Commercial Envelope | **Building Envelope** |
| Residential Services | **Interior Construction** |
| Restoration Services | **Restoration & Repair** |
| Interior Construction (archived) | Merge into Interior Construction |
| Specialized Services | Merge into appropriate category |

### What Won't Change
- Slugs remain the same (no broken links)
- Page content remains the same
- SEO meta tags already optimized
- Navigation structure unchanged

## Duplicate Service Concern
I noticed potential overlap between:
- "Interior Buildouts & Finishing" (published)
- "Interior Finishing & Renovations" (published)

Both seem to cover similar scopes. Consider consolidating into one comprehensive service or differentiating clearly:
- **Option A**: Merge into "Interior Construction" (comprehensive)
- **Option B**: Split clearly - "Commercial Tenant Improvements" + "Residential Renovations"

## Technical Implementation

1. **Update service names via SQL migration**
   - Change `name` field for 5 services
   - Optionally update `category` field for consistency

2. **Verify navigation renders correctly**
   - `DynamicServicesMegaMenu.tsx` pulls names from database
   - No code changes needed

3. **Update SEO keywords table**
   - Align target pages with new service names

## Files Affected
- **Database only** - No code file changes required
- Navigation automatically reflects database names
- Service pages use `ServicePageLayout` with hardcoded titles (already SEO-optimized)

## Questions Before Proceeding

1. **Painting Services**: Confirm you want "Architectural Coatings" renamed to "Painting Services"?

2. **Duplicate Services**: How should I handle "Interior Buildouts & Finishing" vs "Interior Finishing & Renovations"?
   - Merge into one service?
   - Keep both with clearer differentiation?
   - Archive one?

3. **Category Simplification**: Should I also update categories for cleaner organization?




# Enhance /for-architects with Building Science Content

## Current State
The page has good structure but is generic — it lists material systems and collaboration process without the technical depth that architects and building science consultants expect. It needs to speak their language: hygrothermal performance, air barrier continuity, dew point analysis, vapor drive, thermal bridging, etc.

## Proposed Changes

**File: `src/pages/ForArchitects.tsx`** — single file, content-heavy update

### 1. Upgrade Material Systems with Building Science Detail
Rewrite the `materialSystems` array descriptions to include technical terminology architects care about:
- **EIFS & Stucco**: Add drainage cavity EIFS vs barrier EIFS, continuous insulation R-values, ASHRAE 90.1 compliance, moisture management
- **Masonry & Stone**: Add freeze-thaw cycle resistance, vapor permeability, CSA A179 mortar spec matching
- **Cladding & Rainscreen**: Add pressure-equalized rainscreen principles, thermal break fasteners, ventilated cavity design
- **Protective Coatings**: Add permeance ratings (perms), elastomeric elongation specs, carbonation depth testing
- **Waterproofing**: Add hydrostatic vs non-hydrostatic applications, ASTM testing standards, vapor retarder class distinctions
- **Interior Finishing**: Add STC/IIC acoustic ratings, fire-rated assemblies, Level 5 finish specs

### 2. Add New Section: "Building Science We Understand"
A dedicated section (after Material Systems) with 4 cards covering the core building science principles relevant to their specs:
- **Hygrothermal Analysis**: Vapor drive, dew point location, condensation risk in wall assemblies
- **Air Barrier Continuity**: Whole-building air tightness, transition details at interfaces, blower door testing coordination
- **Thermal Bridging**: Effective R-value vs nominal, cladding attachment thermal breaks, shelf angle details
- **Moisture Management**: Drainage plane continuity, flashing integration, weep systems, capillary breaks

### 3. Add New Section: "Standards & Specifications We Work To"
A compact reference section showing the codes/standards architects care about:
- OBC SB-10 (Energy), OBC SB-12
- ASHRAE 90.1, ASHRAE 62.1
- CSA A371 (Masonry), CSA A23.1 (Concrete)
- ASTM C1363 (Thermal), ASTM E2178 (Air leakage)
- CCMC evaluations for EIFS
- ABAA (Air Barrier Association) certified details

### 4. Expand Collaboration Process Descriptions
Add building-science-specific detail to the 4-step process:
- Step 1: Add constructability review for thermal/moisture continuity
- Step 2: Add WUFI analysis coordination, thermal modeling support
- Step 3: Add field air/water testing per ASTM E1105, AAMA 501
- Step 4: Add commissioning support, thermographic scanning documentation

### 5. Update SEO Keywords
Add building science keywords: "building science contractor Ontario", "air barrier installer GTA", "hygrothermal performance contractor", "ASHRAE 90.1 compliant envelope"

## Summary
- One file changed: `src/pages/ForArchitects.tsx`
- Existing sections enhanced with technical depth
- Two new sections added (Building Science + Standards)
- No new components needed — uses existing `CapabilityCard`, `Card`, `SectionHeader`, `Section`


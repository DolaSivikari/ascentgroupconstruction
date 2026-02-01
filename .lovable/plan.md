

# Fix: Show All Services in Project Admin Multi-Select

## Problem Summary
The "Services Provided" dropdown when adding/editing projects only shows **published** services (12 out of 20). Archived and draft services (8 total) are hidden, which prevents you from properly tagging projects with the full range of services offered.

## Solution
Modify the `ServiceMultiSelect` component to show **all services** in the admin context, while visually indicating their publish state.

## Implementation Details

### Changes to `src/components/admin/ServiceMultiSelect.tsx`

1. **Remove the `publish_state = 'published'` filter** when fetching services
   - Currently: `.eq('publish_state', 'published')`
   - Change to: Fetch all services

2. **Add visual indicators for service status**
   - Published services: Normal display
   - Draft services: Show "(Draft)" badge in muted color
   - Archived services: Show "(Archived)" badge in muted color

3. **Optionally add a toggle** to show/hide archived services
   - Default: Show all services
   - Toggle: "Hide archived services" checkbox

### Updated Query
```typescript
const { data, error } = await supabase
  .from('services')
  .select('id, name, category, publish_state')
  .order('category')
  .order('name');
```

### Visual Changes
- Add `publish_state` to the Service interface
- Display a small badge next to non-published services:
  - Draft: `<Badge variant="outline" className="text-xs">Draft</Badge>`
  - Archived: `<Badge variant="secondary" className="text-xs text-muted-foreground">Archived</Badge>`

## Result After Fix
You'll see all 20 services organized by category:

**Commercial Envelope (5)**
- Building Envelope Solutions
- Cladding Systems
- EIFS & Stucco Systems
- Masonry Restoration
- Waterproofing Systems

**Interior Construction (6)** *(currently hidden)*
- Basement Finishing (Archived)
- Carpentry & Trim Work (Archived)
- Drywall & Finishing (Archived)
- General Repairs & Maintenance (Archived)
- Kitchen & Bathroom Renovations (Archived)
- Suite Renovations (Archived)

**Residential Services (4)**
- Architectural Coatings
- Interior Buildouts & Finishing
- Interior Finishing & Renovations
- Tile & Flooring

**Restoration Services (3)**
- Façade Remediation
- Parking Garage Restoration
- Sealant Replacement Programs

**Specialized Services (2)** *(currently hidden)*
- Protective & Architectural Coatings (Archived)
- Sustainable Building (Draft)

## Technical Notes
- This change only affects the admin project editor
- The public-facing service navigation (`DynamicServicesMegaMenu.tsx`) will still only show published services
- Existing project-service relationships will be preserved


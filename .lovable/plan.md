
# Phase 8 — Critical Truth, Cleanup, and Indexing

## Objective
Remove the few remaining items that can actively undermine trust, fix indexing gaps, and neutralize inflated DB defaults. This phase incorporates strict delete-vs-redirect safety rules and ensures complete data schema updates.

## Files to Change (10)

| File | Action |
|---|---|
| `src/routes/AppRoutes.tsx` | Replace `EquipmentResources` route with redirect to `/company/technology` |
| `src/components/Navigation.tsx` | Replace `/company/equipment-resources` with `/company/technology` in prefetch list |
| `src/data/navigation-structure-enhanced.ts` | Replace `/company/equipment-resources` link and label with "Technology & Innovation" |
| `src/data/navigation-icons.ts` | Replace `/company/equipment-resources` key with `/company/technology` |
| `src/routes/registry.ts` | Remove `/company/equipment-resources` from known routes |
| `public/sitemap.xml` | Replace `/company/equipment-resources` with `/company/technology` |
| `supabase/functions/generate-sitemap/index.ts` | Add `/company/technology`; remove `/company/equipment-resources` |
| `src/pages/company/EquipmentResources.tsx` | **Delete** (only after confirming no remaining imports) |
| `src/data/specialty-contractor-comparison.ts` | Clear fabricated testimonials array |
| `src/pages/WhySpecialtyContractor.tsx` | Wrap entire testimonials Section in conditional to hide it completely when array is empty |
| `src/components/partners/PartnerCaseStudies.tsx` | **Delete** (orphaned, fabricated data) |
| `src/data/merged-services-data.ts` | Change "Design-build capabilities" to "Full-scope coordination" |

**Database changes:**
- **Schema Migration**: Alter default values for `homepage_settings` and `about_page_settings` to prevent inflated values on new rows.
- **Row Updates**: Update existing rows in `homepage_settings` and `about_page_settings` to remove inflated defaults.

## Exact Changes

### 1. Database Defaults (Schema & Data)
- **Migration**:
  - `ALTER TABLE homepage_settings ALTER COLUMN value_prop_2 SET DEFAULT 'WSIB Compliant';`
  - `ALTER TABLE homepage_settings ALTER COLUMN value_prop_3 SET DEFAULT 'Fully Insured';`
  - `ALTER TABLE homepage_settings ALTER COLUMN hero_description SET DEFAULT 'Ascent Group Construction specializes in general contracting and construction management for commercial, institutional, and multi-family projects. We deliver quality results through transparent project management and proven construction methodologies.';`
  - `ALTER TABLE about_page_settings ALTER COLUMN total_projects SET DEFAULT 0;`
  - `ALTER TABLE about_page_settings ALTER COLUMN satisfaction_rate SET DEFAULT 0;`
  - `ALTER TABLE about_page_settings ALTER COLUMN years_in_business SET DEFAULT 0;`
- **Data Update**: Update any existing rows using the SQL insert/update tool to match these new non-inflated values.

### 2. Equipment Resources → Redirect & De-link Scope
- **AppRoutes.tsx**: Replace `<Route path="/company/equipment-resources" element={<EquipmentResources />} />` with `<Route path="/company/equipment-resources" element={<Navigate to="/company/technology" replace />} />`.
- **Navigation.tsx**: Swap `/company/equipment-resources` to `/company/technology` in the `prefetchRoutes` array.
- **navigation-structure-enhanced.ts**: Update the Company mega-menu subItem `link: "/company/equipment-resources"` to `link: "/company/technology"`, `name: "Technology & Innovation"`, and `description: "Our digital workflow"`.
- **navigation-icons.ts**: Update the key to `/company/technology` (icon: `'Laptop'`).
- **registry.ts**: Remove `'/company/equipment-resources'` from `PUBLIC_ROUTE_PATTERNS`.
- **public/sitemap.xml**: Change the `<loc>` from `equipment-resources` to `technology` and adjust `<lastmod>`.
- **generate-sitemap/index.ts**: Replace `{ path: '/company/equipment-resources', ... }` with `{ path: '/company/technology', priority: '0.6', changefreq: 'monthly' }`.
- **EquipmentResources.tsx**: **Delete** the file only after completing the above and verifying no remaining usages.

### 3. Fabricated Testimonials on Why Specialty Contractor
- **specialty-contractor-comparison.ts**: Replace the `testimonials` array with `[]` and add comment `// Real testimonials to be populated from DB when available`.
- **WhySpecialtyContractor.tsx**: Wrap the entire testimonials `<Section>` in `{testimonials.length > 0 && (<Section>...</Section>)}` so the section heading and spacing are completely hidden when empty.

### 4. Delete PartnerCaseStudies.tsx
- File is orphaned (not imported anywhere). Contains fabricated project data with fake LEED, satisfaction, and schedule metrics. Delete it.

### 5. Minor Copy Fix
- `merged-services-data.ts` line 290: "Design-build capabilities" → "Full-scope coordination".

## What Will NOT Be Changed
- No structural redesigns
- No new pages or components
- No admin panel changes
- No CMS wiring changes (that is Phase 9)
- No legacy Card migrations (that is Phase 10)

## Checks
1. Database migration successfully alters column defaults.
2. `/company/equipment-resources` correctly redirects to `/company/technology`.
3. Navigation mega-menu correctly links to `/company/technology` instead of equipment resources.
4. Sitemap edge function and static sitemap include `/company/technology`, exclude `/company/equipment-resources`.
5. WhySpecialtyContractor page completely hides the testimonials section (no empty heading/padding).
6. No remaining import of `PartnerCaseStudies` or `EquipmentResources`.
7. TypeScript build passes.
8. No console errors on affected routes.

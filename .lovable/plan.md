
Root cause confirmed: 6 services have `typical_applications` stored as `[{label: "..."}, ...]` instead of `["...", ...]`. Renderer at `ServiceDetail.tsx:433` does `{app}` which crashes when `app` is an object.

6 broken pages:
- `/services/painting-services`
- `/services/sealant-programs`
- `/services/parking-garage-restoration`
- `/services/tile-flooring`
- `/services/interior-buildouts-finishing`
- `/services/interior-finishing-renovations`

The other 7 published service pages are fine (their arrays are plain strings).

## Fix — two layers, both small

### 1. Component hardening (`src/pages/ServiceDetail.tsx`)
Normalize `typical_applications` and `what_we_provide` at render time so the page never crashes regardless of stored shape:
```ts
const normalizeStringArray = (arr: unknown): string[] =>
  Array.isArray(arr)
    ? arr.map(v => typeof v === "string" ? v : (v as any)?.label ?? (v as any)?.title ?? "").filter(Boolean)
    : [];
```
Apply to both array reads. Also widen the `Service` interface fields to `Array<string | { label?: string; title?: string }>` so TypeScript stays happy.

This alone eliminates the white-screen crash on all 6 pages immediately.

### 2. Data normalization (one-shot SQL UPDATE)
For the 6 affected rows, flatten `typical_applications` to a plain string array using `jsonb_array_elements`:
```sql
UPDATE services
SET typical_applications = (
  SELECT jsonb_agg(COALESCE(elem->>'label', elem#>>'{}'))
  FROM jsonb_array_elements(typical_applications) elem
)
WHERE slug IN ('painting-services','sealant-programs','parking-garage-restoration',
               'tile-flooring','interior-buildouts-finishing','interior-finishing-renovations');
```
Keeps DB consistent with the other 7 services and avoids future ambiguity.

## Files touched
- `src/pages/ServiceDetail.tsx` — add `normalizeStringArray` helper, apply to both fields, widen interface
- 1 data migration (UPDATE only, no schema change)

## Out of scope
- No design changes
- No changes to the other 7 working service pages
- `key_benefits` is intentionally `{title, description}` objects (renderer expects this) — leave it alone

## Result
All 13 published service pages render. Component is defensive against future bad data. DB shape standardized.

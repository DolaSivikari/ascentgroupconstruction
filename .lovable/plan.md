

# Revised Phase 10 + 11 — Public Legacy Cleanup & Content Population

---

## Phase 10 — Public Legacy Card Migration (8 files, not 9)

### Testimonials.tsx: REMOVED from scope
`src/components/Testimonials.tsx` is not imported by any public page. No file contains `import ... from "@/components/Testimonials"`. It is only referenced in admin contexts. Migrating it in a public cleanup phase is unnecessary.

### Per-file padding analysis

The legacy `CardContent` (`@/ui/Card`) has built-in `p-6 pt-0`. The design-system `CardContent` (`@/design-system/components/Card`) has **no built-in padding** (empty string). However, every target file already applies **explicit padding classes** on `CardContent`, which override the legacy default. This means the migration is safe as a straight import swap in all 8 files.

| # | File | CardContent usage | Padding safe? | Notes |
|---|---|---|---|---|
| 1 | `ServiceCard.tsx` | `className="p-8"` | Yes — explicit | No adjustment needed |
| 2 | `RelatedServices.tsx` | `className="p-6"` | Yes — explicit | Card has no variant; add `hover` prop for parity |
| 3 | `BlogCard.tsx` | `className="p-8"` | Yes — explicit | No adjustment needed |
| 4 | `BlogPreview.tsx` | `className="p-8"` and `className="p-6"` | Yes — explicit | Map `variant="featured"` to `variant="elevated"` |
| 5 | `Careers.tsx` | `className="p-6"` and `className="p-8"` | Yes — explicit | No adjustment needed |
| 6 | `CertificationsInsurance.tsx` | `className="p-6"` | Yes — explicit | No adjustment needed |
| 7 | `ServiceAreas.tsx` | `className="p-6"` and `className="p-8"` | Yes — explicit | No adjustment needed |
| 8 | `ServiceDetail.tsx` | `className="p-6"` | Yes — explicit | No adjustment needed |

### Exact change per file
- Replace `import { Card, CardContent } from "@/ui/Card"` with `import { Card, CardContent } from "@/design-system/components/Card"`
- Map legacy variants: `interactive` → `interactive`, `featured` → `elevated`, no variant → `default`
- For `RelatedServices.tsx`: Card currently uses no variant but has hover classes manually applied — switch to `variant="interactive"` and remove the manual `hover:shadow-lg hover:-translate-y-1` classes
- For `BlogPreview.tsx`: Map `variant="featured"` to `variant="elevated"`

### Design-system Card also uses `size` prop for base padding
The design-system `Card` component itself applies padding via the `size` prop (`sm`=p-4, `md`=p-6, `lg`=p-8). Since all files wrap content in `CardContent` with explicit padding and the Card's own padding won't conflict (files don't use CardHeader/CardFooter patterns that depend on Card-level padding), this is a non-issue. But if any file uses bare `<Card>` without `CardContent`, I will verify visually.

---

## Phase 11 — Content Population (revised approach)

### Approach: Option A — Draft proposals for review

For the 6 published projects with NULL `challenge`, `solution`, and `results` fields, I will:

1. **Present draft content proposals in chat** for each project, derived strictly from existing `scope_of_work` text
2. **Wait for your review and approval** before any DB insertion
3. Only populate fields where the existing data provides a clear factual basis
4. If a project has no `scope_of_work` (e.g., Café Luka, Comfort Inn have empty scope), those fields will be left NULL unless you provide the content

### Current project data (evidence basis)

| Project | scope_of_work | Existing service joins |
|---|---|---|
| Innisfil Catholic School | Detailed (full painting scope) | Architectural Coatings |
| Dunnville Secondary School | Detailed (painting scope) | Architectural Coatings |
| Oakley Ridge | Detailed (interior/exterior painting) | Architectural Coatings |
| Queensland Condos | Has content | Architectural Coatings |
| Café Luka | Empty | 5 joins (Coatings, Repairs, Tile, Tenant Improvements, Drywall) |
| Comfort Inn & Suites | Empty | 4 joins (Stucco, Envelope, Cladding, Sustainable) |

Projects with empty `scope_of_work` (Café Luka, Comfort Inn) will NOT get generated challenge/solution/results unless you provide factual content.

### project_services joins: evidence-only standard

I will **not** add any new project-service joins in this phase. The existing 13 joins are already evidence-based (admin-entered). Adding more would require either:
- Explicit `scope_of_work` text mentioning the service
- Your direct instruction to link a specific project to a specific service

If you want additional joins, I can present candidates with the evidence for each, and you approve before insertion.

### What will NOT be populated
- Testimonials — no real client content available
- Blog posts — no real articles available
- Homepage CMS — already has safe defaults from Phase 8

---

## Combined file list

| File | Phase | Action |
|---|---|---|
| `src/components/services/ServiceCard.tsx` | 10 | Swap Card import |
| `src/components/services/RelatedServices.tsx` | 10 | Swap Card import, use `variant="interactive"` |
| `src/components/blog/BlogCard.tsx` | 10 | Swap Card import |
| `src/components/BlogPreview.tsx` | 10 | Swap Card import, map featured→elevated |
| `src/pages/Careers.tsx` | 10 | Swap Card import |
| `src/pages/company/CertificationsInsurance.tsx` | 10 | Swap Card import |
| `src/pages/resources/ServiceAreas.tsx` | 10 | Swap Card import |
| `src/pages/ServiceDetail.tsx` | 10 | Swap Card import |
| Database: `projects` table | 11 | Draft proposals presented for review — no DB writes without approval |

## What will NOT be done
- No Testimonials.tsx migration (not publicly mounted)
- No admin page migrations
- No fabricated content of any kind
- No "logical connection" joins
- No schema changes
- No new components

## Checks
1. All 8 migrated files compile without errors
2. No visual padding/spacing regressions (all explicit classes preserved)
3. Card hover/shadow behavior matches previous appearance
4. Phase 11 content proposals reviewed before any DB insertion
5. No console errors on affected routes


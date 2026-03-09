

# Hero System Improvement — Implementation Plan

## Scope: 7 changes across 5 files

### 1. Fix Markets Hero (`src/pages/Markets.tsx`)
- Replace `mainPageHeroes.projects` with `sectorHeroes["markets-overview"]` (verified: `heroMarketsOverview` exists at `src/assets/heroes/hero-markets-overview.jpg`)
- Add `breadcrumbs`: Home → Markets
- Add `eyebrow`: "Our Markets"
- Add `description` (move current subtitle text to description, write a proper subtitle)
- Add `primaryCta`: "Submit RFP" → `/submit-rfp`
- Add `secondaryCta`: "Contact Us" → `/contact`
- Import `sectorHeroes` from hero-images

### 2. Fix Estimate Hero (`src/pages/Estimate.tsx`)
- Replace `resourceHeroes.estimate` (currently `heroAboutCompany`) with `heroDesignBuild` — verified exists, relevant to planning/estimating
- Update `resourceHeroes` in `hero-images.ts`: change `estimate` mapping from `heroAboutCompany` to `heroDesignBuild`
- Add `eyebrow`: "Project Estimator"
- Change height from `"small"` to `"medium"`

### 3. Fix Contact Hero image (`src/data/hero-images.ts`)
- Change `mainPageHeroes.contact` from `heroAboutCompany` to `heroTeam` — more relevant (people/team = contact context). Already imported.

### 4. Fix Blog Hero image (`src/data/hero-images.ts`)
- Change `mainPageHeroes.blog` from `heroAboutCompany` to `heroEducation` — editorial/insights-relevant. Already imported.
- Also change `mainPageHeroes.insights` to `heroEducation` for consistency.

### 5. Add staggered reveal to shared PageHero (`src/components/shared/PageHero.tsx`)
- Add staggered `animate-fade-in` with `animation-delay` and `animation-fill-mode: both` to each content element:
  - Breadcrumbs: 0ms
  - Badge/Eyebrow/Subtitle: 50ms
  - Title: 100ms
  - Accent line: 150ms
  - Description: 200ms
  - Stats: 250ms
  - CTAs: 300ms
- Wrap in a `motion-safe:` media query via `@media (prefers-reduced-motion: no-preference)` approach — use inline styles with `opacity: 0` default + `animate-fade-in` class, so reduced-motion users see instant content
- Implementation: add a helper style object and apply `animate-fade-in` class + `animationDelay` + `animationFillMode: 'both'` + initial `opacity: 0` via style prop on each element group

### 6. Migrate BlogPost to shared PageHero (`src/pages/BlogPost.tsx`)
- Replace `ContentPageHeader` import with `PageHero` from `@/components/shared/PageHero`
- Replace the `<ContentPageHeader>` call with `<PageHero>` using:
  - `title={post.title}`
  - `subtitle={post.category + " · " + formattedDate + " · " + (post.read_time_minutes || 5) + " min read"}`
  - `image={post.featured_image || '/placeholder.svg'}`
  - `breadcrumbs` (same 4-item array)
  - `height="small"`

### 7. Migrate ServiceSelectorPage to shared PageHero (`src/pages/ServiceSelectorPage.tsx`)
- Replace `PageHeader` import with `PageHero` from `@/components/shared/PageHero`
- Replace the `<PageHeader>` call with `<PageHero>` using the same title, description, image (`heroImage`), and breadcrumbs
- Add `height="small"`

---

## Navigation heroPages check
- `/projects` is NOT in `heroPages[]` — the Projects page uses `PremiumProjectHero` which has its own dark background. Will verify visually whether it needs adding; will NOT add without confirmation.

## Files changed
| File | Change |
|------|--------|
| `src/pages/Markets.tsx` | Hero props overhaul |
| `src/pages/Estimate.tsx` | Eyebrow + height |
| `src/data/hero-images.ts` | Fix 4 image mappings (contact, blog, insights, estimate) |
| `src/components/shared/PageHero.tsx` | Add staggered fade-in animation |
| `src/pages/BlogPost.tsx` | Migrate from ContentPageHeader → PageHero |
| `src/pages/ServiceSelectorPage.tsx` | Migrate from PageHeader → PageHero |

## NOT touched
- `PremiumProjectHero.tsx` — protected
- `EnhancedHero.tsx` — protected
- Homepage layout — no changes
- Legacy components — NOT deleted yet (will report which are safe to remove after migrations)

## Risk assessment
- All changes are prop-level or import swaps on existing working components
- Image assets are verified to exist in the codebase
- Animation uses existing Tailwind `animate-fade-in` keyframe
- No structural or routing changes


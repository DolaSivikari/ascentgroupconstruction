

## Boost Service Detail Pages — Content + Visual Upgrade

### Why pages look plain (root cause)

Audit of all 12 published services shows the database is mostly empty:

| Field | Status across 12 published services |
|---|---|
| `service_overview` | **0 of 12** populated |
| `process_steps` | **0 of 12** populated |
| `key_benefits` | **0 of 12** populated |
| `what_we_provide` | **0 of 12** populated |
| `typical_applications` | **0 of 12** populated |
| `faq_items` | **0 of 12** populated |
| `featured_image` | **0 of 12** populated |
| `long_description` | 9 of 12 populated (~250–370 chars) |

So `ServiceDetail.tsx` renders only: hero → short description → one paragraph fallback → service-area map → CTA. Every rich section is conditional and gets skipped.

**Sustainable Construction 404**: `/services/sustainable-construction` redirects to `/services/sustainable-building`, but that row has `publish_state = 'draft'`. The query filters `publish_state = 'published'` → 404.

**Bonus issue**: hero images in `serviceHeroImages` use `/src/assets/heroes/...` string paths. These work in dev but **break in production builds** because Vite hashes asset filenames. Need proper imports.

### Plan (3 parts)

**Part 1 — Seed rich content for the 6 priority pages**

For each of: `eifs-stucco-systems`, `cladding-systems`, `building-envelope-solutions`, `facade-remediation`, `masonry-restoration`, `waterproofing-systems` — write a SQL migration that fills:

- `service_overview` (200–350 word paragraph, professional tone matching brand)
- `process_steps` (4–6 steps: Inspection → Design → Prep → Installation → QA → Warranty)
- `key_benefits` (4–6 benefit cards with title + description)
- `what_we_provide` (8–12 line items, scope of work)
- `typical_applications` (4–6 application types: high-rise, commercial, institutional, etc.)
- `faq_items` (4–6 Q&As covering cost, timeline, warranty, materials)
- `featured_image` (point at existing hero asset URL or a Supabase storage URL)

Content will be written specifically for each service, drawing from existing `long_description` and brand voice (Editorial/Enterprise per memory). No generic filler.

**Part 2 — Fix Sustainable Construction**

Two options, present both:
- **A.** Publish the `sustainable-building` row (flip `publish_state` to `published`) and seed it with the same rich content as Part 1.
- **B.** Remove the `/services/sustainable-construction` redirect from `AppRoutes.tsx` until ready.

Recommend **A** since the page already has a `long_description` and a hero image (`hero-sustainable.jpg`) ready.

**Part 3 — Visual polish to `ServiceDetail.tsx`**

Keep the current structure (it's already well-organized) but tighten styling to match the editorial/enterprise standard used elsewhere on the site:

1. **Section header pattern** — replace bare `<h2 className="text-3xl font-bold">` with the shared `SectionHeader` component (badge + title + description, left-aligned) so service pages match the homepage and `/services` rhythm.
2. **Process steps** — convert the current vertical card list into a numbered timeline with a subtle vertical connector line (still uses `Card` but visually flows). Adds the "process feels like a process" effect.
3. **Key Benefits** — switch from the generic 2-column card grid to the design-system `CapabilityCard` (icon + title + description) which is already used for the homepage capability section. Auto-assign icons via `getIconForService` lookup.
4. **What We Provide** — keep the 2-col checklist but wrap it in a subtle bordered panel with a left accent rule (matches the editorial standard).
5. **Typical Applications** — render as compact pill-tag chips instead of full cards (less heavy, scans faster).
6. **FAQs** — convert the static stacked cards into the existing `Accordion` UI primitive (collapsible). Already a pattern used elsewhere.
7. **Sticky "Quick Quote" sidebar** — on `lg+` viewports, add a sticky right-rail card (phone, email, "Request Quote" button, key cert badges) like the `ServicePageTemplate` already implements. Adds conversion + breaks up the centered single-column feel.
8. **Hero badges** — extend the per-service badge logic (currently only EIFS has trust badges) so each service gets 2–3 relevant badges (e.g., Building Envelope → "CCMC Listed", "20+ Year Warranty", "WSIB Certified"). Drives credibility.
9. **Fix asset paths** — replace the `/src/assets/...` strings in `serviceHeroImages` with proper Vite imports so heroes render correctly in production.

### Out of scope

- No changes to `/services` index page, navigation, or the `ServicePageTemplate` (legacy template not used by these routes).
- No new routes or DB schema changes — just data inserts/updates and component restyling.

### Files touched

- New SQL migration: seed `service_overview`, `process_steps`, `key_benefits`, `what_we_provide`, `typical_applications`, `faq_items`, `featured_image`, hero badges, plus publish `sustainable-building`.
- `src/pages/ServiceDetail.tsx` — restructure sections (SectionHeader, timeline, CapabilityCard, Accordion, sticky sidebar, per-service badges, fixed asset imports).
- `src/utils/serviceIcons.ts` — verify mappings for new service slugs (no breaking changes).

### Decisions needed before implementation

1. For Part 1, do you want the **6 priority pages** (Building Envelope category) seeded now, with the other 6 (Interior + Finishing) done in a follow-up? Or all 12 at once?
2. Sustainable Construction: publish + seed (option A) or temporarily hide (option B)?
3. Featured images: use the existing `hero-*.jpg` files for now, or do you want to upload new dedicated featured project photos (separate from heroes) per service?


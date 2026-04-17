

## Full Hardening — All 3 Phases

### Phase 1 — Quick Wins

**1. Fix `EmergencyRepair.tsx` ref warning**
Trace child components receiving stray refs. Most likely `PageHero` or a `Button` inside the urgent phone banner. Wrap target in `React.forwardRef` or remove the ref prop.

**2. Fix `ScrollReveal.tsx` style conflict**
Replace shorthand `transition` (in CSS class) + inline `transitionDelay` (in style) with explicit longhand inline styles: `transitionProperty`, `transitionDuration`, `transitionTimingFunction`, `transitionDelay`. Eliminates React's "conflicting property" warning.

**3. Add featured images to 5 published blog posts**
Run UPDATE statements to populate `featured_image` for each published post, using existing `/src/assets/heroes/*.jpg` paths or related project images. Fixes blog index cards + OG share previews.

**4. Lazy-load hero video on mobile**
In `EnhancedHero.tsx`: detect viewport ≤768px (or `prefers-reduced-data`), skip `<video>` element on mobile and render the poster image only. Desktop behavior unchanged. Cuts ~5s off mobile load.

### Phase 2 — Content Completeness

**5. Seed rich content for the 7 remaining service pages**
- `painting-services` (Architectural Coatings)
- `sealant-programs` (Caulking & Sealant Services)
- `interior-buildouts-finishing` (Commercial Tenant Improvements)
- `parking-garage-restoration`
- `interior-finishing-renovations` (Residential Renovations)
- `tile-flooring`
- (1 more — confirm during execution)

For each: write `service_overview` (200–350 words), `process_steps` (4–6 JSONB items), `key_benefits` (4–6 cards), `what_we_provide` (8–12 line items), `typical_applications` (4–6 chips), `faq_items` (4–6 Q&As), `featured_image`. Same pattern as the Building Envelope group.

### Phase 3 — Hardening

**6. Per-IP rate-limit triggers on public form tables**
Add `BEFORE INSERT` triggers on `contact_submissions`, `rfp_submissions`, `quote_requests`, `newsletter_subscribers` that call `check_and_update_rate_limit()` with the inserter's IP (passed via `current_setting('request.headers', true)::jsonb->>'x-forwarded-for'` or fall back to a client-supplied identifier). Limit: 10 inserts/hour/IP. Reject with `RAISE EXCEPTION` over the limit.

Note: Edge functions already enforce rate limits via the same RPC, but this adds DB-level defense for any direct inserts that bypass functions.

**7. Review recent `error_logs`**
Query last 11 errors, group by message, identify any actionable bugs (vs. expected/transient). Fix actionable ones in code; ignore noise.

**8. Populate `redirects` table for legacy slugs**
Audit the 7 archived services (basement-finishing, kitchen-bathroom-renovations, etc.). Insert redirect rows mapping each old slug → closest current service. Already covered partially in `public/_redirects` for Netlify, but DB-driven redirects let admin manage them via the existing RedirectsManager UI.

### Files touched

- `src/components/animations/ScrollReveal.tsx` — longhand transition styles
- `src/pages/EmergencyRepair.tsx` (and any child needing forwardRef)
- `src/components/homepage/EnhancedHero.tsx` — mobile poster-only path
- `src/pages/ServiceDetail.tsx` — no changes (already updated last round)
- 1 SQL data migration (insert/update tool): blog featured_images, 7 service rows, redirects entries
- 1 schema migration: 4 rate-limit triggers + helper function if needed

### Out of scope

- No design changes to homepage, navigation, or `/services` index
- No new routes, no admin UI changes
- No changes to the (intentionally permissive) public-form RLS policies — triggers add the rate-limit layer instead

### Order of execution

1. Phase 1 fixes (warnings + blog images + hero mobile lazy-load) — visible immediately
2. Phase 2 content seeding (7 services) — single migration
3. Phase 3 triggers + redirects + error-log review — backend hardening


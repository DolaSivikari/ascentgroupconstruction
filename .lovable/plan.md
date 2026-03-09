

# Homepage Section Reorder — No Redesign

## Current Order vs Recommended

```text
CURRENT                          RECOMMENDED
─────────────────────────────    ─────────────────────────────
1. Hero                          1. Hero            (keep)
2. Trust Badge Bar               2. Proof Strip     (merge trust+proof)
3. Who We Serve                  3. Service Highlights (move up)
4. Proof Strip (By the Numbers)  4. Who We Serve    (keep, move down 1)
5. Why Choose Us                 5. Featured Projects (move WAY up)
6. Company Overview Hub          6. Why Choose Us   (keep)
7. How We Work Process           7. How We Work     (keep)
8. Service Highlights            8. Final CTA       (keep)
9. Featured Projects
10. Final CTA
```

## Changes (Index.tsx only)

1. **Remove `TrustBadgeBar`** — the `HomepageProofStrip` already shows $2M, WSIB, 15+ Years, 85% self-performed. Having both is redundant. The dark proof strip directly under the hero is higher impact.

2. **Move `HomepageServiceHighlights` to position 3** — services should appear early so visitors immediately see scope clarity.

3. **Move `HomepageFeaturedProjects` to position 5** — projects are proof; they need to appear before "why choose us" philosophy.

4. **Remove `CompanyOverviewHub`** — it overlaps with WhyChooseUs (both talk about approach/values/promise). Removing it tightens the page and reduces scroll fatigue.

5. **Keep everything else** — Hero, ProofStrip, WhoWeServe, WhyChooseUs, ProcessStrip, FinalCTA all stay with their current designs.

## New order (8 sections instead of 10)

```text
1. Hero
2. Proof Strip
3. Service Highlights
4. Who We Serve
5. Featured Projects
6. Why Choose Us
7. How We Work Process
8. Final CTA
```

## Why this works
- Answers "what do you do?" immediately (services at #3)
- Shows proof early (proof strip at #2, projects at #5)
- Removes redundancy (no double trust bars, no overlapping overview sections)
- Zero component redesign — just reorder and remove two imports

## File changed
- `src/pages/Index.tsx` — reorder sections, remove TrustBadgeBar and CompanyOverviewHub imports


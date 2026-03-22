

## Plan: Merge Value Proposition Content into Who We Serve Section

### What and Why

The current `WhoWeServeHomepage` section jumps straight to 4 client cards with no context about **why** clients should choose Ascent Group. The old `ClientValueProposition` had rich SEO copy (accountability, self-perform trades, QA/QC, occupied buildings) plus 7 benefit bullets that told visitors why you're different -- but it was a separate section visitors might never reach.

Merging them into one section gives visitors the "why us" messaging right alongside "who we serve," making it scannable and SEO-complete without adding scroll depth.

### Updated Copy (multi-trade, honest)

**H2:** "Why Clients Choose Us"

**Subhead:** "Building performance is non-negotiable -- and accountability is everything."

**Body paragraphs (updated for multi-trade):**
- Para 1: Developers, general contractors, property managers, and asset owners choose Ascent Group Construction for specialized envelope, restoration, and interior trade delivery across Toronto (GTA) and the Golden Horseshoe. We act as the lead contractor -- coordinating access and safety, self-performing key trades, and communicating clearly from site walk to closeout.
- Para 2: We follow consultant/engineer-of-record (EOR) details, document work with photo logs/ITPs, and provide applicable manufacturer and workmanship warranties.

**7 benefit bullets (updated):**
1. Prime accountability for project scopes (broadened from "envelope scopes")
2. Self-performed core trades -- sealants/caulking, EIFS & stucco, masonry repairs, waterproofing & protective coatings, concrete and parking-garage rehabilitation, commercial painting, interior buildouts
3. Consultant/EOR-aligned execution
4. Documented QA/QC
5. Occupied-building expertise
6. Responsive by design
7. Local coverage

**CTAs:** Request Site Assessment, View Services, For GCs: Request Unit Pricing

Then a divider, followed by the existing 4 client segment cards (unchanged).

### Layout

```text
┌─────────────────────────────────────────────────┐
│  Badge: "Why Choose Us"                         │
│  H2: Why Clients Choose Us                      │
│  Subhead: Building performance is...            │
│                                                 │
│  2 SEO paragraphs (multi-trade updated)         │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐              │
│  │ Benefit 1   │  │ Benefit 2   │  (2-col grid, │
│  │ Benefit 3   │  │ Benefit 4   │   7 items)    │
│  │ Benefit 5   │  │ Benefit 6   │              │
│  │ Benefit 7   │  │             │              │
│  └─────────────┘  └─────────────┘              │
│                                                 │
│  [Request Site Assessment] [View Services]      │
│  [For GCs: Request Unit Pricing]                │
│                                                 │
│  ─── border-t divider ───                       │
│                                                 │
│  H3: Who We Serve                               │
│  Sub: From general contractors...               │
│                                                 │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                   │
│  │ GC │ │PM  │ │Comm│ │Home│  (existing 4 cards)│
│  └────┘ └────┘ └────┘ └────┘                   │
└─────────────────────────────────────────────────┘
```

### Technical Details

**File changed:** `src/components/homepage/WhoWeServeHomepage.tsx`

- Add "Why Choose Us" intro block above existing client cards
- Include the 7 benefit bullets in a `md:grid-cols-2` grid using the design system `Card` component with `variant="outline" size="sm"` and `CheckCircle2` icons
- Add 3 CTA buttons (same pattern as service highlights)
- Demote current H2 to H3, move below a `border-t border-border/50` divider
- Existing 4 `ClientSegmentCard` items and their animation logic remain unchanged
- Replace `construction-orange` references with `primary` token
- Keep all scroll-fade-in and reduced-motion handling

**No other files change.** The `ClientValueProposition.tsx` component remains untouched. `Index.tsx` section order stays the same.




## Revised Plan: Multi-Trade Company Introduction + Service Highlights

### Key Change from Previous Plan

Your pasted SEO text says **"Envelope is our focus — this is all we do"** — but that's not true. You do painting, renovations, interior buildouts, tile/flooring, and condo turnover packages alongside envelope work. The intro must reflect the full breadth without losing the envelope specialty positioning.

### Updated Copy Direction

**H2:** "Building Envelope, Restoration & Interior Trades Across Toronto (GTA)"

**Subhead:** "Lead contractor for envelope restoration, interior buildouts, painting, and specialty trades — planning, self-performing, and delivering accountable results across the GTA and Golden Horseshoe."

**Left column (who we are):**
- Para 1: Ascent Group Construction protects and improves buildings — from exterior envelope and façade restoration to interior buildouts, painting, and finishing trades. We act as the lead contractor, planning access and safety, self-performing the core trades, and communicating clearly from site walk to closeout.
- Para 2: "Our foundation is building envelope — but our capability extends across the full scope of restoration, interior construction, and specialty trades that commercial and multi-unit properties require."

**Right column (what we self-perform):**
- Para 1: We self-perform key trades — sealants/caulking, EIFS & stucco, masonry repairs and tuckpointing, waterproofing & protective coatings, concrete and parking-garage rehabilitation, commercial painting, interior buildouts, and tile & flooring — coordinating trusted partners only when needed.
- Para 2: We work safely in occupied buildings, document progress with photo logs, and provide applicable manufacturer and workmanship warranties.

**Three highlight cards:**
1. **Complete Services** — "Lead specialty contractor with self-perform trades delivering schedule certainty and quality control across envelope, restoration, painting, and interior projects."
2. **Building Our Track Record** — "15+ years combined team experience with on-time, on-budget delivery serving developers, property managers, and institutional clients across the Greater Toronto Area."
3. **Building Our Credentials** — "Licensed business with WSIB registration and insurance in progress. Committed to safety, quality documentation, and professional execution on every project."

### What This Achieves
- Visitors immediately understand you do **many trades**, not just envelope
- Envelope is positioned as your **foundation/strength**, not your only capability
- All 8 service cards below reinforce the breadth
- Stays honest — no inflated claims, matches your actual service pillars
- SEO keywords preserved: building envelope, restoration, interior trades, painting, GTA, lead contractor, self-perform

### Technical Details

**Files changed:**

| File | Change |
|------|--------|
| `src/components/homepage/HomepageServiceHighlights.tsx` | Add company intro block above service cards with updated multi-trade copy |
| `src/components/homepage/EnhancedHero.tsx` | Fix `NodeJS.Timeout` → `ReturnType<typeof setTimeout>` |
| `src/hooks/useAutoSave.ts` | Same type fix |
| `src/hooks/useHoverTimeout.ts` | Same type fix |
| `src/hooks/useSearchAnalytics.ts` | Same type fix |

**Design:** Uses `primary` token, flat cards (`border-border/60 bg-card`), left-aligned headers, no glass/blur effects. Service area + response time info row preserved. Existing 8 service cards and footer link unchanged.


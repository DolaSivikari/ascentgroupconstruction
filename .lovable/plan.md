

# Implementation Blueprint — 11-Page Strategic Overhaul

## A. Final Recommended Role for Each Page

| Page | Primary Role | Secondary Role |
|------|-------------|----------------|
| `/why-specialty-contractor` | SEO education | Supporting trust |
| `/prequalification` | Procurement / trust | Conversion |
| `/capabilities` | **Flagship operational credibility** | Conversion bridge |
| `/careers` | Recruitment / culture | Brand signal |
| `/resources/service-areas` | Local SEO | Conversion |
| `/company/technology` | Trust / proof | Process support |
| `/our-process` | Trust / proof | Conversion |
| `/contact` | Conversion | Trust |
| `/projects` | Portfolio / proof | Conversion |
| `/blog` | SEO / authority / education | Sales enablement |
| `/insights` | *(dead — redirect only)* | — |

## B. Recommended Future State

| Page | Action | Reason |
|------|--------|--------|
| `/why-specialty-contractor` | **Simplify + clean** | Remove fabricated outcomes and unverified claims. Shorten. Keep for SEO. Do NOT invest in making it a flagship. |
| `/prequalification` | **Refine** | Add hero CTA, link projects from DB, verify claims, add closing CTA band |
| `/capabilities` | **Rebuild** | Elevate to flagship credibility page with premium hero, proof links, partnership models, self-perform emphasis |
| `/careers` | **Reframe** | Replace fabricated listings with honest "Work With Ascent" expression-of-interest model |
| `/resources/service-areas` | **Refine** | Remove decorative blobs, fix hero, add cross-links to projects |
| `/company/technology` | **Refine** | Fix wrong hero image, add cross-links to /our-process |
| `/our-process` | **Minor polish** | Add cross-links to services/projects. Otherwise complete. |
| `/contact` | **Minor polish** | Add "What to Expect" near form, trust badge near submit |
| `/projects` | **Refine** | Add closing CTA band, clean up filter redundancy, remove dead `PageHeader` import |
| `/blog` | **Content launch** | Remove decorative blob, create 5 starter posts, improve empty-state |
| `/insights` | **Keep redirect** | Already redirects to `/blog`. Delete `Insights.tsx` dead code. |

## C. Exact Structural Plan for Each Page

### 1. `/why-specialty-contractor` — SIMPLIFY

**Remove:**
- "Real Project Outcomes" section (lines 355-422) — fabricated comparison data with specific costs
- "25-30% more value" claim (line 288) — unverified
- "Our Vision" roadmap section (lines 294-353) — internal strategy, move best content to /capabilities
- "Why This Path" section — merge into /capabilities

**Keep:**
- Comparison table (educational, well-structured)
- Scenarios section
- FAQ section (has schema markup)
- Final CTA

**Target section order:**
1. Hero (standard PageHero, height small)
2. Introduction
3. Comparison table
4. When to choose specialty vs GC (scenarios)
5. Cost structure comparison (keep but remove the "25-30%" claim)
6. FAQ
7. CTA band → /contact, /capabilities, /projects

**Data file changes:** `src/data/specialty-contractor-comparison.ts` — remove `projectOutcomes` array, remove `ourVision` object, remove the "25-30%" line from cost breakdown.

### 2. `/prequalification` — REFINE

**Add:**
- Hero `primaryCta`: "Download Our Package" or "Contact Us" → /contact
- Hero `eyebrow`: "Contractor Pre-Qualification"
- Closing CTABand after all tabs
- Link to `/projects` in Projects tab
- Cross-link to `/capabilities` from Overview tab

**Verify/fix:**
- "ISO-compliant quality management systems" claim — flag for manual verification
- Pull recent projects from DB instead of hardcoded data (if feasible)

**Target section order:**
1. Hero (standard, medium height, with CTA)
2. Transparency banner (keep — excellent)
3. Company highlights strip (keep)
4. Tabs: Overview | Documents | Projects | Contact
5. CTABand → /contact, /estimate

### 3. `/capabilities` — REBUILD (Flagship)

**Remove:**
- "Service Categories" section (duplicates /services)
- "$100K-$5M" stat (conflicts with Prequalification's $25K-$500K)

**Restructure as "How Ascent Delivers Projects":**

**Target section order:**
1. **Premium hero** — taller than standard (height `large`), with stats strip in hero, eyebrow "How We Deliver", strong description, dual CTAs
2. **Partnership Models** — keep PartnershipModelsSection but add links to relevant projects under each model
3. **Self-Perform Capabilities** — move UP (most differentiating). Add project cross-links.
4. **Project Delivery Methods** — keep, refine
5. **Project Size & Capacity** — fix stats to match Prequalification ($25K-$500K), keep $2M CGL and team experience
6. **ProofStrip** — add contextual proof strip
7. **CTABand** — "Ready to Partner?" → /submit-rfp + /contact

**Premium hero concept:**
- Use `PageHero` with `height="large"`, `variant="standard"`
- Add `stats` prop with 3-4 key stats (85% self-performed, 10-person crew, $2M CGL, 15+ years experience)
- Stronger description emphasizing operational credibility
- `primaryCta`: "Submit RFP" → /submit-rfp
- `secondaryCta`: "View Our Work" → /projects
- This is premium through content density and height, NOT through a custom slideshow component. Keeps Projects hero unique.

### 4. `/careers` — REFRAME

**Remove:**
- All 4 fabricated job listings (`openPositions` array)
- Benefits that may overstate reality: "health, dental, vision coverage", "profit sharing", "paid conferences"

**Replace with "Work With Ascent" model:**

**Target section order:**
1. Hero — title: "Work With Ascent", description about growing specialty team
2. "Who We Are" — brief company context (10-person crew, specialty focus, GTA)
3. "What We Value" — 4 cards: Safety, Quality, Accountability, Growth (honest, not benefits-package marketing)
4. "Trades & Roles We're Looking For" — general categories (envelope installers, painters, project coordinators, estimators) without fake specific openings
5. "How to Connect" — general application form via existing ResumeSubmissionDialog
6. Culture card (keep existing, adjust "apprentices to senior craftsmen" language)

### 5. `/resources/service-areas` — REFINE

**Remove:**
- Background decoration blobs (lines 46-49)

**Fix:**
- Hero: add `eyebrow`: "Service Coverage", better description: "Professional building envelope and interior trade services across the Greater Toronto Area", add `primaryCta`: "Get a Quote" → /estimate
- Add cross-links to `/projects` filtered by location where feasible

**Target section order:** Keep current, just fix hero and remove blobs.

### 6. `/company/technology` — REFINE

**Fix:**
- Hero image: change from `resourceHeroes["submit-rfp"]` to a more appropriate mapping (verify what exists)
- Add cross-link to `/our-process` ("See how we apply these tools →")
- Add cross-link to `/prequalification`

**Target section order:** Keep current structure, add cross-links.

### 7. `/our-process` — MINOR POLISH

**Add:**
- Cross-links after timeline: link to relevant services and project examples
- Consider linking specific deliverables to /prequalification documents

**No structural changes needed.**

### 8. `/contact` — MINOR POLISH

**Add:**
- "What to Expect" micro-section near form: "We typically respond within 1 business day. Your inquiry goes directly to our project team."
- Small trust badge near submit: "$2M Insured · WSIB Compliant"

**No structural changes needed.**

### 9. `/projects` — REFINE

**Remove:**
- Dead `PageHeader` import (line 6)
- Dead `Breadcrumb` import (line 7)

**Add:**
- Closing CTABand after project grid: "Ready to Start Your Project?" → /estimate + /contact

**Clean up:**
- Evaluate whether both FilterDrawer and FilterBar are needed (recommend keeping FilterBar, removing FilterDrawer for simplicity)

**DO NOT TOUCH:** PremiumProjectHero

### 10. `/blog` — CONTENT LAUNCH

**Fix:**
- Remove decorative blob (line 104: `bg-gradient-to-br from-primary/5...`)
- Add intentional empty-state: "We're launching our content library. Check back soon for insights on building envelope restoration, project planning, and specialty contracting."

**5 Starter Blog Posts** (to be created in DB):

1. **"What Property Managers Should Prepare Before Starting Envelope Restoration"**
   - Audience: Property managers, condo boards
   - SEO: "building envelope restoration" + "what to expect"
   - Format: Guide with checklist (1,500 words)
   - Outline: Why envelope work can't wait → Assessment → Proper scope → Questions for your contractor → What to expect during execution
   - CTA: Request a Site Assessment → /estimate
   - Category: "Building Envelope"

2. **"EIFS vs Stucco: What Building Owners Need to Know"**
   - Audience: Building owners, architects
   - SEO: "EIFS vs stucco" / "EIFS repair"
   - Format: Comparison article with table (1,200 words)
   - Outline: What each is → Key differences → When each is appropriate → Common failures → Our approach
   - CTA: View Envelope Services → /services/building-envelope
   - Category: "Building Envelope"

3. **"Why Self-Performed Work Changes Quality, Cost, and Accountability"**
   - Audience: GCs, property managers comparing bids
   - SEO: "self-performed construction" / "specialty contractor"
   - Format: Thought leadership (1,000 words)
   - Outline: What it means → Quality impact → Cost impact → Accountability → Our 85% model
   - CTA: View Capabilities → /capabilities
   - Category: "Industry Insights"

4. **"How General Contractors Should Evaluate a Specialty Trade Partner"**
   - Audience: GCs, project managers
   - SEO: "evaluate subcontractor bid" / "specialty contractor selection"
   - Format: Practical guide (1,200 words)
   - Outline: Beyond price → Self-perform questions → Insurance verification → Red flags → Strong bids
   - CTA: View Pre-Qualification Package → /prequalification
   - Category: "For General Contractors"

5. **"Early Signs Your Building Envelope Needs Attention"**
   - Audience: Property managers, building maintenance
   - SEO: "building envelope inspection" / "caulking replacement signs"
   - Format: Listicle with photos (800 words)
   - Outline: Cracking → Adhesion failure → Discoloration → Age → Water intrusion → What happens if you wait
   - CTA: Request Assessment → /estimate
   - Category: "Building Envelope"

**Category structure:** "Building Envelope", "Industry Insights", "For General Contractors", "Case Studies" (future)

**Featured post strategy:** Pin post #1 or #3 as featured. Featured section shows top 3 most recent.

### 11. `/insights` — DELETE DEAD CODE

- Already redirects to `/blog` in AppRoutes.tsx
- Delete `src/pages/Insights.tsx` (dead code)
- Delete `src/components/insights/InsightsFeed.tsx` if no other imports exist (verify first)

## D. Hero Strategy Plan

**Tier 1 — Premium heroes:**
| Page | Treatment |
|------|-----------|
| Homepage | EnhancedHero (protected) |
| `/projects` | PremiumProjectHero (protected) |
| `/capabilities` | PageHero with `height="large"`, stats in hero, dual CTAs — premium through content density, NOT a custom component |

**Tier 2 — Strong standard heroes:**
| Page | Height | Notes |
|------|--------|-------|
| `/our-process` | medium | Already strong |
| `/contact` | medium | Already adequate |
| `/prequalification` | medium | Add CTA + eyebrow |
| `/careers` | medium | Retitle to "Work With Ascent" |

**Tier 3 — Lighter utility heroes:**
| Page | Height | Notes |
|------|--------|-------|
| `/blog` | medium | Keep current |
| `/resources/service-areas` | small | Fix description + add CTA |
| `/company/technology` | small | Fix image |
| `/why-specialty-contractor` | small | Demoted — educational page |

## E. Cross-Linking Architecture

```text
/capabilities ──→ /projects (proof)
             ──→ /our-process (how we execute)
             ──→ /prequalification (documentation)
             ──→ /for-general-contractors (GC partnership)
             ──→ /submit-rfp (conversion)

/our-process ──→ /services (what we do)
             ──→ /projects (proof)
             ──→ /prequalification (documents)

/company/technology ──→ /our-process (application)
                    ──→ /prequalification (documentation proof)

/blog posts ──→ /services/* (relevant service)
            ──→ /capabilities (operational proof)
            ──→ /estimate or /contact (conversion)

/prequalification ──→ /projects (portfolio)
                  ──→ /capabilities (how we work)
                  ──→ /contact (conversion)

/projects ──→ /estimate (conversion)
          ──→ /contact (conversion)

/contact ──→ /estimate (alternative path)
         ──→ /submit-rfp (alternative path)

/why-specialty-contractor ──→ /capabilities (proof)
                          ──→ /projects (evidence)
                          ──→ /contact (conversion)
```

## F. Blog Launch Structure

- **Merge:** `/insights` already redirects to `/blog`. Delete dead `Insights.tsx`. Blog is the single content hub.
- **Landing page:** Current structure is adequate (featured + category tabs + grid). Fix empty state and remove blob.
- **Categories:** "Building Envelope", "Industry Insights", "For General Contractors", "Case Studies"
- **5 posts:** As specified in Section C.10
- **Featured strategy:** Most recent or manually pinned via `is_pinned` field

## G. Priority Implementation Roadmap

### Wave 1 — Credibility Risk Fixes
1. `/why-specialty-contractor` — Remove fabricated project outcomes, unverified "25-30%" claim, and internal roadmap section from data file and page
2. `/careers` — Reframe as "Work With Ascent" with honest positioning, remove fabricated listings and overstated benefits

### Wave 2 — Flagship Page Rebuild
3. `/capabilities` — Rebuild as "How Ascent Delivers" with premium hero (large height + stats), reorganized sections, cross-links, proof density, fix $100K-$5M inconsistency

### Wave 3 — Content Launch
4. `/blog` — Remove decorative blob, add empty-state, create 5 starter posts in DB
5. Delete `Insights.tsx` dead code

### Wave 4 — Polish & Connective Tissue
6. `/prequalification` — Add hero CTA/eyebrow, closing CTABand, project cross-links
7. `/projects` — Add closing CTABand, remove dead imports, clean filter redundancy
8. `/contact` — Add "What to Expect" + trust badge near form
9. `/company/technology` — Fix hero image, add cross-links
10. `/resources/service-areas` — Remove blobs, fix hero, add cross-links
11. `/our-process` — Add cross-links to services/projects

### Estimated file changes per wave:
- **Wave 1:** 3 files (WhySpecialtyContractor.tsx, specialty-contractor-comparison.ts, Careers.tsx)
- **Wave 2:** 1 file (Capabilities.tsx)
- **Wave 3:** 1 file + DB operations (Blog.tsx, delete Insights.tsx, 5 blog post DB inserts)
- **Wave 4:** 7 files (Prequalification.tsx, Projects.tsx, Contact.tsx, TechnologyInnovation.tsx, ServiceAreas.tsx, OurProcess.tsx, hero-images.ts)


# Public Site Cohesion Pass

Goal: every public page reads as one company, one voice, one visual system — anchored on Home, Services, and Projects as the standard.

## What's actually wrong (audit findings)

**Information Architecture**
- "Who We Serve" (Property Managers, Commercial Clients, Homeowners) is duplicated under both Markets and Company mega menus.
- "Markets" and "Company → Who We Serve" overlap with "Trade Partners" (GCs, Architects, Developers) — three menus, same audiences.
- "Trade Partners" label is ambiguous (reads as our suppliers; actually means GC/architect intake). Conflicts with the Trusted Partners roster on Contact.
- Capabilities, Why Specialty, Our Process sit under Company, but tell the core sales story — buried.
- 9 GTA service landing pages (Painting, Caulking, Tile, etc.) are not surfaced anywhere in nav.

**Visual consistency**
- Hero treatment drifts: some pages use `PageHero`, Capabilities/About inject custom `bg-[hsl(var(--ink))]` sections, Markets uses a custom `who-we-work-with` band. No shared section wrapper.
- Section padding, header alignment, card chrome, and proof-strip placement vary page to page.
- Reference pages (Home/Services/Projects) already follow the design-system foundation (SectionHeader, ProofStrip, unified Card, 8px radius, navy/charcoal, Inter). Others don't fully.

**Messaging & voice**
- No single narrative thread. Home positions "specialty contractor becoming GC + prime accountability"; secondary pages restart from scratch with different value props.
- Audience pages (Homeowners / PropertyManagers / CommercialClients / ForGCs / ForArchitects) repeat overlapping content without a clear "you are here / what's next" thread.

**Conversion paths**
- CTA labels vary: "Get Estimate", "Request Site Assessment", "Submit RFP", "Get Quote" mixed across pages.
- Some pages dead-end with no next step; others stack multiple competing CTAs.
- Mobile nav surfaces Estimate; desktop Trade Partners surfaces Submit RFP — inconsistent primary CTA.

## The plan

### 1. Information Architecture (one source of truth)

Collapse to 6 top-level nav items, no duplication:

```text
Services   Markets   Capabilities   Projects   Insights   Company
                                                          (+ Contact CTA)
```

- **Services** — unchanged (auto-built from registry); add a "GTA Service Pages" subsection so the 9 location/service landings are reachable.
- **Markets** — owns all audience pages: Commercial Clients, Property Managers, Developers, Homeowners, plus "For General Contractors" and "For Architects" as Industry Partners. This becomes the single home for audience routing.
- **Capabilities** — promoted to top-level. Houses Capabilities, Why Specialty, Our Process, Self-Perform, Partnership Models.
- **Company** — About, Certifications & Insurance, Technology, Careers, FAQ, Service Areas.
- Remove "Trade Partners" mega menu. Its actions (Submit RFP, Prequalification, Estimate, Contractor Portal) move into a persistent "Start a Project" CTA group reachable from any audience page and from the header CTA.
- Remove "Who We Serve" from Company menu (lives in Markets only).

### 2. Unified page template

Every public page (except Home, which is bespoke) renders the same shell:

```text
PageHero (image, eyebrow, H1, subhead, 1 primary + 1 secondary CTA, optional badges)
ProofStrip (always — same component, same metrics)
[Page-specific sections, each wrapped in <Section> with standardized padding]
Related links rail (3 cross-links to maintain cohesion)
Closing CTA band (one primary action, audience-appropriate)
Footer
```

Build/extend two shared components:
- `<Section>` — wraps every content band. Props: `tone` (`white | muted | ink`), `padding` (`md | lg`), `id`. Replaces ad-hoc `<section className="py-* bg-*">`.
- `<RelatedLinks>` — 3-card rail driven by a per-page config so cross-page navigation is consistent.

Refactor these pages onto the template:
About, Capabilities, Markets, ForArchitects, ForGeneralContractors, WhySpecialtyContractor, OurProcess, CommercialClients, PropertyManagers, Homeowners, CertificationsInsurance, Technology, ContractorPortal, ServiceAreas, FAQ, EmergencyRepair, Estimate, Prequalification, SubmitRFPNew, Careers, Blog, BlogPost, ProjectDetail.

### 3. Narrative thread

One sentence-level story applied across audience pages:

> Specialty trade contractor with prime contractor capability — self-perform 8+ trades, single-point accountability across the GTA, $2M CGL, evolving into a building-envelope-led general contractor.

- Every audience page opens with a one-line variant of this thread tailored to the reader (GC, architect, PM, owner, homeowner).
- "What's next" rail on every page points to: relevant Service → relevant Project → Start a Project.

### 4. CTA standardization

| Context                     | Primary CTA              | Secondary             |
|-----------------------------|--------------------------|-----------------------|
| Commercial / GC / Architect | Request Site Assessment  | Submit RFP            |
| Property Manager            | Request Site Assessment  | Emergency Repair      |
| Developer                   | Submit RFP               | Request Site Assessment |
| Homeowner                   | Request Estimate         | Call (647) 528-6804   |
| Service detail              | Request Site Assessment  | View Related Projects |
| Project detail              | Request Similar Project  | View All Projects     |
| Blog / FAQ                  | Request Site Assessment  | Contact               |

Header primary CTA: "Request Site Assessment" (replaces mixed Estimate/RFP labels). Mobile bottom CTA matches.

### 5. Proof + credibility consistency

- ProofStrip uses the same 4 metrics everywhere: 10-person self-perform crew, 15+ years crew experience, $2M CGL, GTA-wide.
- Honest claims enforced (no inflated stats).
- Every audience page surfaces the same Certifications & Insurance badge row above the closing CTA.

### 6. Cleanup pass

- Delete duplicate menu entries.
- Remove orphan/legacy sections inside refactored pages.
- Ensure all internal links use canonical paths (no leftover redirect targets in body copy).
- Verify SEO meta on each refactored page uses broad trade language and `SITE_URL` constant.

## Execution order

1. Nav config + mega-menu restructure (single PR-equivalent change to `navigation-structure-enhanced.ts` + MobileNavSheet).
2. Shared `<Section>` and `<RelatedLinks>` components.
3. Refactor audience pages (Markets hub + 5 audience pages) onto the template.
4. Refactor company-story pages (About, Capabilities, Why Specialty, Our Process).
5. Refactor utility pages (Certifications, Technology, ContractorPortal, ServiceAreas, FAQ, Careers).
6. CTA + ProofStrip sweep across all refactored pages.
7. Final pass: cross-link rails + closing CTAs.

## Out of scope (won't touch)

- Home, Services index, Projects index — already the standard.
- Admin pages, auth, dev/utility pages.
- Backend, RLS, edge functions.
- New content writing beyond the narrative thread one-liner and CTA labels.

## Risks / things to confirm with you before I start

1. **"Capabilities" as a top-level nav item** — agree to promote it out of Company?
2. **Killing the "Trade Partners" menu** — its actions move into a unified "Start a Project" CTA surface. OK?
3. **Single primary CTA = "Request Site Assessment"** for all B2B audiences — agree, or keep "Submit RFP" as primary for GC/architect?
4. **Audience pages stay separate** (Homeowners, PropertyManagers, CommercialClients, ForGCs, ForArchitects) — confirm you don't want any merged.

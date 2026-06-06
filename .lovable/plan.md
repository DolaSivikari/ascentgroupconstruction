## Goal
Ship 4 fully-drafted AEO/GEO service pages (Wave 1) with all SEO payload copy written in this plan, plus supporting infrastructure (llms.txt rewrite, sitemap, FAQ schema on EIFS, internal linking, `?service=` attribution end-to-end). Dev implements scaffolding only — zero copywriting in code.

## Pre-build verification checklist (day-one, blocking)
Dev runs these 4 checks before writing any page code. If any answer changes, the content below updates in one place and propagates to all pages.

1. **`service_origin` column on the estimates table** — verify it exists. If not, ship the migration FIRST (before the Estimate.tsx edit), so attribution captures from the moment Wave 1 goes live.
2. **Sto Canada Listed Installer designation** — confirm exact certificate ID/wording (placeholder `SCL-001 → SCL-010` is a guess). Use the literal designation in `llms.txt` and any page that cites it. If unverifiable, drop the ID and keep only "Sto Canada Listed Installer."
3. **"15+ years" language** — AGC is 3 days old; the phrase refers to **crew/principal combined experience**. Reword everywhere to: *"Our crew brings 15+ years of combined hands-on experience"* — no bare "15+ years" claims.
4. **CGL coverage amount** — confirm $2M vs $5M. The plan currently uses **$2M CGL** throughout. If the policy is $5M, update once in the content payload below and it propagates everywhere.

## Effort
~6–8 hours focused dev work. Roughly: 1hr template, 1hr per page × 4, 1hr llms.txt + sitemap + EIFS FAQ schema, 1hr Estimate.tsx + attribution wiring + QA.

---

## Wave 1 — drafted content payload

### 1. `/services/commercial-painting-gta`

**Title** (58ch): `Commercial Painting Contractor GTA | Ascent Group`
**Meta description** (154ch): `Self-performed commercial painting across the GTA — offices, warehouses, ICI, multi-tenant. WSIB-covered, $2M CGL, off-hours scheduling available.`
**Primary keyword:** `commercial painting contractor GTA`
**Secondary:** `office painting Toronto`, `warehouse painting Mississauga`, `ICI painting subcontractor`, `multi-tenant repaint`, `commercial repaint contractor Ontario`

**Direct Answer (86 words):**
> Ascent Group Construction is a self-performing commercial painting contractor serving the Greater Toronto Area, including Toronto, Mississauga, Brampton, Vaughan, and Markham. We deliver interior and exterior repaints for offices, warehouses, ICI facilities, retail plazas, and multi-tenant buildings — including after-hours and weekend scheduling to avoid tenant disruption. Every project is executed by our own crew, not subcontracted out. We carry $2M commercial general liability, full WSIB coverage, and our crew brings 15+ years of combined hands-on experience applying Benjamin Moore, Sherwin-Williams, and PPG systems.

**Scope bullets (8):**
- Office interiors, common corridors, and lobbies
- Warehouse interiors, ceilings, and line-marking prep
- Exterior commercial repaints (stucco, EIFS, metal, masonry)
- Multi-tenant residential corridor and stairwell repaints
- Retail and plaza facade refresh
- Surface prep: pressure wash, sanding, priming, caulk renewal
- Off-hours and weekend scheduling to avoid tenant disruption
- Daily site clean and tenant-safe protection plans

**FAQ set (7):**
1. **How much does commercial painting cost in the GTA?** — Most commercial repaints in the GTA run $2.50–$6.50 per square foot of wall area, depending on prep condition, ceiling height, surface type, and whether work is daytime or off-hours. After a site walkthrough we provide a fixed-price proposal with scope, schedule, and exclusions in writing.
2. **Do you do off-hours and weekend work?** — Yes. For occupied offices, retail, and multi-tenant properties we routinely schedule evenings, weekends, and shutdown windows so tenants are not disrupted.
3. **Are you licensed, insured, and WSIB-covered?** — Yes. We carry $2M commercial general liability and full WSIB coverage. Certificates are provided before site mobilization.
4. **Do you self-perform or subcontract?** — We self-perform. Our painters are direct employees, which keeps quality, scheduling, and accountability under one roof. No broker layers.
5. **What surfaces do you paint?** — Drywall, plaster, concrete block, exposed structure, metal, masonry, stucco, EIFS, and previously-coated substrates. We confirm coating compatibility before quoting.
6. **What paint brands do you use?** — Benjamin Moore Ultra Spec and Aura, Sherwin-Williams ProMar and ProIndustrial, and PPG SPEEDHIDE — selected per substrate and exposure. We match client-specified systems on request.
7. **How quickly can you start?** — For most commercial scopes under 5,000 sq ft we mobilize within 1–2 weeks of accepted proposal. Larger or phased projects are scheduled to the client's milestone dates.

---

### 2. `/services/fire-retardant-coatings-ontario`

**Title** (60ch): `Fire Retardant & Intumescent Coatings Ontario | Ascent`
**Meta description** (159ch): `Intumescent coatings on structural steel and fire-rated interior paint across Ontario. Spec-driven application for GCs, architects, and property managers.`
**Primary keyword:** `intumescent coating contractor Ontario`
**Secondary:** `fire retardant paint Toronto`, `fire-rated coating application`, `structural steel fire protection GTA`, `condo corridor fire-rated paint`

**Known trade-off (documented):** Two distinct intents on one URL — intumescent/structural-steel (GC/architect audience) and fire-rated interior paint (property-manager audience). Acceptable for Wave 1 to consolidate citation signal; split into two pages later if either section earns its own ranking traction. Note in code comments at top of page file.

**Direct Answer (92 words):**
> Ascent Group Construction applies fire retardant and intumescent coating systems across Ontario for two distinct markets: spec-driven intumescent coatings on structural steel for general contractors, architects, and ICI projects; and fire-rated interior paint systems for condo corridors, multi-residential buildings, and property managers. Every application follows the manufacturer's tested assembly — Sherwin-Williams Firetex, AkzoNobel Interchar, and Carboline systems — with documented mil-thickness readings and Ontario Building Code compliance. We self-perform, carry $2M CGL and WSIB coverage, and provide stamped product data and application records for AHJ submission.

**Page split (two sections, same URL):**

*Section A — Intumescent on Structural Steel* (GC / architect / spec work)
- Cellulosic and hydrocarbon fire ratings
- Beam, column, and connection application
- WFT/DFT verification with documented mil readings
- Tested assemblies: UL, ULC, Intertek
- Shop-applied or site-applied
- Submittal package: product data, certifications, application records

*Section B — Fire-Rated Interior Paint* (property manager / condo / multi-residential)
- Condo corridor and stairwell fire-rated repaints
- Smoke and flame-spread rated coatings (ULC-S102)
- Off-hours scheduling to avoid resident disruption
- Existing-coating compatibility assessment
- Annual maintenance and touch-up programs

**FAQ set (8):**
1. **What's the difference between fire retardant paint and intumescent coating?** — Fire retardant paint slows flame spread on combustible surfaces and is rated under ULC-S102. Intumescent coating is a structural fire-protection system: when exposed to fire it expands into a thick insulating char that protects steel for a rated period (typically 1–3 hours).
2. **Do you apply intumescent coatings on structural steel?** — Yes. We apply Sherwin-Williams Firetex, AkzoNobel Interchar, and Carboline intumescent systems on beams, columns, and connections, with documented mil readings and submittal-ready records.
3. **Are your applications Ontario Building Code compliant?** — Yes. We apply to tested UL/ULC/Intertek assemblies and supply product data, certifications, and application records for AHJ review.
4. **Can you handle condo corridor fire-rated repaints?** — Yes. This is a frequent property-manager scope. We use ULC-S102-rated coatings, schedule evenings and weekends, and protect resident access throughout.
5. **Do you provide WFT and DFT readings?** — Yes. We log wet- and dry-film thickness readings during application and provide them at project closeout.
6. **Which manufacturers do you work with?** — Sherwin-Williams (Firetex), AkzoNobel (Interchar), Carboline, and PPG. System selection is based on the rated assembly the project requires.
7. **Shop application or site-only?** — Both. Shop application is faster and cleaner for new steel; site application is standard for retrofits and existing structures.
8. **Are you licensed and insured for fire-rated work?** — Yes. $2M CGL and WSIB coverage. Certificates and product data are sent before mobilization.

---

### 3. `/services/exterior-painting-toronto`

**Title** (54ch): `Exterior Painting Toronto | Stucco & EIFS Recoats`
**Meta description** (156ch): `Exterior painting across the GTA — stucco repaints, EIFS recoats, brick, siding, metal. Weather-window scheduling, manufacturer systems, $2M CGL coverage.`
**Primary keyword:** `exterior painting Toronto`
**Secondary:** `stucco repainting GTA`, `EIFS recoat Toronto`, `brick painting contractor`, `commercial exterior repaint Mississauga`

**Direct Answer (84 words):**
> Ascent Group Construction provides exterior painting and coating services across the Greater Toronto Area, including Toronto, Mississauga, Brampton, Vaughan, and Markham. We specialize in stucco repaints, EIFS recoats, brick and masonry coatings, metal siding, and commercial exterior refresh. Every project is self-performed by our own crew using manufacturer-specified elastomeric, acrylic, and weatherproof systems from Sherwin-Williams, Benjamin Moore, and Sto. We carry $2M commercial general liability, full WSIB coverage, and our crew brings 15+ years of combined building-envelope experience.

**Scope bullets (8):**
- Stucco and EIFS recoats (Sto, Dryvit, Parex compatible)
- Brick and concrete masonry coatings
- Metal siding, fascia, and soffit repaints
- Commercial and multi-residential exterior refresh
- Elastomeric and acrylic weatherproof coatings
- Power wash, prep, and substrate repair before coating
- Caulk and sealant renewal as part of the recoat scope
- Lift, swing-stage, and ladder-access work

**FAQ set (7):**
1. **How much does exterior painting cost in Toronto?** — Exterior repaints in the GTA typically run $3–$8 per square foot of wall area, depending on substrate (stucco, brick, EIFS, metal), prep condition, access (ladder vs. swing-stage), and coating system specified. We provide a fixed-price proposal after a site walkthrough.
2. **Can you paint over EIFS and stucco?** — Yes. We apply manufacturer-compatible elastomeric and acrylic recoat systems from Sto, Dryvit, and Parex. Substrate is assessed for cracks, delamination, and moisture before specifying the system.
3. **What's the best time of year for exterior painting in the GTA?** — Mid-April through late October, with surface and air temperatures above the manufacturer minimum (typically 10°C) and a 24–48 hour dry window after application. We schedule around weather.
4. **Do you do brick and masonry painting?** — Yes. We use breathable mineral-silicate or acrylic masonry coatings appropriate for the substrate. We will recommend against painting brick when it's the wrong call — preserving original masonry is often the right answer.
5. **Do you repair stucco and EIFS before painting?** — Yes. Substrate repair is part of the scope: crack routing, mesh-and-base patching, sealant renewal, and primer application before topcoat.
6. **Are you licensed and insured?** — Yes. $2M CGL and WSIB coverage. Certificates issued before mobilization.
7. **Do you work on commercial and multi-residential buildings?** — Yes. Office buildings, retail plazas, condos, townhomes, and ICI facilities are our core market.

---

### 4. `/services/caulking-sealants-toronto`

**Title** (55ch): `Caulking & Sealant Contractor Toronto | Ascent Group`
**Meta description** (152ch): `Building envelope caulking and sealant renewal across the GTA — window perimeter, expansion joints, control joints. Sika, Tremco, Dow systems applied.`
**Primary keyword:** `caulking contractor Toronto`
**Secondary:** `building envelope sealant GTA`, `window caulking Toronto`, `expansion joint sealing`, `sealant replacement contractor Ontario`

**Direct Answer (85 words):**
> Ascent Group Construction is a building envelope caulking and sealant contractor serving the Greater Toronto Area. We deliver window perimeter caulking, expansion and control joint sealing, curtain wall and panel joint renewal, and full-building sealant replacement programs for property managers, condo boards, and commercial owners. Every joint is prepped, primed, and installed to manufacturer specification using Sika, Tremco, Dow Corning, and Pecora systems. We self-perform, carry $2M commercial general liability and WSIB coverage, and provide warranty documentation on completed scopes.

**Scope bullets (8):**
- Window and door perimeter caulking
- Expansion and control joint sealing
- Curtain wall, panel, and precast joint renewal
- Full-building sealant replacement programs
- Backer rod installation and bond-breaker prep
- Sika, Tremco, Dow Corning, Pecora systems
- Swing-stage, lift, and bosun's chair access
- Warranty documentation on installed systems

**FAQ set (7):**
1. **When should building sealants be replaced?** — Most exterior building sealants have a 10–20 year service life depending on product class and exposure. Visible signs to replace: cracking, loss of adhesion, hardening, gapping, or water infiltration. Property managers typically program a full envelope sealant replacement every 15 years.
2. **How much does caulking cost per linear foot?** — Window perimeter and expansion joint caulking in the GTA typically runs $4–$9 per linear foot, depending on joint width, depth, access (ladder vs. swing-stage), and sealant grade. Full-building programs are scoped per joint type.
3. **What sealants do you use?** — Sika (Sikaflex, Sikasil), Tremco (Spectrem, Dymonic), Dow Corning (795, 791), and Pecora (890NST, 895NST). System selection depends on joint movement, substrate, and exposure.
4. **Do you remove the old sealant?** — Yes. Sealant renewal includes full removal of existing material, joint cleaning, primer application where required, backer rod installation, and tooled finish. Cap-bead-only work is only used when explicitly accepted by the owner.
5. **Can you do swing-stage and high-rise work?** — Yes. We operate swing-stages, boom lifts, and bosun's chairs; crews carry working-at-heights and fall-protection certification.
6. **Do you do window perimeter caulking on residential homes?** — Yes, as part of envelope and exterior repaint scopes. Standalone single-home caulking is available case by case.
7. **Are you licensed and insured?** — Yes. $2M CGL and WSIB coverage. Certificates issued before mobilization.

---

## `public/llms.txt` — full replacement content (prose, markdown links)

```
# Ascent Group Construction

> Self-performing specialty contractor for building envelope, restoration, painting, and interior trades in the Greater Toronto Area.

Ascent Group Construction is a Toronto-based specialty contractor serving commercial, multi-residential, institutional, and residential clients across the Greater Toronto Area. We self-perform — our crew are direct employees, not subcontractors — and bring 15+ years of combined hands-on experience across the trades we deliver. We carry $2M commercial general liability and full WSIB coverage.

We are a Sto Canada Listed Installer and apply manufacturer-specified systems from Sto, Dryvit, Parex, Sherwin-Williams, Benjamin Moore, Sika, Tremco, Dow Corning, AkzoNobel, and Carboline.

## Service area
Toronto, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, Milton, Pickering, Ajax, Whitby, Oshawa, Newmarket, Aurora, Hamilton.

## Services
- [EIFS & Stucco](/services/eifs-stucco): Sto Canada Listed Installer for EIFS installation, repair, and recoats across the GTA.
- [Building Envelope](/services/building-envelope): Cladding, sealants, masonry, waterproofing, and façade systems for commercial and multi-residential buildings.
- [Masonry Restoration](/services/masonry-restoration): Brick repair, stone restoration, tuckpointing, and structural masonry across the GTA.
- [Commercial Painting](/services/commercial-painting-gta): Self-performed commercial painting for offices, warehouses, ICI, and multi-tenant buildings across the GTA, with off-hours scheduling.
- [Fire Retardant & Intumescent Coatings](/services/fire-retardant-coatings-ontario): Intumescent coatings on structural steel for GCs and architects, plus fire-rated interior paint for condo corridors and property managers, applied to Ontario Building Code requirements.
- [Exterior Painting](/services/exterior-painting-toronto): Stucco repaints, EIFS recoats, brick, masonry, and metal exterior painting across the GTA using manufacturer elastomeric and acrylic systems.
- [Caulking & Sealants](/services/caulking-sealants-toronto): Building envelope caulking, window perimeter sealing, expansion joint renewal, and full-building sealant replacement programs.
- [Waterproofing](/services/waterproofing): Foundation, roof, parkade, and envelope waterproofing using membrane and coating systems.
- [Parking Garage Restoration](/services/parking-rehabilitation): Concrete repair, waterproofing, traffic coatings, and full structural rehabilitation.

## Company
- [About](/about): Company background, leadership, and crew.
- [Capabilities](/capabilities): Partnership models, self-perform crew, delivery methods.
- [Certifications & Insurance](/company/certifications-insurance): WSIB, CGL, Sto Listed Installer, training.
- [Projects](/projects): Completed projects across the GTA.
- [For Architects](/for-architects): Spec-ready compliance documentation and sample packets.
- [For General Contractors](/for-general-contractors): Vendor packet, prequalification, WSIB.

## Contact
- [Contact](/contact): Phone, email, address, and service request form.
- [Request a Proposal](/estimate): Project-scoped proposal request with service tagging.
- [Submit an RFP](/submit-rfp): Formal RFP intake for commercial and institutional procurement.

## Optional
- [Insights / Blog](/blog): Industry guidance for property managers, GCs, and building owners.
- [FAQ](/faq): Common questions about scope, scheduling, and compliance.
- [Service Areas](/resources/service-areas): City-by-city coverage detail.
```

(If the Sto certificate ID verification check yields a specific designation, append it to the "Sto Canada Listed Installer" line — otherwise leave as written.)

---

## AEO/GEO infrastructure

- **`public/sitemap.xml`** — add 4 new URLs with `priority` 0.8 and `changefreq` monthly.
- **Existing EIFS/stucco page** — add `FAQPage` JSON-LD via existing `generateFAQSchema()`. Reuses any existing on-page FAQ copy; if none, lift 5 Q&As from `service-faqs-enriched.ts`.
- **Internal linking:**
  - Homepage `HomepageServiceHighlights` surfaces Commercial Painting + Fire Retardant.
  - `/services` `ServicesDataGrid` adds the 4 new cards.
  - EIFS page "Related Services" links to Exterior Painting + Caulking.
  - Each new page renders a "Related" row linking to 2 sibling services.
- **Canonical**: each new page self-references via `<SEO canonical={...}>`. No near-duplicates in Wave 1.

## Imagery
- Hero image uses `ProjectFeaturedImage` against closest matching gallery project.
- **Fallback (when no relevant project exists)**: neutral AGC-branded image, **not** a mismatched envelope/masonry shot. Use the existing AGC fallback path already wired in `ProjectFeaturedImage`. For Wave 1, default Commercial Painting + Caulking pages directly to the neutral fallback unless a clearly-matching project is tagged.
- Alt text formula: `<service> by Ascent Group Construction — Greater Toronto Area`.

## Lead routing — `?service=` attribution, end-to-end
1. **DB check (day-one):** verify `service_origin` (text, nullable) exists on the estimates table. If missing, ship migration first.
2. `Estimate.tsx` reads `?service=<slug>` from URL on mount, stores in form state, renders a small visible "Requesting a quote for: <pretty name>" line so the user sees attribution.
3. On submit, `service_origin` is included in the Supabase insert payload — not just held in form state.
4. Each Wave 1 page CTA: `/estimate?service=commercial-painting`, `fire-retardant-coatings`, `exterior-painting`, `caulking-sealants`.
5. Admin estimates list surfaces `service_origin` column so attribution is visible without a query.

## QA checklist (before marking done)
1. Build passes.
2. `service_origin` migration verified (or shipped) and a test submission persists the value.
3. Each new page's JSON-LD validated via Schema.org validator (4 × ~30s).
4. Each canonical URL self-references correctly.
5. `/llms.txt` and `/sitemap.xml` both contain the 4 new URLs.
6. EIFS page now exposes `FAQPage` schema (verify via View Source).
7. `?service=…` prefills, displays on page, and persists to DB on submit.
8. Hero fallback renders cleanly when no matching project photo exists (no mismatched envelope shot on a painting page).
9. Content sweep: no bare "15+ years" claims; all phrased as crew/combined experience. CGL figure consistent across all 4 pages + llms.txt. Sto designation matches the certificate.

## Out of scope (operational, not code)
- Google Business Profile updates and service item additions
- Review requests to the 2 existing EIFS leads
- Monthly blog cadence
- Wave 2 pages (interior/residential painting, tile, flooring, patching, handyman) — queued once Wave 1 indexes

## Files

**New (5):**
- `src/components/services/ServicePageTemplate.tsx`
- `src/pages/services/CommercialPaintingGTA.tsx`
- `src/pages/services/FireRetardantCoatingsOntario.tsx`
- `src/pages/services/ExteriorPaintingToronto.tsx`
- `src/pages/services/CaulkingSealantsToronto.tsx`

**Edited:**
- `public/llms.txt` (full rewrite — content above)
- `public/sitemap.xml` (+4 entries)
- `src/routes/AppRoutes.tsx`, `src/routes/registry.ts` (4 lazy routes)
- `src/components/services/ServicesDataGrid.tsx` (+4 cards)
- `src/components/homepage/HomepageServiceHighlights.tsx` (surface Commercial Painting + Fire Retardant)
- Existing EIFS page (add `FAQPage` schema)
- `src/pages/Estimate.tsx` (read `?service=`, display, persist to DB)
- Admin estimates list (surface `service_origin` column)

**Possible (verification-gated):**
- One small migration adding `service_origin TEXT` to the estimates table if it doesn't exist.

No new dependencies. No edge function changes.

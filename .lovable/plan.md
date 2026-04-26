## Page-by-Page Enhancement Plan — Ascent Group Construction

I audited all ~28 public pages. Below is a per-page plan with **what's there now**, **what's weak**, and **specific improvements** across the four lenses you picked: **Content Density · Conversion & CTAs · Visual/UX Polish · SEO/AEO Depth**. Crowded pages get **tabs/accordion reorganization**. We'll build a small set of **shared components first** so every page upgrade is fast and consistent.

---

### Phase 0 — Shared building blocks (build once, reuse everywhere)

These eliminate 80% of the per-page work and guarantee consistency.

1. **`<DetailCard>`** — richer card variant with optional: icon, title, description, expandable "More detail" accordion, badge, sub-stats row, CTA link. Replaces the dozens of bespoke card markup blocks.
2. **`<TabbedSections>`** — accessible tab-strip wrapper (uses existing Radix Tabs) for pages we're reorganizing (Capabilities, About, FAQ, Contractor Portal, ServiceDetail).
3. **`<StickyPageNav>`** — right-rail or sticky-top in-page anchor nav for long pages (auto-builds from `<section id>` headings).
4. **`<StickyInquiryBar>`** — bottom bar that slides in on scroll past the hero on audience/service pages: phone + "Request Site Assessment" + close. One unified component, page-prop driven.
5. **`<InlineLeadForm>`** — compact 4-field form (name, email, phone, scope) for embedding mid-page on audience pages instead of always pushing to `/contact`.
6. **`<FAQAccordion>`** — drop-in accordion that takes a `faqs` array AND auto-emits `FAQPage` schema. Today this logic is duplicated on FAQ.tsx, Homeowners.tsx, ServiceDetail.tsx, etc.
7. **`<TrustRibbon>`** — slim horizontal trust strip (WSIB · $2M CGL · 15+ yrs · 85% self-perform · Sto Listed) with icons. Different from the existing `ProofStrip` — meant to sit just under the hero on every key page (it's currently inconsistent or missing).
8. **`<RelatedLinksGrid>`** — 3-up "you may also be interested in" cross-link grid (already exists ad-hoc on OurProcess, Capabilities — unify it).
9. **`<PeopleAlsoAsk>` augmentation** — extend the existing component to render schema + visible accordion for AEO/voice search on every audience and service page.
10. **`useOnPageNav` hook** — observes `<section id>` elements to highlight the current section in `<StickyPageNav>`.

Estimated effort for Phase 0: ~1 day. Saves multiple days across the 28 pages.

---

### Tier 1 — Highest-traffic conversion pages

#### 1. **Index (Homepage)** `src/pages/Index.tsx`
**Now:** Strong — Hero, ProofStrip, ServiceHighlights, WhoWeServe, FeaturedProjects, Parallax, WhyChooseUs, InteractiveCTA, FinalCTA.
**Weak:** No testimonials section above the fold; no "Recent Insights" blog teaser; no in-page anchor nav; metric stats only appear once.
**Improvements:**
- **Content density:** Add a 3-card **"Recent Insights"** block pulling latest 3 published `blog_posts` (above FinalCTA). Add a **Testimonials carousel** (or `VideoTestimonials` already in repo) between FeaturedProjects and ParallaxBreak.
- **Conversion:** Add `<StickyInquiryBar>` after hero. Add a small **"By the numbers"** mini-stats band right under the hero (Projects completed this year, Avg response time, Repeat-client %) using DB counts.
- **Visual:** Tighten zone transitions — remove the abrupt `bg-muted/30 → parallax → bg-muted/30` re-entry by promoting WhyChooseUs into a single dark "value" section after the parallax.
- **SEO/AEO:** Add `LocalBusiness` schema with `geo` coordinates + opening hours; add 3 voice-FAQ items to the page.

#### 2. **Markets** `src/pages/Markets.tsx` (currently only ~110 lines — thin)
**Now:** Hero, 5 segment cards, CTA.
**Weak:** No depth between hero and CTA; no proof, no industry data, no "how to choose us by sector" helper.
**Improvements:**
- **Content density:** Add **"Sector at a glance"** comparison table (rows: typical scope size, decision-maker, response SLA, common services). Add **icon strip of 8 sub-sectors** under the segment cards (Office, Retail, Hospitality, Healthcare, Education, Industrial, Multi-Res, Mixed-Use). Add a **TrustRibbon** under hero.
- **Conversion:** Each `SegmentCard` already has `href` — add a hover-revealed mini CTA "See services →".
- **Visual:** Switch the 5-card grid to a **2-row asymmetric layout** (Property Managers + GCs as larger primary cards = our two prime markets per memory).
- **SEO/AEO:** Add `ItemList` schema for the 5 segments; 4 voice-FAQ items ("Who do you serve?", "Do you work with GCs as a sub?", etc.).

#### 3. **Services** `src/pages/Services.tsx` (only 63 lines — thinnest of all)
**Now:** Hero + ServicesDataGrid + ProcessSnapshot + CTA. Very bare.
**Weak:** No category framing; no "by-category" filter; no comparison; no proof; no PAA.
**Improvements:**
- **Content density:** Add a **category intro section** (Envelope · Restoration · Interior — 3 large cards) that scrolls the grid below to the matching filter. Add a **"How to scope your work"** callout. Add **"Materials & systems we use"** logo wall (Sto, Dryvit, Parex, Benjamin Moore, Sherwin-Williams).
- **Conversion:** Sticky scope-filter sub-nav, `<InlineLeadForm>` mid-page.
- **Visual:** Use `<DetailCard>` with expandable "What's included" instead of forcing every service to a child page. Add hover image preview from `service.featured_image`.
- **SEO/AEO:** `ItemList` schema of all services; PAA block; voice-FAQ.

#### 4. **About** `src/pages/About.tsx` (~493 lines — borderline crowded)
**Now:** Hero, Identity, ProofStrip, Founder dark section, Values, Self-Perform, Audiences, 5-Step Process, Regions, Cross-links, CTA.
**Weak:** Long single-scroll page; too much "narrative" before useful sections; service icon grid duplicates `/services`.
**Improvements:**
- **Reorganize with tabs:** Convert into **5 tabbed sections** under the hero: `Story` · `Founder` · `Values` · `Capabilities` · `Service Areas`. Hero stays + `TrustRibbon` + `<StickyPageNav>`.
- **Content density:** Add a **"Timeline / milestones"** card row inside Story tab (Founded 2025, Sto certified, $2M CGL, etc.). Add a **"Our crew"** small grid (anonymized roles + years experience) inside Founder tab.
- **Conversion:** Replace duplicate "View All Services" button with `<RelatedLinksGrid>` linking to Capabilities + Projects + Prequalification.
- **SEO/AEO:** Already has `HowToSchema` + breadcrumbs — add `Organization` schema with `founder`, `numberOfEmployees`, `slogan`, `award`.

#### 5. **Contact** `src/pages/Contact.tsx` (~383 lines)
**Now:** Hero, pathway cards, big form, info sidebar, what-to-expect card, partners.
**Weak:** Form is heavy — 7 fields visible all at once intimidates. Map is below the fold. No live response indicator.
**Improvements:**
- **Conversion:** Progressive form — show name/email/message first, reveal phone/company in step 2. Add **"Avg response time: 4 hours"** indicator (from DB stats). Add **calendar booking link** (Calendly-style) as a 4th pathway card.
- **Content density:** Promote map + office details into a 2-column block right under pathway cards. Add **"Departments to email"** mini-card (general / projects / careers / accounts).
- **Visual:** Split layout — sticky info sidebar that scrolls with the form on desktop.
- **SEO/AEO:** `ContactPoint` schema array (general, projects, emergency); "Where are you based?" voice-FAQ.

#### 6. **Capabilities** `src/pages/Capabilities.tsx` (~431 lines — crowded)
**Now:** Hero, dark "Why self-perform", Partnership Models, tabbed scope chips, Delivery Methods, Project Capacity, ProofStrip, Cross-links.
**Weak:** Long scroll; tabs already exist for scopes but not for the page itself.
**Improvements:**
- **Reorganize with tabs:** Wrap the 4 main mid-sections in **page-level tabs**: `Self-Perform Model` · `Partnership Models` · `Trade Capabilities` · `Capacity & Bonding`. Hero + dark section + sticky tab strip + final CTA stay outside.
- **Content density:** Add **"Equipment & access"** card (swing stages, scaffold partners, lifts) inside Capabilities tab. Add a **bonding capacity progress bar** ($X current / $Y target).
- **Visual:** Move the chips grid into a **2-column lockup** with a representative image per scope.
- **SEO/AEO:** `Service` schema array; voice-FAQ for "What does self-perform mean?".

#### 7. **OurProcess** `src/pages/OurProcess.tsx`
**Now:** Hero, ProofStrip, 7-step animated timeline, 3 cross-links, CTA.
**Weak:** Timeline is dense; no per-step deliverable visualization; no downloadable checklist.
**Improvements:**
- **Content density:** Below the timeline, add a **"What we deliver at each step"** deliverable matrix (steps × deliverable types as a checkmark grid). Add a **"Downloadable: Project Kickoff Checklist (PDF)"** card.
- **Conversion:** "Book a 30-min discovery call" CTA inside Step 1 card.
- **Visual:** Add a **horizontal phase bar** above the timeline (Phase 1: Discovery → Phase 2: Mobilize → Phase 3: Deliver → Phase 4: Closeout) so the 7 steps are mentally chunked.
- **SEO/AEO:** Already has HowTo. Add `BreadcrumbList`, voice-FAQ "How long does the process take?".

#### 8. **Projects** `src/pages/Projects.tsx`
**Now:** Hero, FilterBar, project grid w/ realtime, advanced filters, CTA.
**Weak:** Filter UX is busy on top; no "by service" filter; no map view.
**Improvements:**
- **Content density:** Add a **"Featured case studies"** carousel above the grid (top 3 projects with metrics). Add a **stats banner** under hero (Total projects, Sectors served, On-time completion %).
- **Conversion:** "Have a similar project? Submit RFP" inline CTA between rows.
- **Visual:** Convert advanced filters into a **collapsible "More filters"** drawer to clean the top. Add a **GTA map view toggle** showing project pins (use existing `serviceAreaCities`).
- **SEO/AEO:** `CollectionPage` schema; per-card `microdata`.

---

### Tier 2 — Audience & specialty pages

#### 9. **PropertyManagers** `src/pages/PropertyManagers.tsx`
**Now:** Hero, Benefits, Services-with-ROI, Process, ProofBar, CTA.
**Improvements:**
- Add **"Reserve fund study alignment"** explainer card. Add **"Volume / portfolio pricing"** info block. Add **case-study mini-card** (one anonymized PM win).
- `<StickyInquiryBar>`, `<InlineLeadForm>` after Process.
- Convert ROI cards to `<DetailCard>` with expandable scope details.
- Add `Service` schema per ROI service; voice-FAQ "Do you work with reserve fund studies?".

#### 10. **CommercialClients** `src/pages/CommercialClients.tsx`
**Now:** Benefits, Industries, Process, ProofBar, CTA.
**Improvements:**
- Add **"Tenant communication kit"** card (template letters, signage). Add **after-hours pricing transparency** block.
- Inline form, sticky bar.
- Industry cards become `<DetailCard>` with "common scopes" sub-list.
- `Service` schema, PAA block.

#### 11. **Homeowners** `src/pages/Homeowners.tsx` (~402 lines, has FAQ)
**Now:** Hero, Why-Choose, Service grid w/ pricing & timeline (great), Process, FAQ, CTA.
**Improvements:**
- Add **"Financing partners"** strip (if applicable) or **"Why us vs handyman"** comparison.
- Add **"Recent residential projects"** mini grid (filtered by category=Residential).
- Sticky free-estimate CTA.
- Service grid is already `<DetailCard>`-shaped — wire up the new component for consistency.
- Already has FAQ — convert to shared `<FAQAccordion>` for schema emit.

#### 12. **ForGeneralContractors** `src/pages/ForGeneralContractors.tsx`
**Improvements:**
- Add **"Trade packages we self-perform"** detail accordion. **"Sample submittal package"** download card. **"References available on request"** trust block with contact CTA.
- Sticky "Add Us to Your Bid List" CTA.
- Convert long scope lists to tabbed view (Envelope / Interior / Restoration).
- `Service` schema + "What's your bonding capacity?" voice-FAQ.

#### 13. **ForArchitects** `src/pages/ForArchitects.tsx`
**Improvements:**
- Add **"Specifications library"** card (Sto, Dryvit, Parex spec sheets). **"AIA presentation availability"**. **"Mock-ups & samples"** offering.
- Add **CSI MasterFormat division reference grid** (03 30 00, 04 22 00, 07 24 00, etc.) — architects search by these.
- Inline "Request a lunch & learn" form.
- Tabs: `Materials` · `Building Science` · `Standards` · `Collaboration`.

#### 14. **company/Developers** `src/pages/company/Developers.tsx`
**Improvements:**
- Add **"Multi-phase delivery"** explainer. **"Procurement integration"** card. **"Warranty & turnover packages"**.
- Inline form. Sticky CTA.
- Convert benefit grid to `<DetailCard>` with case-study links.

#### 15. **EmergencyRepair** `src/pages/EmergencyRepair.tsx`
**Improvements:**
- **Massive phone CTA** at top + sticky bottom call bar (mobile-first).
- Add **"What to do before we arrive"** checklist card. **"Insurance claim documentation"** offer. **"Coverage map"** (primary cities highlighted).
- Add **24/7 status indicator** (green dot + "Crew on call").
- `EmergencyService` schema; "How fast can you respond?" voice-FAQ.

#### 16. **WhySpecialtyContractor** `src/pages/WhySpecialtyContractor.tsx`
**Improvements:**
- Already has comparison table — reorganize into **tabbed view**: `Comparison` · `Cost Breakdown` · `Scenarios` · `FAQ`.
- Add **interactive cost calculator** (slider: project size → est. savings vs GC markup).
- Schema emit for FAQ; PAA block.

#### 17. **resources/ServiceAreas** `src/pages/resources/ServiceAreas.tsx`
**Improvements:**
- Add a **real interactive GTA map** at top (SVG or Leaflet) with hoverable city pins linking to `LocationPage`.
- Add **"Response time matrix"** (city × service tier).
- Add **"Recent projects in your area"** mini-grid filtered by location prop.
- `Place` schema array; voice-FAQ.

#### 18. **resources/LocationPage** `src/pages/resources/LocationPage.tsx` (dynamic per-city)
**Now:** Already 566 lines — substantial. Per-city description, services, projects.
**Improvements:**
- Add **per-city map embed** (Google Maps embed centered on city). **Local stats** (population, # high-rises, common building types). **Local building code references**.
- Add **"Other cities nearby"** cross-link grid.
- Per-city `LocalBusiness` + `Place` + `BreadcrumbList` schema. Per-city PAA.

#### 19. **resources/ContractorPortal** `src/pages/resources/ContractorPortal.tsx` (~483 lines — crowded)
**Reorganize with tabs:** `Pre-Qual Documents` · `Insurance & Safety` · `Vendor Packet` · `Submit Pre-Qual`.
**Improvements:** Add **document update timestamps** per file. Add **"Watch our 2-min capability video"** card. Sticky "Submit Pre-Qual" CTA.

---

### Tier 3 — Content & supporting pages

#### 20. **Blog** `src/pages/Blog.tsx`
**Improvements:**
- Add **"Topic lanes"** strip (Building Envelope · Restoration · GC Insights · Property Mgmt · Project Stories) per memory.
- Add **"Editor's picks"** sidebar. **Reading-time + author** on every card (already calc'd).
- Add **search bar** + **tag filter** (currently only category).
- `Blog` + `BlogPosting` schema (per-post on detail).

#### 21. **BlogPost** `src/pages/BlogPost.tsx`
**Improvements:**
- Add **sticky table-of-contents** (auto from `<h2>`). **Reading progress bar**. **"Related posts"** by category. **"Talk to us about this topic"** inline CTA.
- `Article` schema with `author`, `datePublished`, `dateModified`, `image`.

#### 22. **FAQ** `src/pages/FAQ.tsx` (~479 lines — crowded)
**Reorganize with tabs:** Tab strip per `faqCategories` (General · Pricing · Process · Materials · Service Areas · Safety) — keeps page tight.
**Improvements:** Add **search bar that filters across all categories**. Add **"Still have questions?"** inline form per tab. Convert hardcoded FAQs to DB-driven (admin-editable) — already a memory pattern. `FAQPage` schema is presumably emitted; verify.

#### 23. **Careers** `src/pages/Careers.tsx`
**Improvements:**
- Add **"What working here looks like"** image collage. **"Day in the life"** quote cards. **"Benefits"** card grid (paid PPE, training budget, WSIB premium-zero, etc.).
- Per memory: keep "expression of interest" model — but add a **"Roles we're actively hiring for"** dynamic strip when DB has open roles.
- `JobPosting` schema (per role when populated).

#### 24. **company/CertificationsInsurance** `src/pages/company/CertificationsInsurance.tsx`
**Improvements:**
- Already DB-driven. Add **"Verify our coverage"** explainer with WSIB clearance lookup link. **"Certificate of Insurance request form"** (email-triggered).
- Group documents into **tabs by category**: Insurance · Licenses · Manufacturer Certs · Memberships · Safety.

#### 25. **company/Technology** `src/pages/company/Technology.tsx`
**Improvements:**
- Already an "intelligence layer" per memory. Add **case-study links** per tool (which projects used Procore, BIM 360, etc.). Add **"How this benefits clients"** translation cards.
- Add `BreadcrumbList` and FAQ schemas.

#### 26. **Estimate** `src/pages/Estimate.tsx` (~559 lines — multistep wizard, working)
**Improvements:**
- Already strong UX. Add **"Save & continue later"** (email a resume link). **Progress save indicator**. **"What happens next"** card visible alongside steps. **Inline help tooltips** for technical fields.
- After-submit success panel: add **"Book a discovery call"** secondary action.

#### 27. **SubmitRFPNew** `src/pages/SubmitRFPNew.tsx` (~511 lines — multistep)
**Improvements:**
- Same as Estimate: save & continue, success panel CTAs.
- Add **"Drag & drop spec uploads"** hint, file type/size guide, supported formats.
- Add **"What we'll respond with"** preview card (timeline + sample proposal page).

#### 28. **Prequalification** `src/pages/Prequalification.tsx` (~526 lines)
**Improvements:**
- Reorganize with **stepper UI** (currently long single form).
- Add **"Sample our prequal package"** download for quick credibility.
- Sticky "Save Progress" + auto-save to local storage.

#### 29. **Accessibility** `src/pages/Accessibility.tsx`
**Improvements:** Verify all WCAG/AODA language is current; add **last-reviewed date**; add **"Report an issue"** inline form (not just an email link).

#### 30. **Privacy / Terms** `src/pages/Privacy.tsx`, `src/pages/Terms.tsx`
**Improvements:** Add **table of contents sidebar**, **"Last updated"** banner, anchor links per section, plain-language summary callouts at the top of dense sections. Same treatment for both.

---

### Cross-cutting changes (apply to all pages)

- **Hero TrustRibbon under every PageHero** (currently inconsistent)
- **`<StickyInquiryBar>` on all audience + service pages** (PropertyManagers, Commercial, Homeowners, Architects, GCs, Developers, EmergencyRepair, ServiceDetail, LocationPage)
- **`<RelatedLinksGrid>` before every Footer** (currently ad-hoc)
- **PAA + voice-FAQ schema** on every page that doesn't have one (currently only ServiceDetail and FAQ)
- **`BreadcrumbList` schema everywhere** (currently inconsistent)
- **`<StickyPageNav>` on pages > 350 lines**
- **Image strategy:** Audit `featured_image` use; add `OptimizedImage` `aspect-ratio` and lazy where missing; use `webp` variants

---

### Suggested execution order (4 sprints, ~4 weeks)

**Sprint 1 — Foundation (Phase 0)**
Build all 10 shared components + add `TrustRibbon` to every Tier-1 page.

**Sprint 2 — Tier 1 (8 pages)**
Index, Markets, Services, About (tabbed), Contact, Capabilities (tabbed), OurProcess, Projects.

**Sprint 3 — Tier 2 audience pages (10 pages)**
PropertyManagers, Commercial, Homeowners, GCs, Architects, Developers, EmergencyRepair, WhySpecialty (tabbed), ServiceAreas, LocationPage, ContractorPortal (tabbed).

**Sprint 4 — Tier 3 + polish (12 pages)**
Blog, BlogPost, FAQ (tabbed), Careers, Certifications, Technology, Estimate, RFP, Prequalification, Accessibility, Privacy, Terms + dynamic ServiceDetail / ProjectDetail templates + global SEO/AEO sweep.

---

### What I'll need from you to start

After you approve, I'll begin with **Sprint 1** (shared components), then check in before each subsequent sprint so we don't run away with scope. If you want, we can also:
- Drop the dynamic detail-template work to Sprint 5 (lower priority)
- Skip Tier 3 legal pages if you'd rather keep them as-is
- Pull forward EmergencyRepair if 24/7 conversion is a priority

Reply with any tweaks, or hit **Approve** to switch me to build mode and begin Sprint 1.
# 03 — Page-by-page audit (Phase 3)

Audited: Ascent Group Construction website repository (read-only). Companion files: `01-REPORT.md` (inventory and run results), `02-FINDINGS.md` (prioritised table; IDs such as **F-01** below refer to it), `04-INBOX-READINESS.md`.

## How to read this document

- **Facts** are things I read in the code (file:line) or observed in the headless-Chromium run (1440 px and 390 px, database and third-party calls blocked). **Opinion** is labelled "Impression" or "Assessment" and is my judgement from the GC-estimator and property-manager point of view; it is not measured.
- **Unknown** means the repository cannot answer it. Each Unknown says what would answer it.
- **Database-driven content.** The run had no database, so pages built from Supabase rows (service detail pages, projects, project detail, blog, testimonials, "Why Property Owners Choose Us", contact/footer settings, document downloads, certifications settings) were audited from code. What they show with real data is Unknown; the live site or a read-only look at the tables would answer it.
- **Capture note.** Section slices in `screenshots/sections/` were taken with a slow scroll so scroll-triggered fade-ins completed. The last slice of a page may repeat the fixed header; that is a full-page-screenshot artefact. An earlier version of this audit mistook fade-in timing for "blank database sections"; that was corrected in `01-REPORT.md` section 2.3.
- Heading lists below come from the rendered DOM inside `<main>`. Some pages put their H1 in a hero outside `<main>`; the per-route H1 for all 34 routes is in `01-REPORT.md` section 2.5.
- Screenshots: `screenshots/<page>-desktop.png`, `-mobile.png`, and `screenshots/sections/`.

---

# Part A — Shell shared by every page

| Part | Component | Facts |
|---|---|---|
| Header | `src/components/Navigation.tsx` | Desktop: logo, About ▾, Capabilities ▾, Services ▾, Markets ▾, Projects, Insights, Contact, theme toggle, an orange "Start a Project ▾" menu. Phone number: only at `lg` width and above, and only when `useCompanySettings()` returns a phone (`Navigation.tsx:343-356`; the hook falls back to `COMPANY_PHONE` only when a settings row exists, `useCompanySettings.ts:51`). Mobile: logo and menu button; the phone appears only inside `navigation/MobileNavSheet.tsx:125`. Text is white while the page is at top on "hero pages" (`Navigation.tsx:103,167,179`). |
| Cookie banner | `src/components/CookieBanner.tsx:56` | Fixed bottom, two paragraphs, "Accept All / Reject Analytics". Covers the lower third of a 390x844 screen and the lower ~190 px at 1440x900 (**F-20**). "Reject" does not stop Google Analytics (**F-16**). |
| Sticky bar | `src/components/StickyInquiryBar.tsx:19-29` | After 600 px of scroll, a bottom bar with a call button and "Submit RFP". Hidden on `/admin`, `/estimate`, `/contact`, `/submit-rfp`, `/login`, `/auth`. |
| Footer | `src/components/Footer.tsx` → `footer/UnifiedFooter.tsx` | Columns Company, Services, Resources, "Start a Project" (Submit RFP, Request Estimate, `info@` email, phone). Legal row: "© 2026 Ascent Group Construction. All rights reserved. WSIB Compliant • Fully Insured". Also contains two `<SEO>` elements that override every page's title (**F-01**). |
| Skip link, ErrorBoundary, scroll-to-top | `src/App.tsx:50-76` | Present. |

**Impression.** The shell is competent. Its weaknesses are the first-screen costs on a phone: no phone number in the header bar, and a banner that sits on top of the first call to action (**F-15**, **F-20**).

---

# Part B — Pages

## 1. Home — `/`

- **Component:** `src/pages/Index.tsx` (177 lines). Content is mostly static; hero slides can be overridden from the database (`fetchHeroSlides`), the featured-project and "Why Property Owners Choose Us" blocks are database-driven.
- **Observed:** H1 "We Restore, Repair & Protect Buildings Across the GTA"; page height 8,478 px at 1440 px width (slow-scroll capture); screenshots `home-desktop.png`, `home-mobile.png`, `sections/home-desktop-section-1..5.jpg`, `sections/home-mobile-section-1..5.jpg`.

**Sections in order**

| # | Section | Component | What it shows |
|---|---|---|---|
| 1 | Hero carousel (4 slides, autoplay after 2 s, 7 s per slide) | `homepage/EnhancedHero.tsx`; slide text in `data/enriched-hero-slides.ts` | Slide 1: "We Restore, Repair & Protect Buildings Across the GTA", stat "15+ Years Experience", buttons "Submit RFP" and "Explore Services". Slide 2: "Clear Scopes. Reliable Coordination. Professional Closeout." (85% self-performed; How We Work / For General Contractors). Slide 3: "Built for GCs, Property Managers, Developers & Commercial Clients" (Free site assessments; Request Site Assessment / Contact Us). Slide 4: "Prequalification-Ready. Documentation On Demand." ("WSIB registered, $2M CGL coverage, 48-hour quote turnaround, and pilot projects available"; Prequalify Now / For General Contractors). All four slides use the same video and poster (`enriched-hero-slides.ts:7,23,39,55`): a dark sunset skyline. |
| 2 | Proof strip | `homepage/HomepageProofStrip.tsx` | "$2M Insured — CGL Coverage", "15+ Years — Crew Experience", "WSIB Compliant — Active Clearance", and a link "Download Prequal Package" → `/prequalification`. |
| 3 | About block and three cards | `homepage/HomepageServiceHighlights.tsx` (Part 1) | H2 "Building Envelope, Restoration & Interior Trades Across Toronto (GTA)"; two paragraphs; cards "Complete Services", "Building Our Track Record" (15+ years combined team experience), "Building Our Credentials": **"Licensed business with WSIB registration and insurance in progress"** (`:99`). Service-area line (Toronto, Mississauga, Brampton, Vaughan, Markham, GTA & Golden Horseshoe) and "48–72 hour response on new enquiries" (`:208`). |
| 4 | Service grid | same file (Part 2) | H3 "Specialty Trades, Self-Performed"; 8 tiles (Façade Remediation, EIFS & Stucco Systems, Masonry Restoration, Waterproofing, Metal Cladding, Parking Garage Restoration, Interior Buildouts, Commercial Painting) linking to `/services/<slug>`; "View all services". Static content. Tiles link to slugs such as `parking-garage-restoration` and `interior-buildouts-finishing`, which resolve through the database page (Unknown whether each slug exists live; a missing slug redirects to `/404`, `ServiceDetail.tsx:216-218`). |
| 5 | Why Clients Choose Us, buttons, Who We Serve | `homepage/WhoWeServeHomepage.tsx` | Seven benefit cards (accountability, self-performed core trades, EOR-aligned execution, documented QA/QC, occupied-building expertise, "48–72-hour site walks, fast submittals, unit pricing for GC trade packages", local coverage); buttons "Request Site Assessment", "View Services", "For GCs: Request Unit Pricing" (all → `/contact` or `/services`); four audience cards (GCs, Property Managers, Commercial Owners, Homeowners). |
| 6 | Featured Projects | `homepage/HomepageFeaturedProjects.tsx` | Four random published projects (reshuffled on every visit, `staleTime: 0`, `:19-47`); renders nothing when there are none (`:68`). What shows live: Unknown. |
| 7 | "We Protect & Improve the Buildings People Depend On" | `homepage/HomepageParallaxBreak.tsx:70` | Full-width band with a background photo hot-linked from `images.unsplash.com` (blocked in the run, so a plain blue band shows). |
| 8 | "Why Property Owners Choose Us" | `homepage/WhyChooseUs.tsx` | Cards from the database (`useWhyChooseUs`), built-in fallback if none; shows the literal text "Loading..." while the query is pending (`:65-66`). A "Ready to Start Your Project?" box with "Request a Proposal" and "View Portfolio" follows. |
| 9 | Inline form | `homepage/InteractiveCTA.tsx:133` | "Start a Project Conversation": name, email, phone, message (plus a hidden `company_website` honeypot) → `submit-form`; below it "Prefer to talk directly?" with the phone button (647-528-6804) and an Email button. This is the first phone number a visitor sees without scrolling to the footer or using the sticky bar. |
| 10 | Final CTA | `homepage/HomepageFinalCta.tsx` | "Ready to Start Your Project?" with three cards: Request a Proposal ("Start a Conversation"), View Our Portfolio ("See Our Work"), Get Prequalified ("Download Package"). |

**Issues (facts)**

1. No phone or estimate action in the first screen on mobile; hero buttons are "Submit RFP" and "Explore Services" (**F-15**). On a phone the cookie banner covers the hero button (`screenshots/home-mobile.png`; **F-20**).
2. The credentials card ("in progress") sits directly under a strip that says "WSIB Compliant" and "$2M Insured" (**F-02**). Slide 4 says "WSIB registered".
3. Four different labels (Request Site Assessment, For GCs: Request Unit Pricing, Request a Proposal, Start a Conversation) all lead to the same `/contact` form, and there are eight call-to-action labels in total (adding Submit RFP, Submit Inquiry, Download Package, Get Prequalified). Opinion: too many labels for too few destinations.
4. Hero imagery is one skyline for all four slides (**F-45**), and no photo of Ascent's own work appears until the database-driven project block (**F-36**).
5. Three of the home page's four hard claims ("15+ years", "$2M CGL", "WSIB compliant") are used on every page; their consistency is covered by **F-02** and **F-23**.
6. Page-wide: JavaScript is required for any of this to exist (**F-07**); a visitor from a link preview or a non-rendering crawler sees "Loading...".
7. Third-party calls on first load: Google Tag Manager (after 3 s), `ipapi.co` (**F-33**), Unsplash.

**Impression (opinion).** *Property manager with a leaking garage:* the headline and the service tiles match what they need, but the first screen offers "Submit RFP" and a skyline, not "Call now" or a photo of a repaired garage. *GC estimator:* the proof strip and the "Download Prequal Package" link are well placed; the next card undermines them ("in progress"), and the prequal package may not be downloadable (**F-05**).

## 2. About — `/about`

- **Component:** `src/pages/About.tsx`. Static, plus the shared founder text in `data/enriched-company-content.ts:87-105`.
- **H1:** "15 Years of Experience. One Clear Mission." Sections: "Proven Expertise. New Name." intro; stat band (15+ Years Experience, 85% Self-Performed, $2M CGL Coverage, 100% WSIB Compliant, `About.tsx:226-229`); founder panel ("Hebun Isik · Founder & Principal", `:377`); "Milestones"; "People Also Ask" (3 questions); "Start a Project With Ascent Group" (Submit an RFP / Request an Estimate / Talk to Our Team).
- **Milestones (facts, `About.tsx:49-54`):** 2025 Ascent Group Founded (after "George Brown College's Construction Engineering Technology program"); Q1 2025 initial project portfolio; **Q2 2025 "Sto Canada Listed Installer" (modules SCL-001 to SCL-010)**; 2025+ trade partnerships.
- **Issues:** the Sto milestone is dated Q2 2025 but the certificate it relies on is dated 9 April 2026 and is a training certificate (**F-03**). The H1 "15 Years of Experience" next to "Founded 2025" is the framing problem in **F-23**. The founder's credentials list includes "WSIB certified contractor" (`enriched-company-content.ts:103`), a third wording of the WSIB claim (**F-02**). No licence numbers, WSIB account number or insurer name appear anywhere on the page (Unknown whether they are meant to).
- **Impression.** The founder panel and plain "new company, experienced crew" story are the most credible content on the site when they are consistent; a buyer can respect a young company with a named principal. Naming the principal is a strength; adding a face, phone and a line about who estimates and who supervises would help more.

## 3. Services index — `/services`

- **Component:** `src/pages/Services.tsx` (static `SERVICE_CATEGORIES` at `:18-`). 
- **Shows:** "Three Categories. One Self-Perform Crew." (Building Envelope, Restoration, Interior Trades, each with three bullets); "Manufacturer Systems We Install" (Sto Canada, Dryvit, Parex, Benjamin Moore, Sherwin-Williams, Sika, Tremco, Mapei; `Services.tsx:53-62`); "How We Engage" (Review Scope, Assess Site & Documents, Price & Coordinate, Mobilize & Deliver); "People Also Ask" (4 questions); three-card CTA block.
- **Issues:** the first bullet is "Sto Canada Listed Installer (SCL-001 → SCL-010)" (`:24`), see **F-03**. Service links on the page go to `/services/<slug>` database pages (Unknown live).
- **Impression.** Clear, three-category structure that suits a GC reading quickly. No scope-size or "typical project" examples per service, which is what an estimator looks for.

## 4. Service detail pages — `/services/:slug` and nine static pages

- **Database pages:** `src/pages/ServiceDetail.tsx` loads from `services` (`:184`); missing slug → `Navigate to /404` (`:216-218`). Sections coded: hero with trust chips, overview, process steps, Sto banner (EIFS only, `:351-385`), FAQs, related services. Offline run: `/services/masonry-restoration` rendered the 404 view (no H1), which is expected without the database.
- **Static pages (9):** `src/pages/services/*.tsx` through `components/services/Wave1ServicePage.tsx` and `data/wave1-services.ts` (full entry in report 1G). Observed on `/services/commercial-painting-gta`: H1 "Commercial Painting Contractor — Greater Toronto Area", "Quick Facts", "What we deliver", "Coating systems we apply", People Also Ask, service-area block, related services; CTAs "Request a Proposal" → `/estimate`, "Contact Us", "Call: 647-528-6804".
- **Issues:** chips "Factory-Certified Installers", "APW Warranty Eligible", "Manufacturer-Certified" (`ServiceDetail.tsx:106,115,130`) and "Schluter & Mapei Certified", "$2M CGL · WSIB" (`Wave1ServicePage.tsx:73-113`) are claims with no evidence in the repo (**F-03**, **F-02**). 33 legacy slugs redirect client-side (`AppRoutes.tsx:93-126`); redirect status codes are Unknown (**F-39**).
- **Impression.** The static pages are tidy and answer "do you do X and what does it cost" with sensible FAQs; they lack project photos and a typical-scope or price-range sentence that a PM would use to decide to call.

## 5. Markets — `/markets`

- **Component:** `src/pages/Markets.tsx` (static). **Shows:** H1 "Markets We Serve"; "Who We Work With" (Property Managers, General Contractors, Commercial Clients, Homeowners, Developers); "Sector at a Glance" with a service-level line per market (for example "Site visit in 48–72 hrs", `Markets.tsx:68`); "Sub-Sectors We Serve"; People Also Ask; CTA cards.
- **Issues:** another response-time variant (**F-21**). **Impression.** Good routing page; a GC and a PM can each find their row in seconds.

## 6. Projects — `/projects` and `/projects/:slug`

- **Components:** `src/pages/Projects.tsx` (358 lines), `components/projects/PremiumProjectHero.tsx`, `pages/ProjectDetail.tsx` (671 lines). All content comes from the `projects` table (`Projects.tsx:101-110`); no case study exists in the repo.
- **List page:** hero carousel of featured projects whose **H1 is the title of the project currently showing** (`PremiumProjectHero.tsx:74`, autoplay after 15 s); "Featured Projects" with a "↻ Refresh selection" button (`Projects.tsx:236-238`); filters (search, category, year, delivery method, client type, value range, performance badges: on time, on budget, zero incidents); grid with "Show More"; People Also Ask; CTA cards.
- **Detail page:** H1, project metrics and performance, overview, description, scope of work, before/after sliders, process, project team, related services, FAQs; fields include `client_name`, `client_type`, value, delivery method (`ProjectDetail.tsx:60-100,350-400`).
- **Observed offline:** with zero rows the hero shows no background, so white text sits on a white page and the white header links disappear (`screenshots/projects-desktop.png`). With real data this does not occur; how the live page looks, and how many projects exist, is Unknown.
- **Issues:** hero robustness, rotating H1 and the "Refresh selection" button (**F-41**); what the table contains (**F-19**); an unknown slug redirects to `/projects` (`ProjectDetail.tsx:158`, **F-39**); performance badges are unsupported claims unless backed by records.
- **Impression.** The detail template is the right shape for a GC (client type, delivery method, value range, scope, before/after). Whether it is filled in decides whether the site proves anything. This is the single largest "Unknown" for winning work.

## 7. Contact — `/contact`

- **Component:** `src/pages/Contact.tsx`. Observed H1 "Contact Us"; hero with "Fast Response / Free Consultations / No Obligation" and "Request an Estimate"; trust bar ($2M CGL, WSIB Compliant, 85% Self-Performed, 15+ Years, Sto Listed Installer); three path cards (General Inquiry, Project Estimate, Submit RFP); form "Send Us a Message" (name, email, phone, company, project details, consent, newsletter opt-in, hidden honeypot); side cards: office "2 Jody Ave, North York, ON M3N 1H1", phone 647-528-6804, emails `info@` and `projects@`, hours (Mon–Fri 8–6, Sat 9–2, Sun closed; `:150-152`, database-overridable), "What to Expect"; "Our Service Area" map (Google frame); People Also Ask; "Trusted Partners & Affiliations" (12 logos).
- **How it works:** full code and flow in `01-REPORT.md` 1C. Submits to `submit-form`, then the browser calls `send-contact-notification` (**F-13**, **F-12**, **F-06**). 
- **Issues:** no field for role, project type, address or urgency (**F-25**); name field rejects accents (**F-24**); partner wall has blank tiles and no clients (**F-37**); hero is a group photo in business clothes (**F-36**); placeholder phone "(647) 123-4567" (**F-48**); two email addresses are shown with no guidance on which is for what (the GC FAQ says `projects@` for tenders).
- **Impression.** Address, phone, hours and emails in one card are exactly what a skeptical buyer looks for; a visible street address is a trust asset. The form itself is generic.

## 8. Request an estimate — `/estimate`

- **Component:** `src/pages/Estimate.tsx`; wizard components under `components/estimator/`. Observed H1 "Request a Project Estimate"; hero "Answer a few questions ... follows up within 24 hours" (`:415`); stat tiles (WSIB Certified, $2M CGL, 24hr response, Direct project manager); "What type of quote do you need?" with four cards: Prime Specialty Project, Trade Package for GC, Emergency/Maintenance, General Estimate. The wizard has multiple steps ending in a consent step (`EstimatorStep5.tsx:124-131`).
- **How it works:** writes directly to `contact_submissions` and `quote_requests` with the anon key (`Estimate.tsx:292,312`), then asks the browser to call `send-estimate-confirmation` (`:342`) (**F-14**, **F-13**).
- **Issues:** "WSIB / Certified" wording differs from "WSIB compliant" elsewhere (**F-02**); the "24 hours" promise differs from other pages (**F-21**); "Trade Package for GC" lives here, a third GC entry point beside `/submit-rfp` and `/contact` (**F-09**); the sticky bar is hidden on this page, which is correct.
- **Impression.** The four-card chooser is a good idea (it separates owner and GC intent); it is the closest the site gets to the "two forms" you want and is the natural home for the estimate/bid split.

## 9. Submit RFP — `/submit-rfp`

- **Component:** `src/pages/SubmitRFPNew.tsx` with `components/rfp/RFPStep1Company.tsx … RFPStep4Scope.tsx` (react-hook-form + Zod; the only page that uses react-hook-form). H1 "Submit Your RFP", sub-line "Complete our 4-step form to receive a detailed construction proposal". Steps: Company Info, Project Details, Timeline, Scope of Work (title "Need Help?" aside).
- **Fields (code `SubmitRFPNew.tsx:55-79`):** company, contact name, email, phone, job title, project name, project type, location, estimated value range, timeline, start date, delivery method, bonding required, prequalification complete, scope of work, additional requirements, plans available, site visit required, consent, plus file upload ("Upload Drawings & Specifications").
- **Server side:** `submit-form` with `formType: rfp` → `rfp_submissions`, then `send-rfp-emails` (idempotent, server-side loading of the stored row, Lovable email stack): the best-engineered path on the site (report 1C, 1D).
- **Issues:** no bid due date, no GC/owner role, no drawings link; failed uploads are skipped silently (`:132`, **F-10**); the confirmation email is sent as "AscentGroupWebsiteV1 47" (**F-29**); the consent value is not sent (**F-26**); this form is for owners ("receive a detailed construction proposal"), not "invite us to bid" (**F-09**).
- **Impression.** The existing RFP table is a head start for the inquiries inbox (see 04). The wording needs to change for GCs.

## 10. For General Contractors — `/for-general-contractors`

- **Component:** `src/pages/ForGeneralContractors.tsx` (static). **Observed:** H1 "Reliable Trade Partner for General Contractors"; one hero button, "For GCs: Request Unit Pricing" (→ `/contact`); chip row ($2M CGL, WSIB Compliant, 85% Self-Performed, 15+ Years, Sto Listed Installer); "Trade Packages We Execute"; "Why GCs Choose Ascent Group" (48-Hour Quote Turnaround, Self-Performed Work (85%), WSIB & $2M CGL Coverage, Daily Progress Reporting, Manufacturer-Compliant Documentation, Envelope & Interior Focus Only); "Our Process for GC Partners" (5 steps); "Credentialed & Ready to Quote" with "Prequalification Documents" and an "Access Documents" button (→ `/resources/contractor-portal`, `:285-287`); "What We Bring"; "Work With Us" (Call Us; Request Unit Pricing; "Submit Tender Request" → `/contact`, `:324`; an obfuscated `projects@` email, `:335`); five FAQs (bid turnaround, trades, "active on DataBid and ConstructConnect", prequal package, daily reporting); related cards.
- **Issues:** every GC call to action ends at the generic form (**F-09**); "Access Documents" leads to the portal whose packet link is missing (**F-05**); the chips and cards carry the contradictions (**F-02**, **F-03**); platform claims are unverified (**F-28**); "Self-Performed Work (85%)" card says "10-person dedicated crew handles EIFS, masonry, sealant, painting—minimal sub-tiers" (`:47`) while the homepage says "no sub-contractor hand-offs" (**F-22**). No sample unit rates, no bid-calendar, no named GC references.
- **Impression.** This is the right page with the right headings (trade packages, process, documents, FAQs) and the wrong ending. The GC who is ready to send a tender is offered a "Request Unit Pricing" button that opens a generic contact form.

## 11. For Architects — `/for-architects`

- **Component:** `src/pages/ForArchitects.tsx` (static; not in the sitemap). H1 "A Contractor Who Speaks Building Science". Sections: operational capabilities; systems we install (EIFS, masonry, cladding/rainscreen, coatings, waterproofing/sealants, interior finishing); "Building Science We Understand" (hygrothermal performance, air-barrier continuity, thermal bridging, moisture management); "Standards & Specifications We Work To"; how we work with design teams; typical projects; four design-team FAQs (WUFI assumptions, standards, field testing and mock-ups, submittals); resources (capabilities statement, prequalification).
- **Issues:** missing from the sitemap (**F-08**); only one visible CTA ("Request a Consultation" → `/contact`); building-science claims (hygrothermal modelling, WUFI) are unevidenced in the repo (Unknown whether anyone on the team does this).
- **Impression.** This page targets building-envelope consultants, one of the three audiences in your brief, and nothing else on the site speaks to them. Its vocabulary is credible. A consultant would need a spec-section list, a mock-up/testing procedure and one named consultant reference.

## 12. Prequalification — `/prequalification`

- **Component:** `src/pages/Prequalification.tsx`. H1 "Vendor Pre-Qualification Package" over a photo of framed certificates (whose certificates they are is Unknown; hero buttons "Contact Us" and "How We Deliver"). Sections: highlights grid (15+ Years team experience; **Est. 2025, "New incorporation, experienced crew"**; $2M CGL; "COR-Ready, working toward COR certification"; project range $25K–$500K; "10 Skilled" core crew; `:46-53`); "Company Status: New Incorporation, Experienced Team" (`:251`); capabilities by category; **Downloadable Documents** (`DownloadableDocuments`, rows from `documents_library` with `is_active` and no login, grouped by category, `:98-160`; each download writes a log row and increments a counter from the browser); recent projects (three anonymous entries, `:64-86`); "Why Choose Ascent Group" (Safety Excellence, Quality Workmanship, Financial Stability).
- **Issues:** whether any downloadable documents exist is Unknown (**F-05**); the three project references are anonymous and pre-incorporation (**F-18**); "Financial Stability" is asserted as "Strong credit references and financial documentation available upon request" and bonds that "can be arranged through surety partners" (`:339-341`), with no figures and no surety named, for a company founded in 2025. The download counter is updated by the anonymous browser (`:121-135`); whether RLS allows that update is Unknown.
- **Impression.** This is the most candid page on the site ("new incorporation, experienced team", realistic range, crew of 10). Candour helps with GCs who need a small, responsive sub. The page needs to deliver an actual PDF within one click and name real references.

## 13. Capabilities — `/capabilities`

- **Component:** `src/pages/Capabilities.tsx` (static). H1 "How Ascent Delivers Projects". Sections: "Why We Self-Perform 85% of Our Work" (4 cards); "How We Partner With You" (prime contractor, trade partner, consultant-led restoration, direct service); "What Our Crew Delivers Directly" (list including "EIFS & Stucco Systems (Dryvit, Parex, Sto certified)", `:48`); "How We Structure Our Role"; **"Project Size & Financial Strength"** ($25K–$500K; $2M CGL; "WSIB active clearance, $2M commercial general liability, growing bonding capacity", `:354-390`); FAQs, including bonding ("Bonding capacity is being formally established", `page-faqs.ts:102-105`).
- **Issues:** "Dryvit, Parex, Sto certified" unevidenced (**F-03**); "Financial Strength" heading above a statement that bonding is not established (**F-02**).
- **Impression.** Honest about size and bonding in the FAQ; the heading oversells. Good page for estimators.

## 14. Our Process — `/our-process`

- **Component:** `src/pages/OurProcess.tsx`. H1 "From Inquiry to Closeout"; "7 Steps, Start to Finish" with a progress visual (Inquiry & Scope Review, Site Assessment, Estimate & Proposal, Pre-Construction Coordination, Execution & Reporting, Closeout & Documentation, Post-Project Support); links to services, projects, prequalification; three FAQs (timeline, closeout documents, warranty); CTA "Ready to Start a Project?" (→ `/estimate`).
- **Issues:** none specific beyond the shared ones.
- **Impression.** Useful for a PM comparing contractors; short and clear.

## 15. Property Managers — `/property-managers`

- **Component:** `src/pages/PropertyManagers.tsx`. Observed: "Built for Property Management Success" (capital planning support, occupied-building expertise, multi-property programs, full compliance, 48–72 hour response); "Services That Deliver ROI" (façade remediation, parking garage rehabilitation, suite turnovers, common-area refresh, sealant maintenance, balcony waterproofing); "Streamlined Process" (4 steps); "Why Property Managers Trust Us" (+ operational proof bar); five FAQs (occupied buildings, reserve-fund study alignment, "How fast can you respond to an active leak", multi-property contracts, closeout documents); "Let's Discuss Your Property Needs"; related resources.
- **Issues:** only two visible actions ("Request a Proposal", "Contact Us"), both → `/contact`; no phone number in the body of the page (`tel:` links were found on other pages but **none** on `/property-managers`, report 2.5); "Request a Proposal" is the wrong verb for a PM who needs a site visit; no sample reserve-fund-study scope or typical price range.
- **Impression.** The topics are exactly right (reserve fund studies, occupied buildings, active leaks). A PM would want a phone number and an "I have a leak" button on this page; today they get a general form.

## 16. Commercial Clients — `/commercial-clients`

- **Component:** `src/pages/CommercialClients.tsx`. "Why Commercial Clients Choose Ascent" (after-hours work, fast-track scheduling, fully insured, minimal disruption, low-VOC materials); industries; approach (4 steps); operational standards; four FAQs; CTA "Ready to Elevate Your Facility?" ("Request an Estimate" → `/estimate`).
- **Issues:** Shared contradictions only. **Impression.** Adequate; thin on commercial proof (no named retail or office projects on the page).

## 17. Homeowners — `/homeowners`

- **Component:** `src/pages/Homeowners.tsx`. H1 "Residential Services for Homeowners"; "Fully Insured & WSIB Compliant", "15+ Years Team Experience", clear quotes; six residential services (painting, stucco/EIFS repair, tile and flooring, waterproofing and caulking, renovation, cladding/siding); how it works; five FAQs (estimate charge, insurance, timeline, warranty, areas).
- **Issues:** a full homeowner section dilutes the ICI/façade positioning the brief wants (opinion). The static service pages for tile, flooring and handyman work (`AppRoutes.tsx:135-137`) pull the same way. **Impression.** Fine as a quiet secondary page; it should not appear in the primary navigation for a GC.

## 18. Emergency Repair — `/emergency-repair`

- **Component:** `src/pages/EmergencyRepair.tsx` (not in the sitemap). H1 "Emergency Building Repair"; title "24/7 Façade & Envelope Response" (`:90`), "24/7 Available" (`:111`); services (water infiltration, façade failure, storm damage, sealant & joint failure); "How We Respond" (Call Us, Same-Day Site Assessment, Temporary Measures, Permanent Repair); coverage; "Call Now: 647-528-6804" (`tel:`) and "Submit Details Online"; four FAQs (response time, insurance documentation, temporary containment, areas).
- **Issues:** the 24/7 promise against posted hours (**F-17**); missing from the sitemap (**F-08**); the only page with two clear call buttons (good). 
- **Impression.** The best-converting page on the site for a PM with an active leak, if the phone is answered. If it is not, it is the most damaging.

## 19. FAQ — `/faq`

- **Component:** `src/pages/FAQ.tsx`. H2 groups: Popular, General, Pricing & Estimates, Project Timeline & Process, Materials & Quality, Specific Services, Property Management, Safety & Compliance, Toronto & GTA Specific; many questions consumer-level ("How much does it cost to renovate a condo unit in Mississauga?", "Can I choose my own paint colors?", "Cabinet refinishing", `FAQ.tsx:170`); phone link and "Contact Us".
- **Issues:** the FAQ includes content far from the envelope/ICI positioning; a Safety answer states the team "is working toward COR" (`:216`) and lists JHSC certification (consistent with "working toward"). 
- **Impression.** Useful for long-tail search; for a GC it dilutes the message. Consider moving homeowner-type questions to the homeowner page.

## 20. Careers — `/careers`

- **Component:** `src/pages/Careers.tsx`. "Who We Are", values (safety, quality, accountability, growth), roles (envelope and coatings installers, restoration and masonry trades, painters, project coordination, estimating), "How to Connect" → "Submit Your Resume" opens `ResumeSubmissionDialog` (`submit-form` `resume`; email to `careers@`). FAQ.
- **Issues:** `careers@` mailbox existence is Unknown; the email function uses the test sender (**F-06**). **Impression.** Fine. A hiring page also signals growth to GCs; keep it.

## 21. Why a specialty contractor — `/why-specialty-contractor`

- **Component:** `src/pages/WhySpecialtyContractor.tsx` (not in the sitemap). Comparison of specialty versus general contractor across ten dimensions; "when each excels"; cost structures; five FAQs; one CTA ("Request Consultation" → `/contact`).
- **Issues:** missing from the sitemap (**F-08**). A page arguing "specialty contractors versus GCs" may read as adversarial to the GCs you want invitations from (opinion); the GC page uses a "partner" tone instead. **Impression.** Useful for owners; consider keeping it out of the GC path.

## 22. Company pages

- **Certifications & Insurance — `/company/certifications-insurance`** (`pages/company/CertificationsInsurance.tsx`, 289 lines). Hero "Certifications & Insurance Coverage — Licensed, Bonded, and Fully Insured for Your Peace of Mind"; trust ribbon; "Insurance Coverage" (CGL $2,000,000, WSIB "Fully Compliant", `:39-40`); database-driven "Active Licenses", "Active Certifications", "Industry Memberships"; manufacturer cards (Benjamin Moore "Certified Applicator", Sherwin-Williams "ProPainter Certified", EIFS industry "Members Association"); **"Document Download Center" with four inert buttons** (`:52-57,225-241`); FAQ; CTAs to the portal and contact. The page body is a "Loading..." state until the settings request resolves (`:59`). Issues: **F-04**, **F-02** (the hero says "Bonded"), **F-03** (manufacturer cards unevidenced).
- **Technology — `/company/technology`** (`pages/company/Technology.tsx`). H1 "Built on Digital Precision": phases and documents, "We work inside your systems" with a tool strip (Bluebeam, PlanSwift, ZZTAKEOFF, Procore, AutoCAD / DWG, BIM 360; `Technology.tsx:19`), FAQs. Whether the team actually uses each tool is Unknown. Good GC-oriented content.
- **Developers — `/company/developers`** (`pages/company/Developers.tsx`). "Why Developers Choose Ascent", specialised developer services (new-construction painting, building envelope systems, parkade and infrastructure), a four-step partnership process, FAQ; CTAs "Contact Us" and "Submit an RFP" both → `/contact`. Issue: the "Submit an RFP" button does not go to the RFP form (**F-09**).

## 23. Resources

- **Contractor portal — `/resources/contractor-portal`** (`pages/resources/ContractorPortal.tsx`). H1 "Partner With Ascent": why partner (self-performed, 48-hour estimates, WSIB/$2M CGL, scalable crews), capabilities, "Downloadable Resources" (Vendor Packet "Download PDF", Insurance Certificates, Request Unit Rates), a **unit-rate request form** (company, contact, email, phone, trade scope, message, honeypot; `:95`, → `submit-form`), "Download Vendor Packet" (`:464`, file missing), FAQ (including DataBid/ConstructConnect/BidCentral). Issues: **F-05**, **F-28**. This is a fourth GC entry point.
- **Service areas — `/resources/service-areas`.** Primary cities (Toronto, Mississauga, Brampton, Vaughan, Markham), regions (Toronto & GTA core, Durham, York, Halton & Hamilton), service availability (emergency, regular, large), FAQ (travel fees, emergency mobilisation, outside Southern Ontario).
- **City pages — `/service-areas/:city`** (`pages/resources/LocationPage.tsx`; 17 cities hard-coded). Observed `/service-areas/toronto`: H1 "Building Envelope Services in Toronto", services, who we serve, popular services, other areas, CTA "Get Estimate". About 283 words (**F-38**). Not in the sitemap (**F-08**).

## 24. Blog and case-study routes

- `/blog` renders `Blog.tsx` from the database (`blog_posts`); empty in the run (16 words captured). `/case-study/:slug` renders `BlogPost.tsx`; `/case-studies` renders the **blog list**, not a case-study index (`AppRoutes.tsx:249`; **F-39**). Whether any posts exist live is Unknown.
- **Impression.** There is no case-study landing page; for the audiences in your brief, case studies are more persuasive than a blog.

## 25. Legal pages — `/privacy`, `/terms`, `/accessibility`

- Static long-form pages (Terms: 16 sections including "8. Credentials and Certifications", "9. Testimonials and Reviews"; Accessibility: conformance, features, limitations, complaints process). "Last Updated" is today's date on every load, and Accessibility prints a "Last Review Date" of today and a "Next Scheduled Review" one year ahead (**F-27**). Terms §8 says proof of licensing, bonding and insurance "is available upon request" (`Terms.tsx:204`; **F-28**).

## 26. Admin login and 404

- **`/tekev`** (`pages/Auth.tsx`): "Ascent Group CMS" email/password; no SEO tag, no MFA or CAPTCHA seen (**F-30**). **`/404`** (`NotFound.tsx:62`): sets `noindex`.

---

# Part C — Site-wide bid-winning evaluation

**The test from your brief:** would a GC estimator, or a property manager with a leaking garage, trust this site and call? Facts and opinion are separated in each subsection. IDs refer to `02-FINDINGS.md`.

## What works (facts)

- One constants file for company name, phone, email and address (`src/constants/company.ts:10-25`), used by the footer and the contact page as a fallback.
- Lead forms have a honeypot, a time gate and duplicate/link checks in `submit-form` (the RFP path also has server-side idempotent email); the RFP table already holds structured project data.
- No JavaScript errors and no horizontal overflow at 390 px on any of the 34 captured routes; every captured image has alt text (0 images without alt on all routes).
- Real street address, a named principal, a Procore network profile link, a Sto training certificate that is actually published (`public/documents/`), and unusually candid copy on the prequal page ("new incorporation, experienced team", $25K–$500K, a crew of 10).
- Rich FAQ content on most pages and structured data on every public page.

## C1. Credentials and trust signals

| Signal | What the site says (file:line) | Evidence the repo contains | Assessment (opinion) |
|---|---|---|---|
| WSIB | "WSIB Compliant" (strip, footer, About, Estimate "Certified"); "registration and insurance in progress" (`HomepageServiceHighlights.tsx:99`); "Active WSIB registration since incorporation" (`ForGeneralContractors.tsx:52`) | None (no clearance certificate file) | Four wordings for one fact. Publish the current WSIB clearance certificate and use one sentence. **F-02**, **F-04** |
| Liability insurance | "$2M CGL" on 42 files; "Certificate of Insurance, $2M CGL, Valid Dec 2025" in an unused component (`PremiumDocumentSuite.tsx:98`) | None (no COI) | A COI with limit, insurer and expiry date is the first document a GC asks for. $2M is a lower limit than many institutional owners and larger GCs request; whether there is an umbrella or excess policy is Unknown. A stale "Valid Dec 2025" string shows how easily an expired document gets advertised. **F-44** |
| Bonding | "Licensed, Bonded" (`CertificationsInsurance.tsx:71`); "being formally established" (`page-faqs.ts:102-105,349-351`); "growing bonding capacity" (`Capabilities.tsx:390`) | None | The FAQ is honest; the heading is not. Consistency matters more than the answer. **F-02** |
| COR / safety | "Working Toward COR" (footer, prequal, FAQ), meta keywords "COR certified facade contractor" (`CertificationsInsurance.tsx:65`); JHSC and training mentioned (`FAQ.tsx:216`) | None | "Working toward COR" is acceptable and common for a new firm; remove the contradicting keyword. Add the safety policy and training records (**F-05**). |
| Sto Canada | "Listed Installer, SCL-001 to SCL-010", "Verified", "factory-certified", "APW eligible" | `public/documents/…Sto_Listing_Certificate.pdf`: a training certificate, 9 April 2026 dates on six modules, "N/A" on four | The certificate is a real asset; the copy overstates it. **F-03** |
| Paint manufacturers | "Benjamin Moore and Sherwin-Williams authorized contractor" (home JSON-LD, `Index.tsx:105`), "Certified Applicator" and "ProPainter Certified" (`CertificationsInsurance.tsx:199,206`) | None | Unknown; confirm or soften. |
| Years of experience | "15+ years" (49 lines in 24 files); "Est. 2025" (`Prequalification.tsx:50`) | Founder bio | **F-23** |
| Crew and capacity | "10 skilled" core crew; $25K–$500K range (`Prequalification.tsx:52-53`); "85% self-performed" | None | Honest and useful if used consistently. **F-22** |
| Named people | Founder named and described (`About.tsx:333-377`) | — | Strength. No estimator, supervisor or safety lead named. |
| Address and map | North York address and Google map on `/contact` | — | Strength. |
| Procore network | Badge link on the partner wall (`TrustedPartners.tsx:43`) | External profile | Strength; move it near the GC page. |
| Bidding platforms | "Active on DataBid and ConstructConnect", "monitor daily" | None | Unverifiable from the repo. **F-28** |
| Client logos and testimonials | None in code; testimonials are database-driven | Unknown | A partner wall of fabricators and associations is not a client list. **F-37** |
| Licences | "Licensed and insured" in many places; "Active Licenses" on the certifications page from the database | Unknown | To my knowledge Ontario does not require a general contractor licence for most of this work; say what "licensed" refers to (for example a municipal business licence or trade tickets), or drop the word. |

**Assessment (opinion).** The trust problem is not a lack of credentials; it is that the site asserts more than it documents and says the same thing four ways. A GC's reviewer will assume the least favourable reading. The fastest route to trust is a "Documents" page that shows the paper (COI, WSIB clearance, Sto certificate worded as issued, safety policy, two or three references) and nothing that the paper does not support.

## C2. Prequalification downloads

**Facts.**
- `public/documents/` contains one file: the Sto certificate. There is no vendor packet, COI, WSIB certificate, safety manual or capability statement in the repository.
- `/resources/contractor-portal` links to `/documents/vendor-packet.pdf` (`ContractorPortal.tsx:464`), which does not exist in the repo (**F-05**).
- `/prequalification` lists rows from `documents_library` where `is_active` and no login is required (`Prequalification.tsx:98-109`); each download inserts a log row and updates a counter from the browser (`:121-135`). How many rows exist, and whether the files open, is Unknown (query the table; try the live downloads).
- `/company/certifications-insurance` shows four inert "download" buttons (**F-04**).
- The homepage and GC page both promise "Download Prequal Package" / "Access Documents".
- An unused component, `homepage/PrequalPackage.tsx:44`, was a form-gated request flow that sends no email; it is not on any page.

**Assessment (opinion).** Four pages promise a package and, from the repository alone, none delivers one. This is the highest-value fix for the bid-invitation goal: a single PDF (and the same files individually) reachable in one click, with a "request by email" fallback. A useful packet for a young company: company profile (one page), COI and WSIB clearance (current), safety policy and training list, Sto certificate (as issued), three named references, key personnel, project examples with scope and value range, and a one-page "how we price and respond" sheet.

## C3. Case-study evidence

**Facts.**
- No case study exists in the repository. The `projects` table holds them (`src/integrations/supabase/types.ts:1770-1827`); the number of published rows and how complete they are is Unknown.
- The detail template can show client, client type, value, delivery method, scope, before/after photos, process, team and "performance" badges (`ProjectDetail.tsx:60-100,350-583`).
- The only project examples in code are three anonymous, pre-incorporation entries on `/prequalification` (**F-18**).
- `/case-studies` shows the blog list, not case studies (`AppRoutes.tsx:249`), and project pages are not in the sitemap (**F-08**). The projects hero breaks when there are no rows (**F-41**).

**Assessment (opinion).** The template is right; its content decides everything. For a company founded in 2025, the credible proof is a small number of complete, specific, named (or "GC withheld at client request") jobs: building type, problem, scope, what was done, size, duration, photos, outcome and who can confirm it. Six good case studies beat sixty thin ones. Unknown: whether they exist.

## C4. The GC bid path

**Facts: where a GC can start.**

| Entry point | Where it leads | Fields | Notes |
|---|---|---|---|
| GC page "For GCs: Request Unit Pricing" and "Submit Tender Request" (`ForGeneralContractors.tsx:324`) | `/contact` | name, email, phone, company, message | generic form |
| Home "For GCs: Request Unit Pricing", slide 4 "Prequalify Now" | `/contact`, `/prequalification` | — | |
| `/estimate` "Trade Package for GC" | estimate wizard | wizard fields | direct insert, no filters (**F-14**) |
| `/submit-rfp` | 4-step RFP form | 19 fields + uploads | owner wording; no due date or drawings link (**F-09**) |
| `/resources/contractor-portal` unit-rate form | `submit-form` | company, contact, email, phone, trade scope, message | |
| `/company/developers` "Submit an RFP" | `/contact` | — | button label does not match destination |
| Email `projects@…` (FAQ, GC page) | a mailbox | — | existence and monitoring Unknown |

**Assessment (opinion).** There are six entry points and none that says "send us your invitation to bid with the due date and a link to the drawings." A GC invitation has four things: project name and owner, bid due date, where the documents are (Procore, BuildingConnected, a link), and who to reply to. The site cannot capture three of them. This is the case for the planned two-form split (see `04-INBOX-READINESS.md`).

## C5. Service area

**Facts.**
- Stated area: Toronto, Mississauga, Brampton, Vaughan, Markham, "GTA & Golden Horseshoe" (home, footer), regions Durham, York, Halton and Hamilton (`/resources/service-areas`); structured data lists five cities plus Ontario; some pages say "across Ontario"; the FAQ answers whether projects outside Southern Ontario are taken.
- Single address: 2 Jody Ave, North York (`company.ts:18-25`).
- Seventeen templated city pages (**F-38**) and an emergency page claiming GTA-wide 24/7 coverage (**F-17**).
- Hours inconsistent across sources (**F-43**).

**Assessment (opinion).** The GTA positioning is clear and believable. "Across Ontario" language weakens it. A short, specific statement ("GTA and Golden Horseshoe; larger projects considered across Southern Ontario") on every page would match what the crew can serve.

## C6. Real phone and email

**Facts.**
- Code: one phone (647-528-6804) and one primary email (`info@ascentgroupconstruction.com`) in `company.ts:12-16`; role mailboxes `projects@`, `estimating@`, `rfp@`, `careers@` appear in code and seed data. Whether each mailbox exists and who reads it is Unknown.
- The footer, header phone and sticky bar read **database** values first and fall back to the constants (`Footer.tsx:88-89`, `StickyInquiryBar.tsx:12-13`, `useCompanySettings.ts:51-52`). What the live database holds is **Unknown**.
- The "known issues" from your brief: the placeholder phone `(416) 555-1234` and a personal Gmail address are **not in the code** (scan of `src/`, `public/`, `supabase/`, `docs/`, `scripts/`, `index.html`); the copyright "© 2025" is only in the `<noscript>` block (`index.html:262`), while the React footer renders "© 2026". If either of the first two still shows on the live site, it is stored in the database (`site_settings`, `contact_page_settings`; fix in Admin → Settings). What would answer it: load the live site and open Admin → Settings, or run a read-only `select` on those tables.
- Notification emails come from Resend's shared test sender (**F-06**).

**Assessment (opinion).** A real number and a real, role-based email are already in place in code. The risks are the unverified database overrides and the unverified mailboxes; check both before sending traffic to the site.

## C7. Mobile speed

**Facts.**
- Measured in this audit: no horizontal overflow at 390 px; no JavaScript errors; production build (scratch copy) emits an entry chunk of 1,353 KB (306 KB gzip), a charting chunk of 390 KB that is `modulepreload`ed on every page, a 316 KB UI chunk and 187 KB CSS (29 KB gzip). Hero video 565 KB (plus a duplicate in `src/assets/`), used for all four slides.
- Every page makes calls to Supabase and Google Fonts; the homepage also calls Google Tag Manager (3 s after load), `ipapi.co` and Unsplash.
- Not measured: Lighthouse, Core Web Vitals, real-device timing (no runner available and the database was blocked). `.lovable/plan.md` records Lighthouse performance 86 and LCP about 2.0 s, undated, so it cannot be relied on. **Unknown.** What would answer it: PageSpeed Insights on the live URL (mobile) and the Chrome UX Report for the domain.

**Assessment (opinion).** Probably acceptable on Wi-Fi and sluggish on a weak mobile connection: roughly 300 KB of compressed JavaScript before any page content, plus a client-rendered shell with "Loading..." (**F-31**, **F-07**). A property manager on a phone in a parkade will feel it. The larger mobile cost today is the cookie banner and the missing call button on the first screen (**F-15**, **F-20**).

## C8. Verdict (opinion)

| Visitor | Would they trust it and call today? | Why |
|---|---|---|
| **GC estimator with an invitation to send** | **Not yet.** | The page is right (trade packages, process, FAQs) but the credentials contradict each other, the COI/WSIB buttons do nothing, the vendor packet is missing, and the only action is a generic contact form. Fix **F-02**, **F-04**, **F-05**, **F-09** and the answer becomes "probably". |
| **Property manager with a leaking garage** | **Maybe, if they reach the emergency page.** | The emergency page has two call buttons; the homepage first screen on a phone does not. The 24/7 claim must be true (**F-17**), and the site shows no photos or named jobs to prove garage work (**F-19**). |
| **Building-envelope consultant** | **Maybe.** | `/for-architects` speaks their language; they will look for specifications, mock-up and testing practice, and a consultant reference, none of which is present. The Sto wording needs correcting before a manufacturer-affiliated consultant reads it (**F-03**). |

**Five changes that move the answer furthest (opinion):**

1. Make the credentials true, singular and documented (one source of truth, real COI and WSIB files). **F-02**, **F-04**, **F-05**, **F-03**.
2. Verify that email actually leaves the building and that every lead raises an alert (**F-06**, **F-13**).
3. Give GCs an "Invite us to bid" path and owners a plain "Request an estimate" path; put "Call" and "Request an estimate" in the first mobile screen (**F-09**, **F-15**).
4. Fix the title/canonical bug and prerender the public pages so the site can be found (**F-01**, **F-07**).
5. Publish six complete case studies with real photos (**F-19**, **F-36**).

---

## Appendix — evidence index

- Per-route titles, canonicals, H1 and JSON-LD counts: `01-REPORT.md` section 2.5.
- Contact-form code and ten lead-capture paths: `01-REPORT.md` section 1C.
- Email stacks, RLS, buckets, environment variable names: `01-REPORT.md` section 1D.
- Hosting, redirects and service worker: `01-REPORT.md` section 1E.
- Media weights and bundle sizes: `01-REPORT.md` sections 1G and 2.2.
- Screenshots: `screenshots/`.

## Appendix — finding ID index

| ID | Key topic | Severity |
|---|---|---|
| F-01 | SEO | Critical |
| F-02 | Trust | Critical |
| F-03 | Trust | Critical |
| F-04 | Conversion / Trust | Critical |
| F-05 | Conversion | Critical |
| F-06 | Lead capture | Critical |
| F-07 | SEO / Rendering | High |
| F-08 | SEO | High |
| F-09 | Conversion (GC) | High |
| F-10 | Lead capture | High |
| F-11 | Admin / Lead handling | High |
| F-12 | Security / Lead capture | High |
| F-13 | Lead capture | High |
| F-14 | Lead capture / Security | High |
| F-15 | Conversion / UX | High |
| F-16 | Privacy / Compliance | High |
| F-17 | Trust / Conversion | High |
| F-18 | Trust / Prequal | High |
| F-19 | Trust / Content | High |
| F-20 | UX | Medium |
| F-21 | Trust | Medium |
| F-22 | Trust | Medium |
| F-23 | Trust | Medium |
| F-24 | Lead capture | Medium |
| F-25 | Conversion | Medium |
| F-26 | Privacy | Medium |
| F-27 | Legal / Credibility | Medium |
| F-28 | Trust | Medium |
| F-29 | Lead capture / Brand | Medium |
| F-30 | Security | Medium |
| F-31 | Performance | Medium |
| F-32 | Hosting / Security | Medium |
| F-33 | Privacy / Performance | Medium |
| F-34 | Engineering | Medium |
| F-35 | Engineering | Medium |
| F-36 | Trust / Brand | Medium |
| F-37 | Trust / UX | Medium |
| F-38 | SEO / Content | Medium |
| F-39 | SEO | Medium |
| F-40 | SEO | Medium |
| F-41 | UX / SEO | Medium |
| F-42 | Admin / Lead handling | Medium |
| F-43 | Consistency | Low |
| F-44 | Code health / Trust | Low |
| F-45 | Performance / Brand | Low |
| F-46 | Engineering | Low |
| F-47 | Repo hygiene | Low |
| F-48 | Polish | Low |
| F-49 | SEO | Low |
| F-50 | Lead capture | Low |

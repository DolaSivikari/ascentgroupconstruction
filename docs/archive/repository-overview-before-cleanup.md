# Ascent Group Construction — Website & Platform

## 1. Project Overview

This repository contains the public website and admin platform for **Ascent Group Construction**, an emerging specialty contractor based in the Greater Toronto Area.

Ascent Group focuses on:

- **Building envelope** — waterproofing, facade remediation, sealant replacement
- **Restoration** — concrete repair, parking garage rehabilitation, masonry
- **Protective coatings** — industrial/commercial coatings, painting
- **Interior trade execution** — drywall, finishing, suite buildouts, tile & flooring
- **Cladding systems** — EIFS, stucco, metal & composite panels, siding

The company serves **commercial, multi-unit residential, institutional, and selected residential** projects. It works as both a **self-performing specialty contractor** and a **lead/coordinating trade partner** for general contractors, property managers, developers, and commercial building owners.

**Important positioning notes:**
- Ascent Group was established in **2025** with experienced team leadership (15+ years combined team experience in the trades)
- The company is **not** a full-service general contractor — it is a specialty and lead trade contractor
- No inflated claims are made on the site (no "500+ projects", "98% satisfaction", "24/7 emergency" etc.)
- Design-build and construction management are **not** current service offerings

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 (`@vitejs/plugin-react-swc`) |
| Routing | React Router v6 |
| Styling | Tailwind CSS + shadcn/ui + Radix UI |
| Data | TanStack Query + Supabase (`@supabase/supabase-js`) |
| Forms | react-hook-form + Zod |
| Animation | Framer Motion + CSS keyframes |
| Hosting | Lovable (with Lovable Cloud / Supabase backend) |

---

## 2. Current Website Strategy

The site is built around **truthful specialty contractor positioning** — premium visual presentation backed by verifiable, credible claims only.

### Strategic principles

- **Separation of lead paths**: distinct conversion flows for different visitor intents
  - `/contact` — general inquiries
  - `/estimate` — quick estimate requests with scope selector
  - `/submit-rfp` — formal RFP submission with file uploads
  - `/prequalification` — contractor pre-qualification package requests
- **Proof-first credibility**: verifiable metrics ($2M CGL, WSIB compliant, 85% self-performed work) rather than fabricated statistics
- **Process transparency**: dedicated `/our-process` page and process steps embedded in service pages
- **Market-specific messaging**: separate market pages for property managers, GCs, commercial clients, homeowners, and developers
- **Design-system-driven UI**: consolidated component library replacing legacy ad-hoc patterns

### Hero system

- **Homepage**: cinematic video carousel hero (`EnhancedHero`) with layered transitions, blueprint geometry overlays, staggered content reveals, and autoplay controls
- **Projects page**: premium slideshow hero (`PremiumProjectHero`) — a protected, high-value section that should not be casually redesigned
- **Internal pages**: shared `PageHero` component with consistent height variants, background imagery, breadcrumbs, eyebrow text, and CTA support
- **Nav transparency**: the navigation component renders transparent over hero sections on designated routes and transitions to solid on scroll

---

## 3. Key Implemented Workstreams

### Truth & credibility cleanup
Removed fabricated statistics, inflated project counts, unverified claims (LEED consulting, 24/7 emergency line, "500+ projects"). Replaced with verifiable metrics and honest growth-stage language. Reframed "15+ years" around team leadership tenure.

### Navigation & IA consolidation
Unified mega-menu navigation system with 4 top-level categories (Services, Markets, Company, Resources). Consolidated duplicate/deprecated routes via redirects. Footer driven by database settings.

### Homepage rebuild
CMS-connected hero slides, value pillars, featured services, "who we serve" segments, company introduction, and certifications bar — all backed by Supabase tables with fallback content.

### Service page architecture
Created `ServicePageTemplate` and `ServicePageLayout` for consistent service page rendering with process steps, key benefits, FAQ, and related services. Individual service pages for envelope, coatings, cladding, interior buildouts, tile/flooring, painting, and sustainable building.

### Market page rebuilds
Dedicated pages for property managers, general contractors, commercial clients, homeowners, and developers — each with audience-specific messaging, proof points, and CTAs.

### Projects & proof layer
Database-driven project portfolio with detail pages, before/after images, project metrics (duration, budget, scope, safety), and service-tag relationships. Featured project selection for homepage display.

### Conversion-path cleanup
Standardized CTA text via constants. RFP file upload flow with storage bucket. Role-based estimate form (GC, property manager, homeowner). CTABand component used consistently across pages.

### SEO & structured data
JSON-LD schemas, breadcrumb structured data, QuickFacts, PeopleAlsoAsk components, canonical URLs, and OG image support across pages.

### Technology & innovation page
Truthful digital capability content at `/company/technology` — qualified claims about tools (Bluebeam, Procore "when required", BIM "team experience").

### Hero system improvements
Cinematic motion system for homepage hero (layered scale transitions, staggered reveals, blueprint geometry overlay, film grain texture, premium CTA hover effects). Nav-transparency route wiring.

---

## 4. Current Information Architecture

### Primary navigation

| Category | Key pages |
|---|---|
| **Services** | `/services`, `/services/building-envelope`, `/services/protective-coatings`, `/services/cladding-systems`, `/services/interior-buildouts`, `/services/tile-flooring`, `/services/painting-services`, `/services/sustainable-construction`, `/services/:slug` (DB-driven) |
| **Markets** | `/markets`, `/for-general-contractors`, `/property-managers`, `/commercial-clients`, `/homeowners`, `/company/developers` |
| **Company** | `/about`, `/our-process`, `/company/certifications-insurance`, `/company/technology`, `/careers` |
| **Resources** | `/resources/service-areas`, `/faq`, `/blog`, `/blog/:slug`, `/prequalification` |
| **Projects** | `/projects`, `/projects/:slug` |
| **Contact** | `/contact`, `/estimate`, `/submit-rfp` |

### Secondary / support pages

| Page | Purpose |
|---|---|
| `/capabilities` | High-level capability overview |
| `/why-specialty-contractor` | Educational — why specialty contractors matter |
| `/resources/contractor-portal` | GC/trade partner resource hub |
| `/privacy`, `/terms`, `/accessibility` | Legal compliance |
| `/unsubscribe` | Newsletter unsubscribe |
| `/service-areas/:city` | Location-specific landing pages |

### Redirect consolidation
Deprecated routes (e.g. `/services/general-contracting`, `/services/design-build`, `/sustainability`, `/insights`, `/company/equipment-resources`) redirect to canonical destinations. Service sub-route consolidation maps legacy slugs to current service pages.

---

## 5. Important Public Pages

| Page | Route | Purpose |
|---|---|---|
| Home | `/` | Hero slideshow, value pillars, featured services, proof strip, who we serve, CTA |
| About | `/about` | Company story, values, safety commitment, credentials, sustainability |
| Services | `/services` | Service category index with cards linking to detail pages |
| Markets | `/markets` | Market segment overview with cards to audience-specific pages |
| Projects | `/projects` | Portfolio with premium hero, project cards, filtering |
| Contact | `/contact` | General inquiry form with trust badges and "what to expect" sidebar |
| Estimate | `/estimate` | Multi-step estimate request with role selector and scope categories |
| Submit RFP | `/submit-rfp` | Formal RFP submission with file upload support |
| Prequalification | `/prequalification` | Pre-qualification package request form |
| Our Process | `/our-process` | Step-by-step delivery process with cross-links |
| Capabilities | `/capabilities` | Capability overview with proof points |
| Why Specialty Contractor | `/why-specialty-contractor` | Educational content on specialty contracting value |
| Careers | `/careers` | "Work With Ascent" — expression-of-interest model with trade categories |
| Technology | `/company/technology` | Digital capability and tools overview |
| Certifications & Insurance | `/company/certifications-insurance` | Credentials, insurance, and compliance documentation |
| Service Areas | `/resources/service-areas` | Geographic coverage across GTA |
| Blog | `/blog` | Blog/case study index (architecture ready, content-dependent) |
| FAQ | `/faq` | Frequently asked questions |
| For General Contractors | `/for-general-contractors` | GC-specific partnership page |

---

## 6. Design System / UI Notes

### Design system components (`src/design-system/`)

| Component | Purpose |
|---|---|
| `Card` | Canonical card with `default`, `elevated`, `interactive` variants and size tokens |
| `CapabilityCard` | Services, features, and differentiators |
| `SegmentCard` | Client/market segment cards with optional badge |
| `ProofCard` | Testimonial and credential display |
| `SectionHeader` | Standardized section heading with optional badge and description |
| `ProofStrip` | Horizontal stat/trust bar for inline credibility signals |
| `CTABand` | Standardized CTA section (dark/light variants) used across all page bottoms |
| `Typography` | Heading and body text utilities |

### Design tokens (`src/design-system/tokens.ts`)
Spacing, grid, and visual tokens for consistent layout across the site.

### Shared layout components
- `PageHero` (`src/components/shared/PageHero.tsx`) — unified hero for internal pages with height, variant, background image, breadcrumb, eyebrow, stat, and CTA support
- `Section` — consistent vertical spacing wrapper
- `ServicePageLayout` / `ServicePageTemplate` — reusable service page structure

### Legacy note
Some older components (e.g. `UnifiedPageHero` in `src/components/sections/`) still exist but the active direction is consolidation toward the shared `PageHero` and design-system components.

---

## 7. Hero System

| Context | Component | Description |
|---|---|---|
| Homepage | `EnhancedHero` | Cinematic video carousel with layered scale transitions, staggered content reveals, blueprint geometry SVG overlay, film grain texture, parallax mouse tracking, autoplay with progress indicators |
| Projects | `PremiumProjectHero` | Premium slideshow hero — **protected section, do not casually redesign** |
| Internal pages | `PageHero` | Shared hero with 5 height variants (full → mini), visual variants (standard, compact, minimal, centered), background imagery from `hero-images.ts` mapping |

### Hero-aware navigation
The `Navigation` component maintains a `heroPages` array of routes that receive transparent-over-hero treatment. When the user scrolls past ~80px, the nav transitions to its solid background state with shadow.

### Blueprint geometry overlay
`HeroGeometry` renders construction-themed SVG linework (section cuts, facade grids, datum marks, building silhouettes) as a low-opacity atmospheric layer. Each of the 3 homepage slides has themed geometry (envelope, precision/process, network/markets).

---

## 8. CMS / Data / Backend Wiring

The site uses Lovable Cloud (Supabase) for data persistence, authentication, file storage, and backend functions.

### Public-facing data (Supabase → frontend)

| System | Table(s) | Public Status |
|---|---|---|
| Hero slides | `hero_slides` | ✅ Live — CMS-managed with local fallbacks |
| Projects | `projects`, `project_images`, `project_services` | ✅ Live — full CRUD via admin |
| Services | `services` | ✅ Live — published services render via `/services/:slug` |
| Blog posts | `blog_posts` | ✅ Architecture live — content-dependent |
| Testimonials | `testimonials` | ✅ Architecture live — needs real client content |
| Stats / value pillars | `stats`, `value_pillars` | ✅ Live with fallbacks |
| Featured services | `featured_services` | ✅ Live |
| Certifications | `certifications` | ✅ Live |
| Navigation | `navigation_menu_items` | ✅ Live — admin-managed mega menu |
| Footer | `footer_settings` | ✅ Live |
| Homepage settings | `homepage_settings` | ✅ Live with fallbacks |
| Contact settings | `contact_page_settings` | ✅ Live |
| About settings | `about_page_settings` | ✅ Live |

### Form submissions (frontend → Supabase)

| Flow | Table | Notifications |
|---|---|---|
| Contact form | `contact_submissions` | Edge function: `send-contact-notification` |
| Estimate request | `quote_requests` | Edge function: `send-admin-notification` |
| RFP submission | `rfp_submissions` | Edge function: `send-rfp-notification` |
| Prequalification | `prequalification_downloads` | Edge function: `send-package-notification` |
| Resume/careers | `resume_submissions` | Edge function: `send-resume-notification` |
| Newsletter | `newsletter_subscribers` | — |
| RFP attachments | `rfp-attachments` storage bucket | Uploaded via `react-dropzone` |

### Admin-only systems

| System | Purpose |
|---|---|
| Unified Inbox | Aggregated view of all submissions |
| SEO Dashboard | Keyword tracking, search console data |
| Redirects Manager | Route redirect management |
| Performance Dashboard | Web vitals and analytics |
| Audit Log | Change tracking |
| Content Versioning | Snapshot-based content history |
| A/B Testing | Test configuration (tables exist, UI partially wired) |
| Email Templates | Template management for notifications |

### Edge Functions (`supabase/functions/`)

Notification dispatchers, sitemap generation, image processing, SEO content generation, Google Search Console integration, and user invite flow.

---

## 9. Content Status

| Area | Status |
|---|---|
| Service pages | ✅ Populated with truthful content |
| Market pages | ✅ Populated with audience-specific messaging |
| Homepage sections | ✅ CMS-ready with sensible fallbacks |
| Projects | ⚠️ System live — needs real project data with photos |
| Blog | ⚠️ Architecture complete — needs content |
| Testimonials | ⚠️ Table ready — requires real client testimonials only |
| About page | ✅ Populated via CMS settings |
| FAQ | ✅ Populated |
| Certifications | ⚠️ Structure ready — needs current certificate uploads |

Content population is an ongoing priority. The site is designed so that CMS-powered areas degrade gracefully to fallback content when database records are not yet populated.

---

## 10. Route / Discoverability Notes

- **Redirect consolidation**: ~20+ deprecated routes redirect to canonical destinations (e.g. `/services/general-contracting` → `/services`, `/company/equipment-resources` → `/company/technology`)
- **Not all pages are equally discoverable**: primary navigation exposes Services, Markets, Projects, Company, and Contact. Secondary pages like `/capabilities`, `/why-specialty-contractor`, and `/prequalification` are accessible via in-page links and footer
- **Case study aliasing**: `/case-studies` and `/case-study/:slug` alias to the blog system
- **Auth route**: `/tekev` — intentionally non-obvious admin login entry point
- **Location pages**: `/service-areas/:city` provides city-specific landing pages

---

## 11. Local Development

### Prerequisites
- Node.js 18+
- npm or bun

### Install and run

```bash
npm install
npm run dev
```

Dev server runs at `http://localhost:8080`.

### Available scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development-mode build |
| `npm run build:optimized` | Build with image optimization (requires `sharp` + `svgo`, set `ENABLE_IMAGE_OPTIMIZATION=true`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck:selected` | Strict typecheck on selected files |
| `npm run validate:sw` | Service worker validation |

---

## 12. Environment / Integrations

### Required environment variables

The `.env` file is auto-managed by Lovable Cloud and should not be edited manually. It provides:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier |

### Integrations

- **Lovable Cloud (Supabase)**: database, auth, storage, edge functions
- **Storage buckets**: `rfp-attachments` for RFP file uploads, media/documents for admin uploads
- **Edge functions**: notification emails, sitemap generation, image processing, SEO tools
- **Google Search Console**: OAuth integration for SEO data (optional, requires credentials)

---

## 13. Current Priorities / Known Follow-Ups

### High priority
- **Content population**: real project case studies with photos, client testimonials, blog posts
- **Certificate uploads**: current insurance certificates and compliance documents
- **RLS audit**: address security policy warnings flagged by Supabase linter

### Medium priority
- **Legacy component cleanup**: remaining `@/ui/Card` imports in admin files → migrate to design-system Card
- **Footer/navigation refinement**: ensure all key pages are discoverable
- **Blog content growth**: establish regular publishing cadence
- **CMS/public wiring alignment**: verify all admin-managed content surfaces correctly on public pages

### Lower priority
- **A/B testing UI**: tables exist but frontend activation needed
- **Interactive service-area map**: enhancement for geographic coverage page
- **Project portfolio filters**: filter by service, sector, year
- **Rate limiting**: public form submission protection
- **Analytics/conversion tracking**: form funnel analysis, drop-off measurement

### Manual verification needed
- Whether partner case studies represent real completed projects
- Current headcount (referenced as "10-person crew" in some content)
- Active tool adoption status (Bluebeam, Procore, BIM 360)
- RFP file upload end-to-end flow (storage bucket RLS)

---

## License

Proprietary — Ascent Group Construction.

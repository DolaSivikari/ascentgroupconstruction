# Page inventory and navigation audit

> Historical audit: the findings below describe the site before the navigation fixes. See [the implementation notes](page-discovery.md) for the October 3 changes. The map and CSV now reflect those changes: all 85 audited pages are in the repository sitemap, city names are links, and project cards have native links. The Services menu and directory share categories, mobile search includes the missing renovations service, and broader services link to their specialties.

Verified against GitHub `main` at `99dd592bac1cec945216cc96ee75d1a3b1a0baf9`, the public Supabase published-content queries, and the current production build. Audit performed October 2, 2026 (America/New_York). Existing uncommitted design changes were preserved. This audit does not change navigation, content, or the sitemap.

The public domain returned HTTP 403 to the environment's direct fetch of `/sitemap.xml`, so live deployment parity and search-engine indexing were not established. Sitemap findings below refer to `public/sitemap.xml` in the repository. Browser navigation checks use the local production build with the real public read API. They do not submit forms or change database records.

## Confirmed counts

Count distinct content destinations, rather than route patterns, source files, redirects, or repeated menu links.

| Category | Pages | Direct header/menu destinations | In repository sitemap |
| --- | ---: | ---: | ---: |
| Main hubs: Home, Services, Markets, Projects, Insights | 5 | 5 | 5 |
| Service detail pages | 22 | 12 | 22 |
| Service Areas directory | 1 | 1 | 1 |
| City landing pages | 17 | 0 | 0 |
| Project detail pages | 11 | 0 | 0 |
| Published, currently listed insight articles | 6 | 0 | 1 |
| Audience pages | 6 | 6 | 5 |
| Company and trust pages | 8 | 8 | 7 |
| Project actions / procurement pages | 6 | 6 | 5 |
| Legal pages | 3 | 0 | 3 |
| **Total** | **85** | **38** | **49** |

The 38 header destinations include the Home/logo link and destinations inside dropdowns. They are not 38 buttons visible on the navigation bar at once. The remaining 47 have a directory, project-card, or footer path; absence from a menu alone does not make a page orphaned.

Services comprise 13 published database pages plus 9 static landing pages. The service registry contains only 21 entries: `/services/interior-finishing-renovations` is published and listed in the Services directory but absent from the registry and mobile navigation search.

Excluded from the 85: admin pages; login `/tekev`; OAuth consent; the two email-unsubscribe utilities; the not-found page and wildcard; development token preview; duplicate content access through `/case-studies` and `/case-study/:slug`; redirect URLs. There are 68 explicit `Navigate` redirect rules: 39 public and 29 admin. Redirects are not additional content pages.

## Current hierarchy

```text
Home
├── About menu
│   ├── About, Careers, FAQ
│   ├── Certifications & Insurance, Technology & Innovation
│   └── Service Areas directory
│       └── 17 linked city pages
├── Capabilities menu
│   ├── Capabilities, Why Specialty Contractor, Our Process
│   └── Projects, Certifications & Insurance (shared destinations)
├── Services menu
│   ├── Services directory → all 22 detail pages
│   ├── Building Envelope → 4 direct service links
│   ├── Restoration & Repair → 4 direct service links
│   └── Interior & Finishes → 4 direct service links
├── Markets menu
│   ├── Markets directory
│   └── Property Managers, Commercial Clients, Homeowners,
│       General Contractors, Developers, Architects & Consultants
├── Projects
│   ├── Random featured project links
│   └── Project grid: first 6 → Show More Projects → all 11
├── Insights (/blog) → 6 published articles
├── Contact
└── Start a Project dropdown
    └── Submit RFP, Prequalification, Contractor Portal,
        Site Assessment (/contact), Estimate, Emergency Repair

Shared footer
├── 6 featured service links + View All Services → all 22
├── Company / resource links, including Service Areas directory
└── Privacy, Terms, Accessibility

Mobile menu uses the same destination model.
Mobile search includes all 21 registered services, including 9 hidden from menus.
```

## Service detail inventory

“Footer” means a direct featured-service link, not an indirect path through View All Services. All 22 have a Services-directory entry and sitemap entry.

| Service | URL | Header | Direct footer | Mobile service search |
| --- | --- | --- | --- | --- |
| Building Envelope Solutions | `/services/building-envelope-solutions` | Yes | Yes | Yes |
| Caulking & Sealants | `/services/caulking-sealants-toronto` | Yes | No | Yes |
| Cladding Systems | `/services/cladding-systems` | Yes | Yes | Yes |
| Commercial Painting (GTA) | `/services/commercial-painting-gta` | No | No | Yes |
| Stucco & EIFS Repair | `/services/eifs-stucco-systems` | Yes | Yes | Yes |
| Exterior Painting (Toronto) | `/services/exterior-painting-toronto` | No | No | Yes |
| Façade Remediation | `/services/facade-remediation` | Yes | Yes | Yes |
| Fire Retardant Coatings | `/services/fire-retardant-coatings-ontario` | No | No | Yes |
| Flooring Installation (GTA) | `/services/flooring-installation-gta` | No | No | Yes |
| Patching & Handyman | `/services/handyman-patching-toronto` | Yes | No | Yes |
| Commercial Tenant Improvements | `/services/interior-buildouts-finishing` | Yes | No | Yes |
| Residential Renovations | `/services/interior-finishing-renovations` | No | No | No |
| Interior Painting (Toronto) | `/services/interior-painting-toronto` | No | No | Yes |
| Masonry Restoration | `/services/masonry-restoration` | Yes | Yes | Yes |
| Architectural Coatings | `/services/painting-services` | Yes | No | Yes |
| Parking Garage Restoration | `/services/parking-garage-restoration` | Yes | No | Yes |
| Residential Exterior (GTA) | `/services/residential-exterior-painting-gta` | No | No | Yes |
| Caulking & Sealant Services | `/services/sealant-programs` | No | No | Yes |
| Sustainable Building | `/services/sustainable-building` | No | No | Yes |
| Tile & Flooring | `/services/tile-flooring` | Yes | No | Yes |
| Tile Installation (Toronto) | `/services/tile-installation-toronto` | No | No | Yes |
| Waterproofing Systems | `/services/waterproofing-systems` | Yes | Yes | Yes |

## Supporting pages and dependencies

These pages share navigation and supporting content; they are not a fixed tree of prerequisites. A service page does not require every city, project, article, or audience page to load.

| Relationship | Current implementation |
| --- | --- |
| Upstream service directory | All 22 are listed under `/services`. Breadcrumbs return to that directory. |
| 13 database service pages | Related-links helper returns up to three destinations: up to two published sibling services, optionally a published linked project, then hub fallbacks. Data and ordering determine the actual destinations. |
| 9 static service pages | Each has two configured static sibling services plus the EIFS & Stucco destination. These templates do not automatically include a blog or project-detail link. |
| Geography | All service pages list 17 city names as plain text in `ServiceAreaSection`; the separate coverage directory links all 17 city pages. |
| Conversion | Service content primarily leads to Contact and Estimate. RFP, Prequalification, Contractor Portal, and Emergency Repair are available through the shared navigation. |
| Articles and projects | Six articles and eleven projects exist and are reachable through their own hubs. They are not automatically linked from every service page. |
| Audience | Six shared audience pages provide different entry points into the service offer. |

## Findings and priorities

1. **36 content pages are missing from the repository sitemap:** all 17 cities, all 11 projects, five of six articles, and `/for-architects`, `/emergency-repair`, `/why-specialty-contractor`. All 22 services are included. Generate sitemap entries from static route definitions and published public data rather than repeatedly patching a stale file. Publishing should refresh the sitemap, with meaningful modification dates. A sitemap helps discovery; it does not guarantee indexing or rankings.
2. **Project grid navigation uses click handlers on div cards.** The regular grid has eleven records after Show More, but its cards call `navigate()` rather than provide native detail-page links. Featured cards do contain links. This is a real keyboard and crawler-discovery weakness even though mouse/touch visitors can open projects. Add a native detail link while preserving Quick View as a separate action.
3. **City names inside service pages are plain text.** Link only validated city slugs already present in the city directory. This adds useful contextual routes without adding seventeen top-menu items. City pages currently remain reachable through About → Service Areas, and through the footer.
4. **Service grouping disagrees between the menu and directory.** Masonry is under Restoration in the menu but Building Envelope in the live service data. Sustainable Building belongs to the registry's Envelope category but appears under Specialized Services in the directory. The menu has three groups; the directory currently has four. Resolve the intended categorization before editing public records, then use the same mapping in navigation, directory, and search.
5. **Mobile navigation search misses Interior Finishing Renovations.** Add its published slug to the shared registry or build search from both published services and static entries. Search already includes the other nine services absent from the main menu; it is a navigation search, not a full search of cities, projects, and articles.
6. **Specialized services need clearer contextual discovery.** Keep the short menu if desired, and link the five painting specialties from Painting Services; link tile/flooring specialties from Tile & Flooring. Do not automatically add every detail page to the top menu. The current Services directory is already complete.

## Corrections to Lovable's report

| Claim | Verified result |
| --- | --- |
| 79 public content pages | 85 under the explicit counting scope above. |
| 31 top-navigation destinations | 38 unique public destinations including the Home link. |
| Service Areas directory is absent from top navigation | Present in About on desktop and mobile. |
| City pages are disconnected / inaccessible | All 17 are linked from the coverage directory; service-page city labels are unlinked. |
| All 22 services have direct footer links | Six direct featured links, then View All Services. |
| Ten services have `showInNav: false` | Nine registry entries are hidden; one further published page is absent from the registry entirely. |
| Ten of eleven projects are missing from sitemap | All eleven are absent from the repository sitemap. |
| 32 pages missing from sitemap | 36 under the audited content inventory. |
| Every service links projects and blog details | No shared service-to-blog section; project-detail links are conditional in database pages and absent from the static related-services template. |
| Sitemap updates make every page 100% indexable | Discovery, indexing, canonical selection, and ranking are separate; sitemap presence guarantees none of them. |

## Evidence

Browser checks passed at 1440px and 390px: 22 service-directory links, 17 city-directory links, all eleven project cards after Show More with a tested detail-navigation click, and six article-directory links. Desktop and mobile menus expose twelve service details and the Service Areas directory. A mobile search for Fire Retardant finds the service absent from the menu. The footer exposes six direct service links. The tested Painting Services and Fire Retardant pages have no city links in their main content; the painting page links a real project and database sibling services, while the static page links static siblings and EIFS. No uncaught browser errors were observed.

- `src/routes/AppRoutes.tsx`: active pages, dynamic patterns, redirects, admin scope.
- `src/data/service-registry.ts`: 21 registered services and 12 menu entries.
- `src/data/navigation-structure-enhanced.ts`, `src/components/Navigation.tsx`, `src/components/navigation/MobileNavSheet.tsx`: menu destinations.
- `src/components/services/ServicesDataGrid.tsx`: published database + static service union.
- `src/components/footer/UnifiedFooter.tsx`: six featured services and directory link.
- `src/hooks/useNavigationSearch.ts`: registry-based service search.
- `src/pages/resources/ServiceAreas.tsx`, `LocationPage.tsx`, `src/data/service-area-cities.ts`: the city directory and 17 valid destinations.
- `src/components/seo/ServiceAreaSection.tsx`: plain-text city labels.
- `src/pages/Projects.tsx`, `src/components/ProjectCard.tsx`, `ProjectFeaturedCard.tsx`: grid pagination and click-versus-link behavior.
- `src/pages/Blog.tsx`: published/date-filtered article listing.
- `src/components/services/Wave1ServicePage.tsx`, `src/utils/relatedLinks.ts`: different supporting-link behavior.
- `public/sitemap.xml`: 49 entries, all in the inventory; 36 inventory destinations absent.

The accompanying `site-page-inventory.csv` lists all 85 destinations, menu/footer presence, primary visitor path, and sitemap status. `site-navigation-map.html` is a standalone searchable map; it uses no external scripts or API calls.

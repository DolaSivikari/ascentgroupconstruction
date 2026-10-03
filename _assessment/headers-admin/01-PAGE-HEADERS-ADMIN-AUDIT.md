# 05. Page headers and admin panel: what is built, what is broken, how to improve it

Read-only audit of the repository on 2 October 2026. Nothing in the source was changed. Facts are cited as file:line. Opinions and recommendations are kept in sections labelled "Recommendation". "Unknown" means the code alone cannot answer it, and the answer says how to find out.

Inputs used: this assessment (01 to 04), Lovable's rules and incident notes (`2nd Answer.txt`), its GitHub and deploy answers (`Lovable 1st Answer.txt`), its reachability audit (`New Text Document 2.txt`), the answers to Codex's ten questions (`New Text Document.txt`), and Lovable's own header audit.

---

## Part A. Page headers: what is actually implemented

### A1. How headers work (fact)

- There is one live header component: `src/components/shared/PageHero.tsx` (339 lines, 28 importing files). It draws a photo behind a dark overlay, a white H1, optional breadcrumbs, badges and two buttons. The photo shows only when an `image` prop is passed. Without one, the overlay sits on a plain colour block (this is the city-page look, see the screenshot `screenshots/service-areas-toronto-desktop.png`).
- Images are chosen in code, in `src/data/hero-images.ts` (maps `mainPageHeroes`, `serviceHeroes`, `audienceHeroes`, `sectorHeroes`, `companyHeroes`, `resourceHeroes`). Nine newer service pages keep a second, separate map inside `src/components/services/Wave1ServicePage.tsx:42-65`.
- The navbar goes transparent with white text at the top of the page when the route is in a hard-coded list (`src/components/Navigation.tsx`, `heroPageExact` and `heroPagePrefixes`). The list is maintained by hand and is not tied to whether the page actually has a hero.
- Three other header components exist and nothing imports them: `src/components/sections/PageHero.tsx`, `src/components/PageHeader.tsx`, `src/components/ContentPageHeader.tsx`. They are dead code, and they are part of why the design feels inconsistent when someone searches the repo for "header".
- The home page has its own hero (`EnhancedHero`), protected by Lovable's rules. This audit does not touch it.

### A2. Per-route result (fact, from a static scan of `src/routes/AppRoutes.tsx` and each page file)

| Group | URLs | Header component | Image | Status |
|---|---|---|---|---|
| Home `/` | 1 | EnhancedHero (video) | own | Works. Protected. |
| Static pages with `PageHero` and a mapped image | 24 routes (23 pages; `/case-studies` re-uses the Blog page) | PageHero | from `hero-images.ts` | Image present. See A3 for how many are unique. |
| Nine static service pages (commercial-painting-gta, exterior-painting-toronto, caulking-sealants-toronto, fire-retardant-coatings-ontario, interior-painting-toronto, residential-exterior-painting-gta, tile-installation-toronto, flooring-installation-gta, handyman-patching-toronto) | 9 | PageHero via `Wave1ServicePage` | one file each in `src/assets/heroes/wave-*.jpg` | Works, and each image is unique. Routed before the `/services/:slug` catch-all (`AppRoutes.tsx:47-56`). |
| Database-driven services `/services/:slug` | 13 | PageHero via `ServiceDetail` | `serviceHeroes[slug]`, then the database `featured_image`, else none (`ServiceDetail.tsx:142-147`) | 10 map correctly. **2 mismatch** and 1 has no key (A4). |
| City pages `/service-areas/:city` | 17 | PageHero | **none** (`LocationPage.tsx:281-286`) | Gradient block, no photo. Confirmed in screenshot. |
| Legal pages `/privacy`, `/terms`, `/accessibility` | 3 | none | none | No hero, but the navbar treats them as hero pages (A5). |
| Project list `/projects` | 1 | `PremiumProjectHero` (carousel of project photos) | database, falls back to `/hero-poster-1.webp` | Works. A different design from every other page. |
| Project detail `/projects/:slug` | 11 | none (H1 and text, then a banner image below) | database `featured_image` | By design, but different from the "connected image header" idea. |
| Contractor portal `/resources/contractor-portal` | 1 | hand-built section, centred, 60vh | `src/assets/hero-building-envelope.jpg` | Works. Does not use `PageHero`, and re-uses a generic envelope photo although `hero-contractor-portal.jpg` exists in `src/assets/heroes/`. |
| Blog and case-study posts | 6 posts | PageHero | `post.featured_image \|\| '/placeholder.svg'` (`BlogPost.tsx:203`) | Depends on database content. **Unknown** whether every post has an image (check: `select slug, featured_image from blog_posts`). |
| Utility pages (login `/tekev`, unsubscribe, OAuth consent, dev token page) | 5 | none | none | Fine. Not marketing pages. |

### A3. How unique are the images? (fact, resolved to files)

Lovable's figure ("about 58% have a unique connected hero") counts pages that have an image, not pages that have their own image. Resolving the imports to files shows:

- `hero-general-contracting.jpg` is used by **six** pages: `/services`, `/why-specialty-contractor`, `/capabilities`, `/our-process`, `/company/technology`, `/submit-rfp`. These are the pages a general contractor is most likely to read, and all show the same photo.
- Four pairs share a file: `/about` and `/faq`; `/careers` and `/contact`; `/company/certifications-insurance` and `/prequalification`; `/property-managers` and `/commercial-clients`.
- `/for-architects` borrows the building-envelope service photo, and `/emergency-repair` borrows the waterproofing photo, so each repeats a service page's header.
- Unique static pages: `/blog` (and `/case-studies`), `/estimate`, `/company/developers`, `/homeowners`, `/for-general-contractors`, `/markets`, `/resources/service-areas`.

So of 24 static pages with an image, 7 have a photo that no other page uses.

### A4. The service-image key mismatch (fact for the code, Unknown for the live effect)

`serviceHeroes` is keyed `building-envelope` and `interior-buildouts` (`hero-images.ts:67,77`), but the live slugs are `building-envelope-solutions` and `interior-buildouts-finishing` (`service-registry.ts:63,168`). The old keys are only the redirect sources (`AppRoutes.tsx:93-94`). `interior-finishing-renovations` is in neither the registry nor the map. `ServiceDetail` then falls back to the database `featured_image` and refuses any value that starts with `/src/`.

- Unknown: whether those rows hold a usable `featured_image`. If they do, the page shows a photo. If not, it shows the blank-overlay look. One query settles it: `select slug, featured_image from services where publish_state='published'`, or open the three pages live.
- Also fact: `serviceHeroes` carries dead keys for slugs that now redirect (`protective-coatings`, `tenant-improvements`, `metal-panel-systems`, `building-envelope`, `interior-buildouts`).
- Also fact: the admin Service Editor has **no image field**. `ImageUploadField` is imported at `src/pages/admin/ServiceEditor.tsx:10` and nothing else in the file mentions an image. So an admin cannot fix a missing service hero from the panel (see Part B).

### A5. The legal-page navbar bug (fact, confirmed by screenshot)

`/privacy`, `/terms` and `/accessibility` are in `heroPageExact`, so at the top of the page the navbar turns transparent with white text and a white logo. These pages have a white background and no hero. `screenshots/privacy-desktop.png` shows the result: the "ASCENT" lettering and the menu links cannot be seen. The same rule would catch any new page under `/resources/`, `/company/` or `/projects/` that has no hero.

A related fact from the same screenshot: "Last Updated" shows today's date because it is generated in code (`Privacy.tsx:21`). That is finding F-27.

### A6. Lovable's header claims, checked

| Lovable claim | Result |
|---|---|
| About 58% of pages have a unique connected hero | **Overstated.** The figure counts "has an image". Many pages share one (A3). |
| 20 pages are broken | **Matches the code:** 17 city pages with no image plus 3 legal pages with no hero. Two or three database-driven service pages may also be affected (A4, Unknown). |
| 3 "ghost navbar" pages | **Confirmed** (A5). |
| Service hero keys do not match slugs | **Confirmed** (A4). |
| City pages have no hero image | **Confirmed** (`LocationPage.tsx:281`). |

New items Lovable did not report: the six-page image reuse, two image registries, three dead header components, the missing image field in the admin editor, and a hand-built contractor-portal hero.

---

## Part B. Admin panel: what is there

### B1. Structure (fact)

- 22 page files in `src/pages/admin/` (about 6,000 lines) and 50 files in `src/components/admin/`. All routes sit inside `UnifiedAdminLayout` (`AppRoutes.tsx:145`). A non-admin is sent silently to `/` (`UnifiedAdminLayout.tsx:95-96`).
- Sidebar order (`UnifiedSidebar.tsx:277-324`): Dashboard, Inbox, Estimates & Quotes; Projects, Services, Blog Posts, Testimonials, Media Library, Documents; Homepage Builder, SEO Dashboard; Site Settings, Users & Roles, Email Templates; Monitoring, Audit Log.
- 29 legacy admin URLs are redirects (`AppRoutes.tsx:147-196`). Five of them (`stats`, `redirects`, `content-versions`, `navigation`, `navigation-builder`) land on the dashboard with no explanation, which suggests features that were removed.
- A QA page exists at `/admin/qa/quick-contact-form` and is not in the sidebar.
- There is no screen that manages page headers. `HeroSlidesManager` (504 lines) edits only the home-page slides.

### B2. Problems found (fact)

1. **The inbox badge ignores bids and quotes.** The sidebar badge counts only `contact_submissions` with status "new" (`UnifiedSidebar.tsx:87-90`). On the dashboard, the RFP and quote cards have `newCount: 0` written in (`Dashboard.tsx:329-330`), and the "new" total is contacts plus prequalifications only (`Dashboard.tsx:217`). A new RFP, the page's main commercial conversion, never lights up. This ties to F-11 and F-42.
2. **Native `confirm()` is still used in five places**, against Lovable's rule to use `ConfirmDialog`: `DocumentsLibrary.tsx:192`, `EmailTemplates.tsx:178`, `FeaturedServicesManager.tsx:54`, `ServicesListManager.tsx:101`, `WhyChooseUsManager.tsx:146`. `src/components/admin/ConfirmDialog.tsx` already exists.
3. **The inbox has seven tabs** (All, RFPs, Contacts, Resumes, Prequalifications, Quote Requests, Newsletter; `UnifiedInbox.tsx:45-51`) and a separate "Estimates & Quotes" page, so estimates live in two places. There is no due-date sorting and no way to see an RFP's scope or open its drawings (F-11).
4. **Loose typing:** `ProjectEditor.tsx` has 10 lines with `any`, and `Projects.tsx` has 5. Lower priority, but it is where bugs hide.
5. **No image field for services** (A4).

### B3. Unknown

- Whether admin pages are reachable by roles other than admin (the `has_role` policies live in the database; see F-30 and the RLS notes in `01-REPORT.md`).
- Which of the 22 admin pages you actually use. Check: look at the Audit Log, or ask which ones you opened this month.

---

## Part C. Recommendations

These respect Lovable's constraints: pushing to `main` does not publish, so Publish → Update is manual. Migrations and edge functions are not deployed by Git, and a Git revert does not restore data. Keep to the brand rules (Navy, Charcoal, Steel Blue, Inter, 8px radius, no flashy gradients). Do not touch the `EnhancedHero` video logic, the nav order or the "Start a Project" button. Before any publish, run `bun run build`, `typecheck:selected` and `validate:sw`.

### C1. Header fixes

| # | Change | Size | Needs a migration? |
|---|---|---|---|
| H1 | Add the live slugs to `serviceHeroes` (`building-envelope-solutions`, `interior-buildouts-finishing`) and give `ServiceDetail` a category-level fallback so a service never renders without a photo. Remove the five dead keys. | Small | No |
| H2 | Remove `/privacy`, `/terms`, `/accessibility` from `heroPageExact`. Alternative: give them a short `PageHero` with `height="mini"`. The first is one line and safest. | Small | No |
| H3 | Give `LocationPage` an image. Use `hero-service-areas.jpg` as the default and add an optional `cityHeroes` override map. Real project photos from that city would be better than stock (F-36), if you have them. | Small | No |
| H4 | Replace the repeated photo on the six general-contractor-facing pages with real project photos: `/capabilities`, `/our-process`, `/submit-rfp`, `/why-specialty-contractor`, `/company/technology`, `/services`. This needs new assets from you, not code. | Medium | No |
| H5 | Move the Wave1 map and `hero-images.ts` into one registry and delete the three dead header components (needs your approval, since this audit never deletes). | Small | No |
| H6 | Rebuild the contractor-portal hero on `PageHero`, using `hero-contractor-portal.jpg`, so it matches the other pages. | Small | No |
| H7 | Add a test that fails when a route in `heroPageExact` has no image, or when an image key matches no live slug. This stops the same drift coming back. | Small | No |
| H8 | Longer term: let `PageHero` tell the navbar that a hero is present, instead of the hand-kept route list. | Medium | No |

Your original idea, a unique related image on every page, is sound. The code supports it for service pages, and the gaps are the city pages, the legal pages, the three or so service pages in A4, and image reuse on the busiest pages.

### C2. Admin improvements

| # | Change | Size | Needs a migration? |
|---|---|---|---|
| A1 | Make the inbox badge and the dashboard count new RFPs and quotes as well as contacts. Do this before anything else in the panel. | Small | No |
| A2 | Replace the five `confirm()` calls with `ConfirmDialog`. | Small | No |
| A3 | Add a `featured_image` field to the Service Editor with `ImageUploadField` and a warning if the value starts with `/src/`. | Small | No (column exists) |
| A4 | Add a read-only "Page headers" admin page listing every route, its image, and whether the image is shared or missing, generated from the registry in H5. | Medium | No |
| A5 | Bids & estimates tab, due-date sort, scope and attachments view, one place for estimates: the plan in `04-INBOX-READINESS.md`. | Large | Yes |
| A6 | Show a "no access" message instead of a silent redirect for non-admins. Tidy the five redirects that land on the dashboard. | Small | No |
| A7 | Reduce `any` in `ProjectEditor.tsx` and `Projects.tsx`. | Small | No |

An editable header table in the database (route, image, alt text) would let you change headers from the admin panel. I would not start there. Your answers say structure and page copy are edited in code, and a runtime fetch would add a request before the hero image can load. Revisit it if you find yourself changing headers often.

### C3. Suggested order

1. **One frontend-only branch:** H1, H2, H3 (default image), H7, A1, A2, A3. No database change. After merging to `main`, check the Lovable preview, then Publish → Update.
2. **Photography and cleanup:** H4, H5, H6, A4, A6, A7.
3. **Inbox build (A5):** back up first (Cloud → Advanced settings → Export data), then migration, then edge functions, then frontend publish. Email fixes F-06 and F-12 come before this.

### C4. Checks to run before and after

- Settle A4: run the one query in A4, or open `/services/building-envelope-solutions`, `/services/interior-buildouts-finishing` and `/services/interior-finishing-renovations` live. I did not browse production in this audit.
- After H2: view `/privacy` at the top of the page in desktop and mobile, with the navbar visible.
- After H3: view two city pages and confirm the text still reads over the photo.
- After A1: submit a test RFP in the preview environment and confirm the badge changes.

---

## Not done in this part

- I did not read Codex's review again here. If you want, I can add an addendum that reconciles it with findings 01 to 04.
- Blog-post featured images and service rows in the database were not read (Unknown, see A2 and A4).
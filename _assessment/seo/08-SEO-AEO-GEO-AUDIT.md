# 08. SEO, AEO and GEO: audit and optimization plan

Date: 2 October 2026. Read-only audit of the repository, plus public web research and public fetches of the live site and of Google's, Lovable's and others' documentation. Nothing in the source was changed. Facts cite file:line or a source. Opinions and recommendations are in labelled sections. "Unknown" says how to find out.

Terms used: **SEO** is classic search (Google, Bing) including the map pack. **AEO** (answer-engine optimisation) is being the quoted answer in Google AI Overviews, AI Mode, ChatGPT, Perplexity and voice. **GEO** (generative-engine optimisation) is the same idea for AI assistants: being mentioned and cited in generated answers.

---

## 0. Bottom line

1. **You built a lot of the right things.** Per-page titles and descriptions with real search intent, 22 service pages, 17 city pages, nine service pages with Service, FAQ and breadcrumb markup, a sitemap, a robots file that lets AI crawlers in, an `llms.txt`, and internal links. That is why three leads came from search.
2. **Two defects undo much of that work, and both are in your code.** (a) The footer overrides every page's title and canonical (F-01), so after JavaScript runs, each page tells search engines it is the homepage. (b) The HTML first served for every URL is the same homepage shell, with the homepage canonical (F-07). I confirmed (b) by fetching two of your pages from outside: both came back with the homepage title, description, canonical and H1.
3. **One thing I could not settle and you can, in ten minutes.** Lovable says it serves pre-rendered copies of older apps to "verified search engines, social preview bots, and AI crawlers". If true, Googlebot may see better content than my fetch did. The test is Google Search Console, URL Inspection, "View crawled page" on three URLs (section 4, S-02). Do this before paying for any prerendering.
4. **"Near me" searches are won on Google Business Profile, not on the website.** Whitespark's 2026 study ranks the GBP primary category, distance from the searcher, and an address in the searched city as the top map-pack factors. The site cannot fix that, and no page on it targets "painting in Mississauga" or "emergency repair in Toronto" as such.
5. **Traffic is worthless if the enquiry is lost.** Lovable reports no Resend key and no verified sender for the contact, estimate and quote alerts, and zero rows in the submission tables. Fix and test that before spending effort on traffic (see 07).
6. **Your analytics probably do not record the conversions.** The code pushes custom events into a GTM-style `dataLayer`, but the site loads plain `gtag.js` with no GTM container, so those events likely never reach GA4 (S-16). Right now you cannot tell which page or search produced the three leads.

---

## 1. How clients actually find a contractor like you (research)

| Channel | Who finds you | What decides ranking | Fixable in code? |
|---|---|---|---|
| **Map pack** ("painter near me", "emergency repair Toronto") | Homeowners, small commercial, property managers needing fast help | Whitespark 2026 top factors: primary GBP category, proximity of address to the searcher, keywords in GBP business title, physical address in the searched city, open at search time, high ratings, number of text reviews. Showing a street address on a service-area business is now a negative factor. | No. GBP work, reviews, citations. |
| **Organic results** ("commercial painting contractor Mississauga", "EIFS repair Toronto") | Property managers, condo boards, facility managers | Page relevance to the query, helpful and original content, crawlability, authority, local signals | Yes, most of this plan. |
| **AI answers** (AI Overviews, AI Mode, ChatGPT, Perplexity) | Researchers asking "who repairs stucco on condos in Toronto" | Google says there are no extra requirements beyond normal search quality. Whitespark adds that mentions and citations across the web matter ("the new link"). | Yes: content, entities, crawlability. |
| **Professional channels** (consultants, GCs, bid platforms) | GC estimators, building-envelope consultants, developers | Prequalification, references, bid-platform presence, past projects. The pages that rank for "parking garage restoration Toronto" are engineering consultants and large restoration firms (RJC, Sals O'Brien, NHC, Valcourt). | Partly: case studies, prequal page, GC page. |

**Expectation to set.** The map pack rewards physical presence. If your address is in North York (2 Jody Ave, `src/constants/company.ts:18-22`), you will be at a disadvantage for Mississauga map-pack searches no matter how good the website is. Organic city pages can still rank for "painter Mississauga". Whitespark's study, Google's service-area guidelines and the doorway policy together shape what is worth doing (section 3).

---

## 2. What is already implemented (verified in code)

| Element | Where | Notes |
|---|---|---|
| Per-page title, description, canonical, Open Graph, Twitter | `src/components/SEO.tsx:38-70,226-279` | Sensible per-page values exist. They are lost to F-01. |
| Intent-rich titles and H1s on the nine service pages | `src/data/wave1-services.ts` (for example "Commercial Painting Contractor GTA", "Interior Painting Contractor Toronto") | Good targeting. Pages have 410 to 550 words of structured copy plus FAQs. |
| Service, FAQPage and BreadcrumbList markup on those pages | `src/components/services/Wave1ServicePage.tsx:131-160` | Good, but FAQ rich results no longer exist (S-06). |
| 17 city pages with breadcrumbs, a service list and related projects | `src/pages/resources/LocationPage.tsx` | One short paragraph per city. See S-04. |
| Sitemap (49 URLs) and robots with AI crawlers allowed | `public/sitemap.xml`, `public/robots.txt` | Missing pages: see S-12. |
| `llms.txt` | `public/llms.txt` | Harmless. Google says it does not use it (S-15). |
| Geo meta tags, `geo` coordinates, `areaServed`, hours | `index.html`, `SEO.tsx` | Hours disagree with the contact page (F-43). |
| Analytics helpers for form, phone and CTA events | `src/lib/analytics.ts` | Probably not reaching GA4 (S-16). |

---

## 3. Findings and recommendations

Severity is for revenue impact. Evidence and confidence are stated. "Codex task" numbers refer to section 5.

### S-01. The footer overrides every page's title and canonical. (Critical, fix first)
- **Fact.** `Footer.tsx` renders `<SEO structuredData={citationSchema} />` (two places, around lines 136 and 156). With no title, `SEO.tsx:38` falls back to the generic "Ascent Group Construction | Building Envelope & Restoration". The footer mounts last, so its tags win. Observed in a real browser on all 34 routes in the first audit (F-01). The static `<link rel="canonical" href="https://www.ascentgroupconstruction.com/">` in `index.html` also stays in the page, so non-home pages carry two canonicals: `/` and their own.
- **Why it matters.** Google's own guidance: set the canonical in HTML, and "you shouldn't use JavaScript to change the canonical URL to something else than the URL you specified as the canonical URL in the original HTML." Yours does exactly that. Result: Google may treat your service and city pages as duplicates of the homepage. This is the most likely reason pages have not ranked for their own terms.
- **Search-index evidence (medium confidence).** A web search for your domain returned two service URLs (`/services/building-envelope-solutions` and `/services/waterproofing-systems`) under the same generic title built from the homepage headline, not their own titles. That search tool is not Google, so treat it as a hint.
- **Fix (Codex task T-01).** Remove both `<SEO>` elements from `Footer.tsx`. Remove the static canonical from `index.html`. Keep the generic title and description there only as defaults.
- **Acceptance.** In a browser, on `/contact`, `/services/painting-services` and `/service-areas/mississauga`: `document.title` equals the page's own title; exactly one canonical, equal to that page's URL.

### S-02. Crawlers are served the same homepage shell for every URL. (Critical, verify, then maybe fix)
- **Fact.** Fetching `/services/painting-services`, `/services/waterproofing-systems` and `/service-areas/mississauga` from outside returned the homepage title, homepage description, homepage canonical, and the homepage H1 ("Ontario's Prime Specialty Contractor for Building Envelope & Restoration"), which is the `<noscript>` text in `index.html`. Lovable (earlier answers H2, S1) confirms the raw HTML is identical for all routes, and that unknown URLs return HTTP 200.
- **What research says.** Google: "server-side or pre-rendering is still a great idea because it makes your website faster for users and crawlers, and not all bots can run JavaScript." A Vercel study (December 2024) found OpenAI, Anthropic and Perplexity crawlers do not execute JavaScript, while Googlebot and Applebot do. That study is nearly two years old. Re-check if it matters to a decision.
- **The conflict.** Lovable's FAQ says older React and Vite apps like yours are served as "pre-rendered copies of their published pages to verified search engines, social preview bots, and AI crawlers". My fetch is not a verified bot, so it would not receive them. **Unknown** what Googlebot, OAI-SearchBot and PerplexityBot actually receive.
- **Test (you, 10 minutes, free).** In Google Search Console, URL Inspection, enter `https://www.ascentgroupconstruction.com/services/painting-services`, click "View crawled page" and read the title, canonical and body in the HTML tab. Repeat for `/service-areas/mississauga` and `/emergency-repair`. Also ask Lovable (round 2, question 8) for the live DOM title and canonical.
- **Decision.**
  - If the crawled page shows the right title, canonical and body: S-01 alone may fix most of it. Prerendering becomes optional hardening.
  - If it shows the homepage shell: prerender at build time (Vite plugin, see option A) or put a Cloudflare Worker with Prerender.io in front (option B).
- **Options (recommendation).**
  - **A. Build-time prerender of ~50 public routes.** Lovable confirms this is feasible if browser-only code is guarded (`navigator.connection` in `EnhancedHero.tsx`, `matchMedia`, `sessionStorage`). Risk: your hero video logic is protected, so test it. Dynamic routes (services, projects, blog) need data fetched at build time.
  - **B. Cloudflare Worker plus Prerender.io.** Their Lovable guide says the Worker sends bot requests to Prerender.io and everyone else to your Lovable app, and takes about 30 to 45 minutes. It needs the domain on Cloudflare. Lovable says your DNS is at an external registrar, which may or may not be Cloudflare. Pricing is not stated in the guide.
  - **C. Migrate to a server-rendered framework.** Lovable now builds new apps on TanStack Start. This is the biggest job. Only if A and B prove inadequate.

### S-03. Titles and descriptions: duplicates, length, and a wrong append rule. (High)
- **Fact.** `SEO.tsx:38` always appends " | Ascent Group Construction". Many pages already end in the brand, so the result is "Commercial Painting Contractor GTA | Ascent Group | Ascent Group Construction" (F-40). `og:title` is cut at 60 characters (`SEO.tsx:226`). `<meta name="keywords">` is still emitted and has been ignored by Google for years.
- **Fix (T-02).** Append the brand only if the title does not already contain "Ascent". Keep titles under 60 characters with the key phrase first. Drop the keywords meta. Suggested titles for your highest-value pages (for you to approve; none uses unverified claims):

| URL | Suggested title | Chars |
|---|---|---|
| `/` | Building Envelope & Restoration Contractor, Toronto \| Ascent | 58 |
| `/emergency-repair` | Emergency Leak & Façade Repair, Toronto & GTA \| Ascent | 54 |
| `/services/commercial-painting-gta` | Commercial Painting Contractor GTA \| Ascent Group | 49 |
| `/services/exterior-painting-toronto` | Exterior Painting Toronto: Stucco & EIFS Recoats \| Ascent | 58 |
| `/services/parking-garage-restoration` | Parking Garage Restoration Toronto & GTA \| Ascent | 49 |
| `/service-areas/mississauga` | Building Envelope & Painting Contractor Mississauga \| Ascent | 59 |

  Use "24/7" only once O11 is true (F-17).

### S-04. No page targets the searches you care about; city pages are thin and templated. (High, plan carefully)
- **Fact.** Your example searches ("Mississauga paint near me", "Toronto emergency repair") do not map to a page. The 17 city pages are all titled "Building Envelope Contractor in {City}" and carry one `description` paragraph each (`LocationPage.tsx:34-75`, `:274`), plus the same service list, phone card and a database query for nearby projects. Their hours read "Mon-Fri 8AM-6PM" (`LocationPage.tsx:316`). Painting has its own strong pages, but none is tied to a city. `/emergency-repair` covers the whole GTA.
- **Google's doorway policy.** "Doorway abuse is when sites or pages are created to rank for specific, similar search queries," and the examples include "multiple domain names or pages targeted at specific regions or cities that funnel users to one page". Scaled-content policy bars "many pages generated... without adding value." Seventeen near-identical pages is the risk pattern, and so would be 17 cities times 22 services.
- **Recommendation.** Do not multiply pages. Instead:
  1. Pick **4 to 6 areas** where you really work and can show projects (candidates: Toronto, Mississauga, Brampton, Vaughan, Markham, Hamilton; for you to choose, O23).
  2. For each chosen area, make a **substantial page**: the building types and typical problems there, which of your services apply (linked), 2 to 3 real projects with photos, the response time you can really offer, a named contact, local FAQs. Aim for 600 to 900 words of original content.
  3. For the other cities, fold them into a single "Service areas" page with a list (and `areaServed` in markup). Keep the old URLs, point them at the nearest hub with a client-side redirect plus `noindex`, or leave them with a `noindex` until they are rewritten.
  4. Add **two or three intent pages** only where you have capacity and proof: for example "Commercial painting in Mississauga" and "Emergency leak and façade repair in Toronto". The emergency page must state a real response procedure (F-17).
- **Why not just write more cities.** Doorway risk, effort, and the map pack does not reward it.

### S-05. Business identity and Google Business Profile. (High, mostly outside the code)
- **Fact.** The site publishes "2 Jody Ave, North York, ON M3N 1H1" in schema, the footer and elsewhere. Whether the profile is verified, what category it uses, and whether it shows the address are all **Unknown** (look at the Business Profile, or search your name in Maps).
- **Google's rule.** A service-area business that does not serve customers at its address should remove the address from its profile, may list up to 20 service areas, and should stay within about two hours' drive of its base. Whitespark's 2026 study lists showing an address while being a service-area business as a new negative factor.
- **Recommendation (decision for you, O15).**
  - If clients visit 2 Jody Ave: show the address, keep it identical everywhere (NAP: name, address, phone).
  - If not (home office or yard): hide it in GBP, choose service areas, and keep the schema `address` to city and region only.
  - Primary category should be the service that brings the most revenue, not the broadest one; add a few secondary categories. Do not put keywords in the business name that are not part of your legal or trading name; that breaks Google's guidelines even though it is a ranking factor.
  - Make hours match everywhere, including the contact page, the schema and GBP (F-43). A contractor that is closed at the hour someone searches is penalised ("open at time of search").
  - Add the website link with UTM tags so GBP traffic shows in GA4 (S-16).

### S-06. Structured data is duplicated, contradictory, and partly ineligible. (High)
- **Fact.**
  - `SEO.tsx:47-215` builds a full LocalBusiness block (typed `HomeAndConstructionBusiness` and `LocalBusiness`) on **every page** that uses `<SEO>`, with the page's own description inside it.
  - The footer then emits a second block with the **same `@id`** (`${SITE_URL}/#organization`) but typed `ProfessionalService`, with only region and country in the address and `areaServed: Ontario` (`Footer.tsx`, `citationSchema`). Two different entities under one identifier is a conflict.
  - The homepage emitted nine JSON-LD blocks in the first audit, with LocalBusiness twice.
  - `areaServed` lists five cities; the site says 17.
  - `priceRange: "$$-$$$"` (and `"$$$$"` in another file), `paymentAccepted` including "Financing Available", and `aggregateRating` are present or possible. None can be verified from the code.
  - Only one `sameAs` link (LinkedIn) is defined, and it sits in a utility file whose use I did not trace.
- **Research.**
  - Google: "If the entity that's being reviewed controls the reviews about itself, their pages that use LocalBusiness or any other type of Organization structured data are ineligible for star review feature." So `aggregateRating` on your own LocalBusiness earns nothing and invites a manual action (F-49). Currently the `testimonials` table is empty, so it likely does not appear.
  - **FAQ rich results are gone.** Google's FAQ page says the feature "will no longer appear in Google Search starting May 7, 2026." Keep the visible FAQ sections (they help AI answers and users), but do not invest further in FAQPage markup for Google.
  - Google: "There's also no special schema.org structured data that you need to add" for AI Overviews or AI Mode.
- **Recommendation (T-03).**
  - Define the business **once** (one `@id`) on `/`, `/about` and `/contact`, using the most specific type that fits and that Google supports: schema.org has `GeneralContractor` and `HousePainter`; use `GeneralContractor` for the company and reference it from service pages.
  - On service pages emit `Service` with `provider: {"@id": ".../#organization"}`, `areaServed`, and `BreadcrumbList`. On blog posts emit `Article` with a named author and dates.
  - Remove the per-page LocalBusiness and the footer entity.
  - Make `areaServed` match the real service areas you decide on.
  - Delete `aggregateRating`, `paymentAccepted`, `priceRange` until each is true and visible on the page.
  - Validate with Google's Rich Results Test and the Schema Markup Validator.

### S-07. Content depth and answer-first structure (AEO). (High)
- **Fact.** The nine service pages hold 410 to 550 words each; the database-driven ones are not measured. A competing emergency-leak article I read was 800 to 900 words, opened with the problem and a stat, then headed steps (but had no local detail and weak credentials, so it is beatable).
- **What helps AI answers, per Google and the research.** Original, specific, trustworthy content; clear question-style headings; a short answer first; evidence; named authorship; freshness. Vendor sites quote large statistics about AI citation; I treat those as unproven and do not rely on them.
- **Recommendation (T-04): a template for every service page and hub page.**
  1. **Answer capsule**: 40 to 60 words under the H1 that answer "what is this, who is it for, how fast can you start" in plain language.
  2. **Quick facts**: scope, typical project size, lead time, certifications that are verified.
  3. **Process** in numbered steps.
  4. **When to call us** (symptoms) and **what happens in the first 48 hours**.
  5. **Materials and standards you use** (the manufacturer and code references you can really document).
  6. **Honest cost drivers** and, if you can stand behind them, price ranges.
  7. **Two real projects** with photos and results.
  8. **FAQs** (5 to 8, real questions you hear).
  9. **Service areas**, each a link.
  10. **Author, reviewer and "last updated" date**, with a named person.
- **Topic list for new pages (for you to confirm; each must use your own facts).** Parking garage restoration planning for condo boards and property managers; EIFS repair versus recoat versus replace; sealant replacement programs; finding the source of a wall or façade leak; commercial painting scheduling in occupied buildings; intumescent coatings: when they are required and what inspectors check; what a GC should send us to get a bid (scope, drawings, due date). Check any code or regulation reference with an engineer before publishing.

### S-08. Proof and trust signals (E-E-A-T). (High)
- **Fact.** All 11 published projects carry on-time, on-budget, zero-incident badges and only three show a value (Lovable, C1 and C2). The site contradicts itself on WSIB, COR, bonding and Sto (F-02, F-03). The prequalification page uses anonymous references (F-18). Hero images look like stock photos (F-36). The `testimonials` table is empty.
- **Why it matters for search.** Both Google's quality guidance and AI engines weigh visible evidence and consistency. A buyer who finds contradictions also bounces, which hurts conversion more than ranking.
- **Recommendation.** Settle the facts first (the owner questions in 06, Part 10), then publish each credential once with a document behind it. Six strong case studies with real photos, scope, role, year and a named reference beat eleven thin ones.

### S-09. Reviews. (High, not code)
- **Fact.** Reviews are a top-ten map-pack factor (rating and count of text reviews). The review-request function still contains the placeholders `YOUR_GOOGLE_PLACE_ID` and `YOUR_COMPANY_ID` (Lovable, E15). The `testimonials` table is empty. Self-published reviews on your site earn no stars in search (S-06).
- **Recommendation.** After each finished job, ask for a Google review with the direct review link. Aim for steady flow rather than a burst. Reply to every review. Use the GBP "ask for reviews" link or a QR code on invoices. Finish `send-review-request` only after the email path works (07).

### S-10. Citations, mentions and directories. (Medium)
- **Recommendation.** AI engines and local ranking both use consistent business listings and third-party mentions. List the business with identical name, address (or service area) and phone on: HomeStars, Houzz, Yelp, BBB, your local Board of Trade or Chamber, and trade bodies you belong to. For the commercial side, confirm the claims you make about ConstructConnect and DataBid (F-28), keep a Procore profile, and ask manufacturers you are listed with for a listing on their installer finder. Only list what is true.

### S-11. Internal links are weaker than they look. (Medium)
- **Fact.** On service pages the city names are plain text, not links: `src/components/seo/ServiceAreaSection.tsx:41` renders `<span>{city}</span>` (finding N-1 in 07). City pages are not in the sitemap. `/emergency-repair` is in the navigation but missing from the sitemap, as are `/for-architects` and `/why-specialty-contractor`.
- **Recommendation (T-05).** Turn the city names into links to the hub pages you keep. Link service ↔ hub ↔ project ↔ blog both ways. Put one clear link to `/emergency-repair` in the header or hero for homeowners and property managers.

### S-12. Sitemap and crawl signals. (Medium)
- **Fact.** `public/sitemap.xml` has 49 URLs with only two `lastmod` dates (25 on 2026-03-08, 24 on 2026-06-06). Missing: `/for-architects`, `/emergency-repair`, `/why-specialty-contractor`, all 17 city pages, 10 of 11 projects and 5 of 6 blog posts. It includes `/services/interior-finishing-renovations`, which has no hero image or registry entry. Legal pages are listed.
- **Recommendation (T-06).** Generate the sitemap at build time from the route list and the `services`, `projects` and `blog_posts` tables, with real `lastmod` values. List only URLs you want indexed (so, only the city hubs you keep). Submit it in Google Search Console and Bing Webmaster Tools.

### S-13. Soft 404s and redirects. (Medium)
- **Fact.** Unknown URLs return HTTP 200 and render a "not found" view (Lovable H1, S10). The 68 legacy redirects are client-side only. The bare domain redirects with a 302, not a 301 (Lovable H3). Unknown project slugs redirect to `/projects`; unknown blog and city slugs show a message with no `noindex` (F-39).
- **Recommendation (T-07).** Add `noindex` to every not-found view through the `SEO` component. Lovable cannot do server redirects for sub-paths, so keep the canonical right on every page. Ask Lovable whether the apex 302 can be a 301. Do not rely on `_redirects` or `_headers`; they are ignored.

### S-14. Speed on phones. (Medium)
- **Fact.** The entry bundle is 1,353 KB (306 KB gzip) and includes admin and chart code (F-31). Lighthouse performance was 86 with LCP about 2.0 s in the repository's own notes, date unknown. No field data. PageSpeed Insights returned a quota error when I tried it, so I have no current figure.
- **Recommendation (T-08).** Run PageSpeed Insights (mobile) on `/`, one service page and one city page. Lazy-load admin routes with `React.lazy`. Do not add `manualChunks`. Compress hero images (WebP) and avoid loading the hero video on slow connections (it already skips it for Data Saver). Google's published thresholds are LCP under 2.5 s, INP under 200 ms and CLS under 0.1.

### S-15. AI crawler access and `llms.txt`. (Low)
- **Fact.** `robots.txt` allows Googlebot, Bingbot and the named AI crawlers (`robots.txt:30-85`). `llms.txt` lists services and the 17 cities and states "Sto Canada Listed Installer" and "full WSIB coverage".
- **Research.** Google says `llms.txt` is not needed for AI Overviews or AI Mode. Other AI vendors are reported to read it, but I found only a secondary source for that, so treat it as unproven.
- **Recommendation.** Keep it, but make every claim in it match the verified facts (O1 to O7), and fix the hours and the city list. Do not spend more time on it. Make sure OAI-SearchBot and PerplexityBot are not blocked (they are not now).

### S-16. Measurement: you cannot see what produces leads. (High)
- **Fact.**
  - GA4 `G-42L85RG6M6` is loaded by `gtag.js` from `index.html:88-95` after a 3-second delay. There is no Google Tag Manager container.
  - `src/lib/analytics.ts:9-14` pushes custom events as plain objects (`{event: 'form_submit'}`) into `window.dataLayer`. Only GTM turns those into events. `gtag.js` ignores them. So the form, phone-click and CTA events in `analytics.ts`, `PhoneLink.tsx:24`, `Contact.tsx:65` and `Estimate.tsx:332` probably never reach GA4. **Unknown until checked in GA4 DebugView.**
  - "Reject Analytics" does not stop tracking (F-16), so any data is also a compliance risk.
  - The live submission tables were empty (Lovable, D14), so the three leads you got most likely arrived by phone or email, or were removed. The site cannot tell which search or page produced them.
- **Recommendation (T-09).**
  - Send events with `gtag('event', ...)` (or add a proper GTM container). Define key events: `generate_lead` (contact, estimate, RFP, prequal), `click_to_call`, `click_email`.
  - Fix consent so analytics respects "Reject" (F-16).
  - Connect GA4 to Search Console; add Bing Webmaster Tools and import the Search Console site there.
  - Add a "How did you hear about us?" field and store the landing page and UTM values on each submission (needs a database change, applied through Lovable first).
  - Use a distinct UTM on the GBP website link and a call-tracking number if you can keep NAP consistent.

### S-17. The landing page must convert the visit. (High)
- **Fact.** On phones there is no phone number or estimate button on the first screen of the homepage and the sticky bar appears only after 600 px (F-15). The cookie banner covers the bottom third of the first screen (F-20). Response promises differ between pages (F-21). Contact form accepts only plain letters in names (F-24).
- **Recommendation (T-10).** On every service, city and emergency page: a click-to-call button and an "Request an estimate" button visible without scrolling on phones; one response promise; the emergency page states the real after-hours procedure.

---

## 4. Tests you can run without Codex (do these first)

1. **What Googlebot sees.** Search Console, URL Inspection, "View crawled page" for `/services/painting-services`, `/service-areas/mississauga`, `/emergency-repair`. Note title, canonical, headings.
2. **What is indexed.** In Search Console, Pages report: how many pages are indexed, and the reasons for "Duplicate, Google chose different canonical" and "Crawled, currently not indexed". Check the Performance report for the queries that already bring clicks (your three leads may be visible here).
3. **Google Business Profile.** Is it verified? Primary category? Address shown or hidden? Hours? Review count? Website link? Photos? Open Insights for calls and direction requests.
4. **Live DOM.** Ask Lovable round-2 question 8 (title and canonical after load).
5. **GA4 DebugView.** Click a phone link and submit a test form on a preview build; see whether any event arrives.
6. **AI visibility baseline.** Ask ChatGPT, Perplexity and Google AI Mode 15 questions a client would ask ("who repairs stucco on a Mississauga condo", "emergency leak repair commercial building Toronto") and record whether Ascent is named and which firms are. Repeat monthly.
7. **Speed.** Run PageSpeed Insights on the three pages in S-14.
8. **Keyword data.** Lovable says its "SEO & AI search" tab can research keywords and competitors with Semrush data and connect Search Console. Run it and paste the output back.

---

## 5. Codex task cards

**Guardrails to paste at the top of every Codex session** (from Lovable's rules and this audit):
- Work on a feature branch, not `main`. Merging to `main` syncs to Lovable but does not publish. A person clicks Publish → Update in Lovable.
- Do not touch the `EnhancedHero` video logic, the navigation order and "Start a Project" button, `/capabilities`, the contractor portal, or brand tokens (Navy #003366, Charcoal #36454F, Steel Blue #4A90A4, Inter, 8px radius).
- Do not add Vite `manualChunks`. Do not claim "500+ projects". Use `SITE_URL` (www) for every absolute URL and `src/constants/company.ts` for phone, email and address.
- Do not use `window.confirm` or `alert`; use `ConfirmDialog` and toasts.
- Database changes: write the SQL file, but the person applies it through Lovable first. Order is migration, then edge functions, then frontend publish. Edge functions do not deploy from Git pushes.
- Before every PR run `bun run build`, `typecheck:selected` and `validate:sw`, and report the results.
- Never print or commit secrets. Do not edit `.env`, `src/integrations/supabase/client.ts` or `types.ts`.

| Task | Change | Files | Acceptance check |
|---|---|---|---|
| **T-01** (S-01) | Remove both `<SEO>` elements from the footer. Remove the static canonical from `index.html`. | `src/components/Footer.tsx` (around 136, 156), `index.html:170` | Per-page title, one canonical, equal to page URL, on 6 routes. |
| **T-02** (S-03) | Append brand only if absent; drop `keywords` meta; keep titles under 60 characters; update the six titles in S-03. | `src/components/SEO.tsx:38,226`, page titles | No title contains "Ascent" twice. |
| **T-03** (S-06) | One business entity with one `@id` on `/`, `/about`, `/contact`; `Service` with `provider` reference on service pages; `Article` on posts; remove per-page LocalBusiness, footer entity, `aggregateRating`, `paymentAccepted`, `priceRange`; align `areaServed`. | `SEO.tsx:47-215`, `Footer.tsx citationSchema`, `src/utils/structured-data.ts`, `src/utils/seo/structured-data.ts`, `Wave1ServicePage.tsx` | Rich Results Test and Schema Validator show no errors; one entity per `@id`. |
| **T-04** (S-07) | Add the answer-first template to the service pages and to each kept area page. Content comes from you; Codex builds the template and component. | `Wave1ServicePage.tsx`, `ServiceDetail.tsx`, `LocationPage.tsx` | Answer capsule, quick facts, process, FAQ, author and date render on each page. |
| **T-05** (S-11) | Turn the city names into links; add a link to `/emergency-repair` in the hero or header. | `src/components/seo/ServiceAreaSection.tsx:41`, `Navigation.tsx` | City names are anchors; link count verified. |
| **T-06** (S-12) | Generate `sitemap.xml` at build from routes plus database tables; real `lastmod`; only kept city pages; add the three missing pages. | `public/sitemap.xml`, a build script | Sitemap lists `/for-architects`, `/emergency-repair`, `/why-specialty-contractor`; no `noindex` page listed. |
| **T-07** (S-13) | `noindex` on not-found views; `/case-studies` points to a real index or redirects. | `NotFound`, `BlogPost.tsx`, `ProjectDetail.tsx`, `LocationPage.tsx`, `AppRoutes.tsx:249` | Unknown slug renders with `noindex`. |
| **T-08** (S-14) | Lazy-load admin and chart code; compress hero images; no `manualChunks`. | `src/routes/AppRoutes.tsx`, assets | Entry bundle smaller; the PageSpeed run in S-14 recorded before and after. |
| **T-09** (S-16) | Replace `dataLayer.push` with `gtag('event')`; define key events; fix consent for "Reject"; store landing page and UTMs on submissions (database change via Lovable). | `src/lib/analytics.ts`, `index.html:84-98`, `CookieBanner.tsx`, forms | GA4 DebugView shows `generate_lead` and `click_to_call`. |
| **T-10** (S-17) | Phone and estimate buttons above the fold on mobile on service, city and emergency pages; one response promise. | `Navigation.tsx`, `StickyInquiryBar.tsx`, hero components | Visible at 390×844 without scrolling. |
| **T-11** | Make `llms.txt`, hours and city list match the verified facts. | `public/llms.txt`, `SEO.tsx`, `Contact.tsx` | One hours string used everywhere. |
| **T-12** (S-02) | Only if the Search Console test fails: build-time prerender of the public routes, with browser-only code guarded. | `vite.config.ts`, `EnhancedHero.tsx`, build script | `curl` of a service URL returns its own title, canonical and H1. |

---

## 6. Roadmap

| When | What |
|---|---|
| **This week (no code)** | Check `RESEND_API_KEY` and put a test enquiry through the preview (07). Search Console and Bing Webmaster Tools set up. URL Inspection test (S-02). GBP audit (S-05). Answer the owner questions in 06 Part 10. |
| **Branch 1 (one small PR)** | T-01, T-02, T-05, T-06, T-07, T-11, then T-09 and T-10. Publish. Re-run URL Inspection and request indexing for the key pages. |
| **Weeks 2 to 4** | Credentials and case-study facts settled; T-03 schema; real photos; GBP categories, hours, services, photos; review requests started. |
| **Weeks 4 to 8** | T-04 template on the top six pages; rewrite 4 to 6 area pages; two intent pages; first two articles; directory listings. |
| **Day 30, 60, 90** | Compare Search Console clicks and impressions for your target queries, GBP calls and directions, GA4 `generate_lead` by source, and the monthly AI-visibility prompt check. Decide on T-12 and more content from the numbers. |

---

## 7. Decisions needed from you

| # | Question |
|---|---|
| D1 | Where did your three leads come from (phone, email, a form, GBP)? Which page or search, if known? |
| D2 | Is 2 Jody Ave a place clients visit? That decides whether the address is shown (S-05). |
| D3 | Which 4 to 6 areas do you want to win, and in which can you show real projects? |
| D4 | Which two or three service-and-city combinations bring the most profit? |
| D5 | Is there a real after-hours procedure for emergencies? What response time can you promise? |
| D6 | Who can write or review the technical content, and who is the named author? |
| D7 | Are you willing to ask clients for reviews and references? |
| D8 | Is Cloudflare the DNS provider for the domain? (Matters for the prerender option B.) |

---

## 8. Sources

- Google Search Central, [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- Google Search Central, [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- Google Search Central, [FAQ structured data](https://developers.google.com/search/docs/appearance/structured-data/faqpage) (rich result removed from May 7, 2026)
- Google Search Central, [Spam policies (doorway and scaled content abuse)](https://developers.google.com/search/docs/essentials/spam-policies)
- Google Search Central, [Review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- Google Business Profile Help, [Service-area business guidelines](https://support.google.com/business/answer/9157481)
- Vercel, [The rise of the AI crawler](https://vercel.com/blog/the-rise-of-the-ai-crawler) (December 2024)
- Lovable docs, [FAQ: SSR, prerendering and SEO](https://docs.lovable.dev/introduction/faq)
- Prerender.io, [Integrating with Lovable-hosted sites](https://docs.prerender.io/docs/how-to-integrate-prerender-with-lovable-hosted-websites)
- Whitespark, [2026 Local Search Ranking Factors](https://whitespark.ca/local-search-ranking-factors/)
- Passionfruit, [llms.txt and Google's 2026 guidance](https://www.getpassionfruit.com/blog/should-i-create-an-llms.txt-file-google-s-2026-guidance-explained) (secondary source)
- Searchable, [Local AI search tactics](https://searchable.com/blog/local-business-ai-search-optimization-2026) (vendor claims; statistics not relied on)
- Valcourt, [Emergency leak repairs](https://valcourt.group/blog/what-to-expect-in-emergency-leak-repairs/) (competitor example)
- Live fetches of `https://www.ascentgroupconstruction.com/services/painting-services`, `/services/waterproofing-systems` and `/service-areas/mississauga` on 2 October 2026
- Earlier audit files 01 to 07 in this folder
# SEO and runtime assessment: implementation status

Checked 2026-10-03 against merged main `20235ed` (PR #40), public pages, and this branch's production build. The owner authorized verified code fixes in a new PR and retained the hold on credentials and business facts.

## Implemented in this PR

- Short and full company-brand titles are recognized without appending another brand. Social titles retain their complete wording. Obsolete keywords metadata is removed from both React and the HTML fallback. Existing page-title wording is preserved. Nullable content descriptions use the established fallback instead of crashing metadata rendering.
- Social images resolve relative assets on `SITE_URL` and preserve absolute public storage URLs. Invalid schemes and URLs containing credentials use the existing public fallback. Article, breadcrumb, video, and service metadata use the canonical domain. Legal pages receive their missing canonical links.
- Homepage duplicate business blocks and per-city business entities are removed. One existing company entity has a stable company description and the same 17 cities as the website's shared service-area list. City `Service` schemas identify the actual `/service-areas/:city` URL, served city, and company provider. Self-serving business review-star markup and SEO's unnecessary review queries are removed; visible reviews stay in place.
- Missing articles, projects, and cities render `noindex` at their requested URL. Project lookup uses `maybeSingle`; a genuinely missing row is distinct from a failed read, which offers retry. Article and project state is cleared on navigation and late requests cannot replace the new route's content. Token previews are non-indexable and metadata excludes their query strings. `/case-studies` resolves to `/blog`; legacy article links resolve to `/blog/:slug` while retaining preview parameters and anchors.
- Custom analytics helpers deliver `gtag('event', name, parameters)` commands. Existing event names are retained, with `generate_lead`, `click_to_call`, and `click_email` added. Contact, inline, and RFP conversions require the server's successful saved-record response; estimate and quote-dialog conversions follow successful inserts. Failed, blocked, or opaque intake responses do not create lead events. Native phone/email links are measured centrally without double-counting `PhoneLink`; obfuscated `EmailLink` uses the same consent-aware helper and does not send its email address as an event value; the new event parameters exclude submitted names, addresses, email, phone, and message text. Existing consent gating remains active.
- All named search/AI crawlers and the wildcard group share the same admin/API exclusions. `OAI-SearchBot` is explicitly covered. `/tekev` stays crawlable so its existing noindex directive can be read. `llms.txt` adds the existing King City and Sustainable Building destinations.
- The sitemap generator excludes redirect-only service records using the same alias map as routing. Generation was rechecked against published public records and produced 85 URLs with real source/database dates. This workspace requires `NODE_USE_ENV_PROXY=1 NODE_USE_SYSTEM_CA=1` for Node to use the configured proxy and trusted certificate store. Generation remains an explicit public-read command; publishing does not depend on a live database request during every build.

## Full audit reconciliation

| Finding | Current status |
| --- | --- |
| S-01 footer SEO | Fixed in PR #39; ownership/canonical regressions remain covered by tests. |
| S-02 crawler rendering | Search Console rendered URL Inspection and Lovable's verified-bot behavior remain unverified. No speculative prerender/SSR change. |
| S-03 metadata | Duplicate append, obsolete keywords, social-title truncation, image URLs, and legal canonicals fixed here. The six proposed editorial title rewrites are not applied. |
| S-04 city/intent content | Existing 17 destinations retained. Choosing fewer markets, original local evidence, and new intent pages requires owner input; no mass redirects/noindex. |
| S-05 identity/GBP | Address visibility, categories, verification, and hours depend on the owner's actual business and account. |
| S-06 structured data | Duplicate identities, page-description contamination, city service URLs, city-list mismatch, and review-star markup fixed here. The established company type and its shared full entity remain; placement only on home/about/contact is not adopted. Existing hours, price/payment claims, and authorship need factual review. External Rich Results/Schema Validator results are not claimed. |
| S-07 answer-first content | Existing service FAQs/quick facts retained. Original content, named experts, and genuine review dates require owner evidence. |
| S-08 trust | Credentials, certifications, warranties, project proof, and related documents remain on hold. |
| S-09 reviews | Review solicitation and Google account actions require the owner; no messages sent. |
| S-10 citations | External directory/profile work remains account/content work; no listings posted. |
| S-11 internal links | City links, project native links, service discovery, and emergency navigation were addressed in PR #38. Main navigation order remains unchanged. |
| S-12 sitemap | PR #38 supplied 85-page coverage and a generator with real dates. This PR prevents published service aliases reappearing. No live-network build hook added. |
| S-13 missing pages | Client noindex, explicit missing/read-error states, lifecycle guards, and blog aliases fixed here. Actual HTTP 404/301 statuses require hosting support; SPA fallback remains HTTP 200. |
| S-14 speed | Admin routes were already lazy. No unsupported chunk redesign or unmeasured image-compression claim. Field/PageSpeed data remains an external follow-up. |
| S-15 AI discovery | Crawler-group inheritance and the two omitted existing destinations fixed here. Credential language in llms.txt remains held. |
| S-16 measurement | GA4 command delivery, confirmed-save lead events, and native contact-link events fixed here. Rejection was fixed in PR #39. GA4 receipt/key-event configuration and database UTM columns remain unverified/deferred. |
| S-17 conversion | Approved page layout preserved. A unified response promise, genuine service hours, and coordinated intake validation require the next content/backend decisions. |

## The later runtime report

The report's four stated causes were rechecked:

| Claim | Current evidence |
| --- | --- |
| Missing `getCityHero` export crashes every city | The export exists in merged main. All 17 city routes render their illustrated regional map in this branch's production build. Published Toronto also renders and loads that image. |
| Invalid `/src/` database image loses the service fallback | The resolver rejects deployment-invalid paths and supplies a bundled fallback. Published building-envelope and interior-renovation pages load their mapped photos. |
| Hero provider starts legal navigation transparent | Its registration map starts empty; transparency requires a hero registered for the current navigation. Published privacy/terms and local legal pages have solid navigation. |
| `load()` permanently freezes the homepage | `load()` still exists, but the current published video reaches readyState 4, opacity 1, and advancing playback. No failed video request or rejected play promise was observed. No hero-video code change is included. The earlier owner symptom matched reduced-motion fallback and was resolved in that session. |

These checks do not establish the state of an authenticated Lovable preview, a stale browser cache, or real Safari. Public browser reads used a TLS-verified Python relay because this workspace's browser/Node proxy handling differs from normal desktop Chrome; the relay changes request timing. No private production record was accessed, no live form was submitted, and no email was sent.

The backend deferrals in the report are real: no new `inquiries` table, quote-note column, or server-side email consolidation has been deployed. Estimates stored in `contact_submissions` retain that table's existing editable notes; `quote_requests` notes remain read-only. The report cannot establish whether an email secret is configured or a sender domain is verified. The desktop menu's deliberate 12-service limit is a design decision; the Services directory and other discovery paths expose the remaining services.

## Validation and release

- 305 tests across 41 files pass, including head ownership, canonical/image handling, consent-aware command delivery, blocked intake results, slug races, previews, and aliases.
- Full app typecheck, selected strict typecheck, production build, service-worker validation, local smoke checks, and route audit pass.
- Full lint: 288 errors and 34 warnings, compared with merged main's 294 errors and 34 warnings. No new diagnostics in changed files. These remaining pre-existing errors are not described as a passing lint run.
- Browser verification: 25 local route checks and 5 published route checks, with no runtime errors. This includes every city, missing-content screens, legacy blog routing, legal navigation/canonicals, single company entities, and local mocked intake/contact-event commands. A local intake fixture produced zero lead events for a blocked response, then exactly one lead event after a confirmed save and one event for each contact-link click. No external write was sent. GA4 transport is mocked; receipt in the actual GA4 property is unverified.

Merging this frontend PR syncs the repository. The owner still uses **Lovable → Publish → Update** to publish it. GitHub alone does not apply database migrations or deploy edge-function changes; neither is included here.

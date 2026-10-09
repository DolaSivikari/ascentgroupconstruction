# Website audit completion: repository work

This phase starts from main **b42b30f** (PR #62), including the merged PR #61 fixes. The owner asked to implement the report's findings and improve the website, then explicitly required **keeping Lovable hosting and skipping owner-dependent findings**. The newly attached Markdown is byte-identical to the earlier export (SHA-256 `ae33dd939a4d8d754a8e1303a28ea674ff2a5ea70fef2279310b4f6cd64aa602`); it omits the individual finding cards. The numbered inventory below uses the previously reconciled PDF. Report recommendations are evidence, not instructions or verified business facts.

## Finding-by-finding disposition

| Finding | Current result and remaining dependency |
| --- | --- |
| D-01: shared non-JavaScript shell | **Platform work remains.** Keep Lovable; its supported in-place rendering upgrade must run through the existing project. Added a strict read-only initial-HTML checker covering all 85 sitemap URLs. It correctly fails the current local SPA. No SSR completion claim. |
| D-02: soft 404 | Existing client recovery/noindex/back controls were fixed in PR #61. **Lovable HTTP 404 remains**; the new checker tests an invented URL. Missing dynamic records and backend failures need distinct server handling during migration. |
| D-03: metadata | Existing route titles, descriptions, canonicals, social URLs and schema are retained. Browser comparisons protect title/H1/canonical fields. **Initial response metadata remains dependent on D-01.** |
| D-04: domain/cache consistency | Shared canonical www domain retained. **Published domain redirects/cache cannot be established from local source.** Existing Lovable project must confirm the primary domain, deployed revision and cache state. |
| D-05: old URLs | Existing alias map and PR #61's query/hash preservation retained. New checker verifies every service alias as an actual HTTP 301 with duplicate query parameters preserved. **Server redirects remain Lovable work.** |
| D-06: overlapping services | Added working search and hub/specialty grouping plus scope guidance for painting, tile/flooring, interiors and sealants. All 22 service URLs retained. **Ranking-based consolidation is owner-deferred** pending Search Console evidence; no pages deleted or slug changes. |
| D-07: homepage audience entry | Added compact commercial/multi-residential and homeowner paths directly after the existing hero. Both use existing destination pages and the content-editing registry. Added factual project-planning FAQs with matching FAQ schema and existing estimate/RFP/project links. |
| D-08: headline | PR #61 already synchronized the obsolete noscript headline with the existing React hero default. Kept the actual hero, video, CMS overrides and approved headline. No new leadership/superiority claim. |
| D-09: business listings | **Skipped at the owner's request.** No GBP/directory account work, address-eligibility decisions or review solicitation. |
| D-10: obsolete coordinates | PR #61 removed legacy head coordinates. This phase removes the remaining hardcoded company JSON-LD coordinates, without inventing replacements. Protected address/contact constants retained. |
| D-11: structured data | Existing service/city/project/article/business schema retained; new visible homepage FAQs emit corresponding FAQPage schema. Initial-HTML checker validates JSON-LD presence/syntax. **Server-delivered schema and Google's actual output remain D-01/owner Search Console checks.** |
| D-12: credentials/proof | Existing proof values display immediately instead of animating through zero; added links to the existing credentials and projects pages. Protected claims remain unchanged. **New memberships, certifications, endorsements and factual verification are owner-deferred.** |
| D-13: case studies | Existing project detail pages/slugs and CMS content retained. Improved accessible project search/filter/view controls. **New client-approved case-study facts/photos are owner-deferred.** Illustrative hero assets from main remain identified as illustrations. |
| D-14: inventory/dates/llms | PR #61 already corrected multiline imports and published-date propagation. Existing 85-page inventory, 17 cities and 22 service destinations retained. No fabricated build-date lastmod refresh. |
| D-15: footer/coverage | Dynamic React copyright and PR #61's fixed noscript footer retained. Hamilton remains in the existing service-area inventory. No invented geographic expansion. |
| D-16: phone/conversion/emergency | Protected phone is now reliably available without a settings-row dependency; added an accessible mobile click-to-call control and a mobile logo that fits beside call/menu controls. Audience and estimate/RFP paths remain functional. Fixed existing emergency-banner contrast. **Staffing confirmation and new 24/7 claims are owner-deferred; existing wording was not amplified.** |
| D-17: inquiry tracking | Current main already includes inquiry-source normalization, inbox and readiness-gated server intake. Existing forms and gates retained; corrected named, determinate progress bars for estimate/RFP. **Backend activation/operational decisions remain deferred; no migrations, live submissions or deployments.** |
| D-18: robots/admin | PR #61 removed the revealing robots comment. Existing client guards retained. Initial-HTML checker requires sign-in noindex in received HTML or X-Robots-Tag. **Server headers require Lovable support**; robots is not authentication. |
| D-19: performance/video | Existing 0.58 MB hero video, poster, reduced-motion/data-saver behavior retained. Deferred Web Vitals loading; removed inaccurate pseudo-TBT/TTI reporting, retaining real LCP/INP/CLS/FCP/TTFB. Existing tracking consent/activation gates retained. **No production Core Web Vitals improvement is claimed without field data.** |
| D-20: social image | Existing 1200×630 image and per-page image normalization retained. Checker verifies initial social URL/image presence. **Live social retrieval/LinkedIn preview verification remains pending published-host access.** |

## Additional verified accessibility improvements

The automated browser audit exposed shared orange-control contrast, a mobile trust strip requiring horizontal scrolling, unnamed/indeterminate progress bars, unlabeled project view/filter controls, inline links distinguishable only on hover, and an animated heading that hid all words from assistive technology. These were corrected. Sample document and markets comparison viewers are keyboard-focusable. Capabilities, homeowner FAQ, emergency and FAQ controls received narrow contrast corrections. RFP step labels remain readable and fit small phones. Explicit dark navy surfaces and CTA foregrounds now remain readable in both themes. Technology and Capabilities model geometry, camera behavior and interactions are preserved.

All intended changes are declared by path and field in [this phase's declarations](intentional-changes.json) and appended to the cumulative baseline declarations. Title, H1, canonical, runtime errors and HTTP status receive no new waivers.

## Hosting and release

See [the concrete Lovable acceptance procedure](LOVABLE-ACCEPTANCE.md) and [verification evidence](VERIFICATION.md). This branch does **not** implement server rendering or edge status handling. It does not switch hosting, merge, publish, deploy, run migrations, change secrets, or write to live databases/storage.

After review and merge, the owner publishes using **Lovable → Publish → Update** and checks the public site in a private window. Publishing this repository patch alone does not fix D-01 or server HTTP statuses. Rollback is a commit revert and republish; no data rollback is needed.

# Website audit reconciliation and verified maintenance

Reviewed the owner's `Ascent Website Audit.md` and `Ascent Group website audit - Claude.pdf` against freshly fetched main **49b719f**, not the older image-upload branch. The PDF's text encoding is broken, so its finding pages were rendered and read with OCR. The Markdown export omits the individual finding cards. The PDF exports the “Codex prompt / Copy” controls but not the collapsed prompt bodies; those bodies were not available to execute. Attached recommendations are review evidence, not repository instructions or approved business facts.

## Findings checked against source

| Finding | Evidence and disposition |
| --- | --- |
| D-01: same shell on every URL | Confirmed architecture: React/Vite, `index.html` fallback, client `window`/browser dependencies, no route server renderer. Hosting's verified-crawler behavior and Google's actual crawled output remain unverified. No TanStack migration or claim that SSR is fixed. A platform-supported upgrade needs the Lovable handoff below. |
| D-02: soft 404 | Catch-all NotFound and client noindex already exist. Real HTTP 404 requires hosting support. This patch repairs a broken Link-to-minus-one back action, offers Home for a direct visit, and changes project suggestions from the blog/case-study namespace to `/projects/:slug`. |
| D-03: metadata | React SEO already writes per-route titles, descriptions, canonicals, social URLs, and schemas, covered by prior SEO tests. A non-JavaScript client receives initial HTML metadata; route HTML remains a hosting/rendering issue. No arbitrary title truncation or blanket rewrite. |
| D-04: inconsistent cache/domain | Cannot establish current edge response or cache state from source. Shared `SITE_URL` uses the canonical www domain. Lovable must verify domains, current published revision and cache behavior. |
| D-05: old URLs | `SERVICE_REDIRECTS` already maps `/services/eifs-stucco` to `/services/eifs-stucco-systems`; other aliases exist too. These are client replacements, not HTTP 301s. This patch preserves UTM queries, duplicate query parameters and section anchors for service aliases and other existing public shortlinks. Netlify `_redirects` is explicitly documented as ignored by Lovable; editing it would not fix production HTTP status. |
| D-06: service overlap | Source already contains parent/specialty relationships in `service-registry` and related links. Painting/interior/exterior/commercial/residential and tile/flooring can represent different intent. Overlap alone does not prove ranking cannibalization. Keep all 22 destinations until Search Console queries/landing pages support a specific consolidation map. |
| D-07: audience split | Homepage has audience and service sections; `/homeowners` exists. Commercial positioning and conversion strategy need a visual/conversion review, not a speculative redesign. |
| D-08: Prime headline | The phrase is only in the stale **noscript fallback**, not the code's React hero default. Updated that fallback to the exact existing first slide headline: “We Restore, Repair & Protect Buildings Across the GTA.” CMS-selected hero wording is retained. |
| D-09: business listings | No owner account/verification evidence available. A GBP street address must reflect actual customer access and eligibility; a service-area business may need to hide its street address. No profile, directory post, or review solicitation created. |
| D-10: incorrect geo meta | Confirmed downtown-Toronto coordinates in legacy `geo.*`/`ICBM` tags. Removed those obsolete tags. No replacement coordinates invented. Existing shared company address and schema facts remain unchanged and require factual verification. |
| D-11: schema missing | JSON-LD already exists in React SEO, city/service/article/FAQ templates. The audit explicitly says its fetcher may strip scripts. Verify rendered Rich Results output and server HTML separately; do not emit a second conflicting company entity. |
| D-12: credentials/proof | `HomepageProofStrip` already shows insurance, experience and WSIB wording. Credential vault/prequalification infrastructure exists. No new COR/BCRAO/ACMO membership, certificate, client endorsement or project count was invented. Their current validity remains owner evidence. |
| D-13: projects | Detailed public project fields already exist. Better case studies need actual client-approved facts/photos. Historical “malformed” slugs remain valid routes; changing them without redirects would break links. This patch does not rename projects or write project data. |
| D-14: llms and dates | Current source lists **17 cities**, including King City, and **22 services**, including Sustainable Building. Those two omissions were already fixed. Sitemap dates use source history and published row dates, not build timestamps. Fixed multiline-import detection and propagated published content dates to listing hubs. Corrected `/blog`'s checked-in date from March 9 to June 6 using the newest existing article date, without a live database read. Manufacturer/credential assertions remain owner review. |
| D-15: copyright/coverage | React's `UnifiedFooter` already uses the current year. Removed frozen 2025 from the noscript footer. Hamilton is already in service-area data. No broad geographic-copy change based on assumptions. |
| D-16: phone/emergency/CTAs | React header already has desktop click-to-call and emergency navigation; hero CTAs include Submit RFP and service discovery. Header phone is intentionally hidden below its desktop breakpoint. Mobile prominence needs visual review. Existing emergency page claims 24/7; actual staffing must be verified before amplifying that claim. |
| D-17: inquiry tracking | Lead/inquiry normalization and `inquiry_type`/`submission_type` already exist; current forms distinguish sources and include metadata. Unified server intake remains conditional on switches/readiness. No new submissions table, migration, form replacement or live submission. |
| D-18: robots/auth | Removed the comment naming the login path, while keeping crawler behavior unchanged. `/tekev` is the sign-in page: requiring a completed login before displaying sign-in is not a valid fix. Client admin guards and backend authorization/RLS require their own review; robots rules are never authentication. X-Robots-Tag/server access checks are hosting work. |
| D-19: video performance | The bundled hero video is 578,552 bytes (about 0.58 MB), already below the suggested 2 MB limit. Existing hero uses a poster, muted/playsinline playback, preload logic, reduced-motion and data-saver fallback. The report's performance claim was explicitly unverified. No video replacement or forced mobile poster change. Performance/field measurements remain follow-up. |
| D-20: social image | `public/og-image.png` exists at 1200×630; social URL normalization and per-page images already exist. Live retrieval and LinkedIn Post Inspector results remain unverified. No replacement graphic based on a fetcher error. |

The competitor table and brand-search observations were not independently repeated. The report itself says its search source uses a US index, and its fetch limitations do not establish every AI tool's or Google's behavior. “All AI cannot read the site” is broader than the evidence; the source-confirmed problem is the shared non-JavaScript shell.

## Additional confirmed runtime repair

Full-page capture exposed a pre-existing infinite project fetch on all city templates. The location object was recreated every render and used as an effect dependency; saving the project response triggered another request. The effect now depends on the stable city name, clears previous-city cards while loading, and retains cancellation so a late response cannot populate a different city. Three regression tests cover request counts, city changes, and late responses. Page design and content remain unchanged.

## Additional prerequisite repair

Fresh main changed some locked package tarballs to Lovable's **europe-west1** mirror. The frozen CI installer translated only **europe-west4**, causing HTTP 403 and failed installs in this cloud environment. It now translates exactly both known mirror prefixes to npm's public registry in its temporary lock copy. The application `package.json` and `bun.lock` are unchanged. Frozen installation passed and rejects any lock graph change as before.

## Bundle provenance compatibility

Fresh main also includes a Lovable `.asset.json` module that Vite emits with an empty source map. The public bundle gate now verifies only an asset-named chunk containing constant/literal data whose sole export exactly matches its tracked JSON source. Parsing never executes the chunk; imports, calls, getters, extra exports, and mismatched data are rejected. All other missing provenance remains a failure and the editor/chart source exclusion remains intact. Seven regression tests cover this exception and rejected executable modules. Acorn is already in the frozen dependency graph; no dependency or lockfile change was made.

## Scope and release

One maintenance branch: `seo/audit-verified-fixes`. Public JavaScript design, CMS records, contact constants, credential wording and page inventory are preserved. The no-JavaScript fallback and obsolete head tags are declared in the baseline declarations. Unknown-page controls and alias navigation behavior intentionally improve.

This is **not** the full 90-day roadmap. Hosting migration/statuses, Google accounts, memberships, factual content, and directory work are distinct remaining work; see [Lovable hosting handoff](LOVABLE-HOSTING-HANDOFF.md). No merge, publication, migration, function deployment, secret change, live form submission or live storage/database write was performed.

Review/merge this patch, then use **Lovable → Publish → Update** and verify in a private window. Rollback: revert the maintenance commit and publish again; no data rollback is needed.

## Verification

See [verification and coverage](VERIFICATION.md) and the adjacent evidence directory for final results. Browser runs use synthetic public fixtures and both desktop/mobile sizes; they do not establish the current production edge response or real CMS content.

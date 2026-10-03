# Page headers and admin improvements

Built on merged PR #39 (`37571f8`). Checked against the current code on 2 October 2026, America/New_York. The five uploaded reports in this directory are preserved unchanged. Their embedded prompts and approval suggestions are assessment material, not additional instructions. The owner's current request is one PR with the actionable improvements.

Read this status first. [05-CODE-RECONCILIATION.md](05-CODE-RECONCILIATION.md) separates previous fixes, reproduced new issues, and unverified platform claims. Search the questionnaire/answers for a relevant topic rather than treating every reported fact as verified.

## Header recommendations

| ID | Result |
| --- | --- |
| H1 | All 22 canonical service slugs have mapped images. Shared resolver handles valid editor images, canonical images, then category fallbacks. Redirect-only slugs share the routing source and stay out of the inventory. |
| H2 | Legal pages have solid, readable navigation at the top. They retain their text headings. |
| H3 | All 17 city pages use the illustrated regional map with truthful alt text. An optional city override registry is ready for verified city images. |
| H4 | Deferred: the six GC-facing pages still share their existing image. Unique, authentic project photography needs supplied/approved assets; no fictional project imagery was introduced. Page Headers explicitly reveals sharing. |
| H5 | Wave1 specialty pages and database service pages use the shared image registry. Four confirmed unimported legacy header components were removed. |
| H6 | Contractor Portal uses shared PageHero and its existing dedicated asset. Existing content, badges, documents and form actions are preserved. Fragment buttons remain native anchors. |
| H7 | Regression tests check canonical service/image keys, route inventories, image precedence, partial metadata failures and hero presence across route changes. |
| H8 | Mounted heroes register with a route-scoped provider. Navigation no longer guesses from URL lists; loading, plain and missing pages use solid navigation. The homepage hero's video logic and dimensions are unchanged. |

## Admin recommendations

| ID | Result |
| --- | --- |
| A1 | Dashboard totals, new badges and recent activity cover contacts, RFPs, quotes/estimates, prequalifications and resumes. Counts load independently from content status; partial activity failures retain healthy sources. Failed queries do not claim zero leads. Sidebar/notifications continue the prior shared-count repairs. |
| A2 | All five native confirmation prompts replaced with ConfirmDialog. Cancellation avoids mutation; backend failures remain visible. Document cleanup failure reports partial completion truthfully. No live documents were edited during testing. |
| A3 | Service Editor loads, previews, uploads, validates, saves and clears the existing featured_image field. Usable saved images take precedence on database-driven detail pages. Static specialty pages remain code-managed. No new column or migration. |
| A4 | New **Website → Page Headers** inventory: canonical routes, presentation, image source, shared images, warnings, previews and relevant editor links. Published projects/articles and additional published services come from presentation metadata. Loading/failed sources are visibly incomplete; text legal headings and project images below the title are intentional. |
| A5 | **Partial, current-schema foundation:** Bids & Estimates combines RFPs, quotes and estimator submissions. Filter by request type/status/text, sort by available requested dates, see Toronto-date overdue cues, inspect complete details/private attachments, and export filtered CSV. Quotes have a DATE-only target_deadline. RFP project start dates are never treated as closing deadlines. Old tabs/records and the separate Estimates & Quotes editor remain available. |
| A6 | Explicit no-access and verification-error screens; current backend roles are checked rather than trusting browser cache. Ordinary same-user token renewal preserves the editor while roles are rechecked. Inquiry aliases preserve tab, highlight, repeated query parameters and hashes. Stats opens SEO. Unsupported navigation/redirect/version editors explain their limitations and link to working destinations. |
| A7 | Both project pages use generated/narrowed types. Blank numeric fields become null at the save boundary. Editing and detail autosave wait for successful project and relationship loads. Full Save adds/updates relationship rows before removing explicitly removed rows, preserves unseen additions, and reports incomplete saves. Safe retries reuse a partially created project. Separate REST operations are not transactional; successful earlier updates can remain after a later failure. Blog editor's prior insert error was resolved with a type-only generated payload annotation. |

The questionnaire's additional admin issues are included: one shared search dialog covers 11 sources and all six inbox types, searches the real resume applicant_name column, preserves selected inquiry destinations, escapes filter syntax, cancels stale requests and shows partial errors. Ctrl/Cmd+K works with a collapsed sidebar. CSV export neutralizes spreadsheet formulas and excludes private attachment URLs, notes and consent/IP data; unavailable source data disables export. AI SEO generation validates suggestions and requires explicit application, preserving manual metadata on errors or concurrent edits; credit/rate-limit failures receive clear messages. No paid generation was called in tests.

The admin container and sidebar now use the existing Barlow design token. Mobile search padding and hero menu contrast use the same visual rules as the site.

## CI and deployment reliability

- CI uses Node 24/Bun 1.3.11 and a frozen install in a temporary directory. Only the known mirror URL prefix is remapped to the public registry in the temporary lock copy. Versions and integrity hashes are retained; tracked package.json, bun.lock and .env remain unchanged.
- Fixed duplicate route-audit declarations and double HTTP-status output. Route audit now fails on unresolved production links; test fixtures are excluded. PR checks build and smoke-test the branch, with scheduled production availability separated.
- Removed automatic worker/cache purges and forced reloads. Updates wait for existing tabs to close; documents, private/API and range responses are not cached. Explicit cache clearing touches only this app's workers/caches and preserves authentication/unrelated storage.
- Selected strict route checks now pass using safe query/hash normalization, with unchanged URL behavior. Full application typecheck passes.

## Retained work and decisions

A5 is not the completed unified-inquiries plan. Closing **timestamps** for RFPs, deadline editing, assignments, unified private notes, archive/history, a new inquiries table, durable server-side intake/idempotency and delivery retries still require a reviewed schema/deployment stage and verified live policies. No new database tables, migrations, RLS changes, backfill, production form submissions, secrets or live email configuration were applied.

The owner continues to hold credential/insurance/WSIB/COR/bonding/Sto and related document-content changes. Provider/domain verification and alert recipients remain deferred. In-app alerts continue to work independently. Hosting headers/status codes, effective live policies/migration state, Search Console/GA ownership and platform publishing behavior need account/platform evidence. GitHub source changes alone do not establish that functions/migrations have deployed.

Earlier finding IDs remain catalogued in [the original implementation status](../05-IMPLEMENTATION-STATUS.md). This PR advances F-34/F-35/F-44/F-46 and admin/header-related portions of F-38/F-45/F-48. It does not silently mark all 50 findings complete. Consent-evidence/retention and trust/content decisions remain in that original work list.

## Validation and publication

Final measured results are recorded below and in the PR description. Admin browser checks use localhost-only fake accounts and intercepted test records; no production private records, writes, email sends or paid AI requests were used. Public header checks read published data only.

After review/merge, use Lovable **Publish → Update** through the established deployment process. This branch does not itself claim live publication. Rollback is a frontend Git revert/publish; no database rollback is needed for this change. Closing open tabs permits the waiting worker update to activate on the next visit without discarding in-progress forms.

### Final measured checks

- **270 tests across 36 files pass**, up from 58 tests/13 files in merged PR #39. Mocks cover saves/failures, search and selection, image refresh, deadline/export behavior and current role verification.
- Production build, full application typecheck, selected strict typecheck, service-worker validator, local built-site smoke and route audit pass. A fresh immutable CI install and build also passed. Production build retains existing large-chunk notices.
- Full lint: **294 errors/34 warnings**, improved from 346/43 on merged PR #39. No added lint diagnostics in changed files; unrelated lint debt remains.
- Chromium desktop/390px: dashboard totals and five-source activity; eight inbox tabs; filtered CSV with private-field exclusion; partial errors/export disabling; image inventory sharing/attention/preview/editor links; invalid /src images; collapsed Ctrl/Cmd+K and resume deep links; denied/error/signed-out boundaries. Zero final runtime exceptions or live private reads/writes.
- Real hook/layout tests preserve draft DOM state through token refresh, remove access after revoked roles/account switches, and keep the verification retry budget bounded.
- Public Chromium checks verify mapped service images, city maps, contractor anchors, solid legal/missing-page navigation, mobile width and rejected analytics consent. Built-output checks verify hashed production assets and mobile hero menu contrast.
- Worker-update Chromium fixture preserves unsaved text and the current page, ignores legacy skip-waiting messages, serves fresh mutable assets, and activates the update after old tabs close.
- Five uploaded reports were checked byte-for-byte against the original attachments. No tracked dependency bindings, lockfile, schema, credential content or live data was changed.

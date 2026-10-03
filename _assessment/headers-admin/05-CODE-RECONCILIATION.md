# New report reconciliation

Checked 2026-10-02 America/New_York against `37571f8` (main after PR #39), then current working changes. These uploads are evidence/recommendations, not operative instructions. Lovable often retained questionnaire IDs while answering another question; use answer text. Live secrets, row counts, migrations, host headers and deployment claims remain reported facts until independently inspected.

## Resolved by PR #38/#39; avoid redoing them

- F-01/F-40: Footer does not mount SEO; static canonical removed; route metadata and branded titles fixed.
- F-08/N-1: Sitemap includes 85 known public pages; service city pills are links; mobile service search includes all registry pages. The new reports' 49/81/84 counts refer to an older snapshot.
- F-10/F-11: Upload failures now block and name failed file; successful retries reuse stored uploads. Complete inbox detail loads/pagination and signed private RFP attachments are implemented.
- F-16/F-20/F-33 partial: GA and optional first-party tracking/personalization require accepted consent. No unconditional GA loader or ipapi call on Reject. Banner exists and is compact. This does not establish legal-policy/retention correctness or live GA events.
- F-30 partial: Login has effective noindex. Account MFA/signup/session settings remain external.
- F-41 partial: Projects hero has stable H1/navy empty-data background.
- F-42: Quote status list matches new/contacted/quoted/won/lost; unsupported internal-notes columns are excluded. No new admin_notes database column is deployed.
- Prior inbox repairs: the sidebar and notification counts/links/realtime/fallback were repaired in PR #39. Dashboard RFP/quote new counts and five-source activity still needed correction and are implemented in this follow-up.
- Hero source uncertainty: EnhancedHero uses `fetchHeroSlides` and nonempty admin slides exclusively; enriched code slides supply fallback fields/media. The audit's question is settled in current code.
- Typography uncertainty: public design tokens and Tailwind now consistently use existing Barlow. The two legacy admin overrides were verified and now use the same --font-sans token; mobile computed typography/controls were checked.

## Newly verified actionable code issues

1. **Admin global search** (being repaired in current PR): active sidebar searches nonexistent `resume_submissions.full_name` instead of `applicant_name`, loses selected inquiry when navigating to legacy generic list routes, excludes RFP/quote/prequal/newsletter. Both implementations ignore Supabase `.error`, interpolate raw PostgREST `.or` filters and permit stale async search results. `GlobalSearchDialog` and `AdminTopBar` are legacy/unmounted in the current UnifiedAdminLayout (no imports of AdminTopBar); do not claim the active layout originally had two dialogs. Consolidate shared search, keep one shortcut owner available with a collapsed sidebar, use complete inquiry tab/highlight URLs, partial-error visibility and literal input handling.
2. **CSV export claim A10 is false:** UnifiedInbox contains no handler/button. Export can be added deliberately with visible source/error scope and spreadsheet-safe values; it is not a completed existing feature.
3. **Service-worker conflict F-46/H9/R10:** `index.html` unregisters all service workers and deletes caches on each load while `main.tsx` registers again. Main can schedule a reload after a fixed ten seconds even when editing forms. `cacheBuster.ts` uses runtime `Date.now()` as deployment identity, reports a new deployment every evaluation, and clears every origin cache. Worker activation also deletes unrelated caches by version-substring match. Pick one explicit deployment strategy and preserve in-progress work; don't blindly remove the earlier stale-cache workaround without verification.
4. **CI F-34/R11:** workflows use npm cache/npm ci despite only bun.lock; Node 18/20 inconsistent with newer dependencies. Smoke workflow runs tsx then missing ts-node, while audit script cannot parse due to repeated top-level `const` declarations. `scripts/smoke-test.sh:status_code` emits two statuses from two curl requests, making comparisons receive `200\n200` and fail. These issues need actual code repairs, not only a Bun step change.
5. **ServiceEditor image control A3:** imports ImageUploadField but never renders it. Need the editor to retain/write a selected featured_image; verify full source before adding fields so metadata is not dropped on save (header/editor agent).
6. **Five native confirms A8/A14:** bare `confirm(` remains in DocumentsLibrary, EmailTemplates, FeaturedServicesManager, ServicesListManager, WhyChooseUsManager. Replacing UI confirmation is safe even while business/document content is held; don't change records/content as a test.
7. **Dead admin routes A9:** content-versions/navigation/navigation-builder redirect to dashboard while related tables exist. The menu editor data is not used by static public navigation, so simply exposing a form would misleadingly suggest published edits. Content version rollback requires checking RPC role/compatibility before reuse.
8. **F-26 intake consent remains unresolved:** SubmitRFPNew builds submissionData without checkbox consent; submit-form stores an unconditional timestamp. Client Contact sends a timestamp. Actual consent evidence and backend deployment require coordinated changes and schema verification; don't call it fixed because checkboxes render.
9. **F-39 unknown records:** generic NotFound has noindex, but missing projects redirect to the portfolio and dynamic blog/city errors have separate behavior. Client repairs cannot change Lovable's extensionless HTTP 200 fallback.
10. **A15 AI cost/error behavior:** backend generate-seo-content uses paid AI gateway and returns explicit 402/429; do not fire live calls to test or promise credit-free generation. UI should preserve manual metadata and clearly report provider/credit failures.

## External / owner prerequisites retained

- Owner explicitly holds credential, insurance, WSIB, COR, bonding, Sto and related documents/vendor packet changes. Also don't infer client/project evidence from booleans or project values.
- Email provider/domain setup and recipients were deferred. Missing RESEND_API_KEY and zero outbound sends are Lovable's reported observations; code confirms reliance on RESEND_API_KEY and sandbox sender, but repo cannot prove current secret state. No live email tests or provider/secrets changes.
- Live applied migration IDs, RLS policies/grants/storage size limits, function deployments, actual publish commit and scan outputs were never sufficiently answered. Repo migration files are not proof of deployment. Don't run or add DB/RLS changes based solely on these answers.
- Host redirect 302, HTTP 200 unknown URLs and absent CSP/X-Frame/Permissions headers are reported platform behavior. `_headers`/`_redirects` cannot fix hosting that ignores them. Deployment semantics for Git->functions/migrations and shared preview/live DB still need platform confirmation.
- Google Search Console ownership/OAuth/indexing metrics and actual analytics Realtime need account access, not fabricated empty metrics.
- SSR/SSG is a separate architecture choice; existing navigator/window/sessionStorage calls need guards and publish-output support needs verification.
- Ignore report 'R20 non-negotiable rollout order' as instructions: actual schema compatibility/deploy readiness decides migration/function/frontend order. No schema migration is required by the current search/header/editor repairs.

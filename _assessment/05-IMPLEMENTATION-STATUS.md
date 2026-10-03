# Implementation status and next admin phase

Updated 2026-10-02, America/New_York. Original files 00–04 remain unchanged. This status is checked against the current GitHub code, not accepted solely from the audit's file/line references.

## Owner decisions

- Preserve the approved website design and improve consistency/reliability.
- Improve the existing, working in-app inbox and notifications first.
- Hold credential, certification and related document-content changes until the owner returns to them. This includes WSIB, insurance, COR, bonding, Sto and vendor/credential documents.
- Email-provider/domain verification and alert recipients remain unspecified. This implementation makes no email-provider, secret, database schema, RLS or production-data changes.

## Implemented in this branch

| Finding | Result |
| --- | --- |
| F-01 | Footer no longer writes page metadata during loading or after load. Remove the static homepage canonical; manage fallback HTML description/social/robots tags through Helmet so each route owns its metadata. Existing route organization structured data remains. |
| F-10 | A failed RFP attachment prevents submission and names the file to retry/remove. Successful earlier uploads are reused on retry. The form now says files are selected, instead of claiming they have already uploaded. |
| F-11 | Load complete inbox records with pagination. Show stored RFP scope, location, schedule, delivery method, requirements and booleans; open private RFP drawings using authenticated, five-minute signed links. Show actual resume cover letters and complete estimate/quote details. |
| F-16 | Load GA only after Accept or a persisted accepted choice. Reject/close prevent loading, queueing events and first-party A/B, search and service tracking. Revoking consent disables subsequent GA events and pending search writes. Public forms continue to work. |
| F-20 | Shorter cookie banner explanation with clearly labelled Accept Analytics/Reject Analytics actions. |
| F-30 (partial) | Admin login has a single effective noindex/nofollow tag. Remove its explicit robots.txt listing so crawlers can read that instruction. MFA, account configuration and effective live policies need a separate review. |
| F-33 (partial) | IP geolocation and persisted personalization require accepted analytics consent. Disclosure, retention and continued need for this service remain a policy/product review. |
| F-35 (partial) | Add regression coverage for inbox loading/saving, private attachment paths, notifications, upload failures/retries, metadata and analytics consent. Existing engineering debt is recorded below. |
| F-40 | Already-branded page titles receive the company name once. |
| F-41 (partial) | Projects hero stays readable on a navy background when project data is empty; the accessible H1 is consistently “Our Projects”. The approved carousel presentation remains. |
| F-42 | Quote/estimate editing uses new/contacted/quoted/won/lost. Other inbox types retain their existing statuses. Updates include only changed, supported fields and verify that a row was updated. Existing notes are loaded and preserved. Quote/prequalification types currently have no internal-notes column; show their submitted content read-only rather than sending an invalid column. |

Additional admin repairs from the inbox plan: count all unread alerts separately from the latest ten, link each notification to its inbox tab and highlighted request, scope read updates/subscriptions to the signed-in user, clean up subscriptions, refresh every minute when realtime is unavailable, share counts between sidebar and dashboard, count all five inquiry sources in the sidebar badge, expose partial-load errors, and keep tabs/tables usable at 390px. Saved historical records and current forms keep their existing paths.

## Remaining assessment work

All 50 finding IDs are accounted for here. “Review” means the recommendation is retained, not a claim that it has been reproduced or fixed.

| IDs | Disposition and next action |
| --- | --- |
| F-02, F-03, F-04, F-05 | Owner hold: credential assertions, download content and vendor packet. No public changes in this branch. |
| F-06, F-12, F-13, F-29 | Email follow-up: verify current provider, sender domain, deployed functions, recipients and logs before consolidating server-side delivery/retries. In-app notifications are improved now. |
| F-07 | Rendering/hosting review: decide on prerendering using current indexing and performance evidence. |
| F-08 | Repository sitemap/navigation discovery addressed by merged PR #38. Live publication/indexing still needs observation. |
| F-09, F-14, F-25 | Next intake phase: GC bid invitations, server-side quote/estimate submission and removal of duplicate writes. Preserve old forms until a tested switchover. |
| F-15 | Re-measure mobile first-screen actions on the current unified design before choosing placement changes. |
| F-17, F-18, F-19, F-21, F-22, F-23, F-28, F-43 | Owner content decisions: emergency coverage, reference permission, project evidence, company history and current contact/bid details. Eleven published projects were confirmed in the prior navigation audit. |
| F-24 | Update name validation consistently in both client and deployed contact notification function; coordinate the backend deployment to avoid client/server disagreement. |
| F-26, F-27 | Consent records, legal disclosures, actual revision dates and retention need a coordinated backend/policy review. No invented dates or legal assertions. |
| F-31 | Measure mobile performance and choose targeted bundle/asset improvements. Current production build succeeds with existing large-chunk warnings. |
| F-32 | Verify live redirects/security headers with the host. Public-site HTTP checks from this environment have returned 403. |
| F-34 | Repair CI installation separately: workflows assume an npm lockfile, while the existing Bun lock uses a private mirror. Keep the lockfile unchanged until the install strategy is settled. |
| F-36, F-37, F-38, F-45, F-48 | Retained design/content proposals: image permissions, logos, city-page strategy, hero assets and placeholder wording. Preserve the owner's approved presentation. |
| F-39 | Review unknown-resource/error behavior and host HTTP status separately; a client not-found screen alone cannot set an HTTP 404. |
| F-44 | Check actual imports before removing legacy components. |
| F-46 | Resolve service-worker purge/registration strategy as a deployment change with rollback verification. |
| F-47 | Frontend Supabase public bindings are expected; no established secret leak. Managed bindings remain unchanged. |
| F-49 | Structured-data eligibility review, especially self-serving LocalBusiness review markup. |
| F-50 | Newsletter intake consolidation belongs with the server-side intake follow-up. |

## Next admin improvement: implementation sequence

The existing inbox is now the starting point. [04-INBOX-READINESS.md](04-INBOX-READINESS.md) contains useful architecture and risk details, but its proposed table and statuses are recommendations.

1. Verify effective live policies, notification triggers/publication and migration/deployment procedure using read-only inspection. Confirm staff roles and retention/archive requirements. Email readiness can be a separate track.
2. Prepare reviewable additive SQL for a unified inquiry model, or first add internal notes to quote/prequalification records. Choose the approach with the owner. Specify compatibility with existing records and regenerate types after the schema is actually deployed.
3. Implement one durable server-side intake route with input validation, consent evidence, spam controls and idempotency. Preserve a saved lead if notification delivery fails. Remove duplicate writes only after staging tests prove the replacement path.
4. Add bid invitations with due date **and time** interpreted in America/Toronto, drawing links/uploads, assignee, deadline sorting and overdue cues. The existing quote `target_deadline` is a date, not a bid-closing timestamp; do not silently treat it as one.
5. Add internal notes for every request type, activity history and archive controls with effective backend authorization. Avoid hard deletion of live work as the default workflow.
6. Add visible delivery status and controlled retry only after the verified email setup and durable retry/outbox behavior are available.
7. Test permission boundaries and historical compatibility against a non-production database, then switch public CTAs/forms gradually. Rollback should retain collected records; Git revert does not restore a database.

Do not label Steps 0–9 of the original plan complete merely because frontend screens exist. No new `inquiries` table, migration, live backfill, email retry system or MFA configuration is deployed by this PR.

## Verification and publication

Validation results are included in the PR. Tests and local browser fixtures use fake requests/accounts; no production inquiries, private lead records, email sends or storage mutations were used. Public metadata checks read published content only.

Known baseline: 360 lint errors/44 warnings; selected strict typecheck has six errors; full application typecheck has one existing BlogPostEditor error. Changed-file diagnostics are compared to that baseline. GitHub workflows also have a pre-existing dependency-install failure. A successful local production build does not mean those unrelated checks are green.

Merge/publish this frontend branch through the normal GitHub/Lovable process. No database migration or function-secret deployment is included. The signed-file viewer still relies on the current authenticated Storage policies; those must permit the staff member to read the RFP bucket. If signing is denied, the UI reports the error rather than exposing a public file URL.

### Results for this implementation

- Production build and service-worker validation: pass.
- Vitest: **58 passing tests across 13 files** (baseline: 15 tests across five files).
- Local Chromium, desktop/390px mobile: complete RFP details; existing notes preserved during status changes; private-file signing requested with a 300-second expiry; correct quote statuses; rejected saves keep the dialog open; notification links reach the right tab/request; partial RFP load failures keep other sources visible; no page overflow or runtime exceptions. All admin requests and mutations were mocked.
- Public routes Services, Projects, Insights→Blog, Contact and login: route-specific titles, one canonical on content routes, one effective robots tag, no GA script with rejected consent, stable Projects H1. Published content was read without submitting forms.
- Full lint: **346 errors/43 warnings**, down from 360/44. No new lint diagnostics in changed files; new files are clean.
- Selected strict typecheck: the same six existing errors. Full application typecheck: the same existing BlogPostEditor error, no added errors.

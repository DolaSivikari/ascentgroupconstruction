# Remaining master-plan application workflows

Updated 2026-10-05. Base: `56bacfe1dfc43d5dae2b1dfe73c48dc6dc1cc2b3` (PR #51). This follows the master plan and the owner's subsequent database audit, rather than repeating the already merged R1–R6 redesign.

The owner requested one consolidated implementation PR and explicitly skipped the full screenshot replay and lengthy safety gates. Database review/activation is deferred. This branch makes no live database/storage changes, sends no email, and does not deploy, publish or merge anything.

## Application work

| Audit gap | Implemented here | Activation or limitation |
| --- | --- | --- |
| Unsupported editors reachable by URL | Testimonials redirects to Pages; Email Templates redirects to Email Delivery. Unsupported testimonial search destinations are removed. Stored records are retained. | Publication needed. |
| Rich-text image validation | Only this project's HTTPS public `project-images` files survive rendering. Remote/signed/data images are rejected. | Unsupported previously saved inline images will disappear after publication. |
| New inquiry intake and alerts | Strict server validation, consent version/timestamp, unique submission key with payload matching, spam/rate controls, save-before-email, per-recipient delivery/partial status, a send lease, stable retry keys and explicit resend/test functions. Corrected branded sender name preserves the existing sender domain. | Inquiry schema, function deployment, sender verification and configured recipients needed. Provider acceptance does not prove mailbox delivery. |
| Leads and dashboard | New inquiries join all four existing lead sources, using bounded cursor reads. Detail panel has assignment, Toronto bid dates, priority, amount, conflict-aware workflow saves, notes, named history, archive/restore and masked delivery results. Dashboard and sidebar include the new source. Optional current-page board and bulk status actions remain secondary to the list. | Missing optional schema leaves legacy leads available. Real source failures are reported and stop paging. Legacy tables remain visible and counted. |
| Notification settings | Active recipients by inquiry type, disabling recipients and sending a test alert. | Test/resend buttons send real email only when an administrator invokes them after deployment. No tests here sent email. |
| Pages hub | Runtime canonical inventory, search/group/draft/health filters, edit links, SEO/header/visibility tabs, field validation, preview, saved drafts, atomic publication/history/undo, JSON import/export, hash-conflict/orphan warnings and kill-switch/canary controls. | Content objects and checked publication RPCs needed. Page health reports actual crawl findings; it does not invent an SEO score. Hiding a page gives a client unavailable screen/noindex, not an HTTP 404 or automatic menu/sitemap removal. |
| Content groups and FAQ parity | Typed exact-source defaults for 26 public page templates and seven homepage sections, nine code service modules, shared FAQ modules and separate city modules. About's non-protected saved fields also have an override layer. Visible FAQ copy and structured data share consumers. | Overrides off by default. Full all-page equivalence and seven-day canary observations were deliberately not performed. Protected hero/video, navigation, Capabilities, Technology and Contractor Portal presentation remain code-owned. |
| New forms | Switched-off Contact selector for estimate/bid/general requests, Toronto bid deadline and drawings link, saved reference confirmation, safe retry and conditional GC bid CTAs. Consolidated newsletter validation/consent with optional server handler. Unicode contact names work in client and server source. | Build/server switches plus readiness required. Estimate, RFP, homepage quick contact, quick quote and prequalification forms also use protected server inquiry submission when intake is enabled, preserving their submitted metadata and avoiding duplicate legacy saves/emails. Their existing paths remain the default while disabled. New consent controls appear only in the enabled forms that previously lacked them. The 14-day History transition still requires observed quiet-period evidence. Existing response promises/credential facts are not rewritten. |
| Credentials vault/packages | Existing document evidence and expiry reminders, private eligible-document selection, branded PDF index with links to the original evidence, explicit sharing acknowledgment, expiring hashed-token links, revocation, short signed downloads and open tracking. | New package schema/function and actual private documents needed. It produces an index plus original files, not a merged archival PDF bundle. Credential claim linking/fallback wording and scheduled reminder emails remain held for owner decisions. |
| Site Health | Reuses the already merged nightly crawler, ingestion, read-only health endpoint, monitoring and dashboard. Pages reads the same real results. | Tables, token/function deployment, scheduler and seven complete pilot nights remain activation work. No synthetic crawl or missing result is called a pass. |

All page totals come from current code registries and published database metadata. The old master plan's “88” is not hardcoded. The prior baseline inventory records 86 URLs; it was not recaptured for this PR.

## Deferred backend activation

1. The owner previously reported `0002`, `0004` and `0005` applied and verified. Do not rerun them; this session has not independently rechecked the live database.
2. **Do not apply `0001` unchanged.** Its role trigger names collide with installed `0005`, and its `set_user_role` definition would replace the stronger installed authorization/locking behavior. Prepare an inquiry-only compatible migration during the next SQL review, preserving `0005`. Tables, grants, notification types and realtime availability also need review.
3. Review `0003` for content and Site Health. New draft `sql/0007_content_publish_conflicts.sql` adds revision-checked publication/undo wrappers; clients deliberately do not fall back to unchecked publication. It has not been run against Postgres.
4. New draft `sql/0006_credentials_packages.sql` adds package registration/revocation/open tracking. It is not in automatic migrations and has not been executed. Validate existing private-bucket permissions before sharing real evidence.
5. Deploy changed/new functions: `submit-form`, `send-contact-notification`, `inquiry-alert-resend`, `intake-status`, `credential-package`, and the changed functions that import the branded shared email helper. Activate existing Site Health ingestion/ping separately.
6. Keep the new switches false until backend setup and owner preview review:
   - `VITE_PAGE_OVERRIDES_ENABLED=true` enables the public override loader. Database flags start `content_overrides=false`, `content_overrides_admin_only=true`. Publishing drafts does not itself enable visitor overrides. Already open visitor pages pick up flag changes on reload.
   - `VITE_INTAKE_V2_ENABLED=true` plus server `INTAKE_V2_ENABLED=true` enables the new Contact forms only when `intake-status` confirms schema access and at least two active recipient records.
   - `VITE_NEWSLETTER_SERVER_ENABLED=true` chooses the deployed server newsletter path; otherwise the existing table insert remains.
7. Merge/publish, deployed-commit verification, real authenticated admin behavior, real recipient delivery, backup/restore verification, a second super admin, private evidence and credential decisions are separate owner/activation steps. No new company facts or credential documents were invented.

## Validation for this PR

- Focused offline Vitest: **145 tests passed in 17 files**, including metadata ownership, existing and new Leads pagination, legacy preservation, consent/schema/DST, alert outcome contract, media reference checks, unsupported route redirects, image sanitization, credential eligibility and protected content defaults.
- Full application TypeScript and selected strict TypeScript pass.
- Production build passes, with the existing large-chunk warnings.
- Deno type checks pass for changed intake/contact and new resend/readiness/package entry points, in an isolated tools directory. No deployment occurred.
- New frontend TypeScript files: ESLint clean. Existing repository lint debt was not repaired.
- Route audit, service-worker validation and `git diff --check` pass.
- **Skipped:** full Vitest, full repository lint budget comparison, full live/public screenshot/text replay, bundle comparison gate, authenticated browser/admin interaction replay, live SQL/RLS/storage tests, email tests and deployment/publishing checks. The earlier R1–R6 evidence folder describes that older PR, not this new work.

No claim is made that all master-plan phases are live or that all 50 original assessment findings are closed. Owner facts/documents, legal retention/disclosures, host response headers/prerendering, verified sender/recipients, live operations and preserved-design proposals remain outside this code PR. Per-page Insights/Search Console, email invitation intake, proof/review automation and response-time reporting are later features in the master plan.

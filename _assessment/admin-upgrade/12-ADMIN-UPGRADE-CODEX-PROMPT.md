# 12. Admin panel upgrade: spec and Codex prompt

Prepared by Claude on 3 October 2026 from a read-only survey of this folder and assessment files 00 to 11. No source file was changed. The owner chose three areas: (1) the bids and leads workflow, (2) dashboard and usability, (3) email alerts and delivery. Database changes are allowed **only as SQL the owner reviews and applies through Lovable**.

Files in this folder:

| File | What it is |
|---|---|
| `12-ADMIN-UPGRADE-CODEX-PROMPT.md` | This document: findings, target design, phased Codex prompt, owner decisions |
| `sql/0000_preflight_readonly.sql` | SELECT-only checks. Run these in Lovable Cloud first and keep the results |
| `sql/0001_inquiries_workflow.sql` | **Draft v2** migration for review: new `inquiries`, notes, activity history, per-recipient alert deliveries, alert recipients, dashboard summary function, atomic role change, and a guard so the last super admin can't be removed. Additive, with a rollback script |

### Revision v2 (3 October 2026, after the external review)

An external review checked v1 against the GitHub code. All six of its corrections are accepted:

1. **Estimates are not entirely lost.** The wizard saves to `contact_submissions` first. Only the secondary `quote_requests` save fails silently, which loses the commercial details. Section 1 (L1) is corrected. The fix is in PR #43.
2. **The rollout could hide leads.** The forms keep writing to the legacy tables until the switch-over. v1 moved those tables to "History" and replaced their dashboard counts in P3 and P4, before that point. **New rule: the legacy tables stay first-class, live sources in the Leads workspace and the dashboard until the switch-over is done and verified.** See sections 2.3, 2.4 and 3.
3. **A failed bell notification could cancel a new lead.** v2 runs the trigger's side effects in sub-transactions that log a warning instead of failing.
4. **Last-super-admin protection was incomplete.** v2 guards every write path with statement-level triggers on `user_roles`, serialised by an advisory lock.
5. **Retries.** v2 adds `submission_key` so a retried submission can't create a duplicate. It records alert outcomes per recipient in `inquiry_alert_deliveries`, and a send lease makes a crashed send safe to retry.
6. **Preflight and rollback.** Preflight adds queries 11–16 (live grants, policies, triggers, function privileges, isolation level, recent intake by path). The rollback script is now complete.

Codex has already started the Leads workspace on the **existing** tables; this is the right order. The new schema is added later as one more source behind the same adapter (see section 3).

---

## 1. What the survey found (facts that shape the design)

**Leads are being lost or misfiled today.**

- **L1. The estimate wizard's secondary `quote_requests` save fails silently. (Corrected in v2; fixed in PR #43.)**
  - The wizard first saves the estimate to `contact_submissions` (`src/pages/Estimate.tsx:292`). That row is kept.
  - It then inserts into `quote_requests` and calls `.select('lead_score, priority').single()` (`:312-330`).
  - Anonymous visitors have no SELECT policy on `quote_requests` (`supabase/migrations/20260610192714_*.sql:23-39`), so Postgres rejects that second insert. The error is ignored (`:332`).
  - What is lost is the structured commercial data: quote type, role, NTE budget, scope categories, consent flag, UTM source, lead score and priority. The lead itself is not lost.
- **L2. Most estimates and quotes land in Contacts, not Bids & Estimates.** The estimate wizard writes `contact_submissions` with `submission_type 'estimate'`. The quote dialog uses `'quote_request'` (`QuoteRequestDialog.tsx:70`) and the homepage CTA uses `'quote'` (`InteractiveCTA.tsx:133`). The "work" tab only reads `rfp_submissions` and `quote_requests` (`src/lib/inbox/model.ts:97-101`).
- **L3. Estimate and quote labels never split.** Admin code calls a row an "Estimate" when `quote_requests.source === 'estimator'` (`EstimatesQuotesTable.tsx:39`, `src/lib/inbox/workspace.ts:18-25`). No form ever writes that value; the wizard stores a JSON string of UTM values in `source` (`Estimate.tsx:90,104,326`).
- **L4. No public form captures a bid due date or time.** `quote_requests.target_deadline` is a date that no form writes. `rfp_submissions` has no deadline column.
- **L5. `submit-form` saves only the RFP row id.** The contact, resume and prequal inserts do not return their id (`supabase/functions/submit-form/index.ts:179-231`). So a server-side alert cannot reference those rows today.
- **L6. Contact consent is discarded.** `Contact.tsx:75-76` sends `consent_timestamp` and `newsletter_consent`, but the Zod schema strips them (`submit-form/index.ts:7-14`).

**Email.**

- **E1. `submit-form` sends no email.** Alerts are a second browser call:
  - `send-contact-notification` is called from `Contact.tsx:103` and `InteractiveCTA.tsx:157`.
  - `send-estimate-confirmation` from `Estimate.tsx:343`.
  - `send-quote-confirmation` from `QuoteRequestDialog.tsx:83`.
  - `send-resume-notification` from `ResumeSubmissionDialog.tsx:89`.
  - `InlineLeadForm`, `ContractorPortal` and `PrequalPackage` send nothing.
- **E2. All of the above use Resend.** They send from `onboarding@resend.dev` and never check `{error}`. Lovable reported that `RESEND_API_KEY` is not set.
- **E3. Only `send-rfp-emails` uses the verified Lovable sender** (`notify.www.ascentgroupconstruction.com`). It loads the row on the server, uses idempotency keys and logs to `email_send_log`.
  - On a 429 it sleeps inside the request and retries once without a try/catch (`:41-75`).
  - If the customer email throws, the internal alert is skipped (`:160-165`).
  - The site name is still `"AscentGroupWebsiteV1 47"` (`_shared/transactional-email-templates/send-email.ts:10`).
- **E4. Nothing in the admin reads `email_send_log`.** No row in it links back to a lead: there is no lead id column, only `metadata`.
- **E5. `send-rfp-notification` calls `notify_admins('email_failure', …)`** (`:234`). The `admin_notifications` CHECK only allows `rfp, contact, resume, prequal, quote, newsletter`, so that notification insert fails.
- **E6. No retry mechanism exists.** There is no queue, `pg_cron` or `pg_net` in the migrations. The pgmq wrapper functions exist but nothing calls them.

**Admin panel.**

- **A1. The dashboard makes about 20 requests every 60 seconds.** That is 10 + N + 4 + N queries, plus a realtime channel on every public table (`Dashboard.tsx:42-126`). It has no test.
- **A2. "Estimates & Quotes" is a separate page.** It duplicates the inbox "quote" tab, with a different status UI (`EstimatesQuotesTable.tsx`).
- **A3. Deletes are hard deletes from any admin**, in both `InboxTable.tsx:126-149` and `InboxDetailDialog.tsx:149-172`. There is no archive.
- **A4. Notes are a single overwritable text field**, and quote and prequal rows have none. There is no history of who changed what.
- **A5. The inbox has no pagination.** It loads every row and filters in the browser (`InboxTable.tsx:150-163`).
- **A6. Layout header.** It contains only the hamburger, the bell and the email as plain text (`UnifiedAdminLayout.tsx:146-159`). There is no user menu, "View site" or page title. Search lives only in the sidebar.
- **A7. `OnboardingTour` targets `data-tour` attributes that do not exist anywhere**, yet it auto-starts for every new admin (`UnifiedAdminLayout.tsx:27-36`).
- **A8. The idle timeout is not mounted.** `IdleTimeoutWrapper` and `SessionWarningDialog` exist unused, so admin sessions never time out on idle.
- **A9. Unused admin components.** These have no importer:
  - `AdminTopBar` (it links to the missing `/admin/hero`), `ChangesDiffDialog`, `ContentHealthCheck`, `ExportButton`, `FieldPreviewButton`, `FieldPreviewDialog`, `FilterPresets`, `IdleTimeoutWrapper`, `PasswordStrengthIndicator`, `PerformanceChart`, `QuickActions`, `RealTimeMetricsCard`, `SitemapManager`.
  - The filters `DateRangePicker`, `MultiSelectFilter`, `SearchInput` and `TagFilter`.
  - `NotificationBell` and `SessionWarningDialog` are imported only by dead files.
  - `HeroSlidesManager` is lazy-declared but has no route.
- **A10. Role changes are not atomic.** `Users.tsx:74-105` deletes all of a user's roles and then inserts the new one; a failure in between leaves the user with no role. There is also no guard against removing the last super admin. Only one user has a role today (Lovable).
- **A11. Minor defects.**
  - The Monitoring title is mis-encoded as `"ðŸ“Š System Monitoring"` (`Monitoring.tsx:50`).
  - The sidebar collapse state is not saved between visits.
  - The `onRestartOnboarding` prop is never used.
  - `ExportButton`'s "excel" option writes tab-separated text into a `.xlsx` file name.
  - `--admin-accent` (#FF6600) differs from `--brand-accent` (#F97316).
- **A12. No admin CSS targets 390 px**; the breakpoints are 1024, 768 and 640.
- **A13. No migration adds tables to the realtime publication.** The existing client subscriptions only work if this was set up outside the migrations; preflight query 6 settles it.
- **A14. Security-definer functions need explicit EXECUTE grants.** The Drizzle hardening revokes EXECUTE from `anon` and `authenticated` on every SECURITY DEFINER function not on a keep-list (`drizzle/migrations/0001_*.sql:165-186`). The draft SQL grants execute explicitly where needed.

What already works and must be kept:

- Complete RFP details and five-minute signed attachment links.
- CSV export with protection against spreadsheet formulas.
- Search across 11 sources with Ctrl/Cmd+K.
- `?tab=&highlight=` deep links.
- Per-user notification bell.
- Explicit no-access and error screens.
- Toronto-date overdue cues: `torontoDate`, `deadlineCue`, `sortInboxItems` in `src/lib/inbox/workspace.ts`, already tested across DST.

---

## 2. Target design

### 2.1 One lead model: `inquiries`

Every new public lead goes into one table, `public.inquiries` (see `sql/0001_inquiries_workflow.sql`). Its `inquiry_type` is one of:

- `general`: contact page, inline forms, homepage CTA.
- `estimate`: the estimate wizard and the quote dialog.
- `bid_invitation`: the new "Invite us to bid" form.
- `rfp`: the long `/submit-rfp` form.
- `prequal_request`: the contractor-portal unit-rate form and prequal package requests.

Resumes and newsletter subscribers are not leads and stay where they are.

- **Statuses (default, owner may relabel):** `new → reviewing → bidding → submitted → won | lost | no_bid`.
  - `lost` means the client chose someone else; `no_bid` means Ascent declined. This splits the ambiguous "Declined" from file 04, decision 2.
  - Spam or duplicates are **archived**, not deleted.
  - The labels can read "Estimating" instead of "Bidding" for estimate requests.
- **Workflow fields staff can edit** (enforced by column-level GRANTs): `status`, `priority`, `assigned_to`, `bid_due_at`, `bid_amount`, `first_viewed_at`, `archived_at`, `archived_by`. Staff can never edit what the visitor submitted.
- **Notes** go into `inquiry_notes`, which is append-only and records author and time.
- **History** is written by triggers to `inquiry_events`: status, assignment, due date, priority, amount, archive and restore, first view, notes, and alert results.
- **Alert delivery is stored on the row:** `alert_status` (pending, sent, failed, suppressed or skipped), `alert_attempts`, `alert_last_error`, `alert_sent_at`, `confirmation_status`.
- **Security:**
  - Anonymous users have no INSERT policy; only `submit-form`, running as the service role, can add rows. This also closes F-14 for the new path.
  - Admins can read and update.
  - Only super admins can delete.
  - The bell keeps working through `notify_admins('inquiry', …)`. The draft widens the CHECK first and also adds `email_failure` (finding E5).
- **Legacy tables** (`contact_submissions`, `rfp_submissions`, `quote_requests`, `prequalification_downloads`) **stay live sources** until the switch-over is complete:
  - The forms write to them until P7 flips the intake flag.
  - The Leads workspace and the dashboard must show them, with counts and alerts, for that whole period and for at least 14 days after the flip.
  - They move to read-only "History" only after preflight query 16 shows no new legacy writes for 14 days.
  - No backfill is planned; the owner decides if preflight query 1 shows rows that should be migrated.

### 2.2 Server-side intake and alerts (`submit-form`)

1. Add `formType: 'inquiry'` using a Zod **discriminated union** on `inquiry_type`. Put it in `supabase/functions/_shared/inquiry.ts` and mirror it in `src/lib/inquiry/schema.ts`; Deno cannot import from `src/`, so keep a parity test.
2. Keep the existing controls in their current order:
   - rate limit
   - honeypot
   - 2-second gate
   - duplicate check
   - link filter: apply it to `message` only, and validate `drawings_url` separately (https only, no credentials, not an IP address or localhost, at most 2,000 characters)
3. **Insert idempotently** with the service role.
   - The browser generates a `submission_key` (`crypto.randomUUID()`) once per form fill and reuses it on every retry of the same submission.
   - The insert uses `on conflict (submission_key) do nothing`. When nothing is inserted, select the existing row and return it with `duplicate: true`. Do **not** send another alert for a duplicate.
   - Set `consent_at` only when `consent_given === true`.
   - Store `consent_text_version`, a constant exported next to the consent checkbox copy.
   - Return `{ success, id, reference_code, duplicate }`.
4. **Send the alert in the same request** using the existing `sendTemplateEmail` (Lovable stack). Wrap it in try/catch with an overall timeout of about 8 s.
   - **Claim a lease first:** `update inquiries set alert_lease_until = now() + interval '2 minutes', alert_attempts = alert_attempts + 1 where id = $1 and (alert_lease_until is null or alert_lease_until < now()) returning alert_attempts`. If no row comes back, another send is in progress, so skip.
   - **Send once per recipient**, with idempotency key `inquiry-alert-<id>-a<attempt>-<sha256(lowercased recipient) first 16 hex>`. Record each outcome in `inquiry_alert_deliveries` with status sent, failed or suppressed, and the error code only.
   - Recipients are the active rows of `notification_recipients` matching the type, plus every `all` row. If no row matches, fall back to `estimating@ascentgroupconstruction.com`, a constant in the shared file.
   - The template gets `replyTo` set to the submitter.
   - Then set the summary on the row and clear the lease (`alert_lease_until = null`). `alert_status` is `sent` if every recipient succeeded, `partial` if some did, `failed` if none did, and `suppressed` if every recipient was suppressed. Also write `alert_last_error` (first error code) and `alert_sent_at`.
   - Log to `email_send_log` with `metadata: { inquiry_id, reference_code, attempt }`.
   - **A failed alert never fails the visitor's request.** The bell notification is created by the trigger in its own sub-transaction, so it is an independent second channel.
   - **A crashed function leaves the lead safe.** The row stays `pending` with an expired lease. The dashboard counts it under "alerts needing attention" after 10 minutes, and staff can resend.
5. Customer confirmation email: off by default, behind a constant (owner decision O-4). When on, record the result in `confirmation_status`.
6. **New function `inquiry-alert-resend`.** It keeps `verify_jwt = true`, checks `is_admin` on the caller's JWT and takes only `{ inquiry_id }`.
   - It claims the same lease and runs the same per-recipient send, as attempt n+1.
   - By default it sends only to recipients whose latest outcome is `failed` (or to all current recipients when the status is `pending`). With `{ all_recipients: true }` it sends to everyone.
   - It inserts an `alert_resend_requested` event.
   - It allows at most 5 attempts per inquiry.
   - It also accepts `{ test_to: <email> }` (admin only, no inquiry id). This sends a clearly labelled sample alert to that one address and writes nothing to `inquiries`. The Settings → Notifications "Send test alert" button uses it.
7. **Fix `send-email.ts:10`.** Set `SITE_NAME = "Ascent Group Construction"`, which also fixes F-29.
8. **New templates in `registry.ts`.**
   - `inquiry-internal-alert` subject: `BID due Thu Oct 9, 2:00 pm — <project> — <company>`, or `Estimate — <property/location> — <role>`, or `Inquiry — <name>`.
   - Body: every submitted field (escaped), the drawings link host shown in plain text, and a button to `https://www.ascentgroupconstruction.com/admin/inbox?tab=leads&highlight=<id>`. Always use the canonical www host.
   - `inquiry-customer-confirmation` has a reference code and one response promise. The owner supplies that wording (O-5).
9. Fix `send-rfp-emails` so a customer-email failure no longer prevents the internal alert. Send the internal alert first and catch each send separately. Replace the in-request sleep-and-retry with "record failed and let staff resend".
10. Once nothing calls them (phase P6), retire `send-contact-notification`, `send-estimate-confirmation`, `send-quote-confirmation`, `send-package-notification` and `send-rfp-notification` from the frontend. Deleting deployed functions is a Lovable step for the owner.

### 2.3 Admin: "Leads" workspace (replaces the "Bids & Estimates" tab)

The route stays `/admin/inbox`. The new first and default tab is **Leads**, `?tab=leads`.

**Source adapter.** The workspace reads leads through one adapter interface, `src/lib/leads/sources/*`, with one adapter per source. Each adapter maps its rows to a common `Lead` shape: id, source, type, name, company, project, due, status, received and capabilities.

- **Stage 1 (now, no schema change):** adapters for `contact_submissions` (split by `submission_type` into general, estimate and quote), `rfp_submissions`, `quote_requests` and `prequalification_downloads`.
  - Each adapter keeps its source's real status list and notes support, as `src/lib/inbox/model.ts` does today.
  - The adapter exposes a capabilities object (`canAssign`, `canSetDue`, `hasNotesThread`, `canArchive`). The UI hides controls a source cannot support, and never sends a column the table doesn't have.
  - Paging is per source, with a merged cursor on (received_at, id), as Codex is already doing. A source that fails to load is shown as an explicit warning while the other sources stay visible.
- **Stage 2 (after P1 is applied):** add the `inquiries` adapter, which supports every capability. Legacy adapters stay until the History rule in 2.1 is met.
- **Legacy tabs stay as they are** (editable status and notes) until that point. Then they move under "History", and hard delete is limited to super admins. Only then does `/admin/estimates-quotes` redirect to the matching History tab.

- **Views (segmented control):**
  - **Needs action:** new, reviewing and bidding.
  - **Due this week.**
  - **Submitted.**
  - **Closed:** won, lost and no_bid, collapsed by default.
  - **Archived.**
  - **All.**
- **Sort, done in the query:** rows needing action sort by `bid_due_at` ascending with no-date rows last, then newest first. Submitted rows sort by `bid_due_at` descending. Closed rows sort by `status_changed_at` descending. Reuse and extend `sortInboxItems`/`deadlineCue`.
- **Columns:** type badge; project or property; company; contact; **bid due**, shown relative and absolute in America/Toronto (red under 48 h, "Overdue" when past due and still new, reviewing or bidding); status (inline select); assignee (avatar or "Unassigned"); received; alert state icon (sent, partial, failed, suppressed or pending; shown for `inquiries` rows only).
- **Server pagination:** 50 rows per page with `range()`. Text search uses `ilike` on name, company, email, project and reference code. Filters: type, assignee ("Mine" or "Unassigned"), priority.
- **Detail drawer** (shadcn `Sheet`, full screen under 640 px, deep-linkable through `highlight`):
  - Header: reference code, type, status, priority, due time, and actions to call, email and copy the reference.
  - All submitted fields, grouped by type. The drawings link shows its host name and opens with `rel="noopener noreferrer"`; attachments use the existing signed-URL helper.
  - Workflow: status, assignee (admins and super admins from `profiles` joined with `user_roles`), bid due date and time, entered and shown in America/Toronto, priority, and bid amount.
  - **Notes thread** with author and time, using `inquiry_notes`.
  - **Activity timeline** from `inquiry_events`.
  - **Alert panel** (inquiries source only):
    - The summary status, plus one line per recipient and attempt from `inquiry_alert_deliveries`, with recipients masked by default.
    - "Resend to failed recipients" and "Resend to all" buttons. Both are disabled while a lease is active and show "Sending…".
    - Legacy rows show "Alert tracking not available for this source".
  - Archive and Restore for all admins. Delete only for super admins, behind `ConfirmDialog`, and the text says it cannot be undone.
  - Opening the drawer sets `first_viewed_at` once.
- **Optional board view (P9, last):** a kanban by status using the existing `@dnd-kit/*` dependencies. Dragging changes the status, with an optimistic update and rollback on error. Keyboard support comes from dnd-kit's KeyboardSensor.
- **Bulk actions:** assign, change status, archive, and CSV export of the filtered rows. Use the existing `BulkActionsBar` and the CSV helper, which excludes private fields.
- **Realtime:** subscribe per source table, filtered to the lead tables only, never "all public tables". Keep the 60-second refetch as a fallback, because preflight query 6 may show the tables are not in the realtime publication.
- **Build order (recommended by the review):** the reliable list and detail panel come first. Add the board view only after those are verified.

### 2.4 Dashboard rebuild

Replace the about-20-query dashboard with the sections below.

**Transition rule:** until the History rule in 2.1 is met, every count is the **sum of the legacy sources and `inquiries`**.
- The legacy part comes from the existing `loadInboxCounts` (new rows per table).
- A legacy row counts as "Unopened/Needs action" while its status is `new`. Legacy rows never count as overdue, because they have no bid closing time.
- If any source fails, the affected cards show "Unavailable", never 0.
- Before P1 is applied, the dashboard runs on legacy counts alone, and the `rpc` call is behind a capability check that treats a missing function as "not yet available".

1. **"Today" strip.** One `rpc('admin_inquiry_summary')` call, plus the legacy counts.
   - Cards: Unopened, Needs action, Due in 7 days, Overdue (red), Alerts needing attention (red: failed, partial, or stuck pending; links to the filtered list) and Unassigned.
   - Each card deep-links to the Leads view with the matching filter.
2. **Bids due soon.** The next 5 rows by `bid_due_at`, with relative times.
3. **Pipeline.** Counts by status, and won, lost and no-bid totals for the last 90 days. Show a win rate only when at least 5 bids have closed. Show the submitted value still open.
4. **Recent activity.** The latest 10 `inquiry_events`, with actor names.
5. **Content status.** Keep the existing projects, services, blog and homepage tiles, but load them with one combined query function and a 5-minute stale time; they don't need refreshing every 60 seconds.

Use one realtime channel on `inquiries` that invalidates the summary. Add a Dashboard test covering loading, partial failure and deep links.

### 2.5 Usability

- **Header bar** in `UnifiedAdminLayout`: page title (from the route registry), the search button (Ctrl/Cmd+K, moved out of the sidebar), the bell, "View site", and a user menu with the profile name, Sign out and "Restart tour".
- **Sidebar:**
  - Remember the collapsed state in localStorage, wrapped in try/catch.
  - **Overview:** Dashboard; Leads, with a badge equal to unopened plus overdue.
  - **Content:** unchanged.
  - **Website:** unchanged.
  - **Settings:** Site Settings; Users & Roles; Email Templates; **Email Delivery** (new).
  - **Tools:** Monitoring; Audit Log.
  - Keep the "Estimates & Quotes" item until the History rule in 2.1 is met; remove it then, and redirect its route.
- **Settings → Notifications tab:** manage `notification_recipients` per inquiry type. Validate addresses and warn when no active recipient exists. A "Send test alert" button calls `inquiry-alert-resend` in a dry-run test mode that sends only to the chosen address, not to a real lead.
- **Email Delivery page** (`/admin/email-delivery`): a read-only, paginated list of `email_send_log`.
  - Filters: status, template, date.
  - Show recipients masked by default (`j***@domain.com`), with a reveal toggle.
  - A `suppressed_emails` tab.
  - Rows link to the inquiry when `metadata.inquiry_id` is present.
- **Idle timeout:** mount `IdleTimeoutWrapper` around the admin outlet. The default is 30 minutes with a 60-second warning; the owner can change this (O-7). The existing hook uses 15 minutes; make it configurable. Keep unsaved-draft preservation, and see the existing token-refresh tests.
- **OnboardingTour:** add `data-tour` attributes to the real sidebar groups, or remove the tour. Recommendation: remove the automatic start and keep it reachable from the user menu with corrected targets.
- **Users & Roles:** call `rpc('set_user_role')` instead of delete-then-insert. Show the error message for "last super admin".
- **Mobile at 390 px:**
  - Leads and legacy tables render as cards under 640 px.
  - The drawer goes full screen.
  - The header actions collapse into the user menu.
  - No horizontal page scroll.
- **Cleanup**, with the evidence rule from file 09, rule 10:
  - Delete the A9 dead components and the unused `onRestartOnboarding` prop.
  - Fix the Monitoring title encoding.
  - Fix the `ExportButton` `.xlsx` mislabel only if the component is kept.
  - Report the `--admin-accent` and `--brand-accent` mismatch; don't change it.

### 2.6 Public forms (switch-over, behind a flag)

`src/config/intake.ts` exports `INTAKE_V2 = false`. Every form keeps its current path while the flag is false; one later PR flips it to `true`.

- **`/contact`** gets a three-card picker: **Request an estimate**, **Invite us to bid**, **General question**. It reads `?type=estimate|bid|general`.
  - The bid form requires: company, name, email, phone, project name, project location, and bid due date **and time**. It also has a drawings or ITB link, the scope or trades to price, and "Send me your prequalification package".
  - The estimate form requires: name, email, phone, "I am a…", property or address, and what is happening. It also has an urgency field and a photos link.
  - Keep the phone number visible beside the form.
  - The name field accepts any Unicode letter (`\p{L}`), fixing F-24, in the client and server schemas alike.
- **Deep links:** the GC page CTAs (`ForGeneralContractors.tsx`, "Submit Tender Request" and "Request Unit Pricing") go to `/contact?type=bid`. The Developers "Submit an RFP" button goes to `/submit-rfp`. The property-manager CTAs go to `?type=estimate`.
- **Other forms when the flag is on**, all through `submit-form` `inquiry`:
  - The estimate wizard sends `estimate`, with the wizard inputs, estimate range and UTM in `details`.
  - The quote dialog sends `estimate`.
  - `/submit-rfp` sends `rfp`, with the RFP fields in `details` and uploads in `attachment_paths`, using the existing upload flow.
  - The contractor-portal unit-rate form sends `prequal_request`.
  - `InlineLeadForm` and `InteractiveCTA` send `general`.
  - Remove every browser-triggered `send-*` call on the V2 path.
  - Fire the analytics `generate_lead` event only after `{success:true, id}`, as the SEO PR already does.

---

## 3. Phases (one PR each; the owner applies SQL and deploys functions through Lovable)

| Phase | PR | Contents | Needs from owner |
|---|---|---|---|
Revised v2 order. Nothing that hides a live source ships before the switch-over is verified.

| Phase | PR | Contents | Needs from owner |
|---|---|---|---|
| **P0** ✅ | PR #43 | L1 fixed: the `quote_requests` insert no longer asks for the row back; the conversion fires only after a successful save; a secondary failure is reported by error code only. The **`SITE_NAME` fix is still open**, so carry it into P2 | Merge, then Lovable Publish |
| **P3a** (in progress) | `feat/admin-leads-workspace` | 2.3 Stage 1: Leads list and detail panel over the **existing tables** through the source adapter, with bounded paging, conflict check on save, draft preservation and explicit source failures. Legacy tabs unchanged. No schema dependency | none |
| **P4a** | `feat/admin-dashboard-v2` | 2.4 on legacy counts only; `rpc` behind the capability check | none |
| ~~P5~~ | **Superseded by file 14** | Do not run P5. Header, sidebar, theme, mobile and idle timeout move to **R3**; tour removal and cleanup to **R1**; Email Delivery to **R6** (see `14-ADMIN-REDESIGN-CODEX-PROMPT.md`) | Idle timeout fixed at 30 min unless the owner says otherwise |
| **P1** | `feat/inquiries-schema` | Copy the approved v2 `0001` SQL unchanged into `supabase/migrations/<timestamp>_inquiries_workflow.sql`. Hand-written types in `src/lib/inquiry/` | Run preflight (all 16 queries), review, back up, apply through Lovable, regenerate `types.ts`, run the verification queries |
| **P2** | `feat/inquiry-intake-and-alerts` | 2.2 items 1–10, including `SITE_NAME`; Deno unit tests; Vitest parity test | Lovable deploys `submit-form`, `send-rfp-emails`, `inquiry-alert-resend` and the `send-email` shared code; owner adds at least two recipients |
| **P3b** | `feat/leads-inquiries-source` | 2.3 Stage 2: the `inquiries` adapter, notes thread, timeline, alert panel, assign, due, archive; Settings → Notifications; Users page switched to `set_user_role` | none |
| **P4b** | `feat/dashboard-inquiries` | Dashboard sums `inquiries` and legacy | none |
| **P6** | `feat/intake-v2-forms` | 2.6 with `INTAKE_V2=false` | none |
| **P7** | `chore/intake-v2-on` | Flip the flag after preview testing; remove the dead browser email calls. Legacy sources stay visible | Test in preview; check that preview does not write to the live database first (Lovable R17) |
| **P8** | `chore/legacy-to-history` | Only after 14 days with no new legacy writes (preflight query 16): legacy tabs move to History, Estimates & Quotes redirects, delete limited to super admins | Confirm query 16 result |
| **P9 (optional)** | `feat/leads-board` | Board view (dnd-kit), removable by reverting this PR alone | none |

**The deploy order is fixed:** migration first, then edge functions, then the frontend publish. A Git revert does not restore the database.

---

## 4. Owner decisions (defaults are used if not answered)

| # | Decision | Default in the spec |
|---|---|---|
| O-1 | Status labels | New, Reviewing, Bidding, Submitted, Won, Lost (client chose another), No bid (we declined) |
| O-2 | Alert recipients (at least two, one of them a person) | None seeded; fallback `estimating@` |
| O-3 | Who can be assigned leads | Every admin or super admin (today only one exists) |
| O-4 | Automatic confirmation email to the visitor | Off; the on-screen confirmation with a reference code is shown either way |
| O-5 | One response promise per audience (bid, estimate, emergency) | Placeholder text the owner must replace before P7 |
| O-6 | Keep `/submit-rfp` alongside "Invite us to bid" | Keep both |
| O-7 | Admin idle timeout | 30 min, 60 s warning |
| O-8 | Who may hard-delete a lead | Super admins only; everyone else archives |
| O-9 | Back-fill legacy rows if preflight shows any | No; show them under History |

---

## 5. Codex prompt

Paste everything between the markers. Change `PHASE` to run one phase per session.

=== BEGIN PROMPT ===

PHASE = P1
(Allowed, in this order: P1, P2, P3b, P4b, P6, P7, P8, P9. Already done: P0 (PR #43), P3a, P4a. P5 is superseded by file 14 (R1–R6), so do not run it. Do only the named phase, open one PR, report, stop.)

**FIRST read `_assessment/admin-upgrade/16-RISK-REVIEW-AND-SAFE-DELIVERY-PLAN.md`.** Its section 7 rules apply here and override this file where they conflict. The overall phase order is file 16, section 6. In particular, the Lovable preview is treated as the live database, so no test writes go to it.

# Role and context

You are a careful senior engineer upgrading the admin panel of `DolaSivikari/ascentgroupconstruction`:
- Frontend: Vite 5, React 18, TypeScript (strict off globally), React Router 6, TanStack Query, shadcn/Radix, Tailwind.
- Backend: Supabase via Lovable Cloud, with Deno edge functions in `supabase/functions`. Hosted on Lovable.
- The live site wins real client work, and the admin is where leads are handled. Missing or mis-sorting a bid invitation costs money, so correctness and not losing data come before polish.

Read first, and trust the code over the docs when they disagree (record any difference):
- `_assessment/admin-upgrade/12-ADMIN-UPGRADE-CODEX-PROMPT.md`: this spec. Sections 1 and 2 are the source of truth for what to build; section 3 is the phase table.
- `_assessment/admin-upgrade/sql/0001_inquiries_workflow.sql`: the approved schema. If the owner has not marked it approved in the PR thread, P1 stops after opening a draft PR.
- `_assessment/05-IMPLEMENTATION-STATUS.md`, `_assessment/headers-admin/06-IMPLEMENTATION-STATUS.md`, `_assessment/seo/10-IMPLEMENTATION-STATUS.md`: work that is already done. Do not redo it.
- Existing code to reuse rather than reinvent:
  - `src/lib/inbox/{model,api,workspace,dashboard,notifications}.ts` and their tests.
  - `src/lib/adminSearch.ts`.
  - `src/components/admin/{ConfirmDialog,BulkActionsBar,AdminPageLayout,AdminPageHeader}.tsx`.
  - `src/components/admin/inbox/*`.
  - `supabase/functions/_shared/{http,rateLimiter,errorHandler}.ts`.
  - `supabase/functions/_shared/transactional-email-templates/*`.
  - `supabase/functions/send-rfp-emails/index.ts`: the pattern for idempotent, logged sends.

# Non-negotiable rules

1. **Branch and PR only.** Use branch `admin/<phase>-<slug>` and open a PR against `main`. Never push to `main`, merge, force-push, publish, deploy functions, run migrations, or write to any live database or storage. Never send a real email; mock the Lovable email client in tests.
2. **Do not edit platform-owned files:** `.env`, `bun.lock`, `deno.lock`, `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `supabase/config.toml` (except adding a block for the one new function in P2, mirroring `send-rfp-emails`, with `verify_jwt = true`), or `.lovable/**`. No dependency additions or upgrades: use what `package.json` already has (`@dnd-kit/*`, `date-fns`, `zod`, `react-hook-form`, shadcn).
3. **Database:**
   - Never write SQL anywhere except the P1 migration file, and that file must be byte-identical to the approved `0001` draft.
   - If you believe the schema needs a change, write it as a new draft under `_assessment/admin-upgrade/sql/` and stop.
   - Until Lovable regenerates `types.ts`, define row types for the new tables by hand in `src/lib/inquiry/types.ts`. Never use `as any` to reach the new tables; use a typed wrapper.
4. **Protected, do not change:**
   - The homepage hero (`EnhancedHero`), `PremiumProjectHero`, and the public navigation order with its "Start a Project" button.
   - `/capabilities` and the Contractor Portal content.
   - Brand tokens.
   - Public contact details in `src/constants/company.ts`.
   - Any credential, insurance, WSIB, COR, bonding or Sto wording, business hours, and the "24/7" wording. These are on owner hold; report them, don't change them.
5. **UI conventions:**
   - `ConfirmDialog` and toasts only; never `window.confirm` or `alert`.
   - Existing admin tokens and Barlow font.
   - Accessible labels on every control, visible focus, and keyboard reachability.
   - No horizontal scroll at 390 px.
   - No Vite `manualChunks`.
6. **Privacy:**
   - Never log request bodies or personal data in edge functions; log ids and error codes only.
   - CSV and Email Delivery exports exclude notes, consent/IP data and private file paths.
   - Mask emails in the Email Delivery list by default.
7. **Time zones:** bid due times are stored as `timestamptz` and entered and shown in **America/Toronto**.
   - Convert with `Intl.DateTimeFormat` offset math in one helper, `src/lib/inquiry/time.ts`, with tests across both DST transitions.
   - Never treat `rfp.project_start_date` or `quote_requests.target_deadline` as a bid closing time.
8. **Failure handling:**
   - A saved lead must never be lost because an email, realtime or count query failed.
   - The visitor sees success once the row is saved.
   - Staff see partial-load errors explicitly; never show a failed count as 0.
   - **No change may hide a source that public forms still write to.** Legacy tables stay visible, counted and editable until P8's condition is met.
   - Database triggers must not let a side effect (notification, log) roll back a lead insert. Use the sub-transaction pattern in the v2 SQL.
   - Every retried write must be idempotent: `submission_key` for submissions, per-recipient idempotency keys for emails, and a lease for concurrent sends.
9. **Quality gates before every PR:**
   - Production build, `typecheck:selected`, full `tsc --noEmit` for the app config, the full Vitest suite, `validate:sw`, and the route audit or smoke test.
   - Lint must not exceed the current baseline (288 errors / 34 warnings), and new files must be lint-clean.
   - Report the exact numbers. Never describe a failing or skipped check as passing.
   - If `bun install --frozen-lockfile` fails because of the private mirror, use the temporary-copy approach already used in CI (`.github/workflows`) and say so.
10. **Deletions:** a file may be deleted only with three pieces of evidence:
    - no importer;
    - no string reference anywhere, including `supabase/functions`, `public`, `scripts`, `.github` and docs;
    - an unchanged build and smoke test.
    Otherwise list it under "quarantine".
11. If anything is uncertain, stop and ask. Write "Unknown" rather than guessing.

# Phase instructions

**P0: done in PR #43.** Do not redo it. The `SITE_NAME` change moves to P2.

**P3a: Leads list and detail panel over the existing tables.** Implement section 2.3, Stage 1.
- Use the source adapter design in 2.3.
- Do not move, hide or make read-only any legacy tab. Do not redirect `/admin/estimates-quotes`.
- Tests:
  - merged paging with equal timestamps, missing dates and rows arriving between pages
  - one source failing while the others stay visible
  - capability-driven controls (no unsupported column is ever sent)
  - conflict check on save
  - draft preservation on failure
  - Toronto-time cues
  - CSV excludes private fields
  - 390 px card layout
- Browser-verify against the production build (`vite build` + `vite preview`), not the dev server.

**P4a: Dashboard on legacy counts.** Implement section 2.4 with its transition rule. The `rpc('admin_inquiry_summary')` call is behind a capability check and is unused until P4b. Remove the "all public tables" realtime channel and the per-table 60-second polling that the new design replaces. Add `src/pages/admin/Dashboard.test.tsx`.

**P5: Usability.** Implement section 2.5, except the Notifications settings tab and the `set_user_role` switch-over (both move to P3b).
- Delete the A9 dead components only with the rule 10 evidence.
- Idle timeout: use the value the owner gave in the PR thread, otherwise 30 minutes.

**P1: Schema.**
- Copy the approved **v2** `0001` SQL into `supabase/migrations/<UTC yyyymmddHHMMSS>_inquiries_workflow.sql` unchanged. Leave out the commented rollback block, and put it in the PR description instead.
- Add `src/lib/inquiry/types.ts` (row types, status, type and priority unions, labels) and `src/lib/inquiry/constants.ts`.
- Add tests that the TypeScript unions match the CHECK lists in the SQL file; parse the file in the test.
- The PR description must contain the owner's apply steps:
  1. Preflight.
  2. Backup.
  3. Apply through Lovable.
  4. Regenerate types.
  5. Run the verification queries:
     - anonymous insert denied
     - admin select allowed
     - bad status rejected
     - bid invitation without a due time rejected
     - a notification is created on insert
     - **an insert still commits when `notify_admins` raises**: test this on a non-production copy by temporarily revoking the function, never on live data
     - a duplicate `submission_key` is rejected
     - deleting or demoting the only super admin is refused, both through `set_user_role` and through a direct `delete from user_roles`

**P2: Intake and alerts.** Implement section 2.2 exactly.
- Unit tests:
  - schema per type
  - URL validator (https only, credentials rejected, IP and localhost rejected, length)
  - recipient resolution (type rows plus `all`, fallback)
  - the alert-failure path keeps the row and returns success
  - idempotency keys per recipient
  - a duplicate `submission_key` returns the existing row and sends no second alert
  - the lease blocks a concurrent send, and an expired lease allows a retry
  - mixed outcomes produce `partial`, with one delivery row per recipient
  - resend goes to failed recipients only, unless `all_recipients` is set
  - resend permission check and attempt cap
  - the `SITE_NAME` change
  - `send-rfp-emails` sends the internal alert even when the customer send throws
- Mock `sendLovableEmail` and the Supabase client.
- Do not change the behaviour of the existing `contact`, `resume`, `prequalification` and `rfp` form types.

**P3b: The `inquiries` source.** Implement section 2.3, Stage 2.
- Add the `inquiries` adapter, plus the notes thread, activity timeline, per-recipient alert panel with both resend buttons, assign, due date, priority, bid amount, archive and restore.
- Add Settings → Notifications (with "Send test alert").
- Switch `Users.tsx` to `rpc('set_user_role')`, showing the "At least one super admin must remain" error.
- Legacy adapters stay unchanged.
- Tests: notes append, resend states, archive vs delete permissions, and the role-change error.

**P4b: Dashboard with inquiries.** Enable the `rpc` path and sum it with the legacy counts, per 2.4. Test the sums and a partial failure in each part.

**P6: Public forms behind `INTAKE_V2 = false`.** Implement section 2.6.
- Each form generates a `submission_key` once per fill and reuses it on retry.
- With the flag off, the smoke test output must be byte-identical to `main` for every public route.
- With the flag on, test each form's payload, a retried submission (same key, one row), and the success and blocked states.

**P7: Switch-over.** Flip the flag and remove the now-dead browser `send-*` calls on the V2 path.
- Legacy sources stay visible and counted.
- List the edge functions that no longer have callers, so the owner can retire them in Lovable.
- Do not delete function folders in this PR.

**P8: Legacy to History.** Start only when the owner confirms that preflight query 16 shows no legacy writes for 14 days.
- Move the legacy tabs under History and redirect `/admin/estimates-quotes`.
- Limit hard delete to super admins.
- Keep the legacy adapters available for search and deep links.

**P9 (optional): Board view.** A kanban by status using the existing `@dnd-kit/*`, with optimistic updates and rollback, plus keyboard support. It must be removable by reverting this PR alone.

# Report at the end of each phase

1. What changed, in plain English.
2. The files touched.
3. Each gate command with its result and the numbers.
4. What you did not do, and why.
5. The exact owner steps (SQL to apply, functions to deploy, settings to fill in, preview checks).
6. Open questions.

State plainly that merging does not publish: the owner uses Lovable Publish → Update, and migrations and functions are deployed through Lovable in the order migration → functions → frontend.

=== END PROMPT ===

---

## 6. How you check each phase in the Lovable preview

| Phase | Check |
|---|---|
| P0 | Submit one test estimate with "Trade Package for GC" selected and a fake address like `test+p0@example.com`. A new row appears under Inbox → Quote. If preview shares the live database, delete the test row afterwards |
| P1 | Lovable shows the four new tables; preflight query 2 now lists them |
| P2 | After adding recipients, a test inquiry arrives in the mailbox from "Ascent Group Construction". Its row shows Alert: sent. A forced failure (remove all recipients and the fallback in a test build) shows Alert: failed and "Resend alert" works |
| P3a | The Leads tab shows estimates and quotes filed under Contacts, plus RFPs and quote requests. The old tabs still work. With one source failing (test build), the others stay visible with a warning |
| P4a | The dashboard cards match the Leads view counts; clicking a card opens the matching filter; a failed source shows "Unavailable", not 0 |
| P3b | On an inquiry: change status, assign, add a note, and see the timeline update; archive and restore; the alert panel lists each recipient |
| P8 | The legacy tabs appear under History only after the 14-day check |
| P5 | At 390 px: the header, the drawer full screen, no sideways scroll; the session warning appears after the idle period |
| P6/P7 | Each public form produces one row in Leads with the right type and one alert |

# 04 — Inquiries inbox: readiness assessment

**Status: plan only.** Nothing was implemented. No migration was run, no form was submitted, no email was sent, and no database was written to or read from. Everything below comes from reading the repository.

**How to read this file.** Sections marked **[FACT]** state what the repository contains, with `file:line`. Sections marked **[RECOMMENDATION]** are my judgement. **Unknown** means the repository cannot answer the question; the answer path is given. Finding IDs (F-xx) refer to `02-FINDINGS.md`.

**What was asked for (from the brief).**

1. The contact form splits into **"Request an estimate"** (owners, property managers) and **"Invite us to bid"** (general contractors: project name, GC company, bid due date, drawings link).
2. Submissions are **stored** and shown on a **password-protected admin page** with statuses **New / Reviewing / Bidding / Submitted / Won / Declined**, **sorted by bid due date**.
3. An **email alert** fires on every new submission.
4. No full CRM.

---

## 0. Bottom line [RECOMMENDATION]

- **Feasible without new vendors.** The admin half already exists: a login, a role check, an inbox page, a detail dialog with status and notes, realtime refresh and an unread badge (section 1.3). The work is mostly on the intake half (new fields, one endpoint, one status vocabulary) and on making email dependable.
- **Do not start with the inbox. Start with email.** Today an alert to the team depends on a shared test sender (F-06) and on the visitor's browser making a second call after the form is saved (F-13). If either fails, the lead is stored and nobody is told. An inbox on top of that would look finished and still miss bids.
- **Use one new table, not another column on an old one.** Three overlapping tables hold inquiries today, with three different status lists, and one estimate is written twice (section 1.4). A single `inquiries` table with one status list is the cleanest base for "sorted by bid due date" and for the six statuses.
- **Rough size (my estimate, not a measurement):** ten small steps, about two to three developer-weeks, after a short set of decisions only you can make (section 9). Step 1 (trustworthy email) and Step 0 (confirm how migrations reach the live database) come first and are independent of the rest.
- **Two existing bugs sit directly in the way** and are cheap to fix on the way through: the inbox's RFP detail view cannot show a bid's scope or open its drawings (F-11), and saving a note on an estimate request is expected to fail (F-42).

---

## 1. What exists today [FACT]

### 1.1 Where every public form goes

| Form | Code | Stored in | Email afterwards | In-app notification |
|---|---|---|---|---|
| Contact page | `src/pages/Contact.tsx:71` calls `submit-form` (`formType` contact); `submission_type: 'contact'` at `:80` | `contact_submissions` | Browser makes a second call to `send-contact-notification` (`:103`) | Trigger `notify_new_contact` (baseline migration `20251117201340_remix_migration_from_pg_dump.sql:3146`) |
| Homepage CTA | `src/components/homepage/InteractiveCTA.tsx:134` (`submit-form`), `:158` (`send-contact-notification`) | `contact_submissions` | Same two-step pattern | Same trigger |
| Inline lead form | `src/components/forms/InlineLeadForm.tsx:79,81` (`submit-form`, `formType: "contact"`) | `contact_submissions` | **None found in the file** | Contact trigger only |
| Estimate wizard | `src/pages/Estimate.tsx:292` (direct insert, `submission_type: 'estimate'`) **and** `:312` (direct insert into `quote_requests`) | **Two tables, two rows** | `send-estimate-confirmation` (`:342`), browser-triggered | Two triggers fire (contacts and quotes, baseline `:3146`, `:3160`) |
| Quote dialog | `src/components/estimator/QuoteRequestDialog.tsx:69` (direct insert, `submission_type: 'quote_request'`) | `contact_submissions` | `send-quote-confirmation` (`:81`), browser-triggered | Contact trigger |
| `/submit-rfp` wizard | `src/pages/SubmitRFPNew.tsx:121-135` uploads files first, then `:172` `submit-form` (`formType` rfp) | `rfp_submissions` (+ private bucket `rfp-attachments`) | `send-rfp-emails` (`:200`), **looks the row up server-side** and is idempotent | Trigger `notify_new_rfp` (`:3167`) |
| Prequal package | `src/components/homepage/PrequalPackage.tsx:44` | `prequalification_downloads` | **None found** (`send-package-notification` has no caller in `src/`) | Trigger `notify_new_prequal` (`:3153`) |
| Careers | `src/components/ResumeSubmissionDialog.tsx:61`, `:89` | `resume_submissions` | `send-resume-notification` | None found |
| Contractor portal | `src/pages/resources/ContractorPortal.tsx:95,99` (`submit-form`, `formType: 'prequalification'`) | `prequalification_downloads` | **None found** | Prequal trigger |

Count: of the nine entry points, six call an email function afterwards, three do not. All six depend on the browser surviving long enough to make that second call (the RFP one at least looks the row up on the server).

**Consequence for the brief.** There is no single place that every inquiry passes through after it is stored. "An email on every new submission" cannot be met by adding one line to one form; it needs the alert to move to the server, next to the insert (section 5.4).

### 1.2 What `submit-form` does today (`supabase/functions/submit-form/index.ts`, 291 lines)

- Public endpoint, no JWT required (`supabase/config.toml:6-7`, `verify_jwt = false`). CORS allows any origin (`supabase/functions/_shared/http.ts:1-4`).
- Accepts four `formType` values: contact, resume, prequalification, rfp (`:58`, allow-list at `:99`). **There is no inquiry/bid type.**
- Controls, in order: per-client rate limit of 5 per 15 minutes per form type (`:105`); honeypot field (`:112`); a time gate that rejects submissions faster than 2 seconds (`:119-121`); a link filter that rejects message bodies containing `http://`, `https://` or `www.` for every type **except rfp** (`:134`); a repeat-content check (`:146-167`).
- Inserts with the service-role key, so it bypasses the table's row-level security (`:176-262`). The rfp branch validates with a Zod schema (`:35-55`) and writes the fields listed in F-11. It sets `consent_timestamp` to "now" without reading the checkbox (F-26).
- **No CAPTCHA anywhere** (a search of `src/` and `package.json` for Turnstile, reCAPTCHA and hCaptcha finds nothing).
- **The link filter matters for this feature.** A "drawings link" field is a URL. Any new form type must either exempt that one field from the filter or run the filter on the free-text fields only.

### 1.3 The existing admin inbox

| Piece | File:line | What it does |
|---|---|---|
| Route | `src/routes/AppRoutes.tsx:184` | `/admin/inbox` renders `UnifiedInbox`. Legacy admin paths redirect to it (`:161-166`); estimates have their own page at `:167-168` |
| Page | `src/pages/admin/UnifiedInbox.tsx:10,15` | Tabs: all, rfp, contact, resume, prequal, quote, newsletter. The tab list is written out twice |
| List | `src/components/admin/inbox/InboxTable.tsx:56-87` | One generic query per table: `select` a fixed column list, `order(created_at, desc)`, optional `eq('status', …)`. **No `limit` or `range`** |
| RFP columns shown | `InboxTable.tsx:89-95` | `id, contact_name, company_name, email, phone, project_name, status, created_at, estimated_value_range` |
| Sorting | `InboxTable.tsx:149-151` | In the browser, newest first, across all tables merged |
| Status filter | `InboxTable.tsx:320-325` | Hard-coded: new, in_progress, contacted, completed, resolved |
| Detail dialog | `src/components/admin/inbox/InboxDetailDialog.tsx:40-47` | Saves `{status, admin_notes}` to whichever table the row came from. Status list at `:243-247` is the same five values. Delete at `:70-80` (hard delete, any admin) |
| RFP detail | `InboxDetailDialog.tsx:104-114` | Company, project, type, value range, `project_description` (see F-11) |
| Realtime | `InboxTable.tsx:155-180` | Subscribes to table changes. The migrations contain no `supabase_realtime` publication statement, so whether events actually arrive is **Unknown** |
| Counts and badge | `src/components/admin/inbox/InboxDashboard.tsx:15-31`; `src/components/admin/UnifiedSidebar.tsx:56,278` | Counts rows with `status = 'new'` per table; sidebar badge |
| In-app bell | `src/components/admin/NotificationBellInbox.tsx`; DB function `notify_admins` (baseline `:736-766`) | One `admin_notifications` row per admin user per new submission. `notification_type` has a CHECK limited to rfp, contact, resume, prequal, quote, newsletter (baseline `:1034`) |
| Estimates page | `src/components/admin/inbox/EstimatesQuotesTable.tsx:52-58,217` | Separate list for `quote_requests` with its own statuses new, contacted, quoted, won, lost |

### 1.4 The three overlapping tables

| | `contact_submissions` | `quote_requests` | `rfp_submissions` |
|---|---|---|---|
| Defined | baseline `:1223-1239` | baseline `:207-241` | baseline `:1738-1766` |
| Status default | `'new'`, free text | `'new'` with **CHECK** new / contacted / quoted / won / lost (`:240`) | `'new'`, free text |
| `admin_notes` | yes | **no** (`types.ts:1959` onward) | yes |
| Who is asking | none | `role` with CHECK owner / developer / gc / pm / consultant / other (`:239`) | `title` (free text) |
| Project name | none | none (`project_address`) | yes |
| Date fields | none | `target_deadline date` (the estimate form does not write it, `Estimate.tsx:313-326`) | `project_start_date` (text), `estimated_start_date` |
| Attachments | none | `uploaded_files text[]` (not written by the form) | `attachment_urls text[]` (added `20260308204816_*.sql:3`) |
| Consent | timestamp, IP | boolean, timestamp, IP | timestamp, IP |
| Rate-limit trigger (10 per IP per hour, skipped for the service role) | `20260417170110_*.sql:49-52` | `:54-57` | `:59-62` |

**No table anywhere has a bid due date, a GC-company field, a drawings link or an inquiry-type field.** A search of `src/` and `supabase/` for `bid_due`, `bidDue`, `due date`, `drawings_url`, `gc_company` and `inquiry_type` returns nothing.

Two facts that follow: the same estimate is stored twice (`Estimate.tsx:292` and `:312`), so it shows once under Contact and once under Quote; and the inbox's single status list does not fit the one table (`quote_requests`) that has a status CHECK (F-42).

### 1.5 Access control

- **Login:** Supabase email and password at `/tekev` (`src/pages/Auth.tsx`), with a lockout function (`supabase/functions/check-login-attempt/index.ts:43`, per email and IP). No MFA or CAPTCHA was found.
- **Roles:** table `user_roles` (admin, super_admin). The admin screen is guarded **in the browser** (`src/components/admin/UnifiedAdminLayout.tsx:95-97`; role fetched in `src/hooks/useAdminAuth.ts:47-59`). That guard only hides the UI; the real control is the database policy `is_admin(auth.uid())`.
- **Policies on `rfp_submissions`:** insert by anyone (`20251117210811_*.sql:93-98`, `WITH CHECK (true)`); all operations for admins (`20251118172153_*.sql:39-47`); a later policy named "Block non-admin reads" (`20260610192714_*.sql:35-39`) is written as a normal permissive policy, so it adds nothing beyond the admin one.
- **A second migration track exists** (`drizzle/migrations/0001_…sql`, `0002_…sql`) that would replace the always-true insert policies with length and email checks, and revoke some grants. Whether it was ever applied to the live database is **Unknown**, and so is the effective policy set (answer: `select * from pg_policies where schemaname in ('public','storage')`, read-only).
- **Admin URL exposure:** `public/robots.txt:88-90` lists `/admin` and `/tekev`; a `Disallow` line does not stop indexing and it tells everyone where the login is (F-30).
- **MCP server:** `supabase/functions/mcp` exposes list/get tools for contact and RFP submissions to a bearer-token client (report 1D). A new table is not exposed unless someone adds it.

### 1.5a Storage

- Bucket `rfp-attachments` is private (`20260308204816_*.sql`). Admins can read it by policy. Anonymous upload is allowed for pdf, doc, docx, xls, xlsx, jpg, jpeg, png and webp up to 20 MiB (`20260610193847_*.sql:20-33`).
- The size test reads `metadata->>'size'` and treats a missing value as 0. Whether the storage service fills that value before the policy is evaluated is **Unknown**, and no bucket-level `file_size_limit` is set in the migration that creates the bucket.
- **No admin screen opens these files** (F-11). A signed-URL pattern for a different private bucket already exists at `src/utils/documentUrl.ts:26`.

### 1.6 Email

- **Two stacks.** Resend with the shared test sender `onboarding@resend.dev` in six functions (12 occurrences; F-06), and the Lovable email stack (`supabase/functions/_shared/transactional-email-templates/send-email.ts`) used for RFP and review emails, with sender name "AscentGroupWebsiteV1 47" (F-29; `send-email.ts:10`).
- **Recipients are hard-coded** in each function (`info@`, `estimating@`, `projects@`, `careers@`; report 1D).
- **The better path** is `send-rfp-emails`: it takes only an id, loads the stored row, sends with an idempotency key per submission, logs each attempt to `email_send_log` and handles suppression (`supabase/functions/send-rfp-emails/index.ts:88-134,158`). The `email_send_log` table is present in the generated types (`src/integrations/supabase/types.ts:917`) but no migration in the repository creates it, so it was made outside the repo's migrations (Unknown how).
- **The alert link points at the bare domain** (`rfp-internal-notification.tsx:17`, `https://ascentgroupconstruction.com/admin/inbox`), while the site's canonical host is `www`. Whether the bare domain redirects is **Unknown** (F-32).
- **Verified sending domain and DNS records (SPF, DKIM, DMARC) are Unknown.** Answer: Resend → Domains, the Lovable email settings, and `dig TXT` for the domain.

### 1.7 Tests, build and deployment relevant to this change

- One test file exists in the repo: `src/pages/admin/seo/__tests__/scoring.test.ts`. Vitest is installed (`package.json`). There are no tests for forms, edge functions or the inbox.
- Dependencies cannot be installed outside Lovable from the lockfile as shipped (F-34 and report 1E: `bun.lock` points at a private mirror). A developer working locally would have to regenerate the lockfile first.
- How a new migration reaches the live database is **Unknown** (Lovable normally applies `supabase/migrations`; `drizzle/` is a second track; two migration files carry 12-digit version prefixes dated `202611…`, report 1D).

---

## 2. Requirement-by-requirement gap [FACT]

| # | Requirement | Exists today? | Evidence | What is missing |
|---|---|---|---|---|
| 1 | Two form types on the contact page | No | `Contact.tsx` has one form with no role or type field (F-25) | Type selector and two field sets; deep links from the GC and property-manager pages |
| 2 | GC fields: project name, GC company, bid due date, drawings link | Partly, in a different form | `/submit-rfp` has company and project name (`SubmitRFPNew.tsx:55-79`); nothing has a bid due date or drawings link (search in 1.4) | New columns and form fields; URL validation |
| 3 | Store submissions | Yes, in three tables | Section 1.4 | One table with one shape and one status list |
| 4 | Password-protected admin page | **Yes** | `/tekev` login, `is_admin` RLS, `UnifiedAdminLayout.tsx:95-97` | MFA, `noindex`, fewer exposed hints (F-30); verify live RLS (Unknown) |
| 5 | Statuses New / Reviewing / Bidding / Submitted / Won / Declined | No | Inbox uses new / in_progress / contacted / completed / resolved (`InboxTable.tsx:320-325`); estimates use a different five | Six statuses, enforced by a database CHECK |
| 6 | Sorted by bid due date | No | Sorted by `created_at` in the browser (`InboxTable.tsx:149-151`); no bid date exists | Date column, server-side order, index, overdue and due-soon cues |
| 7 | Email alert on every new submission | **Not reliably** | Browser-triggered, shared test sender, some forms send none (sections 1.1, 1.6; F-06, F-13) | Server-side alert next to the insert, verified sender, failure recorded and visible |
| 8 | No full CRM | n/a | | Keep to one table, notes, status. No contacts table, no pipeline analytics, no assignment workflow |

---

## 3. Architecture blockers and frictions [FACT, with my severity label]

**Blocker** = the feature will not work as specified until this is dealt with. **Friction** = it will work but costs time or invites bugs.

| # | Item | Evidence | Label |
|---|---|---|---|
| B1 | **Email cannot be trusted** for alerts: shared test sender, browser-triggered second call, send result ignored, three forms send nothing | F-06, F-13, F-29; section 1.1; `send-contact-notification/index.ts:142,181` | **Blocker** |
| B2 | **Unknown path for database changes.** Two migration tracks, odd version prefixes, and no record of what the live database holds. A new table is a migration; if it does not apply cleanly, nothing else works | Report 1D; `drizzle/migrations/`; `supabase/migrations/202611020001_*.sql` | **Blocker until Step 0** |
| B3 | **Effective RLS is Unknown.** The new table will hold names, phones and project details. The policy set in force must be read from the live database before relying on any of this | Section 1.5 | **Blocker until Step 0** |
| F1 | Three tables, three status vocabularies, one double write | Section 1.4; `Estimate.tsx:292,312` | Friction |
| F2 | Inbox status list is hard-coded in two files and unconstrained for two of the three tables | `InboxTable.tsx:320-325`; `InboxDetailDialog.tsx:243-247` | Friction |
| F3 | Inbox sorts and filters in the browser with no `limit` or `range`. A list that must sort by due date needs the order done in the query and an index. Supabase's default maximum rows per request (commonly 1,000) is **Unknown** here | `InboxTable.tsx:56-87,149-151` | Friction |
| F4 | `InboxTable` and `InboxDetailDialog` are generic over six tables with `any` types. The new list needs different columns, a different status list and a due-date column; bending the generic component will break the other tabs | `InboxTable.tsx:29-41`; TypeScript `strict` is off (F-35) | Friction |
| F5 | The RFP detail view and attachments are not usable by estimators (the part of the inbox GCs depend on) | F-11 | Friction |
| F6 | The note-saving bug on estimate requests | F-42 | Friction |
| F7 | `submit-form` rejects link-bearing text for every type except rfp, which collides with a drawings-link field | `submit-form/index.ts:134` | Friction |
| F8 | No automated tests around forms or functions, and no working CI (the workflows run `npm ci` with no `package-lock.json`) | Section 1.7; F-34 | Friction |
| F9 | Local development is not possible from the repo as shipped (lockfile points at a private mirror) | Report 1E | Friction |
| F10 | No CAPTCHA on a public endpoint that will now accept URLs | Section 1.2 | Friction (becomes a risk once the form accepts links, section 7) |

Not blockers: the client-rendered shell (F-07). Forms need JavaScript regardless, and the admin area is behind a login. It does matter for how the new pages are found (the SEO findings), but not for this feature.

---

## 4. Options for storage, auth and email [RECOMMENDATION]

### 4.1 The two options side by side

**Option A (recommended): extend what is already there.** New `inquiries` table in the existing Supabase project, the existing admin login and inbox, alerts sent from the server by `submit-form`.

**Option B (alternative): an external tracker.** Visitors still submit through `submit-form`, which also forwards each inquiry to Airtable, Notion or a Google Sheet through an automation (Zapier, Make or a direct API call). Staff work in the vendor's grid or board, sorted by a date column, with the vendor's own login and notification rules.

| | **A. Extend Supabase** | **B. External tracker** |
|---|---|---|
| Storage | New `inquiries` table in the current Postgres | Rows live in the vendor's workspace |
| Admin page | New tab in `/admin/inbox` | The vendor's views; no admin code |
| Auth | Existing Supabase login and `user_roles`; add MFA | Vendor accounts, sharing rules or SSO |
| Email alert | Server-side from `submit-form`, verified sender | Vendor automation on "new row" |
| Time to a working version (my estimate) | About two to three developer-weeks | About three to five days, plus the forwarding code |
| Running cost | No new subscription; sending volume cost is Unknown | Per-seat and possibly per-run pricing: Unknown, check the vendor |
| Where personal data sits | The existing project (region Unknown) | A third party's cloud. Confirm residency and contract terms with counsel (not legal advice) |
| Main failure mode | A bug in code you own, visible in your logs | An automation that stops without anyone noticing; two systems to reconcile |
| Matches "sorted by bid due date, six statuses" | Yes, exactly | Yes (date sort, single-select field) |
| Still required first | Step 0 (migration path, live RLS) and Step 1 (trustworthy email) | Step 1 for the visitor-facing email; plus a server-side hand-off from `submit-form` |
| Best when | You want one system and have a developer available | No developer for several weeks and staff already live in that tool |

**Why A.** The admin half is built; the data and the login already belong to the company; and the hard problems (email you can trust, one endpoint, one status list) have to be solved under B as well, so B saves the admin screen and little else. The inbox is also the place where the 24-hour response promise (F-21) can actually be tracked.

**If B is chosen anyway:** keep the Supabase insert as the source of truth and treat the vendor as a view. Record `forwarded_at` or an error on the Supabase row so a vendor outage cannot lose a lead. Never make the visitor's request wait on the vendor.

**Variant A-lite (smallest change, not recommended).** Add `inquiry_type`, `bid_due_at`, `gc_company` and `drawings_url` columns to `rfp_submissions`, add a CHECK for the six statuses, and add a "bid due" column to the RFP tab. It reuses the existing form path, `send-rfp-emails` and the attachments bucket. It leaves the owner and property-manager path on the other two tables with their different statuses and the double write, so "one inbox, six statuses, sorted by due date" would only be true for GCs.

### 4.2 Email inside Option A

| | Lovable email stack (used for RFP today) | Resend with a verified domain |
|---|---|---|
| Already has | Idempotency key, `email_send_log`, suppression handling, server-side lookup (`send-rfp-emails/index.ts:88-158`) | Branded template helper (`_shared/emailTemplate.ts`) |
| Needs | Verified sender domain confirmed (Unknown); site name fixed (`send-email.ts:10`, F-29) | Domain verified; every `from:` changed away from `onboarding@resend.dev` (12 places, F-06); send results checked |
| Unknown | Whether `notify.www.ascentgroupconstruction.com` is verified (`send-email.ts:13`) | Whether the Resend account has any verified domain |

**Recommendation:** use the Lovable stack for the new alert because it already carries the safeguards this feature needs, provided Step 0 confirms its domain is verified. If it is not, verify the domain in whichever service is easier, and then use that one. **Do not keep two stacks**, and use the same sender domain on both so visitors see one consistent sender.

### 4.3 Auth inside Option A

- **Keep** Supabase email and password with the `user_roles` check. It is already enforced by row-level security, which is the part that matters.
- **Add** multi-factor authentication if the platform exposes it (availability on Lovable Cloud is **Unknown**), and keep admin accounts to the few people who work bids.
- **Not available:** server-level basic authentication. The host ignores the repo's `_headers` file (F-32), so a host-level password gate cannot be assumed.

---

## 5. Target design [RECOMMENDATION]

This is a design, not a migration or code. Names are proposals.

### 5.1 Data model: one table, `inquiries`

| Column | Type | Rules | Notes |
|---|---|---|---|
| `id` | uuid, primary key | default generated | |
| `created_at`, `updated_at` | timestamptz | default now() | The helper `update_updated_at_column()` already exists (baseline `:942`, used at `:3286`) |
| `inquiry_type` | text | NOT NULL, CHECK in (`estimate`, `bid_invitation`) | |
| `status` | text | NOT NULL, default `new`, CHECK in (`new`, `reviewing`, `bidding`, `submitted`, `won`, `declined`) | The CHECK is the fix for F-42 on the new table |
| `status_changed_at` | timestamptz | set by trigger when status changes | Lets "Won" and "Declined" sort by when they closed |
| `contact_name` | text | NOT NULL, 1 to 200 characters | Accept accents and punctuation (F-24) |
| `email` | text | NOT NULL, format and length checks | |
| `phone` | text | NOT NULL for bids; decision for estimates | |
| `company` | text | Required for bids (the GC or consultant); optional for estimates (condo corporation or management firm) | One column rather than `gc_company` plus `company`; the form labels it by type |
| `requester_role` | text | CHECK in owner, property manager, condo board, developer, GC, CM, consultant, other | Extends the vocabulary already in `quote_requests_role_check` (baseline `:239`) |
| `project_name` | text | Required for bids | Property name for estimates |
| `project_location` | text | Required, up to 500 characters | Address for estimates; city or address for bids |
| `bid_due_at` | timestamptz | CHECK: required when `inquiry_type` is `bid_invitation` | Entered and shown in America/Toronto |
| `drawings_url` | text | Optional, https only, up to 2,000 characters | Also used as "photos link" on estimates |
| `message` | text | Required for estimates, optional for bids; up to 5,000 characters | The problem description, or the scope and trades to price |
| `urgency` | text | Optional CHECK: emergency, this month, planning | Estimate only |
| `prequal_requested` | boolean | default false | Bid only; answers the GC page's prequal prompt (F-09) |
| `admin_notes` | text | | |
| `source_path`, `utm` | text, jsonb | optional | The estimate wizard already captures UTM values (`Estimate.tsx:98-104`) |
| `consent_given`, `consent_at`, `consent_text_version` | boolean, timestamptz, text | `consent_at` set by the server only when consent is true | Fixes the pattern in F-26 |
| `alert_sent_at`, `alert_error`, `alert_attempts` | timestamptz, text, int | | Makes a failed alert visible and retryable |

Indexes: (`status`, `bid_due_at`) and (`created_at` descending).

Triggers: `updated_at`; `status_changed_at`; and a `notify_new_inquiry` trigger that calls the existing `notify_admins` function. **Order matters in the migration:** `admin_notifications.notification_type` has a CHECK that does not allow a new type (baseline `:1034`). If the trigger is created before that CHECK is widened, the failed notification would roll back the inquiry insert itself. Widen the CHECK first, or reuse an existing type.

Access (pattern from `drizzle/migrations/0001_…sql:1-20`): row-level security on; **no insert policy for anonymous or authenticated users**, so the only way in is `submit-form` with the service role (this also closes the direct-insert route described in F-14); select and update for `is_admin(auth.uid())`; delete for super admins only (`has_role(auth.uid(), 'super_admin')` is already used in `20251117210811_*.sql`); revoke anonymous grants. Add the table to the realtime publication only if live refresh is wanted (state of the existing tables is Unknown).

### 5.2 Statuses and the sort rule

| Status (label) | Meaning | Group |
|---|---|---|
| `new` (New) | Arrived; nobody has opened it | Needs action |
| `reviewing` (Reviewing) | An estimator is reading the drawings or scope and deciding whether to price it | Needs action |
| `bidding` (Bidding) | Decided to price it; estimate in preparation (the screen can read "Estimating" for the estimate type) | Needs action |
| `submitted` (Submitted) | Price or proposal sent; waiting | Waiting |
| `won` (Won) | Awarded to Ascent | Closed |
| `declined` (Declined) | See decision 2 in section 9: declined by Ascent, or by the client? | Closed |

**Order of the list.**

1. *Needs action* rows first, by `bid_due_at` ascending, rows without a date last, then newest first. Estimates have no due date, so they follow the dated bids by received time.
2. *Waiting* rows next, by `bid_due_at` descending.
3. *Closed* rows last, by `status_changed_at` descending, collapsed by default.

**Cues.** Show the due time as a relative and an absolute value ("in 1 d 4 h, Thu 2:00 pm"). Mark a bid red when it is due within 48 hours and "overdue" when it is past due and still New or Reviewing. Time zone: store `timestamptz`, show America/Toronto to every viewer. Do the ordering in the query, not in the browser (friction F3 in section 3).

### 5.3 Public forms

One form component with a two-card picker. The type is pre-selected from the link (`/contact?type=bid` or `?type=estimate`), so a GC arriving from the GC page never sees the wrong form. Keep the company phone number visible beside the form for emergencies (F-17).

| | **Request an estimate** (owners, property managers, boards) | **Invite us to bid** (GCs, CMs, consultants) |
|---|---|---|
| Required | Name, email, phone, "I am a…" (role), property name or address, what is happening | Company, name, email, phone, project name, project location, bid due date **and time** |
| Optional | Urgency (leak now, this month, planning), link to photos | Drawings or ITB link, scope or trades to price, "send me your prequalification package" |
| Count | 8 fields | 10 fields |
| Shared | Honeypot, started-at timestamp (existing), consent checkbox, CAPTCHA token | same |

Confirmation screen: one response promise, the same one used site-wide (F-21).

Entry points to change: the GC page CTAs (`ForGeneralContractors.tsx:324,335`, F-09), the property-manager and service pages whose button points at `/contact` or `/estimate`, the header "Get an estimate" action, and the homepage CTA (F-15).

`/submit-rfp` can stay for now as the long-form tender intake; decide later whether to redirect it (decision 5).

### 5.4 Server flow, including the alert

1. Browser posts to `submit-form` with a new `formType` of `inquiry` (today's four types stay as they are).
2. Existing controls run first: rate limit, honeypot, time gate, repeat-content check.
3. **Link filter changes:** run it on `message` only. Validate `drawings_url` on its own: parseable URL, `https` only, no embedded credentials, no IP-address or `localhost` host, at most 2,000 characters.
4. Validate with a per-type Zod schema (a discriminated union) kept in `supabase/functions/_shared/`; the browser form mirrors it.
5. Verify the CAPTCHA token server-side.
6. Insert with the service role. Set `consent_at` only when consent is true.
7. **Send the alert in the same function**, awaited with a short timeout and wrapped in try/catch, with an idempotency key of `inquiry-alert-<id>` (the pattern at `send-rfp-emails/index.ts:134,158`). Write `alert_sent_at`, or `alert_error` and an incremented `alert_attempts`.
8. **A failed alert never fails the visitor's request.** The row is saved and the visitor sees the confirmation. Staff see a red "alert failed" mark and a "Resend alert" button, and the database trigger has already created the in-app bell notification, which is an independent second channel.
9. Return the new id; show a reference number to the visitor (the RFP flow already builds one, `send-rfp-emails/index.ts:117`).

**Alert content.** Subject examples: `BID due Oct 14, 2:00 pm — <project> — <GC company>` and `Estimate — <property> — <role>`. Body: every submitted field, escaped; a link to the inbox row on the canonical `www` host; reply-to set to the submitter (the existing functions already do this). Recipients come from a function secret (name suggested: `INQUIRY_ALERT_TO`) rather than a hard-coded address, with **at least two recipients**: one role mailbox and one person.

**Visitor confirmation email:** optional and off in version one. It adds a second message to deliver and a second place to fail (decision 4).

### 5.5 Admin screen

Add a first tab, "Bids & estimates", to `UnifiedInbox`, built as its own components rather than by bending the generic `InboxTable` (friction F4). Keep the legacy tabs for history.

- **List columns:** type badge; project or property; company; contact; bid due (relative and absolute); status (inline select, six values); received; alert state.
- **Filters:** open or all, type, text search.
- **Detail dialog:** every field; the drawings link shown with its host name and opened in a new tab with `rel="noopener noreferrer"`; notes; status; mailto and tel links; "Resend alert".
- **Counts:** bids due within 7 days and overdue bids on the dashboard; the sidebar badge counts `new` rows in the new table.
- **Delete:** super admins only, or archive instead of delete.

### 5.6 Access control summary

Supabase login with MFA if available; admin accounts limited to named people; row-level security as the real gate; `noindex` on `/tekev` and `/admin`, and remove them from `robots.txt` (F-30). Verify the live policy set before launch (Unknown today).

---

## 6. Files to change or create [RECOMMENDATION]

**Create**

| Path | Purpose |
|---|---|
| `supabase/migrations/<timestamp>_create_inquiries.sql` | Table, CHECKs, indexes, RLS, grants, triggers, widened `admin_notifications` CHECK. Where it must live depends on Step 0 |
| `supabase/functions/_shared/inquiry.ts` | Zod schemas, URL validator, alert builder. Deno cannot import from `src/`, so the browser form mirrors it |
| `supabase/functions/_shared/transactional-email-templates/inquiry-alert.tsx` and a line in `registry.ts` | The alert template, if the Lovable stack is chosen |
| `src/components/forms/InquiryForm.tsx` (and a type picker) | The public form |
| `src/lib/inquiry.ts` | Status slugs and labels, role list, due-date and sort helpers (pure functions, easy to test) |
| `src/components/admin/inbox/InquiriesTable.tsx`, `InquiryDetailDialog.tsx` | The new admin list and dialog |
| `src/lib/__tests__/inquiry.test.ts` and a Deno test for the function | Sort order, overdue logic, URL validation, schema rules, alert failure path |
| `.env.example` and `docs/inquiries.md` | Variable names only; a one-page runbook (who gets alerts, how to resend, where to look when mail fails) |

**Modify**

| Path and place | Change |
|---|---|
| `supabase/functions/submit-form/index.ts` `:58`, `:99`, `:134`, `:176` | Add the `inquiry` type to the union and allow-list; scope the link filter to `message`; add the switch case, CAPTCHA check and alert call |
| `src/pages/Contact.tsx:71-110` | Replace the single form with `InquiryForm`; delete the browser-triggered `send-contact-notification` call at `:103` |
| `src/pages/ForGeneralContractors.tsx:324,335` and the property-manager and service pages | Deep-link CTAs to the right form type |
| `src/pages/Estimate.tsx:292-345`, `src/components/estimator/QuoteRequestDialog.tsx:69-81` | Send through `submit-form` and stop the double write; remove the browser-triggered email calls |
| `src/pages/admin/UnifiedInbox.tsx:10,15` | Add the tab; define the tab list once |
| `src/components/admin/inbox/InboxDashboard.tsx:15-31`, `src/components/admin/UnifiedSidebar.tsx:56,278`, `src/components/admin/NotificationBellInbox.tsx`, `src/components/admin/GlobalSearchDialog.tsx:100` | Counts, badge, notification type and search hook-up |
| `supabase/functions/_shared/transactional-email-templates/send-email.ts:10` | Replace "AscentGroupWebsiteV1 47" with the company name (F-29) |
| Six `send-*` functions (12 `from:` lines, F-06) | Only if Resend stays; otherwise retire them |
| `public/robots.txt:88-90`; admin layout and `src/pages/Auth.tsx` | `noindex`; stop advertising the login path |
| `src/integrations/supabase/types.ts` | Generated file: regenerate after the migration, do not hand-edit |
| Later: `send-contact-notification`, `send-estimate-confirmation`, `send-quote-confirmation` | Retire once nothing calls them (F-12). They are callable with the public key today |
| `supabase/config.toml` | No change if the alert stays inside `submit-form` (recommended) |

---

## 7. Risks [FACT where marked, otherwise RECOMMENDATION]

| # | Risk | Why it applies here | Mitigation |
|---|---|---|---|
| R1 | **Spam and junk bid invitations** | **Fact:** public endpoint, no CAPTCHA, only honeypot, 2-second gate and rate limit (`submit-form/index.ts:105-125`). The new form must accept a URL, so the link filter has to be loosened for one field | Cloudflare Turnstile or similar, verified server-side (terms and cost: check the vendor); keep honeypot and gate; limit per email as well as per client; validate the URL strictly; store flags; show unknown senders clearly in the list |
| R2 | **Malicious or phishing links in `drawings_url`** | Estimators will click links sent by strangers | Show the host name prominently; open with `noopener noreferrer`; never fetch, preview or embed the URL on the server (avoids server-side request forgery); block non-https and IP or localhost hosts; optionally mark well-known bid and file-sharing hosts as recognised and everything else as "unrecognised link" (the list is the estimators' call) |
| R3 | **Uploads**, if the new forms ever accept files | **Fact:** `rfp-attachments` is private, but the upload policy checks file extension only and a size value whose enforcement is Unknown (`20260610193847_*.sql:20-33`); files are uploaded before the row exists and a failed upload is skipped silently (`SubmitRFPNew.tsx:121-135`, F-10), so orphans are possible; admins have no screen to open them (F-11) | Version one is link-only, which matches the brief. If uploads are added: create the row first, upload through a signed upload URL issued by the function, set a bucket size limit, open files from the admin through short-lived signed URLs (the pattern at `documentUrl.ts:26`), and add an orphan cleanup |
| R4 | **Secrets** | **Fact:** functions already need `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `LOVABLE_API_KEY`, `LOVABLE_SEND_URL`. `.env` is committed and not git-ignored (F-47) | New names to add as function secrets: `TURNSTILE_SECRET_KEY` and `INQUIRY_ALERT_TO` (suggested). Only a public CAPTCHA site key may be a `VITE_` variable. Add `.env` to `.gitignore` and ship `.env.example` with names only. Do not log request bodies |
| R5 | **Admin route exposure** | **Fact:** login path listed in `robots.txt:90`; no MFA or CAPTCHA found; lockout is per email and IP (`check-login-attempt/index.ts:43`); the page guard is client-side (`UnifiedAdminLayout.tsx:95-97`). One stolen estimator password would expose every bid and contact | MFA if available; `noindex`; remove the paths from `robots.txt`; few admin accounts; review who can invite users (`invite-user`); verify live RLS from `pg_policies`; decide on the `mcp` function's reach |
| R6 | **Email deliverability** | **Fact:** `onboarding@resend.dev` is Resend's shared test sender (F-06); the RFP sender name is wrong (F-29). **Unknown:** verified domain, SPF, DKIM, DMARC | Step 1. Verify the domain; test to Gmail, Outlook and the real mailbox and read the authentication headers; send plain-text plus HTML; use a second recipient and the in-app bell as fallbacks; monitor `email_send_log`; start DMARC at monitoring and tighten later |
| R7 | **A failed alert nobody sees** | **Fact:** existing functions ignore the send result (report 1C.5) | `alert_error`, a visible badge, "Resend alert", an idempotency key so a retry cannot double-send |
| R8 | **Wrong or ambiguous due dates** | Bid closings have a time, and the Toronto time zone changes with daylight saving | Store `timestamptz`, ask for date and time, interpret as America/Toronto, warn (do not block) on past dates or dates over a year out |
| R9 | **Notification trigger breaks inserts** | **Fact:** the CHECK on `admin_notifications.notification_type` (baseline `:1034`) lists six types | Widen the CHECK before creating the trigger, in the same migration (section 5.1) |
| R10 | **Hard delete of a live bid** | **Fact:** any admin can delete a row from the dialog (`InboxDetailDialog.tsx:70-80`) | Super-admin-only delete or an `archived_at` column |
| R11 | **Personal data and consent (Canada)** | **Fact:** names, emails, phones and project details are stored; the RFP path writes a consent time without reading the checkbox (F-26); IP addresses are stored in existing tables. Retention period: Unknown (no scheduled deletion in the migrations or functions read) | Record consent only when given; decide a retention period; confirm CASL and PIPEDA obligations with counsel. This is not legal advice |
| R12 | **No automated tests on these paths** | **Fact:** one test file in the repo (`src/pages/admin/seo/__tests__/scoring.test.ts`); CI cannot install dependencies (F-34) | Tests ship with Steps 3 and 4; test against a non-production Supabase project only |
| R13 | **Live updates may not arrive** | Realtime publication state Unknown (section 1.3) | Refetch on an interval as a fallback |
| R14 | **The admin link in the alert may hit a redirect or a wrong host** | **Fact:** `rfp-internal-notification.tsx:17` uses the bare domain; apex-to-www behaviour is Unknown (F-32) | Build the link from the canonical host |

---

## 8. Build order [RECOMMENDATION]

Every step can ship on its own and can be undone. Effort uses the same scale as `02-FINDINGS.md`: **S** under a day, **M** a few days, **L** a week or more. Test against a non-production Supabase project (a branch or a copy), never against production data.

| Step | What | Done when | Undo | Effort |
|---|---|---|---|---|
| 0 | **Decide and verify (no code).** Which sender domain is verified and where; how migrations reach the live database; `pg_policies` for the three tables and `storage.objects`; confirm `email_send_log` exists; who gets alerts; answers to section 9 | A one-page decision record exists and every Unknown in section 10 marked "Step 0" has an answer | n/a | S |
| 1 | **Make email trustworthy.** Verified sender, one stack, site name fixed (F-06, F-29) | A test message from the function reaches Gmail, Outlook and the real mailbox with authentication passing, from the company's own domain | Revert the sender setting | S to M |
| 2 | **Migration: `inquiries`** with CHECKs, indexes, RLS, grants, triggers, widened notification CHECK | On the test database: anonymous insert and select are denied; an admin can select and update; a bad status or type is rejected; a bid without a due time is rejected; the notification trigger works | Drop the new table | S to M |
| 3 | **`submit-form` inquiry branch**, shared schema, server-side alert, tests | A valid payload gives one row, one email and `alert_sent_at`; a failed email keeps the row, sets `alert_error` and the visitor still sees success; a bad URL is rejected; a repeat does not double-send | Remove the new `case` | M |
| 4 | **Admin list, read-only,** with the section 5.2 order and due-date cues | Seeded test rows sort exactly as specified | Hide the tab | M |
| 5 | **Status and notes editing,** "Resend alert", alert-failed mark, dashboard counts, badge, bell | Six statuses save; the database refuses anything else; a forced alert failure shows in the list and "Resend" succeeds | Disable the controls | S to M |
| 6 | **Public form behind a switch** (for example `/contact?form=v2`), with the role field and a fixed name rule (F-24, F-25) | Internal test submissions of both types reach the inbox and the mailbox; mobile layout checked at 390 px | Remove the switch | M |
| 7 | **CAPTCHA, URL hardening, admin hardening** (MFA if available, `noindex`, `robots.txt`, F-30) | Scripted junk is rejected on the test project; `/tekev` is no longer listed | Disable the CAPTCHA check | S to M |
| 8 | **Switch over.** GC and property-manager CTAs deep-link to the right type (F-09); Estimate and Quote dialog go through the endpoint (ends the double write, F-14); old contact form retired | A week of real traffic with every submission present in the inbox and every alert received | Re-point the CTAs | S to M |
| 9 | **Clean up.** Retire the browser-triggered email functions (F-12, F-13); make legacy tabs read-only; fix F-11 and F-42 only if the legacy tabs stay | Nothing calls the retired functions | Re-deploy the old functions | S |
| 10 | **Optional.** Backfill old `rfp_submissions`; a morning digest of bids due within 7 days; a visitor confirmation email | Owner's call | n/a | S to M each |

---

## 9. Decisions only you can make

1. **Alert recipients.** Which mailboxes, and who is the second person so one mailbox failing cannot lose a bid?
2. **What does "Declined" mean?** Ascent chose not to bid, or the client chose someone else? Splitting it into two statuses is cheap now and awkward later.
3. **Does a bid due date include a time?** Recommended: yes.
4. **Confirmation emails.** Should owners, GCs or both get an automatic reply, or only the on-screen confirmation?
5. **`/submit-rfp`.** Keep the long form alongside the short "Invite us to bid" form, or redirect it later?
6. **Files.** Link-only for version one (recommended), or also uploads?
7. **Admin accounts.** Which named people, and is multi-factor authentication mandatory?
8. **Retention.** How long to keep declined and spam rows, and who may delete?
9. **Field set.** Is a phone number required from owners and property managers? Keep the urgency field?
10. **Where it lives.** A tab in `/admin/inbox` (recommended) or its own admin page?
11. **MCP exposure.** Should the new table be readable through the `mcp` function, or not?
12. **Option A or B**, after seeing the vendor price if B is considered.

---

## 10. Unknowns and how to answer them (without changing anything)

| Unknown | Step | How to answer |
|---|---|---|
| Is the sending domain verified, and in which service (Resend or Lovable email)? | 0 | Resend → Domains and Logs; the Lovable email settings; read the headers of one real alert |
| SPF, DKIM and DMARC records for the domain | 0 | `dig TXT` on the domain, its `notify.` subdomain and `_dmarc.`, or an online DNS checker |
| How do migrations reach the live database (Lovable publish, GitHub, manual)? Is `drizzle/` applied? | 0 | Ask whoever publishes the site; compare `supabase_migrations.schema_migrations` with `supabase/migrations/` and `drizzle/migrations/` |
| Effective RLS on `rfp_submissions`, `contact_submissions`, `quote_requests`, `storage.objects` | 0 | `select * from pg_policies where schemaname in ('public','storage')` |
| Does `email_send_log` exist with the columns shown in `types.ts:917`? | 0 | `select column_name from information_schema.columns where table_name = 'email_send_log'` |
| Are the existing tables in the realtime publication? | 4 | `select * from pg_publication_tables where pubname = 'supabase_realtime'` |
| Does MFA exist on this Supabase project? | 7 | Supabase dashboard → Authentication settings, or ask Lovable support |
| What is the maximum rows per request on this project? | 4 | Supabase dashboard → API settings (`max_rows`) |
| Does saving a note on an estimate request fail (F-42)? | 5 | Read-only: `select column_name from information_schema.columns where table_name = 'quote_requests'`; or try it once in the admin and delete the test row |
| Do the existing alert emails reach anyone today? | 1 | Ask the team to forward the last alert they received; check the Resend or Lovable send log |
| How do estimators open RFP drawings today? | 4 | Ask them |
| Does the bare domain redirect to `www`? | 3 | `curl -I http://ascentgroupconstruction.com` |
| Retention requirements for inquiry data | 8 | Counsel and the company's privacy policy |

---

## 11. What I deliberately did not do

I did not run or write any migration, call any production API, submit any form, send any email, look up DNS records, or read from or write to a database. Statements about live behaviour that depend on those are marked **Unknown** with the way to answer them. The expected failure when saving a note on an estimate request (F-42) is inferred from the schema and the dialog code; I did not execute it.

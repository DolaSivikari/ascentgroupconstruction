# 06. Questionnaire for Lovable AI (and for the owner)

Built from the full read-only audit (`01` to `05`, 50 findings, F-01 to F-50). Its job is to turn every "Unknown" into a verified fact so the fix plan can be ordered by what is true on the live site, not by what the code suggests.

## How to use this file

1. Paste **the Preamble** first, then one **Part** at a time (Parts 1 to 9 are for Lovable; Part 10 is for you, Hebun, because Lovable cannot know it).
2. If a Part is too long for one message, paste it in halves at the question boundaries.
3. Priority tags: **P1** = answer first, it changes what gets fixed first. **P2** = needed before building. **P3** = nice to have.
4. When Lovable answers, paste its replies back to Claude. Each reply should use the answer format in the Preamble.

---

## PREAMBLE (paste this first, every time you start a new chat)

```
I am running an external, read-only review of this project with another AI (Claude). It found 50 issues in the repository and several things it could not confirm from the code alone. I need you to confirm them against the LIVE project and the LIVE database.

RULES FOR THIS CONVERSATION
- Read-only. Do NOT edit code, create files, run migrations, change settings, deploy edge functions, or click Publish. Do not "fix" anything you find. Just report.
- Answer every question with real evidence: a query result, a file path with line numbers, a setting you can see in Lovable or Cloud, or a log entry. Do not answer from memory of past chats or from what the code "should" do.
- If you cannot check something (for example you have no database query tool), say "CANNOT CHECK" and tell me exactly where I can look in the Lovable or Cloud interface (menu path) or what I should run.
- Never print secret values (API keys, tokens, passwords, service-role keys, .env contents). For secrets, answer only "set" or "not set", and give the NAME.
- Never paste personal data from submissions (names, emails, phone numbers, message text). For database questions give counts, column names, statuses and dates only.
- If a question is wrong or based on a wrong assumption, say so and explain.

ANSWER FORMAT (one block per question, in order)
Q-ID: <id>
Answer: <short, direct>
Evidence: <query + result, or file:line, or UI path>
Confidence: VERIFIED (I saw it) / INFERRED (I reasoned from code) / CANNOT CHECK
Notes: <anything surprising, optional>

If a question has several parts, answer each part (a, b, c).
```

---

# PART 1. Live hosting and what visitors actually receive

Context: the audit found no server-side rendering, a Netlify-style `public/_redirects` and `public/_headers` that may do nothing on Lovable hosting, an unknown 404 behaviour, and a service worker that is both purged and registered.

**H1 (P1).** What HTTP status and body does the live production site (`https://www.ascentgroupconstruction.com`) return for an unknown path such as `/zzz-does-not-exist`? Is it 200 with the app shell, a real 404, or a redirect? Show the status line.

**H2 (P1).** Same question for deep links that exist in the app, for example `/about` and `/services/cladding-systems`: status code, and is the body the same index.html shell as `/`? Does the response change at all before JavaScript runs (title, description, canonical)?

**H3 (P1).** Does `https://ascentgroupconstruction.com` (no www) return a 301 to `https://www.ascentgroupconstruction.com`? Show the status and the `Location` header. Does `http://` redirect to `https://`?

**H4 (P1).** Which response headers does the production site actually send on the home page? List them all by name and value (no secrets involved). In particular: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cache-Control` on `/` and on a hashed file under `/assets/`.

**H5 (P1).** The repo contains `public/_redirects` and `public/_headers` (Netlify format). Does Lovable hosting read either file? Is there any documented, supported way on Lovable hosting to (a) set custom response headers, (b) define server-side redirects, (c) return a real 404 for unknown routes? If yes, how, and is it available on the current plan?

**H6 (P2).** The 68 legacy URL redirects exist only as React Router `<Navigate>` routes. Are old URLs (for example `/services/building-envelope`) answered with a client-side redirect only (HTTP 200 plus JavaScript) on the live host? Is a true 301 possible?

**H7 (P2).** `public/sitemap.xml` and `public/robots.txt`: are these the files served at `/sitemap.xml` and `/robots.txt` on production, or does something generate them? When were they last changed on the live site (check the response `Last-Modified` or `ETag` if present)? Does the live sitemap contain 49 `<url>` entries?

**H8 (P2).** Does the live site serve `/llms.txt`? Show the first five lines (this is public content, not a secret).

**H9 (P2).** Service worker: `index.html` contains code that unregisters service workers and clears caches, while `src/main.tsx` registers `public/service-worker.js` in production. On the live site, is a service worker registered after a fresh visit and after a second visit? What does it cache? (Use the browser's Application panel or ask your preview tool.) Has a stale-cache problem ever been reported after a publish?

**H10 (P2).** Prerendering and SEO rendering. Search engines currently get the same HTML shell for every URL. Does Lovable hosting support any of: (a) server-side rendering, (b) static prerendering of routes at build time, (c) a dynamic-rendering service for bots, (d) a supported Vite prerender plugin that runs inside the Lovable build? Name what is supported today, and what would break (for example the hero video logic) if we added it.

**H11 (P3).** What is the Lovable hosting limit for custom domains, bandwidth, and file size on the current plan? Is the project on a paid plan that includes the custom domain "connect mode"?

**H12 (P3).** Is there a CDN image optimiser in front of the site? The audit found large JPEG hero files (see Part 6). Are images resized or converted to WebP/AVIF at the edge, or served as uploaded?

---

# PART 2. Email, lead alerts, and form delivery

Context: the audit found that every notification email in `supabase/functions/send-*` is sent from Resend's shared testing sender `onboarding@resend.dev` and never checks whether the send succeeded; that the contact, estimate and quote alerts depend on the visitor's browser making a second call after the database insert; that the contact-notification function can be called with the public key and mails any address supplied; and that some emails are sent under the site name "AscentGroupWebsiteV1 47" from a `notify.www.` domain. Lovable's own answer says two email stacks exist (Resend, and `@lovable.dev/email-js` / Lovable email infrastructure).

**E1 (P1).** List every edge function in `supabase/functions/` that sends email. For each one give: name; which email provider it calls (Resend or Lovable email); the `from:` address or domain it uses; who the recipient is (fixed address, address from the request, or looked up from the database); and whether it checks the provider's response for an error.

**E2 (P1).** Is a sending domain verified for each provider? Give status per provider and per domain (`ascentgroupconstruction.com`, `www.ascentgroupconstruction.com`, `notify.www.ascentgroupconstruction.com` or any other): Verified / Pending / Failed / Not added, with SPF, DKIM and DMARC status if the UI shows it. Menu path where you saw it.

**E3 (P1).** Are the following secrets present in the project's backend secrets? Answer set / not set only: `RESEND_API_KEY`, `LOVABLE_API_KEY`, and any other secret whose name contains EMAIL, SMTP, MAIL, RESEND, SENDGRID, TWILIO or SLACK. List the NAMES of all backend secrets.

**E4 (P1).** Look at recent email delivery logs. For the last 30 days: how many emails were attempted, how many delivered, how many bounced, failed or were rejected, and what are the top failure reasons (for example "domain not verified", "can only send to your own address")? Is there an `email_send_log` or similar table, and what does it contain (columns and counts only)?

**E5 (P1).** In the last 90 days, how many rows were created in `contact_submissions`, `rfp_submissions`, `quote_requests`, `prequalification_downloads`, `newsletter_subscribers` and the careers/resume table? Give counts per table and per month. Do not show any submitter details.

**E6 (P1).** For those same submissions, how many have a matching sent email in the email log? In other words: how many leads did the database receive without a corresponding successful alert? Describe how you matched them.

**E7 (P1).** Who actually receives the alert emails today? Give the recipient addresses used by `send-contact-notification`, `send-rfp-emails`, `send-admin-notification` and the estimate/quote functions (these are business addresses in code, not secrets). Are any of them read from the `site_settings` table or from environment variables? Do the addresses `info@`, `projects@`, `estimating@`, `careers@` and `rfp@` at ascentgroupconstruction.com appear in code, and which ones does the DNS/email host say exist? (If you cannot see the mailbox host, say so.)

**E8 (P1).** Is `send-contact-notification` publicly callable? Check `supabase/config.toml` for `verify_jwt` on every function and list each function with its `verify_jwt` value. For `send-contact-notification`, `send-estimate-confirmation`, `send-quote-confirmation` and any similar function, say whether an unauthenticated caller holding only the public (anon) key can trigger an email to an arbitrary address.

**E9 (P1).** The browser-triggered second call: in `src/pages/Contact.tsx:103`, `src/pages/Estimate.tsx:342` and `src/components/estimator/QuoteRequestDialog.tsx:81`, confirm that the notification email is sent only when the visitor's browser makes a second request after the insert. Are there any database triggers or webhooks (pg_net, `supabase_functions.http_request`, Database Webhooks) on `contact_submissions`, `rfp_submissions` or `quote_requests` that call an edge function or send mail? List triggers on these tables with their function names.

**E10 (P2).** `send-rfp-emails` and `handle-email-events`: which of these is currently deployed and which Lovable email stack do they use? Has `send-rfp-emails` been deployed to production since the code changed (Lovable said "recently refactored and awaiting live verification")? When was each email function last deployed (date)?

**E11 (P2).** Site name and sender identity: `supabase/functions/_shared/transactional-email-templates/send-email.ts:10,13,16` uses the site name "AscentGroupWebsiteV1 47" and `noreply@www.ascentgroupconstruction.com`. Is that what recipients actually see in the From field? Show a real recent sent record (sender name and address only) if the log has it.

**E12 (P2).** Is there a reply-to address on outgoing customer confirmation emails, and does it go to a monitored mailbox?

**E13 (P2).** What happens if the email provider returns an error? Is the error stored anywhere (a table, a log) so someone could notice? Is there any retry or dead-letter mechanism? Describe what exists today.

**E14 (P2).** Bounce and complaint handling: what does `handle-email-events` do on a bounce or spam complaint? Is there a suppression list table? Does the unsubscribe flow (`/unsubscribe`, `/email-unsubscribe`) work end to end and write to a table?

**E15 (P2).** Rate limiting: the contact function's per-IP limit "fails open" at `send-contact-notification/index.ts:103-106`. Confirm. What is the actual limit and where is it stored (table or in memory)? What happens on a cold start?

**E16 (P2).** `submit-form`: which form types go through it today (contact, RFP, prequalification, careers)? Confirm which forms bypass it and insert directly with the public key: the estimate wizard (`Estimate.tsx:292,312`), the quote dialog (`QuoteRequestDialog.tsx:69`), the newsletter forms (`NewsletterSection.tsx:34`, `NewsletterBackend.tsx:36`). Any others?

**E17 (P2).** End-to-end proof. In the PREVIEW environment only (never on the live site), can you submit one test contact form, one test RFP, and one test estimate, using a clearly fake address such as `test+audit@example.com` for the submitter, and then report for each: was a row written, was an alert sent, to whom, from which address, and what did the provider log say? If you cannot run this safely, say so. Do not submit anything on the live site.

**E18 (P3).** Is SMS/Slack/Teams/Zapier notification wired anywhere (any function or table that calls an outside webhook)? List names only.

---

# PART 3. Database, row-level security, storage and triggers

Context: Lovable said the schema lives in two places (`supabase/migrations/` with 33 files, and `drizzle/migrations/` with 3), that Git pushes do not apply migrations, and that the live security policies are "hardened" in migrations that may or may not be applied. The audit could not read the live policies.

**D1 (P1).** List every migration the live database has actually applied, in order, with timestamp and name (the migrations/schema_migrations history). Then list which files in `supabase/migrations/` and `drizzle/migrations/` are NOT in that applied list. Specifically: are `202611020002_fix_security_definer_functions.sql` and the three `drizzle/migrations/000x_*.sql` files applied?

**D2 (P1).** Run a read-only listing of all row-level security policies in the `public` schema (table, policy name, command, roles, USING and WITH CHECK expressions). Report results for: `contact_submissions`, `rfp_submissions`, `quote_requests`, `prequalification_downloads`, `newsletter_subscribers`, `resumes` (or the careers table), `projects`, `services`, `blog_posts`, `documents_library`, `site_settings`, `contact_page_settings`, `about_page_settings`, `testimonials`, `user_roles`, `profiles`, `admin_notifications`, plus any table not on this list that allows anonymous INSERT or SELECT.

**D3 (P1).** Which tables allow the `anon` role to INSERT, and which `WITH CHECK` clauses do they use? The audit found `WITH CHECK (true)` on estimate/quote/newsletter inserts. Confirm or correct, per table.

**D4 (P1).** Which tables allow the `anon` role to SELECT, and with what filter? In particular: can an anonymous visitor read any column that contains personal data (emails, phone numbers, names) from any table? Check `site_settings` and `contact_page_settings` for any private column.

**D5 (P1).** `quote_requests`: give the live column list (name, type, nullable) and the live CHECK constraints (name and definition). Does it have an `admin_notes` column? What values does `quote_requests_status_check` allow? (This decides whether saving a status or note on an estimate request from the admin inbox fails.)

**D6 (P1).** Using the real inbox code path `src/components/admin/inbox/InboxDetailDialog.tsx:40-47,238-247`, would saving `{status, admin_notes}` succeed against live `quote_requests` for an existing row? If you can reason from the constraint and columns, give your answer. Do not write to the live database to test. If you can test only in preview, do so there.

**D7 (P1).** `rfp_submissions`: live column list. Confirm the columns the form writes (`scope_of_work`, `project_location`, `estimated_timeline`, `delivery_method`, `bonding_required`, `plans_available`, `site_visit_required`, `attachment_urls`) exist, and whether a `project_description` column exists. Is there any column for a bid due date, a drawings link, GC company name, or the submitter's role?

**D8 (P1).** Storage buckets: for `documents`, `documents-restricted`, `project-images`, `rfp-attachments`, list: public flag, file size limit, allowed MIME types, and every storage policy (who can insert, select, update, delete). Specifically can an anonymous visitor upload to `rfp-attachments` today, with what size and type limits? Can an anonymous visitor read anything from it?

**D9 (P1).** How many files and how many total megabytes are in each bucket? Are there files in `rfp-attachments` that are not referenced by any `rfp_submissions.attachment_urls`?

**D10 (P1).** Admin roles: how many users exist in `user_roles` with role `admin`, how many with any other role, and are there users without a role? (Counts and role names only, no emails.) Which function does the RLS use for the check (`has_role`), and is it `SECURITY DEFINER` with a fixed `search_path`?

**D11 (P2).** Run the Supabase/Lovable security linter or "security scan" for the project, and report every finding with its severity (for example: policy exists but RLS disabled, function search_path mutable, leaked-password protection disabled, exposed auth users view, security-definer view). List them all.

**D12 (P2).** List all database triggers in the `public` schema (table, trigger name, timing, event, function). Explain each in one line. In particular the rate-limit trigger (10 submissions per hour per IP) and the triggers that create `admin_notifications` rows. How is the client IP obtained in the trigger, and can it be spoofed from the browser?

**D13 (P2).** List all database functions in `public` that are `SECURITY DEFINER`, with `search_path` setting and which roles hold EXECUTE. The drizzle migration says EXECUTE was restricted; confirm for the live database.

**D14 (P2).** Row counts for these tables: `projects` (published, draft, archived), `services` (published, draft), `blog_posts` (published, draft), `testimonials` (published and total), `documents_library` (total and by category), `homepage_*` / `hero_slides` tables if they exist, `services_*` helper tables, `site_settings`, `about_page_settings`, `contact_page_settings`. Counts only.

**D15 (P2).** Is there a `audit_log` / audit table? What events does it record, how many rows, since when, and who can read it? Does it capture admin edits to services, projects and settings?

**D16 (P2).** Data retention: is there any job that deletes or anonymises old submissions, resumes or uploaded files? Any `pg_cron` jobs? List them with schedules.

**D17 (P2).** Backups: when was the last export or backup taken and by whom? Is point-in-time recovery enabled on the Lovable Cloud database? Confirm the exact steps and what is NOT covered (storage files, edge function code, secrets).

**D18 (P3).** Which tables have realtime enabled, and which are published to the realtime publication? Is any table with personal data in that publication?

**D19 (P3).** Is the `types.ts` generated file (`src/integrations/supabase/types.ts`) in sync with the live schema? Name any table or column in the live database that is missing from it, or vice versa.

---

# PART 4. Admin panel behaviour

Context: the audit found the inbox badge counts only new contact submissions (not RFPs or quotes), the Service Editor has no image field, five native `confirm()` dialogs, 29 legacy redirects, and a QA page not in the menu.

**A1 (P1).** How is the sidebar "Inbox" badge number computed (`src/components/admin/UnifiedSidebar.tsx:84-90`)? Confirm it counts only `contact_submissions` where status = 'new'. Is this intentional? Does anything else (a trigger, a notification bell, a realtime channel) tell an admin that a new RFP, quote request or prequalification download arrived? Show what an admin sees today when a new RFP is submitted.

**A2 (P1).** `src/pages/admin/Dashboard.tsx:217,329-330`: the "new" total uses contact and prequalification only, and the RFP and Quote cards have `newCount: 0`. Is that a known limitation or an oversight? Do `rfp_submissions` and `quote_requests` have a `status` column with a `new` state?

**A3 (P1).** The Service Editor (`src/pages/admin/ServiceEditor.tsx`) imports `ImageUploadField` at line 10 but I find no use of it. Does the Service Editor in the live admin show any field for a hero or featured image? How does `services.featured_image` get its value today (admin UI, SQL, seed migration, AI generation)? Which `services` rows currently have it empty?

**A4 (P1).** The admin inbox cannot display the substance of a bid request (the detail dialog reads `project_description`, but the form writes `scope_of_work` and others). In the live admin, open an RFP row (if one exists, or an example in preview): what fields appear in the detail view? Can an admin open the uploaded drawings (`attachment_urls`) from the admin UI? How?

**A5 (P2).** The Inbox has seven tabs (All, RFPs, Contacts, Resumes, Prequalifications, Quote Requests, Newsletter) and there is also a separate page "Estimates & Quotes". What is the difference in data between "Quote Requests" tab and the "Estimates & Quotes" page? Where do estimate-wizard submissions appear? Can an admin set a due date, an owner/assignee, a priority, or a win/loss outcome anywhere?

**A6 (P2).** Which of the 22 admin pages are actually used? From the audit log, activity, or analytics, list the admin pages or actions with any activity in the last 90 days (counts by action type). Which pages have never been used?

**A7 (P2).** `src/pages/admin/HomepageBuilder.tsx` and `HeroSlidesManager.tsx` (504 lines): what can an admin change there? Does the homepage hero (EnhancedHero) read from the database `hero_slides` table, or from `src/data/enriched-hero-slides.ts`? If both exist, which one wins on the live site?

**A8 (P2).** Five admin screens use the browser's native `confirm()`: `DocumentsLibrary.tsx:192`, `EmailTemplates.tsx:178`, `FeaturedServicesManager.tsx:54`, `ServicesListManager.tsx:101`, `WhyChooseUsManager.tsx:146`. Your rules say to use `ConfirmDialog`. Is there any reason these were left (for example a regression when replaced)? Show how `ConfirmDialog` is used correctly in an existing screen.

**A9 (P2).** Admin redirects: five legacy admin URLs (`stats`, `redirects`, `content-versions`, `navigation`, `navigation-builder`) land on the dashboard. Were these features deliberately removed? Do any database tables from them still exist (for example `redirects`, `content_versions`, `navigation_items`)? Are they used by the public site?

**A10 (P2).** The page `/admin/qa/quick-contact-form` (`QAQuickContactForm`) is not in the sidebar. What is it for? Does it send real submissions to the live database? Is it reachable by non-admins?

**A11 (P2).** `UnifiedAdminLayout` redirects non-admins silently to `/`. What does a logged-in user who is not an admin see? Are there roles other than admin (editor, estimator, viewer) in use? Which admin pages should each role access today, per code?

**A12 (P2).** Email Templates admin page (`EmailTemplates.tsx`): which templates exist and are they used by any function, or only stored? Does editing a template change the real emails? Which function reads them?

**A13 (P2).** Settings: list every tab in the admin Settings page (`general`, `footer`, `contact`, `about`, `security`, `health`, and any others) and what each stores (table and columns). Which settings affect the public website at runtime and which are ignored? In particular: do `site_settings` phone/email/hours values appear on the public site, or do public pages read `src/constants/company.ts` only?

**A14 (P2).** Media Library: where do images uploaded here go (which bucket and path pattern)? Is there a size cap and automatic resizing/compression? How many images, total MB?

**A15 (P3).** SEO Dashboard and the `generate-seo-content` function: the audit notes it returns HTTP 402 when Lovable AI credits run out. What does the admin see in that case? Is there a non-AI fallback?

**A16 (P3).** Idle timeout and session warning: how long is the admin session, and what is the idle timeout? Is "remember me" supported?

**A17 (P3).** Mobile: is the admin panel usable on a phone (inbox, status change)? Does the sidebar collapse correctly?

**A18 (P3).** Dashboard performance: the dashboard runs 11 queries in parallel on load with `select(*, count exact)`. Is any admin page slow today? Report any known timeouts.

---

# PART 5. Page headers, images and navigation

Context: `05-HEADER-AND-ADMIN-IMPROVEMENTS.md` found that the shared `PageHero` is the only live header; that 17 city pages have no hero image, three legal pages have no hero but a transparent navbar, the service image keys do not match live slugs, six pages share one photo, and the contractor portal has a hand-built hero.

**I1 (P1).** Run `select slug, publish_state, featured_image from services order by slug;` and list the result: slug, state, and for `featured_image` one of EMPTY / a path starting with `/src/` / a Supabase storage URL / another URL (give the host only). Highlight these three: `building-envelope-solutions`, `interior-buildouts-finishing`, `interior-finishing-renovations`.

**I2 (P1).** What does each of those three live URLs show at the top: a photo, or a plain coloured block? Describe it as you see it on the production site.

**I3 (P1).** Run `select slug, publish_state, featured_image from blog_posts;`. How many published posts have an empty `featured_image` (they fall back to `/placeholder.svg`)? List their slugs.

**I4 (P1).** On the live site, at the top of the page, desktop width: what do `/privacy`, `/terms` and `/accessibility` look like? Is the navbar text and logo readable against the white page? (The audit's screenshot showed them invisible.) Does it differ between preview and live?

**I5 (P1).** Do any of the 17 `/service-areas/:city` pages have a hero image on the live site? Name three and describe what you see.

**I6 (P2).** Is the code `src/data/hero-images.ts` the only place hero images are chosen? List every other place where a hero image is chosen (Wave1ServicePage map, ContractorPortal import, PremiumProjectHero, database `hero_slides`, any `page_heroes` table). Does a `page_heroes`, `page_settings` or similar table exist?

**I7 (P2).** Which of these hero image files are in use and which are not: all 39 files in `src/assets/heroes/` and the files in `src/assets/` that start with `hero-`? List the unused ones.

**I8 (P2).** The image `hero-general-contracting.jpg` is used by six pages (`/services`, `/why-specialty-contractor`, `/capabilities`, `/our-process`, `/company/technology`, `/submit-rfp`). Is that intentional? Do you have other photos (real project photos) already uploaded in `project-images` or `src/assets` that could serve each of these pages?

**I9 (P2).** The `Navigation.tsx` `heroPageExact` and `heroPagePrefixes` rules control the transparent navbar. Why are `/privacy`, `/terms`, `/accessibility` in the list? Is there a reason a prefix such as `/resources/` and `/company/` is treated as hero pages? Which pages under those prefixes have no hero?

**I10 (P2).** `src/utils/assetResolver.ts` maps "/src/assets/..." strings. Where is it used? `ServiceDetail.tsx` ignores database `featured_image` values that start with `/src/`: why?

**I11 (P2).** The dead header components `src/components/sections/PageHero.tsx`, `src/components/PageHeader.tsx` and `src/components/ContentPageHeader.tsx` have no importers. Are they safe to delete (any dynamic import by string, any lazy route)? Also confirm the eleven unused homepage/contractor components listed in finding F-44.

**I12 (P2).** The Wave1 service pages are static routes registered before `/services/:slug`. Do these nine slugs also exist as rows in the `services` table? If yes, which version wins on the live site and is the database row therefore never shown?

**I13 (P2).** `/projects` hero (`PremiumProjectHero`): how many published projects have a featured image, and what shows if there are none? Does the page ever show a white-on-white state in production?

**I14 (P3).** Which pages does the sitemap list that return a "not found" view on the live site (soft 404)? Check all `/services/*`, `/blog/*`, `/projects/*` and `/service-areas/*` URLs in `public/sitemap.xml` and list any that do not render real content.

**I15 (P3).** Mobile navigation: describe how the mobile navbar looks on `/privacy` at the top of the page (390 px wide).

---

# PART 6. Content, trust data and what is stored in the database

Context: many claims on the site depend on rows the repository does not contain (case studies, testimonials, documents, certifications). The audit could not read them.

**C1 (P1).** `projects` table: how many published rows? For the published rows only, give counts of how many have: a featured image, before/after images, a gallery of 3 or more images, a client name, a value range, a year, a location, a scope text longer than 200 characters, any "performance" badge flags (on time, on budget, zero incidents). Counts only.

**C2 (P1).** For published `projects`, list the titles, year and location (public business content, not personal data) so I can judge whether they are real, distinct case studies. Flag any that look like placeholders, duplicates or seeded sample data (for example from a migration seed file).

**C3 (P1).** `documents_library`: list title, category, file path pattern, `is_public`, and whether the file exists in storage (file size > 0) for every row. Which of these are exposed on `/prequalification` and `/resources/contractor-portal`? Does a certificate of insurance and a WSIB clearance exist as files?

**C4 (P1).** `/documents/vendor-packet.pdf` (the "Download Vendor Packet" link in `ContractorPortal.tsx:464`): what does the live site return for that URL? Status, content type and size. Is it a real PDF or the HTML app shell?

**C5 (P1).** `about_page_settings` (and any `certifications`, `licenses`, `memberships` table): list the keys and non-personal values for certifications, licences, insurance, WSIB, COR, bonding, Sto status, memberships and "years of experience". Quote them exactly as stored.

**C6 (P1).** `site_settings`, `contact_page_settings` and `src/constants/company.ts`: list the stored values for company phone, public email, address, and business hours, and the corresponding constants in code. Do they match each other, the footer, the JSON-LD in `src/components/SEO.tsx`, and `public/llms.txt`? Is the placeholder phone `(647) 123-4567` found anywhere outside an input placeholder?

**C7 (P1).** `testimonials`: how many are published; do they include rating values; do they have a source or a named person and company? Is `aggregateRating` emitted in the JSON-LD on the live home page? Show the JSON-LD block (public).

**C8 (P2).** The certificate PDF `public/documents/Ascent_Group_Construction_-_Sto_Listing_Certificate.pdf` is a "Listed Installer Training Certificate" with training dates for six modules. Where did the site copy that says "factory-certified", "Sto Assured Performance Warranty on every installation" and "Modules SCL-001 through SCL-010" come from? Was it written by AI from a prompt, or supplied by the owner? Is there any other Sto document, email or listing evidence stored in the project?

**C9 (P2).** Which statements on the site were written by the owner and which were generated by the AI for placeholder purposes? Specifically, where did these come from: "15+ years", "85% self-performed", "10 skilled crew", "$2M CGL", "WSIB registered / in progress", "COR-ready", "bonding being established", "active on DataBid and ConstructConnect", "24/7 emergency".

**C10 (P2).** Are there any other tables with business content shown on the public site that I have not listed (for example `homepage_company_overview`, `why_choose_us`, `featured_services`, `promotions`, `faqs`, `service_areas`, `partners`)? List table names and row counts.

**C11 (P2).** The 17 city pages come from the `locationDetails` object in `LocationPage.tsx`. Are all 17 text blocks distinct? Quote the per-city intro for Toronto, Hamilton and King City.

**C12 (P2).** Newsletter: how many active subscribers; when was the last newsletter sent; do subscribers have a consent timestamp and source?

**C13 (P3).** Blog: list the 6 published posts (title, slug, author, publish date, word count). Are they original, AI-assisted, or seeded?

**C14 (P3).** Careers/resumes: is the careers form live; where do resumes go (bucket and table); who can read them?

**C15 (P3).** Is a Google Business Profile linked anywhere in the code (schema `sameAs`, `hasMap`, review URLs)? List the social and directory URLs in `src/components/SEO.tsx`, the footer and `llms.txt`.

---

# PART 7. Privacy, analytics and consent

Context: "Reject Analytics" does not stop Google Analytics (loaded from `index.html` after 3 s; `gtag` undefined in the banner code). `ipapi.co` receives every first visitor's IP. Consent timestamps are written unconditionally.

**P1 (P1).** Which Google Analytics / Tag Manager IDs are in `index.html`? (Measurement IDs are public.) Is GA4 receiving live data? From GA4 Realtime or reports: is there evidence of events from visitors who clicked "Reject Analytics"? If you cannot see GA, say how I can check.

**P2 (P1).** Open the live site in a clean browser session, click "Reject Analytics", and list all third-party network requests that are made afterwards (host and path only): Google Analytics, Tag Manager, ipapi.co, Lovable analytics, fonts, any other.

**P3 (P2).** Where does `ipapi.co` get called (`src/utils/personalization.ts:54,182`, `src/pages/Index.tsx:32`) and is the result stored (localStorage key name, retention)? Is this described in the live Privacy Policy? Quote the relevant paragraph or say none.

**P4 (P2).** What data does the live Privacy Policy say is collected, retained, and shared, and with whom (list processors named: Supabase, Resend, Google, Lovable)? Is a privacy contact named? Is the policy reviewed by a lawyer? (If you only know the code text, say so.)

**P5 (P2).** Consent: for contact, RFP and newsletter forms, what does the stored consent record contain (timestamp, text version, IP, checkbox value)? Confirm that RFP `consent_timestamp` is set by the server whether or not the checkbox was ticked (`submit-form/index.ts:257`).

**P6 (P2).** CASL: do commercial emails (newsletter, review requests, follow-ups) include a physical address, unsubscribe link and sender identification? Show the footer text of the newsletter and review-request templates (public template text).

**P7 (P3).** Cookie banner: list which cookies and localStorage keys are set before and after consent on the live site.

**P8 (P3).** Is any session recording, heatmap, chat widget or advertising pixel (Meta, LinkedIn, Google Ads) installed or planned? List.

---

# PART 8. Releases, deployment, tooling and platform rules

Context: Lovable said pushes to `main` sync into the project but do not publish; migrations and edge functions are not deployed by Git; there are rules about chunking, TypeScript recursion limits, hero video, and pre-flight commands. These answers decide how the fix plan can be delivered safely.

**R1 (P1).** What is the exact state of "unpublished workspace changes" right now? List every difference between the live (published) site and the current workspace/main: code files changed, migrations pending, edge functions changed. Lovable mentioned dependency security updates and email edge functions are staged but unpublished. List them.

**R2 (P1).** When was the live site last published, by whom, and from which commit hash? Is the commit on `main` of `DolaSivikari/ascentgroupconstruction` identical to what is live? Which commit is `main` at now?

**R3 (P1).** Edge functions: for each of the 24 functions in `supabase/functions/`, state (a) deployed to the live backend yes/no, (b) date of last deployment, (c) whether the deployed code matches the repository file. Explain exactly how an edge function change in Git reaches production: automatic on sync, on Publish, or only when you deploy it. Lovable's earlier answer said "Git pushes do not deploy functions", but Lovable Cloud normally deploys functions automatically when files change inside Lovable. Resolve this contradiction: what happens when a commit that changes `supabase/functions/**` is pushed to `main` from GitHub?

**R4 (P1).** Migrations: when a new SQL file is added under `supabase/migrations/` by a commit from GitHub, what exactly happens in Lovable? (a) Nothing, (b) Lovable shows an approval prompt to run it, (c) it runs automatically. Which folder does Lovable read: `supabase/migrations/` only, or also `drizzle/migrations/`? Is the `drizzle/` folder used by anything?

**R5 (P1).** Is it safe to ask for a database change through Lovable chat with an exact SQL file I supply? Describe how that works (does Lovable show me the SQL and ask for approval?). Which kinds of changes does Lovable refuse or auto-modify?

**R6 (P1).** If I push a commit to `main` that conflicts with something done in Lovable's editor, what happens? Does Lovable overwrite, merge, or stop syncing? Are there any files Lovable regenerates or overwrites on its own (for example `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `.env`, `supabase/config.toml`, `bun.lock`, `package.json`, `vite.config.ts`, `index.html`)? List them and the rule for each.

**R7 (P1).** Does Lovable build with `bun`? What exact install and build commands does Lovable run at publish, and which Node/Bun versions? Does Lovable run lint, `tsc` or `typecheck:selected` at publish, or only the Vite build? Does a TypeScript error block publishing?

**R8 (P1).** Rules from your earlier answers: list every project rule, memory item or "knowledge" entry you follow for this project, quoted or summarised in one line each, with the title of the entry (for example `mem://design/hero-badges-system`, `mem://business/dual-market-strategy`). I need the complete list, not a selection.

**R9 (P1).** Past incidents: list every incident you know of (blank page after chunking, hero video break, TS2589 recursion, credit/402 failures, email regressions, anything else) with: what broke, which file, how it was fixed, and the rule it created.

**R10 (P2).** `vite.config.ts` and `manualChunks`: the audit found the entry bundle is 1,353 KB (306 KB gzip). You said arbitrary `manualChunks` caused a blank-page failure. Which specific chunking configuration failed? Would lazy-loading admin routes (`React.lazy`) and the chart library be acceptable, and have they already been tried?

**R11 (P2).** The CI workflows `.github/workflows/lighthouse-ci.yml` and `smoke-test.yml` run `npm ci`, which cannot work with only `bun.lock`. Does anything in Lovable ever run these workflows? Do they currently show as failing in GitHub? Is it acceptable to replace them with bun-based steps?

**R12 (P2).** `bun.lock` points to a private package mirror and installs fail outside Lovable (985 HTTP 403 errors). Can Lovable regenerate a lockfile that uses the public npm registry, or must the lockfile stay as it is? What happens if an external contributor commits a different lockfile?

**R13 (P2).** The repo contains `.env` committed with the project URL and publishable key. Is that intentional because Lovable generates it? Is it safe to add `.env` to `.gitignore`, or does Lovable require it in Git?

**R14 (P2).** The earlier answer says branches such as `codex/...` do not appear in Lovable until merged to `main`. Is there a preview of a non-`main` branch? Can Lovable build a preview from a pull request? What is the safest way to test a change before it touches `main`?

**R15 (P2).** How does rollback work in practice? (a) frontend: revert in GitHub then Publish; (b) database: exact steps; (c) edge functions; (d) storage. What is the history/version feature in Lovable and can I restore a previous published version in one click?

**R16 (P2).** Credits: what actions consume AI credits and what does not (GitHub push, Publish, edge function deploy, migration approval, Cloud queries)? What is the current credit balance or plan? Does the `generate-seo-content` function consume credits per call?

**R17 (P2).** Environments: is there one database for preview and live, or separate databases? If shared, then any test submission I make in preview hits live data. State clearly which.

**R18 (P2).** Which Lovable-specific dependencies or code could block moving off Lovable later: `@lovable.dev/mcp-js` Vite plugin, `@lovable.dev/email-js`, the Lovable AI Gateway, the `/.lovable/oauth/consent` route, `lovable-tagger`? Which are needed to build and which only to run in Lovable?

**R19 (P3).** Is a staging site possible (second Lovable project connected to a second branch)? What would it cost?

**R20 (P3).** What monitoring exists for the live site (uptime, error logging, edge function logs)? Where would I see a failing edge function, and how long are logs kept?

---

# PART 9. SEO, performance and security details (Lovable can check most of these)

**S1 (P1).** `src/components/Footer.tsx:136,156` renders two `<SEO>` elements with fixed values. On the live site, what are the `<title>` and canonical `<link>` on `/contact`, `/services/cladding-systems` and `/for-general-contractors` after the page has loaded (use the DOM, not the source HTML)? How many canonical tags are there on each? Is the footer SEO override intentional, and why was it added?

**S2 (P1).** What does Google Search Console say for the domain (if connected): number of indexed pages, pages "Crawled, currently not indexed", "Duplicate, Google chose different canonical", and "Soft 404"? The `google_search_console` tables exist but the audit says sync is not active. Is the site verified in GSC, and who owns it?

**S3 (P2).** Is the sitemap submitted to GSC, and when was it last read? Does GSC list the city pages and project pages as discovered?

**S4 (P2).** Structured data on the live home page: list every JSON-LD `@type` present and how many times (the audit saw LocalBusiness and ProfessionalService twice each). Show the live hours, phone and address in the JSON-LD.

**S5 (P2).** Performance: from PageSpeed Insights or a Lighthouse run against the live URL (mobile, throttled), report the performance score, LCP, CLS, INP/TBT and the largest requests for the home page and `/services/cladding-systems`. State the date and tool.

**S6 (P2).** What are the three largest files requested on the home page (name, bytes)? Is the hero video (565 KB) loaded on mobile? Does `prefers-reduced-motion` and data-saver mode disable it?

**S7 (P2).** Is there a robots meta `noindex` on the admin login `/tekev`, and is `/tekev` listed in `robots.txt` (line 90)? Is the admin login protected by MFA, CAPTCHA, or rate limiting? Which Auth settings are on: email confirmation, password strength/HIBP check, session length, MFA (TOTP) availability on this plan?

**S8 (P2).** Auth: is sign-up open to the public (can anyone create an account on `/tekev` or via the API)? If so, what role does a new account get, and can they read anything beyond public data?

**S9 (P2).** CORS and function exposure: for each edge function, what `Access-Control-Allow-Origin` is returned? Is any function returning data for unauthenticated callers beyond its stated purpose?

**S10 (P3).** Third-party scripts: list all external hosts the page loads (fonts, analytics, images, maps). Any that are blocked by a content-security policy or would be if one were added?

**S11 (P3).** Accessibility: any automated test (axe, Lighthouse accessibility score) results for the live home, contact and estimate pages? The accessibility statement claims WCAG conformance; what evidence exists?

**S12 (P3).** `index.html` `<noscript>` block has an H1 that differs from the real homepage H1. Is that deliberate?

---

# PART 10. For you, Hebun (Lovable cannot know these)

Please answer in plain text. "Don't know" is a valid answer; it tells us what to check.

**Business facts and claims**

**O1 (P1).** WSIB: do you hold a current WSIB clearance certificate today? Under which legal name, and what is the clearance expiry date? (Do not share the account number.) Is "registration in progress" outdated, or still true?

**O2 (P1).** Insurance: is the $2M commercial general liability policy active now? Policy period? Does it name additional insureds on request? Is there an umbrella/excess policy? Can the certificate of insurance be shared as a PDF today?

**O3 (P1).** Safety: do you hold COR (Certificate of Recognition)? If not, what exactly is true: a written health and safety program, JHSC/rep, training (Working at Heights, WHMIS, Fall Arrest, Confined space), a safety manual file? Which can you produce as a document?

**O4 (P1).** Bonding: do you have bonding capacity from a surety, a bonding letter, or none? Is the "bonding being established" wording accurate?

**O5 (P1).** Sto: what exactly did Sto Canada give you (a training certificate, a listed-installer listing, an applicator agreement)? Are you eligible to install under the Sto Assured Performance Warranty today? Do you have a letter or email confirming it?

**O6 (P1).** Company history: when was the company incorporated (month and year)? What is the legal name? Who are the principals, and what are their personal years of experience? Is the right statement "founded 2025 by a team with 15+ years of experience", or something else?

**O7 (P1).** Crew and capacity: how many full-time people on the crew? How many can be on site on a typical day? What is the largest single project value you have completed? Is "85% self-performed" accurate, and which trades are sub-contracted?

**O8 (P1).** Project evidence: how many completed projects can you document with photos and a contact who would confirm? How many of those would the client allow to be named? Do you have before/after photos you took yourselves?

**O9 (P1).** References: who are 3 to 5 clients or GCs willing to be named as references, with permission? (Give names privately to the team; do not paste them here.)

**O10 (P1).** DataBid, ConstructConnect, Buildings Show, Procore: are you actually registered and monitoring them today? Which of these claims on the site can stay?

**O11 (P1).** Emergency service: is there a real after-hours phone procedure (forwarding to a cell, an on-call person)? What response time can you honestly promise? If none, the "24/7" copy has to change.

**O12 (P1).** Response promise: what can you commit to for each audience: homeowner/property manager estimate response, GC bid invitation response, emergency call-back? One number each.

**O13 (P1).** Mailboxes: which of `info@`, `projects@`, `estimating@`, `rfp@`, `careers@`, `admin@` actually exist and who reads each one? Who should receive bid invitations on weekends?

**O14 (P1).** Who owns the accounts: Resend (if used), the domain registrar and DNS (name the provider only), Google Analytics, Google Search Console, Google Business Profile, Lovable, GitHub, Supabase/Lovable Cloud, Procore? Is everything under a company email, not a personal one?

**O15 (P2).** Hours and phone: confirm the real business hours, the public phone number, the public email address, and the postal/office address (or "service area only") that should appear everywhere.

**O16 (P2).** Brand colour: the audit's screenshots show orange buttons and accents, but the project rules list Navy #003366, Charcoal #36454F and Steel Blue #4A90A4. Is orange an approved brand accent (give the hex), or was it added by mistake?

**O17 (P2).** Photography: which of the stock-looking images (Contact page team photo, GC page, parallax band, hero poster) are real photos of your work, and which are stock? Do you have a folder of real site photos (crews, equipment, completed work) that could replace them?

**O18 (P2).** Audience priority: confirm the order the site should serve: 1) GC estimators and developers, 2) commercial property managers, 3) high-end homeowners. Which single action should the first screen push on mobile: Call, Request an estimate, or Invite us to bid?

**O19 (P2).** Bid process: what do you need to see in a bid invitation to respond quickly (bid due date, drawings link, scope, GC company, role, project location, site visit date, addenda)? Who triages and how fast?

**O20 (P2).** Estimating process: for homeowner/property manager requests, who responds, what do you ask first, and what is the typical lead value you want to filter for or against?

**O21 (P2).** Newsletter: is a newsletter needed at all? If yes, who writes it, how often, and from which address?

**O22 (P2).** Service list: which of the 22 service pages do you want to keep, merge, or retire (the nine "wave" pages and duplicates such as commercial painting and painting services)? Which three services matter most to revenue?

**O23 (P2).** City pages: do you serve all 17 cities equally? Which 4 to 6 areas matter most, and for which can you show real projects?

**O24 (P3).** Legal: have the privacy policy, terms and accessibility statement been reviewed by a lawyer? Is there a real "last updated" date you want shown?

**O25 (P3).** Budget and timing: how much time per week can you spend approving changes, and is there a deadline (bid season, a tradeshow, a GC meeting) that sets which fixes come first?

**O26 (P3).** Who else needs access: do other people (an estimator, an assistant) need an admin login with limited rights?

---

## Quick coverage map (so nothing is missed)

| Finding | Questions that settle it |
|---|---|
| F-01 footer SEO override | S1 |
| F-02, F-23, F-22 credential and claim contradictions | C5, C9, O1 to O7 |
| F-03 Sto wording | C8, O5 |
| F-04 dead certification buttons | C3, C5, O1, O2 |
| F-05 vendor packet missing | C3, C4 |
| F-06, F-12, F-13, F-29 email reliability, sender, public function | E1 to E17, O13, O14 |
| F-07, F-08 prerendering and sitemap | H2, H7, H10, S2, S3 |
| F-09, F-10, F-11, F-42 GC bid path, uploads, inbox detail, estimate save | D5 to D9, A4, A5, E16, O19 |
| F-14 direct inserts | D3, E16 |
| F-15, F-20 mobile first screen and cookie banner | P7, O18 |
| F-16, F-26, F-33 analytics, consent, ipapi | P1 to P7 |
| F-17, F-21 emergency and response times | O11, O12 |
| F-18, F-19, F-28 references, case studies, peer claims | C1, C2, O8 to O10 |
| F-24, F-25, F-48 form fields and placeholders | C6, O19 |
| F-27 legal dates | O24 |
| F-30 admin login | D10, S7, S8 |
| F-31 bundle size | R10, S5, S6 |
| F-32, F-39 headers, redirects, 404 | H1 to H6 |
| F-34, F-35 CI, lockfile, typing | R7, R11, R12 |
| F-36, F-37 imagery, partner wall | I8, O17 |
| F-38 city pages | C11, O23 |
| F-40 title logic | S1 |
| F-41 projects hero | I13, C1 |
| F-43 hours mismatch | C6, O15 |
| F-44 dead components | I11 |
| F-45 hero video duplication | S6 |
| F-46 service worker | H9 |
| F-47 committed .env | R13 |
| F-49 rating schema | C7, S4 |
| F-50 newsletter duplication | E16, C12 |
| Header audit (05) | I1 to I15 |
| Admin audit (05) | A1 to A18 |
| Deployment rules | R1 to R20 |
# Admin panel: master plan

**Owner:** Ascent Group Construction · **Prepared by:** Claude, 3 October 2026 · **Implemented by:** Codex (ChatGPT) through GitHub pull requests · **Published by:** the owner, in Lovable

This is the **one plan to follow**. It brings together everything decided in this conversation. Files 12 to 16 in this folder are now **reference material**: use them for detail only when a phase points to them. Where they disagree with this file, this file wins.

---

## 1. What you will get

| Your need | What the plan delivers |
|---|---|
| "Many admin features don't work or are fake" | Every admin screen either changes the website or is removed. No fake statuses, no dead buttons |
| "Adding a project or blog post is a hassle" | One-page editors with a Publish switch at the top, a real text editor (Tiptap), drafts that never go live by accident, working preview, easy images and a media library |
| "I don't like the design" | A new clean admin: light theme (dark optional), the website's navy and orange, a menu grouped by task, the same layout on every page, usable on a phone |
| "I want 100% control of my website from the admin" | Pages hub: all 88 pages in one list. Edit each page's text, images, SEO title and description, and header image, with draft, preview, publish, history and one-click undo. Layout and design stay in code, which protects the approved design |
| "I can't check 88 pages one by one" | Site Health: a robot checks every page each night (errors, broken links and images, missing titles, slow pages, phone layout, risky claims). One dashboard tile, and an email only when something new breaks |
| "Don't miss leads" | Leads workspace (done), email alerts sent by the server with delivery status and a resend button, bid due dates, assignment, notes and history |
| "Don't break my website" | A safety net first, one change at a time, an automatic before/after comparison of all 88 pages, a kill switch for content edits, and a written rollback for every failure |

---

## 2. Where things stand (3 October 2026)

| Done | Notes |
|---|---|
| PR #43: quote save fix | Estimates no longer lose their quote details |
| Leads workspace (P3a) | Leads list and detail across the four existing tables |
| Dashboard v1 (P4a) | Lead-focused, honest "Unavailable" states |
| Tiptap 3.31.4 installed by Lovable | Commit `b0f14aa`; unused until Phase 5 |

Open issues that the plan fixes:
- About and most Settings fields are fake.
- New projects fail to save without dates.
- The Contact page likely shows old text to visitors.
- Testimonials, Media Library and Email Templates are fake.
- Lead alert emails are probably not being sent (no Resend key).

The full list is in [13-ADMIN-FEATURE-REALITY-AUDIT.md](13-ADMIN-FEATURE-REALITY-AUDIT.md).

---

## 3. The ten safety rules (apply to every phase)

1. **One change at a time.** Codex opens one PR. You merge it, publish it in Lovable, check it, and only then start the next phase.
2. **The Lovable preview is treated as the live site.** It very likely uses the live database. Never test with real-looking data there. Delete any test rows you create.
3. **Before/after comparison.** From Phase 0 on, every PR that touches the public website is compared against screenshots and text of all 88 live pages. Any difference that isn't declared fails the PR.
4. **No surprise changes to the public site.** When the admin has no value saved, every page shows exactly what it shows today.
5. **Database changes go first, through Lovable, after a backup.** Each one comes as a reviewed SQL file. If a table doesn't exist yet, the feature switches itself off rather than crashing.
6. **Lead forms are not touched** except in Phase 3 and Phase 8, which own them.
7. **No Lovable AI code edits while a Codex PR is open.** Lovable may only do the install or migration step a phase asks for.
8. **Edits need Publish.** Admin content, SEO and page visibility are drafts until you press Publish. Every publish has history and Undo, and a kill switch restores all pages to their original text instantly.
9. **Protected things:** homepage hero video, `/projects` hero, the website's navigation order and "Start a Project" button, `/capabilities`, the Contractor Portal, brand colours, phone and email in the header, and all credential wording (WSIB, COR, insurance, bonding, Sto). Credential wording stays yours to decide and becomes editable only through the credentials vault (Phase 9).
10. **Check as a visitor.** After each publish, check in a **private window**. Logged in, you see things visitors don't.

---

## 4. Phases

Each phase is one Codex session and one PR, except where a phase says it takes two. Work through them in order; each phase lists what it needs before it can start.

### Phase 0: Safety net (no website change)
**Goal:** a "before" picture and a guard so later phases can't silently break pages.
- A production baseline of all 88 pages: screenshots at 1440 and 390 px, visible text, title, H1, canonical, structured data and console errors.
- A comparison gate in GitHub CI on every PR that touches public files.
- A bundle check: admin-only libraries (Tiptap, charts) must never load on public pages.

**You, in parallel (no code):**
- Send Lovable the environment questions (section 7).
- Add a second super admin.
- Say whether the GitHub repo is private or public.
- Create a free UptimeRobot monitor for the home page (5-minute checks, email alert).

**Done when:** the baseline lists 88 pages, and the gate fails on a deliberately changed test page.

### Phase 1: Fix what's broken, remove what's fake (admin only, plus 2 small declared public fixes)
- **Projects:**
  - Save without dates.
  - Autosave never publishes.
  - Image deletes happen only when you press Save.
  - Drag-drop no longer loses images.
  - Preview shows drafts.
- **Blog:** all inputs save; list-page preview works; Save validates.
- **Settings:**
  - The Contact page shows your saved values to visitors (it requests only the allowed columns).
  - Settings save even when no record exists.
  - The Security tab is removed (nothing used it).
- **Honest screens:**
  - Monitoring shows real status, not "Healthy" or 0 ms.
  - Users: no fake "Active"; the permission table and unusable roles are removed; role editing is limited to super admins.
  - The broken tour is removed.
  - Garbled labels are fixed.
  - Back and Cancel warn about unsaved changes.
- **Hidden until real:** Email Templates, Media Library, Testimonials, the Company Overview, Featured and Promotions editors, the robots/sitemap buttons (replaced by a read-only "what crawlers see" panel), and the navigation placeholder pages.
- **Declared public changes:**
  - Project pages stop showing red "No" badges for unset performance fields.
  - The Contact page shows the saved settings.

**Details:** file 14, R1. **Needs from you:** preflight query 11 (section 7).

### Phase 2: Site Health (no website change)
- A nightly robot checks all 88 pages at desktop and phone width. It never fills in forms or logs in, and it is marked so it doesn't distort your analytics.
- Results go to a new **Site Health** page and a dashboard tile.
  - Issues are grouped by type, with "new since last night" highlighted.
  - Each issue can be marked Fixed or Ignored, with a reason.
  - Real visitors' browser errors are grouped by page.
- A separate tiny `health-ping` function confirms the database is reachable. The lead form function is **not** modified.
- **First 7 nights:** alerts are off, and the results become the baseline. After that you get an email only for **new** serious errors, plus a Monday digest.

**Needs from you:** apply SQL `0003` (v2); add the secret `SITE_HEALTH_INGEST_TOKEN` in GitHub and in Lovable Cloud (Codex gives exact steps).

**Details:** file 16, sections 1C, 2 D6 and 6; file 15, section 3.

### Phase 3: Lead alerts you can trust (server side; the forms look the same)
**Part 3A:**
- Apply SQL `0001` (v2): a new `inquiries` table, notes, history, per-recipient alert records, alert recipients, and protection so the last super admin can't be removed.
- Server-sent alerts through the verified Lovable email sender, with delivery status per recipient and a "Resend" button.
- The sender name is corrected to "Ascent Group Construction".
- Settings → Notifications for choosing alert recipients, with a "Send test alert" button.

**Part 3B:** Leads shows the new table alongside the old ones: assign, bid due date and time (Toronto), priority, bid amount, notes, timeline, archive. The dashboard adds those counts.

The old tables stay visible and counted throughout.

**Needs from you:** run the preflight queries (`0000`), review and apply `0001`, and name at least two alert recipients. Lovable deploys the changed functions.

**Details:** file 12, sections 2.1–2.4 (phases P1, P2, P3b, P4b).

### Phase 4: The new admin look (admin only)
- Light theme by default, with a dark toggle that is remembered.
- Navy, white and steel blue with one orange (#F97316); Barlow headings; readable text sizes.
- **Menu grouped by task:**
  - **Today:** Dashboard, Leads.
  - **Content:** Projects, Blog, Services, Documents, Media.
  - **Website:** Pages, Homepage, Site Health, SEO.
  - **Admin:** Users, Settings, Activity.
- **Top bar:** page title, search (Ctrl/Cmd+K), **+ New**, the bell, theme, View site, your account.
- One page layout everywhere, with helpful empty states. On phones, the menu becomes a drawer and tables become cards.
- A 30-minute idle logout with a warning.

**Details:** file 14, R3.

### Phase 5: Smooth editing (admin, plus richer formatting on public pages)
- **One-page editors** for Projects, Blog and Services. A sticky bar holds the status, the **Publish** switch, Preview, Save and "Saved 10 s ago".
- **Tiptap editor:** bold, headings, lists, links, paste from Word. Public pages render it safely, and old plain-text content keeps its line breaks.
- **Every field shown on the website can be edited, and no field is invisible:** project challenge, results and tags; service overview, process, benefits and FAQs.
- **Images:** multi-upload, reorder, "set as cover", alt text, deletes only on Save.
- **List pages:** thumbnails, search, status filter, Duplicate, quick Publish.
- **Media library** over your uploaded images, with "Choose from library" on every image field and a "where used" check before deleting.

**Details:** file 14, R4 and R5.

### Phase 6: Website control, part 1
- **Pages hub:** all 88 pages, with health, SEO score, last edit and drafts waiting. Each page has tabs for SEO, header image and health.
- **Page SEO:** title and description with length meters, a Google preview, and the share image. Draft, publish, history and undo apply. Key pages can't be hidden or set to noindex.
- **Settings that reach the site:** tagline, social links, default SEO, footer socials. Phone and email are shown read-only, with the reason.
- **Kill switch:** "Restore all pages to original text".

**Needs from you:** nothing new; SQL `0003` was already applied in Phase 2.

**Details:** file 16, D3–D5; file 15, section 2.

### Phase 7: Website control, part 2 (edit page content)
Done in groups of pages. Each group takes **two PRs**:
- **7a:** the text moves into content files **without changing a word**. An automatic test proves every page is identical.
- **7b:** editing is switched on for that group. For one week **only admins see edits**, then visitors do.

**Groups:**
1. Home, About, Contact, Services overview, For General Contractors, Property Managers, Emergency.
2. The other static pages.
3. City pages and the 9 code-managed service pages.

FAQ text and Google's FAQ data always match, because both read from the same source.

**Needs from you:** apply SQL `0002`, which adds the About fields, before group 1.

**Details:** file 16, D1–D2.

### Phase 8: New contact forms (public, behind a switch)
- The Contact page gets a choice: "Request an estimate", "Invite us to bid" (bid due date and time, drawings link) or "General question".
- The GC page buttons link straight to the bid form.
- All forms go through the server with duplicate protection.
- Built **switched off**, then switched on after you've tested it. The old tables move to "History" only after 14 days with no new entries in them.

**Details:** file 12, section 2.6 (P6–P8).

### Phase 9: Trust tools
- **Credentials vault:** certificate of insurance, WSIB clearance, policy, Sto certificate, safety manual, training tickets, with expiry reminders.
- Credential claims on the site link to a vault document, and switch to safe wording if it expires.
- **Prequal package builder:** one click makes a branded PDF from the vault, shared by an expiring link with open tracking. This replaces the dead download buttons.

**Needs from you:** documents and decisions on the credential wording; a new SQL draft (Codex writes it, you review it).

### Later (when the above is stable)
- Insights per page (leads and Search Console).
- Bid board: email intake from invitations to bid, go/no-go, win/loss.
- Proof pipeline: from job closeout to a case study plus a Google review request.
- Response-time tracking.
- Activity log names.
- Kanban board view.

---

## 5. How each phase runs (your checklist)

1. **Start Codex** with the master prompt in section 6, changing only the `PHASE =` line.
2. **Read Codex's report.** It must list: checks passed, pages compared (identical or intentionally changed, with images), and your steps.
3. **If there's SQL:**
   - back up (Lovable → Cloud → Advanced settings → Export data);
   - give Lovable the SQL file to apply;
   - run the verification queries in that file.
4. If Lovable must deploy a function or add a secret, do it now.
5. **Merge** the PR in GitHub, then in Lovable press **Publish → Update**.
6. **Check in a private window** within 30 minutes:
   - home page, Contact, one service page, and the pages the phase changed;
   - at phone width;
   - after Phase 2, also look at Site Health.
7. **Wait 24 hours** and look at the Site Health and error tiles. Then start the next phase.

**If something goes wrong:**

| Problem | What to do |
|---|---|
| Content you edited looks wrong | Pages → that page → History → **Undo** |
| Many pages look wrong | Pages → **Restore all pages to original text** |
| The site broke after a publish | Restore the previous version in Lovable (if available), or revert the merge in GitHub and publish |
| A database change caused errors | Revert the frontend first. The SQL rollback runs only after exporting data |
| Leads stopped | Check the inbox and Site Health, then roll back the last publish that touched forms |

---

## 6. Master prompt for Codex (paste this, changing only the first line)

=== BEGIN PROMPT ===

PHASE = 0
(Allowed in order: 0, 1, 2, 3A, 3B, 4, 5A, 5B, 6, 7-G1a, 7-G1b, 7-G2a, 7-G2b, 7-G3a, 7-G3b, 8A, 8B, 9. Do ONLY this phase: one PR, report, stop.)

## Who you are and what this is
- You are a careful senior engineer on `DolaSivikari/ascentgroupconstruction`. The stack is Vite 5, React 18, TypeScript, React Router 6, TanStack Query, shadcn/Radix and Tailwind, with Supabase through Lovable Cloud. The site is hosted on Lovable.
- The live website wins real construction work, so **not breaking it matters more than speed**.

## Read first
- **`_assessment/admin-upgrade/00-ADMIN-MASTER-PLAN.md`: the plan.** Your phase's section 4 entry is the scope.
- The reference files named in your phase's "Details" line:
  - `12-ADMIN-UPGRADE-CODEX-PROMPT.md`
  - `13-ADMIN-FEATURE-REALITY-AUDIT.md`
  - `14-ADMIN-REDESIGN-CODEX-PROMPT.md`
  - `15-SITE-CONTROL-AND-GROWTH-ROADMAP.md`
  - `16-RISK-REVIEW-AND-SAFE-DELIVERY-PLAN.md`
- Where those reference files conflict with the master plan, the master plan wins. File 16 wins over files 12, 14 and 15.
- Existing status notes: `docs/admin-leads-workspace.md`, `_assessment/**/IMPLEMENTATION-STATUS*.md`, `_assessment/admin-upgrade/P4A-IMPLEMENTATION-STATUS.md`. Do not redo finished work.
- Trust the code over the docs; record any difference in your report.

## Rules (non-negotiable)
1. **Branch `admin/<phase>-<slug>`, one PR to `main`.**
   - Never push to main, merge, publish, deploy functions, run migrations, change secrets, or write to any live database or storage.
   - If another open PR touches public pages or shared files (`AppRoutes.tsx`, `UnifiedSidebar.tsx`, `UnifiedAdminLayout.tsx`, `SEO.tsx`, `Navigation.tsx`, `PageHero.tsx`, `Index.tsx`, `src/data/*`, `src/content/*`), stop and report.
2. **Do not edit:** `.env`, `bun.lock` (by hand), `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `supabase/config.toml` (except adding a block for a new function the phase creates), `.lovable/**`.
   - No new dependencies. Tiptap 3.31.4 is already installed.
   - Tiptap 3's StarterKit already includes Link and Underline. Configure Link once through StarterKit, and disable Underline.
3. **SQL:** only the reviewed drafts in `_assessment/admin-upgrade/sql/` (`0001` v2, `0002`, `0003` v2), copied **unchanged** into `supabase/migrations/<UTC yyyymmddHHMMSS>_<name>.sql` in the phase that needs them. Leave out commented rollback blocks and put them in the PR description.
   - Any other database change: write a new draft in that folder and stop.
   - Until Lovable regenerates `types.ts`, use hand-written types in `src/lib/**/types.ts`, never `as any`.
4. **Feature detection:** if a new table, column or function is missing (PostgREST not-found or schema-cache errors, RPC 404), the feature is **off** and the app behaves exactly as today. Never crash, never show a blank page.
5. **Public site unchanged unless declared.**
   - From Phase 0 on, every PR touching `src/pages`, non-admin `src/components`, `src/data`, `src/content`, `public/`, `index.html` or `SEO.tsx` must pass the comparison gate against the production baseline (visible text exact; screenshots within 0.1 % per page).
   - Intended changes are listed by page with before/after images.
   - When an admin value is empty, render today's exact text.
6. **Protected:**
   - The homepage hero and video logic, `PremiumProjectHero`, the public navigation order and "Start a Project", `/capabilities`, the Contractor Portal content, brand tokens.
   - Header and call-to-action phone and email from `src/constants/company.ts`.
   - All credential wording (WSIB, COR, insurance, bonding, Sto, "certified", "24/7"). Report it; never change it.
7. **Lead paths:** do not modify `submit-form` or any `send-*` function except in Phases 3A and 8A. Never submit forms against a real backend.
8. **No live data in tests.**
   - The Lovable preview is treated as production.
   - Tests use mocks and fixtures. Browser checks run on the production build (`vite build && vite preview`) with external traffic blocked.
   - If a manual check needs data, write owner instructions using an obviously fake value (e.g. `test+phaseX@example.com`) and a delete step.
9. **Honest UI.**
   - No hard-coded statuses or numbers presented as measured.
   - No admin control that doesn't affect the site.
   - Every error shows the real reason: map Postgres codes 23505 (duplicate), 22007/22P02 (invalid value), 42501 (permission), 23514 (rule).
   - `ConfirmDialog` and toasts only; never `window.confirm` or `alert`.
   - Accessible labels, keyboard support, visible focus, no horizontal scroll at 390 px.
10. **Security.**
    - Rich text is sanitised with DOMPurify, using an allow-list, at render time.
    - Links are https, mailto, tel or internal only.
    - Images come only from our storage host.
    - Never log personal data in functions.
    - Never import `@tiptap/*` or chart libraries into public routes (the bundle gate enforces this).
11. **Deleting files** needs three pieces of evidence: no importer; no string reference anywhere, including `supabase/functions`, `public`, `scripts`, `.github` and docs; an unchanged build and comparison. Otherwise hide the file and list it under "quarantine".
12. **Gates before the PR:**
    - full Vitest suite;
    - `typecheck:selected`;
    - `tsc -p tsconfig.app.json --noEmit`;
    - `bun run build`;
    - `validate:sw`;
    - `bun scripts/audit-routes.ts`;
    - the comparison gate;
    - the bundle gate;
    - lint not above 288 errors / 34 warnings, with new files clean;
    - `git diff --check`.

    Report exact numbers. Never call a failing or skipped check "passed".
13. When unsure, stop and ask. Write "Unknown" rather than guessing.

## Phase-specific notes
- **0:**
  - Build `scripts/baseline/capture.ts` (Playwright, already used). URLs come from the live `/sitemap.xml` plus the static routes in `src/routes/registry.ts`, excluding `/tekev`, `/admin*`, `/404` and `/unsubscribe`.
  - It runs as a manual GitHub workflow against production and saves screenshots, text, title, H1, canonical, JSON-LD hash and console errors as an artifact plus a summary in `_assessment/baseline/`.
  - The comparison gate runs the same capture against the PR's production build and diffs it with the baseline artifact. The bundle gate inspects the build output for `@tiptap` or chart code in chunks loaded by public routes.
  - The crawler sets the consent-rejected cookie, uses the user agent `AscentSiteHealth/1.0`, and blocks `ipapi.co`, Google analytics and maps. Make `src/utils/errorLogger.ts` skip that user agent.
  - If production returns 403 to the runner, record it and stop.
- **1:** file 14 §R1, except: Security tab removed; Testimonials hidden; the robots/sitemap buttons replaced by a read-only panel. For the Contact page columns, use the owner's preflight query 11 result. If it isn't provided, request only `office_address, weekday_hours, saturday_hours, sunday_hours, map_embed_url`, and use constants for phone and email.
- **2:**
  - Copy `0003` v2.
  - Add `.github/workflows/site-health.yml` (nightly `0 7 * * *` UTC, plus manual), `scripts/site-health/crawl.ts`, `supabase/functions/ingest-site-health` (token auth, `verify_jwt = false`, Zod, batch insert, email only for **new** 🔴 after the 7-night pilot flag is off), `supabase/functions/health-ping` (read-only), the Site Health admin page and the dashboard tile.
  - No 30-minute uptime job on GitHub.
- **3A:**
  - Copy `0001` v2.
  - Implement file 12 §2.2 (idempotent intake for the new `inquiry` type only, with existing form types unchanged; per-recipient alerts; lease; resend; `SITE_NAME`) and Settings → Notifications.
  - No public form uses the new type yet.
- **3B:** file 12 §2.3 Stage 2 and §2.4. The legacy sources stay first-class.
- **4:** file 14 §R3. This is the only shell rebuild; file 12's P5 is cancelled.
- **5A:** file 14 §R4 (Tiptap editors, one-page editors, field parity, images, list pages, slug helper).
- **5B:** file 14 §R5 (media library, picker, where-used).
- **6:**
  - The Pages hub (inventory from `registry.ts`, the sitemap sources and the database).
  - Page SEO, header image and hidden entries as content entries (`kind` seo, image or flag) with draft, publish, history and rollback through the `0003` v2 functions.
  - Protected pages can't be hidden or set to noindex.
  - The kill switch UI (`set_site_flag`).
  - Settings → General, Footer and Contact connected, per file 14 §R2 items 2–6.
- **7-Gxa:** move the group's copy into `src/content/pages/<id>.ts` (Zod schema, defaults verbatim, meta with labels, limits and claim flags) and `src/content/shared/*`. Pages and structured-data builders read through `usePageContent`. **The rendered text and JSON-LD must be byte-identical** to the baseline. No database use.
- **7-Gxb:**
  - Turn on overrides for that group: the loader per file 16 D2, the admin Content tab, preview, page-level publish, history, the "code changed since override" warning, orphan list, and JSON export and import.
  - It starts in admin-only canary mode; the owner switches it off after a week.
  - For group 1, copy `0002` (the About fields) **only if** About still uses `about_page_settings`. Otherwise About goes through content entries; record which.
- **8A:** file 12 §2.6 behind `INTAKE_V2 = false`, with `submission_key` per form fill.
- **8B:** flip the flag after owner confirmation. File 12 P8 (legacy to History) is a separate later PR, after 14 days with no legacy writes.
- **9:** write a new SQL draft (`0004_credentials_vault.sql`) and the UI plan first, then **stop for approval**.

## Report at the end
1. What changed, in plain English.
2. Files touched.
3. Each gate with its result and numbers.
4. Comparison summary: pages compared, identical, intentionally changed (with images).
5. Your exact steps, in order: SQL, Lovable deploys or secrets, merge, Publish → Update, what to check in a private window.
6. Open questions.

State that merging does not publish.

=== END PROMPT ===

---

## 7. Messages and queries you'll need

**A. Questions for Lovable** (paste once, before Phase 0 finishes):
```
Read-only questions, please answer with evidence; do not change anything:
1. Do the preview and the published site use the SAME Supabase database? If yes, is a separate staging database or a database branch possible on our plan?
2. Can I restore a previous PUBLISHED version of the site in one click? Where, and does it also roll back edge functions or the database?
3. Does Lovable hosting block automated browsers or GitHub Actions IP ranges (HTTP 403)? Is there a supported way to allow our monitoring robot (user agent "AscentSiteHealth/1.0")?
4. Is multi-factor authentication (TOTP) available for our Supabase Auth users? How do I turn it on?
5. When I add an edge-function secret in Cloud, which menu path do I use, and does the function need a redeploy?
```

**B. Read-only database checks:** run [sql/0000_preflight_readonly.sql](sql/0000_preflight_readonly.sql) in Lovable Cloud and send the results to Codex (Phase 1 needs query 11; Phase 3 needs all of them).

**C. SQL to review and apply (only when the phase asks):**

| File | Phase | What it adds |
|---|---|---|
| [0003 v2](sql/0003_site_control_and_health.sql) | 2 | Site health tables; content entries with drafts, history and rollback; kill switch (starts OFF) |
| [0001 v2](sql/0001_inquiries_workflow.sql) | 3A | Inquiries, notes, history, alert deliveries and recipients; last-super-admin guard; role function |
| [0002](sql/0002_about_page_fields.sql) | 7-G1b, if needed | About page fields and the missing settings row |

---

## 8. Decisions still open (defaults apply if you don't answer)

| Decision | Default |
|---|---|
| Alert recipients (at least two, one of them a person) | `estimating@` until you add more in Settings |
| Lead statuses | New, Reviewing, Bidding, Submitted, Won, Lost (client chose another), No bid |
| Idle logout | 30 minutes |
| Nightly check time | 07:00 UTC (3 am summer, 2 am winter, Toronto) |
| Testimonials | Hidden until you have real ones |
| Company Overview, Featured and Promotions editors | Hidden (the current homepage doesn't use them) |
| Extra roles (editor, contributor, viewer) | Removed from the UI; re-add later if you hire an estimator |
| Website navigation menu | Stays in code (protected) |
| Response promise per audience | Must be set by you before Phase 8B |

---

## 9. Before you start

1. **Upload this whole folder (`_assessment/admin-upgrade/`, including `sql/`) to GitHub.** Several files changed recently (00, 12, 14, 15, 16 and all three SQL files). Codex reads the repository, not your computer.
2. Merge and publish the open P4a PR if you haven't, and check the dashboard in a private window.
3. Send Lovable message A. Add a second super admin. Set up the UptimeRobot monitor.
4. Start Codex with the prompt above and `PHASE = 0`.

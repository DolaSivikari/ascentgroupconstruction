# 14. Admin redesign and "make every feature real": Codex prompt

Prepared by Claude, 3 October 2026. Built on the audit in [13-ADMIN-FEATURE-REALITY-AUDIT.md](13-ADMIN-FEATURE-REALITY-AUDIT.md). It runs alongside the Leads plan in [12-ADMIN-UPGRADE-CODEX-PROMPT.md](12-ADMIN-UPGRADE-CODEX-PROMPT.md).

## Owner decisions (3 October 2026)

| Topic | Decision |
|---|---|
| About page | The owner edits **hero headline and intro, company story, founder section, and stats strip** from the admin. Everything else on /about stays in code |
| Text editor | **Tiptap** rich-text editor for projects, blog and services. Lovable installed 5 packages at 3.31.4 on 3 October 2026 (commit `b0f14aa`) |
| Theme | **Light by default, with a dark toggle** |
| Mockup | Not needed; build from this spec |

Defaults used until the owner says otherwise:
- Testimonials are **hidden** from the menu until real testimonials exist; the table and editor code stay.
- The Company Overview, Featured Services and Promotions editors are **hidden**; the current homepage design doesn't use them.
- The editor, contributor and viewer role options are **removed from the UI**. The database enum stays.

## How this fits with file 12

- Keep running the Leads phases from file 12 (P4a, P1, P2, P3b, and so on).
- **R3 below replaces the "header bar / sidebar / mobile" items of file 12's P5.** Build the shell once. The remaining P5 items (idle timeout, Email Delivery, cleanup) move into R1, R3 and R6 as listed below.
- R1 touches different files from the Leads work and can run any time.

---

=== BEGIN PROMPT ===

PHASE = R1
(Allowed, in order: R1, R2, R3, R4, R5, R6. One phase, one PR, report, stop.)

**FIRST read `_assessment/admin-upgrade/16-RISK-REVIEW-AND-SAFE-DELIVERY-PLAN.md`. Its section 7 rules apply to every phase here and override this file where they conflict.**
- R1 may start only after S0-1 and S0-2 (the production baseline and the comparison gate) are merged. If they aren't, build S0-1 and S0-2 first, as their own PR, and stop.
- R2 must use the content-module approach (file 16, D1) for the About page: step 1 is an identical-text refactor; step 2 adds the database layer.

# Role and context

You are a senior engineer improving the admin panel of `DolaSivikari/ascentgroupconstruction`:
- Frontend: Vite 5, React 18, TypeScript, React Router 6, TanStack Query, shadcn/Radix, Tailwind.
- Backend: Supabase via Lovable Cloud. Hosted on Lovable.

The owner's complaints: many admin features don't change the website, editing is a hassle, and the design is unappealing. Your job is to make **every visible admin feature do what it says** (or remove it), make editing smooth, and give the admin a clean, consistent look.

Read first (trust the code over the docs where they differ, and record the difference):
- `_assessment/admin-upgrade/13-ADMIN-FEATURE-REALITY-AUDIT.md`: the verdict for each feature, root causes, and sections 3–5 (what to do, editor experience, look and feel). **This is the spec.**
- `_assessment/admin-upgrade/12-ADMIN-UPGRADE-CODEX-PROMPT.md`: the Leads plan. Do not duplicate it, and do not break the Leads workspace.
- `_assessment/admin-upgrade/sql/0002_about_page_fields.sql`: the About-page columns, needed by R2.
- `docs/admin-leads-workspace.md` and the recent `_assessment/*/IMPLEMENTATION-STATUS.md` files: work already done.

# Non-negotiable rules

1. **Branch and PR only:** `admin/<phase>-<slug>` → PR to `main`. Never push to `main`, merge, publish, deploy functions, run migrations, or write to live data. Lovable publishes after merge.
2. **Do not edit:** `.env`, `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `supabase/config.toml`, `.lovable/**`. Do not edit `bun.lock` by hand.
   - **Dependencies:** the only approved additions are Tiptap (`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`), in R4.
   - **Already installed by Lovable** (commit `b0f14aa`): all five at exactly **3.31.4** (Tiptap 3), with `package.json` and `bun.lock` updated. Do not change their versions, and do not add other Tiptap packages (no image or underline extensions).
3. **SQL:** only the owner-approved drafts in `_assessment/admin-upgrade/sql/`, copied unchanged into `supabase/migrations/<UTC timestamp>_<name>.sql` in the phase that needs them. Any other database change is a new draft plus a stop.
4. **Protected, do not change:**
   - The public homepage hero and its video logic, `PremiumProjectHero`, the public navigation order and its "Start a Project" button, `/capabilities`, and the Contractor Portal content.
   - Public brand tokens.
   - Credential, insurance, WSIB, COR, bonding and Sto wording in code (the owner may now edit About stats text from the admin; that is their call).
   - Contact phone and email for header and calls to action stay from `src/constants/company.ts`.
5. **The public site must look identical** unless the phase says otherwise. When a database field is empty, the public page falls back to today's text exactly. Prove it with the smoke test and screenshots before and after (desktop 1440 px, mobile 390 px) of every public page you touch.
6. **Honest UI:**
   - Never show a hard-coded status or number as if it were measured.
   - A setting that doesn't affect the site must not be shown.
   - Every save shows the real error reason (map Postgres codes: `23505` duplicate, `22007`/`22P02` invalid value, `42501` permission). Never just "Failed to save".
7. `ConfirmDialog` and toasts only. Accessible labels, visible focus, keyboard reachable. No horizontal scroll at 390 px. No Vite `manualChunks`.
8. **Gates before every PR:**
   - Production build, `typecheck:selected`, full app `tsc --noEmit`, the full Vitest suite, `validate:sw`, the route audit or smoke test.
   - Lint must not exceed the baseline (288 errors / 34 warnings), and new files must be clean.
   - Report the exact numbers. Browser checks run on the production build (`vite build && vite preview`), with external traffic blocked and synthetic data only.
9. **Deletions** need three pieces of evidence: no importer; no string reference anywhere, including `supabase/functions`, `public`, `scripts`, `.github` and docs; an unchanged build and smoke test. Otherwise list the file under "quarantine". Hiding a menu item is not deletion; keep the code unless the evidence rule passes.
10. If anything is uncertain, stop and ask. Write "Unknown" rather than guessing.

# Phases

## R1: Stop the breakage and the fake UI (no visual redesign, no schema)

Fix:
1. **New project save with empty dates.** In `src/lib/admin/projectEditor.ts` `projectSavePayload`, convert every empty-string `date` and `numeric` field to `null`, using a list derived from the column types (`start_date`, `completion_date`, and any other date or number column in the form). Do the same in the service and blog payload builders. Tests: create with no dates, and clear a date on edit.
2. **Visitor-safe settings reads.**
   - `useSettingsData` and `fetchActiveSettingsRow` currently default to `select('*')`.
   - Give each public caller an explicit column list. Contact page: `office_address, weekday_hours, saturday_hours, sunday_hours, map_embed_url`, plus the email and phone columns **only if** preflight query 11 shows them granted to `anon`; otherwise use the existing constants. `PhoneLink` uses the `COMPANY_PHONE` constant, like the header does.
   - Admin callers may keep `*`.
   - Add a test that public callers never request `*`.
3. **Security settings:** remove the tab (audit section 3). If it is kept for any reason, fix the `|| true` bug with `?? true`.
4. **Settings save when no row exists.** Settings tabs must show a clear "No settings record yet – Create" state, or upsert one active row. Never throw `Cannot read properties of null`.
5. **Hero editor's "Back to Dashboard"** link points to `/admin`. Make hero reorder check every update's error and report partial failure. After any homepage editor save, invalidate the public query keys (`hero-slides`, `why-choose-us`).
6. **Blog:**
   - Save `sector`, `source` and `is_pinned`, or remove those inputs if the columns don't exist. Check `types.ts`.
   - The list-page preview button must persist the preview token before opening.
   - The header Save button must run form validation.
   - Sanitise typed slugs with the shared slug helper.
7. **Projects:**
   - Autosave must **never** write `publish_state` and must never write to a published row. Store autosave drafts in `localStorage`, keyed by project id, and offer "Restore unsaved changes".
   - Gallery deletions are staged and only remove storage files after a successful Save.
   - Fix the stale `handleDrop` closure.
   - Default `on_time_completion` and `on_budget` to unset (null), not `false`, and hide the Performance card on the public page when every value is null. This is a public change, allowed because it removes false "No" badges; show before/after screenshots.
   - Fix the preview link format, and make `ProjectDetail` support `?preview=true&token=` through the existing `get_preview_project` RPC, as `BlogPost` already does.
8. **Monitoring:** remove the hard-coded "Healthy"; derive status from errors in the last 24 h. Remove the 0 ms card. Show query errors.
9. **Users:** remove the hard-coded "Active" badge and the static PermissionMatrix and role-definition cards. Hide the editor, contributor and viewer role options. Hide role editing and Invite from non-super-admins. Remove "User will be prompted to change this on first login", which is false.
10. **Onboarding tour:** remove the automatic start, and remove the tour if rule 9 permits.
11. **Hide fake menu items and controls:**
    - Email Templates
    - Media Library (until R5)
    - Testimonials (until real testimonials exist; keep the route)
    - Homepage Builder tabs for Company Overview, plus Services Manager tabs for Featured and Promotions
    - SEO Dashboard robots.txt editor and "Regenerate sitemap" (replace them with a read-only "What crawlers see" panel that fetches `/robots.txt` and `/sitemap.xml` from the current origin and shows the URL count)
    - The navigation, redirects and content-versions placeholder routes
12. **Fix garbled characters** (encoding) in admin labels, e.g. `SEOTab.tsx`, `ProjectEditorHeader.tsx`, `ServiceEditor.tsx` and the Monitoring title.
13. **Unsaved-changes guard:** Back and Cancel buttons and in-app navigation (React Router blocker) warn when there are unsaved changes, without a full page reload.

Tests for each item. Report a "before/after menu" list.

## R2: Connect the settings that matter

1. **About page.** Copy `0002_about_page_fields.sql` into migrations; the owner applies it through Lovable before merge.
   - Rewrite the admin About tab to edit exactly:
     - Hero: headline, intro.
     - Story: headline, paragraphs (`story_content`, a JSON array of strings, with add, remove and reorder).
     - Founder: name, title, bio, quote, image (`ImageUploadField`).
     - Stats strip: up to 6 rows of value and label, reorderable.
   - Remove the old fake fields: promise, sustainability, safety, years, total projects, satisfaction, CTA.
   - Make `src/pages/About.tsx` read the active row through a visitor-safe column list. **Each field falls back to the exact current hard-coded text when empty.**
   - Add a "View page" link and a live side preview of the hero, story and stats in the admin.
   - Tests: empty row → identical render; filled row → values shown; a partial row mixes values and fallbacks.
2. **General settings.**
   - Keep and **connect**: tagline (footer brand line, if a matching spot exists today; otherwise remove the field), social links (footer icons and the organisation `sameAs` in structured data, using URL validation, https only), and default meta title and description (used by `SEO.tsx` only when a page passes none).
   - Show phone and email as read-only, with the note "Set in code (spam protection). Ask a developer to change." Remove company name and founded year unless a visible consumer exists.
3. **Footer:** connect Facebook, X and Instagram to the footer icons when set. Remove anything that can't be displayed.
4. **Contact page tab:** keep the fields the page renders. Remove toll-free, careers and RFP email.
5. **Health Check:** add a "Visitor view" check that reads the public column lists with a separate anonymous client (`createClient` with the publishable key and no session) and reports any permission error. Label the existing checks "Admin view".
6. **Cache:** every settings save invalidates the matching public query keys.

## R3: New admin shell and theme (light default, dark toggle)

Design spec: audit section 5. Requirements:
- **Tokens:** in `src/styles/` add an admin theme with `[data-admin-theme="light"|"dark"]`.
  - Light: white and near-white surfaces, navy `#003366` primary, a single accent `#F97316` (the website's), steel blue `#4A90A4` secondary, Barlow headings, body 15–16 px, 8 px radius, subtle borders, no gradients.
  - Dark: the same roles with dark surfaces.
  - Contrast: text 4.5:1 or better, UI 3:1 or better, in both themes.
  - Store the choice in `localStorage` (wrapped in try/catch); default light.
  - Remove the forced `admin-dark-theme` / `admin-dark-portal`, without leaking admin styles into the public site.
- **Sidebar**, grouped by task. Collapsible to icons, with state remembered.
  - **Today:** Dashboard, Leads (badge).
  - **Content:** Projects, Blog, Services, Documents, Media (after R5), Testimonials (hidden for now).
  - **Website:** Homepage, About, Contact & Footer, SEO overview, Page headers.
  - **Admin:** Users, Settings, Activity (Audit Log plus Monitoring as two tabs).
- **Top bar:** page title and breadcrumb; search (Ctrl/Cmd+K, moved from the sidebar); a **"+ New"** menu (Project, Blog post, Service); the bell; theme toggle; View site; and a user menu (name, Sign out).
- **Page template component** `AdminPage` with title, a one-line help text, a primary action at top-right, an optional filter row, content, and empty, loading and error states. Migrate every admin page to it, and remove duplicated headers (for example the hero manager's nested layout).
- **Mobile:** below 1024 px the sidebar becomes a drawer; below 640 px tables become cards and the top-bar actions collapse into the user menu.
- **Idle timeout:** mount `IdleTimeoutWrapper` with a 30-minute timeout and a 60-second warning, configured in one constant.
- Screenshots of every admin page in both themes, at 1440 px and 390 px, attached to the PR.

## R4: Smooth editors (Projects, Blog, Services) and Tiptap

The Tiptap packages are installed (3.31.4).
1. **A shared `RichTextEditor`** on Tiptap 3.
   - **Tiptap 3's StarterKit already includes Link and Underline.** Configure Link once, through `StarterKit.configure({ link: { openOnClick: false, autolink: true, protocols: ['https','mailto'], HTMLAttributes: { rel: 'noopener noreferrer' } }, underline: false })`.
   - Do **not** also register `@tiptap/extension-link` separately, because two Link extensions conflict. `@tiptap/extension-placeholder` is added normally.
   - Check these option names against the installed 3.31.4 type definitions before relying on them, and record any difference in the report.
   - Toolbar: bold, italic, H2, H3, bullet list, numbered list, link (https or mailto only), undo and redo. Paste from Word strips styles.
   - Store HTML. On the public side, render through one `RichText` component that sanitises with the existing `dompurify` (with an allow-list of tags).
   - **Legacy plain text** (no tags) is converted to paragraphs and line breaks when displayed and when loaded into the editor. This fixes collapsed line breaks on project pages.
   - Use it for project description, scope, challenge and results; blog content and case-study sections; service long description and overview.
2. **One-page editors** replace the tabbed project editor and the long blog and service forms.
   - Sections with a left outline: Basics, Content, Images, Details, Services, SEO. On mobile, the outline becomes a top selector.
   - A **sticky action bar** holds the title, a status pill, a **Publish/Unpublish** switch (with confirmation), **Preview**, Save and "Saved 10 s ago". The publish control is no longer hidden in SEO.
   - Required fields are marked, with errors shown next to the field and in a summary.
3. **Every public field is editable, and no admin field is invisible on the site.**
   - Projects: add `challenge`, `results` and `tags`. Remove `process_notes`. Make the `project_status` field drive the public sidebar status, or remove it.
   - Blog: case-study fields render publicly, or are removed. Add before/after images and process steps through the image manager.
   - Services: add `service_overview`, `process_steps`, `key_benefits`, `faq_items`, `category` and `icon_name`. The 9 code-managed service pages show a banner, "This page is managed in code; edits here don't affect it", with the slug list taken from the router.
   - Remove the duplicate description/scope rendering on the project detail page. Public change: screenshot it.
4. **Image manager:**
   - Multi-file drop, thumbnails, drag reorder, "Set as cover", caption and alt text, category.
   - Deletes are staged until Save.
   - "Choose from library" (enabled in R5).
5. **List pages** (Projects, Blog, Services, Documents): thumbnail, title, status pill, last updated, search, status filter, sort, pagination, row actions (Edit, Preview, Duplicate, Publish/Unpublish, Delete with confirmation). Projects already has unrendered search, sort and bulk code; reuse it.
6. **Slugs:** one shared helper (lowercase, accent-folded, hyphens, no leading or trailing or double hyphens), with a live uniqueness check in every editor.
7. **Tests:** editor save payloads, sanitiser allow-list, legacy-text conversion, publish switch, staged deletes, duplicate.

## R5: Media library and picker

- Rebuild Media over the `project-images` bucket, which is public:
  - Grid with thumbnails, upload (multi-file, with client-side size and type checks), search by file name, copy URL, alt text, and delete with a "used by" check that searches `projects`, `project_images`, `services`, `blog_posts` and `hero_slides` for the URL before allowing it.
  - Alt text and metadata are stored in a draft table only if one is needed. Write that SQL as a new draft and stop for approval; otherwise use storage object metadata.
- **"Choose from library"** in `ImageUploadField` and the image manager.
- Remove orphan uploads: when an image is replaced in an editor, offer to delete the old file if nothing else uses it.

## R6: Activity, roles and monitoring

- **Audit Log:**
  - Show actor names.
  - Remove the always-empty IP and browser columns.
  - Draft SQL (stop for approval) to add the audit trigger to `services`, `blog_posts`, the settings tables and `hero_slides`.
- **Users:** use `rpc('set_user_role')` (from 0001) when that is applied; show "At least one super admin must remain".
- **Email Delivery** (from file 12, section 2.5): a page under Admin → Activity that reads `email_send_log`. It is read-only and paginated, with filters for status, template and date. Recipients are masked by default (`j***@domain.com`), with a reveal toggle. A second tab shows `suppressed_emails`. Rows link to the lead when `metadata.inquiry_id` is present (after file 12's P2). It must also work today with RFP-only rows.
- **Monitoring:**
  - Error list with filters and grouping by message.
  - Web vitals section only if `VITE_ENABLE_PERFORMANCE_TRACKING` is enabled by the owner; otherwise hide it.

# Report at the end of each phase

1. What changed, in plain English, as a before/after list of admin features with their new verdict (real or removed).
2. Files touched.
3. Each gate command with its result and numbers.
4. Public-site screenshots before and after, with any intended public change called out.
5. Owner steps: SQL to apply through Lovable, packages for Lovable to install, Publish → Update, and what to click in the preview to confirm.
6. Open questions.

State plainly that merging does not publish.

=== END PROMPT ===

---

## Owner checks after each phase (Lovable preview, then live)

| Phase | Check |
|---|---|
| R1 | Create a project with no dates: it saves. The menu no longer shows Email Templates, Media, Testimonials, Security or the robots/sitemap buttons. Change the Contact page office hours, then open /contact in a **private window**: the new hours show |
| R2 | Edit the About hero headline, save, and open /about in a private window: it shows the new headline. Clear it: the original text returns |
| R3 | Light theme by default; the toggle switches to dark and is remembered. Every page has the same header layout. At phone width, the menu is a drawer and nothing scrolls sideways |
| R4 | Write a project description with headings and a list; on the public page the formatting shows. The publish switch is at the top. Preview shows the draft |
| R5 | Upload two images in Media, then pick one as a project cover with "Choose from library" |
| R6 | Change a service; the Activity page shows your name and the change |

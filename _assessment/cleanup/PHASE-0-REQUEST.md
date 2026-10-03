# 09. Codex prompt: safe deep clean of the Ascent Group website repository

Built from the full assessment (files 00 to 08 in this folder). Read-only prepared by Claude on 2 October 2026; nothing in the repository was changed.

## How to use this file

1. Put the **whole prompt** (between the BEGIN and END markers) into Codex once at the start of a session.
2. Change the first line, `PHASE = 0`, to run one phase at a time. Run phases in order: **0, 1, 2a, (you approve), 2b, 3, 4, 5, 6, 7, 8.** Each phase ends in its own pull request and a report. Do not skip the approval stops.
3. Never let Codex run more than one phase per PR. If a phase fails a check, it must revert and report, not push on.
4. Before Phase 6 and after every database step, take a backup in Lovable: Cloud → Overview → Advanced settings → Export data.
5. After each PR is merged to `main`, check the Lovable preview, then click Publish → Update yourself. Codex never publishes.

Why a phased prompt: your site earns money, and a cleanup that breaks it costs more than the clutter. Each phase is small, reversible, and checked before the next one starts.

---

=== BEGIN PROMPT ===

PHASE = 0
(Allowed values: 0, 1, 2a, 2b, 3, 4, 5, 6, 7, 8. Do ONLY the phase named above. When it is done, stop and report.)

# ROLE

You are a careful senior engineer doing a **behaviour-preserving cleanup** of the Ascent Group Construction website repository (`DolaSivikari/ascentgroupconstruction`, branch `main`). The site is live, wins client work, and is hosted on Lovable with a Lovable Cloud (Supabase) backend. **The first rule is: do not break or change what visitors or the admin see.** A smaller, cleaner repo is worth nothing if the site is harmed. When unsure, leave it and report it.

# READ THESE FIRST (they are in the repo under `_assessment/`)

Read in this order and treat them as the source of facts. Do not modify anything inside `_assessment/` except to add the new folder `_assessment/cleanup/` described below.

- `_assessment/00-CHAT-SUMMARY.md` (overview)
- `_assessment/02-FINDINGS.md` (50 findings, IDs F-01 to F-50, with file:line)
- `_assessment/05-HEADER-AND-ADMIN-IMPROVEMENTS.md` (headers and admin)
- `_assessment/07-LOVABLE-ANSWERS-RECONCILED.md` (live facts and corrections)
- `_assessment/08-SEO-AEO-GEO-PLAN.md` (do not implement it here; some cleanup items overlap, see Phase 3)

If a finding in those files disagrees with the code you see, **trust the code, record the difference** in your report.

# STACK AND HOW THE PROJECT RUNS

Vite 5 + React 18 + TypeScript (strict mode OFF in the main config), React Router 6, Tailwind + shadcn/Radix, TanStack Query, react-helmet-async. Backend: Supabase via Lovable Cloud (Postgres with RLS, Auth, Storage, 24 Deno edge functions in `supabase/functions/`). Package manager: **bun** (`bun.lock` only). Quality commands that must pass before every commit batch:

- `bun run build`
- `bun run typecheck:selected`
- `bun run validate:sw`
- `bun x vitest run` (one test file, five tests)
- the route smoke test you create in Phase 0

**Install problem you will hit:** `bun.lock` points at a private package mirror, so `bun install --frozen-lockfile` fails (HTTP 403) outside Lovable. Do not "fix" it by committing a new lockfile. Make a **scratch copy** of the repo outside the working tree, install there from the public registry, and run checks there. State clearly in your report which checks you could and could not run. If you cannot run the build, you may not delete or change any code in that phase; produce candidate lists only.

# NON-NEGOTIABLE RULES

1. **Branch and PR only.** Work on branch `cleanup/phase-<PHASE>`. Never commit or push to `main`. Never force-push. Never rewrite git history. Never delete branches, tags or releases. Never change GitHub repo settings.
2. **No deploy, no publish, no database writes.** You have no database access and must not seek any. Do not call production endpoints. Do not run migrations. Do not deploy edge functions. Do not submit forms against a real backend.
3. **No secrets.** Never print, copy or commit secret values (keys, tokens, passwords, `.env` contents). Refer to variables by NAME only.
4. **No upgrades.** Do not bump or add any dependency version. Removing a dependency is allowed only when it passes the evidence rule below. (Lovable has security updates staged in its workspace; do not conflict with them.)
5. **No repo-wide reformatting or mass renames/moves.** Lovable syncs this repo two-way; large churn causes merge pain. No Prettier sweeps. Move or delete files only where a phase says so.
6. **Do not edit auto-generated or platform-owned files:** `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `.env`, `supabase/config.toml`, `bun.lock`, `deno.lock`, anything in `.lovable/`. If you think one needs a change, write it in the report and stop.
7. **Do not delete or squash any existing migration** in `supabase/migrations/` or `drizzle/migrations/`. They record what was applied to the live database.
8. **One concern per commit.** Commit messages: `cleanup(<area>): <what> [evidence in report]`. Small commits so any one can be reverted.
9. **Gate after every batch of changes:** run the quality commands above. If anything that passed in the baseline now fails, **revert that batch immediately**, record it in the report, and continue only if the reason is understood.
10. **Evidence rule for any deletion** (code, component, asset, dependency, script, doc). A thing may be deleted only if ALL are true:
    - (a) no static import (use an import-graph tool such as `knip`, `ts-prune` or `madge` in the scratch copy, plus your own check);
    - (b) no string reference anywhere in the repo: search `src/`, `supabase/functions/`, `public/`, `index.html`, `scripts/`, `.github/`, configs, and docs for the file name and its stem (this catches dynamic imports, `lazyWithFallback("...")` strings, `import.meta.glob`, CSS `url()`, edge-function email templates that use public URLs);
    - (c) the build output and the smoke test are unchanged after removal.
    If any check is uncertain, **do not delete.** Put it in `QUARANTINE.md` with the reason.
11. **Images are special.** `src/utils/assetResolver.ts` runs `import.meta.glob("/src/assets/**/*")`, and database rows (for example `projects.featured_image`, `hero_slides`, `services.featured_image`) can hold `/src/assets/...` strings. A file that no code mentions may still be used by a database row. **Never delete anything under `src/assets/` or `public/` unless the owner has supplied the list of image paths stored in the database and the file is not on it.** Until then, list such files as QUARANTINE.
12. **Stop and ask** (end your turn with the question) if: a check cannot be run; a deletion fails the evidence rule; a change would alter visible output; a change touches a protected area; or the instructions conflict with the code.

# PROTECTED AREAS (do not modify behaviour; read-only unless a phase says otherwise)

- Homepage hero: `src/components/homepage/EnhancedHero.tsx`, its video logic, `src/data/enriched-hero-slides.ts`, the hero video and poster files. (A cleanup request to "remove `v.load()`" is explicitly NOT approved.)
- `src/components/projects/PremiumProjectHero.tsx` and the `/projects` page behaviour.
- The top navigation structure and order and the "Start a Project" button (`src/components/Navigation.tsx`, `src/data/navigation-structure-enhanced.ts`, `src/data/service-registry.ts`).
- `/capabilities` (`src/pages/Capabilities.tsx`, `src/data/partnership-models.ts`) and the Contractor Portal (`src/pages/resources/ContractorPortal.tsx`).
- Brand tokens and the design system (`src/design-system/`, `tailwind.config.ts`, `src/index.css`): Navy #003366, Charcoal #36454F, Steel Blue #4A90A4, Inter, 8px radius. No visual changes.
- Public contact details: always from `src/constants/company.ts`; absolute URLs always from `SITE_URL` (the www domain). Do not change any phone, email, hours, address, or credential wording (WSIB, COR, Sto, insurance, crew size, years). Content and legal claims are the owner's decision, not yours.
- Admin pages must stay inside `UnifiedAdminLayout` with the existing role check.
- `public/documents/Ascent_Group_Construction_-_Sto_Listing_Certificate.pdf` and everything in `public/` that the site, emails or `sitemap.xml`/`robots.txt` point to.
- The Vite configuration: do not add `manualChunks` or change chunking (an earlier attempt caused a blank-page failure).

# OUTPUT FOLDER

Create (do not overwrite existing files) `_assessment/cleanup/` and keep these files there, one set per phase, appended not replaced:

- `CLEANUP-REPORT.md` (what you did, evidence, numbers before and after, checks run and results, anything you could not run)
- `DELETIONS.md` (table: path | size | type | evidence for rule 10 a/b/c | commit hash)
- `QUARANTINE.md` (table: path | why it looks unused | why you did not delete | what would settle it)
- `BASELINE.md` (Phase 0 only, see below)

# KNOWN CANDIDATES FROM THE AUDIT (verify each; none is pre-approved)

A. **Components with no importer** (finding F-44): `src/components/contractor/PremiumDocumentSuite.tsx`, `src/components/homepage/GCTrustStrip.tsx`, `src/components/shared/CertificationBadges.tsx`, `ProvenTrackRecord`, `CompanyIntroduction`, `CompanyOverviewHub`, `HomepageProcessStrip`, `PremiumServiceHero`, `ClientSelector`, `ClientValueProposition`, `PrequalPackage`. Also three dead header components: `src/components/sections/PageHero.tsx`, `src/components/PageHeader.tsx`, `src/components/ContentPageHeader.tsx`. (Some hold stale credential wording; deleting them is the point, but verify with rule 10 first. Do NOT delete `src/components/shared/PageHero.tsx`, which is the one live hero, with 28 importers.)

B. **Assets that no code mentions** (about 10 files, 2.6 MB): `src/assets/landing-bg-light.png`, `landing-bg-dark.png`, `ascent-logo-vertical-*.png`, `ascent-logo-horizontal-*-round.png`, `ascent-icon.png`, `ascent-icon-round.png`. Also `public/brand/logo-*.png`, `public/images/ascent-logo-nav-*.png`, `public/fonts/inter-400.woff2`. Rule 11 applies: QUARANTINE until the owner gives the database image-path list. Check `supabase/functions/**` email templates too, because they may use public URLs.

C. **Duplicate files:** the hero video exists twice (`public/hero-clipchamp.mp4` and `src/assets/hero-clipchamp.mp4`, 565 KB each; finding F-45). Report which copy is referenced and by what. Do not remove either in this task without the evidence rule; the video logic is protected.

D. **Dependencies that look unreferenced:** `@react-pdf/renderer`, `qrcode`, `@types/qrcode`, `react-spring`, `@types/dompurify`, `drizzle-orm`, `@tailwindcss/typography`, `@types/node`, `@types/react-dom`. Cautions: pages use `prose` classes, so check whether the typography plugin is registered before touching it (removing or adding it changes layout); `@types/*` packages are needed by the type checker even when nothing imports them; `drizzle-orm` goes with the `drizzle/` folder decision in Phase 6. Verify each with rule 10 plus a successful build.

E. **Stray and stale files:** the root file named `0===` (12 bytes, content `===tabIndex`, a shell accident); `documents/REPO_STRUCTURE_MAP.md` (generated 2026-03-09, still lists a `package-lock.json` that does not exist); 19 files in `docs/` (several are dated status or "implementation complete" reports); 12 files in `scripts/` (only `validate-sw.js` is referenced from `package.json`); `public/_redirects` and `public/_headers` (Netlify files that Lovable hosting ignores).

F. **Admin leftovers:** the five legacy routes in `src/routes/AppRoutes.tsx` that redirect to the dashboard (`stats`, `redirects`, `content-versions`, `navigation`, `navigation-builder`); the QA route `/admin/qa/quick-contact-form` (`QAQuickContactForm`) not in the menu; admin components with no importer (let the import-graph tool tell you).

G. **Broken tooling:** `.github/workflows/lighthouse-ci.yml` and `smoke-test.yml` run `npm ci` but only `bun.lock` exists, so they fail (finding F-34).

H. **Known small defects that are safe to fix** (Phase 3 list): see Phase 3.

# THE PHASES

## PHASE 0: Baseline and safety net (no code changes)

Goal: record exactly how the site behaves now, so every later phase can prove nothing changed.

1. Create branch `cleanup/phase-0`. Make the scratch copy and install there. Record tool versions.
2. Run and record in `_assessment/cleanup/BASELINE.md`: `bun run build` (result, entry bundle size and gzip size, count and total size of files in `dist/`), `typecheck:selected` (error count), `bun x vitest run`, `validate:sw`, `bun run lint` (total errors and warnings, plus a count per rule; the audit saw 360 errors, 326 of them `no-explicit-any`), full `tsc` error count with the strict config, number of `.ts/.tsx` files, size of `src/` and `public/`, number and total size of images, number of dependencies.
3. Write a **route smoke test** script (`_assessment/cleanup/smoke/smoke.mjs`, Playwright; if Playwright cannot run here, write it anyway and say so). It must open every public route from `src/routes/AppRoutes.tsx` (static routes plus one example each for `/services/:slug`, `/projects/:slug`, `/blog/:slug`, `/service-areas/:city`) against the **local preview build**, and record: HTTP status, `document.title`, number of `<link rel=canonical>`, first `<h1>` text, number of console errors and failed network requests, and whether the page contains visible text "Something went wrong" or the not-found view. Save the baseline JSON next to the script. Also capture desktop (1440x900) and mobile (390x844) screenshots of `/`, `/services`, `/contact`, `/estimate`, `/submit-rfp`, `/projects`, `/services/painting-services`, `/service-areas/toronto`, `/privacy` into `_assessment/cleanup/smoke/baseline/`. Do not submit any form.
4. Run the import-graph tool and write the raw candidate lists (unused files, unused exports, unused dependencies) to `_assessment/cleanup/raw/`. Do not act on them yet.
5. Commit only the new files inside `_assessment/cleanup/`. Open a PR titled `cleanup(phase-0): baseline and smoke test`. Stop.

Exit check: `git diff main --stat` shows changes only under `_assessment/cleanup/`.

## PHASE 1: Hygiene with zero behaviour change

1. Delete the stray root file `0===` (evidence: it is not referenced anywhere).
2. Add `.env.example` that lists variable NAMES only, with empty values (the names are `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`). **Do not delete, edit or untrack `.env`** and do not add `.env` to `.gitignore` yet: Lovable may require it in Git (this is an open question to Lovable). Record it in the report as a pending decision.
3. Extend `.gitignore` only with entries that cannot affect Lovable: `*.log`, `coverage/`, `.cache/`, `.env.local`, `.env.*.local`, `_assessment/cleanup/smoke/**/*.png` is NOT to be ignored (they are evidence). Do not ignore `.env` yet.
4. Remove files whose names show they are temporary or backup copies (`*.bak`, `*.orig`, `*.old`, `*~`) if any exist, using rule 10.
5. Fix `.github/workflows/lighthouse-ci.yml` and `smoke-test.yml` so they use bun (`oven-sh/setup-bun`, `bun install`, `bun run build`) instead of `npm ci`. Add a third job step order: build, `typecheck:selected`, `validate:sw`, vitest. If the install problem makes `bun install --frozen-lockfile` fail on GitHub runners, say so in the report and use `bun install` without the frozen flag. Do not change workflow triggers. Do not touch any secret.
6. Run the gates and the smoke test; the smoke JSON must equal the baseline. PR `cleanup(phase-1): hygiene`. Stop.

## PHASE 2a: Dead-code candidate list (no deletions)

1. Using the raw lists from Phase 0 and the known candidates A to F, build `_assessment/cleanup/DEAD-CODE-CANDIDATES.md`. For every candidate give: path, size, last changed (git log date), rule 10 results (a, b, c), your confidence (High/Medium/Low), and a recommendation (DELETE / KEEP / QUARANTINE).
2. Also list unused exports inside live files (functions, constants, types, hooks) that the import-graph tool reports, grouped by file, with the same evidence.
3. Also list duplicates: components or helpers that do the same job (for example two newsletter forms: `src/components/blog/NewsletterSection.tsx` and `src/components/footer/NewsletterBackend.tsx`; two structured-data helpers: `src/utils/structured-data.ts` and `src/utils/seo/structured-data.ts`; two image registries: `src/data/hero-images.ts` and the map inside `Wave1ServicePage.tsx`). Recommend which to keep. Do NOT merge anything in this phase.
4. No source file may change. Commit only the report. PR `cleanup(phase-2a): dead-code candidates`. **STOP and wait for the owner's written approval of the DELETE list.**

## PHASE 2b: Delete the approved dead code

The owner will paste an `APPROVED:` list under this prompt. Delete **only** those paths, in small commits (one area per commit: components, then hooks/utils, then dependencies). After each commit run the gates and the smoke test. For every dependency removal, remove it from `package.json` only, **do not regenerate `bun.lock`**; list the removals in the report so the owner can ask Lovable to refresh the lockfile. Update `DELETIONS.md` and `QUARANTINE.md`. PR `cleanup(phase-2b): remove approved dead code`. Stop.

## PHASE 3: Small safe bug fixes (behaviour-preserving or strictly a bug)

Do only items marked SAFE. Each is its own commit with a before/after note. Skip anything marked ASK and list it.

SAFE:
- F-01 and F-40 (SEO): remove the two `<SEO structuredData={citationSchema} />` elements from `src/components/Footer.tsx` (they override every page's title and canonical) and make `src/components/SEO.tsx` append the brand to a title only if the title does not already contain "Ascent". Keep the schema content; move `citationSchema` data into the single business entity only if it cannot cause duplicate JSON-LD. Remove the static `<link rel="canonical">` from `index.html`. Smoke check: each route has exactly one canonical equal to its own URL, and its own title.
- Five native `confirm()` calls: replace with the existing `ConfirmDialog` (`src/components/admin/ConfirmDialog.tsx`) in `src/pages/admin/DocumentsLibrary.tsx`, `src/pages/admin/EmailTemplates.tsx`, `src/components/admin/FeaturedServicesManager.tsx`, `src/components/admin/ServicesListManager.tsx`, `src/components/admin/WhyChooseUsManager.tsx`. Same delete behaviour, no layout change. Use toasts, never `alert`.
- Legal pages navbar: remove `/privacy`, `/terms`, `/accessibility` from `heroPageExact` in `src/components/Navigation.tsx` so the navbar is readable on those white pages. This is the only edit allowed in that file.
- `serviceHeroes` keys in `src/data/hero-images.ts`: add `building-envelope-solutions` and `interior-buildouts-finishing` pointing at the same images as the old keys; remove the dead keys (`protective-coatings`, `tenant-improvements`, `metal-panel-systems`, `building-envelope`, `interior-buildouts`) only after confirming nothing reads them.
- Sidebar badge and dashboard counts: make `src/components/admin/UnifiedSidebar.tsx` and `src/pages/admin/Dashboard.tsx` count new `rfp_submissions` and new `quote_requests` as well as new contacts (read-only queries; the `status` column exists on both). Check the real status values first; if `rfp_submissions` has no `new` status, stop and ask.
- F-24: allow Unicode letters in the contact name pattern (`src/pages/Contact.tsx` and the server check in `supabase/functions/send-contact-notification/index.ts`; edit the function file but note it will NOT deploy from Git: Lovable must deploy it).
- F-48: replace the real-looking phone placeholder `(647) 123-4567` and `John Smith` in `Contact.tsx` with neutral placeholders.
- `InboxDetailDialog.tsx`: when the row comes from `quote_requests`, hide the notes box (the table has no `admin_notes` column) and offer only the statuses its CHECK allows (`new`, `contacted`, `quoted`, `won`, `lost`), so saving cannot fail. No database change.

ASK (list, do not change): F-02 and F-03 credential wording; F-17 "24/7"; F-27 legal "last updated" dates; F-46 service-worker conflict (index.html purges while `main.tsx` registers; choose one, but this affects caching after every deploy); F-16 analytics consent; F-12/F-13 email architecture; F-14 direct inserts; F-30 admin login; anything touching copy.

After Phase 3 run gates and smoke; the **only** allowed smoke differences are: canonical/title now correct on all routes, and the navbar on the three legal pages. PR `cleanup(phase-3): safe fixes`. Stop.

## PHASE 4: Lint and type hygiene

Goal: reduce the error count safely; do not change behaviour and do not weaken the rules.

1. Run `eslint --fix` only for rules marked auto-fixable, in batches by folder (admin, then pages, then components, then utils). Review the diff of each batch.
2. Replace `any` (the audit saw 326 `no-explicit-any` errors) with `unknown` or real types, starting in the revenue-critical and smallest files: form schemas and submit handlers (`src/pages/Contact.tsx`, `Estimate.tsx`, `SubmitRFPNew.tsx`), `src/components/admin/inbox/*`, `supabase/functions/submit-form`. Use the generated Supabase types; do not edit them. Never silence an error with `// @ts-ignore`, `eslint-disable` on a whole file, or by loosening `eslint.config.js`.
3. Fix the six errors in the strict config so `typecheck:selected` stays at zero and, if the strict config already runs clean, extend `tsconfig.selected-strict.json` to include newly cleaned folders. Do not turn on `strict` globally.
4. Remove `console.log` debug output that prints data (leave `console.error` in error paths). Remove commented-out blocks larger than 5 lines only if they are plainly dead code.
5. After each batch: gates and smoke. Stop the batch and revert if the TypeScript error count rises.
6. Add tests, not features: unit tests for the form validation schemas and for any helper you changed. Do not add heavy test infrastructure.
7. Report lint/type counts before and after. PR `cleanup(phase-4): lint and types`. Stop.

## PHASE 5: Efficiency (only with measured proof, no visual change)

1. **Lazy-load the admin area and the chart libraries** from the public entry with `React.lazy` (admin routes only). The audit measured an entry bundle of 1,353 KB (306 KB gzip) that includes admin and chart code (finding F-31). Do **not** add `manualChunks`. Record entry size before and after; keep only changes that shrink it and leave all public routes identical in the smoke test.
2. Remove unused CSS, unused Tailwind safelist entries and unused font files only if rule 10 passes. Note: `index.html` uses the Barlow font while `tailwind.config.ts` sets Inter and your brand rule says Inter; **do not change fonts**, only report which one renders, with a computed-style check in the smoke test.
3. Images: for files that are definitely referenced, report oversize files and propose conversions (WebP) in the report; convert nothing that a database row may reference without the owner's list (rule 11).
4. Remove duplicated work in effects or queries only where React Query already caches (no behaviour change). Mention but do not touch anything in protected areas.
5. Report before/after numbers. PR `cleanup(phase-5): efficiency`. Stop.

## PHASE 6: Database and backend hygiene (AUDIT AND DRAFTS ONLY)

You have no database access. Produce text for the owner to run through Lovable.

1. Write `_assessment/cleanup/db/READ-ONLY-QUERIES.sql`: SELECT-only statements (no INSERT/UPDATE/DELETE/DROP/ALTER) the owner can run in Lovable Cloud to measure bloat: table sizes and row counts for every `public` table (`pg_total_relation_size`, `reltuples`); dead-row counts; indexes never used (`pg_stat_user_indexes`); tables with no references from `src/` or `supabase/functions/` (you work out which names the code uses, then list tables the code never touches, for example `content_versions`, `navigation_menu_items`, `search_console_data`, and the Search Console tables); row counts and date ranges of `audit_log`, `error_logs`, `admin_notifications`, `email_send_log`, `suppressed_emails`, `auth_account_lockouts`, rate-limit tables, preview-token tables; storage object counts and total bytes per bucket, and objects in `rfp-attachments` not referenced by `rfp_submissions.attachment_urls`; the list of every image path string stored in database columns (to settle rule 11).
2. Write `_assessment/cleanup/db/CLEANUP-PROPOSALS.md`: for each candidate (unused table, stale rows, orphan storage files, unused column, redundant index) say what it is, the evidence from the code, the risk, a rollback plan, and a draft SQL statement. Put draft SQL **only** in `_assessment/cleanup/db/proposed-sql/`, never in `supabase/migrations/` or `drizzle/`. Every draft must be wrapped so it can be inspected first, and nothing may be destructive without a prior backup note. Order: archive/export first, delete last.
3. Report the repo-side schema facts: which migration folder is canonical, the two migrations dated November 2026 with 12-digit names (`202611020001_…`, `202611020002_…`), whether `drizzle/` and `drizzle.config.ts` are used by anything, and the mismatch between `supabase/migrations/` (33 files) and the 32 migrations Lovable reports as applied. Do not move or delete migration files.
4. Edge functions: for each of the 24 functions state whether the frontend or another function calls it, and mark never-called ones as candidates (do not delete). Flag duplicate email logic across the Resend and Lovable email stacks as a separate future project.
5. PR (docs and SQL drafts only) `cleanup(phase-6): database hygiene audit`. Stop. **The owner takes a backup and runs the queries; do not proceed until the results are pasted back.**

## PHASE 7: Repository and documentation cleanup, new README

1. **Docs triage.** For every file in `docs/`, `documents/` and `scripts/`, write a table: path | what it is | last changed | still accurate? (check each claim against the code) | recommendation KEEP / UPDATE / ARCHIVE / DELETE. Obvious stale items: dated status or "complete" reports, files that mention files that no longer exist, the structure map, generated test results. Scripts: keep `validate-sw.js` and anything referenced by `package.json`, CI or docs; list the rest with a verdict. Present the table and **STOP for the owner's approval** before deleting or moving anything. After approval: delete DELETE items; move ARCHIVE items to `docs/archive/` with a one-line header saying they are historical; fix UPDATE items.
2. **Hosting files.** `public/_redirects` and `public/_headers` are ignored by Lovable hosting. Move them to `docs/archive/netlify-config/` with a note explaining why (they record the intended redirects and headers if the site ever moves host). Do not leave behaviour-changing copies anywhere.
3. **README.md rewrite** (replace the long history-style README; keep it accurate and short enough to read in ten minutes). Required sections, in this order:
   - What this repo is, the live URL (`https://www.ascentgroupconstruction.com`), and what the company does, in neutral factual wording. **Do not repeat marketing or credential claims** (the old README says the site makes no "24/7" claim, but the site does say 24/7; avoid asserting things you cannot verify).
   - Tech stack (verified from `package.json`).
   - Quick start with bun, plus a plain note about the private-mirror lockfile problem and the workaround.
   - Scripts table (every script in `package.json`, one line each).
   - Environment variable NAMES (client side and backend secret names; never values).
   - Project structure: a tree to depth 2 with one line per folder, verified against the repo after cleanup.
   - Where content lives: what is in code (`src/data/`, `src/constants/company.ts`) and what is in database tables managed in the admin panel; where public contact details come from.
   - Backend: the 24 edge functions, one line each (verified), the email flow as it actually is, and the storage buckets.
   - **Deployment and release workflow** exactly as Lovable confirmed: branch, PR to `main`, Lovable sync, check preview, **Publish → Update is manual**; database migrations and edge functions are NOT deployed by Git pushes and are applied through Lovable; deploy order migration, then functions, then frontend; backup via Cloud → Advanced settings → Export data; rollback notes (a Git revert does not restore the database).
   - Quality gates (the four commands) and how to run the smoke test.
   - Protected areas and brand rules (short, from this prompt).
   - Pointers to `docs/` and to `_assessment/` for the audit.
   Update `CONTRIBUTING.md` to match (branching, PR rules, the gates, never commit secrets). Add `docs/CHANGELOG.md` with one dated entry per cleanup phase.
4. Check every relative link and every command in the README and docs works or is marked as not runnable.
5. PR `cleanup(phase-7): repo and docs`. Stop.

## PHASE 8: Final verification and handoff

1. Run all gates and the smoke test against a fresh build. Compare with the Phase 0 baseline. Produce `_assessment/cleanup/FINAL-REPORT.md` with: table of before/after numbers (files, size of `src/`, bundle sizes, lint errors, type errors, dependencies, repo size), list of every deletion with commit hash, the QUARANTINE list, everything you skipped and why, and a screenshot comparison of the nine baseline pages (describe any pixel-level difference you can see; none is expected).
2. Confirm the smoke JSON differs from baseline **only** in the items Phase 3 intended.
3. Write the **release note for the owner**: merge order of the phase PRs, what to check in the Lovable preview (list the 10 pages), the Publish → Update step, what to look at on the live site afterwards, and the rollback (revert the merge commit, then Publish; the database is untouched by these PRs).
4. State clearly what you could not verify. No claim of "everything works" without evidence.
5. Open a final PR with the reports only. Stop.

# HOW TO REPORT

At the end of each phase reply with: (1) what you changed, in plain English, (2) the numbers before and after, (3) the checks you ran and their results, (4) what you did NOT do and why, (5) the questions you need answered. Keep it short. Link the report files. If any check failed or could not run, say that first.

=== END PROMPT ===

---

## Kickoff lines for later phases (paste under the prompt)

- **Phase 2b:** `PHASE = 2b` and below it `APPROVED:` followed by the paths you approved from `DEAD-CODE-CANDIDATES.md` (anything you do not list stays).
- **Phase 6 follow-up:** after you run the read-only queries in Lovable, paste the results under `DB RESULTS:` and say `PHASE = 6b: refine the proposals using these results; still no destructive SQL in migrations folders`.
- **Phase 7 second step:** `PHASE = 7b` and `APPROVED DOC ACTIONS:` with your decisions on the docs table.

## Things only you (or Lovable) can supply before the risky phases

| Needed for | What | From |
|---|---|---|
| Any asset deletion (rule 11) | The list of image path strings stored in the database (the query is in Phase 6, step 1) | You, via Lovable Cloud |
| Dropping `.env` from Git | Whether Lovable requires `.env` in the repo | Lovable (question R13 in file 06) |
| Dependency removals | Lovable refreshes the lockfile after the PR merges | Lovable |
| Edge-function edits (Phase 3, F-24) | Lovable deploys the changed function; Git pushes do not | Lovable |
| Database cleanup | A backup (Cloud → Overview → Advanced settings → Export data) before running anything | You |
| Docs and script deletions | Your approval of the Phase 7 table | You |

## Why this is safe, in short

Codex works on branches, one phase per pull request, with a recorded baseline of build, type check, tests and a page-by-page smoke test. Nothing is deleted without three independent proofs that it is unused. Images and database-referenced files are protected until you supply the database list. The database is never touched by Codex, only audited. Protected areas (homepage hero, navigation, brand, capabilities page, contractor portal, contact details, claims) are off limits, and a phase that changes the smoke test unexpectedly is reverted.

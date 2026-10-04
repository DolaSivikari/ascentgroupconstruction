# 16. Risk review and safe delivery plan

Prepared by Claude on 3 October 2026, after the owner judged file 15 too risky. **This file overrides files 12, 14 and 15 wherever they conflict.** It covers:

1. The blind spots, each with evidence from the code.
2. What changes in the design.
3. The safety net that must exist before any risky phase.
4. The release protocol for every PR.
5. The rollback playbook.
6. The revised order.
7. Rules every Codex prompt must include.

The database draft has been updated to match: [sql/0003_site_control_and_health.sql](sql/0003_site_control_and_health.sql) (v2).

**Severity:** 🔴 could break the live site or lose leads · 🟠 could quietly damage SEO, trust or data · 🟡 cost or confusion.

---

## 1. Blind spots found

### A. Environment and process

| # | Blind spot | Evidence | Sev | Consequence if ignored | Fix in this plan |
|---|---|---|---|---|---|
| A1 | **The Lovable preview almost certainly uses the live database** | The repo has one `.env` with one database address. `previewAuthStorage.ts` shares one login across preview surfaces. Lovable's earlier answers never confirmed a separate database (question R17 unanswered) | 🔴 | Every "test it in the preview" step in files 12 to 15 writes live data. A test edit to a page, a test lead or a test flag would be live instantly | Section 3, S0-3: confirm with Lovable. Until disproven, **treat the preview as production.** Test only with drafts, admin-only canary mode, and clearly marked synthetic rows that are deleted afterwards. Ask Lovable whether a database branch or a second project for staging is possible |
| A2 | **Many merged but unpublished PRs, published as one big batch** | Merging syncs to Lovable, but Publish is manual. Several Codex PRs (#43, P3a, P4a, and R1 next) could be live at once | 🔴 | If something breaks you can't tell which change caused it, and rollback means rolling back several | Section 4: **publish after every PR**, then verify, before merging the next |
| A3 | **Parallel work on the same files** | Files 12, 14 and 15 allow parallel phases (R1 with S1, Leads with R-phases). They share `AppRoutes.tsx`, `UnifiedSidebar.tsx`, `SEO.tsx`, `Navigation.tsx`, `PageHero.tsx` and `Index.tsx` | 🟠 | Merge conflicts resolved by guesswork, and silent regressions | Section 7, rule 2: **one Codex PR open at a time** touching public or shared files. Phases run in sequence |
| A4 | **Lovable's own AI editing code during Codex work** | Two-way GitHub sync. You also ask Lovable for changes (for example Tiptap) | 🟠 | Conflicting edits; Lovable could revert Codex work or overwrite generated files | Section 4: a **change freeze**. While a Codex PR is open, ask Lovable for nothing except the agreed install or migration steps |
| A5 | **Two sources of truth after content becomes editable** | Text will exist as a code default **and** possibly a database override | 🟠 | You (or Lovable) change text in code and the site keeps showing the old override. "I changed it but nothing happened" comes back | Section 2, D4: each override stores a fingerprint (hash) of the code default it replaced. The admin shows "**Code changed since this override was published**" and offers Keep or Revert |
| A6 | **Logged-in admins see the site differently from visitors** | Signed-in browsers read with admin rights. This already explains the Contact page problem (file 13, section 2.1) | 🟠 | You check your edits while logged in, they look fine, and visitors see something else | Release protocol: **verify every public change in a private or incognito window.** Site Health checks as a visitor. Canary mode (D3) is explicit about who sees what |
| A7 | **No production baseline to compare against** | Smoke tests check status codes and a brand string only (`scripts/smoke-test.sh:44-74`). No screenshot or text baseline of the 88 pages exists | 🔴 | A change can alter or blank a page section with no test noticing | Section 3, S0-1: **baseline screenshots and visible-text snapshots of all 88 pages** from production, plus a comparison gate on every PR |

### B. The "edit every page" design (file 15, section 7)

| # | Blind spot | Evidence | Sev | Consequence | Fix |
|---|---|---|---|---|---|
| B1 | **Wrapping hundreds of sentences in `<Slot>` across 88 pages is a huge, error-prone change** | Pages are large: `About.tsx` is ~560 lines, with copy spread through JSX and constants | 🔴 | One typo in a default (a curly apostrophe, en dash or non-breaking space) changes visible text. Reviewers can't check hundreds of string moves by eye | D1: **two-step "content modules" approach.** Step 1 moves copy into typed content files, a pure refactor proved by an automated identical-text test. Step 2 enables overrides |
| B2 | **The same text feeds visible content *and* Google's structured data** | `src/data/page-faqs.ts` is imported by 22 files. FAQ schema is built by `faq-schema.ts`, `schemaGenerators.ts` and `structured-data.ts` | 🟠 | Editing a visible FAQ answer leaves the old answer in the structured data. Google treats markup that doesn't match the visible content as a guideline problem | D1: the structured-data builders read the **same resolved content module** as the visible page. A test checks they match |
| B3 | **Shared data across pages** | `service-registry` (7 files), `service-area-cities` (7), `navigation-structure-enhanced` (6), `hero-images` (28) | 🟠 | Editing "one page" silently changes others | D1: shared content gets its **own module and admin entry** ("Shared: service names, used on 7 pages"). The admin lists every page that uses it |
| B4 | **Layout shift and flicker** when overrides arrive after first paint | Pages render in the browser. The file 15 design showed defaults first, then swapped | 🟠 | Text jumps (worse Core Web Vitals, a sloppy look), worst on phones | D2: overrides load **in parallel with the app code** and render waits up to 600 ms for them. After that, defaults render and swapping is limited to below-the-fold slots. A repeat visit uses the cached value immediately |
| B5 | **A malformed saved value crashes a page** | JSON values with a shape that doesn't match the component | 🔴 | A white screen or error boundary on a live page | D1: every module has a **Zod schema**. Invalid override values are dropped at render (code default used), logged once, and flagged in Site Health. The admin validates with the same schema before saving |
| B6 | **Text length breaks the design** | A fixed hero and card layouts | 🟠 | Long headlines wrap badly or overflow on phones | D1: length limits come from the design, for each field. The admin blocks publishing over the limit and shows a live preview at 390 px and 1440 px |
| B7 | **Rich text as an attack path** | An admin can enter HTML | 🟠 | A stolen admin login injects scripts into every visitor's page | A DOMPurify allow-list at render (the existing dependency). Links limited to https, mailto, tel or internal paths. Images limited to the media bucket host. **Tiptap only in the admin bundle** (B8) |
| B8 | **Tiptap leaking into the public bundle** | Tiptap 3 is now a dependency. The public bundle is already large (finding F-31) | 🟡 | Slower public pages | Public rendering uses DOMPurify only and never imports `@tiptap/*`. A bundle-check gate fails the PR if `@tiptap` appears in a public chunk |
| B9 | **Renaming a content key in code orphans live overrides** | Keys are strings | 🟠 | Edited text silently reverts to the default | A rule that **keys are permanent** (an alias map if renaming is unavoidable). The admin lists "orphaned overrides" with a re-link action |
| B10 | **Hiding a page or setting noindex by mistake** | File 15 allowed both with immediate effect | 🔴 for SEO | A key page vanishes from Google, or nav links break | v2 SQL: settings are drafts that need Publish. **Protected pages** (home, services, contact, GC, PM, emergency, estimate, submit-rfp, prequalification, plus anything in the nav) cannot be hidden or set to noindex from the admin. A confirmation lists the incoming internal links, and Site Health alerts after publish |
| B11 | **Hidden pages stay in `sitemap.xml` and `llms.txt`** | These are fixed files in `public/` (file 13, section 2.3) | 🟠 | Google keeps finding a page that says "not found" (a soft 404) | Hiding a page shows "Sitemap update needed: run the generator and publish". The nightly check flags sitemap URLs that render as not found |
| B12 | **Edits can't reach search engines that don't run JavaScript** | Pages are built in the browser (F-07). Prerendering is still undecided | 🟡 | Edits help visitors and Google (which renders), not AI crawlers | Documented. If prerendering is adopted later, admin publishing must trigger a rebuild. That is a separate decision |

### C. Monitoring (file 15, section 3)

| # | Blind spot | Evidence | Sev | Consequence | Fix |
|---|---|---|---|---|---|
| C1 | **Changing `submit-form` for a "dry-run" puts every lead at risk** | Every public form depends on that function. The existing production check already tests it **without changing it** (an OPTIONS request, `smoke-test.sh:76-90`) | 🔴 | A bug in the dry-run branch could break real submissions | **Dropped.** Keep the OPTIONS check. Add a **separate** read-only `health-ping` function that only confirms the database answers. `submit-form` is untouched |
| C2 | **Lovable hosting may block automated browsers** | Earlier status: "Public-site HTTP checks from this environment have returned 403" (`05-IMPLEMENTATION-STATUS.md`, F-32) | 🟠 | Constant false "site down" alerts, or a crawler that checks nothing | S0-4: a **pilot week with alerts off**, and a `blocked` run status. If GitHub runners get 403s, ask Lovable to allow a user-agent token, or crawl the preview (but see A1) |
| C3 | **GitHub Actions minutes** | Uptime every 30 minutes means 1,440 runs a month, and each run is billed as at least 1 minute. Repo visibility (private or public) is unknown | 🟡 | A private repo can exceed the free 2,000 minutes a month and stop **all** CI | **No 30-minute uptime job on GitHub.** Use the existing 6-hourly production check plus a **free external uptime monitor** for real-time alerts. The nightly crawl is budgeted (88 pages × 2 viewports, about 15–20 minutes). Confirm the repo's visibility and plan |
| C4 | **The crawler pollutes your own data** | It loads pages that call the database, analytics (if consent isn't rejected) and `ipapi.co`, and it records its own browser errors in `error_logs` | 🟡 | Fake visits, fake errors, wasted third-party quota | The crawler sets the consent-rejected cookie, sends `AscentSiteHealth/1.0` as its user agent, and blocks `ipapi.co`, Google and maps. `errorLogger` skips that user agent |
| C5 | **Alert fatigue** | Many warnings on day one | 🟡 | Real alerts get ignored | The first full run is saved as the **baseline**. Only *new* errors email you. Warnings go only in the Monday digest. Issues can be ignored with a reason, stored in `site_health_issue_states` |
| C6 | **Time zones** | GitHub cron runs in UTC | 🟡 | The "3 am" run moves by an hour with daylight saving | Documented. It runs at 07:00 UTC (3 am in summer, 2 am in winter) |

### D. Data, security and access

| # | Blind spot | Evidence | Sev | Consequence | Fix |
|---|---|---|---|---|---|
| D-1 | **One super-admin account** | Lovable: one `user_roles` row | 🔴 for continuity | A lost password or a lockout means no admin at all. A stolen password means full control | Before S3: a **second named super admin**, MFA if Supabase Auth on Lovable allows it (to confirm), a written recovery path, and the last-super-admin guard (0001) |
| D-2 | **Signed-in non-admins could read drafts** | Column grants can't differ per user | 🟠 | Draft leaks | Fixed in 0003 v2: signed-in non-admins get no content rows and see code defaults |
| D-3 | **Migrations applied by hand through Lovable** | No automatic migration pipeline (Lovable answers) | 🟠 | Code deployed before its tables exist leads to errors | Section 7, rule 4: every feature that needs a new table **checks the table exists** and degrades to today's behaviour if it doesn't. A database error code for "table not found" counts as "feature off", never as a crash |
| D-4 | **No content export** | Overrides live only in the database | 🟡 | A wrong bulk action or a restore loses edits | An admin **"Export all content (JSON)"** and Import (dry-run diff first), and an automatic weekly export in the digest |
| D-5 | **Retention** | Health and history tables grow | 🟡 | Cost and clutter | Keep 90 days of health data and every published version (small). A cleanup job is drafted later |

---

## 2. Design changes (replace file 15, section 7)

**D1. Content modules instead of scattered slots.**
- Each page gets `src/content/pages/<page-id>.ts`, which exports:
  - a Zod `schema`;
  - a `defaults` object holding **today's exact text**, moved verbatim;
  - `meta`: for each field, its kind, length limit, label, help text, claim flag, and which section of the page it belongs to.
- Shared content (FAQs, service names, city list) gets `src/content/shared/<id>.ts`.
- Pages call `const c = usePageContent('about')`. The hook returns `defaults` deep-merged with *valid* published overrides (B5), and structured-data builders call the same function (B2).
- **Step 1 is a pure refactor with no database involvement.** It moves the text into modules. A **text-equality test** renders every affected route before and after and compares visible text and the JSON-LD byte for byte. The PR is rejected if anything differs.
- **Step 2** turns on the override layer, page by page.
- The admin's list of editable content is generated from `meta`, with no regex scanning.

**D2. Loading without flicker.**
- `index.html` starts the overrides request alongside the app code: a `<link rel="preload">`-style fetch of a tiny JSON from the database REST endpoint, with only published values for the requested page plus shared modules.
- The app waits up to 600 ms for it. If it arrives late or fails, the page renders defaults. Only below-the-fold sections may update afterwards; above-the-fold sections keep the defaults for that visit and use the cached value next time.
- If the flags request fails, overrides are off (safe default).

**D3. Kill switch and canary** (`site_flags`, 0003 v2):
- `content_overrides = false`: every page shows code defaults instantly, without deleting anything. A big red "**Restore all pages to code defaults**" button sits in Website → Pages.
- `content_overrides_admin_only = true`: only signed-in admins see overrides. Use this for one week per wave before switching it off for visitors.

**D4. Code-change detection.** Each published override stores the hash of the code default it replaced. If the code default later changes, the admin flags the conflict (A5).

**D5. Settings are content too.**
- Page SEO, the header image and the hidden flag are entries of kind `seo`, `image` or `flag`. They go through draft, preview, publish, history and rollback.
- Protected pages can't be hidden or set to noindex (B10).

**D6. Monitoring without touching lead paths** (C1–C5): the crawler is read-only and identified; there's a separate `health-ping` function, a pilot week, baseline-relative alerts, and an external uptime monitor.

---

## 3. Safety net (S0): must exist before S1–S4, R3 and R4

| Step | What | Done when |
|---|---|---|
| **S0-1** | **Production baseline of all 88 pages:** screenshots at 1440 and 390 px, visible-text snapshot, title, H1, canonical, JSON-LD hash and console errors. Stored as a CI artifact and summarised in `_assessment/baseline/` | The run lists all 88 URLs with no unknowns, and the owner has looked at the summary |
| **S0-2** | **A comparison gate on every PR that touches public files:** build the PR, run the same capture against the local production build, and diff it against the baseline (text exact; screenshot pixel diff ≤ 0.1 % per page, unless the PR declares the page intentionally changed and attaches before/after images) | The gate fails on a deliberately altered test page and passes on an unchanged build |
| **S0-3** | **Environment facts confirmed with Lovable** (read-only questions): Does the preview use the live database? Can we get a database branch or staging project? Does Lovable keep restorable published versions, and how is one restored? Does hosting block automated browsers or GitHub IP ranges? Is MFA available? | Answers recorded in `_assessment/admin-upgrade/ENVIRONMENT-FACTS.md` |
| **S0-4** | **Monitoring pilot:** the nightly crawl runs for 7 days with alerts off and its results written as `baseline` runs | 7 runs complete with no `blocked` status, and noise has been reviewed |
| **S0-5** | **Access safety:** a second super admin, MFA if available, the recovery path written down | Two people can log in, and the guard is tested |
| **S0-6** | **Repo and CI budget:** confirm the repo's visibility and Actions minutes; set up the free external uptime monitor | Monthly minute estimate written down |

---

## 4. Release protocol (every PR, every phase)

1. **Before merge**
   - All gates green: tests, both type checks, build, `validate:sw`, the route audit, lint at or below baseline, the **comparison gate (S0-2)** and the **bundle gate** (B8).
   - The PR lists every public page it intentionally changes, with before/after images.
2. **Change freeze.** No Lovable AI code edits while the PR is open. If Lovable must install something or apply a migration, do that first, then rebase the PR.
3. **Database first.** If the PR needs SQL:
   - back up (Cloud → Advanced → Export);
   - apply through Lovable;
   - run the verification queries from the SQL file;
   - only then merge the PR.
4. **Merge one PR → Publish → verify, then the next.** Never let merged PRs pile up unpublished.
5. **Verify after publishing,** in a **private window**, within 30 minutes:
   - run Site Health "Check now" (once S1 exists), or the manual checklist for that phase;
   - check the home page, contact form page, one service page, and the page(s) the PR changed, at phone width;
   - submit **no** real forms.
6. **Watch window: 24 hours.** Check error logs and the next nightly run. If there's a new 🔴, go to section 5.
7. **Content waves** (S3, S4) also follow the canary rule: one week with admin-only overrides, then visitors.

---

## 5. Rollback playbook (written before it's needed)

| What broke | First action (minutes) | Then |
|---|---|---|
| Edited page content looks wrong | Admin → Pages → that page → History → **Rollback** (one entry or the whole page) | Fix the draft, preview, publish again |
| Many pages wrong after content edits | **"Restore all pages to code defaults"** (kill switch) | Investigate with the switch off; turn it back on when fixed |
| The site broke after a publish | Lovable: restore the previous published version, if Lovable supports it (S0-3); otherwise **revert the merge commit in GitHub, then Publish** | Reopen the PR with a fix and a test that would have caught it |
| A migration caused errors | Frontend features degrade by design (D-3). If not, roll back the frontend first | Run the rollback block in the SQL file **only after exporting the affected rows** |
| An edge function misbehaves | Ask Lovable to redeploy the previous version of that function | Fix in a PR, then redeploy |
| Leads stopped arriving | Check the 6-hourly production check, error logs and the inbox. Roll back the latest publish if it touched forms | Lead paths are only touched in file 12's P2/P6/P7, behind a flag that can be switched back |
| A false alert flood | Mark the issue Ignored with a reason, or switch alerts off in Site Health settings | Tune the check |

---

## 6. Revised order (overrides files 12, 14 and 15)

| # | Phase | Touches the public site? | Gate to start |
|---|---|---|---|
| 1 | **S0-3, S0-5, S0-6** (questions, access, budget). No code | No | Now |
| 2 | **S0-1, S0-2** baseline and comparison gate | No (CI only) | Now |
| 3 | **R1** fixes and honest admin | Minimal and declared (Performance card, Contact settings read) | S0-1 and S0-2 merged |
| 4 | **S1 + S0-4** monitoring (crawler, ingest, Site Health page), pilot week with alerts off | No | R1 published and verified |
| 5 | **R2** settings that reach the site (About through modules, D1 step 1 for About) | Declared | Pilot running |
| 6 | **R3** new admin shell and theme | No (admin only) | — |
| 7 | **Leads P1 → P2 → P3b → P4b** (file 12) | P2 server-side only | File 12's SQL reviewed |
| 8 | **S2** Pages hub plus SEO, header and hide settings (protected list, drafts) | Declared | 0003 v2 applied; R3 merged |
| 9 | **S3a** content modules refactor, wave 1 (text-equality test, no overrides) | Must be identical | S2 published |
| 10 | **S3b** override layer for wave 1, admin-only canary for a week, then visitors | Yes (only when you edit) | S3a verified identical |
| 11 | **R4** smooth editors (Tiptap) and **R5** media | Declared | — |
| 12 | **S4** waves 2–3 (same a/b pattern) | As S3 | — |
| 13 | **G1–G2** credentials vault and prequal builder; **S5** insights; R6; G3–G5 | Declared | — |
| 14 | **File 12's P6–P8** (new intake forms behind a flag, then switch-over, then History) | Yes, flagged | All lead features verified |

---

## 7. Rules every Codex prompt must include (add to files 12, 14 and 15)

1. **Read file 16 first.** It overrides the other files where they conflict.
2. **Only one PR open at a time** that touches public pages or the shared files (`AppRoutes.tsx`, `UnifiedSidebar.tsx`, `UnifiedAdminLayout.tsx`, `SEO.tsx`, `Navigation.tsx`, `PageHero.tsx`, `Index.tsx`, `src/data/*`, `src/content/*`). If another such PR is open, stop and say so.
3. **The comparison gate (S0-2) is mandatory** for any PR that touches `src/pages`, `src/components` (non-admin), `src/data`, `src/content`, `public/`, `index.html` or `SEO.tsx`. Intended differences must be listed by page with images. Anything else fails the PR.
4. **Feature detection for new tables or functions:** a missing table or function (PostgREST "not found" errors, HTTP 404/400 from RPC) means **feature off**, with today's behaviour. Never a crash, never a blank page.
5. **Never modify `submit-form` or any lead-path function** except in the file 12 phases that explicitly own it.
6. **No test writes to the live database.** The preview is treated as production (A1). Tests use mocks. If a manual check needs a row, write it as owner instructions with a marked synthetic value and the delete step.
7. **Content keys are permanent.** Renaming one needs an alias entry and a test.
8. **Public bundle:** never import admin-only libraries (`@tiptap/*`, chart libraries) into public routes. The bundle gate enforces this.
9. **Report** the gate results, the comparison-gate summary (pages compared, identical, intentionally changed), and the exact owner steps in release-protocol order.

---

## 8. Questions for you (all quick)

1. Is the GitHub repository **private or public**? This decides the CI minute budget (C3).
2. Who should be the **second super admin**? (D-1)
3. Shall I write the **S0-3 questions for Lovable** as a ready-to-paste message?
4. Which **free uptime monitor** do you prefer, or shall I recommend one with setup steps?

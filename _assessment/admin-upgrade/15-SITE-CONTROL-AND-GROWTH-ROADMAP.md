# 15. Site control centre and growth roadmap

> **Superseded in part by [file 16](16-RISK-REVIEW-AND-SAFE-DELIVERY-PLAN.md).** The goals in sections 1–5 still stand. These parts are replaced:
> - **Section 3.1:** no change to `submit-form`, and no 30-minute uptime job on GitHub.
> - **Section 6:** the order of work.
> - **Section 7:** content slots are replaced by content modules plus a kill switch.
> - **Section 9:** the Codex prompt.
>
> Use file 16, and SQL 0003 **v2**.

Prepared by Claude on 3 October 2026. This comes after R1–R6 in [file 14](14-ADMIN-REDESIGN-CODEX-PROMPT.md) and the Leads phases in [file 12](12-ADMIN-UPGRADE-CODEX-PROMPT.md).

**Owner goal:** "A 100% connection between the admin and the website. Manage the frontend of every page from the admin, and have the admin watch all 88 pages for errors, warnings and mistakes, instead of checking them one by one. Services, projects, blogs, media, insights and more."

Database draft: [sql/0003_site_control_and_health.sql](sql/0003_site_control_and_health.sql) (for review; not applied).

---

## 1. What "100% connected" can honestly mean

| You will control from the admin | Stays in code (a developer or Codex changes it) | Why |
|---|---|---|
| Every **headline, paragraph, list, button label, link and image** on every page (as "content slots") | **Layout and design**: which sections a page has, their order and their look | Your approved design stays intact, and a mistaken edit can't break a layout |
| Each page's **SEO title, description, social image, noindex, header image and alt text** | **New page types** (a new kind of section, a new template) | These need code. A new *project, service, post or city page* does not; it is just data |
| **Hiding** a page (it shows "not found" and drops out of search) | The main **navigation order** and the "Start a Project" button (protected by your earlier decision) | Can be opened up later if you want |
| Projects, services, blog, documents, media, testimonials, hero slides (already planned in R2–R5) | Phone number and emails in the header and calls to action (kept in code as spam protection) | Shown read-only in the admin with the reason |
| Credentials and claims (vault, section 4) | | |

**Two technical facts you should know:**

1. **Edits go live immediately, without Lovable Publish.** Admin content is read from the database when the page loads. Code changes still need Publish → Update.
2. **Search engines.** Your pages are built in the browser (finding F-07). An admin edit shows for Google after it renders the page, the same as today's content. If you later add prerendering for search engines (file 08, S-02), admin edits would also need a rebuild. Plan for that when you decide on prerendering.

---

## 2. The control centre: one "Pages" hub

A new sidebar item, **Website → Pages**, lists **every public page** (about 88): static pages, 22 services, 11+ projects, blog posts and 17 cities. It is generated from the route registry (`src/routes/registry.ts`), the sitemap generator and the database, so a page can't be missing from it.

**Each row shows:**

| Column | Meaning |
|---|---|
| Page and URL | With a "View" link |
| Type | Static, service, project, post or city |
| **Health** | 🟢 / 🟡 / 🔴 from the latest automated check (section 3) |
| **SEO** | A score from length checks, a single H1, canonical, alt text and noindex |
| Editable content | "12 slots, 2 drafts" |
| Last edited | By whom and when |
| Leads (30 days) | From lead attribution, section 5 |
| Search clicks (28 days) | From Search Console, when connected |

Filters: "Has errors", "Has warnings", "Drafts waiting", "Not edited in 12 months", "No leads", and by type.

**Clicking a page opens its page cockpit, with five tabs:**

1. **Content.** Every editable slot on that page, grouped by section, in page order.
   - Each slot shows the current live text, the code default, and your draft.
   - Edit, then **Preview** (the real page with your drafts applied), then **Publish**, either one slot or the whole page.
   - **History** for each slot, with one-click **Rollback**.
2. **SEO and sharing.** Title and description with length meters, the Google snippet preview, the social image, noindex, and the canonical (read-only).
3. **Header image.** Choose from the media library, with alt text.
4. **Health.** The latest check result for this page: errors, warnings, broken links, missing alt text, load time, and a screenshot thumbnail if available.
5. **Insights.** Leads from this page, search clicks and queries, and conversion rate.

Database-driven pages (projects, services, posts) open their normal editor from the cockpit, so there's still one place to start.

---

## 3. Site health: the admin checks all 88 pages for you

### 3.1 How it works
- **A scheduled robot** runs as a GitHub Actions job, using the Playwright smoke test the project already has.
  - **Nightly**, it opens every URL in the live sitemap plus the static routes, in a real browser at desktop and phone widths.
  - It also runs **on demand** from a "Check now" button (manual workflow dispatch) and after each publish if possible.
- It posts results to a new **`ingest-site-health`** edge function. That function checks a secret token and writes `site_health_runs` / `site_health_results` (draft 0003).
  - GitHub never holds your database master key, only the ingest token.
- **Uptime check** every 30 minutes: the home page, `/sitemap.xml`, and a **dry-run** of the lead form endpoint (`submit-form` validates a test payload with a health-check token and **saves nothing**).
  - If any of these fails twice in a row, an alert email goes out.
  - GitHub's schedules can run a few minutes late. If you want minute-level alerts, add a free external uptime monitor as a second line.
- **Real-visitor errors:** the site already records browser errors in `error_logs` (production only). Site Health groups them by page and message: "3 visitors hit this error on /services/eifs today".

### 3.2 What each check looks for

| Severity | Checks |
|---|---|
| 🔴 **Error** | The page doesn't load, or shows "Something went wrong" or the not-found view while listed in the sitemap. A JavaScript error on load. A broken internal link (404 view). A broken image. Missing title or H1. More than one canonical, or a canonical pointing elsewhere. The lead form endpoint fails its dry-run |
| 🟡 **Warning** | Title over 60 or description over 160 characters, or missing. Duplicate titles across pages. Images without alt text. An image over 500 KB. Load time over 4 s at phone width. Horizontal scroll at 390 px. An external link returning an error. A sitemap URL missing from the route list, or a public route missing from the sitemap. A page edited in the admin with an unpublished draft older than 14 days |
| 🔵 **Content guard** | Risky claim words ("24/7", "certified", "bonded", "factory-certified", "licensed", "warranty") on a page that has no matching vault entry (section 4). Placeholder text ("lorem", "TBD", "John Smith", "123-4567"). Content older than 12 months |

### 3.3 Where you see it
- **Dashboard tile:** "Site health: 🟢 86 OK · 🟡 2 warnings · 🔴 0 errors. Last check 3:12 am."
- **Website → Site Health** page:
  - A run history and a per-page table.
  - "New since last run" highlighting, and issues grouped by type ("14 images missing alt text"), each linking straight to the page cockpit.
  - Every issue can be marked **Fixed**, **Ignore once** or **Ignore always (with a reason)**, so the list stays meaningful.
- **Alerts:** an immediate email for new 🔴 errors or a failed uptime check. A **Monday digest** with health, bids due this week, untouched leads and expiring documents.

---

## 4. Trust and growth features (from the earlier discussion, folded in)

| Feature | What it gives you |
|---|---|
| **Credentials vault and claims** | Certificate of insurance, WSIB clearance, policy, Sto certificate, safety manual, training tickets, each with **expiry reminders**. Every public claim ("$2M CGL", "WSIB compliant") is a vault-linked statement. When a document expires, the site switches to safe wording, and the content guard checks the rest |
| **Prequal package builder** | One click builds a branded PDF from the vault (`@react-pdf/renderer` is already installed), shared through an **expiring link with open tracking**. This replaces the dead download buttons and the missing vendor packet |
| **Bid board** | Forward an invitation-to-bid email to `bids@` and it becomes a lead. Adds a go/no-go checklist, a bid calendar, win/loss reasons and win rates. Builds on the Leads plan |
| **Proof pipeline** | A phone-friendly closeout checklist: photos, scope, value range, the client's permission to be named. It drafts a case study and sends a Google review request |
| **Accountability** | Response time per lead against your one promise, and lead source by page, service, city and campaign |
| **Limited estimator login** | Leads and the bid board only |

Not planned: a full CRM, invoicing, job costing or estimating software.

---

## 5. Insights (the "insights" part of your request)

- **Per page:** leads (from the attribution fields captured with each lead), Search Console clicks, impressions, average position and top queries. The project already has the Search Console connection and tables; the sync needs to be switched on and verified. Also conversion rate (leads ÷ clicks).
- **Site-wide:** top pages by leads, pages with traffic but no leads (fix their call to action), pages with neither (consolidate or improve), and services and cities ranked by leads.
- **Google Analytics data inside the admin** is possible later through the GA4 Data API, which needs a Google service account. Until then, the Insights page links to GA4.

---

## 6. Order of work

| Step | What | Database | Why this order |
|---|---|---|---|
| **S1** | **Site health v1:** the GitHub Actions crawler, the `ingest-site-health` function, the Site Health page and dashboard tile, the uptime check plus form dry-run, email alerts | 0003 (health tables only, or the whole file) | You get immediate visibility on all 88 pages without changing any content |
| **S2** | **Pages hub and page settings:** the page list, cockpit tabs 2–4, `page_settings` wired into `SEO.tsx`, `PageHero` and hidden pages | 0003 | Control of SEO, header images and visibility for every page |
| **S3** | **Content slots engine** plus wave 1: Home, About (replaces R2's About work if not yet built), Contact, Services index, For GCs, Property Managers, Emergency | 0003 | The pages that win work |
| **S4** | Content slots waves 2–3: all remaining static pages, then the city template (per-city intro and local details) and the 9 code-managed service pages | none | Completes the "every page editable" goal |
| **G1** | Credentials vault, claims and expiry reminders, plus the content guard tied to it | new draft (0004) | Fixes credibility permanently |
| **G2** | Prequal package builder and share links | 0004 | Something real to send GCs |
| **S5** | Insights per page and site-wide (Search Console sync check, lead attribution) | P2 attribution fields | Shows what earns money |
| **G3–G5** | Bid board intake and go/no-go; proof pipeline and reviews; response-time tracking | new drafts | Growth |

R1 (fixes and honest UI) and R3 (new shell and theme) from file 14 should come **before S2**, so the Pages hub is built in the new design. S1 can run in parallel with R1, since it touches different files.

---

## 7. Content slots: how it works (for Codex and for review)

- **In code:** a page uses `<Slot k="about.hero.headline" kind="text">Proven Expertise. New Name.</Slot>`, or the hook `useSlot(key, default)`. The **default is the current text**, so nothing changes until someone publishes a value.
- **Registry:** a build step (`scripts/generate-content-registry.ts`) scans `src/` for slot keys and writes `src/generated/content-registry.json`: key, page, kind, default and source file. The admin uses it to list every slot on every page, including slots never edited. A test fails if a key is used twice with different kinds.
- **Loading:** one request at app start fetches every published value (small), cached in `localStorage` and refreshed in the background.
  - Visitors see the code default until the published value arrives, so only edited slots can change after load. To prevent layout jumps, a slot keeps its space; for long text, the cached value is used on repeat visits.
  - Preview mode, for admins only, loads drafts instead.
- **Safety:**
  - Rich text is rendered through the same DOMPurify allow-list as R4.
  - Links must be https, mailto, tel or an internal path. Images must come from the media library bucket.
  - Text slots have length limits taken from the design (for example, hero headline at most 80 characters), so a long edit can't break the layout.
  - The admin warns and blocks publishing when over the limit.
- **Publishing:** saving writes `draft_value`. Publish calls `publish_content_entry`, which records a version. Rollback calls `rollback_content_entry`. Both are in draft 0003.
- **Claims:** slots that contain credential wording are marked `claim: true` in code and can only be published when linked to a vault entry (after G1). Until G1 exists, they are marked "owner-held" and stay read-only.

---

## 8. Decisions needed from you

1. **Order:** start with **S1 (site health)**, alongside R1? This is my recommendation: it gives immediate value and no visible risk.
2. **Alert recipients** for site errors and the Monday digest, and whether you also want a free external uptime monitor for faster alerts.
3. **Health-check timing:** nightly at 3 am Toronto time? (Recommended.)
4. **Claim-bearing text:** keep it read-only until the credentials vault (G1) exists? (Recommended. It protects you from re-introducing the WSIB, COR and Sto contradictions.)
5. **Navigation editing:** keep the menu in code (protected), or add a menu editor later?

---

## 9. Codex prompt (S-phases)

=== BEGIN PROMPT ===

PHASE = S1
(Allowed: S1, S2, S3, S4, S5. One phase, one PR, report, stop. Read `_assessment/admin-upgrade/15-SITE-CONTROL-AND-GROWTH-ROADMAP.md` as the spec, plus files 12, 13 and 14 for context and conventions. Do not redo finished work; check `docs/` and the `*-IMPLEMENTATION-STATUS.md` files.)

## Rules
All rules from file 14's prompt apply unchanged: branch and PR only; no publish, deploy, migration or live writes; no edits to platform files; protected areas; honest UI; the quality gates and their reporting; the deletion evidence rule; ask when unsure. In addition:

1. **SQL:** copy `sql/0003_site_control_and_health.sql` unchanged into `supabase/migrations/<UTC timestamp>_site_control_and_health.sql` in the first phase that needs it (S1). The owner applies it through Lovable before merge. No other schema change without a new draft and a stop.
2. **Secrets:**
   - The crawler uses a GitHub Actions secret `SITE_HEALTH_INGEST_TOKEN` and the public site URL only. The edge function reads the same name from its environment.
   - Never use or request the Supabase service-role key in GitHub.
   - Document the exact secret names the owner must add (GitHub repo settings, and Lovable Cloud function secrets). Never print values.
3. **The crawler only reads.**
   - It never submits forms, never logs in, and never follows admin, auth or `mailto:`/`tel:` links.
   - It identifies itself with the user agent `AscentSiteHealth/1.0`.
   - At most 2 pages at a time, with a 20 s timeout per page.
   - It must not load Google Analytics: set the consent-rejected state before the page loads.
4. **The form dry-run:** `submit-form` accepts header `x-health-check: <token>`. It runs validation only and returns `{ ok: true, dryRun: true }`, with **no insert, no email and no rate-limit write**. The token is compared in constant time. A missing or wrong token behaves exactly as today. Test both paths.
5. **The public site must render identically** with an empty `content_entries` / `page_settings`. Prove it with smoke-test output and screenshots.

## S1: Site health v1
- `.github/workflows/site-health.yml`:
  - Triggers: schedule `0 7 * * *` (3 am Toronto in summer time; note the winter shift in the docs), plus `workflow_dispatch`.
  - Installs with the same temporary-copy approach as the existing CI and runs `scripts/site-health/crawl.ts` (Playwright, already used by the smoke test).
  - The URL list is the live `/sitemap.xml` plus the static public routes in `src/routes/registry.ts`, excluding `/tekev`, `/admin`, `/404` and `/unsubscribe`.
  - Run every check in section 3.2 except the content-guard rows, which come in S2. Then POST the results in batches to `ingest-site-health`.
- A separate lightweight workflow `uptime.yml` runs every 30 min: the home page, the sitemap, and the form dry-run. It posts `kind='uptime'` runs.
- `supabase/functions/ingest-site-health/index.ts`:
  - Token check, Zod validation, batch insert, and run totals and status.
  - It sends an email through the existing Lovable email sender **only for new 🔴 issues** or **two consecutive uptime failures**. Recipients come from `notification_recipients` (type `all`) if the 0001 schema exists, otherwise `info@`.
  - Add the `config.toml` block with `verify_jwt = false`, since it uses token auth, mirroring `send-rfp-emails`.
- **Admin:**
  - Website → **Site Health** page: latest run summary, per-page table, issues grouped by type, "new since last run", and links to the page.
  - Fixed, Ignore once and Ignore always with a reason, stored in a small `site_health_ignores` table. If that needs schema, write a draft and stop; in S1 it can live in localStorage, and the PR should say so.
  - Dashboard tile.
  - "Check now" links to the workflow run page; the API trigger can come later.
  - Real-visitor errors grouped by page from `error_logs`.
- **Tests:** crawler issue detection on local fixtures (a broken link, a missing alt, a long title, a JS error, a 390 px overflow); ingest validation and token rejection; email only on new errors; the dry-run path.

## S2: Pages hub and page settings
- Website → **Pages**: the inventory per section 2, built from `registry.ts`, the sitemap generator's sources, and the database (services, projects, posts, cities). Health and SEO columns come from S1. Cockpit tabs: SEO and sharing, Header image, Health, plus Content when S3 lands.
- Wire `page_settings` into `SEO.tsx` (title, description, OG image, noindex; overrides only, code defaults otherwise), `PageHero` (hero image and alt) and the router (hidden pages render the not-found view with `noindex`).
- Add the content-guard checks to the crawler, with the claim-word list in one config file.

## S3: Content slots engine and wave 1
- Implement section 7 exactly: `Slot`, `useSlot`, the registry generator, the boot loader with cache, preview mode, publish and rollback through the 0003 functions, length limits, sanitising, and claim slots read-only.
- Wave 1 pages: Home (excluding the protected hero video logic; slide text is already editable through Hero Slides), About, Contact, Services index, For General Contractors, Property Managers, Emergency Repair.
- If R2's About editor is already built, migrate it to slots without losing saved values. Write a one-off copy script as a draft for the owner, not run automatically.
- **Tests:** an empty database renders identical text; publish, rollback, preview; over-length is blocked; unsafe links are rejected; the registry is complete.

## S4: Content slots waves 2–3
- All remaining static public pages, the city template (per-city intro, local notes and highlighted services as slots keyed by city), and the 9 code-managed service pages.
- Remove the "managed in code" banner from file 14's R4 for the pages that become editable.

## S5: Insights
- Per-page and site-wide insights per section 5.
- Verify the Search Console sync end to end, with read-only checks first, and report whether data is arriving.
- Lead attribution comes from the fields added in file 12's P2. If P2 hasn't landed, show "attribution starts after the intake upgrade".

## Report
Use file 14's report format. Also include, for S1, the exact GitHub and Lovable secret names the owner must create, and a "first run" checklist.

=== END PROMPT ===

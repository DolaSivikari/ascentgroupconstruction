# R1: reliable editing and honest admin controls

Implemented only **R1** from the owner's [redesign plan](14-ADMIN-REDESIGN-CODEX-PROMPT.md), against main `12ca712`. The [feature audit](13-ADMIN-FEATURE-REALITY-AUDIT.md) and uploaded SQL are reference material; the SQL has **not** been applied or copied into migrations. PRs #43–#45, including the current Leads list, detail panel and dashboard, are preserved.

## Before → after

| Feature | R1 result |
| --- | --- |
| Empty project dates and numeric fields | Blank dates and integer metrics save as null; clearing an existing date works. Blog read time also accepts blank. The service editor has no date or numeric fields. Schema text columns remain text. |
| Visitor settings | Public callers request explicit columns. Contact and PhoneLink already used safe projections/constants on main; this PR preserves them and adds regression coverage. Footer and Certifications reads now request only their consumed fields. |
| Missing settings records | Distinct loading, read-error and missing-record states. Create rechecks for an existing active row. Saves verify a returned row and retain edits on failure. Creation does not invent business statistics. |
| Security settings | Removed from the available tabs; retained source is quarantined. |
| Homepage editing | Back goes to `/admin`. Reorder checks each update and reports partial results. Hero and Why Choose Us mutations invalidate the actual visitor query keys. |
| Blog saving and previews | Sector, source and pin are saved. Header Save invokes native form validation. Typed slugs share one normalizer. Draft previews open only after the token is persisted successfully. |
| Project autosave | Local drafts only, keyed by project ID. Restore is offered explicitly. A failed manual Save retains edits; no background database write occurs. |
| Gallery removal | Removal is staged until a complete Save succeeds. Shared or externally hosted files are retained; failed reference checks also retain files. Drops use the latest image list. |
| Project preview | Existing validating `get_preview_project` RPC supports `?preview=true&token=`. Rejected tokens do not trigger a fallback draft read. Previews are marked noindex. |
| Unrecorded performance | New on-time/on-budget values default to null. The public Performance card is hidden when all five metrics are null; explicit zero/false values still render. |
| Monitoring | Status uses an exact count of errors in the last 24 hours. Read failures show Unavailable, with retry. The fixed Healthy label and empty 0 ms card are removed. |
| Users | No invented Active status or static permission matrix. Invite and role editing require a verified super admin; only Admin and Super admin are offered. The false first-login password promise is removed. |
| Tour and unused controls | Automatic tour start, unsupported menu items, unused homepage/service tabs and placeholder routes are removed from the UI. Source files are retained. |
| Crawler files | Read-only panel fetches the current origin's served robots.txt and sitemap.xml. It reports HTTP/format errors and URL count; a sitemap index is labelled as child sitemaps rather than pretending they are URL counts. |
| Unsaved changes | Editors, settings and homepage forms use React Router blocking plus Leave/Stay confirmations. Back/Forward and tab links remain SPA navigation. Cancel also warns. |

The cited garbled labels were already clean on current main; an encoding regression check preserves that. The audit's broad claim that every public settings read used `*` was also stale: Contact, SEO and PhoneLink had already been corrected.

## Before/after menu

- **Before (16):** Dashboard; Leads & Inbox; Projects; Services; Blog Posts; Testimonials; Media Library; Documents; Homepage Builder; Page Headers; SEO Dashboard; Site Settings; Users & Roles; Email Templates; Monitoring; Audit Log.
- **After (13):** Dashboard; Leads & Inbox; Projects; Services; Blog Posts; Documents; Homepage Builder; Page Headers; SEO Dashboard; Site Settings; Users & Roles; Monitoring; Audit Log.
- **Tabs hidden:** Security; Company Overview; Featured Services; Promotions.
- **Controls replaced/removed:** robots.txt editing and sitemap regeneration → served-file viewer; fake user status/permission cards and first-login promise → saved roles; automatic tour → disabled.
- **Placeholder routes removed:** navigation, redirects and content versions. Testimonials retains its route. Media and Email Templates implementations also remain for later work.

## Files and verification

Source changes are grouped in the shared editor/preview helpers, project persistence, editing guards, project/blog/service editors, settings tabs, homepage managers, Users, Monitoring, SEO, admin layout/sidebar, router, and the public ProjectDetail/Footer/Certifications settings reads. The PR's Files changed view is the complete inventory. Each fix has regression coverage; reusable fixture browser checks are in `scripts/admin-r1-{admin,public}-browser.cjs`.

See [browser evidence and screenshots](../../docs/admin-r1/README.md). All browser backend responses are synthetic; external backend traffic is blocked. No live records were read or changed, no email was sent, and no secrets were changed by verification.

| Gate | Result |
| --- | --- |
| `bun run build` | Passed, production build |
| `bun run typecheck:selected` | Passed |
| `tsc -p tsconfig.app.json --noEmit` | Passed |
| `vitest run --maxWorkers=2` | 435 tests / 65 files passed |
| `bun run validate:sw` | Passed |
| `bun scripts/audit-routes.ts` | Passed |
| `bash scripts/smoke-test.sh <local production preview>` | Passed |
| `bun run lint` / ESLint JSON report | 279 errors / 32 warnings, below the 288 / 34 baseline; new TypeScript files clean |
| Production-build Chromium | 17 R1 scenarios; 10 public captures; zero runtime exceptions; no horizontal overflow at 390 px |
| Existing dashboard/Leads browser scenarios | 13 passed on the R1 build |
| `git diff --check` | Passed |

## Remaining phases and limits

- **R2:** connect/prune About, General and Footer fields, anonymous health checks and settings cache invalidation. The About tab now explicitly says its stored settings do not change `/about` yet. Its future columns are not assumed to exist.
- **R3:** light/dark admin theme, shell redesign and idle timeout. **R4:** Tiptap and editor/list redesign. Existing Tiptap 3.31.4 dependencies are untouched. **R5:** media library. **R6/P1:** table-level/atomic role protections and richer activity.
- The R1 role replacement adds the new role before removing old roles, and blocks demoting the last visible super admin in the UI. It remains two REST operations. It does **not** replace the pending SQL trigger/RPC needed to protect concurrent or direct database writes.
- Project/relationship saves also use separate REST operations. If the full Save is incomplete, the editor reports partial persistence and keeps its draft for retry. Storage cleanup cannot undo an already saved project.
- Settings creation rechecks before insert; a database uniqueness guarantee for active rows is outside this schema-free phase.
- No new inquiry schema, intake endpoint, email sender, optional board or production deployment is included. Open questions for R1: none; live database grants remain unverified here.

## Owner steps

1. Review and merge this R1 PR. No SQL, package install or secret change is needed for R1.
2. In Lovable preview, if a manual create check is needed, use `TEST – delete me`, leave it Draft, delete it afterwards; otherwise use the fixture tests. Check local draft restoration, open a project/blog preview, and compare the existing Contact office hours in Settings with `/contact` in a private visitor window. Do not change live office hours for a test. Confirm the shortened menu and Monitoring error states.
3. Use **Lovable Publish → Update** to put the approved build on the production website.

**Merging does not publish.** R2 and later phases remain separate PRs.

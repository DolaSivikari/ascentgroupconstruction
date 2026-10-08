# Admin section screens and persistent navigation

PR #58 implements the owner's admin-wide request for focused section screens instead of long combined editors. This overrides the older plan's one-page editor presentation. It changes admin organization, not public content, business facts, database schema or save payloads.

## Screens by area

Sections stay grouped under the existing sidebar areas; no extra top-level menu items are added. Projects use nested paths. The other workspaces use query parameters, preserving parent page, record and tab selectors. Links and browser Back/Forward select the screen.

| Area               | Focused screens                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Projects           | Overview, Description & tags, Scope, Challenge, Results, Images, Details, Performance & team, Services & process, SEO (10)                                          |
| Services           | Basics, Overview, Fallback description, Images, Process, Benefits, FAQ, Scope & applications, SEO (9)                                                               |
| Blog               | Overview, Content, Details & tags, Featured image, SEO (5); case studies add Details, Before/after images, Process, Challenge, Solution and Results (11 altogether) |
| Settings → General | Company, Default SEO, Social profiles, Contact details (4)                                                                                                          |
| Settings → Footer  | Social profiles, Contact details (2)                                                                                                                                |
| Settings → Contact | Office location, Business hours, Map (3)                                                                                                                            |
| Settings → About   | Hero, Company story, Founder, Stats, Unsaved preview (5)                                                                                                            |
| Pages              | Field groups from each content module's section metadata; existing page/module/SEO selection remains separate                                                       |
| SEO                | Overview, Search Analytics, Content SEO, AI Visibility, Settings (5), now selected by URL                                                                           |
| Monitoring         | Recorded errors, Site Health, Performance (3)                                                                                                                       |
| Credentials        | Documents & expiry, Package builder, Shared packages (3)                                                                                                            |
| Homepage           | Hero and Why Choose Us remain separate URL-selected workspaces; the hero-slide dialog now has Content, Buttons & links, Video & poster, Visibility (4)              |
| Documents          | Document dialog has Details, File, Expiry & access (3)                                                                                                              |
| Leads              | New inquiry panel has Submitted request, Workflow, Notes, Alert delivery, History (5); legacy requests have Submitted request, Status & notes, Attachments (3)      |

Dashboard, project/service/blog lists, media, users/roles, page headers, email delivery, audit, inbox lists and the small Health/Notifications settings forms already have focused routes or list/detail workflows. They share the fixed admin navigation without redundant subdivisions. Dialog section selectors organize the currently open record; they do not add standalone public pages or reopen a dialog after reload.

Examples: `/admin/projects/:id/images`, `/admin/services/:id?section=service-process`, `/admin/blog/:id?section=content`, `/admin/settings?tab=about&section=founder`, `/admin/monitoring?section=site-health`.

## Editing and navigation

Only the selected screen is visible. Controls remain mounted inside one editor so unsaved field values, Tiptap state, pending images and component state survive internal navigation. Section navigation never saves or publishes. Changing the parent record, Settings tab, page/module, route or leaving/reloading an editor retains the existing unsaved-change protection. Switching between different Settings forms still asks to save/discard dirty edits.

Project, service, blog, slide and document saves validate every mounted screen and reveal the first invalid required field before allowing a save. Rich-text validation focuses its editor. Existing confirmation dialogs, save payloads, publication controls and local recovery remain in place.

The shell uses a viewport-height sidebar with its own scrolling menu and a separate content scroll area. The header stays visible throughout admin. Editor actions and section navigation stay sticky; long Settings forms keep their publish/save action visible. Mobile uses a section selector. Admin routes bypass transformed page animations, and desktop/mobile sidebar behavior shares the 1024 px breakpoint.

## Verification

- Full suite: **591 tests across 90 files passed**. Regressions cover section links, direct URLs, mobile selection, browser Back, retained drafts, parent-record/tab departure guards, invalid hidden fields and existing save contracts.
- Full app and selected strict TypeScript, production build, service-worker validation, route audit and whitespace checks passed.
- ESLint: **211 existing errors / 29 warnings**, below the 288/34 ceiling. New source/test files are clean. ESLint is not globally passing; existing build chunk/dependency warnings remain.
- Offline Chromium at 1440, 1024 and 390 px exercises Projects plus nine expanded workspaces and two editor dialogs. Checks cover draft retention, Back, a single visible section, persistent header, hidden-required validation, mobile navigation and no horizontal overflow. Backend requests are intercepted with synthetic authentication/data; no live admin login or writes occur. These are representative workspace checks, not every control/save scenario.
- Seven public fixture routes at two widths provide 14 before/after comparisons and the public bundle exclusion gate. This is representative offline coverage, not a full live-site replay. Exact results are in [verification.json](admin-section-pages-evidence/verification.json).

Reproduce with a production build using synthetic `VITE_SUPABASE_URL=https://fixture.supabase.co`, `VITE_SUPABASE_PUBLISHABLE_KEY=offline-fixture-key`, `VITE_SUPABASE_PROJECT_ID=fixture` and loopback Vite preview:

```sh
ADMIN_SECTIONS_ORIGIN=http://127.0.0.1:4189 \
PUPPETEER_CORE_PATH=/path/to/isolated/puppeteer-core \
node scripts/admin-section-pages-browser.cjs after
```

The script refuses non-loopback previews, intercepts external requests and substitutes synthetic records. Browser tooling remains outside application dependencies. `admin-before.json` is the original Project/global-shell baseline; `admin-after.json` includes the expanded admin checks.

No SQL, live database/storage, secrets, migrations, emails, deployment or publishing changes. Merge and Lovable **Publish → Update** remain separate owner actions.

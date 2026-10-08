# Project section screens and persistent admin navigation

The owner requested separate screens instead of the R4 plan's long, one-page project editor. This update overrides that presentation choice for Projects. The existing project fields, save payloads, staged publication and local draft recovery remain in place.

Each project has ten linked screens under `/admin/projects/:id`: Overview (`overview`), Description & tags (`content`), Scope (`scope`), Challenge (`challenge`), Results (`results`), Images (`images`), Project details (`details`), Performance & team (`performance`), Services & process (`services`) and SEO (`seo`). Existing project links still open Overview. All sections stay inside Projects; no extra main-sidebar items are introduced.

Only the selected screen is visible. Controls stay mounted so pending images, component state and unsaved edits survive section navigation and browser Back/Forward. Switching sections does not save or publish. Save validates every screen and reveals the first invalid required field. Leaving the project still requires confirmation when dirty; browser close/reload protection remains.

The admin header stays outside the scrolling content area. The sidebar has its own viewport-height scrolling menu. Save/Preview/Publish remain sticky, and the project section menu accounts for the action bar's actual height. Admin routes bypass transformed page animations. The sidebar and mobile menu use the same 1024 px breakpoint.

## Verification

- 586 tests across 89 files passed, including new section navigation/state and hidden required-field regressions.
- Full app and selected strict TypeScript, production build, service-worker and route checks passed.
- ESLint: 211 existing errors / 29 warnings, below the 288/34 ceiling. New files are clean; ESLint is not claimed globally passing.
- Offline production-preview browser checks at 1440, 1024 and 390 px passed with zero runtime errors, backend writes or duplicate Tiptap warnings. Before the change the top bar scrolled outside the viewport; afterwards it stays at the top while only the content area scrolls.
- Seven public fixture routes at two widths produced 14 identical before/after comparisons. All 75 loaded public chunks passed the admin-library exclusion gate. This is representative fixture coverage, not a live or full-site replay.
- Machine-readable summaries are in [project-section-pages-evidence](project-section-pages-evidence/verification.json).

Reproduce the targeted browser check after a production build using synthetic `VITE_SUPABASE_URL=https://fixture.supabase.co`, `VITE_SUPABASE_PUBLISHABLE_KEY=offline-fixture-key`, and `VITE_SUPABASE_PROJECT_ID=fixture`, with local Vite preview on port 4188:

```sh
PUPPETEER_CORE_PATH=/path/to/isolated/puppeteer-core node scripts/admin-section-pages-browser.cjs after
```

The browser script refuses non-loopback previews, intercepts external requests and substitutes synthetic authentication/data. Browser tooling remains outside application dependencies.

No SQL, live data/storage, secrets, migration, function deployment or publishing changes. Other editors retain their current section organization; the persistent admin navigation applies throughout the admin panel. After merging, use Lovable **Publish → Update** to activate the UI.

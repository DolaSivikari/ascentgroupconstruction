# PR #61 conflict resolution

The website-audit branch is updated with main `e743d6a765b986c0b99ebfa051e6d4da7a650528` (PR #60's hero-image refresh). This is a merge into the feature branch; main is not merged or published by this task.

- `_assessment/baseline/intentional-changes.json`: combine the hero-refresh declarations and audit declarations by page. All 86 records, existing field lists and each branch's explanations are retained.
- `src/pages/resources/LocationPage.tsx`: retain the shared city-name effect dependency and the audit's clearing of previous-city project cards. The cancellation guard still prevents a late previous-city response from updating the current city.
- `src/pages/resources/LocationPage.test.tsx`: use real router navigation to retain once-per-city, pending-city clearing and late-response coverage. The once-only test now explicitly rerenders the same city, preserving the additional assertion from main's overlapping test.

The refreshed hero components, configurations and every tracked hero asset are byte-identical to main. Both dependency files are unchanged. All five production CSS files are byte-identical to main. Production builds use synthetic public Supabase bindings, and browser backend requests are intercepted with offline fixtures. No live data, secrets, migrations, deployments or publishing are involved.

Verification: 631 tests in 96 files passed; focused city/hero coverage passed 45 tests in four files. Full application and selected strict TypeScript, production build, route audit, service-worker validation and local smoke checks passed. Changed city source/tests have zero lint errors or warnings. Whole-repository lint has 210 existing errors and 29 warnings, within the required ceiling; this is not a clean whole-repository lint run. Seven browser routing/404/initial-HTML checks passed. The comparison gate's equality and deliberate text/pixel/bundle negative controls passed using the existing fixture capture as input.

The original audit verification and evidence remain historical checks against `49b719f`. New merge verification is recorded separately against `e743d6a`. This preserves the approved hero refresh while checking for unexpected changes introduced by the combined branch.

Server rendering and genuine HTTP 301/404 responses still require the documented hosting work. After review/merge, the owner publishes with Lovable → Publish → Update.

The new [public comparison](evidence/pr61-conflict-resolution/public-comparison.json) passed all **85 URLs × two widths = 170 comparisons**, with zero unexpected differences and zero declarations/waivers. The [bundle gate](evidence/pr61-conflict-resolution/public-bundle.json) passed for 85 URLs and 159 loaded public chunks. All 34 candidate city captures made exactly one project request; no candidate page errors or horizontal overflow were observed. Browser coverage remains offline Chromium at 1440px and 390px; this does not verify production CMS/auth, hosting responses or other browsers.

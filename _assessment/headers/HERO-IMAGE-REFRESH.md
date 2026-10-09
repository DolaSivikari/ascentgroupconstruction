# Hero image refresh

Owner direction: authentic photos, restrained design. Base: `49b719f4c3601d343d9b1350cb4c5b99fbf8f36d`. The current inventory contains **85 public content URLs**: 29 main pages, 22 services, 17 cities, 11 published projects and six articles. Redirects and utility/admin pages are excluded. The supplied 88-page assessment is an older snapshot.

## What changed

- Seventeen distinct, verified city photographs replace repeated regional maps on the city detail pages. The regional service-area hub retains its map. Credits include the photographer, license, original source and responsive-crop disclosure.
- Twenty image assets from nine already-published projects supply company, audience, selected service and article headers: 18 photographs and two planning/documentation images. A small project-reference link identifies the source project without claiming that an article describes that project.
- All six published articles have distinct topic-specific fallbacks. Six previously repeated B2B headers now use distinct project references, including actual planning/documentation imagery for Our Process and Technology.
- A shared hero image component applies focal positions to the image itself, prioritizes the first image, respects reduced motion and falls back once if a saved image fails to load. A second failure leaves the headline readable without a broken-image icon. Valid editor-selected images keep priority.
- The admin header inventory reflects the new city/article sources. The city related-project effect now depends on the city name rather than a freshly constructed object, fixing the repeated-request loop confirmed in the original build.

Existing header heights, typography, copy, CTAs, navigation and credentials remain unchanged. The homepage video and custom project heroes are preserved. Existing relevant specialty, masonry, parking, sealant and tile imagery remains; image dimensions alone do not establish AI provenance. This refresh does not certify the provenance of those retained assets.

The restraint of PCL, Bird and EllisDon informed the treatment; their public markup was inspected. Competitor images were not copied. The remaining benchmark sites were not independently audited in this task.

## Sources and review

[Image sources, attribution and file hashes](hero-image-sources.json) document every new asset. All assets are bundled locally; no SQL, live storage upload or CMS record changes are required. The 37 new assets total approximately 11.1 MiB; each page requests its selected image rather than downloading all images.

| Page | Before | After |
| --- | --- | --- |
| Toronto, phone | [Screenshot](screenshots/before-service-areas--toronto-390.png) | [Screenshot](screenshots/after-service-areas--toronto-390.png) |
| Building Envelope, desktop | [Screenshot](screenshots/before-services--building-envelope-solutions-1440.png) | [Screenshot](screenshots/after-services--building-envelope-solutions-1440.png) |

## Verification

- **608 tests / 93 files passed**, including image failures, city attribution, editor-image priority, all-city coverage and the repeated-project-query regression. After minimizing an unrelated test-format diff, the affected inventory file was rerun: 14 tests passed.
- Selected and full application TypeScript, production build, service-worker validation and route audit passed. Lint reports 211 existing errors / 29 warnings; new files are clean. No lockfile or application dependency changes.
- Both production builds were served locally and exercised with intercepted synthetic data: **85 routes × two widths = 170 captures per build**. All 69 shared hero routes loaded their images in both candidate viewports. No candidate runtime/console errors, horizontal overflow or attempted backend mutations. All 34 candidate city captures reached network idle; 31 original city captures did not.
- [Before/after comparison](comparison-results.json): **passed**, 62 identical captures, 108 declared changes, zero unexpected changes. Titles, H1s, canonical URLs, HTTP status and runtime-error fields were not waived. Six article schema-image changes are explicitly declared. [Current declarations](intentional-changes.json) are narrower than the cumulative repository declarations.
- [Browser evidence](browser-report.json) records each route and hero state. Existing randomized project selections were held constant; homepage lazy content and the stat counter were allowed to settle. Local-port canonicals were normalized to the same loopback origin in both captures.
- The existing bundle gate **cannot pass in either build** because `parallax-commitment.avif.asset-*.js` has an empty source map. [Supplemental review](bundle-review.json) identifies the identical pre-existing data-only module. The other 153 loaded public chunks have source provenance and contain none of the gate's forbidden editor/chart sources. The gate was not weakened.

These are offline fixture checks and viewport/header screenshots, not full-page comparisons or proof of the deployed database/website. External images, maps and sockets are intercepted. The homepage video is intentionally not tested for playback in this reduced-motion run.

To repeat the captures, build the base and branch with synthetic Supabase configuration and source maps into separate directories, serve on `127.0.0.1`, and run `scripts/hero-headers-browser.cjs` with `HERO_QA_ORIGIN`, `HERO_QA_DIST`, `HERO_QA_OUTPUT` and an isolated `PUPPETEER_CORE_PATH`. Run `scripts/baseline/compare.ts` against those capture directories with this folder's `intentional-changes.json`. Browser tooling is not an application dependency.

After review and merge, use **Lovable Publish → Update** and inspect the representative pages at desktop and phone widths. No publishing or deployment was performed by this PR.

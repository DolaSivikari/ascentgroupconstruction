# Page-specific hero imagery

Owner correction: every header must fit its own headline and purpose, with realistic generated imagery permitted. This correction starts from `7435d8d` after the original header refresh and SEO fixes were merged. The current public inventory contains **85 content URLs**, including **69 shared image-header pages**; the earlier 88-page assessment is a snapshot.

## Image assignments

- **51 distinct generated scenes** replace the arbitrary company/project references and inappropriate service illustrations: 23 main/company/audience/action headers, all 22 service headers and six article headers. About shows specialty-construction teamwork; Services shows coordinated envelope, masonry and interior trades; Estimate shows quantity/pricing preparation. Each service depicts its specific work, and each article has a separate scene matching its topic.
- **17 city photographs** remain specific to their cities, with their existing source credits. The regional service-area hub retains its map. All 69 current shared image headers have distinct defaults.
- The homepage video, Projects carousel and actual project-detail photography remain intact. Existing header dimensions, typography, headlines, CTAs, navigation and protected credential wording are preserved. The three plain legal headers remain plain.
- Generated imagery carries accurate alternative text and the discreet caption **“Illustrative construction scene”**. It does not claim to show actual Ascent employees, completed projects or verified credentials.
- Valid editor-selected images retain priority. Failed or obsolete saved images use the existing one-time page-specific fallback; a second failure keeps the headline readable. Public read-only metadata confirms that the current saved service/article paths are obsolete development paths or empty, so these defaults apply without database edits.

Twenty duplicate local portfolio-reference assets from the first refresh have been retired. Their source/attribution history remains recorded, and project metadata still recognizes the original public URLs. This does not delete or alter published project-gallery images.

## Sources and review

[Page-by-page briefs](page-specific-image-briefs.json) record the headline, subject, composition and alternative text for every generated scene. [Generated asset manifest](generated-image-assets.json) records dimensions, deployment size, original filename and SHA-256. [Photograph sources](hero-image-sources.json) retain city licenses and the retired portfolio source history. Generated compositions are only encoded to WebP, without resizing or creative pixel edits. The 51 WebP assets total **8.68 MiB**, with the largest at 318 KiB. Each page loads its selected image; the full image collection is not downloaded together.

| Page | Before | After |
| --- | --- | --- |
| About, phone | [Screenshot](screenshots/before-about-390.png) | [Screenshot](screenshots/after-about-390.png) |
| Services, desktop | [Screenshot](screenshots/before-services-1440.png) | [Screenshot](screenshots/after-services-1440.png) |

## Verification

- **633 tests / 96 files passed**, including all-header uniqueness, generated-image disclosure, image failure recovery and editor-image priority.
- Selected and full application TypeScript, production build, service-worker validation and route audit passed. Changed source/test files are lint-clean; the repository has 210 existing lint errors / 29 warnings, below its documented limit. No lockfile or dependency changes.
- Both production builds passed **85 routes × two widths = 170 captures each**. All 69 shared image-header routes loaded in both widths: 138 loaded-header captures. No candidate runtime/console errors, horizontal overflow or attempted backend mutations.
- [Before/after comparison](comparison-results.json): **passed**, with 68 identical captures, 102 declared changes and zero unexpected changes. Titles, H1s, canonical URLs, HTTP status and runtime-error fields remained equal. The 51 generated header images/captions and 15 derived schema-image updates are explicitly declared.
- [Browser evidence](browser-report.json) records each route and header state. Source images were visually reviewed against their briefs; representative About/Services crops were reviewed in the browser. Randomized project choices were held constant, homepage content allowed to settle, and local-port canonicals normalized in both builds.
- [Public bundle gate](bundle-review.json): **passed in both builds**, with 154 loaded public chunks and no forbidden editor/chart sources. The existing pure asset-metadata module is verified by the current gate rather than bypassed.

These checks use offline synthetic content and viewport/header screenshots, rather than full-page live replay. External images, maps and sockets are intercepted. The homepage video is not tested for playback in the reduced-motion run. Titles, H1s, canonical URLs, HTTP status and runtime errors are not waived. Only the 51 declared header changes and six article and nine static-service schema-image changes are allowed by [this correction's declarations](intentional-changes.json).

To repeat, build the base and branch with synthetic Supabase configuration and source maps, serve both on `127.0.0.1`, and run `scripts/hero-headers-browser.cjs` with `HERO_QA_ORIGIN`, `HERO_QA_DIST`, `HERO_QA_OUTPUT` and isolated `PUPPETEER_CORE_PATH`. Run `scripts/baseline/compare.ts` and `scripts/baseline/bundle-check.ts` against the captures. Browser tooling is not an application dependency.

No SQL, live storage uploads, publishing or deployment are required or performed. After review and merge, use **Lovable Publish → Update** and inspect the representative headers at desktop and phone widths.

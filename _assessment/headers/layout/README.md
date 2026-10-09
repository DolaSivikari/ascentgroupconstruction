# Compact, consistent shared page headers

Owner-approved follow-up to the page-specific image refresh. Base: `b42b30f` (merged PR #62). This changes the **69 shared image headers** in the current 85-page public content inventory. It preserves the current page-specific images and factual wording, including credentials, navigation, contact details, action labels and destinations. Home video, custom Projects headers and plain legal headers retain their presentation.

## Layout

- Phones use natural content height rather than viewport minimums. Statistics and multi-item trust badges occupy a separate surface below the image. One DOM copy of every fact is arranged through a responsive grid: below the actions on phones, before them on desktop. The existing TrustRibbon remains intact.
- A shared heading scale, balanced text wrapping, restrained widths and shorter spacing replace oversized padding. Long titles and descriptions can grow without clipping; no fixed maximum height or hidden text is used.
- Breadcrumbs have consistent spacing and expose the current page to assistive technology. Existing anchor and route destinations are retained. The primary action is a solid orange button with sufficient white-label contrast; the secondary action is outlined. Both stack at full width on phones and use at least 48px targets in the normal type scale.
- Desaturated navy overlays replace the heavy blue cast. Wide screens lighten the image away from the headline; tablet/phone and centered text retain stronger contrast. Generated-image metadata records subject-specific desktop/mobile focal points and overlay-edge opacities. Photo provenance and failure recovery are preserved.
- Header text remains white over dark image surfaces in both themes. Supporting facts use the surrounding page theme. Reduced-motion preferences disable the header's entrance animations.
- Technology tool labels move from an absolute overlay into normal flow below the header; its additional spacer is removed.

## Representative measurements at 390px

These fixture measurements include the supporting facts when comparing the complete shared header. Technology's separate tool strip is now outside that section.

| Page | Previous image/header | New image | New image + supporting facts |
| --- | ---: | ---: | ---: |
| About | 893px | 568px | 755px |
| Services | 823px | 609px | 703px |
| Technology | 919px | 534px | 743px |
| Waterproofing | 574px | 338px | 462px |

| Review | Before | After |
| --- | --- | --- |
| About, phone | [Screenshot](screenshots/before-about-390.png) | [Screenshot](screenshots/after-about-390.png) |
| About, desktop | [Screenshot](screenshots/before-about-1440.png) | [Screenshot](screenshots/after-about-1440.png) |

## Verification

- **637 tests / 97 files passed**. After the desktop grid correction, the 14 affected shared-header tests passed again.
- Selected/full app TypeScript, production build, service-worker validation and route audit passed. Changed source/test files are lint-clean; the repository remains at 210 existing errors / 29 warnings. No dependency or lockfile edits.
- Both builds passed **85 URLs × desktop/phone = 170 captures each**, including all 138 shared-header captures. No runtime/console errors, horizontal overflow or attempted backend mutations. Header actions remain at least 44px (normally 48px); title bounds stay inside the image surface and clear of navigation. Mobile facts are below the image and action buttons clear the image credit.
- [Comparison](comparison-results.json): **passed**, with 32 identical captures, 138 declared changes and zero unexpected changes. Titles, H1s, canonicals, HTTP status, JSON-LD and runtime-error fields match. All 170 full-page word inventories and all 138 header word inventories match independently of ordering.
- [Browser measurements](browser-report.json) also record 10 dark-theme captures at 320/768px across five representative pages and three enlarged-text captures at 390px with root type doubled. These passed without clipping or overflow.
- [Public bundle gates](bundle-review.json) passed in both builds for all 159 loaded public chunks, with no forbidden editor/chart sources. These checks use intercepted offline fixtures, viewport screenshots and local production builds, not the live database or a full-page production replay. The source tree used for the original image-refresh candidate is identical to this PR's merged base; that unchanged build supplies the before captures. Deferred sections are loaded in both builds and returned to the top before comparison so different fold positions cannot leave an asynchronous loading placeholder in just one build.

Declarations permit only screenshot changes and text-order changes on the 69 shared-header routes. No title, H1, canonical, HTTP status, JSON-LD or runtime-error changes are waived. Header wording is checked independently of ordering.

GitHub's existing production-fixture comparison remains a separate check: PR #62 failed there because three recorded public responses were missing. This PR does not replace its approved production baseline, disable that check or claim it has passed.

No SQL, live data/storage writes, dependency/lockfile changes, emails, publishing or deployment. After review and merge, the owner uses Lovable **Publish → Update** and checks the headers on phone and desktop.

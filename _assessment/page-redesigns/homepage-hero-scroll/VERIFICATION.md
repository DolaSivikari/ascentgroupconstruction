# Part A verification

Base: `4dc6445` · branch: `hp/hero-scroll-out` · October 13, 2026. The eleven supplied attachments are preserved byte for byte ([checksums](supplied-files.json)); [integration notes](IMPLEMENTATION-NOTES.md) explain the current-main adaptations and reconstructed content module.

## Repository checks

- **730 tests across 117 files passed**, including all supplied scroll tests, the oversized-content regression and content-registry/editor contract checks.
- Full app and selected strict TypeScript, production build, service-worker validation, route audit, operational inputs, entry budget and `git diff --check` passed.
- Entry: **1,023,861 bytes / 306,356 bytes gzip**, within budget. No application dependency or lockfile changes. Existing build-size and React/jsdom diagnostics remain.
- Lint: **201 inherited errors / 29 warnings**, zero per-file/rule increases. Active new files are clean. Only the verbatim archived handoff source is excluded from lint; the active implementation is checked normally.
- Supplied source/patch whitespace is preserved through reference-path Git attributes. Authored application code and notes use normal `git diff --check` validation.

## Public comparison and bundle gate

Two local production builds use identical offline synthetic fixtures, fixed time/randomness, reduced motion and rejected consent. External traffic and WebSockets are blocked; no forms are submitted. Expected no-row response diagnostics remain in both builds and are compared rather than waived. Coverage is the current 86-URL safety inventory: 85 canonical content routes plus `/case-studies`.

[Comparison](evidence/comparison-results.json): **86 URLs × 1440/390 = 172 captures each**. **170 identical**, **2 declared homepage changes**, **zero unexpected changes**. Only `/` visible text and screenshots are permitted by this phase's declaration. Titles, H1s, canonicals, JSON-LD, final paths, HTTP statuses and runtime/console errors match everywhere. Every other page retains its presentation.

| Homepage comparison | Before | After |
| --- | --- | --- |
| 1440px, reduced motion | [Before](screenshots/before-_-1440.png) | [After](screenshots/after-_-1440.png) |
| 390px | [Before](screenshots/before-_-390.png) | [After](screenshots/after-_-390.png) |

[Bundle gate](evidence/bundle.json): **229 loaded public chunks passed**, with one verified data-only asset metadata module and no forbidden editor/chart sources. A separate hidden-source-map production build matches all **1,873 emitted JavaScript assets byte for byte** with the normal build. Maps are not published or committed.

[Accessibility regression scan](evidence/accessibility.json): **zero new findings**, zero overflow and zero page errors across 172 candidate captures. Both main and candidate retain **116 existing rule-level violations** outside the homepage; the homepage has zero detected violations in these captures. Automated WCAG 2/2.1 A/AA checks contain incomplete/manual checks and do not establish site-wide compliance. Existing findings are not waived as passing.

These current-source local comparisons supplement the approved production-fixture CI gate; they do not replace its baseline or invent missing response fixtures. Production/Lovable behavior is not asserted from these offline builds.

## Actual browser behavior

[Measured scenarios](evidence/special.json) use local Chromium at 1440×900 with normal motion:

- With a transform-free test ancestor, true fixed positioning keeps the stage at viewport top **0px**.
- With the real retained page-transition transform, fallback pinning also stays at **0px**, both on direct entry and after Services → logo → Home.
- At 30% scroll, frame=0.51; at 70%, frame=0.91 and statement opacity=0.75; at 100%, frame/statement=1. The 450px hold releases correctly: at scroll 520px, the stage is **−70px** and the rest of the page continues.
- Actual **Shift+Tab** from the next property card back into the hero restores scroll to **0px**, with copy opacity=1 and the focused control visible.
- Phone 390×900, reduced motion at 1440×900, and short 1440×600 windows use the static band with one H1 and no horizontal overflow. Enlarged text at 1440×640 also safely uses the static layout.
- [Actual playback](evidence/playback.json): the real local MP4 keeps playing; scroll preserves its DOM node; the existing seven-second slideshow auto-advances; scrolling upward restores the copy. No browser page errors.

| Desktop scroll | Implementation capture |
| --- | --- |
| 0% | [Screenshot](screenshots/desktop-0.png) |
| 30% | [Screenshot](screenshots/desktop-30.png) |
| 70% | [Screenshot](screenshots/desktop-70.png) |
| 100% | [Screenshot](screenshots/desktop-100.png) |
| After in-app navigation | [Screenshot](screenshots/desktop-after-navigation.png) |
| Phone 390px | [Screenshot](screenshots/phone-390.png) |

These are actual implementation captures, not missing original reference screenshots. Video frames naturally vary between normal-motion screenshots.

## Limits and owner review

- **Not run:** native Safari, Firefox, actual Lovable preview/publication, authenticated admin saving or a live database test. The content module is verified with offline registry/resolution fixtures; existing publishing/override switches are not activated.
- Part B's navigation problem is independently reproduced on current main too. Its global transition fix is not included in Part A. This PR introduces no navigation change and does not claim that existing issue is fixed.
- Local smoke serves the public/admin paths and static SEO files; its optional backend probe is deliberately skipped. No production forms, emails, migrations, secrets, function deployment, merge or publication occur.
- Before merging, the owner should review the supplied Part A checklist in Chrome/Safari/Firefox and the screenshots here. After review/merge, publishing is a separate owner action: Lovable **Publish → Update**, then private-window checks on desktop and phone. Merging alone does not publish.

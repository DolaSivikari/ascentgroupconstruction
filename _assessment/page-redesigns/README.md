# Technology and capabilities redesigns

Implemented the two Claude Design references as React pages in the existing site. The archive's HTML previews and Markdown briefs were treated as design references; repository operations follow the owner's request.

## Model fidelity corrections after PR #50

The first implementation changed the supplied geometry too much: the wall cutaway used a different thickness axis and an extra 90° rotation, the building used solid rectangle blocks instead of perimeter walls, and the records used flat overlapping buttons instead of thick, vertically separated sheets. The access elevation also replaced the supplied equipment proportions and height scale. The earlier control checks did not verify these shapes.

The correction branch `codex/fix-redesign-models` starts at merged main `f4008ff`. It restores the supplied perimeter/slab/roof layout, blueprint artwork, upright cutaways and material textures, document stack positions, camera angles and SVG access drawing. It retains the existing React page integration, paper contrast, sample labels and equipment qualifications. The supplied capabilities planner is a 2D elevation; its original artwork is restored.

Model surfaces now distinguish clicks from drags. Layer and sheet clicks work directly on the rendered surfaces, and dragging a surface rotates the model without selecting it. Auto-turn stops when the viewer leaves the screen. The blueprint keeps its original assembled build; wall layers and document sheets have their original exploded states. Smaller viewports use a conservative scale so the blueprint edges remain inside the viewer.

[Current validation](evidence/model-fix/validation.json): **518 tests / 79 files passed**, full/selected TypeScript, production build, service-worker checks, route audit and local smoke passed. Changed source files lint clean; repository lint is 271 errors / 31 warnings, under the required ceiling. The focused public comparison covers **2 URLs / 4 captures** and permits only visible text and screenshots; route, title, heading, canonical, JSON-LD and error fields have no unexpected differences. The public bundle gate covers 33 loaded chunks. Technology-specific JavaScript is [21,047 bytes gzip](evidence/model-fix/technology-bundle-size.json), below the 60 KB target.

The [browser geometry comparison](evidence/model-fix/results.json) matches **47 boxes and 235 corresponding faces** against the supplied building, EIFS, stucco and record previews. Dimensions, face transforms and box positions match. Twenty-two rendered model states at 1440 and 390 px have no clipping; 52 access states exercise all available methods at 1, 3, 8, 12, 20 and 30 storeys. [Surface interaction checks](evidence/model-fix/model-pointer.json) cover clicks, dragging, sheet selection, auto-turn and offscreen pause. Existing partnership hashes, section links, build controls and dark/light contrast checks also pass.

| Model                    | Supplied desktop preview                                              | Corrected desktop                                                    | Corrected mobile                                                   |
| ------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Building                 | [Original](evidence/model-fix/reference-blueprint-assembled-1440.png) | [Desktop](evidence/model-fix/candidate-blueprint-assembled-1440.png) | [Mobile](evidence/model-fix/candidate-blueprint-assembled-390.png) |
| EIFS cutaway             | [Original](evidence/model-fix/reference-wall-exploded-1440.png)       | [Desktop](evidence/model-fix/candidate-wall-exploded-1440.png)       | [Mobile](evidence/model-fix/candidate-wall-exploded-390.png)       |
| Stucco cutaway           | [Original](evidence/model-fix/reference-stucco-exploded-1440.png)     | [Desktop](evidence/model-fix/candidate-stucco-exploded-1440.png)     | [Mobile](evidence/model-fix/candidate-stucco-exploded-390.png)     |
| Record sheets            | [Original](evidence/model-fix/reference-record-exploded-1440.png)     | [Desktop](evidence/model-fix/candidate-record-exploded-1440.png)     | [Mobile](evidence/model-fix/candidate-record-exploded-390.png)     |
| Swing stage, 12 storeys  | [Original](evidence/model-fix/reference-access-12-Swing-1440.png)     | [Desktop](evidence/model-fix/candidate-access-12-Swing-1440.png)     | [Mobile](evidence/model-fix/candidate-access-12-Swing-390.png)     |
| Mast climber, 30 storeys | [Original](evidence/model-fix/reference-access-30-Mast-1440.png)      | [Desktop](evidence/model-fix/candidate-access-30-Mast-1440.png)      | [Mobile](evidence/model-fix/candidate-access-30-Mast-390.png)      |

Full-page captures: [technology desktop](evidence/model-fix/page_company_technology-1440.png), [technology mobile](evidence/model-fix/page_company_technology-390.png), [capabilities desktop](evidence/model-fix/page_capabilities-1440.png), [capabilities mobile](evidence/model-fix/page_capabilities-390.png). See the [focused comparison](evidence/model-fix/comparison.json), [page controls](evidence/model-fix/browser-controls.json), [integration](evidence/model-fix/browser-integration.json) and [theme results](evidence/model-fix/browser-theme.json).

The browser checks use Chromium and synthetic offline fixtures. Firefox, Safari and an approved production replay were not exercised. Matching model geometry does not claim pixel-identical pages: the site retains its own typography, controls and sample document content. Current main's separate authentication hook configuration/templates are preserved; no functions or configuration were deployed.

The reproducible harnesses are in [browser/](browser/). Serve the supplied `page-redesigns` directory on loopback port 8099 and the production app on 4179. Install Playwright outside application dependencies, then set `REDESIGN_PLAYWRIGHT_MODULE` to its module directory when running `node _assessment/page-redesigns/browser/verify-model-fidelity.cjs` or `verify-model-pointer.cjs`. Chromium is expected at `/usr/bin/chromium`; default evidence output is `/workspace/design-evidence`, and the fidelity output directory can be changed with `REDESIGN_EVIDENCE_DIR`. Requests outside loopback are blocked or answered with synthetic Supabase fixtures.

## PR #50 verification before model corrections

The implementation is rebased onto `668279c87def8067d1125431b176db7cb93088af` (PR #49), preserving its shared component updates and all 86 existing page declarations. This PR adds redesign reasons for the two target pages.

[PR #50 verification](evidence/pr-validation.json): **514 tests / 78 files passed**, selected/full TypeScript and production build passed, service-worker and route checks passed, changed source files lint clean, repository lint 270 errors / 31 warnings within the required ceiling. Desktop/mobile controls, all four partnership links, six section anchors and dark-theme checks passed again. The focused public bundle gate covers the two redesigned URLs and 33 loaded public chunks, with no forbidden modules.

| PR #50 candidate | Desktop                                                       | Mobile                                                      |
| ---------------- | ------------------------------------------------------------- | ----------------------------------------------------------- |
| Technology       | [1440 px](evidence/pr-candidate-_company_technology-1440.png) | [390 px](evidence/pr-candidate-_company_technology-390.png) |
| Capabilities     | [1440 px](evidence/pr-candidate-_capabilities-1440.png)       | [390 px](evidence/pr-candidate-_capabilities-390.png)       |

The original design comparison and validation below were recorded before rebasing onto the latest main. They remain historical evidence; the full approved production replay has not been rerun. No shared component changes from PR #49 were reverted.

## What changed

- **Technology:** compact hero with process facts and tool labels; a blueprint-to-building model, selectable EIFS/stucco layers and project record sheets; sample bid, takeoff, daily report and closeout packages; five process tabs; compact comparison and audience cards. The previous long scroll sequence and duplicate timeline were removed.
- **Capabilities:** site responsibility comparison; four partnership charts; a filterable, expandable 13-scope capability matrix linked to existing services; a building-height access planner; a seven-step sample inspection plan; a compact project capacity range.

Samples are labelled as illustrative. Prices are redacted, sample photo locations use placeholders, and the sample inspection form does not submit or save a record. Technology models start still, respond to keyboard and pointer controls, and stop their build sequence when offscreen. Reduced motion completes the build immediately. Drawings retain their paper colors in the site's dark theme.

Heavy technology and capability explorers load as they approach the viewport. The small site responsibility comparison renders immediately to keep incoming partnership links at the correct position.

## Integration preserved

Routes, shared navigation, footer, contact constants, service URLs, SEO titles, canonical URLs, H1s, breadcrumb schema and FAQ content remain in place. The capabilities hero retains its image, copy, figures and calls to action. The four existing partnership anchors (`prime-contractor`, `trade-partner`, `consultant-led`, `direct-service`) open the corresponding chart. The existing `delivery-methods` anchor remains available.

The existing shared three-path project CTA is retained, with the requested page-specific heading. No shared component, dependency manifest, lockfile, environment file, generated Supabase client, database or storage configuration was changed. No live records were written and nothing was published or deployed.

## Screenshots and page length

Full-page captures include the site's real navigation and footer. Viewport height is 900 px.

| Page / viewport       | Before                                                 | After                                                | Height before → after |
| --------------------- | ------------------------------------------------------ | ---------------------------------------------------- | --------------------- |
| Technology, 1440 px   | [Before](evidence/before-_company_technology-1440.png) | [After](evidence/after-_company_technology-1440.png) | 7041 → 5388 px        |
| Technology, 390 px    | [Before](evidence/before-_company_technology-390.png)  | [After](evidence/after-_company_technology-390.png)  | 9451 → 8149 px        |
| Capabilities, 1440 px | [Before](evidence/before-_capabilities-1440.png)       | [After](evidence/after-_capabilities-1440.png)       | 10302 → 9396 px       |
| Capabilities, 390 px  | [Before](evidence/before-_capabilities-390.png)        | [After](evidence/after-_capabilities-390.png)        | 16275 → 13755 px      |

Technology meets the reference's target of fewer than six 900 px screens on desktop. Its route and redesign-specific JavaScript total **21,504 bytes gzip**, including the small helpers shared with capabilities, against the reference's 60 KB target. Existing shared React/router/UI vendor code is excluded from that page-specific figure; [chunk sizes](evidence/technology-bundle-size.json) list the files measured.

## Validation

| Check                             | Result                                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Full Vitest suite                 | 479 tests across 70 files passed; 18 new interaction tests                                                              |
| Selected and full app TypeScript  | Passed                                                                                                                  |
| Production build with source maps | Passed; existing large-bundle and dependency warnings remain                                                            |
| Service worker validation         | Passed, including preservation of open forms/editors                                                                    |
| Internal route audit              | Passed                                                                                                                  |
| Production SPA smoke check        | Passed; optional live Edge Function reachability skipped                                                                |
| New and changed source files lint | Clean                                                                                                                   |
| Repository lint                   | Existing 279 errors / 32 warnings, unchanged and within the repository's 288 / 34 ceiling                               |
| Whitespace check                  | `git diff --check` passed                                                                                               |
| Public bundle gate                | Passed across 86 URLs and 121 loaded public chunks                                                                      |
| Local public comparison           | Text, SEO, schema, route/status and runtime error checks passed; strict screenshot gate has 11 rendering-noise failures |

[Browser controls](evidence/browser-controls.json) cover both 1440 px and 390 px: model tabs and layers, tool highlighting, measured polygon area, keyboard takeoff, document pages, process navigation, matrix filters and service links, access heights of 3/8/20 storeys, and inspection navigation. The redesigned pages have no horizontal document overflow or uncaught page errors in these checks.

[Integration checks](evidence/browser-integration.json) cover all four incoming partnership links and six section anchors at both widths, hero tool visibility, and a normal-motion build that progresses, pauses offscreen and resets. [Theme checks](evidence/browser-theme.json) cover persisted dark mode at both widths and the desktop theme toggle; sample document/drawing text and highlighted chart labels exceed 7:1 contrast.

The [public comparison](evidence/results.json) covers **86 public URLs / 172 captures**: 157 captures match, four have declared page redesigns, and 11 fail exact pixel comparison. The remaining differences are confined to unchanged hero images, with a maximum channel delta of 1–4 levels out of 255. Dimensions, text, metadata and runtime checks match. [The diagnostic](evidence/rendering-noise.json) records each failure and its changed region; accompanying before/after images are retained. No additional page changes were waived and the comparison threshold was not changed.

The [public bundle gate](evidence/bundle-results.json) passed, excluding the repository's forbidden editor/chart packages from loaded public chunks. Intentional changes are declared only for visible text and screenshots on `/company/technology` and `/capabilities` in [the declarations](../baseline/intentional-changes.json).

## Coverage and content review

Comparison uses the untouched starting commit `18ba4e5c843e7e7939a0ce6d581bdd24703705f8` and the candidate production build with deterministic synthetic public service/project/article fixtures. Other public queries return empty/no-row fixtures; external requests, including maps and analytics, are blocked. Images are decoded and lazy sections revealed before capture. Recapture with software rendering and a fixed sRGB color profile reduced, but did not eliminate, the small compositing differences described above. JSON-LD script blocks are sorted before hashing to avoid treating Helmet insertion order as a content change; their contents are still compared strictly.

This is local Chromium regression evidence, not an approved production baseline or live CMS replay. Firefox, Safari, live form submissions and live backend integrations were not exercised. No approved production-baseline artifact was available in this workspace, so that production replay gate remains for the repository's normal CI/release workflow.

The design briefs identify company facts for owner review: current tool usage, delivery flags and building types in the scope matrix, typical wall assembly/check wording, and sample inspection procedures. Procore/BIM 360 remain qualified as used when the GC requires them. Access methods are illustrative and make no equipment ownership claim. Existing WSIB, insurance, experience and growing-bonding wording was preserved rather than strengthened.

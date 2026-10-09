# Verification and coverage

Baseline: freshly fetched main **b42b30f**. Candidate: **website/audit-completion**. Application package manifests and lockfiles are unchanged; checks use the previously installed frozen dependency graph. No live submissions, backend writes, migrations, deployments, merge or publication occurred.

| Check | Result |
| --- | --- |
| Full Vitest | **649 tests / 103 files passed**, including 16 new regression tests |
| Full application TypeScript | Passed (`tsconfig.app.json`) |
| Selected strict TypeScript | Passed (`tsconfig.selected-strict.json`) |
| Default production build | Passed |
| Separate production build with hidden source maps | Passed; all **164 observed public JavaScript chunks are byte-identical** to the default build |
| Service-worker validation | Passed; open forms/editors retain existing update behavior |
| Internal route audit | Passed |
| Whole repository lint | **205 errors / 29 warnings**, down from main's 210 / 29, within the required 288 / 34 ceiling. Not clean whole-repository lint. No file count increased; new source/test/tool files have zero lint messages. |
| Public comparison | **85 URLs / 170 captures passed** under this phase's explicit text/screenshot/schema declarations; zero unexpected changes |
| Metadata/runtime protections | Titles, H1s, canonicals, final paths, HTTP responses and runtime diagnostics receive no new waivers |
| Public bundle gate | Passed across **164 loaded public chunks**; one verified data-only asset metadata module; no forbidden editor/chart sources |
| Automated accessibility | All **170 candidate captures** have zero detected WCAG-tagged violations, zero page errors, and zero horizontal overflow. Baseline: 169 affected captures, 225 rule violations / 481 node instances. |
| Normal-motion/theme checks | Four representative pages (`/`, `/services`, `/company/technology`, `/capabilities`), **320px**, light and dark: all eight candidate scenarios have zero detected violations, page errors or horizontal overflow |
| Model/form state checks | Technology keyboard rotation changes 128° → 138° and exploded view activates; Capabilities height changes to 30 storeys and the SVG updates; RFP exposes 25% progress/current step and all four labels fit at 320px |
| No-JavaScript initial HTML/edge check | **Fails accurately on the local SPA**: all 85 page checks and 35 edge checks fail. This records the remaining Lovable rendering/status work; it is not counted as a fixed finding. |
| Whitespace/diff check | Passed |

## Evidence

- [Comparison results](evidence/public-comparison.json): all 170 comparisons have declared changes; **zero are claimed identical**. Changes cover shared phone/contrast/schema improvements and the narrow page-specific changes listed in [this phase's declarations](intentional-changes.json). Prior broader cumulative declarations are not used to waive current metadata changes.
- [Public bundle provenance](evidence/public-bundle.json).
- [Accessibility summary, including incomplete checks](evidence/accessibility.json), [normal-motion/theme scenarios](evidence/motion-theme-checks.json), and [model/form state checks](evidence/model-form-check.json).
- [Local initial-HTML/edge failure summary](evidence/public-html-local-summary.json): five representative page findings and every edge check; the complete 85-page local report remains in `/workspace/audit-completion-evidence/public-html-local.json`.
- [Lint counts](evidence/lint-summary.json).
- Full phone homepage images: [before](evidence/home-before-390.png) and [after](evidence/home-after-390.png). [Rendered Technology wall model at 320px](evidence/technology-model-320.png).

All 85 sitemap paths were captured in both builds at **1440px and 390px**, with reduced motion, stable time/randomness, completed local image decoding and synthetic service/project/article fixtures. Other public queries return empty arrays or explicit no-row responses. External requests are intercepted; project WebSockets are closed locally. Expected no-row HTTP 406 console diagnostics are present in both builds and compared rather than waived. No candidate page throws a browser error.

The default Vite production build omits source maps. The provenance gate therefore uses a separate **production** build with `--sourcemap hidden` in the evidence workspace, then verifies byte equality of every observed public script before checking its sources. Production Vite configuration is unchanged and review source maps are not added to the deployed application.

Complete raw captures, comparison images and logs remain in `/workspace/design-evidence/audit-completion-before`, `/workspace/design-evidence/audit-completion-final`, and `/workspace/audit-completion-evidence`. The committed evidence uses the completed stable final pass, not intermediate exploratory captures.

## Limits and remaining work

- This is offline source/layout regression evidence, **not an approved production baseline or a check of current production CMS records**.
- Axe-core 4.13.0 checks selected WCAG 2/2.1 A/AA rules; zero detected violations is not a full accessibility certification. Incomplete automated color/ARIA checks remain reported. Screen-reader usability, every interaction state, authenticated admin workflows, and actual form/email delivery are not certified by these captures.
- Functional tests retain backend activation gates and run offline. No live RFP/estimate/contact/newsletter submission was sent.
- Production edge HTML/statuses, verified Google crawl output, social fetches, custom-domain/cache configuration and field Core Web Vitals remain unverified. The script's local failure is **positive evidence that SSR and real 301/404 are still unfinished**, not a reason to mark them complete.
- Existing build-size and React/jsdom test diagnostics remain. No production performance score or ranking improvement is claimed.
- Owner-dependent work is explicitly deferred. [The full finding matrix](README.md) and [Lovable acceptance procedure](LOVABLE-ACCEPTANCE.md) identify each remaining dependency.

## Re-run the repository checks

```sh
node scripts/install-ci-dependencies.mjs
node_modules/.bin/vitest run --maxWorkers=2
node_modules/.bin/tsc -p tsconfig.app.json --noEmit
npm run typecheck:selected
npm run build
npm run validate:sw
node_modules/.bin/tsx scripts/audit-routes.ts
node_modules/.bin/eslint .
git diff --check
```

Whole lint remains nonzero at the documented inherited budget. Browser tooling stays isolated from application packages. Use [the hosting checker procedure](LOVABLE-ACCEPTANCE.md) after Lovable supplies supported route rendering and edge routing.

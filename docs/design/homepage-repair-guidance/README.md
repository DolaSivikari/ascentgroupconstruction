# Homepage repair guidance

Phase: HP — restrained repair guidance. Base: current main, `52d58a9` (PR #70 merged). Scope is the homepage only.

## Result

Visitors with an early-stage building issue can open four guidance examples, see what information helps define the scope, and reach the existing Contact or RFP page. A clearly labelled illustrative documentation preview shows scope inclusions/exclusions, a sample field-report entry and a closeout index. It reuses the Technology page's existing elevation, with numbered repair/access annotations. No sample is presented as a completed Ascent project or a real quote.

The existing long company introduction is available in a native expandable section. Its wording, service cards and credential cards are retained. Only the inquiry invitation defaults (`home-inquiry.f003` and `f004`) change. The homepage hero, slide data, video, scroll effect, controls, property entry paths, navigation, contact constants, credentials, projects, form fields and submission code remain unchanged. Other routes have no intended public changes.

No database, backend, dependency, role, secret, deployment or publishing changes are required. Both new sections use existing deferred error boundaries. New presentation copy is registered as `home-repair-guide` through the existing Pages content registry; URLs and structural identifiers remain locked. Existing published overrides and activation switches retain their priority and behavior.

## Review previews

- [Desktop problem guide](previews/repair-guide-1440.png)
- [Phone problem guide](previews/repair-guide-390.png)
- [Desktop documentation sample](previews/documentation-before-1440.png)
- [Phone documentation sample](previews/documentation-before-390.png)
- [Phone dark-mode sample](previews/documentation-dark-390.png)

These are captures from local production builds with offline fixtures. Existing floating site controls may appear in section captures. They are not screenshots of a published change.

## Repeat the interaction checks

Use the repository's frozen installer and isolated browser tooling described in [Public comparison](../../development/public-comparison.md). Serve a candidate production build locally. Optionally serve an unchanged main build at a second local origin to compare existing form controls.

```bash
BASELINE_PLAYWRIGHT=/path/to/isolated/node_modules/playwright \
CHROMIUM_PATH=/path/to/chromium \
node scripts/homepage-repair-guidance-browser.cjs \
  http://127.0.0.1:4176 /tmp/homepage-repair-guidance \
  http://127.0.0.1:4177
```

The last argument is optional; without it, form-control equivalence is explicitly reported as untested. The runner permits local origins only, uses empty-list/no-row backend fixtures, blocks other external requests and mutations, closes WebSockets and blocks service workers. It never submits forms. It verifies Enter/Space expansion, arrow-key documentation tabs, existing route targets, Contact navigation and return, one H1 and no horizontal overflow at 1440, 390 and 320 px. Dark mode is captured separately. Normal-motion video/pin checks are separate from this reduced-motion runner.

## Validation

See [verification.json](evidence/verification.json) for completed checks and limitations, [source-contract.json](evidence/source-contract.json) for protected-source equivalence, and the adjacent browser/comparison reports. The local all-page regression uses deterministic synthetic fixtures; it is not a newly approved production baseline. Main's Git tree matches the already captured PR #70 source exactly. The repository's approved production-baseline workflow remains unchanged.

## Publish and rollback

This PR is for review; it is not merged or published by Codex. After review and merge, the owner publishes through Lovable **Publish → Update**, checks desktop/phone and the existing Contact/RFP paths, then refreshes the approved baseline for the published commit.

Revert this PR and publish the reverted version to restore the previous homepage. There is no SQL or storage rollback. Previously saved content stays in the database; no content records are rewritten or deleted.

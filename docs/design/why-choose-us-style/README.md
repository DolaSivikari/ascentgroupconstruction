# Why Choose Us — style refresh

Phase: HP — Why Choose Us styling. Based on main `a2b2f41`, after PR #71 merged. Only this homepage section changes.

## Design

The original heading and introduction sit in a navy panel with a quiet drawing-grid texture and orange rule. The reasons use a two-column layout with fine dividers, smaller icons and the existing badges. The existing proposal/portfolio actions sit in the same rounded frame. On phones, the introduction and reasons stack into one column; dark mode retains readable surfaces and buttons.

Every heading, description, badge and button label remains unchanged and in the original order. The content module, saved-content priority, data query, empty-data fallback, loading text and link destinations are unchanged. No credentials, company claims, homepage hero, other section, forms, navigation, dependency, database, migration or backend setting is edited.

## Previews

- [Before — desktop](previews/before-desktop.png)
- [After — desktop](previews/after-desktop.png)
- [After — phone](previews/after-phone.png)
- [After — phone, dark mode](previews/after-phone-dark.png)

These section-only exports hide unrelated fixed site controls so the section can be reviewed clearly. Complete-page comparison captures use the unmodified page, including those controls. All captures use local production builds with offline fixtures; none represent a published change.

## Evidence

The [copy contract](evidence/copy-contract.json) verifies identical fallback string values, content-module bytes and query source. The [browser checks](evidence/style-checks.json) compare exact words/order with main for empty-data defaults and synthetic saved-content fixtures, including an odd item count, a long description, a missing icon and an absent badge. They cover desktop/phone widths, light/dark themes and normal/reduced motion. No forms are submitted and external mutations are blocked.

See [verification.json](evidence/verification.json) and [public-comparison.json](evidence/public-comparison.json) for final check results. Only screenshot differences on `/` are permitted in the local comparison: all visible text and metadata must remain exact. The local fixture regression is separate from the approved production-baseline CI workflow.

The first concurrent full test run hit an existing admin test's five-second limit. That test passed separately without changing its timeout or assertions; the full suite then passed with two workers. An initial dark-theme contrast issue in the section's outline button was corrected locally and rechecked. Draft captures from before that correction are excluded from final comparison evidence.

## Publish and rollback

Review the PR and GitHub checks before merging. Codex does not merge or publish. The owner uses Lovable **Publish → Update**, checks desktop/phone and the existing actions, then refreshes the approved published baseline.

To restore the previous presentation, revert this PR and publish the reverted version. There is no database or storage rollback; saved content is untouched.

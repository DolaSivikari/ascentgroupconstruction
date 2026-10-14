# Why Clients Choose Us — contained visual polish

Phase: HP — screenshot-identified client reasons. Base: main `2433571`, with PR #72 merged.

## Correct section

The owner's screenshot shows **Why Clients Choose Us**, implemented in `WhoWeServeHomepage.tsx`. This is separate from **Why Property Owners Choose Us** in `WhyChooseUs.tsx`, which PR #72 restyled. The earlier PR did not change the screenshot's block.

This phase changes only that block's presentation. The other Why Choose Us section, services, hero, following Who We Serve cards, page composition, text, credential claims, links and form handling stay unchanged.

## Visual changes

- One rounded frame aligned with the following audience cards, with a restrained orange top rule.
- Existing accountability statement presented as a callout; the existing explanatory paragraphs use balanced columns on wider screens.
- Existing seven benefits use a responsive card grid, with local coverage spanning the last row on wider screens.
- Existing three actions sit in a consistent footer, with wrapping and semantic contrast colours for phones/dark mode.
- Informational benefit cards no longer lift as if they were clickable.

No headings, descriptions, benefits, labels, numbers or destinations are rewritten. Existing page-content fields and published override priority are retained. No dependencies, backend, database, authentication, secrets or hosting configuration changes are required.

## Previews

[Before — desktop](previews/before-desktop.png) · [After — desktop](previews/after-desktop.png) · [After — phone](previews/after-phone.png) · [After — dark phone](previews/after-phone-dark.png)

These are local production-build captures using offline fixtures. Section-only exports hide unrelated fixed site controls. Full-page comparisons retain the actual page and controls.

## Checks and scope

[Source contract](evidence/source-contract.json) verifies unchanged strings/content modules and byte-identical following audience markup. [Browser checks](evidence/browser-checks.json) compare words/order and action destinations with main at desktop, tablet and phone widths, in both themes and motion modes. They also compare the following audience content/links and check seven benefits, responsive coverage width and WCAG issues. External requests and mutations are blocked; no forms are submitted.

[Verification](evidence/verification.json), [public comparison](evidence/public-comparison.json) and [bundle provenance](evidence/public-bundle.json) record final outcomes. The local comparison allows only homepage screenshots to differ; visible text and metadata must remain exact on every URL. The fixture regression is separate from the approved production-baseline CI check. The [baseline source record](evidence/baseline-source.json) verifies that the earlier local captures were built from the exact Git tree now merged into main.

## Publishing and rollback

PR #72 was verified merged. At the beginning of this phase, the public domain still referenced an older `WhyChooseUs` asset without the PR #72 layout markers; [the public bundle observation](evidence/public-version-observation.json) records that limited read-only finding. This does not diagnose the owner's browser, prove which commit Lovable has synced, or change the fact that the screenshot's section was outside PR #72.

Codex opens this PR for review and does not merge or publish. After review/merge, confirm Lovable has synced current main, choose **Publish → Update**, then check both named sections in a private window. Saving editor changes or merging a PR alone does not establish that the public domain serves that version.

Revert this PR and publish the reverted version to restore the prior presentation. No database or storage rollback is needed.

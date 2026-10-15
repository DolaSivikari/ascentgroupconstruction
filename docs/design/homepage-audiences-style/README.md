# Who We Serve — homepage card polish

Phase: HP — homepage audiences. Base: main `3b019d2`, with PR #73 merged.

The four audience cards now give their existing icons, titles and descriptions separate space. Rounded frames, a small orange heading accent and quiet directional arrows match the nearby client-reasons section. The whole card remains a link, with visible keyboard focus and restrained hover colours. Cards use four columns on wide desktops, two on tablets and narrow desktops, and one on phones.

All wording, reading order, audience destinations and published-content access stay unchanged. The preceding **Why Clients Choose Us** block is byte-identical from the component declaration through its closing markup. Shared `SegmentCard`, the separate `WhyChooseUs` component, the content module, hero, navigation, forms and other routes are unchanged. No application dependencies, backend changes or hosting changes are required.

## Previews

[Before — desktop](previews/before-desktop.png) · [After — desktop](previews/after-desktop.png) · [After — phone](previews/after-phone.png) · [After — dark phone](previews/after-phone-dark.png)

Local production-build previews use offline synthetic fixtures. Section-only exports hide unrelated fixed site controls; the full-page regression captures retain them.

## Validation

- [Source contract](evidence/source-contract.json): byte-identical hooks, data and preceding client-reasons JSX; protected files unchanged.
- [Browser checks](evidence/browser-checks.json): exact words and four link destinations against main; responsive card rows at 1440, 768, 390 and 320 px; light/dark themes; normal/reduced motion; all four keyboard focus rings; navigation to the existing contractor page and back; target WCAG checks. No production forms are submitted, external traffic is blocked and public data comes from synthetic fixtures.
- [Baseline provenance](evidence/baseline-source.json): previous local captures reused only after verifying their source tree equals current main.
- [Verification](evidence/verification.json), [public comparison](evidence/public-comparison.json) and [bundle report](evidence/public-bundle.json): required repository and all-route regression results. The phase-specific declaration permits only homepage screenshots to differ; every URL's visible text and metadata must remain exact.

The local fixture regression is separate from CI's approved production-baseline comparison. These checks do not validate current live CMS values, native Safari/Firefox or physical devices. Accessibility scans cover the changed section; the full inventory comparison checks text, metadata, screenshots and runtime errors.

## Review and publishing

This PR is prepared for review; Codex does not merge or publish it. After approval and merge, confirm Lovable has synced main, then choose **Publish → Update** and check the public site in a private window. A GitHub merge alone does not publish Lovable.

Revert this PR and publish the reverted version to restore the previous styling. No database or storage rollback is needed.

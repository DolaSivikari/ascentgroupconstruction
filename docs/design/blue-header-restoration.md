# Taller headers with the original blue treatment

The shared page-header image areas regain taller proportions and a stronger `#003366` blue overlay. Minimum heights scale with the viewport; desktop caps prevent extreme heights, and long mobile content can still grow naturally. The page-specific images, crop focal points, removed illustration captions, typography, wording and CTA destinations are preserved.

At the offline fixture viewport height of 1,000 px:

| Header | Desktop before → after | Phone before → after |
| --- | --- | --- |
| About | 657 → 800 px | 568 → 750 px |
| Waterproofing | 448 → 650 px | 338 → 600 px |

[Desktop preview](previews/blue-header-desktop.png) · [Phone preview](previews/blue-header-mobile.png)

The styling is scoped to the existing shared interior-page header. Supporting information remains below the image on phones. The homepage video, custom project heroes, credential wording and navigation are unchanged. No database or image-asset changes are required.

Validation: 680 tests / 112 files, full and selected TypeScript, build, entry budget, route audit and service-worker checks passed. Lint remains at 201 existing errors / 29 warnings with no new violations. Narrow 320 px dark-theme checks passed for About, FAQ and Waterproofing. Browser checks use offline fixtures and never submit forms or write to a backend. The first combined long browser attempt timed out; Markets passed independently, and desktop/phone remainder captures were run separately.

All-page offline comparison passed for 85 canonical pages at desktop/phone widths: 138 declared screenshot changes across the 69 shared headers, 32 identical captures and zero unexpected differences. All 170 captures preserve visible text, H1, title, canonical, JSON-LD, status and runtime/console error state. Public bundle gate passed for 229 loaded chunks. This is synthetic-fixture verification; GitHub retains the independent recorded-production comparison.

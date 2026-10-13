# Homepage video scroll frame

This records the original frame-only phase. The owner's later Part A scroll-out adds a separate pin/statement wrapper; see [the current handoff and integration notes](../../_assessment/page-redesigns/homepage-hero-scroll/IMPLEMENTATION-NOTES.md).

The homepage's existing media crops inward into a rounded panel as the visitor scrolls. Desktop reaches 9% side and 13% vertical insets with 14 px corners; phones use 16 px side and 32 px vertical insets with 12 px corners. The dark surround is `#0b0d10`, with the existing black gradient inside the frame.

The hero holds for half a viewport and then returns to normal page flow. Scrolling back reverses the frame. Only the video/poster and gradient are cropped: the headline, buttons and slideshow controls retain their layout and size. There is no new statement, extra content section or homepage redesign.

The existing video's DOM node, source, loading, playback and slideshow logic are retained. The scroll hook changes CSS variables without updating React state. Both outgoing and incoming slide media sit inside the same mask, independently of their existing transforms and mouse movement.

The local hold reserves its own space and offsets the scene within it, avoiding the site's existing root overflow and route transforms that prevent reliable native sticky/fixed positioning. Relative positioning also preserves the existing composited button labels. Tall content stays in ordinary flow without added scroll space; reduced motion removes framing and holding altogether. The current reduced-motion and Data Saver poster behavior remains in place.

No dependency, SQL, database, admin, navigation or credential changes are included. The intentional public change is declared only for `/` in the page-safety configuration.

[Desktop framed preview](previews/homepage-scroll-frame-desktop.png) · [Phone framed preview](previews/homepage-scroll-frame-mobile.png)

## Verification

Results and coverage are recorded in [homepage-scroll-frame-verification.json](homepage-scroll-frame-verification.json). Browser checks use offline content fixtures and the real local MP4, with backend calls intercepted. They do not establish production deployment or mobile Safari behavior.

The motion runner checks full bleed, midpoint, exact final insets, release, reverse scrolling, uninterrupted playback without media reload/replacement, clickable and keyboard-operated slide controls, short-screen flow, reduced motion and Data Saver posters at 1440, 390 and 320 px widths. Run one width at a time to avoid contention from multiple video decoders:

```sh
HERO_QA_ORIGIN=http://127.0.0.1:4197 \
HERO_QA_DIST=/path/to/offline-fixture-build \
HERO_QA_OUTPUT=/path/to/results \
HERO_QA_PATHS='["/"]' HERO_QA_WIDTHS='[390]' \
HERO_QA_MOTION=no-preference HERO_QA_SCROLL_FRAME=true \
node scripts/hero-headers-browser.cjs
```

Use the repository's isolated Puppeteer tooling and a local static server. Build with dummy fixture backend values; the fixture harness intercepts external requests. Default browser comparisons use reduced motion for stable screenshots, so they must be accompanied by the motion runner above.

After review and merge, the owner publishes with Lovable **Publish → Update** and checks the homepage in a private window. Reverting this focused PR removes the effect; no database rollback is needed.

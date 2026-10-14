# One Why Choose Us carousel

The homepage's two separate benefit sections are combined after the project showcase. The existing Who We Serve audience cards and links remain in their original location. The new section uses the same content width, typography, navy and orange accents as the surrounding homepage.

The carousel contains all seven client benefits and all six default property-owner benefits. Saved `why_choose_us_items` replace the owner defaults exactly as before. Both `home-audiences` and `home-why-choose-us` content modules remain connected to the existing content editor; their IDs, fields, defaults, protected wording and schemas are unchanged.

Desktop shows three benefits per group, tablet two, and phones one. Desktop groups are balanced 3/2/2 for clients and 3/3 for owners. A 600 ms crossfade changes the benefit group and audience introduction. The grid reserves the tallest group's space, so navigation does not move the section's bottom or interrupt scrolling. Inactive groups are inert and hidden from assistive technology.

Automatic rotation advances every 12 seconds while the section is visible. It pauses on hover, keyboard focus, manual navigation, an expanded introduction or a hidden browser tab. Play resumes an explicitly paused carousel, including when the Play button retains focus. Reduced motion disables fades and automatic rotation while keeping manual navigation available.

Audience buttons, next/previous controls, desktop pagination, left/right keys and horizontal swipes make every benefit reachable. Vertical scrolling and pinch zoom remain native. The original longer introductions and proposal copy are retained under **More about our approach**. Existing CTA wording and destinations follow the selected audience.

The homepage hero, navigation, footer, credential claims, admin screens and every other page are unchanged. No SQL, dependency, live database/storage, email, function deployment or publishing changes are included.

[Desktop clients](previews/why-carousel-clients-desktop.png) · [Desktop property owners](previews/why-carousel-owners-desktop.png) · [Phone property owners](previews/why-carousel-owners-mobile.png)

## Verification

The results are in [unified-why-choose-carousel-verification.json](unified-why-choose-carousel-verification.json). Browser checks use anonymous offline content fixtures, block external writes and retain the actual local hero assets. They do not verify authenticated live content or mobile Safari.

The browser runner observes a real 12-second rotation on desktop, exercises all groups at each width, verifies stable stage/section heights, inert inactive slides, CTA destinations, protected expandable copy and horizontal overflow. Unit tests cover hover/focus/reading/hidden-tab pauses, Play behavior, keyboard navigation, responsive regrouping, saved owner records, touch direction and reduced motion.

Use the existing isolated Puppeteer tools and a local fixture build/server. The shared harness keeps its default reduced-motion comparison behavior; enable the additional runner when testing the carousel:

```sh
HERO_QA_ORIGIN=http://127.0.0.1:4197 \
HERO_QA_DIST=/path/to/offline-fixture-build \
HERO_QA_OUTPUT=/path/to/results \
HERO_QA_PATHS='["/"]' HERO_QA_WIDTHS='[1440]' \
HERO_QA_MOTION=no-preference HERO_QA_WHY_CAROUSEL=true \
node scripts/hero-headers-browser.cjs
```

After review and merge, publish using Lovable **Publish → Update**, then check the combined section on desktop and phone in a private window. Reverting this focused PR restores the two separate sections without a database rollback.

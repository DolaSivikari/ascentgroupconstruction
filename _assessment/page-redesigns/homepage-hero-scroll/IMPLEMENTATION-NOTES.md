# Part A integration against current main

Base: `4dc6445` (October 13, 2026). This folder preserves the eleven attached handoff files at the README's requested paths. Their complete `EnhancedHero`, `Index` and scroll-indicator files are reference copies, not replacements for current application code. The supplied standalone `index.html` is under `test-page/`; the application's root HTML is unchanged.

## Changes needed for current main

- PR #68 already introduced a media-frame wrapper and scroll controller inside `EnhancedHero`. Part A disables that controller through `scrollFrameEnabled={false}` only when the new `HeroScrollFrame` is used. Existing slides, video/poster sources, overlay, autoplay timing, mouse/swipe behavior, controls, statistics and content stay intact. The previous hook/styles are retained for their existing contract rather than deleted.
- The supplied `.hsf` styles are appended to the existing stylesheet. A scoped height rule accommodates the current hero's existing outer wrapper. No global overflow, transition, navigation or brand styles change.
- `home-commitment.ts` was mentioned in the handoff but not attached. It is created from the exact supplied wording using the existing structured-content factory and registry. The reference `code/` also includes this reconstructed file. The admin Pages editor discovers it as a homepage module; existing override, draft/publish and canary switches stay unchanged. No live settings or content are written.
- A layout/resize guard uses the static band when enlarged or saved hero content would hide controls. This fixes a verified 200%-text/640px-height clipping case in the supplied wrapper. Scroll still only updates CSS variables in a queued animation frame; it does not update React state. Ordinary 1440×900 desktop behavior keeps the supplied pinning/curves.
- Only archived handoff `code/**` is excluded from application lint. Those older source copies are neither compiled nor run by the application's `src/**` tests. Active new files are lint-clean; no lint budget or rule is relaxed.
- The raw code copies and supplied patch contain original trailing whitespace. Path-specific Git attributes preserve their exact bytes; active application source and all authored notes retain normal whitespace checks.
- Current AGENTS.md places cumulative declarations in `config/page-safety/intentional-changes.json`, replacing the handoff's historical baseline path. Only the homepage reason is appended. This phase's separate declaration allows **visible text and screenshots on `/` only**; title, H1, canonical, JSON-LD, status and errors stay protected.

The original reference screenshots were not attached. `screenshots/` contains captures of this implementation on the actual local production build, clearly identified by the verification report; it does not reproduce missing original images.

## Part B remains separate

The existing retained page-transition transform affects navigation on **both current main and this implementation**. The local baseline also places the nav above the viewport after navigation/scroll. This is recorded rather than repaired here. Part B's optional global animation changes are not applied.

This PR does not commit directly to main, merge, publish, deploy, run SQL, change secrets/dependencies or write to live services. Follow the [verification report](VERIFICATION.md) and complete the owner's Chrome/Safari/Firefox preview checks before merging. Merging does not publish; the owner later uses Lovable **Publish → Update**.

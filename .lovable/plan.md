# Restore Hero Background Video (Desktop + Mobile)

## What's happening

The homepage hero (`src/components/homepage/EnhancedHero.tsx`) currently hides the `<video>` element on every mobile user-agent via this gate (added back in April):

```ts
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const skipVideo = isMobile || prefersReducedData;
```

When `skipVideo` is true, the component renders the poster image instead of the `<video>`. That's why your mobile preview shows only the static image — by design, not from any recent batch (no batch 1–6 file touched the hero).

For the desktop case where the video also doesn't start, the likely culprits are:
1. `preload="metadata"` on the active slide — some browsers don't fetch enough data to trigger `canplay`, so `autoPlay` never fires.
2. The `mobile` `<source>` element points to a `-mobile.mp4` path derived by `string.replace('.mp4','-mobile.mp4')` — for hashed Vite asset URLs this resolves to a 404; if the browser picks it first, `<video>` errors out before falling back.
3. The play attempt in the loading effect swallows errors silently (`v.play().catch(() => {})`), masking autoplay-policy rejections.

## Changes

### 1. Enable video on mobile
File: `src/components/homepage/EnhancedHero.tsx`

- Replace the `skipVideo` gate so it only skips when the user has Data Saver on or `prefers-reduced-motion`:
  ```ts
  const skipVideo = prefersReducedData || prefersReducedMotion;
  ```
- Keep poster image as the fallback when `skipVideo` is true (current behavior preserved for accessibility / data-saver users).

### 2. Make `<video>` reliably autoplay on both platforms
Same file, both the current-slide and previous-slide `<video>` blocks:

- Change `preload="metadata"` → `preload="auto"` for the **current** slide (keep `metadata` for the outgoing/previous layer since it's transient).
- Only emit the `-mobile.mp4` `<source>` when the slide explicitly provides a separate mobile URL (admin DB field) — drop the unreliable `string.replace` derivation for hashed Vite imports.
- Add `muted`, `playsInline`, `autoPlay`, `loop` (already present) plus `disableRemotePlayback` for iOS Safari stability.
- Set `video.muted = true` imperatively in the load effect before calling `.play()` (some iOS versions ignore the attribute on first paint).

### 3. Robust play + visibility into failures
In the `useEffect` that hooks `videoRef`:

- Replace the silent `.catch(() => {})` with a retry on user gesture (touchstart/click once) and a `console.warn` in dev only.
- Trigger `v.load()` when `currentSlide` changes so the new source is fetched immediately.

### 4. Sanity check / preserve fallback
- Keep the poster image visible underneath via the `poster` attribute on `<video>` so if the video genuinely fails to load, the user sees the image (no broken UI) — exactly the current safety net.
- Leave `useVideoPreloader` untouched (it's already only doing background prefetch and doesn't gate rendering).

## Technical notes

- No DB / schema / route changes.
- No new dependencies.
- Mobile data impact: enabling the hero MP4 on phones adds ~1–3 MB of download. The data-saver and reduced-motion fallbacks remain, so users who opted out still get the poster. If you'd rather provide a properly encoded smaller mobile MP4 later, the code path for `-mobile.mp4` stays in place — it just won't be emitted unless a real URL is supplied.
- Files touched: `src/components/homepage/EnhancedHero.tsx` only.

## Verification

After the change I'll:
1. Reload the preview at mobile (457×748) and desktop widths and confirm the `<video>` element is present and `readyState >= 3`.
2. Watch console for any "Hero video failed to load" errors.
3. Confirm the poster still appears instantly while the video buffers (no flash of empty black).

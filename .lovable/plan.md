## Problem

Featured project image uploads currently reject any image whose aspect ratio is narrower than 1.33:1 (landscape) with the error you saw. The user has to crop manually before uploading.

## Goal

Accept any reasonable image (portrait, square, landscape, PNG/JPG/WEBP/HEIC-converted) and let the system auto-process it to a web-compatible, landscape-cropped, optimized file before storing.

## Approach

Add a single client-side normalization utility and switch the hard rejection in `ImageUploadField` to an auto-fix path.

### 1. New utility `src/utils/image-normalizer.ts`

`normalizeImageFile(file, { targetAspectRatio = 16/9, maxWidth = 2400, format = 'image/jpeg', quality = 0.88 })`:

- Loads the file into an `<img>` via object URL (reuses `readImageDimensions` pattern).
- Draws to an offscreen `<canvas>`:
  - If the source ratio is narrower than `targetAspectRatio` (portrait/square), crop horizontally centered to the target ratio (keep full width, trim top/bottom only when source is wider; trim left/right only when source is taller — i.e. center-crop to target).
  - If the source ratio is wider than target, leave as-is (no forced crop) unless the caller passes `forceExactRatio: true`.
  - Downscale so the longest edge ≤ `maxWidth`.
- Exports via `canvas.toBlob(..., format, quality)` and returns a new `File` with a `.jpg`/`.webp` extension and the original base name.
- Falls back to returning the original file if canvas export fails (with a console warning), so uploads never silently break.

### 2. Update `src/components/admin/ImageUploadField.tsx`

- Remove the hard `minAspectRatio` rejection branch. Keep `minWidth`/`minHeight` as soft warnings (toast info, not blocker) — if the source is genuinely tiny (e.g. <800px wide) we still warn but proceed.
- After the file-size check, always run `normalizeImageFile` when the field has `minAspectRatio` or `targetAspectRatio` set. Use the resulting `File` for both the preview and the upload.
- Replace the existing aspect-ratio warning copy with a neutral note: "Image was auto-cropped to landscape for the featured slot." shown only when a crop actually happened (utility returns a `didCrop` flag).
- Keep the 5MB size guard, but apply it to the *normalized* output so a 12MB phone photo that compresses down to 1.5MB still uploads. If the original is >15MB, reject up front (browser memory guard).

### 3. Caller surface

No prop changes required for existing call sites (`ImagesTab.tsx` still passes `minAspectRatio={1.33}`); the prop now acts as the auto-crop target rather than a rejection threshold. Project gallery / thumbnail uploads keep working unchanged.

### 4. Out of scope

- HEIC decoding (browsers don't decode HEIC on canvas reliably). If a user uploads HEIC we'll keep the current "Could not read image file" error and add a one-line hint telling them to export as JPG. Real HEIC support would need a server-side conversion step.
- No edge-function changes. All work is client-side so it also works when `useProcessingFunction=false`.

## Files touched

- `src/utils/image-normalizer.ts` (new)
- `src/components/admin/ImageUploadField.tsx` (swap reject → auto-crop, update warning UI)
- `src/utils/image-optimizer.ts` (leave `validateImageFile` in place for any other caller; ImageUploadField just stops using the `minAspectRatio` branch)

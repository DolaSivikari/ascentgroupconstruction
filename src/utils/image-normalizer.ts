/**
 * Client-side image normalization: auto-crop to a target landscape aspect ratio,
 * downscale, and re-encode to a web-friendly format before upload.
 *
 * Designed so any portrait / square / oversized phone photo becomes a
 * web-compatible landscape image without requiring the user to crop manually.
 */

export interface NormalizeOptions {
  /** Target ratio expressed as width/height (e.g. 16/9 ≈ 1.777, 4/3 ≈ 1.333). */
  targetAspectRatio?: number;
  /** Max longest-edge in pixels. Larger images are downscaled. */
  maxWidth?: number;
  /** Output mime type. */
  format?: 'image/jpeg' | 'image/webp';
  /** Encoder quality 0..1 */
  quality?: number;
  /** Force crop even when source is already wider than target. */
  forceExactRatio?: boolean;
}

export interface NormalizeResult {
  file: File;
  didCrop: boolean;
  didResize: boolean;
  didReencode: boolean;
  originalWidth: number;
  originalHeight: number;
  outputWidth: number;
  outputHeight: number;
}

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      // Keep URL alive until caller draws; revoke after onload returns control.
      // We revoke here because we only need naturalWidth/Height + drawImage,
      // and the browser keeps the decoded bitmap referenced by the element.
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not decode image. If this is a HEIC photo, please export as JPG first.'));
    };
    img.src = url;
  });

const swapExtension = (name: string, mime: string): string => {
  const ext = mime === 'image/webp' ? 'webp' : 'jpg';
  const base = name.replace(/\.[^/.]+$/, '') || 'image';
  return `${base}.${ext}`;
};

/**
 * Normalize an uploaded image file:
 *   - Center-crops to `targetAspectRatio` when the source is narrower than target
 *     (or always when `forceExactRatio` is true).
 *   - Downscales so the longest edge ≤ `maxWidth`.
 *   - Re-encodes to JPEG/WebP for predictable size + format.
 *
 * Falls back to the original file if any browser canvas step fails.
 */
export const normalizeImageFile = async (
  file: File,
  opts: NormalizeOptions = {}
): Promise<NormalizeResult> => {
  const {
    targetAspectRatio = 16 / 9,
    maxWidth = 2400,
    format = 'image/jpeg',
    quality = 0.88,
    forceExactRatio = false,
  } = opts;

  const img = await loadImage(file);
  const sw = img.naturalWidth;
  const sh = img.naturalHeight;
  const sourceRatio = sw / sh;

  // Decide crop window (in source coordinates).
  let cropW = sw;
  let cropH = sh;
  let cropX = 0;
  let cropY = 0;
  let didCrop = false;

  const needsCrop =
    forceExactRatio || sourceRatio < targetAspectRatio - 0.001;

  if (needsCrop) {
    if (sourceRatio < targetAspectRatio) {
      // Source is too tall — keep full width, trim top/bottom.
      cropW = sw;
      cropH = Math.round(sw / targetAspectRatio);
      cropX = 0;
      cropY = Math.round((sh - cropH) / 2);
    } else {
      // Source is too wide (only reached with forceExactRatio) — trim sides.
      cropH = sh;
      cropW = Math.round(sh * targetAspectRatio);
      cropY = 0;
      cropX = Math.round((sw - cropW) / 2);
    }
    didCrop = true;
  }

  // Decide output size (downscale only).
  let outW = cropW;
  let outH = cropH;
  let didResize = false;
  if (outW > maxWidth) {
    const scale = maxWidth / outW;
    outW = Math.round(outW * scale);
    outH = Math.round(outH * scale);
    didResize = true;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    // White matte under JPEG to avoid black backgrounds on transparent PNGs.
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outW, outH);
    }

    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, outW, outH);

    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('toBlob returned null'))),
        format,
        quality,
      ),
    );

    const outFile = new File([blob], swapExtension(file.name, format), {
      type: format,
      lastModified: Date.now(),
    });

    return {
      file: outFile,
      didCrop,
      didResize,
      didReencode: true,
      originalWidth: sw,
      originalHeight: sh,
      outputWidth: outW,
      outputHeight: outH,
    };
  } catch (err) {
    console.warn('[image-normalizer] Falling back to original file:', err);
    return {
      file,
      didCrop: false,
      didResize: false,
      didReencode: false,
      originalWidth: sw,
      originalHeight: sh,
      outputWidth: sw,
      outputHeight: sh,
    };
  }
};

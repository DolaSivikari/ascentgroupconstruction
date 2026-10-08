/** Browser-side crop, proportional resizing and encoding for admin uploads. */
export interface NormalizeOptions {
  /** Landscape crop ratio; null keeps the entire photo in its original orientation. */
  targetAspectRatio?: number | null;
  /** Maximum longest edge of the processed image. */
  maxWidth?: number;
  minWidth?: number;
  minHeight?: number;
  format?: "image/jpeg" | "image/webp";
  quality?: number;
  forceExactRatio?: boolean;
  /** Avoid recompressing gallery files that already meet the dimensions. */
  preserveUnchanged?: boolean;
}

export interface NormalizeResult {
  file: File;
  didCrop: boolean;
  didResize: boolean;
  didPad: boolean;
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
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          "Could not decode image. If this is a HEIC photo, please export as JPG first.",
        ),
      );
    };
    img.src = url;
  });

const swapExtension = (name: string, mime: string): string => {
  const ext =
    mime === "image/webp" ? "webp" : mime === "image/png" ? "png" : "jpg";
  const base = name.replace(/\.[^/.]+$/, "") || "image";
  return `${base}.${ext}`;
};

export const normalizeImageFile = async (
  file: File,
  opts: NormalizeOptions = {},
): Promise<NormalizeResult> => {
  const {
    targetAspectRatio = 16 / 9,
    maxWidth = 2400,
    minWidth = 0,
    minHeight = 0,
    format = "image/jpeg",
    quality = 0.92,
    forceExactRatio = false,
    preserveUnchanged = false,
  } = opts;
  if (
    ![maxWidth, minWidth, minHeight].every(Number.isFinite) ||
    maxWidth < 1 ||
    minWidth < 0 ||
    minHeight < 0 ||
    minWidth > maxWidth ||
    minHeight > maxWidth ||
    (targetAspectRatio !== null &&
      (!Number.isFinite(targetAspectRatio) || targetAspectRatio <= 0))
  ) {
    throw new Error("Invalid image size requirements.");
  }

  const img = await loadImage(file);
  const sw = img.naturalWidth,
    sh = img.naturalHeight;
  if (!sw || !sh) throw new Error("Could not read image dimensions.");
  const sourceRatio = sw / sh;
  let cropW = sw,
    cropH = sh,
    cropX = 0,
    cropY = 0;
  const needsCrop =
    targetAspectRatio !== null &&
    (forceExactRatio || sourceRatio < targetAspectRatio - 0.001);
  let didCrop = false;
  if (needsCrop && targetAspectRatio !== null) {
    if (sourceRatio < targetAspectRatio) {
      cropH = Math.max(1, Math.floor(sw / targetAspectRatio));
      cropY = Math.round((sh - cropH) / 2);
    } else {
      cropW = Math.max(1, Math.floor(sh * targetAspectRatio));
      cropX = Math.round((sw - cropW) / 2);
    }
    didCrop = cropW !== sw || cropH !== sh;
  }

  const maximumScale = maxWidth / Math.max(cropW, cropH);
  const minimumScale = Math.max(minWidth / cropW, minHeight / cropH);
  const scale = Math.min(
    maximumScale,
    Math.max(Math.min(1, maximumScale), minimumScale),
  );
  const drawW = Math.min(maxWidth, Math.max(1, Math.ceil(cropW * scale)));
  const drawH = Math.min(maxWidth, Math.max(1, Math.ceil(cropH * scale)));
  // Extreme panoramas/portraits get padding instead of stretching or allocating a huge canvas.
  const outW = Math.max(Math.ceil(minWidth), drawW);
  const outH = Math.max(Math.ceil(minHeight), drawH);
  const didPad = outW !== drawW || outH !== drawH;
  const didResize = outW !== cropW || outH !== cropH;
  const metadata = {
    didCrop,
    didResize,
    didPad,
    originalWidth: sw,
    originalHeight: sh,
    outputWidth: outW,
    outputHeight: outH,
  };
  if (preserveUnchanged && !didCrop && !didResize) {
    return { ...metadata, file, didReencode: false };
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    throw new Error(
      "Could not resize this image: image processing is unavailable.",
    );
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);
  }
  ctx.drawImage(
    img,
    cropX,
    cropY,
    cropW,
    cropH,
    Math.floor((outW - drawW) / 2),
    Math.floor((outH - drawH) / 2),
    drawW,
    drawH,
  );
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) =>
        b
          ? resolve(b)
          : reject(
              new Error(
                "Could not encode the resized image. Please try another photo.",
              ),
            ),
      format,
      quality,
    ),
  );
  if (!["image/jpeg", "image/webp", "image/png"].includes(blob.type)) {
    throw new Error("Could not encode a supported image format.");
  }
  // Some browsers fall back to PNG; use the actual encoder result for both MIME and filename.
  return {
    ...metadata,
    didReencode: true,
    file: new File([blob], swapExtension(file.name, blob.type), {
      type: blob.type,
      lastModified: Date.now(),
    }),
  };
};

import { mediaPath } from "@/lib/admin/media";
import { MediaPicker } from "./MediaPicker";
import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/ui/Button";
import { uploadImage } from "@/utils/imageResolver";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  validateAspectRatio,
  calculateAspectRatio,
  validateImageFile,
} from "@/utils/image-optimizer";
import { normalizeImageFile } from "@/utils/image-normalizer";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
  accept?: string;
  targetAspectRatio?: string; // e.g., '16/9', '4/3'
  useProcessingFunction?: boolean; // Use edge function for processing
  /** Minimum output width; smaller uploads are enlarged automatically. */
  minWidth?: number;
  /** Minimum output height; smaller uploads are enlarged automatically. */
  minHeight?: number;
  /** Reject portrait/near-square uploads (e.g. 1.33 = 4:3 minimum). */
  minAspectRatio?: number;
}

export const ImageUploadField = ({
  value,
  onChange,
  bucket = "project-images",
  label = "Upload Image",
  accept = "image/*",
  targetAspectRatio,
  useProcessingFunction = false,
  minWidth,
  minHeight,
  minAspectRatio,
}: ImageUploadFieldProps) => {
  const previousImage = useRef(value);
  const [oldPath, setOldPath] = useState<string | null>(null);
  useEffect(() => {
    if (previousImage.current && previousImage.current !== value)
      setOldPath(mediaPath(previousImage.current));
    previousImage.current = value;
  }, [value]);
  const [pickerOpen, setPickerOpen] = useState(false);
  useEffect(() => {
    setPreview(value || null);
  }, [value]);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [aspectRatioWarning, setAspectRatioWarning] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hard guard against absurdly large source files (browser memory).
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image is over 15MB. Please use a smaller source file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setAspectRatioWarning(null);
    setIsUploading(true);

    try {
      // Auto-normalize: center-crop to landscape, downscale, re-encode.
      // This replaces the old hard rejection for portrait / wrong-format images.
      let uploadFile = file;
      let normalizedNotice: string | null = null;
      let normalizedDimensions: { width: number; height: number } | undefined;

      const wantsLandscape = Boolean(minAspectRatio || targetAspectRatio);
      if (wantsLandscape || minWidth || minHeight) {
        try {
          const [ratioWidth, ratioHeight] =
            targetAspectRatio?.split("/").map(Number) ?? [];
          const requestedRatio =
            ratioWidth && ratioHeight ? ratioWidth / ratioHeight : undefined;
          const targetRatio = wantsLandscape
            ? Math.max(minAspectRatio || 0, requestedRatio || 0)
            : null;

          const result = await normalizeImageFile(file, {
            targetAspectRatio: targetRatio,
            maxWidth: 2400,
            minWidth,
            minHeight,
            forceExactRatio: Boolean(targetAspectRatio),
            format:
              wantsLandscape || !["image/png", "image/webp"].includes(file.type)
                ? "image/jpeg"
                : "image/webp",
            quality: 0.92,
          });
          uploadFile = result.file;
          normalizedDimensions = {
            width: result.outputWidth,
            height: result.outputHeight,
          };

          if (result.didCrop || result.didResize) {
            const changes = [
              result.didCrop ? "cropped" : "",
              result.didResize ? "resized" : "",
            ]
              .filter(Boolean)
              .join(" and ");
            normalizedNotice = `Image ${changes} to ${result.outputWidth}×${result.outputHeight}px${result.didPad ? " with padding" : ""}.`;
          }
        } catch (normErr) {
          console.warn("Image normalization failed:", normErr);
          toast.error(
            normErr instanceof Error
              ? normErr.message
              : "Could not process this image.",
          );
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
      }

      const dimensionError = await validateImageFile(uploadFile, {
        minWidth,
        minHeight,
        minAspectRatio,
      });
      if (dimensionError) {
        toast.error(dimensionError);
        return;
      }

      // Final size guard on the (potentially smaller) output file.
      if (uploadFile.size > 8 * 1024 * 1024) {
        toast.error(
          "Processed image is still over 8MB. Try a smaller source image.",
        );
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (targetAspectRatio && !normalizedNotice && normalizedDimensions) {
        const { width, height } = normalizedDimensions;
        if (!validateAspectRatio(width, height, targetAspectRatio, 0.15)) {
          normalizedNotice = `Image ratio is ${calculateAspectRatio(width, height)} — it will be cropped to fit ${targetAspectRatio} on display.`;
        }
      }

      if (normalizedNotice) setAspectRatioWarning(normalizedNotice);

      // Preview from the (possibly normalized) file we'll actually upload.
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(uploadFile);

      let url: string | undefined;
      let error: string | undefined;

      if (useProcessingFunction) {
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("bucket", bucket);
        formData.append("stripMetadata", "true");

        const { data, error: functionError } = await supabase.functions.invoke(
          "process-image",
          {
            body: formData,
          },
        );

        if (functionError) {
          error = functionError.message;
        } else {
          url = data.url;
        }
      } else {
        const result = await uploadImage(uploadFile, bucket);
        url = result.url;
        error = result.error;
      }

      if (error) {
        toast.error(`Upload failed: ${error}`);
        return;
      }

      onChange(url!);
      toast.success(
        "Image uploaded successfully" +
          (useProcessingFunction ? " (optimized)" : ""),
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* PHASE 2: Aspect ratio warning */}
      {aspectRatioWarning && (
        <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-sm text-warning">{aspectRatioWarning}</p>
        </div>
      )}

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WEBP — any orientation.{" "}
                {minWidth || minHeight
                  ? "Small images are resized automatically. "
                  : ""}
                {minAspectRatio || targetAspectRatio
                  ? "Portrait images are auto-cropped to fit."
                  : "Photos keep their original orientation."}
              </p>
            </>
          )}
        </div>
      )}

      {bucket === "project-images" && (
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => setPickerOpen(true)}
          >
            Choose from library
          </Button>
          <MediaPicker
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            onChoose={(asset) => {
              setPreview(asset.url);
              onChange(asset.url);
            }}
          />
        </>
      )}
      {oldPath && (
        <p className="text-sm text-muted-foreground">
          The previous image is retained. After saving,{" "}
          <a
            className="underline"
            href={`/admin/media?folder=${encodeURIComponent(oldPath.split("/").slice(0, -1).join("/"))}&search=${encodeURIComponent(oldPath.split("/").pop() || "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            review and delete the unused file in Media
          </a>
          .
        </p>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
    </div>
  );
};

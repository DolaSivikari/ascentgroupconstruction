import { useState, useRef } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/ui/Button';
import { uploadImage } from '@/utils/imageResolver';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { validateAspectRatio, calculateAspectRatio } from '@/utils/image-optimizer';
import { normalizeImageFile } from '@/utils/image-normalizer';

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
  accept?: string;
  targetAspectRatio?: string; // e.g., '16/9', '4/3'
  useProcessingFunction?: boolean; // Use edge function for processing
  /** Minimum acceptable width in pixels (rejects smaller). */
  minWidth?: number;
  /** Minimum acceptable height in pixels (rejects smaller). */
  minHeight?: number;
  /** Reject portrait/near-square uploads (e.g. 1.33 = 4:3 minimum). */
  minAspectRatio?: number;
}

export const ImageUploadField = ({
  value,
  onChange,
  bucket = 'project-images',
  label = 'Upload Image',
  accept = 'image/*',
  targetAspectRatio,
  useProcessingFunction = false,
  minWidth,
  minHeight,
  minAspectRatio,
}: ImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [aspectRatioWarning, setAspectRatioWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hard guard against absurdly large source files (browser memory).
    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image is over 15MB. Please use a smaller source file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setAspectRatioWarning(null);
    setIsUploading(true);

    try {
      // Auto-normalize: center-crop to landscape, downscale, re-encode.
      // This replaces the old hard rejection for portrait / wrong-format images.
      let uploadFile = file;
      let normalizedNotice: string | null = null;

      const wantsLandscape = Boolean(minAspectRatio || targetAspectRatio);
      if (wantsLandscape) {
        try {
          const targetRatio =
            minAspectRatio ??
            (targetAspectRatio
              ? (() => {
                  const [w, h] = targetAspectRatio.split('/').map(Number);
                  return w && h ? w / h : 16 / 9;
                })()
              : 16 / 9);

          const result = await normalizeImageFile(file, {
            targetAspectRatio: targetRatio,
            maxWidth: 2400,
            format: 'image/jpeg',
            quality: 0.88,
          });
          uploadFile = result.file;

          if (result.didCrop && result.didResize) {
            normalizedNotice = 'Image auto-cropped to landscape and optimized for the web.';
          } else if (result.didCrop) {
            normalizedNotice = 'Image auto-cropped to landscape for the featured slot.';
          } else if (result.didResize) {
            normalizedNotice = 'Image optimized for the web (downscaled).';
          }
        } catch (normErr) {
          console.warn('Image normalization failed, uploading original:', normErr);
          toast.error(
            normErr instanceof Error
              ? normErr.message
              : 'Could not process this image.'
          );
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }
      }

      // Final size guard on the (potentially smaller) output file.
      if (uploadFile.size > 8 * 1024 * 1024) {
        toast.error('Processed image is still over 8MB. Try a smaller source image.');
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Soft aspect-ratio note when targetAspectRatio is provided but normalization wasn't a perfect match.
      if (targetAspectRatio && !normalizedNotice) {
        const img = new Image();
        const objectUrl = URL.createObjectURL(uploadFile);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = objectUrl;
        });
        const isValid = validateAspectRatio(img.width, img.height, targetAspectRatio, 0.15);
        if (!isValid) {
          normalizedNotice =
            `Image ratio is ${calculateAspectRatio(img.width, img.height)} — it will be cropped to fit ${targetAspectRatio} on display.`;
        }
        URL.revokeObjectURL(objectUrl);
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
        formData.append('file', uploadFile);
        formData.append('bucket', bucket);
        formData.append('stripMetadata', 'true');

        const { data, error: functionError } = await supabase.functions.invoke('process-image', {
          body: formData,
        });

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
      toast.success('Image uploaded successfully' + (useProcessingFunction ? ' (optimized)' : ''));
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WEBP up to 5MB
              </p>
            </>
          )}
        </div>
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

import { useState, useRef } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/ui/Button';
import { uploadImage } from '@/utils/imageResolver';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { validateAspectRatio, calculateAspectRatio } from '@/utils/image-optimizer';

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
  accept?: string;
  targetAspectRatio?: string; // e.g., '16/9', '4/3'
  useProcessingFunction?: boolean; // Use edge function for processing
}

export const ImageUploadField = ({
  value,
  onChange,
  bucket = 'project-images',
  label = 'Upload Image',
  accept = 'image/*',
  targetAspectRatio,
  useProcessingFunction = false,
}: ImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [aspectRatioWarning, setAspectRatioWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setAspectRatioWarning(null);

    try {
      // PHASE 2: Validate aspect ratio if specified
      if (targetAspectRatio) {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = objectUrl;
        });

        const isValid = validateAspectRatio(img.width, img.height, targetAspectRatio);
        const actualRatio = calculateAspectRatio(img.width, img.height);
        
        if (!isValid) {
          setAspectRatioWarning(
            `Image aspect ratio is ${actualRatio} but ${targetAspectRatio} is recommended. ` +
            `Image may appear distorted or cropped.`
          );
        }

        URL.revokeObjectURL(objectUrl);
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // PHASE 2: Use processing edge function or direct upload
      let url: string;
      let error: string | undefined;

      if (useProcessingFunction) {
        // Use edge function for metadata stripping and optimization
        const formData = new FormData();
        formData.append('file', file);
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
        // Direct upload (legacy method)
        const result = await uploadImage(file, bucket);
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

import { supabase } from '@/integrations/supabase/client';

/**
 * Resolves image paths from multiple sources:
 * 1. Full URLs (already resolved)
 * 2. Supabase Storage URLs
 * 3. Local assets (src/assets/*)
 * 4. Public folder assets
 */
export const resolveImagePath = (path: string | null | undefined): string => {
  if (!path) return '/placeholder.svg';
  
  // Already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Absolute path to public folder
  if (path.startsWith('/')) {
    return path;
  }
  
  // Check if it's a Supabase storage path
  if (path.includes('storage/v1/object/public/')) {
    return path;
  }
  
  // Try to construct Supabase storage URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('project-images')
    .getPublicUrl(path);
  
  // If the URL seems valid (not a 404), return it
  if (publicUrl && !publicUrl.includes('placeholder')) {
    return publicUrl;
  }
  
  // Try local assets
  try {
    const assetPath = new URL(`/src/assets/${path}`, import.meta.url).href;
    return assetPath;
  } catch {
    // Asset doesn't exist locally
  }
  
  // Last resort: check public folder
  return `/images/${path}`;
};

/**
 * Upload image to Supabase Storage and return public URL
 */
export const uploadImage = async (
  file: File,
  bucket: string = 'project-images'
): Promise<{ url: string; error?: string }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { 
      url: '', 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
};

/**
 * Delete image from Supabase Storage
 */
export const deleteImage = async (
  path: string,
  bucket: string = 'project-images'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Delete failed' 
    };
  }
};

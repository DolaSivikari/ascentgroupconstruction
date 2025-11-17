import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Grid, List, Eye, Trash2, Star, Move } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectImage {
  id: string;
  url: string;
  category: 'before' | 'after' | 'process' | 'gallery';
  caption?: string;
  order: number;
  featured: boolean;
}

interface ProjectImageManagerProps {
  projectId: string;
  images: ProjectImage[];
  onImagesUpdate: (images: ProjectImage[]) => void;
}

export const ProjectImageManager: React.FC<ProjectImageManagerProps> = ({
  projectId,
  images,
  onImagesUpdate,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [previewImage, setPreviewImage] = useState<ProjectImage | null>(null);

  // Category configurations with colors and icons
  const categories = [
    { value: 'all', label: 'All Images', color: 'bg-gray-500', icon: '📷' },
    { value: 'before', label: 'Before', color: 'bg-blue-500', icon: '🔵' },
    { value: 'after', label: 'After', color: 'bg-green-500', icon: '🟢' },
    { value: 'process', label: 'Process', color: 'bg-yellow-500', icon: '🟡' },
    { value: 'gallery', label: 'Gallery', color: 'bg-purple-500', icon: '🟣' },
  ];

  // Filter images by category
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  // Get count for each category
  const getCategoryCount = (category: string) => {
    if (category === 'all') return images.length;
    return images.filter(img => img.category === category).length;
  };

  // Handle file drop
  const handleDrop = useCallback(async (e: React.DragEvent, category: string = 'gallery') => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    await uploadImages(files, category);
  }, []);

  // Handle file input
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const files = Array.from(e.target.files || []);
    await uploadImages(files, category);
  };

  // Upload images to Supabase
  const uploadImages = async (files: File[], category: string) => {
    const newImages: ProjectImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `${Date.now()}-${i}`;
      
      try {
        // Update progress
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}/${category}/${Date.now()}-${i}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('project-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);

        // Create image object
        newImages.push({
          id: fileId,
          url: publicUrl,
          category: category as any,
          order: images.length + i,
          featured: false,
        });

        // Update progress to complete
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload ${file.name}`);
      }
    }

    // Update parent component
    onImagesUpdate([...images, ...newImages]);
    
    // Clear progress after delay
    setTimeout(() => setUploadProgress({}), 2000);
  };

  // Delete image
  const handleDelete = async (imageId: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      // Extract filename from URL
      const fileName = imageUrl.split('/').slice(-3).join('/');
      
      // Delete from storage
      await supabase.storage
        .from('project-images')
        .remove([fileName]);

      // Update state
      onImagesUpdate(images.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  // Toggle featured status
  const handleToggleFeatured = (imageId: string) => {
    onImagesUpdate(
      images.map(img => ({
        ...img,
        featured: img.id === imageId ? !img.featured : img.featured
      }))
    );
  };

  // Update image caption
  const handleUpdateCaption = (imageId: string, caption: string) => {
    onImagesUpdate(
      images.map(img => img.id === imageId ? { ...img, caption } : img)
    );
  };

  // Move image to different category
  const handleMoveCategory = (imageId: string, newCategory: string) => {
    onImagesUpdate(
      images.map(img => 
        img.id === imageId ? { ...img, category: newCategory as any } : img
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">📸 Project Gallery Manager</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat.value
                  ? `${cat.color} text-[hsl(var(--bg))] shadow-lg scale-105`
                  : 'bg-background hover:bg-accent'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-sm ${
                selectedCategory === cat.value ? 'bg-[hsl(var(--bg))]/30' : 'bg-muted'
              }`}>
                {getCategoryCount(cat.value)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['before', 'after', 'process', 'gallery'].map(category => {
          const catConfig = categories.find(c => c.value === category);
          return (
            <div
              key={category}
              onDrop={(e) => handleDrop(e, category)}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                isDragging ? 'border-primary bg-primary/10 scale-105' : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileInput(e, category)}
                className="hidden"
                id={`upload-${category}`}
              />
              <label
                htmlFor={`upload-${category}`}
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className={`w-16 h-16 ${catConfig?.color} rounded-full flex items-center justify-center text-3xl`}>
                  {catConfig?.icon}
                </div>
                <div>
                  <p className="font-semibold">{catConfig?.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">Drop files or click</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getCategoryCount(category)} images
                  </p>
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="bg-primary/10 p-4 rounded-lg space-y-2">
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div key={id} className="flex items-center gap-3">
              <div className="flex-1 bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-primary">{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Images Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
          : 'space-y-3'
      }>
        {filteredImages.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No images in this category yet</p>
            <p className="text-sm">Upload images using the drop zones above</p>
          </div>
        ) : (
          filteredImages.map((image) => (
            <div
              key={image.id}
              className={`group relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all ${
                viewMode === 'list' ? 'flex items-center gap-4 p-3' : ''
              }`}
            >
              {/* Featured Star */}
              {image.featured && (
                <div className="absolute top-2 left-2 z-10 bg-yellow-400 p-1.5 rounded-full shadow-lg">
                  <Star className="w-4 h-4 fill-yellow-400" />
                </div>
              )}

              {/* Category Badge */}
              <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-medium ${
                categories.find(c => c.value === image.category)?.color
              } text-[hsl(var(--bg))]`}>
                {categories.find(c => c.value === image.category)?.label}
              </div>

              {/* Image */}
              <div className={viewMode === 'grid' ? 'aspect-square' : 'w-24 h-24'}>
                <img
                  src={image.url}
                  alt={image.caption || 'Project image'}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setPreviewImage(image)}
                />
              </div>

              {/* Actions Overlay */}
              <div className={`${
                viewMode === 'grid' 
                  ? 'absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100' 
                  : 'flex-1'
              } flex items-center justify-center gap-2 transition-opacity`}>
                <button
                  onClick={() => setPreviewImage(image)}
                  className="p-2 bg-background rounded-full hover:bg-accent transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4 text-primary" />
                </button>
                <button
                  onClick={() => handleToggleFeatured(image.id)}
                  className="p-2 bg-background rounded-full hover:bg-accent transition-colors"
                  title="Toggle Featured"
                >
                  <Star className={`w-4 h-4 ${image.featured ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                </button>
                <button
                  onClick={() => handleDelete(image.id, image.url)}
                  className="p-2 bg-background rounded-full hover:bg-destructive/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>

              {/* Caption Input (List View) */}
              {viewMode === 'list' && (
                <div className="flex-1">
                  <input
                    type="text"
                    value={image.caption || ''}
                    onChange={(e) => handleUpdateCaption(image.id, e.target.value)}
                    placeholder="Add caption..."
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  <select
                    value={image.category}
                    onChange={(e) => handleMoveCategory(image.id, e.target.value)}
                    className="mt-2 w-full px-3 py-1 text-sm border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring"
                  >
                    {categories.filter(c => c.value !== 'all').map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-6xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 bg-[hsl(var(--bg))] rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.caption || 'Preview'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {previewImage.caption && (
              <p className="mt-4 text-[hsl(var(--bg))] text-center text-lg">{previewImage.caption}</p>
            )}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {images.filter(img => img.category === 'before').length}
            </p>
            <p className="text-sm text-muted-foreground">Before Images</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {images.filter(img => img.category === 'after').length}
            </p>
            <p className="text-sm text-muted-foreground">After Images</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {images.filter(img => img.category === 'process').length}
            </p>
            <p className="text-sm text-muted-foreground">Process Images</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {images.filter(img => img.category === 'gallery').length}
            </p>
            <p className="text-sm text-muted-foreground">Gallery Images</p>
          </div>
        </div>
        
        {/* Pairing Check */}
        {images.filter(img => img.category === 'before').length !== 
         images.filter(img => img.category === 'after').length && (
          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-950/20 border border-yellow-300 dark:border-yellow-800 rounded-lg text-center">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Before/After images don't match! 
              <strong> {images.filter(img => img.category === 'before').length} before</strong> vs 
              <strong> {images.filter(img => img.category === 'after').length} after</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
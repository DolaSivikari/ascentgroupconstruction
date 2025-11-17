import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Download, Share2 } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface GalleryImage {
  id: string;
  url: string;
  category: 'before' | 'after' | 'process' | 'gallery';
  caption?: string;
  order: number;
  featured: boolean;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
  projectTitle: string;
  showBeforeAfter?: boolean;
  showProcessSteps?: boolean;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  images,
  projectTitle,
  showBeforeAfter = true,
  showProcessSteps = true,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'all' | 'before-after' | 'process'>('all');
  const prefersReducedMotion = useReducedMotion();

  // Separate images by category
  const beforeImages = images.filter(img => img.category === 'before').sort((a, b) => a.order - b.order);
  const afterImages = images.filter(img => img.category === 'after').sort((a, b) => a.order - b.order);
  const processImages = images.filter(img => img.category === 'process').sort((a, b) => a.order - b.order);
  const galleryImages = images.filter(img => img.category === 'gallery').sort((a, b) => a.order - b.order);

  // Combine for display based on selected tab
  const displayImages = selectedTab === 'all' 
    ? [...galleryImages, ...processImages]
    : selectedTab === 'before-after'
    ? [...beforeImages, ...afterImages]
    : processImages;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'Escape') setLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, currentImageIndex]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          Project Gallery
        </h2>
        <p className="text-xl text-muted-foreground">
          Explore the transformation of {projectTitle}
        </p>
      </div>

      {/* Gallery Navigation Tabs */}
      <div className="flex justify-center mb-8 flex-wrap gap-3">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            selectedTab === 'all'
              ? 'bg-primary text-primary-foreground shadow-lg scale-105'
              : 'bg-card hover:bg-accent shadow'
          }`}
        >
          📷 All Images ({galleryImages.length + processImages.length})
        </button>
        {beforeImages.length > 0 && afterImages.length > 0 && showBeforeAfter && (
          <button
            onClick={() => setSelectedTab('before-after')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedTab === 'before-after'
                ? 'bg-green-600 text-[hsl(var(--bg))] shadow-lg scale-105'
                : 'bg-card hover:bg-accent shadow'
            }`}
          >
            ⚡ Before & After ({beforeImages.length + afterImages.length})
          </button>
        )}
        {processImages.length > 0 && showProcessSteps && (
          <button
            onClick={() => setSelectedTab('process')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedTab === 'process'
                ? 'bg-yellow-600 text-[hsl(var(--bg))] shadow-lg scale-105'
                : 'bg-card hover:bg-accent shadow'
            }`}
          >
            🔨 Process Steps ({processImages.length})
          </button>
        )}
      </div>

      {/* Before/After Comparison using BeforeAfterSlider */}
      {selectedTab === 'before-after' && beforeImages.length > 0 && afterImages.length > 0 && (
        <div className="mb-12 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold text-center mb-6">
            Interactive Before & After Comparison
          </h3>
          <div className="max-w-4xl mx-auto space-y-8">
            {beforeImages.map((beforeImg, idx) => {
              const afterImg = afterImages[idx];
              if (!afterImg) return null;

              return (
                <div key={beforeImg.id}>
                  <BeforeAfterSlider
                    beforeImage={beforeImg.url}
                    afterImage={afterImg.url}
                    altBefore={beforeImg.caption || 'Before'}
                    altAfter={afterImg.caption || 'After'}
                  />
                  {/* Captions */}
                  {(beforeImg.caption || afterImg.caption) && (
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                      {beforeImg.caption && (
                        <p className="text-muted-foreground italic">{beforeImg.caption}</p>
                      )}
                      {afterImg.caption && (
                        <p className="text-muted-foreground italic">{afterImg.caption}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayImages.map((image, index) => (
          <div
            key={image.id}
            className={`group relative aspect-square bg-muted rounded-xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer ${!prefersReducedMotion && 'hover-scale'}`}
            style={{ transition: prefersReducedMotion ? 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'var(--card-transition), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.url}
              alt={image.caption || `Gallery image ${index + 1}`}
              className={`w-full h-full object-cover ${!prefersReducedMotion && 'group-hover:scale-110'}`}
              style={{ transition: prefersReducedMotion ? 'none' : 'var(--transition-transform)' }}
              loading="lazy"
            />
            
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-[hsl(var(--ink))]/0 group-hover:bg-[hsl(var(--ink))]/40 flex items-center justify-center"
              style={{ transition: 'var(--transition-base)' }}
            >
              <ZoomIn 
                className="text-[hsl(var(--bg))] opacity-0 group-hover:opacity-100 w-12 h-12 fade-transition" 
              />
            </div>

            {/* Caption */}
            {image.caption && (
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[hsl(var(--ink))]/80 to-transparent p-4 translate-y-full group-hover:translate-y-0"
                style={{ transition: 'var(--transition-transform)' }}
              >
                <p className="text-[hsl(var(--bg))] text-sm font-medium">{image.caption}</p>
              </div>
            )}

            {/* Category Badge */}
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
              image.category === 'before' ? 'bg-blue-600 text-[hsl(var(--bg))]' :
              image.category === 'after' ? 'bg-green-600 text-[hsl(var(--bg))]' :
              image.category === 'process' ? 'bg-yellow-600 text-[hsl(var(--bg))]' :
              'bg-purple-600 text-[hsl(var(--bg))]'
            }`}>
              {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayImages.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-xl">No images available in this category</p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-[hsl(var(--ink))]/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-3 bg-[hsl(var(--bg))]/10 hover:bg-[hsl(var(--bg))]/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6 text-[hsl(var(--bg))]" />
          </button>

          {/* Previous Button */}
          <button
            onClick={handlePrevImage}
            className="absolute left-4 p-3 bg-[hsl(var(--bg))]/10 hover:bg-[hsl(var(--bg))]/20 rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8 text-[hsl(var(--bg))]" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNextImage}
            className="absolute right-4 p-3 bg-[hsl(var(--bg))]/10 hover:bg-[hsl(var(--bg))]/20 rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8 text-[hsl(var(--bg))]" />
          </button>

          {/* Image */}
          <div className="max-w-7xl max-h-[85vh] px-4">
            <img
              src={displayImages[currentImageIndex]?.url}
              alt={displayImages[currentImageIndex]?.caption || 'Gallery image'}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            
            {/* Image Info */}
            {displayImages[currentImageIndex]?.caption && (
              <p className="text-[hsl(var(--bg))] text-center text-lg mt-6 font-medium">
                {displayImages[currentImageIndex]?.caption}
              </p>
            )}
            
            <p className="text-[hsl(var(--bg))]/60 text-center mt-2">
              {currentImageIndex + 1} / {displayImages.length}
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
            <button
              onClick={() => window.open(displayImages[currentImageIndex]?.url, '_blank')}
              className="p-2 bg-[hsl(var(--bg))]/10 hover:bg-[hsl(var(--bg))]/20 rounded-full transition-colors"
            >
              <ZoomIn className="w-5 h-5 text-[hsl(var(--bg))]" />
            </button>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = displayImages[currentImageIndex]?.url;
                link.download = `${projectTitle}-${currentImageIndex + 1}.jpg`;
                link.click();
              }}
              className="p-2 bg-[hsl(var(--bg))]/10 hover:bg-[hsl(var(--bg))]/20 rounded-full transition-colors"
            >
              <Download className="w-5 h-5 text-[hsl(var(--bg))]" />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: projectTitle,
                    text: displayImages[currentImageIndex]?.caption || 'Check out this project!',
                    url: window.location.href
                  });
                }
              }}
              className="p-2 bg-[hsl(var(--bg))]/10 hover:bg-[hsl(var(--bg))]/20 rounded-full transition-colors"
            >
              <Share2 className="w-5 h-5 text-[hsl(var(--bg))]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
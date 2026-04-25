import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { GRID } from "@/design-system/layouts";
import { InteractiveLightbox } from '@/components/InteractiveLightbox';

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

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Map gallery images to lightbox-compatible shape
  const lightboxImages = displayImages.map((img, idx) => ({
    src: img.url,
    alt: img.caption || `${projectTitle} — Gallery image ${idx + 1}`,
    caption: img.caption,
  }));

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
        <div className="mb-12 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]">
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
      <div className={GRID.cards3}>
        {displayImages.map((image, index) => (
          <div
            key={image.id}
            className={`group relative aspect-square bg-muted rounded-[var(--radius-lg)] overflow-hidden shadow-lg hover:shadow-[var(--shadow-lg)] cursor-pointer ${!prefersReducedMotion && 'hover-scale'}`}
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
              image.category === 'before' ? 'bg-primary text-primary-foreground' :
              image.category === 'after' ? 'bg-[hsl(var(--steel-blue))] text-white' :
              image.category === 'process' ? 'bg-accent text-accent-foreground' :
              'bg-secondary text-secondary-foreground'
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

      {/* Lightbox — uses shared InteractiveLightbox (yet-another-react-lightbox) */}
      <InteractiveLightbox
        images={lightboxImages}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={currentImageIndex}
      />
    </div>
  );
};

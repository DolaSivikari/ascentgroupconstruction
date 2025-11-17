import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/plugins/counter.css';

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface InteractiveLightboxProps {
  images: LightboxImage[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const InteractiveLightbox = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}: InteractiveLightboxProps) => {
  const slides = images.map((img) => ({
    src: img.src,
    alt: img.alt,
    title: img.caption,
  }));

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={slides}
      index={initialIndex}
      plugins={[Zoom, Counter]}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
      counter={{
        container: { style: { top: 'unset', bottom: 0 } },
      }}
      animation={{ fade: 300 }}
      controller={{
        closeOnBackdropClick: true,
      }}
      styles={{
        container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
      }}
    />
  );
};

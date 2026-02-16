import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Pause } from "lucide-react";
import { Button } from "@/ui/Button";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useVideoPreloader } from "@/hooks/useVideoPreloader";
import { enrichedHeroSlides } from "@/data/enriched-hero-slides";

const heroSlides = enrichedHeroSlides;

const EnhancedHero = ({ splashComplete = true }: { splashComplete?: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const heroReadyRef = useRef(false);

  const activeSlides = heroSlides;

  const videoUrls = activeSlides.map(slide => slide.video);
  const { getVideoUrl } = useVideoPreloader({
    videoUrls,
    currentIndex: currentSlide,
    prefetchCount: 2
  });

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    setAnimationsEnabled(true);
  }, []);

  useEffect(() => {
    const markHeroReady = () => {
      if (!heroReadyRef.current) {
        heroReadyRef.current = true;
        setIsPageLoaded(true);
        window.dispatchEvent(new CustomEvent('hero-ready'));
      }
    };
    markHeroReady();
    const fallback = setTimeout(markHeroReady, 300);
    return () => clearTimeout(fallback);
  }, []);

  const handleVideoReady = () => {
    setIsVideoLoaded(true);
    if (!heroReadyRef.current) {
      heroReadyRef.current = true;
      setIsPageLoaded(true);
      window.dispatchEvent(new CustomEvent('hero-ready'));
    }
  };

  const minSwipeDistance = 50;

  useEffect(() => {
    if (!isPlaying || activeSlides.length === 0 || !splashComplete) return;
    const initialDelay = setTimeout(() => {
      autoplayIntervalRef.current = setInterval(() => {
        setIsFadingOut(true);
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
          setIsFadingOut(false);
        }, 600);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1200);
      }, 7000);
    }, 2000);
    return () => {
      clearTimeout(initialDelay);
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [isPlaying, activeSlides.length, currentSlide, splashComplete]);

  const handleSlideChange = (index: number) => {
    if (index === currentSlide) return;
    setIsPlaying(false);
    setIsFadingOut(true);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsFadingOut(false);
    }, 600);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.readyState >= 3) {
      setIsVideoLoaded(true);
      v.play().catch(() => {});
      return;
    }
    setIsVideoLoaded(false);
    const markReady = () => {
      setIsVideoLoaded(true);
      v.play().catch(() => {});
    };
    v.addEventListener('loadedmetadata', markReady);
    v.addEventListener('loadeddata', markReady);
    return () => {
      v.removeEventListener('loadedmetadata', markReady);
      v.removeEventListener('loadeddata', markReady);
    };
  }, [currentSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]?.clientX ?? 0);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]?.clientX ?? 0);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setIsFadingOut(true);
      setIsTransitioning(true);
      setTimeout(() => { setCurrentSlide((prev) => (prev + 1) % activeSlides.length); setIsFadingOut(false); }, 600);
      setTimeout(() => { setIsTransitioning(false); }, 1200);
    }
    if (distance < -minSwipeDistance) {
      setIsFadingOut(true);
      setIsTransitioning(true);
      setTimeout(() => { setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length); setIsFadingOut(false); }, 600);
      setTimeout(() => { setIsTransitioning(false); }, 1200);
    }
  };

  useEffect(() => {
    if (currentSlide >= activeSlides.length && activeSlides.length > 0) setCurrentSlide(0);
  }, [currentSlide, activeSlides.length]);

  const slide = activeSlides[currentSlide];
  const prefersReducedMotion = useReducedMotion();

  if (!slide) return null;

  const headline = slide.headline;
  const subheadline = slide.subheadline;
  const videoUrl = getVideoUrl(slide.video);
  const videoUrlMobile = slide.video.replace('.mp4', '-mobile.mp4');
  const posterUrl = slide.poster;
  const primaryCTA = slide.primaryCTA;

  return (
    <section 
      className="relative min-h-[90vh] md:min-h-screen flex items-end overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Background */}
      <div 
        className="absolute inset-0 w-full h-full transition-opacity duration-[600ms] ease-in-out"
        style={{ opacity: isFadingOut ? 0 : 1 }}
      >
        <video
          ref={videoRef}
          width={1920}
          height={1080}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={posterUrl}
          onLoadedData={handleVideoReady}
          onCanPlay={handleVideoReady}
          onError={() => setIsVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {isMobile && <source src={videoUrlMobile} type="video/mp4" />}
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Gradient Overlay - stronger on left for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Content - Left-aligned, editorial layout */}
      <div 
        className="relative z-10 container mx-auto px-6 md:px-8 pb-20 md:pb-28 pt-32"
        style={{ 
          opacity: isFadingOut ? 0 : 1,
          transform: isFadingOut ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 600ms ease-in-out, transform 600ms ease-in-out'
        }}
      >
        <div className="max-w-3xl">
          {/* Main Headline - Left-aligned, editorial */}
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight text-white ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
          >
            {headline}
          </h1>
          
          <p 
            className={`text-lg md:text-xl text-white/85 mb-10 max-w-2xl leading-relaxed ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
          >
            {subheadline}
          </p>

          {/* Single primary CTA + text link */}
          <div className={`flex items-center gap-6 mb-12 ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}>
            <Button asChild size="lg" variant="primary" className="group shadow-lg">
              <Link to={primaryCTA.href} className="gap-2">
                <span>{primaryCTA.label}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
            
            <Link 
              to="/projects" 
              className="text-white/80 hover:text-white text-sm font-medium tracking-wide uppercase transition-colors duration-200 border-b border-white/30 hover:border-white/60 pb-0.5"
            >
              View Our Work
            </Link>
          </div>

          {/* Slide Indicators - left-aligned, minimal */}
          {activeSlides.length > 1 && (
            <div className={`flex gap-2 ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}>
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-10 bg-white' 
                      : 'w-5 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Play/Pause - subtle, bottom right */}
      <button
        onClick={togglePlayPause}
        className="absolute bottom-8 right-8 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200"
        aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-white/80" />
        ) : (
          <Play className="h-4 w-4 text-white/80" />
        )}
      </button>
    </section>
  );
};

export default EnhancedHero;

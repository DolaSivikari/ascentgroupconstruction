import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Building2, Award, Shield, Cpu, Leaf, Users, Play, Pause, Wrench, Target, Briefcase, Mail, Info, Ruler, ClipboardCheck, Hammer, Droplets, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/ui/Button";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useVideoPreloader } from "@/hooks/useVideoPreloader";
import { useCountUp } from "@/hooks/useCountUp";
import { supabase } from "@/integrations/supabase/client";
import { enrichedHeroSlides } from "@/data/enriched-hero-slides";

// Helper to map icon names to Lucide icons
const getIconComponent = (iconName?: string) => {
  const iconMap: Record<string, any> = {
    FileText, Building2, Award, Shield, Cpu, Leaf, Users, Ruler,
    ClipboardCheck, Hammer, Droplets, Wrench, Target, Briefcase, Mail, Info
  };
  return iconMap[iconName || 'Building2'] || Building2;
};


// Use enriched hero slides with expanded SEO-optimized descriptions
const heroSlides = enrichedHeroSlides.map(slide => ({
  ...slide,
  primaryCTA: { ...slide.primaryCTA, icon: Building2 }, // Default icon
}));

interface HeroSlide {
  id: string;
  headline: string;
  subheadline: string;
  description?: string;
  stat_number?: string;
  stat_label?: string;
  primary_cta_text: string;
  primary_cta_url: string;
  primary_cta_icon?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
  video_url?: string;
  poster_url?: string;
}

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

  // Use enriched hero slides only
  const activeSlides = heroSlides;

  // Extract video URLs and set up preloading
  const videoUrls = activeSlides.map(slide => slide.video);
  const { getVideoUrl, isPreloaded } = useVideoPreloader({
    videoUrls,
    currentIndex: currentSlide,
    prefetchCount: 2 // Preload current + 2 ahead + 1 behind
  });

  // Helper to detect mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Enable animations immediately
  useEffect(() => {
    setAnimationsEnabled(true);
  }, []);

  // Enable animations after hero is ready (poster or video loaded)
  useEffect(() => {
    const markHeroReady = () => {
      if (!heroReadyRef.current) {
        heroReadyRef.current = true;
        setIsPageLoaded(true);
        window.dispatchEvent(new CustomEvent('hero-ready'));
      }
    };

    // Fallback timer in case assets are slow
    const fallback = setTimeout(markHeroReady, 800);
    
    return () => clearTimeout(fallback);
  }, []);

  // Preload poster images for current and adjacent slides
  useEffect(() => {
    // Mark hero as ready on mount
    if (!heroReadyRef.current) {
      heroReadyRef.current = true;
      setIsPageLoaded(true);
      window.dispatchEvent(new CustomEvent('hero-ready'));
    }
  }, []);

  const handleVideoReady = () => {
    setIsVideoLoaded(true);
    // Mark hero as ready when first video loads
    if (!heroReadyRef.current) {
      heroReadyRef.current = true;
      setIsPageLoaded(true);
      window.dispatchEvent(new CustomEvent('hero-ready'));
    }
  };

  // Minimum swipe distance (in px) to trigger slide change
  const minSwipeDistance = 50;

  useEffect(() => {
    if (!isPlaying || activeSlides.length === 0 || !splashComplete) return;

    // Add a 2 second delay after splash completes before starting auto-rotation
    const initialDelay = setTimeout(() => {
      autoplayIntervalRef.current = setInterval(() => {
        setIsFadingOut(true);
        setIsTransitioning(true);
        
        // Fade out (500ms) -> Change content (instant) -> Fade in (500ms)
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
          setIsFadingOut(false);
        }, 500);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000);
      }, 7000);
    }, 2000);

    return () => {
      clearTimeout(initialDelay);
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [isPlaying, activeSlides.length, currentSlide, splashComplete]);

  const handleSlideChange = (index: number) => {
    if (index === currentSlide) return; // Don't transition to the same slide
    
    setIsPlaying(false); // Pause autoplay when user interacts
    setIsFadingOut(true);
    setIsTransitioning(true);
    
    // Fade out (500ms) -> Change content (instant) -> Fade in (500ms)
    setTimeout(() => {
      setCurrentSlide(index);
      setIsFadingOut(false);
    }, 500);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset video loaded state when slide changes
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // If video is already ready to play, show it immediately
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
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - go to next slide
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        setIsTransitioning(false);
      }, 500);
    }

    if (isRightSwipe) {
      // Swipe right - go to previous slide
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
        setIsTransitioning(false);
      }, 500);
    }
  };

  // Reset to slide 0 if currentSlide is out of bounds
  useEffect(() => {
    if (currentSlide >= activeSlides.length && activeSlides.length > 0) {
      setCurrentSlide(0);
    }
  }, [currentSlide, activeSlides.length]);

  const slide = activeSlides[currentSlide];
  const prefersReducedMotion = useReducedMotion();

  // Guard against undefined slide
  if (!slide) return null;

  // Extract slide data from enriched slides
  const headline = slide.headline;
  const subheadline = slide.subheadline;
  const statNumber = slide.stat;
  const statLabel = slide.statLabel;
  const videoUrl = getVideoUrl(slide.video); // Use preloaded URL
  const videoUrlMobile = slide.video.replace('.mp4', '-mobile.mp4');
  const posterUrl = slide.poster;
  const PrimaryIcon = slide.primaryCTA.icon;
  const primaryCTA = slide.primaryCTA;
  const secondaryCTA = slide.secondaryCTA;

  return (
    <section 
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-24"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Video Background */}
      <div 
        className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
        style={{ 
          opacity: isFadingOut ? 0.4 : 1,
          aspectRatio: '16/9'
        }}
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
          onError={(e) => {
            console.error('Hero video failed to load', { src: videoUrl, error: e });
            setIsVideoLoaded(true);
          }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* Mobile-optimized source for faster loading on mobile devices */}
          {isMobile && <source src={videoUrlMobile} type="video/mp4" />}
          {/* Desktop/fallback source */}
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Content */}
        <div 
          className={`relative z-10 container mx-auto px-4 py-16 md:py-20 ${isPageLoaded ? 'transition-transform duration-500 ease-out' : ''}`}
          style={{ transform: isFadingOut ? 'translateY(4px)' : 'translateY(0)' }}
        >
        <div className="max-w-5xl mx-auto">
          {/* Floating Stat Mini-Cards with Glassmorphism */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
            {/* Main Stat Card */}
            <div 
              className={`group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-4 shadow-2xl hover:shadow-accent/20 hover:scale-105 transition-all duration-300 ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-accent" />
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
                    {statNumber}
                  </div>
                  <div className="text-xs text-white/80 font-medium whitespace-nowrap">{statLabel}</div>
                </div>
              </div>
            </div>

            {/* COR Certified Badge */}
            <div 
              className={`group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-4 shadow-2xl hover:shadow-green-500/20 hover:scale-105 transition-all duration-300 ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Shield className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-sm font-bold text-white">COR Certified</span>
              </div>
            </div>

            {/* Zero Incidents Badge */}
            <div 
              className={`group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-4 shadow-2xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-sm font-bold text-white whitespace-nowrap">Zero Incidents</span>
              </div>
            </div>
          </div>

          {/* Main Headline with Gradient Text */}
          <h1 
            className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
            style={{ 
              textShadow: '0 4px 30px rgba(0,0,0,0.5)'
            }}
          >
            <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              {headline.split(' ').map((word, i) => {
                // Apply gradient to numbers and key words
                const isNumber = /\d/.test(word) || word.includes('$') || word.includes('%');
                const isKeyWord = ['Zero', 'Prime', 'Emergency', 'Certified'].includes(word);
                
                if (isNumber || isKeyWord) {
                  return (
                    <span 
                      key={i} 
                      className="bg-gradient-to-r from-accent via-accent/90 to-accent/70 bg-clip-text text-transparent font-black"
                    >
                      {word}{' '}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </span>
          </h1>
          <p 
            className={`text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-10 max-w-3xl leading-relaxed font-medium ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
            style={{ 
              textShadow: '0 2px 15px rgba(0,0,0,0.4)'
            }}
          >
            {subheadline}
          </p>

          {/* Enhanced CTAs with Staggered Animation */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 mb-12 ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
          >
            <Button asChild size="lg" variant="primary" className="group relative overflow-hidden shadow-2xl shadow-accent/50 hover:shadow-accent/70 transition-all duration-300">
              <Link to={primaryCTA.href} className="gap-2">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <primaryCTA.icon className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{primaryCTA.label}</span>
                <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="group relative overflow-hidden bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white backdrop-blur-xl shadow-xl transition-all duration-300">
              <Link to={secondaryCTA.href}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">{secondaryCTA.label}</span>
              </Link>
            </Button>
          </div>

          {/* Slide Indicators */}
          <div className={`flex gap-2 justify-center md:justify-start ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}>
            {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-12 bg-accent' 
                      : 'w-6 bg-white/50 hover:bg-white/70'
                  }`}
                />
            ))}
          </div>
        </div>
      </div>

      {/* Play/Pause Control */}
      <button
        onClick={togglePlayPause}
        className="absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full bg-[hsl(var(--bg))]/10 hover:bg-[hsl(var(--bg))]/20 backdrop-blur-md border border-[hsl(var(--bg))]/30 flex items-center justify-center transition-all duration-300 group"
        aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-[hsl(var(--bg))] group-hover:scale-110 transition-transform" />
        ) : (
          <Play className="h-5 w-5 text-[hsl(var(--bg))] group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Scroll Indicator */}
      {!prefersReducedMotion && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[hsl(var(--bg))]/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-[hsl(var(--bg))]/60 rounded-full animate-slide-up" />
          </div>
        </div>
      )}
    </section>
  );
};

export default EnhancedHero;

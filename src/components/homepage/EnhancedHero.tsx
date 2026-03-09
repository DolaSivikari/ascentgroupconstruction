import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Shield, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/ui/Button";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useVideoPreloader } from "@/hooks/useVideoPreloader";
import { enrichedHeroSlides } from "@/data/enriched-hero-slides";
import { fetchHeroSlides, type HeroSlide as AdminHeroSlide } from "@/hooks/useHomepageData";

const fallbackHeroSlides = enrichedHeroSlides.map((slide, index) => ({
  id: `fallback-${index}`,
  headline: slide.headline,
  subheadline: slide.subheadline,
  stat: slide.stat,
  statLabel: slide.statLabel,
  video: slide.video,
  poster: slide.poster,
  primaryCTA: {
    ...slide.primaryCTA,
    icon: Building2,
  },
  secondaryCTA: slide.secondaryCTA,
}));

const mapAdminSlideToHero = (slide: AdminHeroSlide, fallbackMedia: (typeof fallbackHeroSlides)[number], index: number) => ({
  id: slide.id || `admin-${index}`,
  headline: slide.headline?.trim() || fallbackMedia.headline,
  subheadline: slide.subheadline?.trim() || fallbackMedia.subheadline,
  stat: slide.stat_number?.trim() || fallbackMedia.stat,
  statLabel: slide.stat_label?.trim() || fallbackMedia.statLabel,
  video: slide.video_url?.trim() || fallbackMedia.video,
  poster: slide.poster_url?.trim() || fallbackMedia.poster,
  primaryCTA: {
    label: slide.primary_cta_text?.trim() || fallbackMedia.primaryCTA.label,
    href: slide.primary_cta_url?.trim() || fallbackMedia.primaryCTA.href,
    icon: Building2,
  },
  secondaryCTA: {
    label: slide.secondary_cta_text?.trim() || fallbackMedia.secondaryCTA.label,
    href: slide.secondary_cta_url?.trim() || fallbackMedia.secondaryCTA.href,
  },
});

/* ── Stat counter helper ── */
function parseStatParts(stat: string): { num: number; suffix: string } | null {
  const match = stat.match(/^(\d+(?:\.\d+)?)(.*)/);
  if (!match) return null;
  return { num: parseFloat(match[1]), suffix: match[2] };
}

function useStatCounter(stat: string, trigger: number) {
  const [display, setDisplay] = useState(stat);
  const rafRef = useRef(0);

  useEffect(() => {
    const parts = parseStatParts(stat);
    if (!parts) {
      setDisplay(stat);
      return;
    }
    const { num, suffix } = parts;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * num;
      setDisplay(`${num % 1 !== 0 ? current.toFixed(1) : Math.round(current)}${suffix}`);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stat, trigger]);

  return display;
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
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const heroReadyRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax refs (no state to avoid re-renders)
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const parallaxRaf = useRef(0);

  // Progress bar animation key — increments on each slide change to restart CSS animation
  const [progressKey, setProgressKey] = useState(0);

  const { data: adminHeroSlides = [] } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: fetchHeroSlides,
    staleTime: 10 * 60 * 1000,
  });

  const hasUsableAdminSlides = adminHeroSlides.length > 0;
  const activeSlides = hasUsableAdminSlides
    ? adminHeroSlides.map((slide, index) => mapAdminSlideToHero(slide, fallbackHeroSlides[index % fallbackHeroSlides.length], index))
    : fallbackHeroSlides;

  const videoUrls = activeSlides.map(slide => slide.video);
  const { getVideoUrl, isPreloaded } = useVideoPreloader({
    videoUrls,
    currentIndex: currentSlide,
    prefetchCount: 2
  });

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const prefersReducedMotion = useReducedMotion();

  // Enable animations immediately
  useEffect(() => {
    setAnimationsEnabled(true);
  }, []);

  // Mark hero as ready immediately on mount
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

  // ── Autoplay ──
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

  // Reset progress bar key on slide change
  useEffect(() => {
    setProgressKey((k) => k + 1);
  }, [currentSlide]);

  const doSlideChange = useCallback((index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setIsFadingOut(true);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsFadingOut(false);
    }, 600);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  }, [currentSlide, isTransitioning]);

  const handleSlideChange = (index: number) => {
    if (index === currentSlide) return;
    setIsPlaying(false);
    doSlideChange(index);
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  // ── Video loading ──
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

  // ── Touch swipe ──
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
      doSlideChange((currentSlide + 1) % activeSlides.length);
    } else if (distance < -minSwipeDistance) {
      doSlideChange((currentSlide - 1 + activeSlides.length) % activeSlides.length);
    }
  };

  // ── Keyboard navigation ──
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      doSlideChange((currentSlide + 1) % activeSlides.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      doSlideChange((currentSlide - 1 + activeSlides.length) % activeSlides.length);
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying((p) => !p);
    }
  }, [currentSlide, activeSlides.length, doSlideChange]);

  // ── Swipe hint (mobile, once per session) ──
  useEffect(() => {
    if (!isMobile) return;
    const key = 'hero-swipe-hint-shown';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    setShowSwipeHint(true);
    const t = setTimeout(() => setShowSwipeHint(false), 3000);
    return () => clearTimeout(t);
  }, [isMobile]);

  // ── Parallax mouse tracking (pointer: fine only) ──
  useEffect(() => {
    if (prefersReducedMotion) return;
    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;

    const section = sectionRef.current;
    if (!section) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      // Normalize to -1...1
      mouseTarget.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      };
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      mouseCurrent.current.x = lerp(mouseCurrent.current.x, mouseTarget.current.x, 0.08);
      mouseCurrent.current.y = lerp(mouseCurrent.current.y, mouseTarget.current.y, 0.08);

      const vx = -mouseCurrent.current.x * 8;
      const vy = -mouseCurrent.current.y * 8;
      const tx = mouseCurrent.current.x * 4;
      const ty = mouseCurrent.current.y * 4;

      if (videoLayerRef.current) {
        videoLayerRef.current.style.transform = `translate(${vx}px, ${vy}px)`;
      }
      if (textLayerRef.current) {
        textLayerRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
      }
      parallaxRaf.current = requestAnimationFrame(tick);
    };

    section.addEventListener('mousemove', onMouseMove);
    parallaxRaf.current = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(parallaxRaf.current);
      // Reset transforms
      if (videoLayerRef.current) videoLayerRef.current.style.transform = '';
      if (textLayerRef.current) textLayerRef.current.style.transform = '';
    };
  }, [prefersReducedMotion]);

  // Bounds check
  useEffect(() => {
    if (currentSlide >= activeSlides.length && activeSlides.length > 0) {
      setCurrentSlide(0);
    }
  }, [currentSlide, activeSlides.length]);

  const slide = activeSlides[currentSlide];
  if (!slide) return null;

  const headline = slide.headline;
  const subheadline = slide.subheadline;
  const videoUrl = getVideoUrl(slide.video);
  const videoUrlMobile = slide.video.replace('.mp4', '-mobile.mp4');
  const posterUrl = slide.poster;
  const primaryCTA = slide.primaryCTA;
  const secondaryCTA = slide.secondaryCTA;

  const staggerStyle = (delayMs: number) =>
    animationsEnabled && !prefersReducedMotion
      ? { animationDelay: `${delayMs}ms`, animationFillMode: 'both' as const }
      : {};

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-24"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
    >

      {/* Video Background — parallax layer */}
      <div
        ref={videoLayerRef}
        className="absolute inset-[-16px] w-[calc(100%+32px)] h-[calc(100%+32px)] transition-opacity duration-[600ms] ease-in-out will-change-transform"
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
          onError={(e) => {
            console.error('Hero video failed to load', { src: videoUrl, error: e });
            setIsVideoLoaded(true);
          }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {isMobile && <source src={videoUrlMobile} type="video/mp4" />}
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Content — parallax layer */}
      <div
        ref={textLayerRef}
        className="relative z-10 container mx-auto px-4 py-16 md:py-20 will-change-transform"
        style={{
          opacity: isFadingOut ? 0 : 1,
          transition: 'opacity 600ms ease-in-out',
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Trust Badge */}
          <div
            className={`inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 mb-10 ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
            style={staggerStyle(0)}
          >
            <Shield className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-white/90">Building Envelope & Restoration Specialists</span>
          </div>

          {/* Stat Counter Badge */}
          {slide.stat && slide.statLabel && (
            <StatBadge stat={slide.stat} statLabel={slide.statLabel} trigger={currentSlide} animationsEnabled={animationsEnabled} prefersReducedMotion={prefersReducedMotion} staggerStyle={staggerStyle} />
          )}

          {/* Headline */}
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-white ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
            style={{
              textShadow: '0 4px 40px rgba(0,0,0,0.6)',
              ...staggerStyle(50),
            }}
          >
            {headline}
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg md:text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl leading-relaxed ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
            style={{
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              ...staggerStyle(100),
            }}
          >
            {subheadline}
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 mb-16 ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
            style={staggerStyle(150)}
          >
            <Button asChild size="lg" variant="primary" className="group shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to={primaryCTA.href} className="gap-2">
                <span>{primaryCTA.label}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>

            {secondaryCTA && (
              <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white backdrop-blur-sm transition-all duration-300">
                <Link to={secondaryCTA.href}>
                  {secondaryCTA.label}
                </Link>
              </Button>
            )}
          </div>

          {/* ── Progress Bar Indicators ── */}
          <div className={`flex gap-2 justify-center md:justify-start ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}>
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 bg-white/20 hover:bg-white/30"
                style={{ width: index === currentSlide ? 48 : 24 }}
              >
                {index === currentSlide && (
                  <span
                    key={progressKey}
                    className="absolute inset-0 rounded-full bg-accent origin-left"
                    style={{
                      animation: `hero-progress-fill 7s linear forwards`,
                      animationPlayState: isPlaying && splashComplete ? 'running' : 'paused',
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Swipe Hint — mobile only, once per session */}
      {showSwipeHint && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-white/70 text-sm animate-fade-in pointer-events-none"
          style={{ animation: 'fade-in 0.3s ease-out, fade-out 0.3s ease-out 2.5s forwards' }}
        >
          <ChevronLeft className="h-4 w-4 animate-[slide-hint_1s_ease-in-out_infinite]" />
          <span>Swipe to explore</span>
          <ChevronRight className="h-4 w-4 animate-[slide-hint_1s_ease-in-out_infinite_reverse]" />
        </div>
      )}

      {/* Play/Pause Control */}
      <button
        onClick={togglePlayPause}
        className="absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 group"
        aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
        ) : (
          <Play className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Scroll Indicator */}
      {!prefersReducedMotion && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      )}

      {/* Inline keyframes for progress bar & swipe hint */}
      <style>{`
        @keyframes hero-progress-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes slide-hint {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-4px); }
        }
      `}</style>
    </section>
  );
};

/* ── Stat Badge sub-component ── */
function StatBadge({
  stat,
  statLabel,
  trigger,
  animationsEnabled,
  prefersReducedMotion,
  staggerStyle,
}: {
  stat: string;
  statLabel: string;
  trigger: number;
  animationsEnabled: boolean;
  prefersReducedMotion: boolean;
  staggerStyle: (ms: number) => React.CSSProperties;
}) {
  const display = useStatCounter(stat, trigger);

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 mb-8 ml-0 md:ml-2 ${animationsEnabled && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
      style={staggerStyle(25)}
    >
      <span className="text-2xl font-bold text-accent">{display}</span>
      <span className="text-sm text-white/80">{statLabel}</span>
    </div>
  );
}

export default EnhancedHero;

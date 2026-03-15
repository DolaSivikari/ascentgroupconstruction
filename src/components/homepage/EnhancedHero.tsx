import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Shield, Play, Pause, ChevronLeft, ChevronRight, Layers, Droplets, BrickWall, PaintRoller, Car } from "lucide-react";
import { Button } from "@/ui/Button";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useVideoPreloader } from "@/hooks/useVideoPreloader";
import HeroGeometry from "@/components/homepage/HeroGeometry";
import { enrichedHeroSlides } from "@/data/enriched-hero-slides";
import { fetchHeroSlides, type HeroSlide as AdminHeroSlide } from "@/hooks/useHomepageData";

/* ── Constants ── */
const TRANSITION_DURATION = 1000; // ms — cinematic pace
const AUTOPLAY_INTERVAL = 7000;
const AUTOPLAY_INITIAL_DELAY = 2000;
const STAGGER_BASE = 100; // ms between content elements

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

/* ── Persistent service pillars (always visible, never rotates) ── */
const SERVICE_PILLARS = [
  { icon: Layers,      label: "Facade & Cladding" },
  { icon: Droplets,    label: "Waterproofing" },
  { icon: BrickWall,   label: "Masonry Restoration" },
  { icon: PaintRoller, label: "Interior Buildouts" },
  { icon: Car,         label: "Parking Structures" },
] as const;

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

/* ══════════════════════════════════════════════
   EnhancedHero — Cinematic Homepage Slideshow
   ══════════════════════════════════════════════ */
const EnhancedHero = ({ splashComplete = true }: { splashComplete?: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState<number | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [contentRevealKey, setContentRevealKey] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevVideoRef = useRef<HTMLVideoElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const heroReadyRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax refs
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const parallaxRaf = useRef(0);

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
    prefetchCount: 2,
  });

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const prefersReducedMotion = useReducedMotion();

  // ── Page ready ──
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

  /* ── Cinematic slide transition ──
     Phase 1 (out): outgoing slide scales down + darkens while content fades out
     Phase 2 (in):  incoming slide scales from 1.06 → 1.0 with content stagger reveal
     Total duration: ~TRANSITION_DURATION */
  const doSlideChange = useCallback((index: number) => {
    if (index === currentSlide || isTransitioning) return;

    setIsTransitioning(true);

    // Phase: out — outgoing slide shrinks and darkens
    setPreviousSlide(currentSlide);
    setTransitionPhase('out');

    setTimeout(() => {
      // Phase: in — incoming slide takes over
      setCurrentSlide(index);
      setTransitionPhase('in');
      setContentRevealKey(k => k + 1);
    }, TRANSITION_DURATION * 0.45);

    setTimeout(() => {
      // Settle
      setTransitionPhase('idle');
      setPreviousSlide(null);
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  }, [currentSlide, isTransitioning]);

  // ── Autoplay ──
  useEffect(() => {
    if (!isPlaying || activeSlides.length === 0 || !splashComplete) return;

    const initialDelay = setTimeout(() => {
      autoplayIntervalRef.current = setInterval(() => {
        const nextIdx = (currentSlide + 1) % activeSlides.length;
        doSlideChange(nextIdx);
      }, AUTOPLAY_INTERVAL);
    }, AUTOPLAY_INITIAL_DELAY);

    return () => {
      clearTimeout(initialDelay);
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [isPlaying, activeSlides.length, currentSlide, splashComplete, doSlideChange]);

  useEffect(() => {
    setProgressKey(k => k + 1);
  }, [currentSlide]);

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

  // ── Keyboard ──
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      doSlideChange((currentSlide + 1) % activeSlides.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      doSlideChange((currentSlide - 1 + activeSlides.length) % activeSlides.length);
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying(p => !p);
    }
  }, [currentSlide, activeSlides.length, doSlideChange]);

  // ── Swipe hint ──
  useEffect(() => {
    if (!isMobile) return;
    const key = 'hero-swipe-hint-shown';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    setShowSwipeHint(true);
    const t = setTimeout(() => setShowSwipeHint(false), 3000);
    return () => clearTimeout(t);
  }, [isMobile]);

  // ── Parallax ──
  useEffect(() => {
    if (prefersReducedMotion) return;
    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
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

      if (videoLayerRef.current) videoLayerRef.current.style.transform = `translate(${vx}px, ${vy}px)`;
      if (textLayerRef.current) textLayerRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
      parallaxRaf.current = requestAnimationFrame(tick);
    };

    section.addEventListener('mousemove', onMouseMove);
    parallaxRaf.current = requestAnimationFrame(tick);
    return () => {
      section.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(parallaxRaf.current);
      if (videoLayerRef.current) videoLayerRef.current.style.transform = '';
      if (textLayerRef.current) textLayerRef.current.style.transform = '';
    };
  }, [prefersReducedMotion]);

  // Bounds check
  useEffect(() => {
    if (currentSlide >= activeSlides.length && activeSlides.length > 0) setCurrentSlide(0);
  }, [currentSlide, activeSlides.length]);

  const slide = activeSlides[currentSlide];
  if (!slide) return null;

  const prevSlide = previousSlide !== null ? activeSlides[previousSlide] : null;

  const headline = slide.headline;
  const subheadline = slide.subheadline;
  const videoUrl = getVideoUrl(slide.video);
  const videoUrlMobile = slide.video.replace('.mp4', '-mobile.mp4');
  const posterUrl = slide.poster;
  const primaryCTA = slide.primaryCTA;
  const secondaryCTA = slide.secondaryCTA;

  const prevVideoUrl = prevSlide ? getVideoUrl(prevSlide.video) : null;
  const prevVideoUrlMobile = prevSlide ? prevSlide.video.replace('.mp4', '-mobile.mp4') : null;
  const prevPosterUrl = prevSlide?.poster;

  // Reduced motion: no animations
  const shouldAnimate = isPageLoaded && !prefersReducedMotion;

  // ── Compute layer styles for cinematic transition ──
  const getOutgoingStyle = (): React.CSSProperties => {
    if (transitionPhase === 'out') {
      return {
        transform: 'scale(0.95)',
        opacity: 0,
        filter: 'brightness(0.4)',
        transition: `all ${TRANSITION_DURATION * 0.45}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      };
    }
    return { opacity: 0, transition: 'opacity 0ms' };
  };

  const getIncomingStyle = (): React.CSSProperties => {
    if (transitionPhase === 'in') {
      return {
        transform: 'scale(1)',
        opacity: 1,
        transition: `all ${TRANSITION_DURATION * 0.55}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      };
    }
    if (transitionPhase === 'out') {
      return {
        transform: 'scale(1.06)',
        opacity: 0,
      };
    }
    return {
      transform: 'scale(1)',
      opacity: 1,
    };
  };

  const getContentStyle = (): React.CSSProperties => {
    if (transitionPhase === 'out') {
      return {
        opacity: 0,
        transform: 'translateY(8px)',
        transition: `all ${TRANSITION_DURATION * 0.3}ms cubic-bezier(0.4, 0, 1, 1)`,
      };
    }
    return {};
  };

  // Stagger reveal for content items
  const revealStyle = (order: number): React.CSSProperties => {
    if (!shouldAnimate) return {};
    const delay = order * STAGGER_BASE;
    return {
      animationDelay: `${delay}ms`,
      animationFillMode: 'both',
    };
  };

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

      {/* ── Previous slide layer (outgoing — scales down + darkens) ── */}
      {prevSlide && transitionPhase === 'out' && (
        <div
          className="absolute inset-[-16px] w-[calc(100%+32px)] h-[calc(100%+32px)] will-change-transform z-[1]"
          style={getOutgoingStyle()}
        >
          <video
            ref={prevVideoRef}
            width={1920}
            height={1080}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={prevPosterUrl}
            className="absolute inset-0 w-full h-full object-cover"
          >
            {isMobile && prevVideoUrlMobile && <source src={prevVideoUrlMobile} type="video/mp4" />}
            {prevVideoUrl && <source src={prevVideoUrl} type="video/mp4" />}
          </video>
        </div>
      )}

      {/* ── Current slide video layer (incoming — scales from 1.06 → 1.0) ── */}
      <div
        ref={videoLayerRef}
        className="absolute inset-[-16px] w-[calc(100%+32px)] h-[calc(100%+32px)] will-change-transform z-[2]"
        style={getIncomingStyle()}
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

      {/* ── Gradient overlay ── */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Content */}
        <div 
          className="relative z-10 container mx-auto px-4 py-16 md:py-20"
          style={{ 
            opacity: transitionPhase === 'out' ? 0 : 1,
            transform: transitionPhase === 'out' ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 600ms ease-in-out, transform 600ms ease-in-out'
          }}
        >
        <div className="max-w-4xl mx-auto">
          {/* Single Trust Badge - Simplified for Professional Impact */}
          <div
            className={`inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-6 py-3 mb-10 ${isPageLoaded && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
          >
            <Shield className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-white/90">Building Envelope & Restoration Specialists</span>
          </div>

          {/* Stat Counter Badge — reveals second */}
          {slide.stat && slide.statLabel && (
            <StatBadge
              stat={slide.stat}
              statLabel={slide.statLabel}
              trigger={currentSlide}
              shouldAnimate={shouldAnimate}
              revealStyle={revealStyle}
            />
          )}

          {/* Headline — reveals third */}
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-white ${shouldAnimate ? 'animate-hero-reveal' : ''}`}
            style={{
              textShadow: '0 4px 40px rgba(0,0,0,0.6)',
              ...revealStyle(2),
            }}
          >
            {headline}
          </h1>
          {/* Separator between headline and subheadline */}
          <div className="w-12 h-px bg-accent/60 mb-6" />
          <p
            className={`text-lg md:text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl leading-relaxed ${isPageLoaded && !prefersReducedMotion ? 'animate-fade-in' : ''}`}
            style={{ 
              textShadow: '0 2px 20px rgba(0,0,0,0.4)'
            }}
          >
            {subheadline}
          </p>

          {/* CTAs — reveal fifth */}
          <div
            className={`flex flex-col sm:flex-row gap-4 mb-16 ${shouldAnimate ? 'animate-hero-reveal' : ''}`}
            style={revealStyle(4)}
          >
            {/* Primary CTA — premium hover */}
            <Button
              asChild
              size="lg"
              variant="primary"
              className="group relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-0.5"
            >
              <Link to={primaryCTA.href} className="gap-2">
                <span className="relative z-10">{primaryCTA.label}</span>
                <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-500 ease-out" />
                {/* Subtle highlight sweep on hover */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </Link>
            </Button>

            {secondaryCTA && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/5"
              >
                <Link to={secondaryCTA.href}>
                  {secondaryCTA.label}
                </Link>
              </Button>
            )}
          </div>

          {/* ── Persistent Service Pillars — always visible, never rotates ── */}
          <div className="flex flex-wrap gap-2 mb-10">
            {SERVICE_PILLARS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/20 hover:border-white/35 transition-colors duration-300"
              >
                <Icon className="h-4 w-4 text-accent flex-shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* ── Progress Bar Indicators — reveal last ── */}
          <div className={`flex gap-2 items-center justify-center md:justify-start ${shouldAnimate ? 'animate-hero-reveal' : ''}`} style={revealStyle(5)}>
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`relative rounded-full overflow-hidden transition-all duration-500 ease-out ${
                  index === currentSlide
                    ? 'h-1.5 bg-white/20'
                    : 'h-1 bg-white/15 hover:bg-white/25'
                }`}
                style={{ width: index === currentSlide ? 56 : 20 }}
              >
                {index === currentSlide && (
                  <span
                    key={progressKey}
                    className="absolute inset-0 rounded-full bg-accent origin-left"
                    style={{
                      animation: `hero-progress-fill ${AUTOPLAY_INTERVAL}ms linear forwards`,
                      animationPlayState: isPlaying && splashComplete ? 'running' : 'paused',
                    }}
                  />
                )}
              </button>
            ))}

            {/* Slide counter */}
            <span className="ml-3 text-xs font-medium text-white/40 tabular-nums tracking-wider">
              {String(currentSlide + 1).padStart(2, '0')} / {String(activeSlides.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Swipe hint (mobile, once per session) ── */}
      {showSwipeHint && (
        <div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-white/70 text-sm pointer-events-none"
          style={{ animation: 'hero-reveal 0.3s ease-out, fade-out 0.3s ease-out 2.5s forwards' }}
        >
          <ChevronLeft className="h-4 w-4 animate-[slide-hint_1s_ease-in-out_infinite]" />
          <span>Swipe to explore</span>
          <ChevronRight className="h-4 w-4 animate-[slide-hint_1s_ease-in-out_infinite_reverse]" />
        </div>
      )}

      {/* ── Play/Pause Control ── */}
      <button
        onClick={togglePlayPause}
        className="absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 flex items-center justify-center transition-all duration-500 group hover:-translate-y-0.5"
        aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <Play className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>

      {/* ── Scroll Indicator — animated bounce ── */}
      {!prefersReducedMotion && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-hero-reveal" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
          <div className="w-6 h-10 border-2 border-white/25 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-[hero-scroll-dot_2s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* ── Inline keyframes ── */}
      <style>{`
        @keyframes hero-progress-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes slide-hint {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-4px); }
        }
        @keyframes hero-reveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-hero-reveal {
          animation: hero-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes hero-scroll-dot {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
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
  shouldAnimate,
  revealStyle,
}: {
  stat: string;
  statLabel: string;
  trigger: number;
  shouldAnimate: boolean;
  revealStyle: (ms: number) => React.CSSProperties;
}) {
  const display = useStatCounter(stat, trigger);

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 mb-8 ml-0 md:ml-2 ${shouldAnimate ? 'animate-hero-reveal' : ''}`}
      style={revealStyle(1)}
    >
      <span className="text-2xl font-bold text-accent">{display}</span>
      <span className="text-sm text-white/80">{statLabel}</span>
    </div>
  );
}

export default EnhancedHero;

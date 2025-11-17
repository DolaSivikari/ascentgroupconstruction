import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import logoIntroVideo from "@/assets/ascent-logo-intro.mp4";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [minDisplayMet, setMinDisplayMet] = useState(false);
  const [mountTime] = useState(Date.now());
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if user has seen splash in last 24 hours
    const hasSeenSplash = localStorage.getItem("ascent-splash-seen");
    const lastSeen = hasSeenSplash ? parseInt(hasSeenSplash) : 0;
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (isMobile || now - lastSeen < twentyFourHours || prefersReducedMotion) {
      // Skip splash if mobile, seen recently, or user prefers reduced motion
      onComplete();
      return;
    }

    // Set minimum display time of 2 seconds
    const minTimer = setTimeout(() => {
      setMinDisplayMet(true);
    }, 2000);

    return () => clearTimeout(minTimer);
  }, [onComplete, prefersReducedMotion, isMobile]);

  const handleVideoEnd = () => {
    // Only complete if minimum display time has been met
    if (!minDisplayMet) {
      // Calculate remaining time based on mount time
      const elapsed = Date.now() - mountTime;
      const remainingTime = Math.max(0, 2000 - elapsed);
      setTimeout(() => {
        finishSplash();
      }, remainingTime);
    } else {
      finishSplash();
    }
  };

  const finishSplash = () => {
    localStorage.setItem("ascent-splash-seen", Date.now().toString());
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    // Only allow skip if minimum display time has been met
    if (minDisplayMet) {
      finishSplash();
    }
  };

  if (!isVisible || prefersReducedMotion || isMobile) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="w-screen h-screen object-cover"
      >
        <source src={logoIntroVideo} type="video/mp4" />
      </video>

      <button
        onClick={handleSkip}
        disabled={!minDisplayMet}
        className={`absolute bottom-8 right-8 px-6 py-2 text-sm transition-all border border-border rounded-md ${
          minDisplayMet 
            ? 'text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer' 
            : 'text-muted-foreground/50 cursor-not-allowed opacity-50'
        }`}
      >
        Skip Intro
      </button>
    </div>
  );
};

export default SplashScreen;

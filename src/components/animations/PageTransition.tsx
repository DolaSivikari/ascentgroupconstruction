import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
  /** Transition type: 'fade', 'slide', 'zoom' */
  type?: "fade" | "slide" | "zoom";
  /** Duration in milliseconds */
  duration?: number;
  /** Custom className for the wrapper */
  className?: string;
}

/**
 * Wrapper component for smooth page transitions
 * Automatically animates on route changes
 *
 * @example
 * ```tsx
 * <PageTransition type="fade">
 *   <YourPageContent />
 * </PageTransition>
 * ```
 */
export const PageTransition = ({
  children,
  type = "fade",
  duration = 400,
  className,
}: PageTransitionProps) => {
  const location = useLocation();
  // A transformed ancestor makes fixed navigation scroll with the admin page.
  const disabled = /^\/admin(?:\/|$)/.test(location.pathname);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<
    "entering" | "exiting"
  >("entering");
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Mark initial render complete
  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  useEffect(() => {
    if (disabled) {
      setDisplayLocation(location);
      setTransitionStage("entering");
      return;
    }
    // Skip transition on initial render
    if (isInitialRender) return;

    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("exiting");
    }
  }, [location, displayLocation, isInitialRender, disabled]);

  const transitionClasses = {
    fade: {
      entering: "page-transition-enter",
      exiting: "page-transition-exit",
    },
    slide: {
      entering: "page-slide-enter",
      exiting: "page-slide-exit",
    },
    zoom: {
      entering: "page-zoom-enter",
      exiting: "page-zoom-exit",
    },
  };

  return (
    <div
      className={cn(
        "w-full",
        !disabled &&
          !isInitialRender &&
          transitionClasses[type][transitionStage],
        className,
      )}
      onAnimationEnd={() => {
        if (transitionStage === "exiting") {
          setDisplayLocation(location);
          setTransitionStage("entering");
        }
      }}
      style={{
        animationDuration: `${duration}ms`,
        willChange: disabled || isInitialRender ? "auto" : "opacity",
      }}
    >
      {children}
    </div>
  );
};

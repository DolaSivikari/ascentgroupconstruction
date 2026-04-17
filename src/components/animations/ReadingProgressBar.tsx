import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ReadingProgressBarProps {
  /** Optional className */
  className?: string;
  /** Height of the bar in pixels (default 2) */
  height?: number;
}

/**
 * Top-fixed scroll-progress bar that fills as the user scrolls the document.
 * Uses requestAnimationFrame for smooth, performant updates.
 *
 * @example
 * ```tsx
 * <ReadingProgressBar />
 * ```
 */
export const ReadingProgressBar = ({
  className,
  height = 2,
}: ReadingProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight - winH;
      const pct = docH > 0 ? Math.min(100, Math.max(0, (window.scrollY / docH) * 100)) : 0;
      setProgress(pct);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={cn("fixed top-0 left-0 right-0 z-sticky pointer-events-none", className)}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;

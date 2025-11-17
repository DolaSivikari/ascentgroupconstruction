import { useState, useEffect } from "react";

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      
      // Update "at top" status (within 100px of top)
      setIsAtTop(scrollY < 100);

      // Only update direction if scroll change is significant (>10px)
      if (Math.abs(scrollY - lastScrollY) < 10) {
        ticking = false;
        return;
      }

      const direction = scrollY > lastScrollY ? "down" : "up";
      
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDirection]);

  return { scrollDirection, isAtTop };
};

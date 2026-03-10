import { useState, useEffect, useRef } from "react";

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      setIsAtTop(scrollY < 100);

      if (Math.abs(scrollY - lastScrollY.current) < 10) {
        ticking = false;
        return;
      }

      setScrollDirection(scrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
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
  }, []);

  return { scrollDirection, isAtTop };
};

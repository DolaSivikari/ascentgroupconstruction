import { useState, useEffect, RefObject } from 'react';

export function useScrollIndicator(ref: RefObject<HTMLElement>) {
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkScroll = () => {
      const scrollable = element.scrollHeight > element.clientHeight;
      const atTop = element.scrollTop === 0;
      const atBottom = Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1;

      setIsScrollable(scrollable);
      setIsAtTop(atTop);
      setIsAtBottom(atBottom);
    };

    // Check on mount and resize
    checkScroll();
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(element);

    // Check on scroll
    element.addEventListener('scroll', checkScroll);

    return () => {
      resizeObserver.disconnect();
      element.removeEventListener('scroll', checkScroll);
    };
  }, [ref]);

  return { isScrollable, isAtBottom, isAtTop };
}

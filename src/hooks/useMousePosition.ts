import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalized: {
    x: number; // -1 to 1
    y: number; // -1 to 1
  };
}

export const useMousePosition = (elementRef?: React.RefObject<HTMLElement>) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalized: { x: 0, y: 0 }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const element = elementRef?.current;
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const normalizedX = (x / rect.width) * 2 - 1;
        const normalizedY = (y / rect.height) * 2 - 1;
        
        setMousePosition({
          x,
          y,
          normalized: { x: normalizedX, y: normalizedY }
        });
      } else {
        const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
        const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
        
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
          normalized: { x: normalizedX, y: normalizedY }
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [elementRef]);

  return mousePosition;
};

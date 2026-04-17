import { ReactNode, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  /** Maximum pixel pull strength on hover */
  strength?: number;
  /** Custom className */
  className?: string;
}

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  (("ontouchstart" in window) || navigator.maxTouchPoints > 0);

/**
 * Wraps a CTA in a subtle magnetic-pull hover container.
 * Falls back to a plain wrapper on touch devices and when prefers-reduced-motion is set.
 *
 * @example
 * ```tsx
 * <MagneticButton>
 *   <Button>Submit RFP</Button>
 * </MagneticButton>
 * ```
 */
export const MagneticButton = ({
  children,
  strength = 8,
  className,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  const disabled = reduced || isTouchDevice();

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const max = strength;
    // Normalize by half-size so movement is bounded
    const x = Math.max(-max, Math.min(max, (relX / (rect.width / 2)) * max));
    const y = Math.max(-max, Math.min(max, (relY / (rect.height / 2)) * max));
    setPos({ x, y });
  }, [disabled, strength]);

  const handleLeave = useCallback(() => {
    if (disabled) return;
    setPos({ x: 0, y: 0 });
  }, [disabled]);

  if (disabled) {
    return <div className={cn("inline-block", className)}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("inline-block", className)}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

export default MagneticButton;

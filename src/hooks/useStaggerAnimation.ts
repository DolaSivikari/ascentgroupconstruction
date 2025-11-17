import { useEffect, useState } from "react";

interface UseStaggerAnimationOptions {
  /** Number of items to animate */
  itemCount: number;
  /** Delay between each item in milliseconds */
  staggerDelay?: number;
  /** Initial delay before starting animations in milliseconds */
  initialDelay?: number;
}

/**
 * Hook for creating stagger animations with dynamic delays
 * @param options - Stagger animation configuration
 * @returns array of delay values for each item
 * 
 * @example
 * ```tsx
 * const delays = useStaggerAnimation({ itemCount: items.length, staggerDelay: 100 });
 * 
 * return (
 *   <div>
 *     {items.map((item, index) => (
 *       <div
 *         key={item.id}
 *         className="animate-fade-in"
 *         style={{ animationDelay: `${delays[index]}ms` }}
 *       >
 *         {item.content}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useStaggerAnimation = (options: UseStaggerAnimationOptions) => {
  const { itemCount, staggerDelay = 100, initialDelay = 0 } = options;
  const [delays, setDelays] = useState<number[]>([]);

  useEffect(() => {
    const newDelays = Array.from({ length: itemCount }, (_, index) => 
      initialDelay + (index * staggerDelay)
    );
    setDelays(newDelays);
  }, [itemCount, staggerDelay, initialDelay]);

  return delays;
};

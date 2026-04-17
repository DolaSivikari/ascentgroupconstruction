import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { STAGGER, wordReveal } from "@/lib/motion-presets";

interface RevealTextProps {
  /** Text to reveal word-by-word. */
  children: string;
  /** Additional className applied to the wrapper span. */
  className?: string;
  /** Stagger between words in seconds. Defaults to STAGGER.base (0.06s). */
  stagger?: number;
  /** Element to render as. Defaults to "span" so it's safe inside any heading. */
  as?: "span" | "div";
}

/**
 * RevealText — word-by-word fade/translate entrance with expo-out easing.
 *
 * Design intent: makes headings feel "crafted" without being showy.
 * Respects prefers-reduced-motion automatically (renders plain text).
 *
 * Triggers once when scrolled into view (50px margin).
 */
export const RevealText = ({
  children,
  className,
  stagger = STAGGER.base,
  as = "span",
}: RevealTextProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Reduced motion: render plain text, no animation, no DOM bloat.
  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const words = children.split(" ");
  const MotionWrapper = as === "div" ? motion.div : motion.span;

  return (
    <MotionWrapper
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ staggerChildren: stagger }}
      aria-label={children}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordReveal}
          className="inline-block"
          aria-hidden="true"
        >
          {word}
          {i < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </MotionWrapper>
  );
};

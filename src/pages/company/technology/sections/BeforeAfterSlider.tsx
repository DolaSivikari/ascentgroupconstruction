import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Section } from '@/components/sections/Section';
import { SectionHeader } from '@/design-system/components/SectionHeader';
import { BEFORE_AFTER } from '../data';

interface Props { rm: boolean }

export const BeforeAfterSlider = ({ rm }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  useEffect(() => {
    const onUp = () => { isDragging.current = false; };
    document.addEventListener('pointermove', handlePointerMove as EventListener);
    document.addEventListener('pointerup', onUp);
    return () => {
      document.removeEventListener('pointermove', handlePointerMove as EventListener);
      document.removeEventListener('pointerup', onUp);
    };
  }, [handlePointerMove]);

  return (
    <div ref={sectionRef}>
      <Section size="major" className="bg-muted/30" disableAnimation>
        <SectionHeader
          badge="The Difference"
          title="Industry standard vs. Ascent standard."
          description="Drag to compare. Both approaches finish the job. Only one documents it."
          align="center"
        />

        <motion.div
          initial={rm ? false : { opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          ref={containerRef}
          onPointerDown={() => { isDragging.current = true; }}
          className="relative h-80 md:h-96 rounded-lg overflow-hidden border border-border select-none cursor-col-resize"
          style={{ touchAction: 'none' }}
        >
          <div className="absolute inset-0 bg-muted flex flex-col justify-center">
            <div className="w-1/2 px-8 md:px-12">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-5">
                Industry Standard
              </p>
              <ul className="space-y-3">
                {BEFORE_AFTER.before.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/70">
                    <span className="w-4 h-4 rounded-full border border-border flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="absolute inset-0 bg-primary flex flex-col justify-center"
            style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
          >
            <div className="absolute inset-0 flex flex-col justify-center items-end">
              <div className="w-1/2 px-8 md:px-12">
                <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wider mb-5">
                  Ascent Standard
                </p>
                <ul className="space-y-3">
                  {BEFORE_AFTER.after.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-primary-foreground/90">
                      <CheckCircle className="w-4 h-4 text-primary-foreground flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary z-20"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg cursor-col-resize">
              <div className="flex gap-0.5">
                <ChevronRight className="w-3 h-3 text-primary-foreground rotate-180" />
                <ChevronRight className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Drag the handle to compare approaches
        </p>
      </Section>
    </div>
  );
};

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { SCROLLYTELLING_PHASES } from '../data';

interface Props { rm: boolean }

export const ScrollytellingSection = ({ rm }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setActivePhase(Math.min(4, Math.floor(latest * 5)));
    });
  }, [scrollYProgress]);

  const phase = SCROLLYTELLING_PHASES[activePhase];
  const PhaseIcon = phase.icon;
  const dur = rm ? 0 : 0.35;

  return (
    <div ref={containerRef} className={`relative ${rm ? 'h-auto' : 'h-[500vh]'}`}>
      <div className={rm ? '' : 'sticky top-0 h-screen'}>
        <div className="relative h-full flex items-center overflow-hidden bg-muted/30">
          <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            {SCROLLYTELLING_PHASES.map((p, i) => (
              <button
                key={i}
                onClick={rm ? () => setActivePhase(i) : undefined}
                aria-label={`Phase ${i + 1}: ${p.label}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activePhase ? 'bg-primary scale-150' : 'bg-foreground/20 hover:bg-foreground/40'
                }`}
              />
            ))}
          </div>

          <motion.div
            className="absolute top-0 left-0 h-0.5 bg-primary origin-left z-20"
            style={{ scaleX: rm ? 1 : scrollYProgress }}
          />

          <div className="w-full max-w-6xl mx-auto px-8 md:px-16 lg:px-20">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="order-2 md:order-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`stat-${activePhase}`}
                    initial={rm ? false : { opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={rm ? undefined : { opacity: 0, x: 30 }}
                    transition={{ duration: dur }}
                  >
                    <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
                      {phase.number} / 05
                    </p>
                    <p className="text-6xl md:text-8xl font-bold text-foreground/10 leading-none mb-4">
                      {phase.stat}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs">{phase.statLabel}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="order-1 md:order-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`content-${activePhase}`}
                    initial={rm ? false : { opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={rm ? undefined : { opacity: 0, y: -20 }}
                    transition={{ duration: dur }}
                    className="space-y-6"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-primary/30 bg-primary/10">
                      <PhaseIcon className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-primary font-medium uppercase tracking-wider">
                        {phase.label}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                      {phase.title}
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {phase.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {activePhase === 0 && !rm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-8 right-10 hidden md:flex items-center gap-2 text-xs text-muted-foreground"
              >
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                Scroll to advance
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {rm && (
        <div className="bg-muted/50 rounded-lg max-w-3xl mx-auto px-8 py-10 space-y-10 mt-8">
          {SCROLLYTELLING_PHASES.map((p, i) => (
            <div key={i} className="border-l-2 border-primary/30 pl-6">
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                {p.number} / 05 — {p.label}
              </p>
              <h3 className="text-xl font-bold text-foreground mb-2">{p.title}</h3>
              <p className="text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Section } from '@/components/sections/Section';
import { SectionHeader } from '@/design-system/components/SectionHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { TOOL_CONNECTIONS, TOOLS } from '../data';

interface Props { rm: boolean }

export const ConstellationSection = ({ rm }: Props) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const nodeCoords = TOOLS.map((t) => ({
    cx: parseFloat(t.x),
    cy: parseFloat(t.y),
  }));

  return (
    <Section size="major" disableAnimation>
      <SectionHeader
        badge="Our Digital Toolkit"
        title="Tools. Not excuses."
        description="The software we actually use — and why each one earns its place in our workflow."
        align="center"
      />

      {isMobile ? (
        <div className="grid grid-cols-2 gap-4">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={rm ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: rm ? 0 : i * 0.08, duration: 0.4 }}
              className="p-4 rounded-lg border border-border bg-muted/30"
            >
              <p className="font-bold text-foreground text-sm">{tool.label}</p>
              <p className="text-xs text-primary mb-2">{tool.sublabel}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="relative w-full" style={{ aspectRatio: '16/7' }}>
          <svg viewBox="0 0 100 56" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            {TOOL_CONNECTIONS.map(([a, b], i) => {
              const ax = nodeCoords[a].cx;
              const ay = nodeCoords[a].cy * 0.56;
              const bx = nodeCoords[b].cx;
              const by = nodeCoords[b].cy * 0.56;
              return (
                <motion.line
                  key={i}
                  x1={ax} y1={ay} x2={bx} y2={by}
                  stroke="hsl(var(--border))" strokeWidth="0.2"
                  initial={rm ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.6 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                />
              );
            })}

            {!rm &&
              TOOL_CONNECTIONS.map(([a, b], i) => {
                const ax = nodeCoords[a].cx;
                const ay = nodeCoords[a].cy * 0.56;
                const bx = nodeCoords[b].cx;
                const by = nodeCoords[b].cy * 0.56;
                return (
                  <motion.circle
                    key={`pulse-${i}`}
                    r={0.5}
                    fill="hsl(var(--primary))"
                    animate={{ cx: [ax, bx, ax], cy: [ay, by, ay], opacity: [0, 0.9, 0.9, 0] }}
                    transition={{
                      duration: 2.5,
                      delay: 1 + i * 0.4,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: 'easeInOut',
                    }}
                  />
                );
              })}

            {TOOLS.map((tool, i) => {
              const cx = nodeCoords[i].cx;
              const cy = nodeCoords[i].cy * 0.56;
              const isHovered = hovered === i;
              return (
                <g
                  key={tool.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <motion.circle
                    cx={cx} cy={cy} r={isHovered ? 4.5 : 3}
                    fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="0.15"
                    initial={rm ? false : { scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  />
                  <motion.circle
                    cx={cx} cy={cy} r={1.2} fill="hsl(var(--primary))"
                    initial={rm ? false : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ delay: 0.6 + i * 0.12, duration: 0.3, type: 'spring' }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  />
                  <motion.text
                    x={cx} y={cy + 5.5} textAnchor="middle"
                    fill="hsl(var(--foreground))" fontSize="1.8" fontWeight="600"
                    initial={rm ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                  >
                    {tool.label}
                  </motion.text>
                  <motion.text
                    x={cx} y={cy + 7.5} textAnchor="middle"
                    fill="hsl(var(--muted-foreground))" fontSize="1.4"
                    initial={rm ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ delay: 0.9 + i * 0.1, duration: 0.3 }}
                  >
                    {tool.sublabel}
                  </motion.text>
                </g>
              );
            })}
          </svg>

          <AnimatePresence>
            {hovered !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 p-4 bg-card text-card-foreground rounded-lg shadow-lg border border-border pointer-events-none z-30"
              >
                <p className="font-bold text-sm mb-0.5">{TOOLS[hovered].label}</p>
                <p className="text-xs text-primary mb-2">{TOOLS[hovered].sublabel}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{TOOLS[hovered].description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Section>
  );
};

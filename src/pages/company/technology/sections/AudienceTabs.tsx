import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Section } from '@/components/sections/Section';
import { SectionHeader } from '@/design-system/components/SectionHeader';
import { AUDIENCE_TABS } from '../data';

interface Props { rm: boolean }

export const AudienceTabs = ({ rm }: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const tab = AUDIENCE_TABS[activeTab];
  const TabIcon = tab.icon;

  return (
    <div ref={sectionRef}>
      <Section size="major" disableAnimation>
        <SectionHeader
          badge="Who We Work With"
          title="Digital coordination, tailored to your role."
          align="center"
        />

        <motion.div
          initial={rm ? false : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
          role="tablist"
        >
          {AUDIENCE_TABS.map((t, i) => {
            const Icon = t.icon;
            return (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeTab}
                onClick={() => setActiveTab(i)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  i === activeTab
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={rm ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={rm ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: rm ? 0 : 0.3 }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-6">
                <TabIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                {tab.headline}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{tab.body}</p>
            </div>

            <div className="bg-muted/40 rounded-lg p-8 border border-border/60">
              <p className="text-sm font-medium text-primary uppercase tracking-wider mb-5">
                What this means for you
              </p>
              <ul className="space-y-4">
                {tab.points.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={rm ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rm ? 0 : 0.1 + i * 0.08, duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </Section>
    </div>
  );
};

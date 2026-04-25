import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/sections/Section';
import { SectionHeader } from '@/design-system/components/SectionHeader';
import { Button } from '@/ui/Button';
import { TIMELINE_NODES } from '../data';

interface Props { rm: boolean }

export const TimelineSection = ({ rm }: Props) => (
  <Section size="major" className="bg-muted/30">
    <SectionHeader
      badge="Project Timeline"
      title="Every phase. Documented."
      description="From pre-mobilization through closeout, every stage is backed by a clear documentation standard."
      align="left"
    />

    <div className="grid md:grid-cols-5 gap-0 md:gap-0 border border-border rounded-lg overflow-hidden bg-background">
      {TIMELINE_NODES.map((node, i) => {
        const Icon = node.icon;
        const isLast = i === TIMELINE_NODES.length - 1;
        return (
          <motion.div
            key={i}
            initial={rm ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: rm ? 0 : i * 0.08, duration: 0.4 }}
            className={`relative p-6 md:p-5 lg:p-6 ${!isLast ? 'border-b md:border-b-0 md:border-r border-border' : ''}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-foreground/10 leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 h-px bg-border" />
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-primary" />
              </div>
            </div>

            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1.5">
              {node.phase}
            </p>
            <h3 className="text-sm font-bold text-foreground mb-2 leading-snug">
              {node.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {node.detail}
            </p>
          </motion.div>
        );
      })}
    </div>

    <div className="mt-8 flex items-center gap-4">
      <Button asChild size="lg">
        <Link to="/our-process">
          View Our Process <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
      <span className="text-sm text-muted-foreground">
        See how this maps to our 7-step delivery process.
      </span>
    </div>
  </Section>
);

import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/sections/Section';

const LINKS = [
  {
    title: 'Our Delivery Process',
    body: 'See how digital tools integrate at each stage of our 5-step delivery process.',
    href: '/our-process',
    label: 'View Process',
  },
  {
    title: 'Prequalification',
    body: 'Download our capability statement, WSIB certificate, and insurance docs.',
    href: '/prequalification',
    label: 'Get Pre-Qual Docs',
  },
  {
    title: 'For General Contractors',
    body: 'How we work as a specialty trade partner on GC-led projects.',
    href: '/for-general-contractors',
    label: 'Learn More',
  },
];

export const CrossLinks = () => (
  <Section size="subsection" className="bg-muted/30 border-t border-border/50">
    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {LINKS.map((card, i) => (
        <div key={i} className="p-6 bg-background rounded-lg border border-border hover:shadow-md transition-shadow">
          <h3 className="font-bold text-foreground mb-2">{card.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{card.body}</p>
          <Link
            to={card.href}
            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            {card.label} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ))}
    </div>
  </Section>
);

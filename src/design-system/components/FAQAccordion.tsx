import { useEffect, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  faqs: FAQItem[];
  /** Inject FAQPage JSON-LD into <head> for SEO/AEO */
  emitSchema?: boolean;
  /** Default open value (e.g. "item-0") */
  defaultValue?: string;
  className?: string;
}

const buildSchema = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
});

/**
 * FAQAccordion — Single drop-in component for FAQ rendering + auto schema.
 * Replaces duplicated accordion+schema patterns across FAQ.tsx, Homeowners.tsx,
 * ServiceDetail.tsx, and others.
 */
export const FAQAccordion = ({
  faqs,
  emitSchema = true,
  defaultValue,
  className,
}: FAQAccordionProps) => {
  const schemaId = useMemo(
    () => `faq-schema-${faqs.length}-${faqs[0]?.question?.length ?? 0}`,
    [faqs],
  );

  useEffect(() => {
    if (!emitSchema || faqs.length === 0) return;
    // Avoid duplicate injection across re-mounts of similar lists
    const existing = document.getElementById(schemaId) as HTMLScriptElement | null;
    const json = JSON.stringify(buildSchema(faqs));
    if (existing) {
      existing.textContent = json;
      return;
    }
    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = schemaId;
    tag.textContent = json;
    document.head.appendChild(tag);
    return () => {
      if (tag.parentNode) tag.parentNode.removeChild(tag);
    };
  }, [emitSchema, faqs, schemaId]);

  if (faqs.length === 0) return null;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue}
      className={cn("w-full space-y-3", className)}
    >
      {faqs.map((faq, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="border border-border rounded-lg px-5 bg-card shadow-sm"
        >
          <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQAccordion;

import { useEffect, useMemo } from "react";
import { Card, CardContent } from "@/ui/Card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

interface Question {
  question: string;
  answer: string;
}

interface PeopleAlsoAskProps {
  questions: Question[];
  /** Optional override heading */
  title?: string;
  /** Inject FAQPage JSON-LD into <head> for AEO */
  emitSchema?: boolean;
  className?: string;
}

const buildSchema = (questions: Question[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: questions.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: { "@type": "Answer", text: q.answer },
  })),
});

const PeopleAlsoAsk = ({
  questions,
  title = "People Also Ask",
  emitSchema = true,
  className = "",
}: PeopleAlsoAskProps) => {
  const schemaId = useMemo(
    () => `paa-schema-${questions.length}-${questions[0]?.question?.length ?? 0}`,
    [questions],
  );

  useEffect(() => {
    if (!emitSchema || questions.length === 0) return;
    const existing = document.getElementById(schemaId) as HTMLScriptElement | null;
    const json = JSON.stringify(buildSchema(questions));
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
  }, [emitSchema, questions, schemaId]);

  if (!questions || questions.length === 0) return null;

  return (
    <section className={cn("w-full", className)} aria-labelledby="paa-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-md bg-primary/10">
          <HelpCircle className="w-5 h-5 text-primary" />
        </div>
        <h2 id="paa-heading" className="text-2xl md:text-3xl font-bold">
          {title}
        </h2>
      </div>
      <Card>
        <CardContent className="p-4 md:p-6">
          <Accordion type="single" collapsible className="w-full">
            {questions.map((item, index) => (
              <AccordionItem key={index} value={`paa-${index}`}>
                <AccordionTrigger className="text-left font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
};

export default PeopleAlsoAsk;

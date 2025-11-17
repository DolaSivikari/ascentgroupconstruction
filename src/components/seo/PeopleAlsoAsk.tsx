import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Question {
  question: string;
  answer: string;
}

interface PeopleAlsoAskProps {
  questions: Question[];
  className?: string;
}

const PeopleAlsoAsk = ({ questions, className = "" }: PeopleAlsoAskProps) => {
  return (
    <section className={className}>
      <h2 className="text-3xl font-bold mb-6">People Also Ask</h2>
      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {questions.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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

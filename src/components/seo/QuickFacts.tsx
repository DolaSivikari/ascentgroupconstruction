import { Card, CardContent } from "@/components/ui/card";

interface QuickFact {
  label: string;
  value: string;
}

interface QuickFactsProps {
  title: string;
  facts: QuickFact[];
  className?: string;
}

const QuickFacts = ({ title, facts, className = "" }: QuickFactsProps) => {
  return (
    <Card className={`bg-muted/50 ${className}`}>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <dl className="space-y-3">
          {facts.map((fact, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <dt className="font-semibold text-foreground min-w-[140px]">{fact.label}:</dt>
              <dd className="text-muted-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};

export default QuickFacts;

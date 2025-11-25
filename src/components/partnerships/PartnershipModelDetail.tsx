import { PartnershipModel } from "@/data/partnership-models";
import { PartnershipDiagram } from "./PartnershipDiagram";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface PartnershipModelDetailProps {
  model: PartnershipModel;
}

export const PartnershipModelDetail = ({ model }: PartnershipModelDetailProps) => {
  return (
    <div id={model.id} className="scroll-mt-24">
      <div className="rounded-[var(--radius-lg)] border border-border/40 bg-card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-8 border-b border-border/40">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            {model.title}
          </h3>
          <p className="text-muted-foreground max-w-3xl">
            {model.description}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Diagram */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
              Partnership Structure
            </h4>
            <div className="bg-background/50 rounded-[var(--radius-md)] p-6">
              <PartnershipDiagram config={model.diagram} size="large" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Best For */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                Best For
              </h4>
              <div className="flex flex-wrap gap-2">
                {model.bestFor.map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Typical Clients */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                Typical Clients
              </h4>
              <ul className="space-y-2">
                {model.typicalClients.map((client, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {client}
                  </li>
                ))}
              </ul>
            </div>

            {/* Value Propositions */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                Value Propositions
              </h4>
              <ul className="space-y-2">
                {model.valuePropositions.map((prop, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    {prop}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button asChild className="w-full md:w-auto">
                <a href={model.cta.link}>{model.cta.text}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

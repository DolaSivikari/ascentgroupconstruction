import { Link } from "react-router-dom";
import { PartnershipModel } from "@/data/partnership-models";
import { PartnershipDiagram } from "./PartnershipDiagram";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface PartnershipModelCardProps {
  model: PartnershipModel;
}

export const PartnershipModelCard = ({ model }: PartnershipModelCardProps) => {
  return (
    <Link
      to={`/capabilities#${model.id}`}
      className="group block relative rounded-[var(--radius-lg)] border border-border/40 bg-card/50 hover:bg-accent/50 hover:border-primary/20 transition-all duration-200 ease-out hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Diagram Preview */}
      <div className="p-6 pb-4 bg-gradient-to-b from-background/5 to-transparent">
        <PartnershipDiagram config={model.diagram} size="small" />
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200 ease-out">
          {model.shortTitle}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {model.shortDescription}
        </p>

        {/* Best For Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {model.bestFor.slice(0, 2).map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag.split(' ').slice(0, 3).join(' ')}...
            </Badge>
          ))}
        </div>

        {/* Learn More */}
        <div className="flex items-center text-sm font-medium text-primary group-hover:text-primary/80 transition-colors duration-200 ease-out">
          Learn More
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200 ease-out" />
        </div>
      </div>

      {/* Hover Effect Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left" />
    </Link>
  );
};

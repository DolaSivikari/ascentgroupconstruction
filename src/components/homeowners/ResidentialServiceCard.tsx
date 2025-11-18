import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/design-system/components/Card";
import { H3 } from "@/design-system/components/Typography";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResidentialServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  scope: string[];
  typical: string;
  timeline: string;
  className?: string;
}

export const ResidentialServiceCard = ({
  icon: Icon,
  title,
  description,
  scope,
  typical,
  timeline,
  className,
}: ResidentialServiceCardProps) => {
  return (
    <Card variant="elevated" hover className={cn("h-full group", className)}>
      <CardContent className="p-8">
        {/* Icon with gradient background */}
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-construction-orange/10 to-construction-orange/5 flex items-center justify-center mb-6 group-hover:from-construction-orange/20 group-hover:to-construction-orange/10 transition-colors">
          <Icon className="w-7 h-7 text-construction-orange" />
        </div>

        {/* Title */}
        <H3 className="mb-4">{title}</H3>

        {/* Description */}
        <p className="text-base text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        {/* Scope */}
        <div className="mb-6">
          <h4 className="font-semibold text-sm mb-3 text-foreground">Typical Scope:</h4>
          <ul className="space-y-2">
            {scope.map((item, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-construction-orange mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cost & Timeline Badges */}
        <div className="pt-6 border-t border-border flex items-center gap-3 flex-wrap">
          <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="font-medium">{typical}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">{timeline}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

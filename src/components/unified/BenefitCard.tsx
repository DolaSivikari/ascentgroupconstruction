import { CheckCircle2, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/design-system/components/Card";
import { cn } from "@/lib/utils";

interface BenefitCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}

export const BenefitCard = ({ title, description, icon: Icon = CheckCircle2, className }: BenefitCardProps) => {
  return (
    <Card variant="outline" size="sm" hover className={cn("h-full", className)}>
      <CardContent className="flex gap-3 p-0">
        <Icon className="w-5 h-5 text-construction-orange flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-foreground text-base mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/design-system/components/Card";
import { cn } from "@/lib/utils";

interface ProcessStepCardProps {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export const ProcessStepCard = ({ step, title, description, icon: Icon, className }: ProcessStepCardProps) => {
  return (
    <Card variant="elevated" hover className={cn("h-full group", className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-construction-orange/10 flex items-center justify-center border-2 border-construction-orange/20">
              <span className="text-lg font-bold text-construction-orange">{step}</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="w-10 h-10 rounded-lg bg-construction-orange/10 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-construction-orange" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

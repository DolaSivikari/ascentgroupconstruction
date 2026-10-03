import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
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
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <span className="text-lg font-bold text-primary">{step}</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className={`${TYPOGRAPHY_STYLES.cardTitle} text-foreground mb-2`}>{title}</h3>
            <p className={`${TYPOGRAPHY_STYLES.cardBody} text-muted-foreground`}>{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/design-system/components/Card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stats?: string;
  className?: string;
}

export const FeatureCard = ({ icon: Icon, title, description, stats, className }: FeatureCardProps) => {
  return (
    <Card variant="elevated" hover className={cn("h-full group", className)}>
      <CardContent className="p-8">
        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground leading-tight">
          {title}
        </h3>
        <p className="text-base text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>
        {stats && (
          <div className="pt-4 border-t border-border">
            <span className="text-sm font-semibold text-construction-orange">{stats}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

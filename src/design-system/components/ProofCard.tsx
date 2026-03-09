import { LucideIcon } from "lucide-react";
import { Card } from "@/design-system/components/Card";
import { cn } from "@/lib/utils";

interface ProofCardProps {
  icon?: LucideIcon;
  value: string;
  label: string;
  className?: string;
}

/**
 * ProofCard — Stat/trust signal card for credentials and metrics.
 * 
 * Usage:
 *   <ProofCard icon={Shield} value="$2M" label="CGL Coverage" />
 */
export const ProofCard = ({
  icon: Icon,
  value,
  label,
  className,
}: ProofCardProps) => {
  return (
    <Card variant="elevated" size="md" className={cn("text-center", className)}>
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      )}
      <p className="text-2xl md:text-3xl font-bold text-primary mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Card>
  );
};

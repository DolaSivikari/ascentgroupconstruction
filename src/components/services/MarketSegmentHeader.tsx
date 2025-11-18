import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketSegmentHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  serviceCount: number;
  segment: 'commercial' | 'residential' | 'both';
}

const getSegmentStyles = (segment: 'commercial' | 'residential' | 'both') => {
  switch (segment) {
    case 'commercial':
      return {
        bg: 'bg-primary/5',
        iconBg: 'bg-gradient-to-br from-primary/20 to-primary/10',
        iconText: 'text-primary',
        border: 'border-t-2 border-primary/20',
        badgeBg: 'bg-primary/10',
        badgeText: 'text-primary',
      };
    case 'residential':
      return {
        bg: 'bg-orange-500/5',
        iconBg: 'bg-gradient-to-br from-orange-500/20 to-orange-500/10',
        iconText: 'text-orange-500',
        border: 'border-t-2 border-orange-500/20',
        badgeBg: 'bg-orange-500/10',
        badgeText: 'text-orange-500',
      };
    case 'both':
      return {
        bg: 'bg-secondary/5',
        iconBg: 'bg-gradient-to-br from-secondary/20 to-secondary/10',
        iconText: 'text-secondary-foreground',
        border: 'border-t-2 border-secondary/20',
        badgeBg: 'bg-secondary/10',
        badgeText: 'text-secondary-foreground',
      };
  }
};

export const MarketSegmentHeader = ({
  title,
  description,
  icon: Icon,
  serviceCount,
  segment,
}: MarketSegmentHeaderProps) => {
  const styles = getSegmentStyles(segment);
  
  return (
    <div className={cn("py-12 mb-12 -mx-6 px-6", styles.bg, styles.border)}>
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className={cn(
          "w-20 h-20 mx-auto rounded-2xl flex items-center justify-center animate-fade-in",
          styles.iconBg
        )}>
          <Icon className={cn("w-10 h-10", styles.iconText)} />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
          styles.badgeBg,
          styles.badgeText
        )}>
          <span className="font-semibold">{serviceCount}</span>
          <span>Service{serviceCount !== 1 ? 's' : ''} Available</span>
        </div>
      </div>
    </div>
  );
};

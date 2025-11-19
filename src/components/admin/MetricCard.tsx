import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  badge?: number;
  onClick?: () => void;
}

const MetricCard = ({ title, value, icon: Icon, trend, badge, onClick }: MetricCardProps) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer group",
        "hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
        "transition-all duration-500 ease-out",
        "bg-gradient-to-br from-card via-card to-card/95",
        "border-border/50 hover:border-primary/30",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {title}
        </CardTitle>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Icon className="h-5 w-5 text-primary transition-all duration-300" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
              {value}
            </div>
            {trend && (
              <div className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                "transition-all duration-300 group-hover:scale-105",
                trend.isPositive 
                  ? 'bg-green-500/10 text-green-700 dark:text-green-400' 
                  : 'bg-red-500/10 text-red-700 dark:text-red-400'
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span className="font-semibold">{trend.value}</span>
              </div>
            )}
          </div>
          {badge && badge > 0 && (
            <Badge className="bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 animate-pulse hover:animate-none transition-all">
              <span className="font-semibold">{badge}</span> new
            </Badge>
          )}
        </div>
      </CardContent>
      
      {/* Decorative gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
};

export default MetricCard;

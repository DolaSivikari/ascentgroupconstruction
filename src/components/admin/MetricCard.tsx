import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-card border-border group"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-foreground">{value}</div>
            {trend && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{trend.isPositive ? '↗' : '↘'}</span>
                {trend.value}
              </p>
            )}
          </div>
          {badge && badge > 0 && (
            <Badge className="bg-secondary text-[hsl(var(--bg))] animate-pulse">
              {badge} new
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;

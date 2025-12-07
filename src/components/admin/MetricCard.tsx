import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
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
    <div 
      className={`business-glass-card relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      style={{ padding: '1.5rem' }}
    >
      <div className="flex flex-row items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: 'var(--business-text-secondary)' }}>{title}</span>
        <div className="flex items-center gap-2">
          {badge !== undefined && badge > 0 && (
            <Badge variant="danger" size="sm" className="animate-pulse">
              {badge} New
            </Badge>
          )}
          <div 
            className="p-2 rounded-lg transition-all duration-300"
            style={{ 
              background: 'hsl(var(--business-accent-orange) / 0.1)'
            }}
          >
            <Icon className="h-4 w-4" style={{ color: 'hsl(var(--business-accent-orange))' }} />
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div 
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--business-text-primary)' }}
          >
            {value}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs mt-1 ${
              trend.isPositive ? 'text-success' : ''
            }`} style={{ color: trend.isPositive ? undefined : 'var(--business-text-secondary)' }}>
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
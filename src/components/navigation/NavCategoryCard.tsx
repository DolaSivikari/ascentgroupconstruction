import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavCategoryCardProps {
  icon: LucideIcon;
  title: string;
  itemCount: number;
  gradient: string;
  iconColor: string;
  children: React.ReactNode;
}

export function NavCategoryCard({
  icon: Icon,
  title,
  itemCount,
  gradient,
  iconColor,
  children,
}: NavCategoryCardProps) {
  return (
    <div className="relative group">
      <div className={`absolute inset-0 ${gradient} opacity-10 rounded-[var(--radius-md)] blur-xl group-hover:opacity-20 transition-opacity duration-500`} />
      <div className="relative flex items-center gap-3 w-full">
        <div className={`flex-shrink-0 h-12 w-12 rounded-[var(--radius-sm)] ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="flex-1">
          {children}
        </div>
        <Badge 
          variant="secondary" 
          className="bg-background/80 backdrop-blur-sm text-xs font-semibold"
        >
          {itemCount}
        </Badge>
      </div>
    </div>
  );
}

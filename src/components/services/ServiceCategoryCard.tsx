import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type { ServiceCategory } from "./categoryMapping";

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  serviceCount: number;
  challengeTags: string[];
  onClick: () => void;
}

const categoryColorMap: Record<string, {
  bg: string;
  iconBg: string;
  iconColor: string;
  border: string;
}> = {
  primary: {
    bg: "bg-primary/10",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    border: "border-primary/30",
  },
  terracotta: {
    bg: "bg-terracotta/10",
    iconBg: "bg-terracotta/20",
    iconColor: "text-terracotta",
    border: "border-terracotta/30",
  },
  sage: {
    bg: "bg-sage/10",
    iconBg: "bg-sage/20",
    iconColor: "text-sage",
    border: "border-sage/30",
  }
};

export const ServiceCategoryCard = ({
  category,
  serviceCount,
  challengeTags,
  onClick,
}: ServiceCategoryCardProps) => {
  const CategoryIcon = category.icon;
  const colors = categoryColorMap[category.color] || categoryColorMap.primary;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative bg-card rounded-2xl p-8 cursor-pointer overflow-hidden",
        "hover:-translate-y-3 border-2 transition-all duration-500",
        "border-border hover:border-primary/30 hover:shadow-[0_20px_60px_-15px_rgba(var(--primary),0.2)]",
        "text-left w-full animate-fade-in h-full"
      )}
    >
      {/* Gradient glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Icon with magnetic effect */}
      <div className={cn(
        "relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500",
        "bg-gradient-to-br shadow-lg mx-auto",
        colors.iconBg,
        "group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl"
      )}>
        <CategoryIcon className={cn("w-10 h-10", colors.iconColor)} />
      </div>
      
      {/* Category Name */}
      <h3 className="text-2xl font-bold text-foreground mb-3 text-center group-hover:text-primary transition-colors">
        {category.name}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-6 text-center line-clamp-2 min-h-[2.5rem]">
        {category.description}
      </p>
      
      {/* Service Count Badge */}
      <div className="flex items-center justify-center mb-4">
        <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold text-sm">
          {serviceCount} {serviceCount === 1 ? 'Service' : 'Services'}
        </span>
      </div>
      
      {/* Challenge Tags */}
      {challengeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-[2rem]">
          {challengeTags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* View All Button */}
      <div className="flex items-center justify-center gap-2 text-primary font-semibold text-base group-hover:gap-3 transition-all">
        View All Services
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};

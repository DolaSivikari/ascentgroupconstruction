import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  icon: LucideIcon;
  text: string;
  variant?: "orange" | "primary" | "accent";
  className?: string;
}

export const SectionBadge = ({ 
  icon: Icon, 
  text, 
  variant = "orange",
  className 
}: SectionBadgeProps) => {
  const variants = {
    orange: "bg-construction-orange/10 text-construction-orange border-construction-orange/20",
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-6 transition-all duration-300 hover:scale-105",
      variants[variant],
      className
    )}>
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </div>
  );
};

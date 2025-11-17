import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterChip {
  label: string;
  value: string;
  onRemove: () => void;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onClearAll?: () => void;
  className?: string;
}

export const FilterChips = ({ filters, onClearAll, className }: FilterChipsProps) => {
  if (filters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2 animate-fade-in", className)}>
      <span className="text-sm text-muted-foreground font-medium">Active filters:</span>
      
      {filters.map((filter, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="gap-2 px-3 py-1.5 animate-scale-in hover:bg-secondary/80 transition-colors"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <span>{filter.label}: {filter.value}</span>
          <button
            onClick={filter.onRemove}
            className="ml-1 rounded-full hover:bg-background/20 p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      {onClearAll && filters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 px-2 text-xs"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};

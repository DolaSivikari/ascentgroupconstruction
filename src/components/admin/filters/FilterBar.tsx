import { ReactNode } from "react";
import { FilterX } from "lucide-react";
import { Button } from "@/ui/Button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FilterBarProps {
  children: ReactNode;
  onClearAll?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export const FilterBar = ({ children, onClearAll, hasActiveFilters, className }: FilterBarProps) => {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 flex items-center gap-3 flex-wrap min-w-0">
          {children}
        </div>
        {hasActiveFilters && onClearAll && (
          <>
            <Separator orientation="vertical" className="h-8" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="shrink-0"
            >
              <FilterX className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

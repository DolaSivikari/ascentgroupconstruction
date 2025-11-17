import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface MultiSelectFilterProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
  className?: string;
}

export const MultiSelectFilter = ({ options, selected, onChange, label, className }: MultiSelectFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange(options.map((opt) => opt.value));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("justify-between min-w-[180px]", className)}>
          <span className="truncate">
            {label}
            {selected.length > 0 && (
              <Badge variant="secondary" className="ml-2 px-1.5 py-0">
                {selected.length}
              </Badge>
            )}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <div className="flex gap-2 p-2 border-b">
          <Button variant="ghost" size="sm" onClick={selectAll} className="flex-1 h-8">
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll} className="flex-1 h-8">
            Clear
          </Button>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <DropdownMenuItem
                key={option.value}
                className="flex items-center gap-2 cursor-pointer multi-select-item"
                onSelect={(e) => {
                  e.preventDefault();
                  toggleOption(option.value);
                }}
              >
                <div
                  className={cn(
                    "h-4 w-4 border rounded flex items-center justify-center",
                    isSelected ? "bg-primary border-primary" : "border-input"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                <span className="flex-1">{option.label}</span>
                {option.count !== undefined && (
                  <Badge variant="outline" className="ml-auto">
                    {option.count}
                  </Badge>
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

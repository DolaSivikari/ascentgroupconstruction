import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
}

const filterOptions = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Industrial", value: "industrial" },
];

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  activeFilters,
  onFilterToggle,
}: SearchBarProps) => {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-12 h-14 text-base border-2 focus-visible:ring-primary"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => onSearchChange("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground mr-2">Quick Filters:</span>
        {filterOptions.map((filter) => (
          <Badge
            key={filter.value}
            variant={activeFilters.includes(filter.value) ? "default" : "outline"}
            className="cursor-pointer px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => onFilterToggle(filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => activeFilters.forEach(onFilterToggle)}
            className="text-xs"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

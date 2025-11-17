import { FilterBar } from "./FilterBar";
import { SearchInput } from "./SearchInput";
import { DateRangePicker } from "./DateRangePicker";
import { MultiSelectFilter, FilterOption } from "./MultiSelectFilter";
import { TagFilter } from "./TagFilter";
import { useTableFilters } from "@/hooks/useTableFilters";

// Example usage component showing how to use all filter components together
export const AdvancedFilterExample = () => {
  const { filters, updateFilter, clearFilters, hasActiveFilters } = useTableFilters();

  // Example status options
  const statusOptions: FilterOption[] = [
    { label: "New", value: "new", count: 12 },
    { label: "In Progress", value: "in_progress", count: 8 },
    { label: "Completed", value: "completed", count: 45 },
    { label: "Archived", value: "archived", count: 23 },
  ];

  // Example tags
  const availableTags = ["urgent", "follow-up", "important", "review", "approved"];

  return (
    <div className="space-y-4">
      <FilterBar onClearAll={clearFilters} hasActiveFilters={hasActiveFilters}>
        <SearchInput
          value={filters.search}
          onChange={(value) => updateFilter("search", value)}
          placeholder="Search by name, email, or company..."
          className="min-w-[300px]"
        />
        
        <DateRangePicker
          value={filters.dateRange}
          onChange={(range) => updateFilter("dateRange", range)}
          placeholder="Filter by date"
        />
        
        <MultiSelectFilter
          options={statusOptions}
          selected={filters.status}
          onChange={(selected) => updateFilter("status", selected)}
          label="Status"
        />
      </FilterBar>

      {availableTags.length > 0 && (
        <TagFilter
          tags={availableTags}
          selectedTags={filters.tags}
          onChange={(tags) => updateFilter("tags", tags)}
        />
      )}
    </div>
  );
};

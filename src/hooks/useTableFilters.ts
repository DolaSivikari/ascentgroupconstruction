import { useState, useMemo, useCallback } from "react";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface TableFilters {
  search: string;
  dateRange: DateRange;
  status: string[];
  tags: string[];
  customFilters: Record<string, any>;
}

const initialFilters: TableFilters = {
  search: "",
  dateRange: { from: undefined, to: undefined },
  status: [],
  tags: [],
  customFilters: {},
};

export const useTableFilters = () => {
  const [filters, setFilters] = useState<TableFilters>(initialFilters);

  const updateFilter = useCallback(<K extends keyof TableFilters>(
    key: K,
    value: TableFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateCustomFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      customFilters: { ...prev.customFilters, [key]: value },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.dateRange.from !== undefined ||
      filters.dateRange.to !== undefined ||
      filters.status.length > 0 ||
      filters.tags.length > 0 ||
      Object.keys(filters.customFilters).some(
        (key) => filters.customFilters[key] !== undefined && filters.customFilters[key] !== ""
      )
    );
  }, [filters]);

  // Filter function that can be used with array.filter()
  const applyFilters = useCallback(<T extends Record<string, any>>(
    data: T[],
    searchFields: (keyof T)[],
    dateField?: keyof T,
    statusField?: keyof T,
    tagsField?: keyof T
  ): T[] => {
    return data.filter((item) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = searchFields.some((field) => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchLower);
        });
        if (!matchesSearch) return false;
      }

      // Date range filter
      if (dateField && (filters.dateRange.from || filters.dateRange.to)) {
        const itemDate = new Date(item[dateField] as string);
        if (filters.dateRange.from && itemDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && itemDate > filters.dateRange.to) return false;
      }

      // Status filter
      if (statusField && filters.status.length > 0) {
        const itemStatus = item[statusField];
        if (!filters.status.includes(String(itemStatus))) return false;
      }

      // Tags filter
      if (tagsField && filters.tags.length > 0) {
        const itemTags = item[tagsField];
        if (!Array.isArray(itemTags)) return false;
        const hasMatchingTag = filters.tags.some((tag) => itemTags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [filters]);

  return {
    filters,
    updateFilter,
    updateCustomFilter,
    clearFilters,
    hasActiveFilters,
    applyFilters,
  };
};

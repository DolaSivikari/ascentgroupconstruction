import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TableFilters, DateRange } from './useTableFilters';

export const useUrlFilters = (
  filters: TableFilters,
  updateFilter: (key: keyof TableFilters, value: any) => void
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Load filters from URL on mount
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const status = searchParams.get('status');
    const tags = searchParams.get('tags');

    if (search) updateFilter('search', search);
    
    if (fromDate || toDate) {
      updateFilter('dateRange', {
        from: fromDate ? new Date(fromDate) : undefined,
        to: toDate ? new Date(toDate) : undefined,
      });
    }

    if (status) {
      updateFilter('status', status.split(','));
    }

    if (tags) {
      updateFilter('tags', tags.split(','));
    }
  }, []); // Only run once on mount

  // Sync filters to URL
  const syncToUrl = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.search) {
      params.set('search', filters.search);
    }

    if (filters.dateRange.from) {
      params.set('from', filters.dateRange.from.toISOString());
    }

    if (filters.dateRange.to) {
      params.set('to', filters.dateRange.to.toISOString());
    }

    if (filters.status.length > 0) {
      params.set('status', filters.status.join(','));
    }

    if (filters.tags.length > 0) {
      params.set('tags', filters.tags.join(','));
    }

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Sync to URL whenever filters change
  useEffect(() => {
    syncToUrl();
  }, [syncToUrl]);

  return { syncToUrl };
};

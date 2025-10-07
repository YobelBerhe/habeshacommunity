import { useEffect } from 'react';

export function useFilterAnalytics(filters: Record<string, any>) {
  useEffect(() => {
    // Track filter changes
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => ({ key, value }));

    if (activeFilters.length > 0) {
      console.log('Filter Analytics:', {
        timestamp: new Date().toISOString(),
        filters: activeFilters,
        count: activeFilters.length,
      });

      // Here you could send to analytics service
      // analytics.track('filters_applied', { filters: activeFilters });
    }
  }, [filters]);
}

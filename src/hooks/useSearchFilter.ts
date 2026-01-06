import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
}

export interface UseSearchFilterOptions<T> {
  data: T[] | undefined;
  searchFields: (keyof T | string)[];
  filters?: FilterConfig[];
  persistInUrl?: boolean;
}

export interface UseSearchFilterResult<T> {
  filteredData: T[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilters: Record<string, string | string[]>;
  setFilter: (key: string, value: string | string[]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

export function useSearchFilter<T extends Record<string, any>>({
  data,
  searchFields,
  filters = [],
  persistInUrl = false,
}: UseSearchFilterOptions<T>): UseSearchFilterResult<T> {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQueryState] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({});
  const [initialized, setInitialized] = useState(false);

  // Initialize state from URL if persistence enabled (only once)
  useEffect(() => {
    if (initialized) return;
    
    if (persistInUrl) {
      const urlSearch = searchParams.get('q') || '';
      setSearchQueryState(urlSearch);
      
      const urlFilters: Record<string, string | string[]> = {};
      filters.forEach(filter => {
        const value = searchParams.get(filter.key);
        if (value) {
          urlFilters[filter.key] = filter.multiple ? value.split(',') : value;
        }
      });
      setActiveFilters(urlFilters);
    }
    
    setInitialized(true);
  }, [persistInUrl, searchParams, filters, initialized]);

  const updateUrl = useCallback((search: string, filtersState: Record<string, string | string[]>) => {
    if (!persistInUrl) return;
    
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    
    Object.entries(filtersState).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : value !== 'all')) {
        params.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });
    
    setSearchParams(params, { replace: true });
  }, [persistInUrl, setSearchParams]);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
    updateUrl(query, activeFilters);
  }, [activeFilters, updateUrl]);

  const setFilter = useCallback((key: string, value: string | string[]) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      updateUrl(searchQuery, newFilters);
      return newFilters;
    });
  }, [searchQuery, updateUrl]);

  const clearFilters = useCallback(() => {
    setSearchQueryState('');
    setActiveFilters({});
    if (persistInUrl) {
      setSearchParams({}, { replace: true });
    }
  }, [persistInUrl, setSearchParams]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    let result = [...data];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = getNestedValue(item, field as string);
          if (value == null) return false;
          return String(value).toLowerCase().includes(query);
        });
      });
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value || value === 'all' || (Array.isArray(value) && value.length === 0)) return;
      
      result = result.filter(item => {
        const itemValue = getNestedValue(item, key);
        if (Array.isArray(value)) {
          return value.includes(String(itemValue));
        }
        return String(itemValue) === value;
      });
    });

    return result;
  }, [data, searchQuery, searchFields, activeFilters]);

  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== '' || 
      Object.values(activeFilters).some(v => 
        v && v !== 'all' && (Array.isArray(v) ? v.length > 0 : true)
      );
  }, [searchQuery, activeFilters]);

  return {
    filteredData,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface FilterConfig<T> {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  validate?: (value: T) => boolean;
}

export function useAdvancedFilters<T extends Record<string, any>>(
  configs: FilterConfig<any>[],
  options: {
    persistToUrl?: boolean;
    persistToStorage?: boolean;
    storageKey?: string;
  } = {}
) {
  const {
    persistToUrl = true,
    persistToStorage = true,
    storageKey = 'filters',
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL or storage
  const initializeFilters = (): T => {
    const filters: any = {};
    
    for (const config of configs) {
      let value = config.defaultValue;
      
      // Try URL first
      if (persistToUrl) {
        const urlValue = searchParams.get(config.key);
        if (urlValue) {
          value = config.deserialize 
            ? config.deserialize(urlValue)
            : urlValue;
        }
      }
      
      // Try storage if not in URL
      if (persistToStorage && value === config.defaultValue) {
        try {
          const stored = localStorage.getItem(`${storageKey}.${config.key}`);
          if (stored) {
            value = JSON.parse(stored);
          }
        } catch (error) {
          console.warn(`Failed to load filter ${config.key}:`, error);
        }
      }
      
      // Validate
      if (config.validate && !config.validate(value)) {
        value = config.defaultValue;
      }
      
      filters[config.key] = value;
    }
    
    return filters as T;
  };

  const [filters, setFilters] = useState<T>(initializeFilters);

  // Sync to URL
  useEffect(() => {
    if (!persistToUrl) return;

    const params = new URLSearchParams();
    
    for (const config of configs) {
      const value = filters[config.key];
      if (value !== config.defaultValue && value !== undefined && value !== null && value !== '') {
        const serialized = config.serialize 
          ? config.serialize(value)
          : String(value);
        params.set(config.key, serialized);
      }
    }
    
    setSearchParams(params, { replace: true });
  }, [filters, persistToUrl, configs, setSearchParams]);

  // Sync to storage
  useEffect(() => {
    if (!persistToStorage) return;

    for (const config of configs) {
      const value = filters[config.key];
      try {
        localStorage.setItem(
          `${storageKey}.${config.key}`,
          JSON.stringify(value)
        );
      } catch (error) {
        console.warn(`Failed to save filter ${config.key}:`, error);
      }
    }
  }, [filters, persistToStorage, storageKey, configs]);

  const updateFilter = useCallback(<K extends keyof T>(
    key: K,
    value: T[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((updates: Partial<T>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    const defaults: any = {};
    for (const config of configs) {
      defaults[config.key] = config.defaultValue;
    }
    setFilters(defaults as T);
  }, [configs]);

  const hasActiveFilters = useCallback(() => {
    return configs.some(config => 
      filters[config.key] !== config.defaultValue && 
      filters[config.key] !== undefined && 
      filters[config.key] !== null &&
      filters[config.key] !== ''
    );
  }, [filters, configs]);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    hasActiveFilters,
  };
}

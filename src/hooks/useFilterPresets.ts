import { useState, useEffect } from 'react';

interface FilterPreset<T> {
  id: string;
  name: string;
  filters: T;
  isDefault?: boolean;
}

export function useFilterPresets<T>(storageKey: string) {
  const [presets, setPresets] = useState<FilterPreset<T>[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(presets));
  }, [presets, storageKey]);

  const savePreset = (name: string, filters: T, isDefault = false) => {
    const preset: FilterPreset<T> = {
      id: `preset-${Date.now()}`,
      name,
      filters,
      isDefault,
    };
    
    setPresets(prev => {
      // Remove default flag from others if this is default
      const updated = isDefault 
        ? prev.map(p => ({ ...p, isDefault: false }))
        : prev;
      return [...updated, preset];
    });
  };

  const deletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  };

  const applyPreset = (id: string): T | null => {
    const preset = presets.find(p => p.id === id);
    return preset ? preset.filters : null;
  };

  const getDefaultPreset = (): FilterPreset<T> | null => {
    return presets.find(p => p.isDefault) || null;
  };

  return {
    presets,
    savePreset,
    deletePreset,
    applyPreset,
    getDefaultPreset,
  };
}

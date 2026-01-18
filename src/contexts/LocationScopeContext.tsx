import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

// Types
export type ScopeMode = 'global' | 'country' | 'region';

export type ScopeSelection =
  | { mode: 'global' }
  | { mode: 'country'; countryCode: string; countryName: string }
  | { mode: 'region'; countryCode: string; countryName: string; regionName: string };

export type CountryItem = { 
  code: string; 
  name: string; 
  children?: string[];
};

// Helper to convert ISO to emoji flag
export function isoToFlag(iso2: string): string {
  if (iso2 === 'GLOBAL') return '🌍';
  const code = iso2.toUpperCase();
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)));
}

// Country data - sorted alphabetically
export const ALL_COUNTRIES: CountryItem[] = [
  { code: 'GLOBAL', name: 'Global' },
  { code: 'AU', name: 'Australia', children: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'] },
  { code: 'CA', name: 'Canada', children: ['Toronto', 'Vancouver', 'Calgary', 'Montreal', 'Ottawa'] },
  { code: 'DE', name: 'Germany', children: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'] },
  { code: 'ER', name: 'Eritrea', children: ['Asmara', 'Keren', 'Massawa', 'Assab'] },
  { code: 'ET', name: 'Ethiopia', children: ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Bahir Dar'] },
  { code: 'IL', name: 'Israel', children: ['Tel Aviv', 'Jerusalem', 'Haifa'] },
  { code: 'IT', name: 'Italy', children: ['Rome', 'Milan', 'Naples', 'Turin'] },
  { code: 'KE', name: 'Kenya', children: ['Nairobi', 'Mombasa', 'Kisumu'] },
  { code: 'NL', name: 'Netherlands', children: ['Amsterdam', 'Rotterdam', 'The Hague'] },
  { code: 'NO', name: 'Norway', children: ['Oslo', 'Bergen', 'Trondheim'] },
  { code: 'SA', name: 'Saudi Arabia', children: ['Riyadh', 'Jeddah', 'Dammam'] },
  { code: 'SD', name: 'Sudan', children: ['Khartoum', 'Omdurman', 'Port Sudan'] },
  { code: 'SE', name: 'Sweden', children: ['Stockholm', 'Gothenburg', 'Malmö'] },
  { code: 'AE', name: 'UAE', children: ['Dubai', 'Abu Dhabi', 'Sharjah'] },
  { code: 'GB', name: 'United Kingdom', children: ['London', 'Manchester', 'Birmingham', 'Leeds'] },
  { code: 'US', name: 'United States', children: ['California', 'Texas', 'Washington', 'New York', 'Virginia', 'Maryland', 'Georgia', 'Minnesota'] },
].sort((a, b) => {
  if (a.code === 'GLOBAL') return -1;
  if (b.code === 'GLOBAL') return 1;
  return a.name.localeCompare(b.name);
});

// Context
interface LocationScopeContextType {
  selection: ScopeSelection;
  setSelection: (selection: ScopeSelection) => void;
  bannerLabel: string;
  selectedCountry: CountryItem | null;
}

const LocationScopeContext = createContext<LocationScopeContextType | undefined>(undefined);

export function LocationScopeProvider({ children }: { children: ReactNode }) {
  const [selection, setSelectionState] = useState<ScopeSelection>(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('hc_scope');
      return raw ? JSON.parse(raw) : { mode: 'global' };
    }
    return { mode: 'global' };
  });

  useEffect(() => {
    localStorage.setItem('hc_scope', JSON.stringify(selection));
  }, [selection]);

  const setSelection = (newSelection: ScopeSelection) => {
    setSelectionState(newSelection);
  };

  const bannerLabel = useMemo(() => {
    if (selection.mode === 'global') return '🌍 Global';
    const flag = isoToFlag(selection.countryCode);
    if (selection.mode === 'country') return `${flag} ${selection.countryName}`;
    return `${flag} ${selection.countryName} — 📍 ${selection.regionName}`;
  }, [selection]);

  const selectedCountry = useMemo(() => {
    if (selection.mode === 'global') return null;
    return ALL_COUNTRIES.find((c) => c.code === selection.countryCode) ?? null;
  }, [selection]);

  return (
    <LocationScopeContext.Provider value={{ selection, setSelection, bannerLabel, selectedCountry }}>
      {children}
    </LocationScopeContext.Provider>
  );
}

export function useLocationScope() {
  const context = useContext(LocationScopeContext);
  if (!context) {
    throw new Error('useLocationScope must be used within a LocationScopeProvider');
  }
  return context;
}

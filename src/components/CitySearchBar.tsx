import { useNavigate } from "react-router-dom";
import { Autocomplete } from '@/components/Autocomplete';
import { useSmartSearch } from '@/hooks/useSmartSearch';
import { useCitySearch } from '@/hooks/useCitySearch';
import { MapPin } from 'lucide-react';

interface CitySearchBarProps {
  value?: string;
  onCitySelect?: (city: string, lat?: number, lon?: number) => void;
  placeholder?: string;
  className?: string;
  disableNavigation?: boolean;
}

export default function CitySearchBar({ 
  value, 
  onCitySelect, 
  placeholder = "City (e.g. Asmara, Oakland, Frankfurt)",
  className = "",
  disableNavigation = false
}: CitySearchBarProps) {
  const navigate = useNavigate();
  const { searchCities } = useCitySearch();
  const { query, setQuery, results, isSearching } = useSmartSearch({
    searchFn: searchCities,
    minQueryLength: 1,
    debounceMs: 300,
  });

  const handleSelect = (city: any) => {
    if (onCitySelect) {
      onCitySelect(city.name, city.lat, city.lng);
      return;
    }
    
    if (!disableNavigation) {
      navigate(`/browse?city=${encodeURIComponent(city.name)}`);
    }
  };

  return (
    <div className={className}>
      <Autocomplete
        value={query || value || ''}
        onChange={setQuery}
        onSelect={handleSelect}
        suggestions={results}
        isLoading={isSearching}
        placeholder={placeholder}
        displayValue={(city) => city.name}
        renderItem={(city) => (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{city.name}</div>
              <div className="text-xs text-muted-foreground">{city.country}</div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
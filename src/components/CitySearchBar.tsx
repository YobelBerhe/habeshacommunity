import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

type City = { name: string; country: string; lat: string; lon: string };

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
  const [q, setQ] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<City[]>([]);
  const [locked, setLocked] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => setQ(value ?? ""), [value]);

  useEffect(() => {
    const off = (e: MouseEvent) => { 
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false); 
    };
    document.addEventListener("click", off); 
    return () => document.removeEventListener("click", off);
  }, []);

  useEffect(() => {
    if (q.trim().length < 2 || locked) { 
      setItems([]);
      setOpen(false);
      return; 
    }
    
    const t = setTimeout(async () => {
      try {
        // Remove accept-language to allow multilingual search (including Tigrinya)
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, { 
          headers: { 
            "Accept": "application/json",
            "User-Agent": "HabeshaNetwork/1.0" // Nominatim requires user agent
          }
        });
        
        if (!res.ok) {
          console.error('Nominatim API error:', res.status);
          setItems([]);
          setOpen(false);
          return;
        }
        
        const data = await res.json();
        const list = (data as any[]).map(x => {
          const a = x.address || {};
          const name = a.city || a.town || a.village || a.municipality || a.state_district || a.state || x.display_name.split(",")[0];
          const country = a.country || "";
          return { name, country, lat: x.lat, lon: x.lon };
        }).filter(Boolean);
        
        setItems(list); 
        if (list.length > 0 && !locked) setOpen(true);
        else setOpen(false);
      } catch (error) {
        console.error('City search error:', error);
        setItems([]);
        setOpen(false);
      }
    }, 300); 
    
    return () => clearTimeout(t);
  }, [q, locked]);

  const handleSelect = (city: City) => {
    const cityName = city.name;
    setLocked(true);
    const sel = `${cityName}, ${city.country}`;
    setSelectedValue(sel);
    setQ(sel);
    setItems([]); // Clear items immediately
    setOpen(false);
    
    // Call selection handler if provided
    if (onCitySelect) {
      onCitySelect(cityName, parseFloat(city.lat), parseFloat(city.lon));
      // Don't navigate if onCitySelect is provided or navigation is disabled
      return;
    }
    
    // Navigate to browse page with city only if navigation is not disabled
    if (!disableNavigation) {
      navigate(`/browse?city=${encodeURIComponent(cityName)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      const cityName = q.trim();
      
      // Call selection handler if provided
      if (onCitySelect) {
        onCitySelect(cityName);
        setOpen(false);
        // Don't navigate if onCitySelect is provided or navigation is disabled
        return;
      }
      
      // Navigate to browse page with city only if navigation is not disabled
      if (!disableNavigation) {
        navigate(`/browse?city=${encodeURIComponent(cityName)}`);
      }
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          className="field w-full pr-10"
          placeholder={placeholder}
          value={q}
          onChange={e => { const v = e.target.value; setQ(v); if (locked && v !== selectedValue) setLocked(false); }}
          onFocus={() => items.length > 0 && q.trim().length >= 2 && !locked && setOpen(true)}
          autoComplete="off"
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
      
      {open && items.length > 0 && !locked && (
        <div className="absolute left-0 right-0 top-[46px] z-[9999] max-h-72 overflow-auto bg-background border rounded-xl shadow-2xl">
          {items.map((c, i) => (
            <div 
              key={i}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onMouseDown={() => handleSelect(c)}
            >
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
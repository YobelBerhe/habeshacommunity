import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

type City = { name: string; country: string; lat: string; lon: string };

interface CitySearchBarProps {
  value?: string;
  onCitySelect?: (city: string, lat?: number, lon?: number) => void;
  placeholder?: string;
  className?: string;
}

export default function CitySearchBar({ 
  value, 
  onCitySelect, 
  placeholder = "City (e.g. Asmara, Oakland, Frankfurt)",
  className = ""
}: CitySearchBarProps) {
  const [q, setQ] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<City[]>([]);
  const [justSelected, setJustSelected] = useState(false);
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
    if (q.trim().length < 2 || justSelected) { 
      setItems([]);
      setOpen(false);
      if (justSelected) setJustSelected(false);
      return; 
    }
    
    const t = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&accept-language=en&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, { headers: { "Accept": "application/json" }});
        const data = await res.json();
        const list = (data as any[]).map(x => {
          const a = x.address || {};
          const name = a.city || a.town || a.village || a.municipality || a.state_district || a.state || x.display_name.split(",")[0];
          const country = a.country || "";
          return { name, country, lat: x.lat, lon: x.lon };
        }).filter(Boolean);
        setItems(list); 
        if (list.length > 0 && !justSelected) setOpen(true);
      } catch (error) {
        // Allow manual city entry as fallback
        setItems([{ name: q, country: "Manual Entry", lat: "0", lon: "0" }]);
        if (!justSelected) setOpen(true);
      }
    }, 200); 
    
    return () => clearTimeout(t);
  }, [q, justSelected]);

  const handleSelect = (city: City) => {
    const cityName = city.name;
    setJustSelected(true);
    setQ(`${cityName}, ${city.country}`);
    setItems([]); // Clear items immediately
    setOpen(false);
    
    // Call selection handler if provided
    if (onCitySelect) {
      onCitySelect(cityName, parseFloat(city.lat), parseFloat(city.lon));
    }
    
    // Always navigate to browse page with city
    navigate(`/browse?city=${encodeURIComponent(cityName)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      const cityName = q.trim();
      
      // Call selection handler if provided
      if (onCitySelect) {
        onCitySelect(cityName);
      }
      
      // Always navigate to browse page with city
      navigate(`/browse?city=${encodeURIComponent(cityName)}`);
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
          onChange={e => setQ(e.target.value)}
          onFocus={() => items.length > 0 && q.trim().length >= 2 && !justSelected && setOpen(true)}
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
      
      {open && items.length > 0 && !justSelected && (
        <div className="absolute left-0 right-0 top-[46px] z-[9999] max-h-72 overflow-auto bg-background border rounded-xl shadow-2xl">
          {items.map((c, i) => (
            <div 
              key={i}
              className="px-3 py-2 cursor-pointer hover:bg-muted"
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
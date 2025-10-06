interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export function useCitySearch() {
  const searchCities = async (query: string): Promise<City[]> => {
    if (!query || query.length < 2) return [];

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&accept-language=en&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { 
        headers: { "Accept": "application/json" }
      });
      
      const data = await res.json();
      
      const cities = (data as any[]).map(x => {
        const a = x.address || {};
        const name = a.city || a.town || a.village || a.municipality || a.state_district || a.state || x.display_name.split(",")[0];
        const country = a.country || "";
        return { 
          name, 
          country, 
          lat: parseFloat(x.lat), 
          lng: parseFloat(x.lon) 
        };
      }).filter(city => city.name && city.country);
      
      return cities;
    } catch (error) {
      console.error('City search error:', error);
      return [];
    }
  };

  return { searchCities };
}

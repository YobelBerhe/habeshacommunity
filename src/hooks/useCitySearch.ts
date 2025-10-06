import { useState } from 'react';

interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export function useCitySearch() {
  const [cities] = useState<City[]>([
    { name: 'Asmara', country: 'Eritrea', lat: 15.3229, lng: 38.9251 },
    { name: 'Addis Ababa', country: 'Ethiopia', lat: 9.0320, lng: 38.7469 },
    { name: 'Oakland', country: 'USA', lat: 37.8044, lng: -122.2712 },
    { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
    { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 },
    { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
    { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
    { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437 },
    { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
    { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
  ]);

  const searchCities = async (query: string): Promise<City[]> => {
    const lowerQuery = query.toLowerCase();
    return cities.filter(city => 
      city.name.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
    ).slice(0, 8);
  };

  return { searchCities };
}

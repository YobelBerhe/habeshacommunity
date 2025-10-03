import { supabase } from '@/integrations/supabase/client';

export interface PresenceData {
  total: number;
  cities: Array<{
    city: string;
    count: number;
    lat?: number;
    lng?: number;
  }>;
}

// Cache for geocoded cities
const cityGeocodeCache = new Map<string, { lat: number; lng: number }>();

// Load cache from localStorage
const loadGeoCache = () => {
  try {
    const cached = localStorage.getItem('cityGeocodeCache');
    if (cached) {
      const data = JSON.parse(cached);
      Object.entries(data).forEach(([city, coords]) => {
        cityGeocodeCache.set(city, coords as { lat: number; lng: number });
      });
    }
  } catch (error) {
    console.error('Failed to load geocode cache:', error);
  }
};

// Save cache to localStorage
const saveGeoCache = () => {
  try {
    const data: Record<string, { lat: number; lng: number }> = {};
    cityGeocodeCache.forEach((coords, city) => {
      data[city] = coords;
    });
    localStorage.setItem('cityGeocodeCache', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save geocode cache:', error);
  }
};

// Geocode a city using Nominatim
const geocodeCity = async (cityName: string): Promise<{ lat: number; lng: number } | null> => {
  if (cityGeocodeCache.has(cityName)) {
    return cityGeocodeCache.get(cityName)!;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(cityName)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      
      cityGeocodeCache.set(cityName, coords);
      saveGeoCache();
      return coords;
    }
  } catch (error) {
    console.error(`Failed to geocode city ${cityName}:`, error);
  }
  
  return null;
};

// Touch presence for current user
export const touchPresence = async (city?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let userCity = city;
    
    // If no city provided, try to get from profile
    if (!userCity) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('city')
        .eq('id', user.id)
        .single();
      
      userCity = profile?.city;
    }

    if (userCity) {
      // await supabase.rpc('touch_presence', { p_city: userCity });
    }
  } catch (error) {
    console.error('Failed to touch presence:', error);
  }
};

// Get live presence data
export const getLivePresence = async (): Promise<PresenceData> => {
  try {
    // const { data, error } = await supabase
    //   .from('presence')
    //   .select('city')
    //   .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

    // if (error) throw error;
    const data: any[] = [];

    // Group by city
    const cityCount = new Map<string, number>();
    data?.forEach((row: any) => {
      if (row.city) {
        cityCount.set(row.city, (cityCount.get(row.city) || 0) + 1);
      }
    });

    // Geocode cities and prepare result
    const cities = await Promise.all(
      Array.from(cityCount.entries()).map(async ([city, count]) => {
        const coords = await geocodeCity(city);
        return {
          city,
          count,
          lat: coords?.lat,
          lng: coords?.lng
        };
      })
    );

    return {
      total: data?.length || 0,
      cities: cities.filter(c => c.lat && c.lng) // Only include geocoded cities
    };
  } catch (error) {
    console.error('Failed to get live presence:', error);
    return { total: 0, cities: [] };
  }
};

// Initialize presence system
export const initPresence = () => {
  loadGeoCache();
  
  // Touch presence on init
  touchPresence();
  
  // Touch presence every 45 seconds while tab is active
  const interval = setInterval(() => {
    if (!document.hidden) {
      touchPresence();
    }
  }, 45000);
  
  // Touch presence when tab becomes visible
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      touchPresence();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    clearInterval(interval);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};
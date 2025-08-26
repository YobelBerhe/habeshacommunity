import { Listing, User } from "@/types";

// Local storage keys
const STORAGE_KEYS = {
  CITY: "habesha_network_city",
  CITY_LAT: "habesha_network_city_lat", 
  CITY_LON: "habesha_network_city_lon",
  CATEGORY: "habesha_network_category",
  VIEW_MODE: "habesha_network_view_mode",
  LANGUAGE: "habesha_network_language",
  USER: "habesha_network_user",
  FAVORITES: "habesha_network_favorites",
};

// City-specific listings storage
const getPostsKey = (city: string) => `habesha_network_posts_${city.toLowerCase().replace(/\s+/g, '_')}`;

// Listings management
export const getListings = (city: string): Listing[] => {
  try {
    const stored = localStorage.getItem(getPostsKey(city));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading listings:", error);
    return [];
  }
};

export const saveListings = (city: string, listings: Listing[]): void => {
  try {
    localStorage.setItem(getPostsKey(city), JSON.stringify(listings));
  } catch (error) {
    console.error("Error saving listings:", error);
  }
};

export const addListing = (city: string, listing: Listing): void => {
  const listings = getListings(city);
  listings.unshift(listing); // Add to beginning for newest first
  saveListings(city, listings);
};

export const updateListing = (city: string, listingId: string, updates: Partial<Listing>): boolean => {
  const listings = getListings(city);
  const index = listings.findIndex(l => l.id === listingId);
  if (index === -1) return false;
  
  listings[index] = { ...listings[index], ...updates };
  saveListings(city, listings);
  return true;
};

export const deleteListing = (city: string, listingId: string): boolean => {
  const listings = getListings(city);
  const filtered = listings.filter(l => l.id !== listingId);
  if (filtered.length === listings.length) return false;
  
  saveListings(city, filtered);
  return true;
};

// User management
export const getUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading user:", error);
    return null;
  }
};

export const saveUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

export const clearUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Favorites management
export const getFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
};

export const saveFavorites = (favorites: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
};

export const addFavorite = (listingId: string): void => {
  const favorites = getFavorites();
  if (!favorites.includes(listingId)) {
    favorites.push(listingId);
    saveFavorites(favorites);
  }
};

export const removeFavorite = (listingId: string): void => {
  const favorites = getFavorites();
  const filtered = favorites.filter(id => id !== listingId);
  saveFavorites(filtered);
};

export const toggleFavorite = (listingId: string): boolean => {
  const favorites = getFavorites();
  const isFavorited = favorites.includes(listingId);
  
  if (isFavorited) {
    removeFavorite(listingId);
  } else {
    addFavorite(listingId);
  }
  
  return !isFavorited;
};

// App state management
export const getAppState = () => ({
  city: localStorage.getItem(STORAGE_KEYS.CITY) || "Addis Ababa",
  cityLat: localStorage.getItem(STORAGE_KEYS.CITY_LAT) || null,
  cityLon: localStorage.getItem(STORAGE_KEYS.CITY_LON) || null,
  category: localStorage.getItem(STORAGE_KEYS.CATEGORY) || "",
  viewMode: (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as "grid" | "map") || "grid",
  language: localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "en",
});

export const saveAppState = (state: Partial<ReturnType<typeof getAppState>>): void => {
  if (state.city !== undefined) localStorage.setItem(STORAGE_KEYS.CITY, state.city);
  if (state.cityLat !== undefined) localStorage.setItem(STORAGE_KEYS.CITY_LAT, state.cityLat || "");
  if (state.cityLon !== undefined) localStorage.setItem(STORAGE_KEYS.CITY_LON, state.cityLon || "");
  if (state.category !== undefined) localStorage.setItem(STORAGE_KEYS.CATEGORY, state.category);
  if (state.viewMode !== undefined) localStorage.setItem(STORAGE_KEYS.VIEW_MODE, state.viewMode);
  if (state.language !== undefined) localStorage.setItem(STORAGE_KEYS.LANGUAGE, state.language);
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Demo data seeding
export const seedDemoData = (city: string): void => {
  const existing = getListings(city);
  if (existing.length > 0) return;

  const now = Date.now();
  const demoListings: Listing[] = [
    {
      id: generateId(),
      title: `Furnished Room in ${city}`,
      description: "Beautiful furnished room in a safe neighborhood. Wi-Fi included, close to public transport.",
      price: 350,
      category: "housing",
      contact: "WhatsApp: +251-900-000-123",
      images: [],
      tags: ["furnished", "wifi", "safe", "transport"],
      city,
      createdAt: now - 86400000, // 1 day ago
      featured: true,
    },
    {
      id: generateId(),
      title: `Used Toyota Corolla (${city})`,
      description: "2018 Toyota Corolla in excellent condition. Low mileage, well maintained.",
      price: 5200,
      category: "forsale",
      contact: "Call: +1-555-111-2222",
      images: [],
      tags: ["car", "toyota", "reliable"],
      city,
      createdAt: now - 7200000, // 2 hours ago
    },
    {
      id: generateId(),
      title: `Barista Position - Eritrean Café (${city})`,
      description: "Morning shift barista position at busy Eritrean café. Friendly team, training provided.",
      category: "jobs",
      jobSubcategory: "food_cafe_barista",
      contact: "Email: jobs@eritreancafe.com",
      images: [],
      tags: ["barista", "morning", "training"],
      city,
      createdAt: now - 3600000, // 1 hour ago
    },
    {
      id: generateId(),
      title: `Traditional Hair Braiding Services`,
      description: "Professional Ethiopian hair braiding services. All styles available, competitive prices.",
      price: 50,
      category: "services",
      contact: "Call/Text: +1-555-333-4444",
      images: [],
      tags: ["braids", "hair", "traditional", "ethiopian"],
      city,
      createdAt: now - 1800000, // 30 minutes ago
    }
  ];

  saveListings(city, demoListings);
};
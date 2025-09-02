import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
// Desktop components
import { DesktopHomeHero } from "@/components/desktop/DesktopHomeHero";
import { DesktopHeader } from "@/components/desktop/DesktopHeader";
import { StickyFooter } from "@/components/desktop/StickyFooter";
// Mobile components (existing)
import Header from "@/components/Header";
import MobileHeader from "@/components/layout/MobileHeader";
import FilterBar from "@/components/FilterBar";
import { FiltersBar } from "@/components/search/FiltersBar";
import { RecentCarousel } from "@/components/home/RecentCarousel";
import ListingGrid from "@/components/ListingGrid";
import PostModal from "@/components/PostModal";
import AccountModal from "@/components/AccountModal";
import LoginModal from "@/components/LoginModal";
import ListingDetailModal from "@/components/ListingDetailModal";
import AuthModal from "@/components/AuthModal";
import BootstrapAuth from "@/components/BootstrapAuth";
import CityIndex from "@/components/CityIndex";
import MapCluster from "@/components/MapCluster";
import SearchBox from "@/components/SearchBox";
import QuickFilters from "@/components/QuickFilters";
import LanguageToggle from "@/components/LanguageToggle";
import HomeDigest from "@/components/HomeDigest";
import DonationButton from "@/components/DonationButton";
import GlobalMap from "@/components/GlobalMap";
import StickyPostCTA from "@/components/StickyPostCTA";
import Footer from "@/components/Footer";
import { Globe } from "@/components/Globe";
import { getStarPoints } from "@/services/activeUsers";
import CitySearchBar from "@/components/CitySearchBar";
import { setParams, getParam } from "@/lib/url";
import { TAXONOMY, CategoryKey } from "@/lib/taxonomy";
import { t, Lang } from "@/lib/i18n";
import type { Listing, SearchFilters, AppState } from "@/types";
import { getAppState, saveAppState } from "@/utils/storage";
import { fetchListings, fetchListingById } from "@/repo/listings";
import { fetchListingsWithContacts } from "@/repo/listingsWithContacts";
import { getListingContact } from "@/repo/contacts";
import { onAuthChange, getUserId, signOut } from "@/repo/auth";
import { getContactValue, hasContactAccess } from "@/utils/contactHelpers";
import { toast } from "sonner";

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const [appState, setAppState] = useState<AppState>(() => getAppState());
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [newlyPostedId, setNewlyPostedId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("hn.lang") as Lang) || "EN");
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [demo, setDemo] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>(() => {
    const initialAppState = getAppState();
    return {
      category: searchParams.get("category") || initialAppState.category || undefined,
      subcategory: getParam(searchParams, "sub"),
      query: searchParams.get("q") || "",
      minPrice: searchParams.get("min") ? Number(searchParams.get("min")) : undefined,
      maxPrice: searchParams.get("max") ? Number(searchParams.get("max")) : undefined,
      jobKind: undefined as "regular"|"gig"|undefined,
    };
  });

  // Update URL when filters change
  useEffect(() => {
    const params = setParams(new URLSearchParams(), {
      category: filters.category,
      sub: filters.subcategory,
      q: filters.query,
      min: filters.minPrice?.toString(),
      max: filters.maxPrice?.toString(),
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Setup auth listener
  useEffect(() => {
    const { data: { subscription } } = onAuthChange((session) => {
      console.log("Auth state changed:", session?.user?.id || 'null');
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user just signed in, close login modal and show success
      if (session?.user) {
        setLoginOpen(false);
        if (session.access_token) {
          toast.success('Successfully signed in!');
        }
      }
    });

    // Also check for existing session on mount
    const checkInitialSession = async () => {
      const { getSession } = await import("@/repo/auth");
      const session = await getSession();
      console.log("Initial session check:", session?.user?.id || 'null');
      setSession(session);
      setUser(session?.user ?? null);
    };

    checkInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  // Load live data for hero section
  useEffect(() => {
    const loadLiveData = async () => {
      const res = await getStarPoints();
      setTotal(res.total);
      setDemo(res.demo);
      setIsLoading(false);
    };

    loadLiveData();
    
    // Refresh periodically
    const interval = setInterval(loadLiveData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Load data when city or filters change
  useEffect(() => {
    if (!appState.city) return;
    
      const loadListings = async () => {
        setLoading(true);
        try {
          const data = user 
            ? await fetchListingsWithContacts({
                city: appState.city,
                category: filters.category,
                q: filters.query,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                subcategory: filters.subcategory,
              })
            : await fetchListings({
                city: appState.city,
                category: filters.category,
                q: filters.query,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                subcategory: filters.subcategory,
              });
              
          setListings(data.map(row => ({
            id: row.id,
            user_id: row.user_id || "",
            city: row.city,
            country: row.country,
            category: row.category as string,
            subcategory: row.subcategory,
            title: row.title,
            description: row.description || "",
            price: row.price_cents ? row.price_cents / 100 : null,
            currency: row.currency,
            contact_phone: hasContactAccess(user, row) ? getContactValue(row.contact, 'phone') : null,
            contact_whatsapp: hasContactAccess(user, row) ? getContactValue(row.contact, 'whatsapp') : null,
            contact_telegram: hasContactAccess(user, row) ? getContactValue(row.contact, 'telegram') : null,
            contact_email: hasContactAccess(user, row) ? getContactValue(row.contact, 'email') : null,
            website_url: row.website_url,
            tags: row.tags || [],
            images: row.images || [],
            lat: row.location_lat,
            lng: row.location_lng,
            created_at: row.created_at,
            // Legacy compatibility
            contact: { phone: hasContactAccess(user, row) ? (row.contact.contact_value || "") : "" },
            photos: row.images || [],
            lon: row.location_lng || undefined,
            createdAt: new Date(row.created_at).getTime(),
            updatedAt: new Date(row.updated_at).getTime(),
            hasImage: !!(row.images?.length),
          })));
        } catch (error) {
          console.error("Failed to load listings:", error);
          toast("Failed to load listings");
        } finally {
          setLoading(false);
        }
      };

    loadListings();
  }, [appState.city, filters.category, filters.query, filters.minPrice, filters.maxPrice, filters.subcategory, user]);

  // Deep-link: if /l/:id, fetch and open
  useEffect(() => {
    const id = params.id;
    if (!id) return;

    const loadListingById = async () => {
      try {
        const row = await fetchListingById(id);
        const contact = user ? await getListingContact(id) : null;
        
        const listing: Listing = {
          id: row.id,
          user_id: row.user_id || "",
          city: row.city,
          country: row.country,
          category: row.category as string,
          subcategory: row.subcategory,
          title: row.title,
          description: row.description || "",
          price: row.price_cents ? row.price_cents / 100 : null,
          currency: row.currency,
          contact_phone: (contact?.contact_method === 'phone') ? contact.contact_value : null,
          contact_whatsapp: (contact?.contact_method === 'whatsapp') ? contact.contact_value : null,
          contact_telegram: (contact?.contact_method === 'telegram') ? contact.contact_value : null,
          contact_email: (contact?.contact_method === 'email') ? contact.contact_value : null,
          website_url: row.website_url,
          tags: row.tags || [],
          images: row.images || [],
          lat: row.location_lat,
          lng: row.location_lng,
          created_at: row.created_at,
          // Legacy compatibility
          contact: { phone: contact?.contact_value || "" },
          photos: row.images || [],
          lon: row.location_lng || undefined,
          createdAt: new Date(row.created_at).getTime(),
          updatedAt: new Date(row.updated_at).getTime(),
          hasImage: !!(row.images?.length),
        };
        setSelectedListing(listing);
        setDetailOpen(true);
      } catch (error) {
        console.error("Failed to load listing:", error);
        toast.error("Listing not found");
        navigate('/', { replace: true });
      }
    };

    loadListingById();
  }, [params.id, navigate]);

  // Filter listings
  const filteredListings = useMemo(() => {
    let filtered = [...listings];

    if (filters.category) {
      filtered = filtered.filter(
        (listing) => listing.category === filters.category
      );
    }

    if (filters.subcategory) {
      filtered = filtered.filter(
        (listing) => listing.subcategory === filters.subcategory
      );
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(q) ||
          listing.description.toLowerCase().includes(q) ||
          listing.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (filters.category === "housing") {
      if (filters.minPrice != null) filtered = filtered.filter(l => l.price != null && (l.price as number) >= filters.minPrice!);
      if (filters.maxPrice != null) filtered = filtered.filter(l => l.price != null && (l.price as number) <= filters.maxPrice!);
    }

    if (filters.category === "jobs" && filters.jobKind) {
      filtered = filtered.filter(l => (l as any).jobKind === filters.jobKind);
    }

    return filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [listings, filters]);

  // Event handlers
  const setLanguage = (newLang: string) => {
    setLang(newLang as Lang);
    localStorage.setItem("hn.lang", newLang);
  };

  const handleCityChange = (city: string, lat?: number, lon?: number) => {
    // For desktop, navigate to browse page
    // For mobile, update app state to show listings
    const next = { ...appState, city };
    setAppState(next);
    saveAppState(next);
  };

  const handleAccountClick = () => {
    if (user) {
      setAcctOpen(true);
    } else {
      setLoginOpen(true);
    }
  };

  const handlePostClick = async () => {
    console.log("Post button clicked, user:", user);
    console.log("Session:", session);
    
    const userId = await getUserId();
    console.log("getUserId result:", userId);
    
    if (!userId) {
      setLoginOpen(true);
      toast.error("Please sign in to post a listing");
      return;
    }
    setPostOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setAcctOpen(false);
    toast("Signed out successfully");
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    // Clear subcategory if it doesn't belong to the new category
    if (newFilters.category !== filters.category && newFilters.subcategory) {
      const categorySubcategories = TAXONOMY[newFilters.category as CategoryKey]?.sub || [];
      if (!categorySubcategories.includes(newFilters.subcategory)) {
        newFilters.subcategory = undefined;
      }
    }
    setFilters(newFilters);
  };

  // Navigation helpers
  const openCat = (category: CategoryKey, sub?: string) => {
    handleFiltersChange({ ...filters, category, subcategory: sub });
    // Optionally scroll to results
    setTimeout(() => {
      document.getElementById("listing-root")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleViewModeChange = (mode: "grid" | "map") => {
    const next = { ...appState, viewMode: mode };
    setAppState(next);
    saveAppState(next);
  };

  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
    setDetailOpen(true);
    navigate(`/l/${listing.id}`, { replace: false });
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedListing(null);
    navigate(`/`, { replace: true });
  };

  const handleFavorite = (listingId: string) => {
    // Toggle favorite logic here
    const newFavorites = favorites.includes(listingId)
      ? favorites.filter(id => id !== listingId)
      : [...favorites, listingId];
    setFavorites(newFavorites);
    toast(favorites.includes(listingId) ? "Removed from favorites" : "Added to favorites");
  };

  const shouldShowCityIndex =
    !!appState.city && !filters.query && !filters.subcategory;

  return (
    <div className="min-h-screen bg-background">
      <BootstrapAuth />
      
      {/* Modals - using auth store */}
      <AuthModal />
      <PostModal city={appState.city} onPosted={(listing) => setNewlyPostedId(listing.id)} />
      <AccountModal 
        open={acctOpen} 
        onOpenChange={setAcctOpen}
        user={user}
        onSignOut={async () => {
          await signOut();
          setAcctOpen(false);
        }}
      />

      {/* Desktop layout - Show only on homepage when no city is selected */}
      <div className="hidden md:block">
        <DesktopHeader onCitySelect={handleCityChange} />
        {!appState.city && <DesktopHomeHero lang={lang} />}
        <StickyFooter />
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <Header
          currentCity={appState.city}
          onCityChange={handleCityChange}
          onAccountClick={() => setAcctOpen(true)}
          onLogoClick={handleLogoClick}
          rightExtra={<LanguageToggle value={lang} onChange={(v) => setLang(v as Lang)} />}
        />
        <MobileHeader />

        {!appState.city ? (
          <div className="container mx-auto px-4 py-4 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <Globe className="scale-75" />
            </div>
            <div className="relative z-10">
              <CitySearchBar 
                placeholder="City (e.g. Asmara, Oakland, Frankfurt)" 
                onCitySelect={handleCityChange}
              />
            </div>
          </div>
        ) : (
          /* Show listings when city is selected */
          <main className="container mx-auto px-4 py-6 mb-20">
            <FilterBar 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              viewMode={appState.viewMode || "grid"}
              onViewModeChange={handleViewModeChange}
              resultsCount={filteredListings.length}
            />
            <ListingGrid
              listings={filteredListings}
              onListingSelect={handleListingSelect}
              loading={loading}
              onPostFirst={handlePostClick}
              newlyPostedId={newlyPostedId}
            />
          </main>
        )}

        <StickyPostCTA />
        <Footer />
      </div>
    </div>
  );
}

import DesktopHeader from '@/components/home/DesktopHeader';
import HeroSearch from '@/components/home/HeroSearch';
import TrendingRail from '@/components/home/TrendingRail';
import AppFooter from '@/components/home/AppFooter';
import { getUserCity, getTrendingCommunity, getTrendingMarketplace, getTrendingHousing, getTrendingJobs } from '@/utils/trending';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    setCity(getUserCity()); // profile or localStorage fallback
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DesktopHeader />

      {/* Hero */}
      <HeroSearch onCityChange={(c)=>{ localStorage.setItem('hn_city', c); setCity(c);} } />

      {/* Trending rails */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0 space-y-14 py-10">
        <TrendingRail
          title={`Trending ${city ? `in ${city}` : 'in the community'}`}
          subtitle="Most viewed & saved in the last 24 hours"
          fetchItems={() => getTrendingCommunity(city)}
          variant="community"
        />
        <TrendingRail
          title={`Trending in Marketplace${city ? ` • ${city}` : ''}`}
          subtitle="Popular buy & sell posts near you"
          fetchItems={() => getTrendingMarketplace(city)}
          variant="marketplace"
        />
        <TrendingRail
          title={`Trending in Housing / Rentals${city ? ` • ${city}` : ''}`}
          subtitle="Hot rentals and sublets"
          fetchItems={() => getTrendingHousing(city)}
          variant="housing"
        />
        <TrendingRail
          title={`Trending in Jobs & Services${city ? ` • ${city}` : ''}`}
          subtitle="Most saved jobs and booked services"
          fetchItems={() => getTrendingJobs(city)}
          variant="jobs"
        />
      </main>

      <AppFooter />
    </div>
  );
}
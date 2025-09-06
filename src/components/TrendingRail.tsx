// src/components/TrendingRail.tsx
import { useEffect, useState } from 'react';
import SectionHeader from './SectionHeader';
import { HorizontalRail } from './ListingCardHorizontal';
import { getTrendingListings, getUserCity, type ListingLite } from '@/lib/trending';

type Props = {
  label: string;
  category?: string;
  featured?: boolean;
  link?: string;
};

export default function TrendingRail({ label, category, featured, link }: Props) {
  const [items, setItems] = useState<ListingLite[] | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userCity = await getUserCity();
        setCity(userCity);
        
        const results = await getTrendingListings({
          category: featured ? undefined : category,
          featuredOnly: !!featured,
          city: userCity,
          limit: 12
        });
        
        setItems(results);
      } catch (error) {
        console.error('Failed to load trending data:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category, featured]);

  if (loading) {
    // Skeleton loading state
    return (
      <section className="my-8">
        <SectionHeader title={label} subtitle="Loading..." />
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="min-w-[260px] max-w-[260px] h-[280px] animate-pulse bg-muted rounded-xl" 
            />
          ))}
        </div>
      </section>
    );
  }

  // Don't render if no items
  if (!items || items.length === 0) {
    return null;
  }

  const subtitle = city ? `Trending in ${city}` : 'Popular worldwide';

  return (
    <section className="my-8">
      <SectionHeader title={label} subtitle={subtitle} href={link} />
      <HorizontalRail items={items} />
    </section>
  );
}
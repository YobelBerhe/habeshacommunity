import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { Listing } from '@/types';

export function RecentCarousel() {
  const [recentListings, setRecentListings] = useState<Listing[]>([]);

  useEffect(() => {
    // Get recently viewed listings from localStorage
    try {
      const recent = localStorage.getItem('hn.recent_views');
      if (recent) {
        const recentIds = JSON.parse(recent) as string[];
        // In a real app, you'd fetch these listings from the API
        // For now, we'll just show a placeholder
        setRecentListings([]);
      }
    } catch (error) {
      console.error('Failed to load recent listings:', error);
    }
  }, []);

  if (recentListings.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Recently Viewed</h2>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {recentListings.map((listing) => (
          <div key={listing.id} className="flex-shrink-0 w-64">
            <ListingCard 
              listing={listing}
              onSelect={() => {}}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Heart, MapPin } from 'lucide-react';

interface SavedListing {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  distance: string;
}

export default function SavedListings() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<SavedListing[]>([]);

  useEffect(() => {
    setSaved([
      {
        id: '3',
        title: 'Traditional Netela - Hand Woven',
        price: 150,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300',
        location: 'Oakland, CA',
        distance: '8 miles away'
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Saved Items</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 w-full">
        {saved.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium text-foreground">No saved items</p>
            <p className="text-sm text-muted-foreground mt-1">
              Save items you're interested in to find them easily later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {saved.map((listing) => (
              <Card
                key={listing.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/marketplace/listing/${listing.id}`)}
              >
                <div className="relative aspect-square">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3">
                  <p className="font-semibold text-foreground">
                    ${listing.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {listing.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {listing.location}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

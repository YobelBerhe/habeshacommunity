import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, MessageCircle, MoreVertical } from 'lucide-react';

interface MyListing {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  status: 'active' | 'pending' | 'sold';
  views: number;
  messages: number;
  createdAt: Date;
}

export default function SellingPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<MyListing[]>([]);

  useEffect(() => {
    setListings([
      {
        id: '1',
        title: 'Traditional Netela - Hand Woven',
        price: 150,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300',
        category: 'Products',
        status: 'active',
        views: 127,
        messages: 8,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: 'Room for Rent - Oakland',
        price: 900,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300',
        category: 'Housing',
        status: 'active',
        views: 89,
        messages: 12,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
    ]);
  }, []);

  const activeListings = listings.filter(l => l.status === 'active');
  const soldListings = listings.filter(l => l.status === 'sold');

  const ListingCard = ({ listing }: { listing: MyListing }) => (
    <Card className="p-4">
      <div className="flex gap-4">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-foreground">{listing.title}</p>
              <p className="text-lg font-bold text-foreground">${listing.price.toLocaleString()}</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {listing.views}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {listing.messages}
            </div>
            <Badge variant="outline">
              {listing.status}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Your Listings</h1>
            <Button
              size="sm"
              onClick={() => navigate('/marketplace/create')}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Listing
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 w-full">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active ({activeListings.length})
            </TabsTrigger>
            <TabsTrigger value="sold">
              Sold ({soldListings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {activeListings.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium text-foreground">No active listings</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first listing to start selling
                </p>
                <Button className="mt-4" onClick={() => navigate('/marketplace/create')}>
                  Create Listing
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold" className="mt-4">
            {soldListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No sold items yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {soldListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Package(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

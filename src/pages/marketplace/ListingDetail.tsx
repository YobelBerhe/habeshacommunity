import { useState } from 'react';
import { 
  ArrowLeft, Heart, Share2, Flag, MapPin, Clock,
  Phone, Mail, MessageSquare, User, Star, Shield,
  CheckCircle, DollarSign, Home, Bed, Bath, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams } from 'react-router-dom';

const ListingDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Demo listing data
  const listing = {
    id: '1',
    type: type as 'product' | 'housing' | 'job' | 'service',
    title: 'Traditional Ethiopian Coffee Set',
    description: `Authentic handcrafted jebena (coffee pot) with 6 matching cups. Perfect for traditional Ethiopian/Eritrean coffee ceremonies.

Made by local artisans in Addis Ababa. The jebena is made from clay and can be used on any heat source. Cups are ceramic with traditional designs.

This set has been in my family for years but we're downsizing and want it to go to someone who will appreciate and use it.

Includes:
- 1 Traditional Jebena (coffee pot)
- 6 Ceramic cups with saucers
- 1 Small incense burner
- Instructions for traditional coffee ceremony

In excellent condition, gently used.`,
    price: 85,
    location: 'Washington DC',
    category: 'Home & Kitchen',
    condition: 'Like New',
    postedAt: '2024-12-15',
    images: [
      'https://via.placeholder.com/800x600?text=Jebena+Set',
      'https://via.placeholder.com/800x600?text=Close+Up',
      'https://via.placeholder.com/800x600?text=Cups'
    ],
    seller: {
      name: 'Sara Mehretab',
      avatar: 'SM',
      memberSince: '2023',
      rating: 4.8,
      reviewCount: 23,
      verified: true,
      responseTime: '2 hours'
    },
    views: 127,
    favorites: 15,
    featured: true
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Flag className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
                {listing.featured && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white z-10">
                    <Star className="w-3 h-3 mr-1 fill-white" />
                    Featured
                  </Badge>
                )}
                
                <img 
                  src={listing.images[currentImageIndex]} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {listing.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Details */}
            <Card className="p-6 md:p-8">
              <div className="space-y-6">
                {/* Title & Price */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-4">{listing.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="text-3xl md:text-4xl font-bold text-primary">
                      ${listing.price}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{listing.category}</Badge>
                      <Badge variant="secondary">{listing.condition}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {listing.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Posted {new Date(listing.postedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {listing.views} views
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="pt-6 border-t">
                  <h3 className="text-xl font-bold mb-4">Description</h3>
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-line">
                    {listing.description}
                  </div>
                </div>
              </div>
            </Card>

            {/* Seller Info */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">About the Seller</h3>
              
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                    {listing.seller.avatar}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-lg">{listing.seller.name}</h4>
                    {listing.seller.verified && (
                      <Badge className="bg-blue-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                      <span className="font-semibold">{listing.seller.rating}</span>
                      <span className="ml-1">({listing.seller.reviewCount} reviews)</span>
                    </div>
                    <div>Member since {listing.seller.memberSince}</div>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    Usually responds in {listing.seller.responseTime}
                  </div>
                </div>
              </div>
            </Card>

            {/* Safety Tips */}
            <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-2">Safety Tips</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Meet in a public place for in-person transactions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Never send money before seeing the item</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Check the item carefully before purchasing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Report any suspicious activity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Seller */}
            <Card className="p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Contact Seller</h3>
              
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => navigate(`/inbox?user=${listing.seller.name}`)}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Send Message
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Show Phone
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Seller
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                <div className="flex items-center mb-2">
                  <Shield className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                  <span>This seller is verified</span>
                </div>
                <p>
                  All communications are monitored for safety. 
                  Report any suspicious activity immediately.
                </p>
              </div>
            </Card>

            {/* Similar Listings */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Similar Listings</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                        Traditional Coffee Set #{i}
                      </h4>
                      <div className="text-primary font-bold">$75</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;

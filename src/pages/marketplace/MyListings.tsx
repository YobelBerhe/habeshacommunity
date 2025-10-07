import { useState } from 'react';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, MoreVertical,
  Heart, MessageSquare,
  CheckCircle, Clock, XCircle, Copy, Share2,
  ShoppingBag, Home, Briefcase, Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Listing {
  id: string;
  type: 'product' | 'housing' | 'job' | 'service';
  title: string;
  description: string;
  price?: number;
  salary?: string;
  location: string;
  status: 'active' | 'pending' | 'sold' | 'expired';
  views: number;
  favorites: number;
  messages: number;
  postedAt: string;
  featured: boolean;
}

const MyListings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  // Demo listings
  const listings: Listing[] = [
    {
      id: '1',
      type: 'product',
      title: 'Traditional Ethiopian Coffee Set',
      description: 'Authentic jebena and cups, perfect for coffee ceremonies',
      price: 85,
      location: 'Washington DC',
      status: 'active',
      views: 127,
      favorites: 15,
      messages: 8,
      postedAt: '2024-12-15',
      featured: true
    },
    {
      id: '2',
      type: 'housing',
      title: '2BR Apartment near Community Center',
      description: 'Spacious apartment in safe neighborhood',
      price: 1800,
      location: 'Oakland, CA',
      status: 'active',
      views: 89,
      favorites: 12,
      messages: 5,
      postedAt: '2024-12-10',
      featured: false
    },
    {
      id: '3',
      type: 'service',
      title: 'Tigrinya Language Tutor',
      description: 'Experienced teacher offering online lessons',
      price: 30,
      location: 'Remote',
      status: 'active',
      views: 56,
      favorites: 8,
      messages: 3,
      postedAt: '2024-12-05',
      featured: false
    },
    {
      id: '4',
      type: 'product',
      title: 'Traditional Habesha Dress',
      description: 'Beautiful handmade dress',
      price: 250,
      location: 'Seattle, WA',
      status: 'sold',
      views: 234,
      favorites: 34,
      messages: 18,
      postedAt: '2024-11-20',
      featured: false
    },
    {
      id: '5',
      type: 'job',
      title: 'Restaurant Staff Wanted',
      description: 'Ethiopian/Eritrean restaurant seeking servers',
      salary: '$18-22/hr',
      location: 'Atlanta, GA',
      status: 'expired',
      views: 145,
      favorites: 23,
      messages: 12,
      postedAt: '2024-11-01',
      featured: false
    }
  ];

  const activeListings = listings.filter(l => l.status === 'active');
  const soldListings = listings.filter(l => l.status === 'sold');
  const expiredListings = listings.filter(l => l.status === 'expired');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'sold': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'expired': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return ShoppingBag;
      case 'housing': return Home;
      case 'job': return Briefcase;
      case 'service': return Wrench;
      default: return ShoppingBag;
    }
  };

  const handleDelete = (listingId: string) => {
    setSelectedListing(listingId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.success('Listing deleted successfully');
    setDeleteDialogOpen(false);
    setSelectedListing(null);
  };

  const handleToggleStatus = (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    toast.success(`Listing ${newStatus === 'active' ? 'activated' : 'paused'}`);
  };

  const handleMarkAsSold = (listingId: string) => {
    toast.success('Listing marked as sold');
  };

  const handleCopyLink = (listingId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/marketplace/${listingId}`);
    toast.success('Link copied to clipboard');
  };

  const ListingCard = ({ listing }: { listing: Listing }) => {
    const TypeIcon = getTypeIcon(listing.type);
    
    return (
      <Card className="p-4 md:p-6 hover:shadow-lg transition-all">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image Placeholder */}
          <div className="w-full md:w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <TypeIcon className="w-12 h-12 text-gray-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 
                    className="font-bold text-lg hover:text-primary cursor-pointer truncate"
                    onClick={() => navigate(`/marketplace/${listing.id}`)}
                  >
                    {listing.title}
                  </h3>
                  {listing.featured && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white flex-shrink-0">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {listing.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <Badge className={getStatusColor(listing.status)}>
                    {listing.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {listing.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                    {listing.status === 'sold' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {listing.status === 'expired' && <XCircle className="w-3 h-3 mr-1" />}
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </Badge>
                  <span>{listing.location}</span>
                  <span>Posted {new Date(listing.postedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/marketplace/${listing.id}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Listing
                  </DropdownMenuItem>
                  {listing.status === 'active' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate(`/marketplace/edit/${listing.id}`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(listing.id, listing.status)}>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Pause Listing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMarkAsSold(listing.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Sold
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => handleCopyLink(listing.id)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(listing.id)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t text-sm">
              <div className="flex items-center text-muted-foreground">
                <Eye className="w-4 h-4 mr-1" />
                <span className="font-semibold">{listing.views}</span>
                <span className="ml-1">views</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Heart className="w-4 h-4 mr-1" />
                <span className="font-semibold">{listing.favorites}</span>
                <span className="ml-1">favorites</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span className="font-semibold">{listing.messages}</span>
                <span className="ml-1">messages</span>
              </div>
              <div className="ml-auto">
                <div className="text-xs text-muted-foreground">Price</div>
                <div className="text-xl font-bold text-primary">
                  {listing.price && `$${listing.price.toLocaleString()}`}
                  {listing.salary && listing.salary}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Listings</h1>
              <p className="text-base md:text-lg opacity-90">
                Manage your marketplace items
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate('/marketplace/create')}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">New Listing</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {activeListings.length}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Active</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {listings.reduce((sum, l) => sum + l.views, 0)}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Total Views</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {listings.reduce((sum, l) => sum + l.messages, 0)}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Messages</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
              {soldListings.length}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Sold</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="active">
              Active ({activeListings.length})
            </TabsTrigger>
            <TabsTrigger value="sold">
              Sold ({soldListings.length})
            </TabsTrigger>
            <TabsTrigger value="expired">
              Expired ({expiredListings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeListings.length > 0 ? (
              activeListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No active listings</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first listing to start selling
                </p>
                <Button onClick={() => navigate('/marketplace/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sold" className="space-y-4">
            {soldListings.length > 0 ? (
              soldListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No sold items yet</h3>
                <p className="text-muted-foreground">
                  Your sold listings will appear here
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            {expiredListings.length > 0 ? (
              expiredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No expired listings</h3>
                <p className="text-muted-foreground">
                  Listings expire after 90 days of inactivity
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your listing
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyListings;

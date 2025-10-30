import { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, MoreVertical,
  TrendingUp, DollarSign, Heart, MessageSquare,
  CheckCircle, Clock, XCircle, Copy, Share2,
  ShoppingBag, Home, Briefcase, Wrench, Loader2
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
import { supabase } from '@/integrations/supabase/client';
import type { ListingRow } from '@/types/db';

const MyListings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        navigate('/auth/login');
        return;
      }

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const activeListings = listings.filter(l => l.status === 'active');
  const soldListings = listings.filter(l => l.status === 'archived'); // archived = sold
  const pausedListings = listings.filter(l => l.status === 'paused');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'paused': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'archived': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'; // archived = sold
      case 'flagged': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
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

  const confirmDelete = async () => {
    if (!selectedListing) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', selectedListing);

      if (error) throw error;

      toast.success('Listing deleted successfully');
      setListings(prev => prev.filter(l => l.id !== selectedListing));
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    } catch (error: any) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const handleToggleStatus = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (error) throw error;

      toast.success(`Listing ${newStatus === 'active' ? 'activated' : 'paused'}`);
      setListings(prev => prev.map(l => 
        l.id === listingId ? { ...l, status: newStatus as any } : l
      ));
    } catch (error: any) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing');
    }
  };

  const handleMarkAsSold = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'archived' } as any) // Use archived instead of sold
        .eq('id', listingId);

      if (error) throw error;

      toast.success('Listing marked as sold');
      setListings(prev => prev.map(l => 
        l.id === listingId ? { ...l, status: 'archived' as any } : l
      ));
    } catch (error: any) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing');
    }
  };

  const handleCopyLink = (listingId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/marketplace/listing/${listingId}`);
    toast.success('Link copied to clipboard');
  };

  const ListingCard = ({ listing }: { listing: ListingRow }) => {
    const TypeIcon = getTypeIcon(listing.category);
    const firstImage = listing.images?.[0];
    
    return (
      <Card className="p-4 md:p-6 hover:shadow-lg transition-all">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image */}
          <div className="w-full md:w-32 h-32 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {firstImage ? (
              <img src={firstImage} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <TypeIcon className="w-12 h-12 text-muted-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 
                    className="font-bold text-lg hover:text-primary cursor-pointer truncate"
                    onClick={() => navigate(`/marketplace/listing/${listing.id}`)}
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
                    {listing.status === 'paused' && <Clock className="w-3 h-3 mr-1" />}
                    {listing.status === 'archived' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {listing.status === 'archived' ? 'Sold' : listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </Badge>
                  <span>{listing.city}, {listing.country}</span>
                  <span>Posted {new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/marketplace/listing/${listing.id}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Listing
                  </DropdownMenuItem>
                  {listing.status === 'active' && (
                    <>
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
                  {listing.status === 'paused' && (
                    <DropdownMenuItem onClick={() => handleToggleStatus(listing.id, listing.status)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Activate Listing
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleCopyLink(listing.id)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(listing.id)}
                    className="text-destructive"
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
                <span className="font-semibold">{listing.view_count || 0}</span>
                <span className="ml-1">views</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Heart className="w-4 h-4 mr-1" />
                <span className="font-semibold">{listing.favorite_count || 0}</span>
                <span className="ml-1">favorites</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span className="font-semibold">{listing.message_count || 0}</span>
                <span className="ml-1">messages</span>
              </div>
              {listing.price_cents && (
                <div className="ml-auto">
                  <div className="text-xs text-muted-foreground">Price</div>
                  <div className="text-xl font-bold text-primary">
                    ${(listing.price_cents / 100).toLocaleString()}
                  </div>
                </div>
              )}
              {listing.salary && (
                <div className="ml-auto">
                  <div className="text-xs text-muted-foreground">Salary</div>
                  <div className="text-lg font-bold text-primary">
                    {listing.salary}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
              {listings.reduce((sum, l) => sum + (l.view_count || 0), 0)}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Total Views</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {listings.reduce((sum, l) => sum + (l.message_count || 0), 0)}
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
            <TabsTrigger value="paused">
              Paused ({pausedListings.length})
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

          <TabsContent value="paused" className="space-y-4">
            {pausedListings.length > 0 ? (
              pausedListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No paused listings</h3>
                <p className="text-muted-foreground">
                  Paused listings will appear here
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
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyListings;

import { useState } from "react";
import { Listing } from "@/types";
import ListingCard from "./ListingCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ListingGridProps {
  listings: Listing[];
  onListingSelect: (listing: Listing) => void;
  onFavorite?: (listingId: string) => void;
  favoritedListings?: string[];
  loading?: boolean;
}

const ListingGrid = ({ 
  listings, 
  onListingSelect, 
  onFavorite, 
  favoritedListings = [],
  loading = false 
}: ListingGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = listings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-gradient-card rounded-lg border border-border/50 overflow-hidden animate-pulse"
          >
            <div className="aspect-[16/10] bg-muted"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary/10 rounded-full flex items-center justify-center">
          <span className="text-4xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">No listings found</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Try adjusting your search criteria or be the first to post in this category!
        </p>
        <Button variant="hero">
          Post First Listing
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentListings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onSelect={onListingSelect}
            onFavorite={onFavorite}
            isFavorited={favoritedListings.includes(listing.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;
              const showPage = Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages;
              const showEllipsis = Math.abs(page - currentPage) === 3;

              if (showEllipsis) {
                return <span key={page} className="px-2 text-muted-foreground">...</span>;
              }

              if (!showPage) return null;

              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Results info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {startIndex + 1}-{Math.min(endIndex, listings.length)} of {listings.length} listings
      </div>
    </div>
  );
};

export default ListingGrid;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const GeocodeListings = () => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const geocodeAllListings = async () => {
    setIsGeocoding(true);
    
    try {
      // Get all listings without coordinates
      const { data: listings, error } = await supabase
        .from('listings')
        .select('id, city, country, street_address')
        .or('location_lat.is.null,location_lng.is.null')
        .eq('status', 'active');

      if (error) {
        toast.error('Failed to fetch listings');
        return;
      }

      if (!listings || listings.length === 0) {
        toast.success('All listings already have coordinates!');
        return;
      }

      setProgress({ current: 0, total: listings.length });
      let successCount = 0;

      for (let i = 0; i < listings.length; i++) {
        const listing = listings[i];
        setProgress({ current: i + 1, total: listings.length });

        // Skip invalid cities
        if (!listing.city || listing.city === 'Select a city') {
          continue;
        }

        // Build address string
        let address = listing.city;
        if (listing.street_address) {
          address = `${listing.street_address}, ${listing.city}`;
        }
        if (listing.country && listing.country !== 'Unknown') {
          address += `, ${listing.country}`;
        }

        // Geocode the address
        const coords = await geocodeAddress(address);
        
        if (coords) {
          const { error: updateError } = await supabase
            .from('listings')
            .update({
              location_lat: coords.lat,
              location_lng: coords.lng
            })
            .eq('id', listing.id);

          if (!updateError) {
            successCount++;
          }
        }

        // Add small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast.success(`Successfully geocoded ${successCount} out of ${listings.length} listings!`);
    } catch (error) {
      toast.error('Error during geocoding process');
    } finally {
      setIsGeocoding(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Geocode Existing Listings</CardTitle>
          <CardDescription>
            Add map coordinates to listings that don't have them yet. This will make them visible on the map view.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={geocodeAllListings} 
            disabled={isGeocoding}
            className="w-full"
          >
            {isGeocoding ? 'Geocoding in progress...' : 'Start Geocoding Process'}
          </Button>

          {isGeocoding && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Progress: {progress.current} / {progress.total}
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>⚠️ This process:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Will geocode all listings without coordinates</li>
              <li>Uses OpenStreetMap Nominatim API (free but rate limited)</li>
              <li>Takes about 1 second per listing to be respectful to the API</li>
              <li>Skips listings with invalid cities</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeocodeListings;
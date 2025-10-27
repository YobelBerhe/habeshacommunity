import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChurchCard } from "@/components/church/ChurchCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { searchChurches, getDenominations, addFavoriteChurch, removeFavoriteChurch, isChurchFavorited } from "@/lib/api/church-finder";
import type { Church, ChurchDenomination } from "@/types/church-finder";
import { useToast } from "@/hooks/use-toast";

export default function ChurchList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [churches, setChurches] = useState<Church[]>([]);
  const [denominations, setDenominations] = useState<ChurchDenomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedDenomination, setSelectedDenomination] = useState(searchParams.get("denomination") || "");
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get("country") || "");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    loadDenominations();
  }, []);

  useEffect(() => {
    loadChurches();
  }, [searchParams]);

  const loadDenominations = async () => {
    try {
      const data = await getDenominations();
      setDenominations(data);
    } catch (error) {
      console.error("Error loading denominations:", error);
    }
  };

  const loadChurches = async () => {
    setLoading(true);
    try {
      const result = await searchChurches({
        query: searchParams.get("q") || undefined,
        denomination_id: searchParams.get("denomination") ? parseInt(searchParams.get("denomination")!) : undefined,
        country: searchParams.get("country") || undefined,
      });
      setChurches(result.churches);

      // Load favorites
      const favoriteChecks = await Promise.all(
        result.churches.map(c => isChurchFavorited(c.id))
      );
      const favSet = new Set<number>();
      result.churches.forEach((church, index) => {
        if (favoriteChecks[index]) {
          favSet.add(church.id);
        }
      });
      setFavorites(favSet);
    } catch (error) {
      console.error("Error loading churches:", error);
      toast({
        title: "Error",
        description: "Failed to load churches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedDenomination) params.set("denomination", selectedDenomination);
    if (selectedCountry) params.set("country", selectedCountry);
    setSearchParams(params);
  };

  const handleFavorite = async (churchId: number) => {
    try {
      if (favorites.has(churchId)) {
        await removeFavoriteChurch(churchId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(churchId);
          return newSet;
        });
        toast({
          title: "Removed from favorites",
        });
      } else {
        await addFavoriteChurch(churchId);
        setFavorites(prev => new Set(prev).add(churchId));
        toast({
          title: "Added to favorites",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Find Churches</h1>
          <p className="text-muted-foreground">
            Browse our directory of Eritrean & Ethiopian churches worldwide
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search churches by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full"
            />
          </div>
          
          <Select value={selectedDenomination} onValueChange={setSelectedDenomination}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Denomination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Denominations</SelectItem>
              {denominations.map((d) => (
                <SelectItem key={d.id} value={d.id.toString()}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Countries</SelectItem>
              <SelectItem value="Eritrea">Eritrea</SelectItem>
              <SelectItem value="Ethiopia">Ethiopia</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : churches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No churches found. Try adjusting your search.</p>
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              Found {churches.length} churches
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {churches.map((church) => (
                <ChurchCard
                  key={church.id}
                  church={church}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.has(church.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

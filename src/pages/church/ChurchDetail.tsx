import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, Globe, Mail, Calendar, Clock, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getChurchDetails, addFavoriteChurch, removeFavoriteChurch, isChurchFavorited } from "@/lib/api/church-finder";
import type { ChurchDetails } from "@/types/church-finder";
import { useToast } from "@/hooks/use-toast";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ChurchDetail() {
  const { slug } = useParams();
  const [church, setChurch] = useState<ChurchDetails | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      loadChurch();
    }
  }, [slug]);

  const loadChurch = async () => {
    if (!slug) return;
    
    setLoading(true);
    try {
      const data = await getChurchDetails(slug);
      setChurch(data);
      
      if (data) {
        const favorited = await isChurchFavorited(data.id);
        setIsFavorite(favorited);
      }
    } catch (error) {
      console.error("Error loading church:", error);
      toast({
        title: "Error",
        description: "Failed to load church details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!church) return;

    try {
      if (isFavorite) {
        await removeFavoriteChurch(church.id);
        setIsFavorite(false);
        toast({ title: "Removed from favorites" });
      } else {
        await addFavoriteChurch(church.id);
        setIsFavorite(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!church) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Church not found</p>
        <Button asChild>
          <Link to="/churches/search">Browse Churches</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link to="/churches/search">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Link>
        </Button>

        {/* Hero Image */}
        {church.main_image_url && (
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
            <img
              src={church.main_image_url}
              alt={church.name}
              className="w-full h-full object-cover"
            />
            {church.is_verified && (
              <Badge className="absolute top-4 right-4">
                ✓ Verified
              </Badge>
            )}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{church.name}</h1>
            {church.denomination && (
              <Badge variant="secondary" className="text-base">
                {church.denomination.name}
              </Badge>
            )}
          </div>
          <Button
            onClick={handleFavorite}
            variant={isFavorite ? "default" : "outline"}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? "Saved" : "Save"}
          </Button>
        </div>

        {/* Description */}
        {church.description && (
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{church.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">
                  {church.address || `${church.city}, ${church.country}`}
                </p>
              </div>
            </div>

            {church.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a href={`tel:${church.phone}`} className="text-primary hover:underline">
                    {church.phone}
                  </a>
                </div>
              </div>
            )}

            {church.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href={`mailto:${church.email}`} className="text-primary hover:underline">
                    {church.email}
                  </a>
                </div>
              </div>
            )}

            {church.website && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Website</p>
                  <a
                    href={church.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {church.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services */}
        {church.services.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Service Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {church.services.map((service, index) => (
                  <div key={service.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-2">
                      <h4 className="font-semibold">{service.service_name}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {service.day_of_week !== null && service.day_of_week !== undefined && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {DAYS[service.day_of_week]}
                          </div>
                        )}
                        {service.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {service.time}
                          </div>
                        )}
                        {service.is_livestreamed && (
                          <Badge variant="outline">🎥 Livestream</Badge>
                        )}
                      </div>
                      {service.livestream_url && (
                        <a
                          href={service.livestream_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          Watch Online →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contacts */}
        {church.contacts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Church Leadership</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {church.contacts.map((contact, index) => (
                  <div key={contact.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-1">
                      <h4 className="font-semibold">{contact.name}</h4>
                      {contact.title && (
                        <p className="text-sm text-muted-foreground">{contact.title}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                            {contact.email}
                          </a>
                        )}
                        {contact.phone && (
                          <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                            {contact.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

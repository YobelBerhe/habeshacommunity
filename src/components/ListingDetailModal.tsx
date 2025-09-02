import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, Phone, MessageCircle, Mail, ExternalLink, MapPin, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Listing } from "@/types";
import MapMini from "./MapMini";

interface Props {
  open: boolean;
  listing: Listing | null;
  onClose: () => void;
  onSavedChange?: (id: string, saved: boolean) => void;
}

async function reportListing(listingId: string, reason: string) {
  // This would integrate with your reporting system
  console.log("Reporting listing:", listingId, reason);
}

export default function ListingDetailModal({ open, listing, onClose, onSavedChange }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (listing) {
      setIsSaved(false); // TODO: Implement favorites logic
      setActiveImageIndex(0);
      setShowReportForm(false);
      setReportReason("");
    }
  }, [listing]);

  const handleSave = async () => {
    if (!listing) return;
    
    try {
      // TODO: Implement favorites functionality
      setIsSaved(!isSaved);
      toast({ description: isSaved ? "Removed from favorites" : "Added to favorites" });
      onSavedChange?.(listing.id, !isSaved);
    } catch (error) {
      toast({ 
        description: "Please log in to save listings", 
        variant: "destructive" 
      });
    }
  };

  const handleReport = async () => {
    if (!listing || !reportReason.trim()) return;
    
    try {
      await reportListing(listing.id, reportReason);
      setShowReportForm(false);
      setReportReason("");
      toast({ description: "Report submitted. Thank you." });
    } catch (error) {
      toast({ 
        description: "Failed to submit report", 
        variant: "destructive" 
      });
    }
  };

  const handleWebsiteClick = () => {
    if (listing?.website_url) {
      window.open(listing.website_url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatPrice = (price?: number | null, currency?: string | null) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const getContactButtons = () => {
    if (!listing) return [];
    
    const buttons = [];
    
    if (listing.contact_phone) {
      buttons.push({
        icon: Phone,
        label: "Call",
        href: `tel:${listing.contact_phone}`,
        variant: "default" as const
      });
    }
    
    if (listing.contact_whatsapp) {
      buttons.push({
        icon: MessageCircle,
        label: "WhatsApp",
        href: `https://wa.me/${listing.contact_whatsapp.replace(/\D/g, '')}`,
        variant: "default" as const
      });
    }
    
    if (listing.contact_telegram) {
      buttons.push({
        icon: MessageCircle,
        label: "Telegram",
        href: `https://t.me/${listing.contact_telegram}`,
        variant: "default" as const
      });
    }
    
    if (listing.contact_email) {
      buttons.push({
        icon: Mail,
        label: "Email",
        href: `mailto:${listing.contact_email}`,
        variant: "default" as const
      });
    }
    
    return buttons;
  };

  if (!listing) return null;

  const images = listing.images || [];
  const price = formatPrice(listing.price, listing.currency);
  const contactButtons = getContactButtons();

  const content = (
    <div className="space-y-6">
      {/* Images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
            <img
              src={images[activeImageIndex]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                  onClick={() => setActiveImageIndex((prev) => 
                    prev === 0 ? images.length - 1 : prev - 1
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                  onClick={() => setActiveImageIndex((prev) => 
                    prev === images.length - 1 ? 0 : prev + 1
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden ${
                    index === activeImageIndex ? 'border-primary' : 'border-border'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${listing.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{listing.title}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{listing.city}{listing.country && `, ${listing.country}`}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {price && (
              <Badge variant="secondary" className="text-lg font-semibold px-3 py-1">
                {price}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={isSaved ? "text-red-500 hover:text-red-600" : ""}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Category and Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{listing.category}</Badge>
          {listing.subcategory && (
            <Badge variant="outline">{listing.subcategory}</Badge>
          )}
          {listing.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="font-semibold">Description</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
      </div>

      {/* Map */}
      {listing.lat && listing.lng && (
        <div className="space-y-2">
          <h3 className="font-semibold">Location</h3>
          <Card className="p-0 overflow-hidden">
            <div className="h-48">
              <MapMini lat={listing.lat} lng={listing.lng} />
            </div>
          </Card>
        </div>
      )}

      {/* Contact Buttons */}
      {contactButtons.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Contact</h3>
          <div className="grid grid-cols-2 gap-2">
            {contactButtons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant}
                className="justify-start gap-2"
                onClick={() => window.open(button.href, '_blank', 'noopener,noreferrer')}
              >
                <button.icon className="h-4 w-4" />
                {button.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Website Link */}
      {listing.website_url && (
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleWebsiteClick}
          >
            <ExternalLink className="h-4 w-4" />
            Visit Website
          </Button>
        </div>
      )}

      {/* Report */}
      <div className="pt-4 border-t">
        {!showReportForm ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setShowReportForm(true)}
          >
            <Flag className="h-4 w-4 mr-2" />
            Report listing
          </Button>
        ) : (
          <div className="space-y-3">
            <Textarea
              placeholder="Please describe the issue..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleReport}
                disabled={!reportReason.trim()}
              >
                Submit Report
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReportForm(false);
                  setReportReason("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="sr-only">Listing Details</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Listing Details</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
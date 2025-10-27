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
import { trackListingView } from "@/repo/contacts";
import MapMini from "./MapMini";
import { sanitizePhone } from "@/utils/sanitize";

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
      
      // Track listing view for legitimate interest
      trackListingView(listing.id).catch(console.error);
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
      const sanitized = sanitizePhone(listing.contact_phone);
      if (sanitized.length >= 10 && sanitized.length <= 15 && /^\+?\d{10,15}$/.test(sanitized)) {
        buttons.push({
          icon: Phone,
          label: "Call",
          href: `tel:${sanitized}`,
          variant: "default" as const
        });
      }
    }
    
    if (listing.contact_whatsapp) {
      const sanitized = sanitizePhone(listing.contact_whatsapp);
      if (sanitized.length >= 10 && sanitized.length <= 15 && /^\+?\d{10,15}$/.test(sanitized)) {
        buttons.push({
          icon: MessageCircle,
          label: "WhatsApp",
          href: `https://wa.me/${encodeURIComponent(sanitized.replace(/^\+/, ''))}`,
          variant: "default" as const
        });
      }
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
    <div className="relative">
      {/* Image with Overlay Controls */}
      {images.length > 0 && (
        <div className="relative h-[50vh] bg-muted">
          <img
            src={images[activeImageIndex]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={`w-10 h-10 bg-black/50 hover:bg-black/70 ${isSaved ? "text-red-500" : "text-white"}`}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-black/50 text-white hover:bg-black/70"
            >
              <ExternalLink className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setShowReportForm(true)}
            >
              <Flag className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setActiveImageIndex((prev) => 
                  prev === 0 ? images.length - 1 : prev - 1
                )}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setActiveImageIndex((prev) => 
                  prev === images.length - 1 ? 0 : prev + 1
                )}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {activeImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Title and Location */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold">{listing.title}</h2>
            {price && (
              <div className="text-2xl font-bold text-primary">{price}</div>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{listing.city}{listing.country && `, ${listing.country}`}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{listing.category}</Badge>
          {listing.subcategory && (
            <Badge variant="outline">{listing.subcategory}</Badge>
          )}
          {listing.tags?.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{listing.description}</p>
        </div>

        {/* Map */}
        {listing.lat && listing.lng && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Location</h3>
            <Card className="p-0 overflow-hidden">
              <div className="h-48">
                <MapMini lat={listing.lat} lng={listing.lng} />
              </div>
            </Card>
          </div>
        )}

        {/* Contact Buttons */}
        {contactButtons.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Contact</h3>
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
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-center gap-2"
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
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh] animate-slide-in-right">
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="sr-only">Listing Details</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
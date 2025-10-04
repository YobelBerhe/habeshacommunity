import { useState } from "react";
import { Copy, Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareMentorProfileProps {
  mentorId: string;
  referralCode: string;
}

export function ShareMentorProfile({ mentorId, referralCode }: ShareMentorProfileProps) {
  const { toast } = useToast();
  const shareUrl = `${window.location.origin}/mentor/${mentorId}?ref=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Your referral link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const shareToTwitter = () => {
    const text = `Book a mentorship session with me!`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  return (
    <div className="p-6 bg-card rounded-xl shadow-sm border">
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Share Your Profile</h3>
      </div>
      
      <p className="text-muted-foreground mb-4">
        Invite mentees directly by sharing your unique link and earn credits for referrals!
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Copy size={16} /> Copy Link
        </Button>

        <Button
          onClick={shareToTwitter}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Twitter size={16} /> Twitter
        </Button>

        <Button
          onClick={shareToFacebook}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Facebook size={16} /> Facebook
        </Button>

        <Button
          onClick={shareToLinkedIn}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Linkedin size={16} /> LinkedIn
        </Button>
      </div>
    </div>
  );
}

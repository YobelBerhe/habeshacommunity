import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { connectStripeAccount } from '@/utils/stripeActions';
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface ConnectStripeButtonProps {
  className?: string;
  cta?: string;
}

export function ConnectStripeButton({ className, cta = "Connect Stripe for Payouts" }: ConnectStripeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const result = await connectStripeAccount();
      if (result.url) {
        window.location.href = result.url; // Redirect to Stripe onboarding
        toast({
          title: "Redirecting to Stripe",
          description: "Complete the setup to receive payments.",
        });
      }
    } catch (error) {
      console.error('Connect failed:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button 
        onClick={handleConnect} 
        disabled={isLoading}
        className="inline-flex items-center rounded-lg px-4 py-2 bg-black text-white hover:opacity-90 disabled:opacity-50"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        {isLoading ? 'Connecting…' : cta}
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        You'll be redirected to Stripe to finish a quick, secure payout setup. You can return here when done.
      </p>
    </div>
  );
}
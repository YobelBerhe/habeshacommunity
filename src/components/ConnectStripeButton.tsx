import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { connectStripeAccount } from '@/utils/stripeActions';
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export function ConnectStripeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const result = await connectStripeAccount();
      if (result.url) {
        window.open(result.url, '_blank');
        toast({
          title: "Stripe Connect opened",
          description: "Complete the setup in the new tab to receive payments.",
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
    <Button 
      onClick={handleConnect} 
      disabled={isLoading}
      variant="outline"
    >
      <ExternalLink className="w-4 h-4 mr-2" />
      {isLoading ? 'Opening Stripe...' : 'Connect Payouts'}
    </Button>
  );
}
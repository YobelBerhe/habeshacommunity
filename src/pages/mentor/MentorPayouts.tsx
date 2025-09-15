import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConnectStripeButton } from '@/components/ConnectStripeButton';
import { CheckCircle, DollarSign, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function MentorPayouts() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const isConnected = searchParams.get('connected') === '1';

  useEffect(() => {
    if (isConnected) {
      toast({
        title: "Stripe Connected!",
        description: "Your payout account has been successfully connected.",
      });
    }
    checkConnectionStatus();
  }, [isConnected]);

  const checkConnectionStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('stripe_account_id')
          .eq('id', user.id)
          .single();
        
        setConnected(!!data?.stripe_account_id);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Mentor Payouts</h1>
          <p className="text-muted-foreground">
            Connect your Stripe account to receive payments from mentoring sessions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payout Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {connected ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Account Connected</p>
                  <p className="text-sm text-green-600">
                    Your Stripe account is connected and ready to receive payments
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    You need to connect your Stripe account to receive payments from mentoring sessions.
                  </p>
                </div>
                <ConnectStripeButton />
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-medium">How it works:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  When someone books a session with you, they pay through Stripe
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  The platform takes a 15% fee for facilitating the connection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  You receive 85% of the session fee directly to your bank account
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Payments are processed automatically within 2-7 business days
                </li>
              </ul>
            </div>

            {connected && (
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage Stripe Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Package, Check } from 'lucide-react';

interface BundlePurchaseProps {
  mentorId: string;
  singleSessionPrice: number;
  currency?: string;
}

const BUNDLE_OPTIONS = [
  { size: 3, discount: 0.1, label: 'Starter Pack', popular: false },
  { size: 5, discount: 0.15, label: 'Pro Pack', popular: true },
  { size: 10, discount: 0.20, label: 'Master Pack', popular: false },
];

export function BundlePurchase({ mentorId, singleSessionPrice, currency = 'USD' }: BundlePurchaseProps) {
  const [loading, setLoading] = useState<number | null>(null);
  const { toast } = useToast();

  const handlePurchaseBundle = async (bundleSize: number) => {
    try {
      setLoading(bundleSize);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to purchase bundles',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-bundle-checkout', {
        body: { mentorId, bundleSize },
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Bundle purchase error:', error);
      toast({
        title: 'Purchase failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const formatPrice = (cents: number) => {
    const amount = cents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Session Bundles</h3>
        <Badge variant="secondary">Save up to 20%</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {BUNDLE_OPTIONS.map((bundle) => {
          const bundlePrice = Math.round(singleSessionPrice * bundle.size * (1 - bundle.discount));
          const savings = (singleSessionPrice * bundle.size) - bundlePrice;
          const pricePerSession = Math.round(bundlePrice / bundle.size);

          return (
            <Card
              key={bundle.size}
              className={`p-6 relative ${
                bundle.popular ? 'border-primary shadow-lg' : ''
              }`}
            >
              {bundle.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}

              <div className="text-center space-y-4">
                <div>
                  <h4 className="text-xl font-bold">{bundle.label}</h4>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {bundle.size}
                  </p>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatPrice(bundlePrice)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatPrice(pricePerSession)} per session
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <Check className="w-4 h-4" />
                    Save {formatPrice(savings)}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (loading === null) {
                      handlePurchaseBundle(bundle.size);
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (loading === null) {
                      handlePurchaseBundle(bundle.size);
                    }
                  }}
                  disabled={loading !== null}
                  className="w-full touch-manipulation"
                  variant={bundle.popular ? 'default' : 'outline'}
                >
                  {loading === bundle.size ? 'Processing...' : `Buy ${bundle.size} Sessions`}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Credits never expire
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

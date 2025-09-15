import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConnectStripeButton } from "@/components/ConnectStripeButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, DollarSign } from "lucide-react";

export default function Payouts() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setConnected(false);
      const { data } = await supabase
        .from("users")
        .select("stripe_account_id")
        .eq("id", user.id)
        .maybeSingle();
      setConnected(!!(data as any)?.stripe_account_id);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Payouts</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Stripe Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connected === null ? (
            <p className="mt-4">Loading…</p>
          ) : connected ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Stripe is connected</p>
                <p className="text-sm text-green-600">You can accept paid bookings</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Connect your Stripe account to receive payments from mentoring sessions.
              </p>
              <ConnectStripeButton className="mt-4" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
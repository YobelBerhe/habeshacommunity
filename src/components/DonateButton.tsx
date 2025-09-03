import { useEffect, useMemo, useState } from "react";
import { getStripe } from "@/lib/stripeClient";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PRESETS = [500, 1000, 2000]; // $5, $10, $20

export default function DonateButton() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(PRESETS[0]);
  const [custom, setCustom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const displayAmount = useMemo(() => {
    const v = custom.trim();
    if (!v) return amount;
    const n = Math.round(parseFloat(v) * 100);
    if (Number.isFinite(n)) return n;
    return amount;
  }, [custom, amount]);

  const startCheckout = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-donation', {
        body: { amount: displayAmount, email }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to start checkout");
      }
    } catch (err) {
      console.error('Donation error:', err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Optional: preload Stripe on hover
  useEffect(() => {
    getStripe();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
      >
        💙 Support HabeshaCommunity
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Support HabeshaCommunity</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">
            Choose an amount or enter a custom donation.
          </p>

          <div className="flex gap-2 mb-4">
            {PRESETS.map((cents) => (
              <Button
                key={cents}
                variant={(!custom && amount === cents) ? "default" : "outline"}
                onClick={() => { setAmount(cents); setCustom(""); }}
                className="flex-1"
              >
                ${(cents / 100).toFixed(0)}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-amount">Custom amount (USD)</Label>
              <Input
                id="custom-amount"
                inputMode="decimal"
                placeholder="e.g. 7.50"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email (optional for receipt)</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              onClick={startCheckout}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Processing..." : `Donate $${(displayAmount / 100).toFixed(2)}`}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Powered by Stripe • Test mode enabled
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
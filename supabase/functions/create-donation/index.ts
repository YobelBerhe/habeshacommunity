import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔵 Donation function called");
    const { amount, email } = await req.json();
    console.log("📝 Request data:", { amount, email });

    // amount is in cents; validate range ($2 – $500)
    if (typeof amount !== "number" || amount < 200 || amount > 50000) {
      console.log("❌ Invalid amount:", amount);
      return new Response(JSON.stringify({ error: "Invalid amount" }), { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.log("❌ No Stripe secret key found");
      return new Response(JSON.stringify({ error: "Stripe not configured" }), { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log("✅ Stripe key found, initializing...");
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const origin = req.headers.get("origin") || "https://habeshacommunity.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Support HabeshaCommunity" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/donate/success?amt=${amount}`,
      cancel_url: `${origin}/donate/cancel`,
      metadata: { source: "habeshacommunity.com" },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("Stripe error", e?.message || e);
    return new Response(JSON.stringify({ error: "Server error" }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
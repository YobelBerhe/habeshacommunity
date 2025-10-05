import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error("Not authenticated");

    const { listingId, qty = 1 } = await req.json();

    // Fetch listing details
    const { data: listing, error: listingError } = await supabaseClient
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .single();

    if (listingError || !listing) throw new Error("Listing not found");

    // Check inventory for physical products
    if (listing.type === "physical" && listing.inventory !== null) {
      if (listing.inventory < qty) {
        throw new Error("Insufficient inventory");
      }
    }

    // Calculate pricing
    const subtotalCents = listing.price_cents * qty;
    const shippingCents = listing.type === "physical" ? 2000 : 0; // $20 flat rate or dynamic
    const platformFeeCents = Math.round(subtotalCents * 0.15); // 15% commission
    const totalCents = subtotalCents + shippingCents;

    // Create order record
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        buyer_id: user.id,
        seller_id: listing.user_id,
        listing_id: listingId,
        qty,
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        platform_fee_cents: platformFeeCents,
        total_cents: totalCents,
        currency: listing.currency || "USD",
        kind: listing.type || "digital",
        status: "created",
      })
      .select()
      .single();

    if (orderError || !order) throw new Error("Failed to create order");

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get seller's Stripe account (if using Connect)
    const { data: seller } = await supabaseClient
      .from("profiles")
      .select("stripe_account_id")
      .eq("id", listing.user_id)
      .single();

    // Create checkout session
    const sessionConfig: any = {
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: listing.currency || "USD",
            product_data: {
              name: listing.title,
              description: listing.description?.substring(0, 200),
              images: listing.images?.[0] ? [listing.images[0]] : undefined,
            },
            unit_amount: listing.price_cents,
          },
          quantity: qty,
        },
      ],
      success_url: `${req.headers.get("origin")}/order/success?order_id=${order.id}`,
      cancel_url: `${req.headers.get("origin")}/listing/${listingId}`,
      metadata: {
        order_id: order.id,
        listing_id: listingId,
        kind: listing.type || "digital",
      },
    };

    // Add shipping if physical
    if (listing.type === "physical" && shippingCents > 0) {
      sessionConfig.line_items.push({
        price_data: {
          currency: listing.currency || "USD",
          product_data: { name: "Shipping" },
          unit_amount: shippingCents,
        },
        quantity: 1,
      });
    }

    // Configure payment based on product type
    if (listing.type === "digital" && seller?.stripe_account_id) {
      // Direct split for digital (instant payout)
      sessionConfig.payment_intent_data = {
        application_fee_amount: platformFeeCents,
        transfer_data: { destination: seller.stripe_account_id },
      };
    } else if (listing.type === "physical") {
      // Manual capture for physical (escrow until delivery)
      sessionConfig.payment_intent_data = {
        capture_method: "manual",
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Update order with session ID
    await supabaseClient
      .from("orders")
      .update({ stripe_payment_intent: session.id })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({ url: session.url, orderId: order.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

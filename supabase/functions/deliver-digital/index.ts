import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch order and listing
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, listings(*)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) throw new Error("Order not found");
    if (order.kind !== "digital") throw new Error("Not a digital order");

    // Generate non-expiring but revocable delivery hash
    const hashData = `${order.id}-${order.buyer_id}-${order.listing_id}-${Deno.env.get("DELIVERY_SECRET") || "default-secret"}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(hashData);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const deliveryHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Update order with delivery hash
    await supabase
      .from("orders")
      .update({ delivery_link_hash: deliveryHash })
      .eq("id", orderId);

    const deliveryUrl = `${req.headers.get("origin")}/dl/${deliveryHash}`;

    // Send email to buyer with download link
    await supabase.functions.invoke("send-digital-delivery-email", {
      body: {
        buyerEmail: order.buyer_id,
        orderDetails: {
          title: order.listings.title,
          deliveryUrl,
          orderId: order.id,
        },
      },
    });

    return new Response(
      JSON.stringify({ success: true, deliveryUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Digital delivery error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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

    const { orderId, carrier, trackingNumber, labelUrl } = await req.json();

    // Verify user is the seller
    const { data: order } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("seller_id", user.id)
      .single();

    if (!order) throw new Error("Order not found or unauthorized");

    // Create or update fulfillment
    const { data: fulfillment, error: fulfillmentError } = await supabaseClient
      .from("fulfillments")
      .upsert({
        order_id: orderId,
        carrier,
        tracking_number: trackingNumber,
        label_url: labelUrl,
        status: "shipped",
      })
      .select()
      .single();

    if (fulfillmentError) throw fulfillmentError;

    // Update order status
    await supabaseClient
      .from("orders")
      .update({ status: "shipped" })
      .eq("id", orderId);

    // Send buyer email notification
    await supabaseClient.functions.invoke("send-shipping-notification", {
      body: {
        orderId,
        buyerId: order.buyer_id,
        carrier,
        trackingNumber,
      },
    });

    return new Response(
      JSON.stringify({ success: true, fulfillment }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Mark shipped error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

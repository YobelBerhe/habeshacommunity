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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.id) throw new Error("User not authenticated");

    const { mentorId, bundleSize } = await req.json();
    
    if (!mentorId || !bundleSize) {
      return new Response(JSON.stringify({ error: 'Missing mentorId or bundleSize' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get mentor details
    const { data: mentor, error: mentorError } = await supabase
      .from('mentors')
      .select('id, name, price_cents, currency, stripe_account_id, payouts_enabled')
      .eq('id', mentorId)
      .single();

    if (mentorError || !mentor) {
      return new Response(JSON.stringify({ error: 'Mentor not found' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (!mentor.stripe_account_id) {
      return new Response(JSON.stringify({ 
        error: 'This mentor has not connected their Stripe account yet. Please contact them to set up payments.' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (!mentor.payouts_enabled) {
      return new Response(JSON.stringify({ 
        error: 'Mentor payouts are being set up. Please try again in a few minutes.' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Calculate bundle pricing (apply discount for bundles)
    const singlePrice = mentor.price_cents || 5000;
    let bundleDiscount = 0;
    if (bundleSize === 3) bundleDiscount = 0.1; // 10% off
    if (bundleSize === 5) bundleDiscount = 0.15; // 15% off
    if (bundleSize === 10) bundleDiscount = 0.20; // 20% off

    const bundlePrice = Math.round(singlePrice * bundleSize * (1 - bundleDiscount));
    const platformFee = Math.round(bundlePrice * 0.15); // 15% platform fee

    const origin = req.headers.get("origin") || "http://localhost:8080";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/mentor/${mentorId}?bundle_success=true`,
      cancel_url: `${origin}/mentor/${mentorId}?bundle_cancelled=true`,
      line_items: [
        {
          price_data: {
            currency: (mentor.currency || "USD").toLowerCase(),
            unit_amount: bundlePrice,
            product_data: {
              name: `${bundleSize}-Session Bundle with ${mentor.name}`,
              description: `Save ${Math.round(bundleDiscount * 100)}% on ${bundleSize} mentorship sessions`,
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: mentor.stripe_account_id,
        },
      },
      metadata: {
        user_id: user.id,
        mentor_id: mentorId,
        bundle_size: bundleSize.toString(),
      },
    });

    console.log('Bundle checkout session created:', session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Bundle checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

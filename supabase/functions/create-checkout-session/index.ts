import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { buildJoinUrl } from "../_shared/meeting.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLATFORM_FEE_PERCENT = 0.15; // 15% fee

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) throw new Error("Not authenticated");

    const { mentorId } = await req.json();
    if (!mentorId) throw new Error("Mentor ID required");

    // Get mentor details
    const { data: mentor, error: mentorError } = await supabase
      .from('mentors')
      .select('*')
      .eq('id', mentorId)
      .single();

    if (mentorError || !mentor) throw new Error('Mentor not found');

    // Get mentor's Stripe account
    const { data: mentorUser, error: mentorUserError } = await supabase
      .from('users')
      .select('stripe_account_id')
      .eq('id', mentor.user_id)
      .single();

    if (mentorUserError || !mentorUser?.stripe_account_id) {
      throw new Error('Mentor has not connected payouts yet');
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('mentor_bookings')
      .insert({
        mentor_id: mentorId,
        mentee_id: user.id,
        status: 'pending',
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (bookingError) throw bookingError;

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const unitAmount = Math.max(100, Math.round(Number(mentor.price_cents))); 
    const feeAmount = Math.floor(unitAmount * PLATFORM_FEE_PERCENT);

    const origin = req.headers.get("origin") || "https://localhost:3000";
    const successUrl = `${origin}/mentor/booking-success?booking_id=${booking.id}`;
    const cancelUrl = `${origin}/mentor/${mentorId}?canceled=1`;

    // Create Stripe Checkout session with Connect
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: { 
            name: `Session with ${mentor.display_name}`,
            description: mentor.bio?.substring(0, 100) || '',
          },
          unit_amount: unitAmount,
        },
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        booking_id: booking.id,
        mentor_id: mentorId,
      },
      payment_intent_data: {
        application_fee_amount: feeAmount,
        transfer_data: { 
          destination: mentorUser.stripe_account_id 
        },
      },
    });

    // Update booking with Stripe session ID
    await supabase
      .from('mentor_bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
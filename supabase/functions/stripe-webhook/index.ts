import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { buildJoinUrl } from "../_shared/meeting.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2024-06-20",
    });

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    console.log('Webhook event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session?.metadata?.booking_id;
      
      if (bookingId) {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // Get booking and mentor details
        const { data: booking } = await supabase
          .from('mentor_bookings')
          .select(`
            id,
            mentor_id,
            mentors:mentor_id (
              meeting_provider,
              meeting_base_url
            )
          `)
          .eq('id', bookingId)
          .single();

        if (booking) {
          const mentor = booking.mentors as any;
          const joinUrl = buildJoinUrl(
            mentor?.meeting_provider,
            mentor?.meeting_base_url,
            bookingId
          );

          // Update booking status
          await supabase
            .from('mentor_bookings')
            .update({
              status: 'confirmed',
              payment_status: 'paid',
              join_url: joinUrl,
              join_expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
            })
            .eq('id', bookingId);

          console.log('Booking confirmed:', bookingId);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
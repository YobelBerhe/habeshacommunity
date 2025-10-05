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
      apiVersion: "2025-08-27.basil",
    });

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    console.log('Webhook event type:', event.type);

    // Handle Stripe Connect account updates
    if (event.type === 'account.updated') {
      const account = event.data.object as Stripe.Account;
      
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      const payoutsEnabled = account.charges_enabled && account.payouts_enabled;
      const onboardingRequired = !account.details_submitted || (account.requirements?.currently_due?.length ?? 0) > 0;

      await supabase
        .from('mentors')
        .update({
          payouts_enabled: payoutsEnabled,
          onboarding_required: onboardingRequired
        })
        .eq('stripe_account_id', account.id);

      console.log('Updated mentor account status:', account.id);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session?.metadata?.booking_id;
      const bundleSize = session?.metadata?.bundle_size;
      
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      // Handle bundle purchase
      if (bundleSize) {
        const userId = session?.metadata?.user_id;
        const mentorId = session?.metadata?.mentor_id;

        if (userId && mentorId) {
          await supabase
            .from('mentor_credits')
            .insert({
              user_id: userId,
              mentor_id: mentorId,
              bundle_size: parseInt(bundleSize),
              credits_left: parseInt(bundleSize),
              price_cents: session.amount_total,
              currency: session.currency?.toUpperCase() || 'USD',
            });

          console.log('Bundle credits created:', { userId, mentorId, bundleSize });
        }
      }
      // Handle single session booking
      else if (bookingId) {
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

          // Get payment intent details for fee tracking
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
          const charge = paymentIntent.charges?.data[0];

          // Update booking status with fee details
          await supabase
            .from('mentor_bookings')
            .update({
              status: 'confirmed',
              payment_status: 'paid',
              join_url: joinUrl,
              join_expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
              charge_id: charge?.id,
              transfer_id: charge?.transfer as string,
              application_fee_cents: paymentIntent.application_fee_amount,
              net_to_mentor_cents: paymentIntent.amount - (paymentIntent.application_fee_amount ?? 0),
            })
            .eq('id', bookingId);

          console.log('Booking confirmed with fee tracking:', bookingId);

          // Award badges after booking confirmation
          if (booking.mentor_id) {
            const { error: badgeError } = await supabase.rpc('award_badges', { 
              mentor_id: booking.mentor_id 
            });
            if (badgeError) {
              console.error('Error awarding badges:', badgeError);
            } else {
              console.log('Badges checked for mentor:', booking.mentor_id);
            }
          }
        }
      }
      // Handle product orders (digital/physical)
      else if (session?.metadata?.order_id) {
        const orderId = session.metadata.order_id;
        const kind = session.metadata.kind;

        // Update order status to paid
        await supabase
          .from('orders')
          .update({
            status: 'paid_pending_fulfillment',
            stripe_payment_intent: session.payment_intent as string,
          })
          .eq('id', orderId);

        // Get order details for ledger
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (order) {
          const sellerNet = order.subtotal_cents - order.platform_fee_cents;

          // Create ledger entries
          await supabase.from('ledger_entries').insert([
            {
              seller_id: order.seller_id,
              order_id: orderId,
              type: 'sale',
              amount_cents: sellerNet,
              note: 'Order payment received'
            },
            {
              seller_id: order.seller_id,
              order_id: orderId,
              type: 'commission',
              amount_cents: -order.platform_fee_cents,
              note: 'Platform commission (15%)'
            }
          ]);

          // Update seller balance (put on hold for physical, available for digital)
          if (kind === 'digital') {
            await supabase
              .from('seller_balances')
              .upsert({
                seller_id: order.seller_id,
                available_cents: sellerNet,
              }, { onConflict: 'seller_id' });

            // Deliver digital product
            await supabase.functions.invoke('deliver-digital', {
              body: { orderId }
            });
          } else {
            await supabase
              .from('seller_balances')
              .upsert({
                seller_id: order.seller_id,
                on_hold_cents: sellerNet,
              }, { onConflict: 'seller_id' });
          }

          console.log('Product order processed:', { orderId, kind, sellerNet });
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
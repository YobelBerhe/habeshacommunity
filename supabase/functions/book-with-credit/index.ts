import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { buildJoinUrl } from "../_shared/meeting.ts";

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

    const { mentorId, notes } = await req.json();
    
    if (!mentorId) {
      throw new Error("Missing mentorId");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check for available credits
    const { data: credits, error: creditsError } = await supabase
      .from('mentor_credits')
      .select('id, credits_left')
      .eq('user_id', user.id)
      .eq('mentor_id', mentorId)
      .gt('credits_left', 0)
      .order('purchased_at', { ascending: true })
      .limit(1);

    if (creditsError) {
      throw new Error('Error checking credits');
    }

    if (!credits || credits.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No credits available',
          needsPurchase: true 
        }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const creditRecord = credits[0];

    // Get mentor details for meeting URL
    const { data: mentor } = await supabase
      .from('mentors')
      .select('meeting_provider, meeting_base_url')
      .eq('id', mentorId)
      .single();

    // Decrement credit
    await supabase
      .from('mentor_credits')
      .update({ credits_left: creditRecord.credits_left - 1 })
      .eq('id', creditRecord.id);

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('mentor_bookings')
      .insert({
        user_id: user.id,
        mentor_id: mentorId,
        status: 'confirmed',
        payment_status: 'paid',
        used_credit: true,
        notes: notes || null,
      })
      .select()
      .single();

    if (bookingError) {
      // Rollback credit decrement
      await supabase
        .from('mentor_credits')
        .update({ credits_left: creditRecord.credits_left })
        .eq('id', creditRecord.id);
      throw bookingError;
    }

    // Generate join URL
    const joinUrl = buildJoinUrl(
      mentor?.meeting_provider,
      mentor?.meeting_base_url,
      booking.id
    );

    // Update booking with join URL
    await supabase
      .from('mentor_bookings')
      .update({
        join_url: joinUrl,
        join_expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      })
      .eq('id', booking.id);

    console.log('Booking created with credit:', booking.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        bookingId: booking.id,
        creditsLeft: creditRecord.credits_left - 1 
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Book with credit error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

// Helper function to create notifications
async function createNotification(supabase: any, userId: string, type: string, title: string, body?: string, link?: string) {
  try {
    await supabase.functions.invoke('create-notification', {
      body: { userId, type, title, body, link }
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set auth for this request
    const jwt = authHeader.replace('Bearer ', '');
    supabase.auth.setSession({ access_token: jwt, refresh_token: '' });
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'POST') {
      // Create booking request
      const body = await req.json();
      const { mentor_id, message } = body || {};
      
      if (!mentor_id) {
        return new Response(
          JSON.stringify({ error: 'mentor_id required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify mentor exists
      const { data: mentor, error: mentorError } = await supabase
        .from('mentors')
        .select('id,user_id,display_name')
        .eq('id', mentor_id)
        .single();

      if (mentorError || !mentor) {
        return new Response(
          JSON.stringify({ error: 'Mentor not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Prevent booking own mentor profile
      if (mentor.user_id === user.id) {
        return new Response(
          JSON.stringify({ error: 'Cannot book your own mentor profile' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase
        .from('mentor_bookings')
        .insert({
          mentor_id,
          mentee_id: user.id,
          message: (message || '').toString().slice(0, 2000),
          status: 'requested',
        })
        .select()
        .single();

      if (error) {
        console.error('Booking creation error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create notifications for booking creation
      await createNotification(
        supabase,
        mentor.user_id,
        'booking.created',
        'New mentor request',
        'You have a new session request.',
        '/mentor/requests'
      );

      await createNotification(
        supabase,
        user.id,
        'booking.sent',
        'Request sent',
        "We'll notify you when the mentor responds.",
        '/mentor/bookings'
      );

      return new Response(
        JSON.stringify({ ok: true, booking: data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle PATCH for updating booking status
    if (req.method === 'PATCH') {
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      const bookingId = pathParts[pathParts.length - 1];

      if (!bookingId) {
        return new Response(
          JSON.stringify({ error: 'Booking ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const body = await req.json();
      const { action } = body || {};
      
      if (!['accept', 'decline', 'cancel', 'complete'].includes(action)) {
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Load booking with mentor info
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          id, mentor_id, mentee_id, status,
          mentors:mentor_id(user_id)
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError || !booking) {
        return new Response(
          JSON.stringify({ error: 'Booking not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const mentorData = (booking.mentors as unknown) as { user_id: string } | null;
      const isMentor = mentorData?.user_id === user.id;
      const isMentee = booking.mentee_id === user.id;

      // Determine next status based on action and permissions
      let nextStatus: string | null = null;
      if (action === 'accept' && isMentor && booking.status === 'requested') {
        nextStatus = 'accepted';
      } else if (action === 'decline' && isMentor && ['requested', 'accepted'].includes(booking.status)) {
        nextStatus = 'declined';
      } else if (action === 'cancel' && (isMentee || isMentor) && ['requested', 'accepted'].includes(booking.status)) {
        nextStatus = 'cancelled';
      } else if (action === 'complete' && isMentor && booking.status === 'accepted') {
        nextStatus = 'completed';
      }

      if (!nextStatus) {
        return new Response(
          JSON.stringify({ error: 'Action not allowed for current state' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase
        .from('mentor_bookings')
        .update({ status: nextStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Booking update error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create notifications for status updates
      const targetUserId = isMentor ? booking.mentee_id : mentorData?.user_id;
      const statusMessages: Record<string, { title: string; body: string; link: string }> = {
        accepted: { title: 'Request accepted', body: 'Your mentor accepted your session request.', link: '/inbox' },
        declined: { title: 'Request declined', body: 'Your mentor declined the request.', link: '/mentor' },
        cancelled: { title: 'Request cancelled', body: 'This request was cancelled.', link: '/mentor/bookings' },
        completed: { title: 'Session completed', body: 'Your mentor marked the session completed.', link: '/mentor/bookings' },
      };

      const messageData = statusMessages[nextStatus];
      if (messageData) {
        await createNotification(
          supabase,
          targetUserId,
          `booking.${nextStatus}`,
          messageData.title,
          messageData.body,
          messageData.link
        );
      }

      return new Response(
        JSON.stringify({ ok: true, booking: data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
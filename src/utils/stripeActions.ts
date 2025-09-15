import { supabase } from '@/integrations/supabase/client';
import { getStripe } from '@/lib/stripeClient';

const PLATFORM_FEE_PERCENT = 0.15; // 15% fee

export async function bookMentorSession(mentorId: string) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not signed in');

    // Get mentor details
    const { data: mentor } = await supabase
      .from('mentors')
      .select('*')
      .eq('id', mentorId)
      .maybeSingle();

    if (!mentor) {
      throw new Error('Mentor not found');
    }

    // Create a booking row (pending)
    const { data: booking, error: bErr } = await supabase
      .from('mentor_bookings')
      .insert({
        mentor_id: mentorId,
        mentee_id: user.id,
        status: 'requested',
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (bErr) throw bErr;

    // For now, return booking ID for redirect
    // This will be updated when Stripe Connect is properly configured
    return { 
      success: true, 
      bookingId: booking.id,
      redirectUrl: `/mentor/booking-success?booking_id=${booking.id}`
    };
  } catch (error) {
    console.error('Booking error:', error);
    throw error;
  }
}
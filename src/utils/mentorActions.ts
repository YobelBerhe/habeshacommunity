import { supabase } from '@/integrations/supabase/client';

export async function requestMentorBooking(mentorId: string, message: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  
  const { error } = await supabase
    .from('mentor_bookings')
    .insert({
      mentor_id: mentorId,
      mentee_id: user.id,
      message: message.trim(),
      status: 'requested'
    });
    
  if (error) throw error;
  return { ok: true };
}

export async function updateBookingStatus(bookingId: string, status: 'accepted' | 'declined' | 'cancelled' | 'completed') {
  const { error } = await supabase
    .from('mentor_bookings')
    .update({ status })
    .eq('id', bookingId);
    
  if (error) throw error;
  return { ok: true };
}
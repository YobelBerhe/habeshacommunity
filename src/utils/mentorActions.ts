import { supabase } from '@/integrations/supabase/client';

export async function requestMentorBooking(mentorId: string, message: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  
  const { error } = await supabase
    .from('bookings')
    .insert([{
      mentor_id: mentorId,
      user_id: user.id,
      notes: message.trim(),
      status: 'pending'
    }] as any);
    
  if (error) throw error;
  return { ok: true };
}

export async function updateBookingStatus(bookingId: string, status: 'accepted' | 'declined' | 'cancelled' | 'completed') {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);
    
  if (error) throw error;
  return { ok: true };
}
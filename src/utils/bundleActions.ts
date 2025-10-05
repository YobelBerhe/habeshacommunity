import { supabase } from '@/integrations/supabase/client';

export async function bookSessionWithCredit(mentorId: string, slotId?: string, notes?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not signed in');

    const { data, error } = await supabase.functions.invoke('book-with-credit', {
      body: { mentorId, slotId, notes },
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Book with credit error:', error);
    throw error;
  }
}

export async function checkAvailableCredits(mentorId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { hasCredits: false, totalCredits: 0, credits: [] };

    const { data, error } = await supabase
      .from('mentor_credits')
      .select('id, credits_left, bundle_size')
      .eq('user_id', user.id)
      .eq('mentor_id', mentorId)
      .gt('credits_left', 0);

    if (error) throw error;

    const totalCredits = data?.reduce((sum, c) => sum + c.credits_left, 0) || 0;

    return {
      hasCredits: totalCredits > 0,
      totalCredits,
      credits: data || [],
    };
  } catch (error) {
    console.error('Check credits error:', error);
    return { hasCredits: false, totalCredits: 0, credits: [] };
  }
}

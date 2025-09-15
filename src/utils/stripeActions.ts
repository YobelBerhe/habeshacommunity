import { supabase } from '@/integrations/supabase/client';

export async function bookMentorSession(mentorId: string) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not signed in');

    // Call the edge function to create checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { mentorId }
    });

    if (error) throw error;

    return { 
      success: true, 
      redirectUrl: data.url
    };
  } catch (error) {
    console.error('Booking error:', error);
    throw error;
  }
}

export async function connectStripeAccount() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not signed in');

    const { data, error } = await supabase.functions.invoke('connect-stripe');
    if (error) throw error;

    return { url: data.url };
  } catch (error) {
    console.error('Connect Stripe error:', error);
    throw error;
  }
}
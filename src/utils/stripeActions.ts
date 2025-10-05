import { supabase } from '@/integrations/supabase/client';

export async function bookMentorSession(mentorId: string, slotId?: string) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not signed in');

    // Call the edge function to create checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { mentorId, slotId }
    });

    if (error) {
      // Extract error message from edge function response
      if (data?.error) {
        throw new Error(data.error);
      }
      throw error;
    }

    if (!data?.url) {
      throw new Error('Failed to create checkout session');
    }

    return { 
      success: true, 
      redirectUrl: data.url
    };
  } catch (error) {
    console.error('Booking error:', error);
    // Re-throw with a user-friendly message if it's a generic error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to book session. Please try again.');
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
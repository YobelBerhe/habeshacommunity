import { supabase } from '@/integrations/supabase/client';

export async function likeUser(targetUserId: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not signed in');
  
  // Send a notification via edge function (bypasses RLS safely)
  const { error } = await supabase.functions.invoke('create-notification', {
    body: {
      userId: targetUserId,
      type: 'match_like',
      title: 'Someone liked you!',
      body: 'You have a new like in Matchmaking.',
      link: '/match'
    },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  });

  if (error) console.error('Error creating like notification:', error);
  return { ok: true };
}

export async function passUser(targetUserId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  
  // For now, just skip without storing passes
  // Later we can implement with proper match_passes table
  console.log('User passed on:', targetUserId);
  return { ok: true };
}

export async function sendMessage(toUserId: string, body: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  // DM functionality requires additional database tables
  throw new Error('Direct messaging is not yet available');
}
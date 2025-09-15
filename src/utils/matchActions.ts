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
      body: 'You have a new like in Match & Connect.',
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
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!session || !user) throw new Error('Not signed in');

  // Get or create DM thread via RPC that bypasses RLS safely
  const { data: threadId, error: rpcError } = await supabase.rpc('get_or_create_dm_thread', { p_other_user: toUserId });
  if (rpcError) throw rpcError;

  const thread = threadId as unknown as string;

  // Ensure current user is a member (belt-and-braces in case RPC failed to add)
  const { data: membership } = await supabase
    .from('dm_members')
    .select('user_id')
    .eq('thread_id', thread)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!membership) {
    // Insert membership if missing
    const { error: memberInsertError } = await supabase
      .from('dm_members')
      .insert({ thread_id: thread, user_id: user.id });
    if (memberInsertError) console.warn('dm_members insert warning:', memberInsertError);
  }

  // Send message (policy: members can insert)
  const { error: messageError } = await supabase
    .from('dm_messages')
    .insert({
      thread_id: thread,
      sender_id: user.id,
      body
    });
  if (messageError) throw messageError;

  // Notify recipient via edge function (best-effort)
  const { error } = await supabase.functions.invoke('create-notification', {
    body: {
      userId: toUserId,
      type: 'match_message',
      title: 'New Message from Match',
      body: body.length > 80 ? body.substring(0, 80) + '…' : body,
      link: `/inbox?thread=${thread}`
    },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  });
  if (error) console.error('Error creating message notification:', error);

  return { ok: true, chatId: thread };
}
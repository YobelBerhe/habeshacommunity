import { supabase } from '@/integrations/supabase/client';

export async function likeUser(targetUserId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  
  // For now, we'll store likes in a simple way using notifications
  // Later we can create proper match_likes table
  const { error } = await supabase
    .from('notifications')
    .insert({ 
      user_id: targetUserId,
      type: 'match_like',
      title: 'Someone liked you!',
      body: 'You have a new match'
    });
    
  if (error && error.code !== '23505') {
    console.error('Error creating like:', error);
  }
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

  // Find or create chat thread
  const ids = [user.id, toUserId].sort();
  
  // Check for existing thread
  let { data: existing } = await supabase
    .from('dm_threads')
    .select(`
      id,
      dm_members!inner(user_id)
    `)
    .eq('dm_members.user_id', ids[0])
    .limit(1);

  let threadId;
  
  if (existing && existing.length > 0) {
    // Check if the other user is also in this thread
    const { data: otherMember } = await supabase
      .from('dm_members')
      .select('user_id')
      .eq('thread_id', existing[0].id)
      .eq('user_id', ids[1])
      .single();
      
    if (otherMember) {
      threadId = existing[0].id;
    }
  }
  
  if (!threadId) {
    // Create new thread
    const { data: newThread, error: threadError } = await supabase
      .from('dm_threads')
      .insert({})
      .select('id')
      .single();
      
    if (threadError) throw threadError;
    threadId = newThread.id;
    
    // Add both users to the thread
    const { error: membersError } = await supabase
      .from('dm_members')
      .insert([
        { thread_id: threadId, user_id: user.id },
        { thread_id: threadId, user_id: toUserId }
      ]);
      
    if (membersError) throw membersError;
  }

  // Send message
  const { error: messageError } = await supabase
    .from('dm_messages')
    .insert({
      thread_id: threadId,
      sender_id: user.id,
      body
    });

  if (messageError) throw messageError;

  return { ok: true, chatId: threadId };
}
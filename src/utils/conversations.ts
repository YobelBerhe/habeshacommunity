import { supabase } from '@/integrations/supabase/client';

export async function getOrCreateConversation(withUserId: string, initialMessage?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in to send messages');

  if (withUserId === user.id) {
    throw new Error("You can't start a conversation with yourself");
  }

  // Ensure consistent participant ordering
  const [p1, p2] = [user.id, withUserId].sort();

  // Try to find existing conversation (check both orders defensively)
  const { data: existing, error: findError } = await supabase
    .from('conversations')
    .select('id')
    .or(`and(participant1_id.eq.${p1},participant2_id.eq.${p2}),and(participant1_id.eq.${p2},participant2_id.eq.${p1})`)
    .limit(1)
    .maybeSingle();

  if (findError) throw findError;

  let conversationId = existing?.id as string | undefined;

  if (!conversationId) {
    const { data: created, error: insertError } = await supabase
      .from('conversations')
      .insert({ participant1_id: p1, participant2_id: p2 } as any)
      .select('id')
      .single();

    if (insertError) throw insertError;
    conversationId = created.id;
  }

  if (initialMessage && initialMessage.trim()) {
    const { error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: initialMessage.trim(),
      } as any);
    if (msgError) throw msgError;
  }

  return { conversationId };
}

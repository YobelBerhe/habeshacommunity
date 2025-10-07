import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export async function likeUser(targetUserId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  
  try {
    // Insert the like into the database
    const { error: likeError } = await supabase
      .from('likes')
      .insert({
        liker_id: user.id,
        liked_id: targetUserId
      });

    if (likeError) {
      // If like already exists, ignore the error
      if (!likeError.message.includes('duplicate')) {
        throw likeError;
      }
    }

    // Check if there's a mutual match (the trigger will handle creating the match)
    const { data: mutualLike } = await supabase
      .from('likes')
      .select('*')
      .eq('liker_id', targetUserId)
      .eq('liked_id', user.id)
      .maybeSingle();

    // If mutual like exists, send match notification via edge function
    if (mutualLike) {
      await supabase.functions.invoke('create-notification', {
        body: {
          userId: targetUserId,
          type: 'match_like',
          title: "It's a Match! 💙",
          body: 'You have a new match in Matchmaking.',
          link: '/match/matches'
        }
      });
    } else {
      // Send regular like notification
      await supabase.functions.invoke('create-notification', {
        body: {
          userId: targetUserId,
          type: 'match_like',
          title: 'Someone liked you!',
          body: 'You have a new like in Matchmaking.',
          link: '/match/discover'
        }
      });
    }

    return { ok: true, isMatch: !!mutualLike };
  } catch (error) {
    logger.log('Error in likeUser:', error);
    throw error;
  }
}

export async function passUser(targetUserId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  
  try {
    // Insert pass into database (optional - you can create a passes table later)
    // For now, just log it
    logger.log('User passed on:', targetUserId);
    return { ok: true };
  } catch (error) {
    logger.log('Error in passUser:', error);
    throw error;
  }
}

export async function sendMessage(toUserId: string, body: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  // DM functionality requires additional database tables
  throw new Error('Direct messaging is not yet available');
}
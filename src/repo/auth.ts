import { supabase } from '@/integrations/supabase/client';

export async function signInWithEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({ 
    email, 
    options: { 
      emailRedirectTo: `${window.location.origin}/`
    } 
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export function onAuthChange(cb: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => cb(session));
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.id ?? null;
}
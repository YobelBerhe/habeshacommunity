import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const [msg, setMsg] = useState('Finishing sign-in…');
  const navigate = useNavigate();
  const refresh = useAuth(s => s.refresh);

  useEffect(() => {
    (async () => {
      try {
        console.log('🔄 AuthCallback: Starting auth exchange...');
        
        // Required for PKCE/magic-link flows in SPAs
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) throw error;

        // Check session after exchange
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('✅ Session after exchange:', sessionData);

        await refresh(); // update zustand store
        setMsg('Signed in! Redirecting…');
      } catch (err: any) {
        console.error('❌ Auth callback error:', err);
        setMsg(err?.message ?? 'Could not complete sign-in.');
      } finally {
        setTimeout(() => {
          // Send them back home
          navigate('/', { replace: true });
        }, 800);
      }
    })();
  }, [navigate, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-muted-foreground">{msg}</p>
    </div>
  );
}
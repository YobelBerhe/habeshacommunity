import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback with session exchange
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error('Auth callback error:', error);
          // Try getting existing session as fallback
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) {
            navigate('/', { replace: true });
            return;
          }
          navigate('/auth/login?error=callback_failed');
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to home
          navigate('/', { replace: true });
        } else {
          // No session, redirect to login
          navigate('/auth/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        // Fallback to check for existing session
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            navigate('/', { replace: true });
          } else {
            navigate('/auth/login?error=callback_failed');
          }
        } catch {
          navigate('/auth/login?error=callback_failed');
        }
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Confirming your account...</h2>
        <p className="text-muted-foreground">Please wait while we sign you in.</p>
      </div>
    </div>
  );
}
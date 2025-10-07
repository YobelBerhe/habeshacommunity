import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface MatchFlowGuardProps {
  children: React.ReactNode;
}

interface ProfileStatus {
  hasProfile: boolean;
  hasCompletedOnboarding: boolean;
  hasCompletedQuiz: boolean;
}

export function MatchFlowGuard({ children }: MatchFlowGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProfileStatus();
  }, []);

  const checkProfileStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth/login?redirect=' + location.pathname);
        return;
      }

      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from('match_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Check if user has completed quiz
      const { data: answers } = await supabase
        .from('user_answers')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const hasProfile = !!profile;
      const hasCompletedQuiz = (answers?.length || 0) > 0;
      const currentPath = location.pathname;

      // Redirect based on profile status
      if (!hasProfile && currentPath !== '/match/onboarding') {
        navigate('/match/onboarding');
        return;
      }

      if (hasProfile && !hasCompletedQuiz && currentPath !== '/match/quiz' && currentPath !== '/match/onboarding') {
        navigate('/match/quiz');
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking profile status:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

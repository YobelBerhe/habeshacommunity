import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function VerificationCelebration() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkVerificationStatus();

    // Handle window resize for confetti
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: mentor, error } = await supabase
        .from('mentors')
        .select('is_verified, verification_celebrated')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      // Show celebration if verified and hasn't celebrated yet
      if (mentor?.is_verified && !mentor?.verification_celebrated) {
        setShowCelebration(true);
        markAsCelebrated();
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const markAsCelebrated = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('mentors')
        .update({ verification_celebrated: true })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking celebration:', error);
    }
  };

  const handleClose = () => {
    setShowCelebration(false);
  };

  if (!showCelebration) return null;

  return (
    <>
      {/* Confetti Effect */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.3}
      />

      {/* Celebration Banner */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-slide-in-right">
        <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-500 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <AlertTitle className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                  🎉 Congratulations! You're Now a Verified Mentor!
                </AlertTitle>
                <AlertDescription className="text-green-800 dark:text-green-200 space-y-2">
                  <p>
                    Your mentor profile has been approved and is now live with a verified badge!
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>You appear higher in mentor directory searches</li>
                    <li>Mentees can book sessions with confidence</li>
                    <li>You're eligible for featured listings</li>
                  </ul>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => navigate('/mentor/requests')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      View Bookings
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/account/settings')}
                    >
                      Update Availability
                    </Button>
                  </div>
                </AlertDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      </div>
    </>
  );
}

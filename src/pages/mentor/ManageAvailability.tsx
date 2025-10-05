import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import MentorHeader from '@/components/MentorHeader';
import AvailabilityManager from '@/components/mentor/AvailabilityManager';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function ManageAvailability() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    fetchMentorProfile();
  }, [user]);

  const fetchMentorProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mentors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      navigate('/mentor/onboarding');
      return;
    }

    setMentorId(data.id);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MentorHeader title="Manage Availability" backPath="/mentor/dashboard" />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!mentorId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Manage Availability" backPath="/mentor/dashboard" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Set Your Availability</h2>
              <p className="text-muted-foreground text-sm">
                Add time slots when you're available for mentorship sessions. Students will only be able to book during these times.
              </p>
            </CardContent>
          </Card>
          
          <AvailabilityManager mentorId={mentorId} />
        </div>
      </div>
    </div>
  );
}

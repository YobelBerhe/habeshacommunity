import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  status: string;
  payment_status: string;
  join_url: string | null;
  join_expires_at: string | null;
  mentor: {
    display_name: string;
    meeting_provider: string;
  };
}

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (!bookingId) {
      navigate('/mentor');
      return;
    }

    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('mentor_bookings')
        .select(`
          id,
          status,
          payment_status,
          join_url,
          join_expires_at,
          mentors:mentor_id (
            display_name,
            meeting_provider
          )
        `)
        .eq('id', bookingId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setBooking({
          ...data,
          mentor: data.mentors as any
        });
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = () => {
    if (booking?.join_url) {
      window.open(booking.join_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">Loading...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground">Booking not found</p>
                <Button 
                  onClick={() => navigate('/mentor')} 
                  className="mt-4"
                >
                  Back to Mentors
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isExpired = booking.join_expires_at && new Date(booking.join_expires_at) < new Date();
  const canJoin = booking.payment_status === 'paid' && booking.join_url && !isExpired;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Your session with <strong>{booking.mentor.display_name}</strong> has been booked successfully.
              </p>
            </div>

            {booking.payment_status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Payment is still processing. You'll receive access to the session once payment is confirmed.
                </p>
              </div>
            )}

            {canJoin && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 mb-2">
                    Your session is ready! Click below to join.
                  </p>
                  <p className="text-xs text-green-600">
                    Platform: {booking.mentor.meeting_provider}
                  </p>
                </div>
                <Button 
                  onClick={handleJoinSession}
                  className="w-full"
                  size="lg"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Join Session
                </Button>
              </div>
            )}

            {isExpired && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  This session link has expired. Please contact the mentor for assistance.
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => navigate('/mentor')}
                className="w-full"
              >
                Back to Mentors
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
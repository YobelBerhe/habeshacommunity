import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, X, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MentorBooking {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
  mentee_id: string;
}

export default function MentorRequests() {
  const [bookings, setBookings] = useState<MentorBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const loadBookings = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      if (!currentUser) {
        setLoading(false);
        return;
      }

      // Get mentor profile for this user
      const { data: mentor } = await supabase
        .from('mentors')
        .select('id')
        .eq('user_id', currentUser.id)
        .single();

      if (!mentor) {
        setLoading(false);
        return;
      }

      // Get bookings for this mentor
      const { data, error } = await supabase
        .from('bookings')
        .select('id, status, notes, created_at, user_id')
        .eq('mentor_id', mentor.id)
        .order('created_at', { ascending: false }) as any;

      if (error) {
        console.error('Error loading bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load booking requests",
          variant: "destructive"
        });
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error in loadBookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateBookingStatus = async (bookingId: string, action: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "Please log in to update bookings",
          variant: "destructive"
        });
        return;
      }

      const response = await supabase.functions.invoke('mentor-book', {
        body: { action },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Success",
        description: `Booking ${action}ed successfully`,
      });

      // Reload bookings
      loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      requested: 'secondary',
      accepted: 'default',
      declined: 'destructive',
      cancelled: 'outline',
      completed: 'default',
    };

    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading requests...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p>Please log in to view mentor requests.</p>
              <Link to="/auth/login" className="text-primary hover:underline mt-2 inline-block">
                Go to Login
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/mentor">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Mentors
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Mentor Requests</h1>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No booking requests yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      Session Request
                    </CardTitle>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(booking.created_at).toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {booking.message && (
                    <div>
                      <h4 className="font-medium mb-2">Message:</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {booking.message}
                      </p>
                    </div>
                  )}

                  {booking.status === 'requested' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateBookingStatus(booking.id, 'accept')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => updateBookingStatus(booking.id, 'decline')}
                        variant="destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  )}

                  {booking.status === 'accepted' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateBookingStatus(booking.id, 'complete')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                      <Button
                        onClick={() => updateBookingStatus(booking.id, 'cancel')}
                        variant="outline"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
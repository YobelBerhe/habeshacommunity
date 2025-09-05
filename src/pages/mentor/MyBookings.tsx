import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MyBooking {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
  mentor_id: string;
  mentors?: {
    display_name: string;
    city: string;
    country: string;
  };
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
        
        if (!currentUser) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('mentor_bookings')
          .select(`
            id, status, message, created_at, mentor_id,
            mentors (
              display_name, city, country
            )
          `)
          .eq('mentee_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading bookings:', error);
        } else {
          setBookings(data || []);
        }
      } catch (error) {
        console.error('Error in loadBookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

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
          <div className="text-center">Loading your bookings...</div>
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
              <p>Please log in to view your bookings.</p>
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
          <h1 className="text-3xl font-bold">My Mentor Requests</h1>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No booking requests yet. <Link to="/mentor" className="text-primary hover:underline">Browse mentors</Link> to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      Session with {booking.mentors?.display_name}
                    </CardTitle>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.mentors?.city}{booking.mentors?.country ? `, ${booking.mentors.country}` : ''} • {new Date(booking.created_at).toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent>
                  {booking.message && (
                    <div>
                      <h4 className="font-medium mb-2">Your message:</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {booking.message}
                      </p>
                    </div>
                  )}
                  
                  {booking.status === 'requested' && (
                    <div className="mt-4 text-sm text-muted-foreground">
                      Waiting for mentor response...
                    </div>
                  )}
                  
                  {booking.status === 'accepted' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">✓ Request accepted!</p>
                      <p className="text-green-700 text-sm">The mentor will contact you soon to schedule the session.</p>
                    </div>
                  )}
                  
                  {booking.status === 'completed' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 font-medium">✓ Session completed</p>
                      <p className="text-blue-700 text-sm">We hope you found the session helpful!</p>
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
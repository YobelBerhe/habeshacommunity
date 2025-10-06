import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Booking Confirmed" backPath="/mentor" />
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
                Your mentoring session has been booked successfully.
              </p>
              {bookingId && (
                <p className="text-sm text-muted-foreground mt-2">
                  Booking ID: {bookingId}
                </p>
              )}
            </div>
            <div className="pt-4">
              <Button 
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
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, MessageSquare, Settings, CheckCircle2, Clock, Users } from 'lucide-react';
import Header from '@/components/Header';
import MobileHeader from '@/components/layout/MobileHeader';
import { getAppState } from '@/utils/storage';
import VerificationCelebration from '@/components/VerificationCelebration';
import { VerificationBadge } from '@/components/VerificationBadge';
import MentorSkillsEditor from '@/components/MentorSkillsEditor';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MentorData {
  id: string;
  display_name: string;
  bio: string;
  is_verified: boolean;
  available: boolean;
  price_cents: number;
  currency: string;
  topics: string[];
}

interface BookingStat {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
}

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [stats, setStats] = useState<BookingStat>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const appState = getAppState();

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }

      // Fetch mentor profile
      const { data: mentorData, error: mentorError } = await supabase
        .from('mentors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (mentorError) throw mentorError;

      if (!mentorData) {
        navigate('/mentor/onboarding');
        return;
      }

      setMentor(mentorData);

      // Fetch booking stats
      const { data: bookings, error: bookingsError } = await supabase
        .from('mentor_bookings')
        .select('status')
        .eq('mentor_id', mentorData.id);

      if (bookingsError) throw bookingsError;

      if (bookings) {
        setStats({
          total: bookings.length,
          pending: bookings.filter(b => b.status === 'pending').length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          completed: bookings.filter(b => b.status === 'completed').length
        });
      }
    } catch (error) {
      console.error('Error fetching mentor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number, currency: string) => {
    const amount = cents / 100;
    return `${currency} ${amount.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <Header 
          currentCity={appState.city}
          onCityChange={() => {}}
          onAccountClick={() => {}}
          onLogoClick={() => navigate('/')}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header 
        currentCity={appState.city}
        onCityChange={() => {}}
        onAccountClick={() => {}}
        onLogoClick={() => navigate('/')}
      />

      {/* Verification Celebration Component */}
      <VerificationCelebration />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
                {mentor?.is_verified && <VerificationBadge isVerified={true} />}
              </div>
              <p className="text-muted-foreground">Welcome back, {mentor?.display_name}!</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/account/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => navigate(`/mentor/${mentor?.id}`)}>
                View My Profile
              </Button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <Badge variant={mentor?.available ? 'default' : 'secondary'} className="text-sm">
              {mentor?.available ? 'Available for Booking' : 'Unavailable'}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmed}</div>
              <p className="text-xs text-muted-foreground">Upcoming sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Total sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/mentor/requests')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Booking Requests
              </CardTitle>
              <CardDescription>
                Manage your mentoring session requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Requests
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/mentor/bookings')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                My Bookings
              </CardTitle>
              <CardDescription>
                View all your scheduled and past sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Schedule
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/mentor/payouts')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payouts
              </CardTitle>
              <CardDescription>
                Manage your earnings and payout settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Earnings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Your Mentor Profile</CardTitle>
            <CardDescription>
              Keep your profile up to date to attract more mentees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Current Rate</h3>
              <p className="text-2xl font-bold text-primary">
                {mentor && formatPrice(mentor.price_cents, mentor.currency)}/session
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Topics</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">Edit Skills</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Your Skills</DialogTitle>
                      <DialogDescription>
                        Update your skills to help mentees find you more easily
                      </DialogDescription>
                    </DialogHeader>
                    {mentor && (
                      <MentorSkillsEditor 
                        mentorId={mentor.id}
                        onSkillsUpdated={() => {
                          fetchMentorData();
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-2">
                {mentor?.topics?.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-muted-foreground line-clamp-3">{mentor?.bio}</p>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/account/settings')}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

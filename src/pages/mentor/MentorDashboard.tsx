import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfMonth, endOfMonth, startOfYear } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComp } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, DollarSign, MessageSquare, Settings, CheckCircle2, Clock, Users, CalendarIcon, TrendingUp } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import VerificationCelebration from '@/components/VerificationCelebration';
import { VerificationBadge } from '@/components/VerificationBadge';
import MentorSkillsEditor from '@/components/MentorSkillsEditor';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShareMentorProfile } from '@/components/ShareMentorProfile';

type DateRange = {
  from: Date;
  to: Date;
};

interface MentorData {
  id: string;
  display_name: string;
  bio: string;
  is_verified: boolean;
  available: boolean;
  price_cents: number;
  currency: string;
  topics: string[];
  referral_code?: string;
}

interface BookingStat {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  earnings: number;
}

const presetRanges = [
  { label: "Today", days: 0 },
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "This Month", special: "thisMonth" },
  { label: "Last Month", special: "lastMonth" },
  { label: "This Year", special: "thisYear" },
];

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [stats, setStats] = useState<BookingStat>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    earnings: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const applyPreset = (preset: typeof presetRanges[0]) => {
    const now = new Date();
    if (preset.special === "thisMonth") {
      setDateRange({ from: startOfMonth(now), to: now });
    } else if (preset.special === "lastMonth") {
      const lastMonth = subDays(startOfMonth(now), 1);
      setDateRange({ from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) });
    } else if (preset.special === "thisYear") {
      setDateRange({ from: startOfYear(now), to: now });
    } else {
      setDateRange({ from: subDays(now, preset.days), to: now });
    }
  };

  useEffect(() => {
    fetchMentorData();
  }, [dateRange]);

  const fetchMentorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }

      // Fetch mentor profile with referral code from profiles
      const { data: mentorData, error: mentorError } = await supabase
        .from('mentors')
        .select('*, referral_code:user_id(referral_code)')
        .eq('user_id', user.id)
        .maybeSingle();

      // Flatten referral_code if nested
      if (mentorData && mentorData.referral_code && typeof mentorData.referral_code === 'object') {
        mentorData.referral_code = (mentorData.referral_code as any).referral_code;
      }

      if (mentorError) throw mentorError;

      if (!mentorData) {
        navigate('/mentor/onboarding');
        return;
      }

      setMentor(mentorData);

      // Fetch ALL confirmed bookings for badge progress (not just date range)
      const { data: allBookings } = await supabase
        .from('mentor_bookings')
        .select('id, status')
        .eq('mentor_id', mentorData.id)
        .eq('status', 'confirmed');

      setSessionCount(allBookings?.length || 0);

      // Fetch average rating
      const { data: reviews } = await supabase
        .from('mentor_reviews')
        .select('rating')
        .eq('mentor_id', mentorData.id);

      if (reviews && reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setAvgRating(avg);
      }

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('mentor_badges')
        .select('*')
        .eq('mentor_id', mentorData.id)
        .order('earned_at', { ascending: false });

      if (badgesData) {
        setBadges(badgesData);
      }

      // Fetch booking stats filtered by date range
      const { data: bookings, error: bookingsError } = await supabase
        .from('mentor_bookings')
        .select('status, net_to_mentor_cents, created_at')
        .eq('mentor_id', mentorData.id)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      if (bookingsError) throw bookingsError;

      if (bookings) {
        const totalEarnings = bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + (b.net_to_mentor_cents || 0), 0) / 100;

        setStats({
          total: bookings.length,
          pending: bookings.filter(b => b.status === 'pending').length,
          confirmed: bookings.filter(b => b.status === 'accepted').length,
          completed: bookings.filter(b => b.status === 'completed').length,
          earnings: totalEarnings
        });

        // Chart data by day
        const byDay: Record<string, number> = {};
        bookings
          .filter(b => b.status === 'completed')
          .forEach((b) => {
            const day = new Date(b.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            byDay[day] = (byDay[day] || 0) + (b.net_to_mentor_cents || 0) / 100;
          });

        setChartData(
          Object.keys(byDay).map((d) => ({ day: d, earnings: byDay[d] }))
        );
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
        <MentorHeader title="Mentor Dashboard" backPath="/" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Mentor Dashboard" backPath="/" />
      
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

        {/* Share Profile Section */}
        {mentor?.referral_code && (
          <div className="mb-6">
            <ShareMentorProfile 
              mentorId={mentor.id} 
              referralCode={mentor.referral_code} 
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="mb-6">
          {/* Date Range Picker with Presets */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">Performance Period</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {presetRanges.map((preset) => (
                  <Button
                    key={preset.label}
                    onClick={() => applyPreset(preset)}
                    variant="outline"
                    size="sm"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComp
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={{ from: dateRange?.from, to: dateRange?.to }}
                    onSelect={(range: any) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                      }
                    }}
                    numberOfMonths={2}
                    disabled={(date) => date > new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.earnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Selected period</p>
            </CardContent>
          </Card>
        </div>

        {/* Badge Progress Section */}
        <Card className="mb-8 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏆 Badge Progress
            </CardTitle>
            <CardDescription>
              Earn badges to increase your visibility and build trust with mentees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Badges */}
            {badges.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Your Badges</h3>
                <div className="flex flex-wrap gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full border-2 border-yellow-400 shadow-md"
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <span className="font-medium">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Milestone Progress */}
            {(() => {
              const milestones = [
                { label: 'Bronze Mentor', icon: '🥉', threshold: 10 },
                { label: 'Silver Mentor', icon: '🥈', threshold: 50 },
                { label: 'Gold Mentor', icon: '🥇', threshold: 100 },
              ];
              const nextMilestone = milestones.find(m => sessionCount < m.threshold);
              const progressPercent = nextMilestone
                ? Math.min(100, (sessionCount / nextMilestone.threshold) * 100)
                : 100;

              return (
                <div>
                  <h3 className="font-semibold mb-3">Session Milestones</h3>
                  {nextMilestone ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm">
                          <span className="font-bold text-lg">{sessionCount}</span>
                          <span className="text-muted-foreground"> / {nextMilestone.threshold} sessions</span>
                        </p>
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          Next: {nextMilestone.icon} {nextMilestone.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500 flex items-center justify-center"
                          style={{ width: `${progressPercent}%` }}
                        >
                          {progressPercent > 15 && (
                            <span className="text-xs text-white font-bold">
                              {Math.round(progressPercent)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {nextMilestone.threshold - sessionCount} more session{nextMilestone.threshold - sessionCount !== 1 ? 's' : ''} to unlock!
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-yellow-400">
                      <p className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
                        <span className="text-2xl">🎉</span>
                        You&apos;ve unlocked all milestone badges!
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Top Rated Badge Status */}
            <div>
              <h3 className="font-semibold mb-3">Quality Badge</h3>
              {avgRating !== null && avgRating >= 4.8 ? (
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-yellow-400">
                  <p className="text-yellow-600 dark:text-yellow-400 font-semibold flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    You&apos;ve earned the Top Rated Mentor badge! (Rating: {avgRating.toFixed(2)})
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                  <p className="text-sm">
                    <span className="font-medium">Top Rated ⭐:</span> Maintain a 4.8+ average rating
                    {avgRating !== null && (
                      <span className="block mt-1 text-muted-foreground">
                        Current rating: {avgRating.toFixed(2)} ({(4.8 - avgRating).toFixed(2)} away from Top Rated)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="link"
                className="text-sm px-0"
                onClick={() => navigate('/badges')}
              >
                Learn more about badges →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Chart */}
        {chartData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Earnings Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="hsl(var(--primary))"
                    name="Earnings ($)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

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
              onClick={() => navigate('/mentor/onboarding')}
            >
              Edit Mentor Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

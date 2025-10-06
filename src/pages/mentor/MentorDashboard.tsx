import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfMonth, endOfMonth, startOfYear } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComp } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, DollarSign, MessageSquare, Settings, CheckCircle2, Clock, Users, CalendarIcon, TrendingUp, Star, Zap, Award, BarChart3 } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import VerificationCelebration from '@/components/VerificationCelebration';
import { VerificationBadge } from '@/components/VerificationBadge';
import MentorSkillsEditor from '@/components/MentorSkillsEditor';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ShareMentorProfile } from '@/components/ShareMentorProfile';
import { AnimatedCounter } from '@/components/AnimatedCounter';

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
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "This Month", special: "thisMonth" },
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

      const { data: mentorData, error: mentorError } = await supabase
        .from('mentors')
        .select('*, referral_code:user_id(referral_code)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (mentorData && mentorData.referral_code && typeof mentorData.referral_code === 'object') {
        mentorData.referral_code = (mentorData.referral_code as any).referral_code;
      }

      if (mentorError) throw mentorError;

      if (!mentorData) {
        navigate('/mentor/onboarding');
        return;
      }

      setMentor(mentorData);

      const { data: allBookings } = await supabase
        .from('mentor_bookings')
        .select('id, status')
        .eq('mentor_id', mentorData.id)
        .eq('status', 'confirmed');

      setSessionCount(allBookings?.length || 0);

      const { data: reviews } = await supabase
        .from('mentor_reviews')
        .select('rating')
        .eq('mentor_id', mentorData.id);

      if (reviews && reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setAvgRating(avg);
      }

      const { data: badgesData } = await supabase
        .from('mentor_badges')
        .select('*')
        .eq('mentor_id', mentorData.id)
        .order('earned_at', { ascending: false });

      if (badgesData) {
        setBadges(badgesData);
      }

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
      <PageTransition>
      <div className="min-h-screen bg-background">
        <MentorHeader title="Mentor Dashboard" backPath="/" />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <MentorHeader title="Mentor Dashboard" backPath="/" />
      
      <VerificationCelebration />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                {mentor?.is_verified && <VerificationBadge isVerified={true} />}
              </div>
              <p className="text-muted-foreground">Welcome back, {mentor?.display_name}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/account/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => navigate(`/mentor/${mentor?.id}`)}>
                View Profile
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Badge variant={mentor?.available ? 'default' : 'secondary'} className="text-sm">
              {mentor?.available ? 'Available for Booking' : 'Unavailable'}
            </Badge>
          </div>
        </div>

        {/* Share Profile */}
        {mentor?.referral_code && (
          <div className="mb-6">
            <ShareMentorProfile 
              mentorId={mentor.id} 
              referralCode={mentor.referral_code} 
            />
          </div>
        )}

        {/* Date Range Picker */}
        <Card className="mb-6 border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Performance Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {presetRanges.map((preset) => (
                <Button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  variant="outline"
                  size="sm"
                  className="h-8"
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
                    "w-full justify-start text-left font-normal h-10",
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
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold">
                  <AnimatedCounter value={stats.total} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">All time sessions</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-2xl" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  <AnimatedCounter value={stats.pending} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Confirmed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-2xl" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  <AnimatedCounter value={stats.confirmed} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Upcoming sessions</p>
              </CardContent>
            </Card>
          </motion.div>
          {/* Completed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  <AnimatedCounter value={stats.completed} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total sessions done</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer group" onClick={() => navigate('/mentor/requests')}>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-base">Booking Requests</CardTitle>
              <CardDescription className="text-sm">
                Manage incoming session requests
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer group" onClick={() => navigate('/mentor/bookings')}>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-base">My Bookings</CardTitle>
              <CardDescription className="text-sm">
                View scheduled and past sessions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer group" onClick={() => navigate('/mentor/availability')}>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-base">Availability</CardTitle>
              <CardDescription className="text-sm">
                Set your available time slots
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer group" onClick={() => navigate('/mentor/payouts')}>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-base">Payouts</CardTitle>
              <CardDescription className="text-sm">
                Manage earnings and payments
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Enhanced Badge Progress */}
        <Card className="mb-8 overflow-hidden border-2">
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30">
            <CardHeader className="border-b bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Badge Progress
              </CardTitle>
              <CardDescription>
                Earn badges to boost your visibility and credibility
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {badges.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    Your Badges
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full border-2 border-amber-400 shadow-md hover:shadow-lg transition-shadow"
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
                  { label: 'Bronze Mentor', icon: '🥉', threshold: 10, color: 'from-orange-400 to-amber-600' },
                  { label: 'Silver Mentor', icon: '🥈', threshold: 50, color: 'from-gray-300 to-gray-500' },
                  { label: 'Gold Mentor', icon: '🥇', threshold: 100, color: 'from-yellow-400 to-amber-500' },
                ];
                const nextMilestone = milestones.find(m => sessionCount < m.threshold);
                const progressPercent = nextMilestone
                  ? Math.min(100, (sessionCount / nextMilestone.threshold) * 100)
                  : 100;

                return (
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Session Milestones
                    </h3>
                    {nextMilestone ? (
                      <div className="space-y-3 p-4 bg-white dark:bg-gray-900 rounded-xl border-2">
                        <div className="flex justify-between items-center">
                          <p className="text-sm">
                            <span className="font-bold text-2xl text-primary">{sessionCount}</span>
                            <span className="text-muted-foreground"> / {nextMilestone.threshold} sessions</span>
                          </p>
                          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 px-3 py-1.5 rounded-full border">
                            <span className="text-xl">{nextMilestone.icon}</span>
                            <span className="text-sm font-semibold">{nextMilestone.label}</span>
                          </div>
                        </div>
                        <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${nextMilestone.color} transition-all duration-500 relative`}
                            style={{ width: `${progressPercent}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </div>
                        </div>
                        <p className="text-sm text-center text-muted-foreground">
                          <span className="font-semibold text-foreground">{nextMilestone.threshold - sessionCount}</span> more session{nextMilestone.threshold - sessionCount !== 1 ? 's' : ''} to unlock {nextMilestone.icon}
                        </p>
                      </div>
                    ) : (
                      <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-xl border-2 border-amber-400">
                        <p className="text-center font-semibold flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300">
                          <Zap className="w-5 h-5" />
                          You've unlocked all milestone badges!
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Top Rated Status */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Quality Badge
                </h3>
                {avgRating !== null && avgRating >= 4.8 ? (
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-xl border-2 border-yellow-400">
                    <p className="font-semibold flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      Top Rated Mentor ({avgRating.toFixed(2)} ⭐)
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border-2">
                    <p className="text-sm mb-2">
                      <span className="font-medium">Top Rated ⭐:</span> Maintain a 4.8+ average rating
                    </p>
                    {avgRating !== null && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Current: {avgRating.toFixed(2)}</span>
                          <span className="text-muted-foreground">{(4.8 - avgRating).toFixed(2)} away</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all"
                            style={{ width: `${(avgRating / 4.8) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                variant="link"
                className="text-sm px-0"
                onClick={() => navigate('/badges')}
              >
                Learn more about badges →
              </Button>
            </CardContent>
          </div>
        </Card>

        {/* Enhanced Earnings Chart */}
        {chartData.length > 0 && (
          <Card className="mb-8 border-2">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Earnings Over Time
              </CardTitle>
              <CardDescription>
                Track your earnings for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    className="text-xs" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                    formatter={(value: any) => [`$${value.toFixed(2)}`, 'Earnings']}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#earningsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Profile Info */}
        <Card className="border-2">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle>Your Mentor Profile</CardTitle>
            <CardDescription>
              Keep your profile current to attract more mentees
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Current Rate
              </h3>
              <p className="text-3xl font-bold text-primary">
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
                        Update your skills to help mentees find you
                      </DialogDescription>
                    </DialogHeader>
                    {mentor && (
                      <MentorSkillsEditor 
                        mentorId={mentor.id}
                        onSkillsUpdated={fetchMentorData}
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
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </PageTransition>
  );
}

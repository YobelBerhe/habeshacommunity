import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { exportToCSV } from "@/utils/csvExport";
import { format, subDays, startOfMonth, endOfMonth, startOfYear } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Download, TrendingUp, DollarSign, Users, ArrowLeft, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TopReferrersLeaderboard } from "./TopReferrersLeaderboard";

type DateRange = {
  from: Date;
  to: Date;
};

type Timeframe = "7days" | "month" | "all";

interface MentorStats {
  name: string;
  sessions: number;
  earnings: number;
}

interface ChartDataPoint {
  day: string;
  processed: number;
  revenue: number;
  payouts: number;
}

const presetRanges = [
  { label: "Today", days: 0 },
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "This Month", special: "thisMonth" },
  { label: "Last Month", special: "lastMonth" },
  { label: "This Year", special: "thisYear" },
];

export default function AdminMetrics() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    totalProcessed: 0,
    platformRevenue: 0,
    mentorPayouts: 0,
  });
  const [topMentors, setTopMentors] = useState<MentorStats[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
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

  const fetchMetrics = async () => {
    setLoading(true);
    let query = supabase
      .from("mentor_bookings")
      .select("id, application_fee_cents, net_to_mentor_cents, status, mentor_id, created_at")
      .eq("status", "completed")
      .gte("created_at", dateRange.from.toISOString())
      .lte("created_at", dateRange.to.toISOString());

    const { data: bookings } = await query;

    if (!bookings) {
      setLoading(false);
      return;
    }

    const totalBookings = bookings.length;
    const totalProcessed = bookings.reduce((s, b) => {
      const appFee = b.application_fee_cents || 0;
      const mentorPayout = b.net_to_mentor_cents || 0;
      return s + appFee + mentorPayout;
    }, 0) / 100;
    const platformRevenue = bookings.reduce((s, b) => s + (b.application_fee_cents || 0), 0) / 100;
    const mentorPayouts = bookings.reduce((s, b) => s + (b.net_to_mentor_cents || 0), 0) / 100;

    // Group mentors
    const mentorMap: Record<string, MentorStats> = {};
    bookings.forEach((b) => {
      if (!b.mentor_id) return;
      if (!mentorMap[b.mentor_id]) {
        mentorMap[b.mentor_id] = { name: b.mentor_id, sessions: 0, earnings: 0 };
      }
      mentorMap[b.mentor_id].sessions += 1;
      mentorMap[b.mentor_id].earnings += (b.net_to_mentor_cents || 0) / 100;
    });

    const topMentors = Object.values(mentorMap)
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5);

    // Chart data by day
    const byDay: Record<string, { processed: number; revenue: number; payouts: number }> = {};
    bookings.forEach((b) => {
      const day = new Date(b.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!byDay[day]) {
        byDay[day] = { processed: 0, revenue: 0, payouts: 0 };
      }
      const appFee = b.application_fee_cents || 0;
      const mentorPayout = b.net_to_mentor_cents || 0;
      byDay[day].processed += (appFee + mentorPayout) / 100;
      byDay[day].revenue += appFee / 100;
      byDay[day].payouts += mentorPayout / 100;
    });

    const chartData = Object.keys(byDay).map((d) => ({
      day: d,
      processed: Number(byDay[d].processed.toFixed(2)),
      revenue: Number(byDay[d].revenue.toFixed(2)),
      payouts: Number(byDay[d].payouts.toFixed(2)),
    }));

    setMetrics({ totalBookings, totalProcessed, platformRevenue, mentorPayouts });
    setTopMentors(topMentors);
    setChartData(chartData);
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  const handleExportMentors = () => {
    if (!topMentors || topMentors.length === 0) return;
    const dateStr = `${format(dateRange.from, 'yyyy-MM-dd')}_to_${format(dateRange.to, 'yyyy-MM-dd')}`;
    exportToCSV(topMentors, `top-mentors-${dateStr}.csv`);
  };

  const handleExportRevenue = () => {
    if (!chartData || chartData.length === 0) return;
    const dateStr = `${format(dateRange.from, 'yyyy-MM-dd')}_to_${format(dateRange.to, 'yyyy-MM-dd')}`;
    exportToCSV(chartData, `revenue-data-${dateStr}.csv`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Date Range Picker with Presets */}
            <div className="space-y-2 mb-4">
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
                  <Calendar
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
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button onClick={handleExportMentors} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Mentors
              </Button>
              <Button onClick={handleExportRevenue} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Revenue
              </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalBookings}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Processed</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${metrics.totalProcessed.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${metrics.platformRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Payouts</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${metrics.mentorPayouts.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Top Mentors */}
            {topMentors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Mentors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topMentors.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {i + 1}
                          </div>
                          <span className="font-medium text-sm">{m.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">${m.earnings.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{m.sessions} sessions</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {!loading && chartData.length === 0 && (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground text-sm">
                    No booking data available for the selected timeframe.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="revenue">
            {/* Revenue Chart */}
            {chartData.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Revenue Growth</CardTitle>
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
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line
                        type="monotone"
                        dataKey="processed"
                        stroke="hsl(var(--primary))"
                        name="Processed"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--chart-1))"
                        name="Revenue"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="payouts"
                        stroke="hsl(var(--chart-2))"
                        name="Payouts"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground text-sm">
                    No revenue data available for the selected timeframe.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>🏆 Top Referrers</CardTitle>
              </CardHeader>
              <CardContent>
                <TopReferrersLeaderboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Parser } from "json2csv";
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
import { Download, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";

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

export default function AdminMetrics() {
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    totalProcessed: 0,
    platformRevenue: 0,
    mentorPayouts: 0,
  });
  const [topMentors, setTopMentors] = useState<MentorStats[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>("all");
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    let query = supabase
      .from("mentor_bookings")
      .select("id, application_fee_cents, net_to_mentor_cents, status, mentor_id, created_at")
      .eq("status", "completed");

    if (timeframe === "7days") {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte("created_at", sevenDaysAgo);
    }
    if (timeframe === "month") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      query = query.gte("created_at", startOfMonth.toISOString());
    }

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
  }, [timeframe]);

  const handleExportMentors = () => {
    if (!topMentors || topMentors.length === 0) return;
    const parser = new Parser();
    const csv = parser.parse(topMentors);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `top-mentors-${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportRevenue = () => {
    if (!chartData || chartData.length === 0) return;
    const parser = new Parser();
    const csv = parser.parse(chartData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `revenue-data-${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">📊 Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform performance and metrics</p>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={handleExportMentors} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Top Mentors
        </Button>
        <Button onClick={handleExportRevenue} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Revenue Data
        </Button>
      </div>

      {/* Timeframe Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: "Last 7 Days", value: "7days" as Timeframe, icon: Calendar },
          { label: "This Month", value: "month" as Timeframe, icon: Calendar },
          { label: "All Time", value: "all" as Timeframe, icon: TrendingUp },
        ].map((f) => (
          <Button
            key={f.value}
            onClick={() => setTimeframe(f.value)}
            variant={timeframe === f.value ? "default" : "outline"}
          >
            <f.icon className="w-4 h-4 mr-2" />
            {f.label}
          </Button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalProcessed.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Gross payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.platformRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Application fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentor Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.mentorPayouts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Paid to mentors</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      {chartData.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📈 Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="processed"
                  stroke="hsl(var(--primary))"
                  name="Total Processed ($)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-1))"
                  name="Platform Revenue ($)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="payouts"
                  stroke="hsl(var(--chart-2))"
                  name="Mentor Payouts ($)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Mentors */}
      {topMentors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🏆 Top Mentors by Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMentors.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {i + 1}
                    </div>
                    <span className="font-medium">{m.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${m.earnings.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">{m.sessions} sessions</div>
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
            <p className="text-center text-muted-foreground">
              No booking data available for the selected timeframe.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

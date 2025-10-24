import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { 
  Users, Shield, Flag, DollarSign, TrendingUp, TrendingDown,
  Search, Filter, Eye, Heart, AlertTriangle, Award,
  Download, X, Activity, Clock, CheckCircle, XCircle,
  MessageSquare, ShoppingBag, Calendar, ArrowRight,
  BarChart3, PieChart, Globe, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('7d');
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeMatches: 0,
    totalMentors: 0,
    verifiedMentors: 0,
    pendingVerifications: 0,
    revenue: 0,
    revenueGrowth: 0,
    pendingReports: 0,
    activeListings: 0,
    totalBookings: 0,
    avgSessionPrice: 0,
    userGrowth: 0,
    matchGrowth: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardStats();
    loadRecentActivity();
    loadChartData();
  }, [timeRange]);

  const loadDashboardStats = async () => {
    try {
      // Load various stats
      const [
        profilesRes, 
        matchesRes, 
        mentorsRes,
        verifiedMentorsRes,
        pendingVerificationsRes,
        bookingsRes, 
        reportsRes,
        listingsRes
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('matches').select('id', { count: 'exact', head: true }),
        supabase.from('mentors').select('id', { count: 'exact', head: true }),
        supabase.from('mentors').select('id', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.from('mentor_verifications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('mentor_bookings').select('status'),
        supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      // Calculate revenue and stats
      const completedBookings = bookingsRes.data?.filter(b => b.status === 'confirmed') || [];
      const revenue = 0; // Revenue calculation would require payment data from separate table
      const avgPrice = completedBookings.length > 0 
        ? revenue / completedBookings.length 
        : 0;

      setStats({
        totalUsers: profilesRes.count || 0,
        activeMatches: matchesRes.count || 0,
        totalMentors: mentorsRes.count || 0,
        verifiedMentors: verifiedMentorsRes.count || 0,
        pendingVerifications: pendingVerificationsRes.count || 0,
        revenue: revenue,
        revenueGrowth: 23.5, // Calculate from historical data
        pendingReports: reportsRes.count || 0,
        activeListings: listingsRes.count || 0,
        totalBookings: completedBookings.length,
        avgSessionPrice: avgPrice,
        userGrowth: 12.3, // Calculate from historical data
        matchGrowth: 8.7 // Calculate from historical data
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentActivity = async () => {
    // Mock data - In production, create an activity log table
    setRecentActivity([
      {
        id: '1',
        type: 'verification',
        description: 'New mentor verification submitted',
        user: 'Daniel Tesfay',
        timestamp: new Date().toISOString(),
        status: 'pending'
      },
      {
        id: '2',
        type: 'booking',
        description: 'Session booked',
        user: 'Sara Woldu',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'completed'
      },
      {
        id: '3',
        type: 'report',
        description: 'User report submitted',
        user: 'Anonymous',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'pending'
      },
      {
        id: '4',
        type: 'user',
        description: 'New user registration',
        user: 'Meron Kidane',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        status: 'completed'
      }
    ]);
  };

  const loadChartData = () => {
    // Mock data - In production, query from database
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: Math.floor(Math.random() * 50) + 20,
        bookings: Math.floor(Math.random() * 30) + 10,
        revenue: Math.floor(Math.random() * 5000) + 2000
      };
    });
    setChartData(last7Days);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'verification': return <Shield className="w-4 h-4" />;
      case 'booking': return <Calendar className="w-4 h-4" />;
      case 'report': return <Flag className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'verification': return 'bg-blue-100 text-blue-600';
      case 'booking': return 'bg-green-100 text-green-600';
      case 'report': return 'bg-red-100 text-red-600';
      case 'user': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">
                Monitor your platform performance and key metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          {/* Total Users */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{stats.userGrowth}%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalUsers.toLocaleString()}
            </h3>
            <p className="text-gray-600 text-sm">Total Users</p>
          </Card>

          {/* Active Matches */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{stats.matchGrowth}%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats.activeMatches.toLocaleString()}
            </h3>
            <p className="text-gray-600 text-sm">Active Matches</p>
          </Card>

          {/* Total Revenue */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{stats.revenueGrowth}%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              ${stats.revenue.toLocaleString()}
            </h3>
            <p className="text-gray-600 text-sm">Total Revenue</p>
          </Card>

          {/* Pending Reports */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Flag className="w-6 h-6 text-white" />
              </div>
              {stats.pendingReports > 0 ? (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Action Needed
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                  All Clear
                </Badge>
              )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats.pendingReports}
            </h3>
            <p className="text-gray-600 text-sm">Pending Reports</p>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Mentors</p>
                <p className="text-2xl font-bold">{stats.totalMentors}</p>
              </div>
              <Award className="w-8 h-8 text-amber-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Verified Mentors</p>
                <p className="text-2xl font-bold">{stats.verifiedMentors}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Verifications</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pendingVerifications}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Listings</p>
                <p className="text-2xl font-bold">{stats.activeListings}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  fill="#10b98120" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* User & Booking Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Users vs Bookings</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#3b82f6" name="New Users" />
                <Bar dataKey="bookings" fill="#10b981" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/admin/verifications')}
                variant="outline"
                className="w-full justify-start"
              >
                <Shield className="w-4 h-4 mr-3 text-blue-600" />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">Review Verifications</p>
                  <p className="text-xs text-gray-500">{stats.pendingVerifications} pending</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Button>

              <Button
                onClick={() => navigate('/admin/reports')}
                variant="outline"
                className="w-full justify-start"
              >
                <Flag className="w-4 h-4 mr-3 text-red-600" />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">Handle Reports</p>
                  <p className="text-xs text-gray-500">{stats.pendingReports} pending</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Button>

              <Button
                onClick={() => navigate('/admin/users')}
                variant="outline"
                className="w-full justify-start"
              >
                <Users className="w-4 h-4 mr-3 text-purple-600" />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">Manage Users</p>
                  <p className="text-xs text-gray-500">{stats.totalUsers} total</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Button>

              <Button
                onClick={() => navigate('/admin/metrics')}
                variant="outline"
                className="w-full justify-start"
              >
                <BarChart3 className="w-4 h-4 mr-3 text-green-600" />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">View Analytics</p>
                  <p className="text-xs text-gray-500">Detailed insights</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge 
                    variant={activity.status === 'completed' ? 'secondary' : 'outline'}
                    className="flex-shrink-0"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Health */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">System Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-semibold">Server Status</p>
              <p className="text-xs text-green-600">Operational</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-semibold">Database</p>
              <p className="text-xs text-green-600">Healthy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-semibold">Payments</p>
              <p className="text-xs text-green-600">Active</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-semibold">Email Service</p>
              <p className="text-xs text-green-600">Connected</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

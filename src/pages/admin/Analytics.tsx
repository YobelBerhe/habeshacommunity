import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { TrendingUp, Users, Heart, MessageSquare, DollarSign } from 'lucide-react';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    totalMatches: 0,
    totalMessages: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get new users this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayOfMonth.toISOString());

      // Get total matches
      const { count: totalMatches } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true });

      // Get total messages
      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Calculate revenue from mentor bookings
      const { data: bookings } = await supabase
        .from('mentor_bookings')
        .select('application_fee_cents')
        .eq('payment_status', 'completed');

      const revenue = bookings?.reduce((sum, b) => sum + (b.application_fee_cents || 0), 0) / 100 || 0;

      setStats({
        totalUsers: totalUsers || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        totalMatches: totalMatches || 0,
        totalMessages: totalMessages || 0,
        revenue
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Detailed platform metrics and insights</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">Loading...</div>
        ) : (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold">Active</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers.toLocaleString()}</h3>
                <p className="text-gray-600 text-sm">Total Users</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+{stats.newUsersThisMonth}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.newUsersThisMonth}</h3>
                <p className="text-gray-600 text-sm">New This Month</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalMatches.toLocaleString()}</h3>
                <p className="text-gray-600 text-sm">Total Matches</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalMessages.toLocaleString()}</h3>
                <p className="text-gray-600 text-sm">Messages Sent</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold">All Time</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">${stats.revenue.toLocaleString()}</h3>
                <p className="text-gray-600 text-sm">Platform Revenue</p>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">User Growth</h3>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-center">User growth chart<br />(Coming soon)</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Match Activity</h3>
                <div className="h-64 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-center">Match activity chart<br />(Coming soon)</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

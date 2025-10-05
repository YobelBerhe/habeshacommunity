import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { 
  Users, Shield, Flag, DollarSign, TrendingUp,
  Search, Filter, Eye, Heart, AlertTriangle,
  Download, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeMatches: 0,
    revenue: 0,
    pendingReports: 0
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Load various stats
      const [profilesRes, matchesRes, bookingsRes, reportsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('matches').select('id', { count: 'exact', head: true }),
        supabase.from('mentor_bookings').select('application_fee_cents').eq('status', 'completed'),
        supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      const revenue = bookingsRes.data?.reduce((sum, b) => sum + (b.application_fee_cents || 0), 0) / 100 || 0;

      setStats({
        totalUsers: profilesRes.count || 0,
        activeMatches: matchesRes.count || 0,
        revenue: revenue,
        pendingReports: reportsRes.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const OverviewContent = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: '+12%', icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'Active Matches', value: stats.activeMatches.toLocaleString(), change: '+8%', icon: Heart, color: 'from-pink-500 to-rose-600' },
          { label: 'Revenue (Total)', value: `$${stats.revenue.toFixed(0)}`, change: '+23%', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
          { label: 'Pending Reports', value: stats.pendingReports.toString(), change: '-5%', icon: Flag, color: 'from-red-500 to-rose-600' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => navigate('/admin/verifications')}
          variant="outline"
          className="h-auto py-6 flex-col items-start space-y-2"
        >
          <Shield className="w-8 h-8 text-amber-600" />
          <div className="text-left">
            <p className="font-bold text-gray-900">Review Verifications</p>
            <p className="text-sm text-gray-600">Process pending requests</p>
          </div>
        </Button>

        <Button
          onClick={() => navigate('/admin/reports')}
          variant="outline"
          className="h-auto py-6 flex-col items-start space-y-2"
        >
          <Flag className="w-8 h-8 text-red-600" />
          <div className="text-left">
            <p className="font-bold text-gray-900">Handle Reports</p>
            <p className="text-sm text-gray-600">{stats.pendingReports} pending</p>
          </div>
        </Button>

        <Button
          onClick={() => navigate('/admin/metrics')}
          variant="outline"
          className="h-auto py-6 flex-col items-start space-y-2"
        >
          <TrendingUp className="w-8 h-8 text-green-600" />
          <div className="text-left">
            <p className="font-bold text-gray-900">View Analytics</p>
            <p className="text-sm text-gray-600">Detailed revenue data</p>
          </div>
        </Button>
      </div>
    </div>
  );

  // User Detail Modal
  const UserDetailModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
            <button 
              onClick={() => setSelectedUser(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Info */}
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-3xl">{selectedUser.name?.[0] || 'U'}</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h4>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor your platform performance and key metrics</p>
        </div>
        <OverviewContent />
        <UserDetailModal />
      </div>
    </AdminLayout>
  );
}

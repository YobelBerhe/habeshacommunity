import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Shield, Flag, DollarSign, TrendingUp, Activity,
  Search, Filter, MoreVertical, Check, X, Eye, Edit,
  MessageSquare, Heart, AlertTriangle, Download,
  UserCheck, UserX, Mail, LogOut, Settings, Loader2,
  Star, MapPin, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type TabType = 'overview' | 'users' | 'verification' | 'reports' | 'content' | 'analytics';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeMatches: 0,
    revenue: 0,
    pendingReports: 0
  });

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roles) {
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      await loadDashboardStats();
    } catch (error) {
      console.error('Error checking admin:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const Sidebar = () => (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Admin Panel</h2>
            <p className="text-xs text-gray-400">HabeshaCommunity</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'overview', icon: TrendingUp, label: 'Overview' },
            { id: 'users', icon: Users, label: 'User Management' },
            { id: 'verification', icon: Shield, label: 'Verification Queue' },
            { id: 'reports', icon: Flag, label: 'Reports & Moderation' },
            { id: 'content', icon: MessageSquare, label: 'Content Moderation' },
            { id: 'analytics', icon: Activity, label: 'Analytics' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 border-t border-gray-800 pt-6 space-y-2">
          <button
            onClick={() => navigate('/admin/metrics')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            <span>Revenue Analytics</span>
          </button>
          <button
            onClick={() => navigate('/admin/verifications')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Shield className="w-5 h-5" />
            <span>Verification Review</span>
          </button>
          <button
            onClick={() => navigate('/account/settings')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/');
          }}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );

  const OverviewTab = () => (
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
          onClick={() => setActiveTab('verification')}
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
          onClick={() => setActiveTab('reports')}
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

  const UsersTab = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
      loadUsers();
    }, []);

    const loadUsers = async () => {
      try {
        let query = supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        const { data } = await query;
        setUsers(data || []);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    const filteredUsers = users.filter(user => {
      const matchesSearch = user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.city?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    return (
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name, email, or location..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>
            <Button
              onClick={loadUsers}
              variant="outline"
              className="border-gray-300"
            >
              <Filter className="w-5 h-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{user.display_name?.[0] || 'U'}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user.display_name || 'User'}</p>
                    <p className="text-sm text-gray-600">{user.city || 'No location'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(user)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Credits:</span>
                  <Badge variant="secondary">{user.credits_balance || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Joined:</span>
                  <span className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600">No users found</p>
          </div>
        )}
      </div>
    );
  };

  const VerificationTab = () => {
    const [verifications, setVerifications] = useState<any[]>([]);

    useEffect(() => {
      loadVerifications();
    }, []);

    const loadVerifications = async () => {
      try {
        const { data } = await supabase
          .from('mentor_verifications')
          .select(`
            *,
            mentors:mentor_id (
              display_name,
              name
            )
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        setVerifications(data || []);
      } catch (error) {
        console.error('Error loading verifications:', error);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Pending Verifications ({verifications.length})
          </h3>
          <Button onClick={() => navigate('/admin/verifications')}>
            View Full Queue
          </Button>
        </div>

        <div className="space-y-4">
          {verifications.slice(0, 5).map((verification) => (
            <div key={verification.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {verification.mentors?.display_name || verification.mentors?.name || 'Unknown'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Submitted {new Date(verification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/admin/verifications')}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg"
                >
                  Review
                </Button>
              </div>
            </div>
          ))}

          {verifications.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No pending verifications</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ReportsTab = () => {
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
      loadReports();
    }, []);

    const loadReports = async () => {
      try {
        const { data } = await supabase
          .from('reports')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(10);

        setReports(data || []);
      } catch (error) {
        console.error('Error loading reports:', error);
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{reports.length}</h3>
            <p className="text-gray-600 text-sm">Pending Reports</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Recent Reports</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-gray-900">{report.reason}</span>
                      <Badge variant="destructive">High</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{report.details}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="default">Review</Button>
                    <Button size="sm" variant="outline">Dismiss</Button>
                  </div>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="p-8 text-center">
                <Flag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No pending reports</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ContentTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Content Moderation</h3>
        <p className="text-gray-600 mb-4">Review user-generated content and messages</p>
        <Button variant="outline">Coming Soon</Button>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Analytics</h3>
        <p className="text-gray-600 mb-4">Detailed platform metrics and insights</p>
        <Button onClick={() => navigate('/admin/metrics')}>
          View Revenue Analytics
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg font-bold">Access Denied</p>
          <p className="text-gray-600">You don't have admin permissions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'verification' && 'Verification Queue'}
            {activeTab === 'reports' && 'Reports & Moderation'}
            {activeTab === 'content' && 'Content Moderation'}
            {activeTab === 'analytics' && 'Analytics'}
          </h1>
          <p className="text-gray-600">
            {activeTab === 'overview' && 'Monitor your platform performance and key metrics'}
            {activeTab === 'users' && 'Manage all registered users and their profiles'}
            {activeTab === 'verification' && 'Review and approve user verification requests'}
            {activeTab === 'reports' && 'Handle user reports and moderate content'}
            {activeTab === 'content' && 'Review and moderate user-generated content'}
            {activeTab === 'analytics' && 'Detailed platform analytics and insights'}
          </p>
        </div>

        {/* Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'verification' && <VerificationTab />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">{selectedUser.display_name?.[0] || 'U'}</span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedUser.display_name || 'User'}</h4>
                  <p className="text-gray-600">{selectedUser.city || 'No location'}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge>Member</Badge>
                    <Badge variant="secondary">{selectedUser.credits_balance || 0} credits</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-700">Joined</p>
                  <p className="text-lg font-bold text-blue-900">
                    {new Date(selectedUser.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-700">Credits Balance</p>
                  <p className="text-lg font-bold text-purple-900">{selectedUser.credits_balance || 0}</p>
                </div>
              </div>

              {selectedUser.bio && (
                <div>
                  <h5 className="font-bold text-gray-900 mb-2">Bio</h5>
                  <p className="text-gray-700">{selectedUser.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

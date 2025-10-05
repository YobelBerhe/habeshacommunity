import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { AlertTriangle, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminReports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    open: 0,
    inReview: 0,
    resolvedToday: 0
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          listing:listings(title),
          reporter:profiles!reports_reporter_id_fkey(display_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReports(data || []);

      // Calculate stats
      const open = data?.filter(r => r.status === 'pending').length || 0;
      const inReview = data?.filter(r => r.status === 'in_review').length || 0;
      const today = new Date().toDateString();
      const resolvedToday = data?.filter(r => 
        r.status === 'resolved' && 
        new Date(r.updated_at).toDateString() === today
      ).length || 0;

      setStats({ open, inReview, resolvedToday });
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Report Updated",
        description: `Report marked as ${status}`,
      });

      loadReports();
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: "Error",
        description: "Failed to update report",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (reason: string) => {
    const highSeverity = ['harassment', 'inappropriate', 'fake'];
    return highSeverity.some(s => reason.toLowerCase().includes(s)) ? 'red' : 'yellow';
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Reports & Moderation</h1>
          <p className="text-gray-600">Handle user reports and moderate content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stats.open}</h3>
            <p className="text-sm text-gray-600">Open Reports</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stats.inReview}</h3>
            <p className="text-sm text-gray-600">In Review</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stats.resolvedToday}</h3>
            <p className="text-sm text-gray-600">Resolved Today</p>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Recent Reports</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : reports.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No reports found</div>
            ) : (
              reports.map((report) => {
                const severity = getSeverityColor(report.reason);
                return (
                  <div key={report.id} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start lg:items-center space-x-3 mb-2">
                          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                            severity === 'red' ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                          <span className="font-bold text-gray-900">{report.reason}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            severity === 'red' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {severity === 'red' ? 'high' : 'medium'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">{report.reporter?.display_name || 'Anonymous'}</span> reported{' '}
                          <span className="font-medium">{report.listing?.title || 'listing'}</span>
                        </p>
                        {report.details && (
                          <p className="text-sm text-gray-500 mt-2">{report.details}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(report.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {report.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleReportAction(report.id, 'in_review')}
                              className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Review
                            </button>
                            <button 
                              onClick={() => handleReportAction(report.id, 'dismissed')}
                              className="flex-1 lg:flex-none px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                        {report.status === 'in_review' && (
                          <>
                            <button 
                              onClick={() => handleReportAction(report.id, 'resolved')}
                              className="flex-1 lg:flex-none flex items-center justify-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Resolve</span>
                            </button>
                            <button 
                              onClick={() => handleReportAction(report.id, 'dismissed')}
                              className="flex-1 lg:flex-none flex items-center justify-center space-x-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Dismiss</span>
                            </button>
                          </>
                        )}
                        {(report.status === 'resolved' || report.status === 'dismissed') && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {report.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

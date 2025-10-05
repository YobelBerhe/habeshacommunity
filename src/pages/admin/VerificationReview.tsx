import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Check, X, Flag, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function VerificationReview() {
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkAdminAndLoadVerifications();
  }, []);

  const checkAdminAndLoadVerifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is admin
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
        return;
      }

      setIsAdmin(true);
      await loadVerifications();
    } catch (error) {
      console.error('Error checking admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('mentor_verifications')
        .select(`
          *,
          mentors:mentor_id (
            id,
            display_name,
            name,
            bio,
            expertise,
            is_verified
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error loading verifications:', error);
      toast({
        title: "Failed to load verifications",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleReview = async (verificationId: string, status: 'approved' | 'rejected', mentorId: string) => {
    setProcessing(true);
    try {
      // Update verification status
      const { error: verificationError } = await supabase
        .from('mentor_verifications')
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', verificationId);

      if (verificationError) throw verificationError;

      // If approved, update mentor is_verified flag
      if (status === 'approved') {
        const { error: mentorError } = await supabase
          .from('mentors')
          .update({ is_verified: true })
          .eq('id', mentorId);

        if (mentorError) throw mentorError;
      }

      toast({
        title: status === 'approved' ? "Mentor Verified!" : "Verification Rejected",
        description: status === 'approved' 
          ? "The mentor is now verified and can receive bookings."
          : "The mentor has been notified of the decision.",
      });

      setSelectedVerification(null);
      setAdminNotes('');
      await loadVerifications();
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
            <p className="text-gray-600">Access denied. Admin only.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const pendingVerifications = verifications.filter(v => v.status === 'pending');

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <h3 className="text-xl font-bold text-gray-900">
              Pending Verifications ({pendingVerifications.length})
            </h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-sm">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Priority</option>
              </select>
            </div>
          </div>

          {verifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No verification requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {verifications.map((verification) => {
                const mentor = verification.mentors as any;
                const timeAgo = (() => {
                  const diff = Date.now() - new Date(verification.created_at).getTime();
                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  const days = Math.floor(hours / 24);
                  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
                  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
                  return 'Just now';
                })();

                const getPriority = () => {
                  const diff = Date.now() - new Date(verification.created_at).getTime();
                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  if (hours < 24) return 'high';
                  if (hours < 72) return 'medium';
                  return 'low';
                };

                const priority = getPriority();

                return (
                  <div 
                    key={verification.id} 
                    className="border-2 border-gray-200 rounded-xl p-4 lg:p-6 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg lg:text-xl">
                            {(mentor?.display_name || mentor?.name)?.[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{mentor?.display_name || mentor?.name}</h4>
                          <p className="text-sm text-gray-600">
                            {verification.status === 'pending' ? 'ID Verification' : 
                             verification.status === 'approved' ? 'Approved' : 'Rejected'}
                          </p>
                          <p className="text-xs text-gray-500">Submitted {timeAgo}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start lg:self-auto ${
                        verification.status === 'approved' ? 'bg-green-100 text-green-700' :
                        verification.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        priority === 'high' ? 'bg-red-100 text-red-700' :
                        priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {verification.status === 'pending' ? `${priority} priority` : verification.status}
                      </span>
                    </div>

                    {verification.bio_statement && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Bio Statement:</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{verification.bio_statement}</p>
                      </div>
                    )}

                    {verification.documents_url?.length > 0 && (
                      <div className="bg-gray-100 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-700 mb-2">Document Preview:</p>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          {verification.documents_url.map((url: string, idx: number) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline block mb-1"
                            >
                              📄 Document {idx + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {verification.social_links?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Social Links:</p>
                        <div className="space-y-1">
                          {verification.social_links.map((link: string, idx: number) => (
                            <a
                              key={idx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline block"
                            >
                              🔗 {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {verification.admin_notes && (
                      <div className="bg-amber-50 rounded-lg p-3 mb-4 border border-amber-200">
                        <p className="text-sm font-medium text-amber-900 mb-1">Admin Notes:</p>
                        <p className="text-sm text-amber-800">{verification.admin_notes}</p>
                      </div>
                    )}

                    {verification.status === 'pending' && (
                      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedVerification({ ...verification, action: 'approve' });
                            setAdminNotes('');
                          }}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                          <Check className="w-5 h-5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVerification({ ...verification, action: 'reject' });
                            setAdminNotes('');
                          }}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                          <X className="w-5 h-5" />
                          <span>Reject</span>
                        </button>
                        <button className="px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors lg:w-auto">
                          <Flag className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedVerification?.action === 'approve' ? 'Approve Verification' : 'Reject Verification'}
              </DialogTitle>
              <DialogDescription>
                Add optional notes for the mentor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Add notes for the mentor (optional)..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <button
                onClick={() => setSelectedVerification(null)}
                disabled={processing}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedVerification) {
                    handleReview(
                      selectedVerification.id,
                      selectedVerification.action === 'approve' ? 'approved' : 'rejected',
                      selectedVerification.mentor_id
                    );
                  }
                }}
                disabled={processing}
                className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center space-x-2 ${
                  selectedVerification?.action === 'approve'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg'
                }`}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {selectedVerification?.action === 'approve' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>{selectedVerification?.action === 'approve' ? 'Approve' : 'Reject'}</span>
                  </>
                )}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

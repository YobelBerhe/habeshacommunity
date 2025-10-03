import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { VerificationBadge } from '@/components/VerificationBadge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Access denied. Admin only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mentor Verification Review</h1>
        <p className="text-muted-foreground">Review and approve mentor verification requests</p>
      </div>

      <div className="grid gap-4">
        {verifications.map((verification) => {
          const mentor = verification.mentors as any;
          return (
            <Card key={verification.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {mentor?.display_name || mentor?.name}
                      <VerificationBadge 
                        isVerified={mentor?.is_verified || false}
                        status={verification.status}
                      />
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submitted: {new Date(verification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={
                    verification.status === 'approved' ? 'default' :
                    verification.status === 'rejected' ? 'destructive' :
                    'secondary'
                  }>
                    {verification.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Bio Statement:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {verification.bio_statement}
                  </p>
                </div>

                {verification.social_links?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Social Links:</h4>
                    <div className="space-y-1">
                      {verification.social_links.map((link: string, idx: number) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {verification.documents_url?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Documents:</h4>
                    <div className="space-y-1">
                      {verification.documents_url.map((url: string, idx: number) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Document {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {verification.admin_notes && (
                  <div className="p-3 bg-muted rounded-md">
                    <h4 className="font-medium mb-1 text-sm">Admin Notes:</h4>
                    <p className="text-sm text-muted-foreground">{verification.admin_notes}</p>
                  </div>
                )}

                {verification.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => {
                        setSelectedVerification(verification);
                        setAdminNotes('');
                      }}
                      variant="default"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedVerification(verification);
                        setAdminNotes('');
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {verifications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No verification requests yet</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Verification</DialogTitle>
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedVerification(null)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => handleReview(
                selectedVerification.id,
                'approved',
                selectedVerification.mentor_id
              )}
              disabled={processing}
            >
              {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleReview(
                selectedVerification.id,
                'rejected',
                selectedVerification.mentor_id
              )}
              disabled={processing}
            >
              {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
